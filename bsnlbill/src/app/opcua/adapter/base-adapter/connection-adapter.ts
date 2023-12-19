/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Connector } from '../../opcnodes/connector';
import { DeviceAuthentication, DeviceAuthenticationStatus, ErrorTypeList, HTTPStatus, NotificationType, ResponseStatusCode } from '../../../enum/enum';
import { ConnectionStatus, ConnectionResponsePayload } from '../../../models/connection.interface';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { TranslateService } from '@ngx-translate/core';
import { OPCNode } from '../../opcnodes/opcnode';

interface IConnectionAdapter {
  establishConnection(connectionResultList: Array<ConnectionResponsePayload>);
  executeConnectCall(connection: Connector);
  deleteConnectionFromServer(connector: Connector);
}

export abstract class ConnectionAdapter implements IConnectionAdapter {

  protected readonly facadeService: FacadeService;
  protected translate: TranslateService;
  //#region Connection Adapter Methods
  okButtonString = 'common.buttons.ok';
  abstract establishConnection(connectionResultList: Array<ConnectionResponsePayload>);
  abstract executeConnectCall(connection: Connector);
  abstract deleteConnectionFromServer(connector: Connector);

  //#endregion
  /*
  *
  * Function to set the connection status after establish connection
  */
  protected setConnectionStatusDialogue(connectionsResult: Array<ConnectionResponsePayload>) {
    if (connectionsResult && connectionsResult.length > 0) {
      const status: ConnectionStatus = this.getConnectionStatusData(connectionsResult);
      if (status.noOfFailedConnections === status.totalConnections) {
        this.setErrorDialogueForAllFailed(status, connectionsResult);
      }
      else if (status.noOfFailedConnections !== undefined && status.noOfFailedConnections > 0) {
        this.setPartialSuccessDialogue(status,connectionsResult);
      }
      else {
        this.setErrorDialogue(status);
      }
    }
  }
  /*
  *
  * If all the connections fail during establish connection
  */
  private setErrorDialogueForAllFailed(status: ConnectionStatus, connectionsResult: Array<ConnectionResponsePayload>) {
    const success = status.totalConnections - status.noOfFailedConnections;
    this.facadeService.overlayService.error({
      header: this.facadeService.translateService.instant('overlay.error.establishConnectionFailed.header'),
      message: {
        title: this.facadeService.translateService.instant('overlay.error.establishConnectionFailed.message.title'),
        content: [this.facadeService.translateService.instant('overlay.error.establishConnectionFailed.message.content',
        { success: success, totalConnections: status.totalConnections })]
      },
      successLabel: this.facadeService.translateService.instant(this.okButtonString),
      acceptCallBack: (btn => {
        this.acceptCallBackForErrorDialogue(connectionsResult,btn)
      })
    });
    this.facadeService.commonService.setErrorIcon(true, true);
    /**
     * Updating the change method for each change in the error count status
     * */
    this.facadeService.commonService.changeErrorCountStatus('EXECUTION_ERROR');
  }
  //#region Connection Adapter helper private methods
  /*
  *
  *Function generates the error notification
  */
  private generateNotification(connectionResult, errorObj) {
    const nodes = this.facadeService.editorService.liveLinkEditor.editorNodes as unknown as OPCNode[];
    const device = nodes.filter(node => node.deviceId === connectionResult.deviceId)[0];
    const message = { content: `notification.error.${errorObj.errorCode}`, params: { deviceName: device.deviceName, deviceAddress: connectionResult.deviceAddress } };
    this.facadeService.notificationService.pushNotificationToPopup(message, NotificationType.ERROR, HTTPStatus.SUCCESS);
  }
  /*
  *
  *If Establish connection passes for all the connections
  */
  private setErrorDialogue(status: ConnectionStatus) {
    const success = status.totalConnections - status.noOfFailedConnections;
    this.facadeService.overlayService.success({
      header: this.facadeService.translateService.instant('overlay.success.establishConnectionSuccess.header'),
      message: {
        title: this.facadeService.translateService.instant('overlay.success.establishConnectionSuccess.message.title'),
        content: [this.facadeService.translateService.instant('overlay.success.establishConnectionSuccess.message.content', { success: success })]
      },
      successLabel: this.facadeService.translateService.instant(this.okButtonString)
    });
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }
  /*
  * If establish connection passes only for few connections
  *
  */
  private setPartialSuccessDialogue(status: ConnectionStatus,connectionsResult: Array<ConnectionResponsePayload>) {
    this.facadeService.overlayService.warning({
      header: this.facadeService.translateService.instant('overlay.warning.establishConnectionFailed.header'),
      message: {
        title: this.facadeService.translateService.instant('overlay.warning.establishConnectionFailed.message.title'),
        content: [this.facadeService.translateService.instant('overlay.warning.establishConnectionFailed.message.content',
          { noOfSuccessfullConnections: status.noOfSuccessfullConnections, totalConnections: status.totalConnections })]
      },
      successLabel: this.facadeService.translateService.instant(this.okButtonString),
      acceptCallBack: (btn => {
        this.facadeService.commonService.viewErrorBtn = btn;
        const errorResopnse = connectionsResult.filter(res => res.status !== 'SUCCESS');
        this.acceptCallBackForErrorDialogue(errorResopnse,btn)
      })
    });
    this.facadeService.commonService.setErrorIcon(true, true);
    /**
     * Updating the change method for each change in the error count status
     * */
    this.facadeService.commonService.changeErrorCountStatus('EXECUTION_ERROR');
  }

  /*
  *
  *Function returns how many connections were successfully established
  */
  private getConnectionStatusData(connectionResultList: Array<ConnectionResponsePayload>): ConnectionStatus {
    const totalConnections = connectionResultList.length;
    const noOfFailedConnections = connectionResultList.filter(res => res && res.status !== ResponseStatusCode.SuccessCon)?.length;
    const noOfSuccessfullConnections = totalConnections - noOfFailedConnections;
    return { totalConnections, noOfFailedConnections, noOfSuccessfullConnections };
  }
  //#endregion

  acceptCallBackForErrorDialogue(connectionsResult:Array<ConnectionResponsePayload>,btn){
    this.facadeService.commonService.viewErrorBtn = btn;
    /*open view error popup at end after all other events in loop
    */
    for (const connectionResult of connectionsResult) {
      /* If server device authentication fails
      */
      if (connectionResult.error.error.errorType === ResponseStatusCode.Establish_Connection_Server_Device_AUTHENTICATION_FAILURE) {
        this.facadeService.commonService.setShowProjectProtectionModel(true);
        this.facadeService.commonService.showAuthenticationPopupState({
          device: connectionResult.error.data.server,
          title: DeviceAuthentication.ESTABLISH_CONNECTION,
          multipleDevices: false
        });

      }
      /* If client device authentication fails
      */
      if (connectionResult.error.error.errorType === ResponseStatusCode.Establish_Connection_Client_Device_AUTHENTICATION_FAILURE) {
        this.facadeService.commonService.setShowProjectProtectionModel(true);
        this.facadeService.commonService.showAuthenticationPopupState({
          device: connectionResult.error.data.client,
          title: DeviceAuthentication.ESTABLISH_CONNECTION,
          multipleDevices: false
        });
      }
      /* If both(client& server) device authentication fails
      */
      if (connectionResult.error.error.errorType === ResponseStatusCode.Establish_Connection_BOTH_Device_AUTHENTICATION_FAILURE) {
        connectionResult.error.data.client['status'] = DeviceAuthenticationStatus.PENDING;
        connectionResult.error.data.server['status'] = DeviceAuthenticationStatus.PENDING;
        this.facadeService.commonService.deviceAuthenticationFailedList.push(connectionResult.error.data.client);
        this.facadeService.commonService.deviceAuthenticationFailedList.push(connectionResult.error.data.server);
        this.facadeService.commonService.setShowProjectProtectionModel(true);
        this.facadeService.commonService.showAuthenticationPopupState({
          device: this.facadeService.commonService.deviceAuthenticationFailedList[0],
          title: DeviceAuthentication.ESTABLISH_CONNECTION,
          multipleDevices: true
        });
      }
      /* If address model of device is wrong
      */
      if (connectionResult.error.error.errorType === ResponseStatusCode.Invalid_Address_Model) {
        if (connectionResult.error.data.client.deviceId !== null) {
          this.generateNotification(connectionResult.error.data.client, connectionResult.error.error);
        }
        if (connectionResult.error.data.server.deviceId !== null) {
          this.generateNotification(connectionResult.error.data.server, connectionResult.error.error);
        }
      }
    }
  }
}





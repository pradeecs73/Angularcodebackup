/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ConnectorState, HTTPStatus, NotificationType } from '../../../enum/enum';
import { ConnectionRequestPayload, ConnectionResponsePayload } from '../../../models/connection.interface';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { getConnectionData } from '../../../utility/utility';
import { Connector } from '../../opcnodes/connector';
import { NodeAnchor } from '../../opcnodes/node-anchor';
import { ConnectionAdapter } from '../base-adapter/connection-adapter';
import { ServiceInjector } from '../service-injector.module';

@Injectable({
  providedIn: 'root'
})

export class ClientServerConnection extends ConnectionAdapter {

  protected readonly facadeService = ServiceInjector.get(FacadeService);
  protected translate = ServiceInjector.get(TranslateService);


/**
 * region Client Server Connection Adapter Methods
 * @param connection
 * @returns
 */
  executeConnectCall(connection: Connector): Observable<Object> {
    const projectId = this.facadeService.dataService.getProjectId();
    const param: ConnectionRequestPayload = getConnectionData(connection, projectId);
    const $connectCallObs = this.facadeService.apiService.connectToOpc(param);
    if (this.checkConnectionExist(connection.inputAnchor)) {
      if (this.isSameConnection(param.server.deviceId, connection.inputAnchor?.relatedEndPoint?.address)) {
        return of('');
      } else {
        return $connectCallObs;
      }
    } else {
      return $connectCallObs;
    }
  }


  /**
   * Establish connection
   * @param connectionResultList
   */
  establishConnection(connectionResultList: Array<ConnectionResponsePayload>) {
    for (const connectionResult of connectionResultList) {
      if(connectionResult.error){
        this.updateDeviceState(connectionResult.error);
      }
      else{
        this.updateDeviceState(connectionResult);
      }
    }
    this.setConnectionStatusDialogue(connectionResultList);
  }

  /*
  *
  *Function to delete connection from server
  *
  */
  deleteConnectionFromServer(connector: Connector) {
    const param: ConnectionRequestPayload = getConnectionData(connector,this.facadeService.dataService.getProjectId());
    if (connector.state === ConnectorState.Success || connector.state === ConnectorState.Online) {
      this.facadeService.apiService.deleteOpcConnection(param).subscribe();
      const serverDeviceName = this.facadeService.dataService.getDevice(param.server.deviceId).name;
      const clientDeviceName = this.facadeService.dataService.getDevice(param.client.deviceId).name;
      const msg = {key : 'notification.info.connectionLineRemoved',params :{
        serverDeviceName:serverDeviceName,
        serverInterface:param.server.interface,
        clientDeviceName:clientDeviceName,
        clientInterface:param.client.interface}};
      this.facadeService.notificationService.pushNotificationToPopup({content :msg.key ,params:msg.params},NotificationType.INFO,HTTPStatus.SUCCESS);
    }
  }
  /*
  *endregion
  */

 /*
  *region Client Server Connection Adapter helper methods
  */
  private updateDeviceState(connectionResult: ConnectionResponsePayload) {
    if (connectionResult && connectionResult.data && (connectionResult.data.client || connectionResult.data.server)) {
      this.facadeService.dataService.updateDeviceState(connectionResult.data.client.deviceId, connectionResult.data.client.status);
      this.facadeService.dataService.updateDeviceState(connectionResult.data.server.deviceId, connectionResult.data.server.status);
      this.facadeService.deviceStoreService.fetchDeviceTreeNodes();
    }
  }

  private checkConnectionExist(inputAnchor: NodeAnchor) {
    return inputAnchor && inputAnchor.connectionStatus && inputAnchor?.relatedEndPoint?.address !== '';
  }
 /*
  * current device id is on server interface, prev on input anchor
  */
  private isSameConnection(_currentPartnerDeviceId, _prevPartnerDeviceId) {
    return false;
  }
 /*
  *endregion
  */
}

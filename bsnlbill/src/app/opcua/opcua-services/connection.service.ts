/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injectable, Injector } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { Connector } from '../opcnodes/connector';
import { isEmpty, getRelatedEndPointData, isNullOrEmpty } from '../../utility/utility';
import { HTMLNodeConnector } from '../../models/models';
import {
  AdapterMethods, ConnectionAttributes, ConnectorCreationMode,
  EstablishConnectionMenus, FillingLineNodeType, HTTPStatus,
  NotificationType, SubConnectorCreationMode
} from '../../enum/enum';
import { ConnectionAdapter } from '../adapter/base-adapter/connection-adapter';
import { DataAdapterManagers } from '../adapter/adapter-manager';
import { AreaClientInterface } from '../../models/targetmodel.interface';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { Connection } from 'src/app/models/connection.interface';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private connectionAdapterService: ConnectionAdapter;

  constructor(
    private readonly injector: Injector,
    private readonly facadeService: FacadeService

  ) { }
  /*
  * Delete connection from project
  *
  */
  deleteOfflineConnection(connector: Connector) {
    //if deleted offline , they will be available in online from this list
    //this.common.offlineDeletedConnections.push(con);
    // causes issue when not removed after delete; there is a check when proposing connection
    //this.common.manualConnectionList = this.common.manualConnectionList.filter(item => item !== obj);
    this.facadeService.connectorService.remove(connector);
  }
  /*
  *
  * delete connection from server(projectdataservice)
  */
  deleteConnectionFromServer(connector: Connector) {
    if (connector && connector.inputAnchor && !isNullOrEmpty(connector.inputAnchor.deviceId)) {
      const adapterType = this.facadeService.dataService.getAdapterType(connector.inputAnchor.deviceId);
      const connectionAdapterService: ConnectionAdapter
        = this.injector.get(DataAdapterManagers.getadapter(adapterType, AdapterMethods.CONNECTION));
      connectionAdapterService.deleteConnectionFromServer(connector);
      this.updateEndpointDataAndconnectionState(connector);
    }
  }

  /**
   * After deleting the online connection, will update the endpoint address with null
   * connection line make as transparent
   * @param connector 
   */

  updateEndpointDataAndconnectionState(connector: Connector) {
    const relatedEndPoint = getRelatedEndPointData('', '', '');
    connector.updateConnectionEndPointStatus(false, relatedEndPoint);
    let acId = connector.inputAnchor.parentNode.id;
    if (connector.inputAnchor.parentNode.type === FillingLineNodeType.AREA) {
      acId = (connector.inputAnchor.interfaceData as AreaClientInterface).automationComponentId;
    }
    this.facadeService.dataService.updateConnectionEndPointDetails(false, ConnectionAttributes.DIAGNOSE, connector.inputDeviceId, acId, connector.inputAnchor.interfaceData.id);
    this.facadeService.dataService.updateConnectionEndPointDetails(
      relatedEndPoint.address,
      ConnectionAttributes.PARTNER,
      connector.inputDeviceId,
      acId, connector.inputAnchor.interfaceData.id);
    connector.updateConnectorStateinOnline();
    connector.setOnlineStyle();
    this.updateSubconAfterDeleteConFromServer(connector);
    /** only for orange dotted line, we're deleting from connector pool.
     * For handling area, subconnection and exposed interfaces scenario
    */
    if (connector.creationMode === ConnectorCreationMode.ONLINE) {
      this.facadeService.dataService.deleteConnection({ id: connector.id } as Connection);
      this.facadeService.editorService.removeFromConnectorPool(connector.id);
      this.facadeService.connectorService.remove(connector);
      this.facadeService.editorService.setSelectedConnection(null);
    }
  }

  /*
  * Delete sub connection from server(projectdataservice)
  */
  updateSubconAfterDeleteConFromServer(connector){
    if (connector.hasSubConnections) {
      connector.subConnectors.serverIds = connector.subConnectors.serverIds || [];
      const connectorIds = connector.subConnectors.serverIds.concat(connector.subConnectors.clientIds);
      this.removeExposedSubConnection(connectorIds);
    }
  }

  removeExposedSubConnection(connectorIds) {
    connectorIds.forEach(id => {
      const subconnection = this.facadeService.dataService.getSubConnection(id);
      if (subconnection) {

        this.facadeService.drawService.removeOnlineExposedInterfacesAndSubConnections(subconnection);
        subconnection.connectionId = '';
        if (subconnection.creationMode === SubConnectorCreationMode.MANUALONLINE) {
          subconnection.creationMode = SubConnectorCreationMode.MANUAL;
          this.facadeService.dataService.updateAreaInterfaceExposedMode(subconnection.areaId, subconnection.id, subconnection.isclient, SubConnectorCreationMode.MANUAL);
        }
        this.addOrUpdateSubConnector(id);
      }

    });
  }
  /*
  *
  * Function to add or update the subconnector based on creation mode
  */
  addOrUpdateSubConnector(id:string){
    const subConnector = this.facadeService.editorService.getExistingSubConnectorById(id);
    if (subConnector) {
      subConnector.connectionId = '';
      if (subConnector.creationMode === SubConnectorCreationMode.MANUALONLINE) {
        subConnector.creationMode = SubConnectorCreationMode.MANUAL;
      }
      this.facadeService.editorService.addOrUpdateToSubConnectorLookup(subConnector);
    }
  }
  /*
  *
  * Establish connection
  */
  async establishConnection() {
    this.facadeService.notificationService.notificationList = [];
    const connectorLookup = this.getConnectors();
    /*
    *
    * If the editor doesn't have any device return
    */
    if (isEmpty(connectorLookup) || this.facadeService.commonService.editorHasNoDevice) {
      return;
    }
    else {
      this.setConnectionDialogue();
      const connectionData = await this.createEstablishConnectionsPayload(connectorLookup as HTMLNodeConnector);
      this.makeConnections(connectionData);
    }
  }
  /*
  *
  * returns the connector from editor service
  */
  getConnectors() {
    if (this.facadeService.editorService.establishConnectionType === EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION) {
      return Object.fromEntries(Array.from(this.facadeService.editorService.multiSelectedConnectorMap));
    }
      return this.facadeService.editorService.liveLinkEditor.connectorLookup;
  }
  /*
  *
  * create establish connection payload
  */
  private async createEstablishConnectionsPayload(connectors: HTMLNodeConnector) {
    const result = { exeCallList: [] };
    /*
    * executes connect call for all connections
    */
    for (const key in connectors) {
      if (connectors.hasOwnProperty(key)) {
        const connector: Connector = connectors[key];
        if (connector.inputAnchor && !isNullOrEmpty(connector.inputAnchor.deviceId)) {
          const adapterType = this.facadeService.dataService.getAdapterType(connector.inputAnchor.deviceId);
          this.connectionAdapterService = this.injector.get(DataAdapterManagers.getadapter(adapterType, AdapterMethods.CONNECTION));
          result.exeCallList.push(this.connectionAdapterService.executeConnectCall(connector));
        }
      }
    }
    /*
    *checks the status of connection and turns it green
    */
    return result;
  }
  /*
  *
  * Make connections
  */
  private async makeConnections(connectionData: { exeCallList: Array<Observable<Object>> }) {
    const connectionResult = [];
    if (connectionData && connectionData.exeCallList && connectionData.exeCallList.length > 0) {
      forkJoin(connectionData.exeCallList).subscribe(conResult => {
        connectionResult.push(...conResult);
        this.connectionAdapterService.establishConnection(connectionResult);
        connectionResult.forEach(response => {
          let msg, type, code;
          if (response.status === 'SUCCESS') {
            msg ={ key :'notification.info.establishConnectionSuccess',
            params : {
              clientAC :response.data.client['automationComponent'],
              clientInterface:response.data.client['interfaceType'] ,
              serverAC: response.data.server['automationComponent'],
              serverInterface : response.data.server['interfaceType']
            }};
            type = NotificationType.INFO;
            code = HTTPStatus.SUCCESS;
            this.facadeService.notificationService.pushNotificationToPopup({content : msg.key,params:msg.params}, type, code);
          }
        });
      });
    }
    else {
      this.facadeService.overlayService.changeOverlayState(false);
      this.connectionAdapterService.establishConnection(connectionResult);
    }
  }


  /*
  * Loader to show that connections are getting established
  *
  */
  private setConnectionDialogue() {
    this.facadeService.overlayService.loader({
      header: this.facadeService.translateService.instant('overlay.loader.establishConnection.header'),
      message: {
        title: this.facadeService.translateService.instant('overlay.loader.establishConnection.message.title'),
        content: [this.facadeService.translateService.instant('overlay.loader.establishConnection.message.content')]
      }
    });
    this.facadeService.overlayService.changeOverlayState(true);
  }


}

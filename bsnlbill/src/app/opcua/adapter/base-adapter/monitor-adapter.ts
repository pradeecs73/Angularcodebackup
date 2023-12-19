/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { AreaHierarchy } from '../../../models/area.interface';
import { ConnectionAttributes,
  DeviceState,
  MONITORTYPE,
  FillingLineNodeType,
  ConnectorType,
  ErrorTypeList,
  NotificationType,
  ConnectorCreationMode,
  ResponseStatusCode,
  DeviceAuthentication,
  DeviceAuthenticationStatus,
  HTTPStatus,
  SubConnectorCreationMode,
  StrategyOperations
} from '../../../enum/enum';
import { Connection, ConnectionData, MatchingConnectionInterface, SubConnection } from '../../../models/connection.interface';
import { ApiResponse, Node } from '../../../models/models';
import { CreateConnectionPayload, MonitorDataParam, MonitorNode, MonitorObservable, MonitorPayload, TreeData } from '../../../models/monitor.interface';
import { ClientInterface, Device, RelatedEndPointInterface } from '../../../models/targetmodel.interface';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { SocketService } from '../../../services/socket.service';
import { FillingArea, FillingNode } from '../../../store/filling-line/filling-line.reducer';
import { findConnectionInAndOut, getConnectData, getConnectDataFromSubConnector, getConnectionEventName,
  getConnectionMonitorKey, getDeviceInterfaceName, getEventNamesFromMonitorMaps, getRelatedEndPointData, isNullOrEmpty,
  isNullOrUnDefined,log
} from '../../../utility/utility';
import { BaseConnector } from '../../opcnodes/baseConnector';
import { Connector } from '../../opcnodes/connector';
import { HTMLNode } from '../../opcnodes/htmlNode';
import { NodeAnchor } from '../../opcnodes/node-anchor';
import { OPCNode } from '../../opcnodes/opcnode';
import { ServiceInjector } from '../service-injector.module';
import { TranslateService } from '@ngx-translate/core';
import { SubConnector } from '../../opcnodes/subConnector';

interface IMonitorAdapter {
  goOnline();
  goOffline();
  monitorTags(monitoPayload: MonitorPayload);
}

interface IMonitorHelpers {
  setTagMonitorItems(deviceId: string, automationComponent: string, interfaceId: string, interfaceName: string, monitorList: Array<MonitorNode>, type: MONITORTYPE);
  getTagMonitorItems(deviceId: string, automationComponent: string, interfaceId: string);
  setTagObservable(deviceId: string, automationComponent: string, interfaceId: string, eventName: string);
  setTagChangeListener(deviceId: string, automationComponent: string, interfaceId: string, eventName: string);
  setTagValueFromMonitor(eventName: string, value, treeData: TreeData[]);
}

export abstract class MonitorAdapter implements IMonitorAdapter, IMonitorHelpers {
  monitorItems: MonitorPayload;
  prevMonitorItems: { deviceId: string, interfaceId: string, nodeList: Array<MonitorNode> };
  goOnlinePromise: Array<Promise<string>>;

  /*
  *Map of MonitorPayload per connection event
   Map Key - connection event
   Value - Payload for Server Monitor Call
   *
  */
  private readonly conenctionMonitorItemsMap: Map<string, MonitorPayload> = new Map<string, MonitorPayload>();
  /*Ids added to prevent the duplicate calls for Area switching in Online Mode*/
  private readonly tagMonitorItemsOnlineMap: Map<string, MonitorPayload> = new Map<string, MonitorPayload>();
  /*Map of MonitorPayload per Device and Interface Combination
  Map Key - DeviceId.InterfaceId
  Value - Payload for Server Monitor Call
   */
  private readonly tagMonitorItemsMap: Map<string, MonitorPayload> = new Map<string, MonitorPayload>();
  /*Map of Attributes List per Device and AutomationComponent and Interface Combination
   Outer Map Key - DeviceId.AutomationComponent.InterfaceId
   Value - Map of Attributes and corresponding Observable List(Inner Map)
   Inner Map Key - Attribute Event
   Value - Observable of the event
  */
  tagMonitorObseravablesMap: Map<string, Map<string, MonitorObservable>> = new Map<string, Map<string, MonitorObservable>>();

  private readonly _connectionMonitorMap$ = new Map<string, TreeData[]>();
  private readonly _connectionServerDiagnosticMonitorMap$ = new Map<string, TreeData[]>();
  protected  facadeService = ServiceInjector.get(FacadeService);
  private readonly socket = ServiceInjector.get(SocketService);
  protected  translate = ServiceInjector.get(TranslateService);

  constructor() {
    this.monitorItems = {
      project: this.facadeService.dataService.getProjectId(),
      deviceId: '',
      interfaceName: '',
      automationComponent: '',
      nodeList: [],
      type: MONITORTYPE.NONE
    };
  }

  abstract setTagValueFromMonitor(eventName: string, value, treeData: TreeData[]);
  abstract getServerDiagnosticData(connector: BaseConnector);

  //#region Go Online/Offline functionality


  /**
   * Shows loader,makes go online server call and upon success make multiple monitor server calls
   */
  goOnline(): void {
    this.facadeService.notificationService.notificationList = [];
    const projectId = this.facadeService.dataService.getProjectId();

    const deviceList = (this.facadeService.editorService.liveLinkEditor.editorNodes.filter(node => node.type === FillingLineNodeType.NODE) as Array<OPCNode>
    ).map(node => node.deviceId);
    if (deviceList && deviceList.length > 0) {
      this.showGoOnlineLoader();
      this.facadeService.apiService.goOnline({ project: projectId, deviceList })
        .subscribe(
          async (result: ApiResponse) => {
            this.goOnlineCallback(result.data.deviceList, false);
            this.facadeService.notificationService.pushNotificationToPopup(
              { content: 'notification.info.monitorConnectionsSuccessful', params: {} },
              NotificationType.INFO,
              result.data.status);
            this.generateNotification(result);
            this.facadeService.commonService.setErrorIcon(true, true);
            this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
          },
          async (error: HttpErrorResponse) => {
            /*
            * If device authentication expires for protected devices while going online
            */
            if (error.error.error.errorType === ResponseStatusCode.GO_ONLINE_Device_AUTHENTICATION_FAILURE) {
              /*
              *Don't switch to online mode if there is an error
              */
              this.offlineState();
              this.facadeService.overlayService.clearOverlayData();
              error.error.data.UnAuthorizedDevices.forEach(device => device['status'] = DeviceAuthenticationStatus.PENDING);
              this.facadeService.commonService.deviceAuthenticationFailedList = error.error.data.UnAuthorizedDevices;
              let multipleDevices;
              if (error.error.data.UnAuthorizedDevices.length > 1) {
                multipleDevices = true;
              } else {
                multipleDevices = false;
              }
              this.facadeService.commonService.setShowProjectProtectionModel(true);
              this.facadeService.commonService.showAuthenticationPopupState({
                device: error.error.data.UnAuthorizedDevices[0],
                title: DeviceAuthentication.GO_ONLINE,
                multipleDevices: multipleDevices
              });
            } else if (error.error.error.errorType === ResponseStatusCode.Invalid_Address_Model) {
               /*
            * If device has an invalid address model while going online dont switch to online mode
            */
              this.facadeService.overlayService.clearOverlayData();
              this.facadeService.overlayService.error({
                header: this.facadeService.translateService.instant('messageService.error.failed.goOnlineFailed'),
                message: {
                  content: [this.facadeService.translateService.instant('overlay.error.invalidAddressModel')]
                },
                successLabel: this.facadeService.translateService.instant('common.buttons.ok')
              });
              this.offlineState();
              error.error.data.inValidAddressModelDevices.forEach(device => {
                const message = { content: `notification.error.${error.error.error.errorCode}`, params: { deviceName: device.name, deviceAddress: device.address } };
                this.facadeService.notificationService.pushNotificationToPopup(message, NotificationType.ERROR, HTTPStatus.SUCCESS);
              });
            } else {
              this.commonError(error);
            }
          });
    }
    else {
       /*
      * when there are no devices but areas are there while going online
      */
      this.handleDataMonitoring();
      this.subscribeToConnectionLost();
      this.subscribeToConnectionReconnect();
    }
  }
   /*
    * common error
    */
  commonError(error:HttpErrorResponse) {
    if(error.error.data) {
      this.goOnlineCallback(error.error.data?.deviceList, true);
    }else {
      this.offlineState();
    this.facadeService.overlayService.clearOverlayData();
    }
  }

   /*
  * notification message for online that connections are ready
  */
  generateNotification(result :ApiResponse){
    result.data.deviceList.forEach(device => {
      device.automationComponents.forEach(ac => {
        this.facadeService.notificationService.pushNotificationToPopup(
          {content : 'notification.info.automotaionComponent',params:{name: ac.name, deviceName: device.name}},
          NotificationType.INFO,
          device.status);
      });
    });
  }
   /*
    * While going offline
    */
  offlineState(){
    this.facadeService.applicationStateService.changeApplicationStatus();
    this.facadeService.commonService.isOnline = false;
    this.facadeService.commonService.disableHomeAndDeviceIcons(false);
  }

  /**
  * Shows loader,updates connectionData,makes go offline server call
  */
  goOffline() {
    this.facadeService.notificationService.notificationList = [];
    this.unSubscribeToConnectionLost();
    this.unSubscribeToConnectionReconnect();
    this.facadeService.drawService.removeOnlineConnections();
    this.facadeService.drawService.removeOnlineSubConnections();
    this.facadeService.drawService.applyStyleToEditor();
    this.clearMonitorMaps();
    this.facadeService.editorService.resetMultiSelectedConnection();
    this.showGoOfflineLoader();
    this.facadeService.editorService.setSelectedConnection(null);
    this.facadeService.apiService.goOffLine().subscribe(() =>
      this.facadeService.overlayService.clearOverlayData());
    this.facadeService.dataService.resetConnectionMonitorValuesForAllDevices();
  }
   /*
  * Go online
  */
  private goOnlineCallback(deviceList, isError) {
    this.updateApplicationData(deviceList, isError);
    this.subscribeToConnectionLost();
    this.subscribeToConnectionReconnect();
    this.handleDataMonitoring();
  }
   /*
  * loader while going online
  */
  private showGoOnlineLoader() {
    this.facadeService.overlayService.loader({
      header: this.facadeService.translateService.instant('overlay.loader.goingOnline.header'),
      message: {
        title: this.facadeService.translateService.instant('overlay.loader.goingOnline.header'),
        content: [this.facadeService.translateService.instant('overlay.loader.goingOnline.message.content')]
      },
      enableCancelButton: true
    });
  }
  /*
  * loader while going offline
  */
  private showGoOfflineLoader() {
    this.facadeService.overlayService.loader({
      header: this.facadeService.translateService.instant('overlay.loader.goingOffline.header'),
      message: {
        title: this.facadeService.translateService.instant('overlay.loader.goingOffline.message.title'),
        content: [this.facadeService.translateService.instant('overlay.loader.goingOffline.message.content')]
      },
      enableCancelButton: true
    });
  }
  /*
  * update application data
  */
  private updateApplicationData(deviceList: Device[], isError: boolean) {
    const showError = this.facadeService.deviceService.updateDevicesData(deviceList);
    this.facadeService.errorHandleService.updateNotificationPanel(isError, showError);
    this.facadeService.drawService.applyStyleToEditor();
  }
  /*
  * device node
  */
  private deviceNode(deviceData: Device, deviceId: string) {
    let deviceNodes: Array<HTMLNode> = this.facadeService.editorService.liveLinkEditor.editorNodes.filter(node => node.type === FillingLineNodeType.NODE
      && (node as OPCNode).deviceId === deviceData.uid) || [];
    if (!deviceNodes || deviceNodes.length === 0) {
      deviceNodes = this.facadeService.editorService.getAreaWithDeviceInterfaces(deviceId, true);
    }
    return deviceNodes;
  }
  /*
  * Reset connection end points details
  */
  private resetClientConnectorEndPointDetails(deviceId: string) {
    let nodes: Array<HTMLNode> = this.facadeService.editorService.liveLinkEditor.editorNodes.filter(node => node.type === FillingLineNodeType.NODE
      && (node as OPCNode).deviceId === deviceId) as Array<HTMLNode>;
    if (!nodes || nodes.length === 0) {
      nodes = this.facadeService.editorService.getAreaWithDeviceInterfaces(deviceId, true);
    }
    if (nodes && nodes.length > 0) {
      nodes.forEach(node => {
        if(node && node.inputs)
        {
          const anchorList=[...node.inputs,...node.outputs].filter(anchor=>anchor.deviceId===deviceId);
          anchorList.forEach(anchor => {
            const connector = anchor?.connectors[0];
            connector?.resetEndPointDetails(false);
          });
        }
      });
    }
    this.facadeService.dataService.resetConnectionEndPointDetails(deviceId, false);
  }

  //#endregion

  //#region Socket Event Subscription/Unsubscription

  private subscribeToConnectionLost() {
    const io = this.socket.getIo();
    this.unSubscribeToConnectionLost();
    io.on('connection_error', deviceAddress => {
      /*TO DO : change atob*/
      const deviceData = this.facadeService.dataService.getDeviceByAddress(deviceAddress);
      if (deviceData) {
        log(`Lost connection from ${deviceData.address}`);
        this.resetClientConnectorEndPointDetails(deviceData.uid);
        this.updateApplicationData([{ ...deviceData, state: DeviceState.UNAVAILABLE }], true);
        this.facadeService.commonService.changeDeviceState(deviceData);
        this.resetMonitorTagValues(deviceData.uid);
        const htmlNodes = this.deviceNode(deviceData, deviceData.uid);
        for (const htmlNode of htmlNodes) {
          const connections: Connection[] = this.facadeService.dataService.getAreaAllConnections(htmlNode.id).filter(con=>con.in.includes(deviceAddress) ||
          con.out.includes(deviceData.uid)) || [];
          for (const connection of connections) {
            const connector: Connector = this.facadeService.editorService.liveLinkEditor.connectorLookup[connection.id];
            this.updateConnectorUnavailableData(connector);
          }
        }
      }
    });
  }
  /*
  * Subscription for devices when they are available and reconnected
  */
  private subscribeToConnectionReconnect() {
    const io = this.socket.getIo();
    if (!isNullOrUnDefined(io)) {
      this.unSubscribeToConnectionReconnect();
      io.on('connection_reestablished', deviceAddress => {
        const deviceData = this.facadeService.dataService.getDeviceByAddress(deviceAddress);
        if (deviceData && deviceData.state !== DeviceState.AVAILABLE) {
          log(`Connection reestablished from ${deviceData.address}`);
          this.updateApplicationData([{ ...deviceData, state: DeviceState.AVAILABLE }], false);
          this.facadeService.commonService.changeDeviceState(deviceData);
          /* monitor Connections*/
          let deviceNodes: Array<HTMLNode> = this.facadeService.editorService.liveLinkEditor.editorNodes.filter(node => node.type === FillingLineNodeType.NODE
            && (node as OPCNode).deviceId === deviceData.uid) || [];
          let monitorObsList: Array<Observable<Object>>;

          if (!deviceNodes || deviceNodes.length === 0) {
            deviceNodes = this.facadeService.editorService.getAreaWithDeviceInterfaces(deviceData.uid, true);
          }
          this.handleMonitoringAfterReconnect(deviceNodes,monitorObsList);
        }
      });
    }
  }
  /*
  * monitoring after reconnection
  */
  handleMonitoringAfterReconnect(deviceNodes:Array<HTMLNode>,monitorObsList:Array<Observable<Object>>){
    if (deviceNodes && deviceNodes.length > 0) {
      monitorObsList = this.monitorNodesClientInterfaces(deviceNodes, true) || [];
      this.monitor(monitorObsList);
      this.handleDataMonitoring();
    }
  }
  /*
  * Unsubscribe to connection lost
  */
  private unSubscribeToConnectionLost() {
    this.unSubscribeToIOEvent('connection_error');
  }
  /*
  * Unsubscribe to connection reconnect
  */
  private unSubscribeToConnectionReconnect() {
    this.unSubscribeToIOEvent('connection_reestablished');
  }
  /*
  * Unsubscribe to  socket event
  */
  private unSubscribeToIOEvent(event) {
    const io = this.socket.getIo();
    if (!isNullOrUnDefined(io)) {
      io.removeAllListeners(event);
    }

  }

  //#endregion

  //#region Monitor Common Functionality

  /**
    * Handles the responsibility of data monitoring
  */
  private handleDataMonitoring(): void {
    const monitorObsList: Array<Observable<Object>> = this.getMonitorCallsList();
    this.monitor(monitorObsList);
  }
  /*
  * monitot
  */
  monitor(monitorObsList: Array<Observable<Object>>) {
    if (monitorObsList && monitorObsList.length > 0) {
      forkJoin(monitorObsList).subscribe(_data => {
        this.facadeService.overlayService.clearOverlayData();
      });
    }
  }
  /*
  * Returns the monitor calls for the connections
  */
  private getMonitorCallsList(): Array<Observable<Object>> {
    const tagsObs: Array<Observable<Object>> = this.monitorAllTagsOfClickedInterfaces();
    const editorConnectionObs: Array<Observable<Object>> = this.monitorAllEditorConnections();
    let areaSubConnectionObs: Array<Observable<Object>> = [];
    if (!this.facadeService.editorService.isRootEditor()) {
      areaSubConnectionObs = this.monitorAreaSubConnections();
    }
    const allPossibleConnectionObs: Array<Observable<Object>> = this.monitorOtherNodeOnlineConnections();
    return [...editorConnectionObs, ...tagsObs, ...areaSubConnectionObs, ...allPossibleConnectionObs];
  }
  /*
  * Remove event from connection monitor map
  */
  removeEventFromConnectionMonitorMap(event:string)
  {
    this.unSubscribeToIOEvent(event);
    this.conenctionMonitorItemsMap.delete(event);
  }

  private clearMonitorMaps() {
    const connectionEvents=getEventNamesFromMonitorMaps(this.conenctionMonitorItemsMap);
    connectionEvents.forEach(event=>this.unSubscribeToIOEvent(event));
    this.conenctionMonitorItemsMap.clear();
    const tagEvents=getEventNamesFromMonitorMaps(this.tagMonitorItemsMap);
    tagEvents.forEach(event=>this.unSubscribeToIOEvent(event));
    this.tagMonitorItemsMap.clear();
    /* Tag monitor observable is updated in properties panel for monitoring based on tagmonitorItems ,
    if tagMonitorITems is only updated ,tagMonitorObservable
    will be empty,will leads to empty Observable maps */
    this.tagMonitorObseravablesMap.clear();
    this.tagMonitorItemsOnlineMap.clear();
    this.resetServerMonitoringData();
  }

  //#endregion

  //#region Connection Monitor

  /**
    * Loops through all existing offline connections of all the editor HTML nodes for monitoring
    * adds all the respective observable objects of Server monitor Calls and returns it as an array
    */
  private monitorAllEditorConnections(): Array<Observable<Object>> {
    const connectors = this.facadeService.editorService.liveLinkEditor.connectorLookup;
    const connectionsObservables: Array<Observable<Object>> = [];
    for (const key in connectors) {
      if (connectors.hasOwnProperty(key)) {
        const con: BaseConnector = connectors[key];
        const conObs = this.monitorConnection(con);
        if (conObs) {
          connectionsObservables.push(conObs);
        }
      }
    }
    return connectionsObservables;
  }
  /*
  * Monitor the connection
  */
  private monitorConnection(con: BaseConnector, isMonitorAfterConnetionReestablish = false): Observable<Object> {
    if (con.inputAnchor && con.outputAnchor) {
      const connectData: ConnectionData = getConnectData(con.inputAnchor, this.facadeService.dataService, con.outputAnchor);
      const monitorkey = getConnectionMonitorKey(connectData.deviceId, connectData.automationComponentId, connectData.interfaceId);
      if (!this.conenctionMonitorItemsMap.has(monitorkey) || isMonitorAfterConnetionReestablish) {
        if (this.facadeService.dataService.getDeviceState(connectData.deviceId) !== DeviceState.UNAVAILABLE) {
          return this.monitorConnectionVars(connectData, connectData.serverDeviceId, con.id, con.type);
        }
        else {
          //If Client Interface Device is unavailable
          this.updateConnectorUnavailableData(con);
          return null;
        }
      }
      return null;
    }
    return null;
  }



  /*
  * Update connector for unavailable data
  */
  private updateConnectorUnavailableData(connector: BaseConnector) {
    if (connector.inputAnchor && connector.outputAnchor) {
      const connectData: ConnectionData = getConnectData(connector.inputAnchor, this.facadeService.dataService, connector.outputAnchor);
      const address = this.facadeService.dataService.getDevice(connectData.serverDeviceId)?.address;
      const relatedEndPoint: RelatedEndPointInterface = getRelatedEndPointData(address, connectData.automationComponent, connectData.interfaceName);
      connector.updateConnectionEndPointStatus(false, relatedEndPoint);
      this.facadeService.dataService.resetConnectionEndPointDetails(connectData.deviceId, false, true, relatedEndPoint.address);
      this.facadeService.applicationStateService.updateConnectorStatus(connector);
      this.facadeService.applicationStateService.styleConnection(connector);
    }
  }

  /**
    * Loops through all possible online connections of all the editor HTML nodes to be shown in Online mode
    * adds all the respective observable objects of Server monitor Calls and returned it as an array
    */
  private monitorOtherNodeOnlineConnections(): Array<Observable<Object>> {
    const editorNodes: Array<HTMLNode> = this.facadeService.editorService.liveLinkEditor.editorNodes;
    return this.monitorNodesClientInterfaces(editorNodes) || [];
  }
  /*
  * Monitor nodes client interface
  */
  private monitorNodesClientInterfaces(nodes: Array<HTMLNode>, isMonitorAfterConnetionReestablish = false): Array<Observable<Object>> {
    const connectionsObservables: Array<Observable<Object>> = [];
    nodes?.forEach(nodeItem => {
      if (nodeItem.type === FillingLineNodeType.AREA
        || (nodeItem.type === FillingLineNodeType.NODE && this.facadeService.dataService.getDeviceState((nodeItem as OPCNode).deviceId) !== DeviceState.UNAVAILABLE)) {
        nodeItem.inputs.forEach(inputAnchor => {
          let conObs;
          const hasSubConenctor = inputAnchor.connectors.findIndex(con => con.type === ConnectorType.SUBCONNECTOR);
          if (hasSubConenctor > -1 || !inputAnchor.connectors || inputAnchor.connectors.length === 0) {
            conObs = this.monitorClientInterface(inputAnchor, isMonitorAfterConnetionReestablish);
          }
          else {
            const con = inputAnchor.connectors.find(connector => connector.inputAnchor.interfaceData.id === inputAnchor.interfaceData.id);
            conObs = this.monitorConnection(con, isMonitorAfterConnetionReestablish);
          }
          if (conObs) {
            connectionsObservables.push(conObs);
          }
        });
      }
    });
    return connectionsObservables;
  }
  /*
  * Monitor client interface
  */
  private monitorClientInterface(inputAnchor: NodeAnchor, isMonitorAfterConnetionReestablish = false): Observable<Object> {
    const connectData = getConnectData(inputAnchor, this.facadeService.dataService);
    //get the connectionObject with automationComponentId and interfaceId
     const connectionObj = this.facadeService.dataService.getConnectionByACIDAndInterfaceID(connectData.automationComponentId,connectData.interfaceId);
    const monitorkey = getConnectionMonitorKey(connectData.deviceId, connectData.automationComponentId, connectData.interfaceId);
    if (!this.conenctionMonitorItemsMap.has(monitorkey) || isMonitorAfterConnetionReestablish) {
      const serverDevice = this.facadeService.dataService.getAllNodes()?.find(device => (device as Node).deviceId === connectData.serverDeviceId);
      if (!connectData.serverDeviceId || (connectData.serverDeviceId && serverDevice)) {
        let connectorID = '';
        if(connectionObj){
          connectorID = connectionObj?.id;
        }
        return this.monitorConnectionVars(connectData, connectData.serverDeviceId,connectorID, ConnectorType.CONNECTOR, inputAnchor.id);
      }
    }
    return null;
  }

  /*
  * Monitor area sub connections
  */
  private monitorAreaSubConnections(): Array<Observable<Object>> {
    const subConnections: Array<SubConnection> = this.facadeService.dataService.getAreaSubConnections(this.facadeService.editorService.getEditorContext().id);
    let connectionsObservables: Array<Observable<Object>> = [];
    if (subConnections && subConnections.length > 0) {
      subConnections.forEach(subConnection => {
        if (subConnection && subConnection.isclient && !isNullOrEmpty(subConnection.connectionId)) {
          //subConnection.connectionId is required otherwise Connection Monitor will not happen
          const subConnector = this.facadeService.editorService.liveLinkEditor.subConnectorLookup[subConnection.id];
          const connection = this.facadeService.dataService.getConnection(subConnection.connectionId);
          if (subConnector && connection) {
            const connectData: ConnectionData = getConnectDataFromSubConnector(subConnector, connection, subConnection.isclient, this.facadeService.dataService);
            const monitorkey:string = getConnectionMonitorKey(connectData.deviceId, connectData.automationComponentId, connectData.interfaceId);
            connectionsObservables = this.checkConnectionMonitorItemsMapHasMonitorkey(monitorkey,connectData,subConnector,connectionsObservables);
          }
        }
      });
    }
    return connectionsObservables;
  }
  /*
  * Check if connection monitor items map has monitor key
  */
  checkConnectionMonitorItemsMapHasMonitorkey(monitorkey:string,connectData:ConnectionData,subConnector:SubConnector,connectionsObservables:Array<Observable<Object>>){
    if (!this.conenctionMonitorItemsMap.has(monitorkey)) {
      const conObs =
      this.monitorConnectionVars(connectData,
      this.facadeService.dataService.getDevice(connectData?.serverDeviceId)?.address, subConnector.id, subConnector.type);
      if (conObs) {
        connectionsObservables.push(conObs);
      }
    }
    return connectionsObservables;
  }

  /**
 * @param connectData : ConnectionData for creating event payload
 * @param connector : Existing Connector Object of existing  Offline Connections.Value will be 'null' for new Online Connections.
 * @param inputAnchor : input Anchor where the new Online connections will be drawn.Value will be 'null/undefined' for Offline Connections.
 * Returns Observable Object of each connection calls to server.
 */
  private monitorConnectionVars(connectData: ConnectionData, partnerUrl?: string, connectorId?: string, connectorType?: ConnectorType,
    _inputAnchorId?: string): Observable<Object> {
    let result;
    /*Get Event Names for Diagnose and Partner Param*/
    if (connectData) {
      const eventDiagnose = getConnectionEventName(connectData.deviceId, connectData.automationComponent, connectData.interfaceId, ConnectionAttributes.DIAGNOSE);
      const eventPartner = getConnectionEventName(connectData.deviceId, connectData.automationComponent, connectData.interfaceId, ConnectionAttributes.PARTNER);
      const eventDetailedStatus = getConnectionEventName(
        connectData.deviceId, connectData.automationComponent,
        connectData.interfaceId, ConnectionAttributes.DETAILEDSTATUS
      );
      /* create connection monitor payload*/
      const monitorPayload: MonitorPayload = this.getMonitorPayload(connectData, eventDiagnose, eventPartner, eventDetailedStatus, partnerUrl);
      const monitorkey = getConnectionMonitorKey(connectData.deviceId, connectData.automationComponentId, connectData.interfaceId);
      this.conenctionMonitorItemsMap.set(monitorkey, monitorPayload);
      if (monitorPayload) {
        const monitorObservable: Observable<Object> = this.facadeService.apiService.subscribeTo(monitorPayload);
        const param = {
          eventDiagnose : eventDiagnose,
          eventPartner : eventPartner,
          eventDetailedStatus :eventDetailedStatus,
          connectorId : connectorId,
          connectorType : connectorType,
          areaId : connectData.areaId,
          deviceId : connectData.deviceId,
          automationComponentId :connectData.automationComponentId,
          interfaceId: connectData.interfaceId
        }
        this.setMonitorConnectionDataChangeListner(param);
        result = monitorObservable;
      }
    }
    return result;
  }

  /**
* Creates Payload for Connection Monitor Item for Server call
* @param connectData : ConnectionData for creating event payload
* @param eventDiagnose : Name of Connection Diagnose Event
* @param eventPartner : Name of Connection Partner Event
*/
  private getMonitorPayload(connectData: ConnectionData, eventDiagnose: string,
    eventPartner: string, eventDetailedStatus: string, partnerUrl?: string): MonitorPayload {
    return {
      project: this.facadeService.dataService.getProjectId(),
      deviceId: connectData.deviceId,
      type: MONITORTYPE.CLIENTCONNECTIONDIAGNOSTICS,
      interfaceName: connectData.interfaceName,
      automationComponent: connectData.automationComponent,
      nodeList: [
        { eventName: eventDiagnose, propertyName: ConnectionAttributes.DIAGNOSE, partnerUrl: partnerUrl },
        { eventName: eventPartner, propertyName: ConnectionAttributes.PARTNER },
        { eventName: eventDetailedStatus, propertyName: ConnectionAttributes.DETAILEDSTATUS }],
      serverDeviceId: connectData.serverDeviceId
    };
  }

  /**
    *
    * @param eventDiagnose :Name of Connection Diagnose Event
    * @param eventPartner : Name of Connection Partner Event
    * @param connection : Connector object to be added/update with callback the param value
    * @param inputAnchor :Input anchor to draw a new connection in Online Mode
    * @param deviceId : Device ID
    * @param interfaceId :  Client Interface Name
    */
  private setMonitorConnectionDataChangeListner(param :MonitorDataParam) {
    /*Add listeners on the Connection Diagnose and Partner Event  Socket IO call From Server*/
    const io = this.socket.getIo();
    io.on(param.eventDiagnose, value => {
      log(`Event :: ${param.eventDiagnose} value :: ${value}`);
      const payload = {
        param: ConnectionAttributes.DIAGNOSE,
        value: value,
        connectorId: param.connectorId,
        connectorType: param.connectorType,
        areaId: param.areaId,
        deviceId: param.deviceId,
        automationComponentId: param.automationComponentId,
        interfaceId: param.interfaceId
      }
      this.updateOrCreateConnection(payload);
    });
    io.on(param.eventPartner, value => {
      log(`Event :: ${param.eventPartner} value :: ${JSON.stringify(value)}`);
      const payload = {
        param: ConnectionAttributes.PARTNER,
        value: value,
        connectorId: param.connectorId,
        connectorType: param.connectorType,
        areaId: param.areaId,
        deviceId: param.deviceId,
        automationComponentId: param.automationComponentId,
        interfaceId: param.interfaceId
      }
      this.updateOrCreateConnection(payload);
    });
    io.on(param.eventDetailedStatus, value => {
      this.facadeService.dataService.updateConnectionEndPointDetails(value, ConnectionAttributes.DETAILEDSTATUS, param.deviceId, param.automationComponentId, param.interfaceId);
    });
  }

  /**
 * Updates Diagnose/Partner value of existing connections or Draws new connections in Online Mode
 * @param param : Name of the Parameter : Diagnose/Partner
 * @param value : Value of the Parameter
 * @param connector : Connector object to update the param value
 * @param inputAnchor : Input anchor to draw a new connection in Online Mode
 * @param deviceId : Device ID
 * @param interfaceId : Client Interface Name
 */
  private updateOrCreateConnection(payload: CreateConnectionPayload) {
    /*If Connection already existed in Offline Mode*/
    if (!isNullOrEmpty(payload.connectorId)) {
      this.updateExistingConnectionData(payload.param,
        payload.value, payload.connectorId,
        payload.connectorType, payload.deviceId,
        payload.automationComponentId, payload.interfaceId);
    }
    /*Connections is in Online Mode*/
    else {
      this.createOnlineConnection(payload.param,
        payload.value, payload.areaId,
        payload.deviceId, payload.automationComponentId,
        payload.interfaceId);
    }
  }

  /**
     * Updates Diagnose/Partner value of existing connections
     * @param param : Name of the Parameter : Diagnose/Partner
     * @param value : Value of the Parameter
     * @param connectorId : Connector object to update the param value
     * @param inputAnchor : Input anchor to draw a new connection in Online Mode
     * @param deviceId : Device ID
     * @param interfaceId : Client Interface Name
     */
  private updateExistingConnectionData(param: string, value, connectorId: string, connectortype: ConnectorType,
    deviceId: string, automationComponentId: string, interfaceId: string) {
    const connector: BaseConnector = this.facadeService.editorService.getBaseConnector(connectorId, connectortype);

    if (connector && connector.creationMode === ConnectorCreationMode.MANUAL) {
      const { connectionStatus, relatedEndPoint } = this.updateConnectionEndPointDetails(param, value, deviceId, automationComponentId, interfaceId);
      this.updateAndStyleConnector(connectorId, connectortype, param, relatedEndPoint, connectionStatus);
    }
    else {
      /**
   * If the connectionId is  subconnection Id and trying to update the connection style from root.
   * In this case connection ID is subconnectionId and connectortype is subconnector
   * Mutisession scenarios - remove online connection- Should change the color of the green line to grey
   * if remove the online connection from another session.
   *
   *
   */
      if (!connector) {
        const connection = this.facadeService.dataService.getConnectionByACIDAndInterfaceID(automationComponentId, interfaceId);
        if (connection && connection.creationMode === ConnectorCreationMode.MANUAL && !isNullOrEmpty(this.facadeService.editorService.getExistingConnectorById(connection.id))) {
          const { connectionStatus, relatedEndPoint } = this.updateConnectionEndPointDetails(param, value, deviceId, automationComponentId, interfaceId);
          this.updateAndStyleConnector(connection.id, ConnectorType.CONNECTOR, param, relatedEndPoint, connectionStatus);
        }
      }
    }
  }
  /*
  * Update connection end points details
  */
  private updateConnectionEndPointDetails(param: string, value, deviceId: string, automationComponentId: string, interfaceId: string) {
    let connectionStatus: boolean;
    let relatedEndPoint: RelatedEndPointInterface;
    switch (param) {
      case ConnectionAttributes.DIAGNOSE:
        connectionStatus = Boolean(value);
        break;
      case ConnectionAttributes.PARTNER:
        relatedEndPoint = value;
        value = (value as RelatedEndPointInterface)?.address;
        break;
      default: break;
    }
    this.facadeService.dataService.updateConnectionEndPointDetails(value, param, deviceId, automationComponentId, interfaceId);
    return { connectionStatus, relatedEndPoint };
  }
  /*
  * Update style connector
  */
  private updateAndStyleConnector(connectorId: string, connectorType: ConnectorType, param: string, relatedEndPoint: RelatedEndPointInterface, connectionStatus: boolean) {
    const connector: BaseConnector = this.facadeService.editorService.getBaseConnector(connectorId, connectorType);
    if (connector) {
        if (connector.type === ConnectorType.CONNECTOR) {
          this.facadeService.editorService.updateConnectionMonitor(param, relatedEndPoint, connector as unknown as Connector);
        }
        this.facadeService.drawService.updateAndStyleConnector(connector, connectionStatus, relatedEndPoint);
    }
  }

  /**
   * Updates Diagnose value and Draws new connections in Online Mode
   * @param param : Name of the Parameter : Diagnose/Partner
   * @param value : Value of the Parameter
   * @param connector : Connector object to update the param value
   * @param inputAnchor : Input anchor to draw a new connection in Online Mode
   * @param deviceId : Device ID
   * @param interfaceId : Client Interface Name
   */
  private createOnlineConnection(param: string, value, areaId: string, deviceId: string, automationComponentId: string, interfaceId: string) {
    let inputAnchor: NodeAnchor;
    if (!isNullOrEmpty(interfaceId) && !isNullOrEmpty(automationComponentId)) {
      const node = this.facadeService.editorService.liveLinkEditor.editorNodes
      .find(editorNode => editorNode.id === automationComponentId || editorNode.id === areaId);
      inputAnchor = node?.inputs.find(anchor => anchor.interfaceData.id === interfaceId);
    }
    if(!inputAnchor) {
      inputAnchor = this.updateInputAnchorFromOnlineConnection(automationComponentId,interfaceId);
    }
    this.createOnlineConnectionForInputAnchor(inputAnchor,automationComponentId,interfaceId,param,value,deviceId);
  }

  /**
   * Get the node anchor using automationComponentId and interfaceId
   * @param automationComponentId
   * @param interfaceId
   * @returns
   */
  private updateInputAnchorFromOnlineConnection(automationComponentId:string,interfaceId: string){
      const connection = this.facadeService.dataService.getOnlineConnectionByACID(automationComponentId, interfaceId);
      let anchor:NodeAnchor;
      if (connection) {
        const areaId = connection.id.split('__')[0];
        const node = this.facadeService.editorService.liveLinkEditor.editorNodes.find(editorNode => editorNode.id === areaId);
        anchor= node?.inputs.find(nodeanchor => nodeanchor.interfaceData.id === interfaceId);
      }
      return anchor;
    }

/**
 * Create online connection using node anchor
 * @param inputAnchor
 * @param automationComponentId
 * @param interfaceId
 * @param param
 * @param value
 * @param deviceId
 */
  private createOnlineConnectionForInputAnchor(inputAnchor: NodeAnchor, automationComponentId: string, interfaceId: string, param: string, value, deviceId: string) {
    if (inputAnchor && !isNullOrUnDefined(value)) {
      this.createOnlineConnectionWithNodeAnchor(inputAnchor,automationComponentId, interfaceId, param, value, deviceId);
    } else {
       /**
        * If  nodeanchor not available create the connection object with
        * createExposedConnectionFromRoot
        */
      this.createOnlineConnectionWithOutNodeAnchor(automationComponentId, interfaceId, param, value, deviceId);
    }
  }

  /**
   * Create connection  with node anchor
   * @param inputAnchor 
   * @param automationComponentId 
   * @param interfaceId 
   * @param param 
   * @param value 
   * @param deviceId 
   */
  private createOnlineConnectionWithNodeAnchor(inputAnchor: NodeAnchor, automationComponentId: string,
    interfaceId: string, param: string, value, deviceId: string) {
    let connectionStatus, relatedEndPoint;
    if (param === ConnectionAttributes.PARTNER) {
      if (!isNullOrEmpty(value) && !isNullOrEmpty(value.address)) {
        this.onlineConnectionForPartner(value, inputAnchor, param, deviceId,
          automationComponentId, interfaceId, connectionStatus);
      } else {
        /**
         * Related endpoint address empty, then remove the online connection
         */
        this.removeOnlineConnections(inputAnchor, param, value, deviceId,
          automationComponentId, interfaceId);
      }
    }
    else {
      this.onlineConnectionForDiagnose(value, param, deviceId,
        automationComponentId, interfaceId, inputAnchor, relatedEndPoint);
    }
  }

  /*
  If  nodeanchor not available create the connection object with available acID and interfaceID
      using strategy pattern (create online scenario) create the connection object
  */
private createOnlineConnectionWithOutNodeAnchor(automationComponentId:string, interfaceId:string, param:string, value, deviceId:string){
    this.facadeService.dataService.updateConnectionEndPointDetails(value, param, deviceId, automationComponentId, interfaceId);
    if (param === ConnectionAttributes.PARTNER) {
      if (!isNullOrUnDefined(value) && !isNullOrEmpty(value.address)) {
        if (!this.facadeService.dataService.getOnlineConnectionByACID(automationComponentId, interfaceId)
          && this.facadeService.dataService.getNodeByAddress(value.address).length) {
          this.createExposedConnectionFromRoot(deviceId, automationComponentId, interfaceId);
        }

      } else {
        //If connector is not available, find the same connection from data service and delete it.
        this.removeOnlineConnectionUsingACIdAndInterfaceId(automationComponentId, deviceId, interfaceId, value, param);
      }
    }
  }

  /**
     * Finding the compatible device with existing ac and interface
     */
  private createExposedConnectionFromRoot(deviceId: string, acID: string, clientInterfaceId: string) {
    const interfaceData = this.facadeService.dataService.getClientInterfaceByInterfaceId(deviceId, acID, clientInterfaceId);
    const compatibleInterfaceDevice =
      this.facadeService.dataService
        .getMappedCompatibleInterfaceByType(interfaceData.type, interfaceData.isClientInterface, deviceId) as MatchingConnectionInterface[];
    const availableInEditorCompatibleDevice = compatibleInterfaceDevice[0];
    const connectionNeededParams = this.getParameterForStrategy(deviceId, acID, clientInterfaceId, availableInEditorCompatibleDevice);
    this.createOnlineConnectionForUnavailableAnchor(connectionNeededParams.sourceParent, connectionNeededParams.targetParent,
      availableInEditorCompatibleDevice, connectionNeededParams);
  }


  /**
   * Getting all connection object
   */
  private getParameterForStrategy(sourceDeviceId: string, sourceAcId: string, clientInterfaceId: string, availableInEditorCompatibleDevice: MatchingConnectionInterface) {
    const nodeDetails = this.facadeService.dataService.getNodeByID(sourceAcId);
    const currentAreaId = this.facadeService.editorService.getEditorContext().id;
    const sourceParent = nodeDetails.parent;

    const { automationComponentId: targetAcId,
      deviceId: targetDeviceId, interfaceId, parent: targetParent, type } = availableInEditorCompatibleDevice;
    const serverInterfaceId = interfaceId;
    return {
      clientInterfaceId, serverInterfaceId, sourceAcId, sourceDeviceId, sourceParent, targetAcId,
      targetDeviceId, targetParent, type, currentAreaId
    };
  }

  /**
   * Find the strategy and required params for connection object
   */
  private createOnlineConnectionForUnavailableAnchor(sourceAreaParent: string, targetDeviceParent: string, device: MatchingConnectionInterface, connectionNeededParams) {
    const areaHierarchy = this.facadeService.areaUtilityService.getCommonParent(sourceAreaParent, targetDeviceParent);
    const { sourceHierarchy, targetHierarchy,
      sourceAcId,
      targetAcId } =
      this.facadeService.areaUtilityService.getSourceTargetDevice(areaHierarchy,
        connectionNeededParams.sourceAcId,
        connectionNeededParams.targetAcId,
        device
      );
    areaHierarchy.sourceAreaHierarchy = sourceHierarchy;
    areaHierarchy.targetAreaHierarchy = targetHierarchy;
    const { connectionIn, connectionOut } = findConnectionInAndOut(areaHierarchy, sourceAcId, targetAcId);
    const scenario = this.facadeService.areaUtilityService.getScenario(areaHierarchy);

    this.facadeService.strategyManagerService.executeStrategy(scenario, StrategyOperations.CREATEONLINE_AREA_CONNECTION,
      { ...connectionNeededParams, ...areaHierarchy, connectionIn, connectionOut });
  }

  /**
   * If input anchor has connection will update the endpoint and connection state.
   * If anchor has subconnection or no connection will find the connection from data service and delete it.
   * Connection will available in lookup
   * @param inputAnchor
   * @param param
   * @param value
   * @param deviceId
   * @param automationComponentId
   * @param interfaceId
   */
  private removeOnlineConnections(inputAnchor: NodeAnchor, param: string, value, deviceId: string,
    automationComponentId: string, interfaceId: string) {
    if (inputAnchor && inputAnchor.connectors && inputAnchor.connectors.length) {
      const connector = this.facadeService.editorService.getBaseConnector(inputAnchor.connectors[0].id, inputAnchor.connectors[0].type);
      if (connector && connector.type === ConnectorType.CONNECTOR) {
        this.facadeService.connectionService.updateEndpointDataAndconnectionState(connector as Connector);
      } else {
        this.removeOnlineConnectionUsingACIdAndInterfaceId(automationComponentId, deviceId, interfaceId, value, param);
      }
      if(connector){
        this.facadeService.drawService.updateAndStyleConnector(connector, false, value);
      }
    }
  }

  /**
   * If connector is not available, find the same connection from data service and delete it.
   * @param automationComponentId
   * @param deviceId
   * @param interfaceId
   * @param value
   * @param param
   */
  removeOnlineConnectionUsingACIdAndInterfaceId(automationComponentId: string, deviceId: string, interfaceId: string, value, param) {
    const connection = this.facadeService.dataService.getOnlineConnectionByACID(automationComponentId, interfaceId);
    this.facadeService.dataService.deleteConnection(connection);
    this.updateConnectionEndPointDetails(param, value, deviceId, automationComponentId, interfaceId);
    /**
     * If the connection object has subconnection, then remove all the online exposed sub connections
     */
    if (connection && connection.hasSubConnections) {
      connection.subConnections.serverIds = connection.subConnections.serverIds || [];
      const connectorIds = connection.subConnections.serverIds.concat(connection.subConnections.clientIds);
      this.facadeService.connectionService.removeExposedSubConnection(connectorIds);
    }
  }


  /*
  * Online connection for partner value
  */
  onlineConnectionForPartner(value,
    inputAnchor: NodeAnchor, param: string,
    deviceId: string, automationComponentId: string,
    interfaceId: string, connectionStatus: boolean) {
    let connector;
    const relatedEndPoint = value;
    inputAnchor.relatedEndPoint = value;
    this.updateConnectionEndPointDetails(param, value, deviceId, automationComponentId, interfaceId);
    if (isNullOrEmpty(inputAnchor.connectors) || !isNullOrEmpty(inputAnchor.connectors)
      && (inputAnchor.connectors[0].type === ConnectorType.SUBCONNECTOR
      )) {
        connector= this.createOnlineConnectionForEmptyInputAnchorConnectors(inputAnchor,value);
    }
    if (!isNullOrEmpty(inputAnchor.connectors) && inputAnchor.connectors[0].type === ConnectorType.SUBCONNECTOR) {
      connector = inputAnchor.connectors[0];
    }
    if (connector) {
      this.updateAndStyleConnector(connector.id, connector.type, param, relatedEndPoint, connectionStatus);
    }
  }

 private createOnlineConnectionForEmptyInputAnchorConnectors(inputAnchor,value){
    let connector;
    if (isNullOrEmpty(inputAnchor.connectors) ||
    (this.facadeService.editorService.getExistingSubConnectorById(inputAnchor?.connectors[0]?.id)
       &&
      (inputAnchor.connectors[0].creationMode !== SubConnectorCreationMode.ONLINE)
      && inputAnchor.connectors[0].creationMode !== SubConnectorCreationMode.MANUALONLINE)) {
      connector = this.facadeService.drawService.createOnlineConnection(value, inputAnchor);
    }
    return connector;
  }


  /*
  * Online connection for diagnose value
  */
  onlineConnectionForDiagnose(value,param:string,
    deviceId:string,automationComponentId:string,
    interfaceId:string,inputAnchor:NodeAnchor,
    relatedEndPoint:RelatedEndPointInterface){
    let connector;
     const connectionStatus=value;
        this.updateConnectionEndPointDetails(param, value, deviceId, automationComponentId, interfaceId);
        if(!isNullOrEmpty(inputAnchor.connectors) && inputAnchor.connectors.length>0)
        {
          connector= this.facadeService.editorService.getBaseConnector(inputAnchor.connectors[0].id,inputAnchor.connectors[0].type);
          this.facadeService.drawService.updateAndStyleConnector(connector, connectionStatus, relatedEndPoint);
        }
  }
  /*
  * handle connection monitoring for outer areas
  */
  handleConnectionMonitoringForOuterArea(areaHierarchyDetails:AreaHierarchy,inputAnchor:NodeAnchor)
  {
    const commonParentIndex=areaHierarchyDetails.sourceAreaHierarchy.findIndex(id=>id===areaHierarchyDetails.commonParent);
    const currentAreaIdIndex=areaHierarchyDetails.sourceAreaHierarchy.findIndex(id=>id===this.facadeService.editorService.getEditorContext().id);
    if(commonParentIndex>currentAreaIdIndex)
    {
        const monitorkey = getConnectionMonitorKey(inputAnchor.deviceId, inputAnchor.automationComponentId, inputAnchor.interfaceData.id);
        this.removeEventFromConnectionMonitorMap(monitorkey);
        return false;
    }
    return true;
  }

  //#endregion

  //#region Tag Monitor

  /**
   * Set tagDeviceInterfaceMonitorPayloadsMap for each device and Interface combination
   * @param deviceId : Device ID of the monitor param
   * @param interfaceId : Interface Id of the monitor param
   * @param monitorList : tag param list for monitoring
   */
  setTagMonitorItems(
    deviceId: string,
    automationComponent: string,
    interfaceId: string,
    interfaceName: string,
    monitorList: Array<MonitorNode>,
    type: MONITORTYPE,
    sessionName?: string
  ) {
    const deviceInterfaceKey = getDeviceInterfaceName(deviceId, automationComponent, interfaceId);
    if (!this.tagMonitorItemsMap.has(deviceInterfaceKey)) {
      this.monitorItems.project = this.facadeService.dataService.getProjectId();
      this.monitorItems.deviceId = deviceId;
      this.monitorItems.interfaceName = interfaceName;
      this.monitorItems.nodeList = monitorList;
      this.monitorItems.automationComponent = automationComponent;
      this.monitorItems.type = type;
      if (this.monitorItems.type === MONITORTYPE.SERVERCONNECTIONDIAGNOSTICS) {
        this.monitorItems.sessionName = sessionName;
      }
      /*During updating the value for the deviceInterface key,
        seldom it takes previous reference value  */
      const monitorItemsClone = { ...this.monitorItems };
      this.tagMonitorItemsMap.set(deviceInterfaceKey, monitorItemsClone);
    }
  }

  // add the filter to read the parent nodes (input and output data)
  monitorTags(monitorPayload: MonitorPayload): Observable<Object> {
    let result = of(null);
    if (monitorPayload && monitorPayload.nodeList && monitorPayload.nodeList.length && !this.facadeService.dataService.isDeviceAvailable(monitorPayload?.deviceId)) {
      result = this.facadeService.apiService.subscribeTo(monitorPayload);
    }
    return result;
  }

  /**
* Get tagDeviceInterfaceMonitorPayloadsMap for each device and Interface combination
* @param deviceId : Device ID of the monitor param
* @param interfaceId : Interface Id of the monitor param
*/
  getTagMonitorItems(deviceId: string, automationComponent: string, interfaceId: string): MonitorPayload {
    return this.tagMonitorItemsMap.get(getDeviceInterfaceName(deviceId, automationComponent, interfaceId));
  }
  /*
  * set tag observable
  */
  setTagObservable(deviceId: string, automationComponent: string, interfaceId: string, eventName: string) {
    const tagMap: Map<string, MonitorObservable> = this.getTagObservable(deviceId, automationComponent, interfaceId);
    if (!tagMap.has(eventName)) {
      const monitorObservable: MonitorObservable = {
        eventName: eventName,
        value: '',
        event: new EventEmitter<string | number | unknown>()
      };
      tagMap.set(eventName, monitorObservable);
    }
  }
  /*
  * set change tag listener
  */
  setTagChangeListener(deviceId: string, automationComponent: string, interfaceId: string, eventName: string) {
    const tagMap: Map<string, MonitorObservable> = this.getTagObservable(deviceId, automationComponent, interfaceId);
    if (tagMap.has(eventName)) {
      const io = this.socket.getIo();
      io.on(eventName, value => {
        log(`Event :: ${eventName} value ::`);
        /**If device state is not updated will update the device availability */
        this.updateAreaDeviceState(eventName);
        this.emitTagMapValueChangeEvent(tagMap, eventName, value);
      });
    }
  }
  /*
  * update area device state
  */
  private updateAreaDeviceState(eventName: string) {
    if (eventName) {
      const acID = eventName.split('.')[0];
      const device = this.facadeService.dataService.getDeviceByAcID(acID);
      if (device && device.state !== DeviceState.AVAILABLE) {
        this.facadeService.dataService.updateDeviceState(device.uid, DeviceState.AVAILABLE);
        this.facadeService.commonService.changeDeviceState(this.facadeService.dataService.getDevice(device.uid));
      }
    }
  }
  /*
  * Returns tag observable
  */
  private getTagObservable(deviceId: string, automationComponent: string, interfaceId: string): Map<string, MonitorObservable> {
    const key = getDeviceInterfaceName(deviceId, automationComponent, interfaceId);
    if (!this.tagMonitorObseravablesMap.has(key)) {
      this.tagMonitorObseravablesMap.set(key, new Map<string, MonitorObservable>());
    }
    return this.tagMonitorObseravablesMap.get(key);
  }
  /*
  * Emit tag map value change event
  */
  private emitTagMapValueChangeEvent(tagMap, eventName, value) {
    tagMap.get(eventName).value = value;
    tagMap.get(eventName).event.emit(value);
  }
  /*
  * Monito all tags of clicked interface
  */
  private monitorAllTagsOfClickedInterfaces(): Array<Observable<Object>> {
    //send request to to terminate monitoring for prev
    //loop monitorItemList and monitor tags
    const result: Array<Observable<Object>> = [] as Array<Observable<Object>>;
    for (const item of this.tagMonitorItemsMap.keys()) {
      if (!this.tagMonitorItemsOnlineMap.has(item)) {
        const monitoPayload = this.tagMonitorItemsMap.get(item);
        this.tagMonitorItemsOnlineMap.set(item, monitoPayload);
        //check Device/AC state before pushing to monitor list
        //Question : Should we monitor even If the devices state is unavailable ?
        result.push(this.monitorTags(monitoPayload));
      }
    }
    return result;
  }
  /*
  * Resets the monitor tag values
  */
  private resetMonitorTagValues(deviceId: string) {
    const nodes = this.facadeService.editorService.liveLinkEditor.entities.entities;
    for (const entityId of this.facadeService.editorService.liveLinkEditor.entities.ids) {
      const entity: FillingNode | FillingArea = nodes[entityId];
      if (entity.type === FillingLineNodeType.NODE && entity.deviceId === deviceId) {
        this.resetTagValues(deviceId, entity.name, entity.clientInterfaces);
        this.resetTagValues(deviceId, entity.name, entity.serverInterfaces);
      }
    }
  }
  /*
  * Reset tag value
  */
  private resetTagValues(deviceId: string, automationComponent: string, interfaces: Array<ClientInterface>) {
    interfaces.forEach(inf => {
      const tagMap: Map<string, MonitorObservable> = this.getTagObservable(deviceId, automationComponent, inf.id);
      for (const event of tagMap.keys()) {
        this.emitTagMapValueChangeEvent(tagMap, event, '');
      }
    });
  }

  //#endregion

  //#region Server Diagnostic Monitoring

  setServerDiagnosticMonitorData(id, data) {
    this._connectionMonitorMap$.set(id, data);
  }
  /*
  * Returns the monitor data by id
  */
  getMonitorDataById(id) {
    if (!this._connectionMonitorMap$.has(id)) {
      return null;
    }
    return this._connectionMonitorMap$.get(id);
  }
  /*
  * sets server diagnostic data
  */
  setServerDiagnosticData(id, data) {
    this._connectionServerDiagnosticMonitorMap$.set(id, data);
  }
  /*
  * remove from cached server monitoring data
  */
  removeFromCachedServerMonitoringData(id: string) {
    if (this._connectionServerDiagnosticMonitorMap$.has(id)) {
      this._connectionServerDiagnosticMonitorMap$.delete(id);
      this._connectionMonitorMap$.delete(id);
    }
  }
  /*
  * get cached server diagnostic data
  */
  getCachedServerDiagnosticData(id: string) {
    if (!this._connectionServerDiagnosticMonitorMap$.has(id)) {
      return null;
    }
    return this._connectionServerDiagnosticMonitorMap$.get(id);
  }
  /*
  * Reset server monitoring data
  */
  resetServerMonitoringData() {
    this._connectionServerDiagnosticMonitorMap$.forEach(event => {
      this.unSubscribeToIOEvent(event);
    });
    this._connectionServerDiagnosticMonitorMap$.clear();
    this._connectionMonitorMap$.forEach(event => {
      this.unSubscribeToIOEvent(event);
    });
    this._connectionMonitorMap$.clear();
  }

  //#endregion

}

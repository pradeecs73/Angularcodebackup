/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, takeWhile } from 'rxjs/operators';
import { BrowseAdapter } from '../../../../app/opcua/adapter/base-adapter/browse-adapter';

import { AdapterMethods, ConnectorState, ConnectorType, FillingLineNodeType, MONITORTYPE, ObjectType, PropertyPanelType, ServerDiagnostics } from '../../../enum/enum';
import { ClientDiagnosticData } from '../../../models/connection.interface';
import {
  AttributeData,
  MonitorNode,
  MonitorPayload,
  PanelDataType,
  PropertiesType,
  TreeData
} from '../../../models/monitor.interface';
import { DataAdapterManagers } from '../../../opcua/adapter/adapter-manager';
import { MonitorAdapter } from '../../../opcua/adapter/base-adapter/monitor-adapter';
import { BaseConnector } from '../../../opcua/opcnodes/baseConnector';
import { Connector } from '../../../opcua/opcnodes/connector';
import { getConnectionData, getDeviceInterfaceName, getTagEventName, isNullOrEmpty } from '../../../utility/utility';
import { FacadeService } from '../../services/facade.service';

@Component({
  selector: 'app-connection-properties-panel',
  templateUrl: './connection-properties-panel.component.html',
  styleUrls: ['./connection-properties-panel.component.scss']
})
export class ConnectionPropertiesPanelComponent implements OnInit, OnDestroy {

  /**
   * 
   * showDeviceUnavailable if the deviceState is not available and the connection is in online mode
   */
  get showDeviceUnavailable(): boolean {
    return this.facadeService.applicationStateService.showDeviceUnavailable(this.panelData);
  }
  monitor: MonitorAdapter;
  interfaceId: string;
  deviceId: string;
  panelData: PanelDataType;
  automationComponent: string;
  interfaceName: string;
  attributeData: Map<string, AttributeData>;
  treeData: TreeData[];
  cols: { field: string; header: string; }[];
  selectedConnection$: Observable<BaseConnector>;
  isDeviceStateUnavailable$: Observable<boolean>;
  panelData$: Observable<PanelDataType>;
  clientDiagnosticData$;
  sessionName: string;
  showConnectionNotAvailable: boolean;
  selectedConnector: BaseConnector;
  private readonly subscriptions = new Subscription();
  private browseService: BrowseAdapter;
  public propertyPanelType = PropertyPanelType.CONNECTION;

  constructor(
    private readonly injector: Injector,
    private readonly cdr: ChangeDetectorRef,
    public facadeService: FacadeService
    ) { }



  ngOnInit(): void {
    /*
    * Dynamic columns passed as input to the properties panel
    *
    */
    this.cols = [
      { field: 'name', header: this.facadeService.translateService.instant('devices.titles.property') },
      { field: 'value', header: this.facadeService.translateService.instant('devices.titles.value') }
    ];
    /*
    * selected connection observable from common services
    *
    */
    this.selectedConnection$ = this.facadeService.editorService.selectedConnectionObs;
    /*
    * update client Diagnostic data on each connection and connectionMonitor data gets updated
    *
    */
    this.generateClientDiagnostic();
    /*
    * On device state change ,check if the selection connection related devices status change
    *
    */
    this.updateShowConnectionAvailable();
    /*
    * Listen to change in selected Connection ,until it is online
    *
    */
    this.selectedConnection$
      .pipe(
        takeWhile(() => this.facadeService.commonService.isOnline),
        filter(connector => {
          this.selectedConnector = connector;
          if (connector && connector.type === ConnectorType.CONNECTOR) {
            /* Make the connector not selected based upon the connection status */
            this.showConnectionNotAvailable = !this.facadeService.connectorService.isConnectedDevicesAvailable(connector as Connector);
            if(connector.inputAnchor && !isNullOrEmpty(connector.inputAnchor.deviceId))
            {
              const adapterType=this.facadeService.dataService.getAdapterType(connector.inputAnchor.deviceId);
              this.monitor = this.injector.get(DataAdapterManagers.getadapter(adapterType, AdapterMethods.MONITOR));
              this.browseService = this.injector.get(DataAdapterManagers.getadapter(adapterType, AdapterMethods.BROWSE));
              this.updateConnectorDetails(connector);
            }
          }
          /*
          *
          * Make session diagnostic data only for the first time ,when we come to online
             And connection status is true.Next time when selected connection is clicked ,use the
             data saved in the common and the sessionDiagnostic call can be prevented.
          */
          return (
           this.checkConnectorType(connector) &&
            this.facadeService.commonService.isOnline &&
            !this.monitor.getCachedServerDiagnosticData(connector.id));
        }),
        switchMap(connector => {
          let returnVal;
          if(connector.inputAnchor && !isNullOrEmpty(connector.inputAnchor.deviceId))
            {
              const adapterType=this.facadeService.dataService.getAdapterType(connector.inputAnchor.deviceId);
              this.monitor = this.injector.get(DataAdapterManagers.getadapter(adapterType, AdapterMethods.MONITOR));
              returnVal = this.monitor.getServerDiagnosticData(connector as Connector)
                .pipe(map(apiResponse => { return ({ connector, apiResponse }); }));
            }
          return returnVal;
        })
      )
      .subscribe(({ apiResponse, connector }) => {
        this.showConnectionNotAvailable = !this.facadeService.connectorService.isConnectedDevicesAvailable(connector as Connector);
        const serverDiagnosticData = apiResponse['data'].server;
        this.sessionName = serverDiagnosticData?.sessionName;
        this.monitor.setServerDiagnosticData(connector.id, serverDiagnosticData);
        if (this.sessionName && !this.monitor.getMonitorDataById(connector.id)) {
          this.attributeData = new Map<string, AttributeData>();
          this.treeData = this.getServerDiagnosticData(serverDiagnosticData, connector);
          this.setAttributeData(this.createCopy(this.treeData));
          this.registerTagsForMonitoring();
          this.treeData = this.removeChildrenValues(this.treeData);
          this.monitor.setServerDiagnosticMonitorData(connector.id, this.treeData);
          this.cdr.markForCheck();
        }
      });

  }

  /*
  * Function to check the connector type
  */
  checkConnectorType(connector:BaseConnector){
    return (!!connector &&
    connector?.type ===  ConnectorType.CONNECTOR && connector.connectionStatus);
  }

  /*
  * Returns the output anchor details for the connector
  */
  getOutputAnchorDetails(connector) {
    if (connector.outputAnchor.parentNode.type === FillingLineNodeType.AREA) {
      return { deviceId: connector.outputAnchor.deviceId };
    }
    return {
      deviceId: connector.outputAnchor.parentNode.deviceId
    };
  }
  /**
   * @param connector
   * get connector details and extract the output/target anchor details
   * for server diagnostic api call
   */
  updateConnectorDetails(connector) {
    const dataConnectionObject = getConnectionData(connector,null);
    this.interfaceId = connector.id;
    /* 
    * For generate Server diagnostic data , output anchor is
      taken
    */
    this.deviceId =  dataConnectionObject.server.deviceId;
    this.automationComponent = dataConnectionObject.server.automationComponent;
    this.interfaceName =  dataConnectionObject.server.interface;
    /* Get cached getConnectionMonitorData , if it is cached already with
      server Diagnostic data */
    if (this.monitor.getCachedServerDiagnosticData(connector.id)) {
      this.treeData = this.monitor.getMonitorDataById(connector.id);
    }
    /* IF the selected connector is gone offline/ or
      switched off then remove the connectorCachedData from
      the monitor map */
    if(!connector.connectionStatus){
      this.monitor.removeFromCachedServerMonitoringData(connector.id);
    }
    if (this.treeData?.length > 0) {
      this.facadeService.commonService.updatePropertyState(this.treeData, this.propertyPanelType);
    }
  }


  /**
   * update tag monitor Observable and
   * tagMonitorItems and listen to change in events
   */
  registerTagsForMonitoring() {
    const monitorItem: MonitorPayload = this.getMonitorItem();
    if (this.facadeService.commonService.isOnline) {
      this.setAllTagsChangeListeners();
      this.monitor.monitorTags(monitorItem).subscribe(_data => true);
    }
  }



  /**
  * Set Listeners for All Tag Change Event Emitted from Server via Monitor Service
  */
  setAllTagsChangeListeners() {
    const tagEventMap = this.monitor.tagMonitorObseravablesMap.get(getDeviceInterfaceName(this.deviceId, this.automationComponent, this.interfaceId));
    if (tagEventMap) {
      for (const event of tagEventMap?.keys()) {
        this.setTagValue(event, tagEventMap.get(event).value);
        tagEventMap.get(event).event.subscribe(value => {
          this.setTagValue(event, value);
        });
      }
    }
  }


  /**
  * Set Attribute Data
  * @param eventName Tag Event Name
  * @param value Value
  */
  setTagValue(eventName: string, value: number | string | unknown) {
    this.treeData = [...this.monitor.setTagValueFromMonitor(eventName, value, this.treeData)];
    this.treeData.forEach(item => {
      item.children = this.browseService.createPanelTreeData(item.children);
    }
    );
    this.cdr.markForCheck();
  }

  /**
   * @param treeData
   * add eventName in treeData ,eventName will be the unique value for monitoring
   * eventName is generated using getTagEventName based on target anchor details
   */
  setEventData(treeData) {
    return treeData.map(item => {
      item = JSON.parse(JSON.stringify(item));
      /* TO generate unique name for socket  */
      const eventName = getTagEventName(this.deviceId, this.automationComponent, this.interfaceId, 'SessionDiagnostics');
      item['eventName'] = eventName;
      item = this.facadeService.commonService.setExpandedState(item, this.propertyPanelType);
      if (item && item.hasOwnProperty('children')) {
        item.children = this.setEventData(item['children']);
      }
      return item;
    });
  }

  /*
  * Used to set the tree data
  */
  setAttributeData(properties: Array<PropertiesType>) {
    this.treeData = this.setEventData(properties);
  }
   /*
  * Create a copy of tree data
  */
  createCopy(data: Array<PropertiesType>): Array<PropertiesType> {
    return data.map(d => {
      let children = null;
      if (d.children) {
        children = d.children;
      }
      return {
        name: d.name,
        value: d.value,
        type: d.type,
        children: children
      };
    });
  }


  /**
   * format to key value pairs with name and value
   */
  formatToKeyValuePair(ele) {
    return Object.entries(ele).map(([name, value]) => ({ name, value, type: '' }));
  }


  /**
   * Format the api response (with dynamic key value pairs) into treeData structure
   */
  formatData(data) {
    return data.map(item => {
      item = { ...item };
      const { name, value } = item;
      if (item && typeof value === ObjectType.OBJECT) {
        item.children = (this.formatData(
          this.formatToKeyValuePair(value) as Array<PropertiesType>)
        );
      }
      item['data'] = {
        name: name,
        value: this.returnNullIfValueIsObject(item),
        type: ''
      };
      item.name = name;
      item.value = this.returnNullIfValueIsObject(item);
      return item;
    });
  }

  /**
   * @param item - tree data value
   * Assign null if the parent element have child property and value should be empty,since children will be collapsible
   */
  returnNullIfValueIsObject(item) {
    const { value } = item;
    if (typeof value === ObjectType.OBJECT) {
      return '';
    }
    return value;
  }

   /*
  * Returns the address of the connector object
  */
  getAddressFromConnectorObject(connector:Connector){
    const address = connector.relatedEndPoint.address;
    if(address && typeof address === ObjectType.OBJECT){
      return connector.relatedEndPoint.address['address'];
    }
    return address;
  }
  /**
   * @param connector - selected connector details by the user
   * generateClientDiagnostic data from connector details
   */
  generateClientDiagnosticData(connector) {
    const clientDiagnosticData: ClientDiagnosticData = {
      status: connector.connectionStatus,
      relatedEndpoint: this.getAddressFromConnectorObject(connector),
      detailedStatus: connector.detailedStatus
    };
    const { client } = getConnectionData(connector,null);
    return [{
      name: `Client interface :${client.automationComponent} > ${client.interface}`,
      value: '',
      type: '',
      children: this.formatData(this.formatToKeyValuePair(clientDiagnosticData) as PropertiesType[])
    }];
  }
  /**
   * Unsubscribe all the observable
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * @param serverDiagnosticData - data fetched from getServerDiagnostic api
   * @param connector- selected connector details by the user
   * Generate TreeData based on connector and getServerDiagnostic data
   */
  private getServerDiagnosticData(serverDiagnosticData, connector) {
    const { server } = getConnectionData(connector,null);
    return [{
      name: `Server interface :${server.automationComponent} > ${server.interface}`,
      value: '',
      type: '',
      children: this.formatData(this.formatToKeyValuePair(serverDiagnosticData) as PropertiesType[])
    }];
  }
  /**
   * On any device state change ,check if the selected connection related devices status got changed
   * Manually select the connector
   */
  private updateShowConnectionAvailable() {
    this.subscriptions.add(this.facadeService.commonService.deviceStateData.subscribe(_deviceState => {
      this.facadeService.connectorService.selectConnector(this.selectedConnector);
      this.showConnectionNotAvailable = !this.facadeService.connectorService.isConnectedDevicesAvailable(this.selectedConnector as Connector);
      this.cdr.markForCheck();
      if(!this.selectedConnector){
        this.monitor.resetServerMonitoringData();
      }
    }));
  }

  /**
   * update client Diagnostic data on each connection and connectionMonitor data gets updated
   */
  private generateClientDiagnostic() {
    this.clientDiagnosticData$ = combineLatest([
      this.facadeService.editorService.connectionMonitor$,
        this.facadeService.editorService.selectedConnectionObs
    ]).pipe(
      filter(([connectionMonitor, connector]) => Boolean(connector && connectionMonitor)),
      map(([_, connector]) => this.generateClientDiagnosticData(connector))
    );
  }

  /**
   * @param  treeData
   * Remove children value if it is an object to adjust with the Panel Tree data format
   */
  private removeChildrenValues(treeData) {
    return treeData.map(item => {
      item = { ...item };
      item['data'] = { name: item.name, type: item.type, value: item?.value };
      if (item && item.hasOwnProperty('children')) {
        /* If it is an object,then recursively get all the children and
            can make the item.data.value to empty */
        if (typeof item.value === ObjectType.OBJECT) {
          item.children = (this.formatData(
            this.formatToKeyValuePair(item.value) as Array<PropertiesType>)
          );
        }
        item.data.value = '';
      }
      return item;
    });
  }

  /**
   * get list of all monitorItem from tagMonitorItemsMap,
   * if it is empty,will be generated using setTagMonitorItems
   */
  private getMonitorItem(): MonitorPayload {
    let tagMonitorItem: MonitorPayload = this.monitor.getTagMonitorItems(this.deviceId, this.automationComponent, this.interfaceId);
    if (!tagMonitorItem) {
      const nodeList: Array<MonitorNode> = this.getMonitorConnectionList(
        this.setEventData([
          {
            name: ServerDiagnostics.SESSION_DIAGNOSTIC_DATA
          }
        ])
      );

      /*Sets Tag monitor map*/
      this.monitor.setTagMonitorItems(
        this.deviceId,
        this.automationComponent,
        this.interfaceId,
        this.interfaceName,
        nodeList,
        MONITORTYPE.SERVERCONNECTIONDIAGNOSTICS,
        this.sessionName
      );
      tagMonitorItem = this.monitor.getTagMonitorItems(this.deviceId, this.automationComponent, this.interfaceId);
    }
    return tagMonitorItem;
  }

  /**
   * Creates Monitor Param(node) List,sets tag event observable and its listener in Monitor Service
   * @param attributeList
   */
  private getMonitorConnectionList(attributeList): Array<MonitorNode> {
    const monitorNodeList: Array<MonitorNode> = [];
    attributeList.forEach(item => {
      const eventName = item.eventName;
      monitorNodeList.push({ eventName: eventName, propertyName: item.name });
      /* Sets monitor tag  observable for a connection in Monitor Service Map*/
      this.monitor.setTagObservable(this.deviceId, this.automationComponent, this.interfaceId, eventName);
      /* Add listeners on the tag Event Socket IO call- of connection From Server*/
      this.monitor.setTagChangeListener(this.deviceId, this.automationComponent, this.interfaceId, eventName);
    });
    return monitorNodeList;
  }
   /*
  * Returns true if its a connector
  */
  get isConnector(){
    return Boolean(this.selectedConnector && this.selectedConnector?.type ===  ConnectorType.CONNECTOR);
  }
   /*
  * Returns true if the connection is not online
  */
  get isConnectionNotOnline(){
    return Boolean(this.selectedConnector && this.selectedConnector.state === ConnectorState.Default);
  }

  /*
  * Returns true if the connection properties has to be shown
  */
  get showConnectionProperties(){
    return !this.showConnectionNotAvailable && this.isConnector && !this.isConnectionNotOnline;
  }
}


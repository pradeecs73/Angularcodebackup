/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { of } from 'rxjs';
import { ConnectorCreationMode, ConnectorType, DeviceState, FillingLineNodeType } from 'src/app/enum/enum';
import { FacadeService } from 'src/app/livelink-editor/services/facade.service';

export let monitorAdapterMockData = {
  overlayService: {
    loader: () => true,
    clearOverlayData: () => true
  },
  translateService: {
    instant: () => true
  },
  applicationStateService: {
    changeApplicationStatus: () => true
  },
  commonService: {
    isOnline: true,
    disableHomeAndDeviceIcons: () => true,
    changeDeviceState: () => true
  },
  dataService: {
    updateConnectionEndPointDetails: () => true,
    getDeviceByAcID: () => {
      return { state: DeviceState.UNAVAILABLE };
    },
    updateDeviceState: () => true,
    getDevice: () => true,
    resetConnectionMonitorValuesForAllDevices: () => true,
    isDeviceAvailable: () => false,
    getProjectId: () => 'project12345',
    resetConnectionEndPointDetails: () => true,
    getDeviceState: () => true,
    getOnlineConnectionByACID:() => {return {id: "area_ljwxdis8__7b15a85a-869a-496e-a0e1-50cc80e07625_TGlxdWlkTWl4aW5n__FillToMix_Type"}},
    getNodeByAddress:()=>[{}],
    deleteConnection:()=>true,
    getNodeByID:()=>{
      return {parent:'root'}
    },
    getClientInterfaceByInterfaceId:()=>{
        return {type: 'client',isClientInterface:true }
    },
    getMappedCompatibleInterfaceByType:()=>[{name: 'device12345',uid:'device12345'}]

  },
  drawService: {
    removeOnlineConnections: () => true,
    removeOnlineSubConnections: () => true,
    applyStyleToEditor: () => true,
    updateAndStyleConnector: () => true,
    createOnlineConnection: () => true
  },
  editorService: {
    getExistingSubConnectorById:()=>true,
    resetMultiSelectedConnection: () => true,
    setSelectedConnection: () => true,
    getEditorContext: () => { return { id: 'parent678910' }; },
    liveLinkEditor: {
      editorNodes: [{ type: FillingLineNodeType.NODE, deviceId: 'device12345' }],
      entities: {
        ids: ['entity12345'],
        entities: { 'entity12345': {} }
      }
    },
    getAreaWithDeviceInterfaces: () => true,
    getBaseConnector: () => { return { type: ConnectorType.CONNECTOR, creationMode: ConnectorCreationMode.MANUAL }; },
    updateConnectionMonitor: () => true,
    isRootEditor: () => false
  },
  apiService: {
    goOffLine: () => of({}),
    subscribeTo: () => true
  },
  notificationService: {
    notificationList: [],
    pushNotificationToPopup: () => true
  },
  deviceService: {
    updateDevicesData: () => true
  },
  errorHandleService: {
    updateNotificationPanel: () => true
  },

  connectionService:{
    updateEndpointDataAndconnectionState:()=>true
  },

  areaUtilityService:{
    getCommonParent:()=>{
      return {sourceAreaHierarchy:[{}],targetAreaHierarchy:[{}]}
    },
    getSourceTargetDevice:()=>{
      return {sourceHierarchy:[{}],targetHierarchy:[{}],sourceAcId:'source12345',targetAcId:'target12345'}
    },
    getScenario:()=>{}
  },

  strategyManagerService:{
    executeStrategy:()=>{}
  }

} as unknown as FacadeService;

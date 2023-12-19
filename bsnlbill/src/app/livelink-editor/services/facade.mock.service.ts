/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';

import { ApplicationStateService } from '../../services/application-state.service';

import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DeviceService } from '../../devices/services/device.service';
import { MonitorAdapter } from '../../opcua/adapter/base-adapter/monitor-adapter';
import { PlantAreaService } from '../../opcua/opcnodes/area';
import { ConnectorService } from '../../opcua/opcnodes/connector';
import { HTMLNodeService } from '../../opcua/opcnodes/htmlNode';
import { NodeAnchorService } from '../../opcua/opcnodes/node-anchor';
import { OPCNodeService } from '../../opcua/opcnodes/opcnode';
import { SubConnectorService } from '../../opcua/opcnodes/subConnector';
import { ConnectionService } from '../../opcua/opcua-services/connection.service';
import { EditorService } from '../../opcua/opcua-services/livelink-editor.service';
import { AlignConnectionsService } from '../../services/align-connections.service';
import { ApiService } from '../../services/api.service';
import { AreaUtilityService } from '../../services/area-utility.service';
import { DeviceStoreService } from '../../services/device-store.service';
import { DrawService } from '../../services/draw.service';
import { FillingLineService } from '../../services/filling-line-store.service';
import { MenuService } from '../../services/menu.service';
import { NotifcationService } from '../../services/notifcation.service';
import { ResizeService } from '../../services/resize.service';
import { SaveProjectService } from '../../services/save-project.service';
import { SocketService } from '../../services/socket.service';
import { ProjectDataService } from '../../shared/services/dataservice/project-data.service';
import { OverlayService } from '../../shared/services/overlay.service';
import { DragDropService } from './../../livelink-editor/services/drag-drop.service';
import { CommonService } from './../../services/common.service';
import { ErrorHandleService } from './../../services/error-handle.service';
import { ZoomOperationsService } from './../../services/zoom-operations.service';
import { StrategyManagerService } from './strategy-manager.service';

@Injectable({
  providedIn: 'root'
})

export class FacadeMockService {

  public testAlignConnectionService: AlignConnectionsService;
  public testApiService: ApiService;
  public testApplicationService: ApplicationStateService;
  public testAreaService: AreaUtilityService;
  public testCommonService: CommonService;
  public testConnectionService: ConnectionService;
  public testConnectorService: ConnectorService;
  public testDeviceStoreService: DeviceStoreService;
  public testDragDropService: DragDropService;
  public testDrawService: DrawService;
  public testEditorService: EditorService;
  public testErrorHandleService: ErrorHandleService;
  public testFillingLineService: FillingLineService;
  public testHtmlNodeService: HTMLNodeService;
  public testMenuService: MenuService;
  public testNodeAnchorService: NodeAnchorService;
  public testNotificationService: NotifcationService;
  public testOverlayService: OverlayService;
  public testPlantAreaService: PlantAreaService;
  public testProjectDataService: ProjectDataService;
  public testResizeService: ResizeService;
  public testSaveProjectService: SaveProjectService;
  public testStrategyManagerService: StrategyManagerService;
  public testStratergyManagerService: StrategyManagerService;
  public testsubConnectorService: SubConnectorService;
  public testDeviceService: DeviceService;
  public testSocketService: SocketService;
  public testOPCNodeService: OPCNodeService;
  public testtranslateService : TranslateService;
  public testMonitorService:MonitorAdapter;
  public testZoomOperationService:ZoomOperationsService;

  /*
  * Sub connector service
  *
  */
  get subConnectorService(): SubConnectorService {
    /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testsubConnectorService) {
      this.testsubConnectorService = jasmine.createSpyObj([
        'remove',
        'removeSubConnectionFromLookupByAreaId',
        'removeSubConnectionFromLookUpById',
        'createSubConnector',
        'connect',
        'updateHandle',
        'removeSubConnection',
        'updateSubConnector',
        'updateSubConnection',
        'updateSubConnectionsWithConnectionId',
        'removeOnlyFromLookup'
      ]);
    }
    return this.testsubConnectorService;
  }
   /*
  * Device service
   *
  */
  get deviceService(): DeviceService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testDeviceService) {
      this.testDeviceService = jasmine.createSpyObj([
        'generatePayloadForUpdateDevice',
        'handleBrowseErrorNotification',
        'setDeviceDetails',
        'updateBasedOnProperty'
      ]);
    }
    return this.testDeviceService;
  }

 /*
  * Plant area service
 *
  */
  get plantAreaService(): PlantAreaService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testPlantAreaService) {
      this.testPlantAreaService = jasmine.createSpyObj([
        'updateArea',
        'updateInterfaceDetailsToServiceNStore',
        'getParentOfAreaByAreaId',
        'removeNodeIdfromArea',
        'updateNodeMoveData',
        'updateNodeIdsInAreaData',
        'removeAllAreaConnectionsFromEditor',
        'updateAreaInterfaces'
      ]);
    }
    return this.testPlantAreaService;
  }
   /*
  * html node service
   *
  */
  get htmlNodeService(): HTMLNodeService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testHtmlNodeService) {
      this.testHtmlNodeService = jasmine.createSpyObj([
        'update', 'onDrag', 'onClickHtmlNode', 'addAnchors', 'updateAreaElement','updateNodeMoveData'
      ]);
    }
    return this.testHtmlNodeService;
  }
   /*
  *  node anchor service
   *
  */
  get anchorService(): NodeAnchorService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testNodeAnchorService) {
      this.testNodeAnchorService = jasmine.createSpyObj([
        'createAnchor',
        'removeAllConnectionsFromEditor',
        'getAreaInterfaceDetails'
      ]);
    }
    return this.testNodeAnchorService;
  }
  /*
  * connector service
  *
  */
  get connectorService(): ConnectorService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testConnectorService) {
      this.testConnectorService = jasmine.createSpyObj([
        'selectConnector',
        'setUnSelectedStyle',
        'setSelectedStyle',
        'remove',
        'updateSubConnection',
        'isConnectedDevicesAvailable',
        'deSelectAllProposedCon',
        'removeConnectionFromCurrectEditor',
        'resetConnectionList',
        'createConnector',
        'updateAreaConnectorData',
        'updateConnector',
        'connect',
        'updateConnectorUnavailableData'
      ]);
    }
    return this.testConnectorService;
  }
  /*
  * align connection service
  *
  */
  get alignConnectionService(): AlignConnectionsService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testAlignConnectionService) {
      this.testAlignConnectionService = jasmine.createSpyObj([
        'alignConnections'
      ]);
    }
    return this.testAlignConnectionService;
  }
  /*
  *  notification service
  *
  */
  get notificationService(): NotifcationService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testNotificationService) {
      this.testNotificationService = jasmine.createSpyObj([
        'pushNotificationToPopup',
        'clearNotifications'
      ]);
    }
    return this.testNotificationService;
  }
  /*
  *  stratergy manager service
  *
  */
  get strategyManagerService(): StrategyManagerService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testStrategyManagerService) {
      this.testStrategyManagerService = jasmine.createSpyObj([
        'executeStrategy'
      ]);
    }
    return this.testStrategyManagerService;
  }

  /*
  *  application service
  *
  */
  get applicationStateService(): ApplicationStateService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testApplicationService) {
      this.testApplicationService = jasmine.createSpyObj([
        'changeApplicationStatus',
        'dragNode',
        'saveProject',
        'selectMenu',
        'unGroupArea',
        'dropInterface',
        'createArea',
        'reOrderArea',
        'deleteArea',
        'isOnline',
        'showDeviceUnavailable',
        'getStatus',
        'dropNodeToTree',
        'dropNode',
        'dragFromTreeMenu',
        'establishConenction',
        'showDeleteACIcon',
        'showConnectionDeleteOption',
        'drawCanvas',
        'deleteConnection',
        'deleteConnectionInonlineAndProject',
        'deleteNode',
        'updateConnectorStatus',
        'styleConnection',
        'styleEditorNode'
      ]);
    }
    return this.testApplicationService;
  }
  /*
  *  save service
  *
  */
  get saveService(): SaveProjectService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testSaveProjectService) {
      this.testSaveProjectService = jasmine.createSpyObj('SaveProjectService', [{ 'syncCacheDataFromStore': of({}) },
        'removeDevices',
        'saveProject',
        'clearOnUnload',
        'updateProjectListInGrid',
        'changeSaveASState',
        'cleanProjectData',
        'saveProjectAndClearSessions',
        'changeEditState',
        'redirectHomePage',
      { 'openedProject': null },
      { setEditorData: null },
        'projectList',
        'openedProjects',
        'setProjectData',
      { 'syncCacheDataFromStore': of({}) },
        'devices',
        'clearLastOpenedProject'
      ]);
    }
    return this.testSaveProjectService;
  }
  /*
  *  common service service
  *
  */
  get commonService(): CommonService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testCommonService) {
      this.testCommonService = jasmine.createSpyObj('CommonService', [
        'authenticationPopUpState',
        'changeDeviceState',
        'changeErrorCountStatus',
        'setMousePosition',
        'handleTimeout',
        'changeErrorIconVisibility',
        'setExpandedState',
        'drawCanvasForOnlineAndOffline',
        'changePanelData',
        'updatePropertyState',
        'displayExceptionPopup',
        'changeSaveStatus',
        'formatDate',
        'deviceStateData',
        'selectedMenuTree',
        'disableHomeAndDeviceIcons',
        'disableHomeAndDeviceViewIconsSub',
        'displayServerExceptionPopup',
        'editorHasNoDevice',
        'showAuthenticationPopupState',
        'errorCountStatusObs',
        'errorIconVisibilityChange',
        'globalConnectionList',
        'isExistingProjectLoading',
        'isOnline',
        'monitorPanelData',
        'setActiveTabState',
        'selectedDeviceAdditionType',
        'selectedProject',
        'setErrorIcon',
        'setIsMultiSelected',
        'setSelectedConnection',
        'setSelectedDeviceId',
        'setSelectedDeviceId',
        'setUploadNodeSetFileStatus',
        'targetBtnVisibilityChange',
        'updateDeviceAdditionType',
        'updateDevicesListInGrid',
        'updateMenu',
        'updateMenu',
        'updateMenuItem',
        'updateMenuItemObs',
        'updateNavigationToAnother',
        'uploadingFilesStatusMessage$',
        'viewErrorBtn',
        'zoomPercentObs',
        'projectRegex',
        'setProjectRegex',
        { 'isExistingProjectLoading': null },
        'changeZoomPercent',
        'setSessionAndStartTimerDuration',
        'errorIcon',
        'changeTargetBtn',
        'onLangChange',
        { executionErrorsList: [] },
        'closeProject',
        'setShowProjectProtectionModel',
        'isActualConnectionMode',
        'isConnectionMultiSelect',
        'resetDeviceScanningCount',
        'scannedDevicesList$',
        'scanningDevicesCount$',
        'fitToHeightScaling'
      ]);
      this.testCommonService.allErrorCodeList = [];
    }
    return this.testCommonService;
  }
  /*
  * drag drop service
  *
  */
  get dragdropService(): DragDropService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testDragDropService) {
      this.testDragDropService = jasmine.createSpyObj('DragDropService', ['drag', 'dropInterface', 'drop', 'dropToFillingLine', 'dragFromTreeMenu']);
    }
    return this.testDragDropService;
  }
  /*
  * draw service
  *
  */
  get drawService(): DrawService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testDrawService) {
      this.testDrawService = jasmine.createSpyObj('DrawService', [
        'drawDeviceNode',
        'removeNode',
        'redrawAreaNode',
        'resizeCanvas',
        'setCanvas',
        'removeAreaConnectionsFromEditor',
        'assignNodetoArea',
        'removeNode',
        'zoomSubscription',
        'cleanTheEditor',
        'draw',
        'drawArea',
        'updateAreaReassignment',
        'removeConnections',
        'deleteArea',
        'createArea',
        'resetEditorConnectionOffline',
        'resetEditorConnectionOnline',
        'removeOnlineExposedInterfacesAndSubConnections'
      ]);
    }
    return this.testDrawService;
  }
  /*
  * menu service
  *
  */
  get menuService(): MenuService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testMenuService) {
     this.testMenuService = jasmine.createSpyObj('MenuService', [
      'updateStylingForPlantViewIconActive',
      'selectMenu',
      'updateMenuIconsOnline',
      'updateMenuIconsOffline',
      'disableMenuItem'
     ]);
    }
    return this.testMenuService;
  }
  /*
  * connection service
  *
  */
  get connectionService(): ConnectionService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testConnectionService) {
      this.testConnectionService = jasmine.createSpyObj('ConnectionService', ['deleteOfflineConnection',
       'deleteConnectionFromServer',
       'establishConnection',
      'updateEndpointDataAndconnectionState']);
    }
    return this.testConnectionService;

  }
  /*
  * editor service
  *
  */
  get editorService(): EditorService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testEditorService) {
      this.testEditorService = jasmine.createSpyObj('EditorService', [
        'addOrUpdateToSubConnectorLookup',
        'addHTMLNode',
        'addNode',
        'connectionMonitor$',
        'deselectAllNodes',
        'editorContext',
        'getCurrentAreaHierarchy',
        'getEditorContext',
        'getExistingSubConnectorById',
        'resetMultiSelectedSubConnection',
        'isRootEditor',
        'liveLinkEditor',
        'removeNode',
        'resetMultiSelectedConnection',
        'selectedAreaData',
        'selectedNode',
        'setDevicePropertyPanelData',
        'setIsMultiSelected',
        'setNextAreaNumber',
        'setSelectedConnection',
        'sourceAreaHierarchy',
        'toggleAnchorSelection',
        'updateHTMLNode',
        'updateNode',
        'updatePlantNodeorArea',
        'deselectAllConnectors',
        'deselectAllSubConnectors',
        'setSidePanelData',
        'removeConnectionFromSelectedConnection',
        'addOrUpdateToConenctorLookup',
        'setDeviceTreePanelData',
        'removeFromConnectorLookup',
        'addToConnectorPool',
        'removeFromLinkGroup',
        'addtoLinkGroup',
        'resetEditor',
        'removeNode',
        'removeFromConnectorPool',
        'doesConnectionExist',
        'selectedConnection',
        'updateEntities',
        'removeConnectionFromConnectorLookup',
        'updateHTMLNodes',
        'getExistingConnection',
        'removeFromSubConnectorLookup',
        'addOrUpdateMultiSelectSubConnector',
        'setSubConnectionViewType',
        'addOrUpdateMultiSelectConnector'
      ]);
    }
    return this.testEditorService;

  }
  /*
  * area utitlity service
  *
  */
  get areaUtilityService(): AreaUtilityService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testAreaService) {
      this.testAreaService = jasmine.createSpyObj('AreaService', [
        'deleteAreaConfirmation',
        'deleteExposeConnectionByAreaIdAndType',
        'drawAreaInterfaceAndConnector',
        'exposeConnectionInParentArea',
        'exposeInterface',
        'updateAreaInEditor',
        'updateNodesInEditor',
        'reOrderArea',
        'updateParentIfMissing',
        'nodeSelect',
        'findConnectionInAndOut',
        'generateInitialConnectionObject',
        'getAreaHierarchy',
        'getAreaHierarchy',
        'getCommonParent',
        'getScenario',
        'getSourceTargetDevice',
        'isTargetConnectionNested',
        'ungroupArea',
        'updateAreaClientAndServerInterfaces',
        'updateAreaFillingLine',
        'updateAreaFillingLineDragNode',
        'updateNodeConnectionsToArea',
        'updateNodeConnectionToArea',
        'updateNodesInEditor',
        'updateSubConenctionsWithConenctionId',
        'removeFromExposeConnectionsParentOrChild',
        'getExposeInterfaceDetails',
        'updateExposedInterfaceUptoTargetArea',
        'getAreaName',
        'validateCommonParentWithCurrentEditor',
        'removeInteractionEvents',
        'removeSubConnection',
        'unGroupAreaConfirmation',
        'updateInterfaceExposedMode'
      ]);
    }

    return this.testAreaService;

  }
  /*
  *  data service
  *
  */
  get dataService(): ProjectDataService {
     /*
    * If the spy object doesn't exists create a new spy object
     *
    */
    if (!this.testProjectDataService) {

      this.testProjectDataService = jasmine.createSpyObj('ProjectDataService', [
        { setProjectData: () => { } },
        'addArea',
        'addConnection',
        'addNode',
        'addOrUpdateConnection',
        'addOrUpdateSubConnection',
        'clearProjectData',
        'deleteArea',
        'deleteConnection',
        'deleteConnectionIfNotMatching',
        'deleteDeviceConnections',
        'deleteNode',
        'deleteNodeConnections',
        'deleteNodeConnectionsOfSubConnection',
        'deleteSubConnection',
        'deleteSubConnectionByAreaId',
        'getAdapterType',
        'getAllAreas',
        'getAllAreas',
        'getAllAssociatedSubConnections',
        'getAllConnections',
        'getAllNodes',
        'getAllSubConnections',
        'getArea',
        'getAreaAllConnections',
        'getAreaByParent',
        'getAreaClientInterface',
        'getAreaClientInterfaces',
        'getAreaConnections',
        'getAreaServerInterface',
        'getAreaServerInterfaces',
        'getAreaSubConnections',
        'getAreaSubConnections',
        'getAutomationComponent',
        'getAutomationComponents',
        'getClientInterface',
        'getClientInterfaceDetailsById',
        'getClientInterfaceIdDetailsById',
        'getClientInterfaceList',
        'getConnection',
        'getConnectionByAcID',
        'getConnectionByACIDAndInterfaceID',
        'getConnectionEndPointData',
        'getConnectionListByNodeId',
        'getDevice',
        'getDeviceAddress',
        'getDeviceByAddress',
        'getDevices',
        'getDeviceState',
        'getExistingDeviceDetails',
        'getExistingInterfaceDetailsByDeviceId',
        'getMappedCompatibleInterfaceByType',
        'getNodeByID',
        'getProjectData',
        'getProjectDataAsSaveJson',
        'getProjectId',
        'getProjectName',
        'getProjectTree',
        'getServerInterface',
        'getServerInterfaceDetailsById',
        'getServerInterfaceIdDetailsById',
        'getServerInterfaceList',
        'getSubConnection',
        'getSubConnectionByData',
        'haveReadAccess',
        'isCurrentProjectProtected',
        'removeArea',
        'removeInterfaceIdsFromArea',
        'removeSubConnectorsByNodeID',
        'resetConnectionEndPointDetails',
        'setAccessType',
        'setDefaultState',
        'setDevice',
        'setDevices',
        'setHaveReadAccess',
        'setProjectData',
        'setProjectMetaData',
        'updateArea',
        'updateAreaInterfaceExposedMode',
        'updateConnection',
        'updateConnectionBasedOnDeviceStatus',
        'updateConnectionEndPointDetails',
        'updateDeviceState',
        'updateInterface',
        'updateInterfaceIds',
        'resetConnectionEndPointDetails',
        'getAreaSubConnections',
        'getAllSubConnections',
        'addNode',
        'getAreaAllConnections',
        'getAllConnections',
        'getDeviceByAddress',
        'getAdapterType',
        'getClientInterfaceIdDetailsById',
        'getServerInterfaceIdDetailsById',
        'deleteSubConnection',
        'getScanSettingsData',
        'updateNode',
        'updateNodeParent',
        'updateProtectionToProject',
        'updateSubConnection',
        'getSubConnectionsByCategoryAndInterfaceType',
        'getAreaSubConnectionsByCategory',
        'getClientInterfaceByInterfaceId'
      ]);

    }

    return this.testProjectDataService;

  }
  /*
  * api service
  *
  */
  get apiService(): ApiService {
     /*
    * If the spy object doesn't exists create a new spy object
     *
    */
    if (!this.testApiService) {
      this.testApiService = jasmine.createSpyObj('ApiService', [
        { saveProject: of(true) },
        'saveProject',
        'closeProject',
        'createProject',
        'goOffLine',
        'getConfig',
        'isOnline',
        'getLanguage',
        'setLanguage',
        'deviceAuthenticate',
        'deleteOpcConnection',
        'getServerDiagnosticData',
        'projecNameValidationRegex',
        'importProject',
        'validateProject',
        'deviceUrlValidatioRegex',
        'updateProject',
        'browseDevices',
        'deleteDevice',
        'getUploadNodeSetFilesUpdate',
        'uploadXMLfiles',
        'projectNameValidationRegex',
        'updateDeviceDetails',
        'deviceAuthenticate',
        'fetchRecentProjects',
        'getProjectData',
        'closeProject',
        'connectToOpc',
        'registerPassword',
        'changeProjectPassword',
        'removePasswordProtection',
        'deleteProject',
        'clearSessions',
        'idleTimeout',
        'updateScanningDeviceInRealTime',
        'cancelScanningDevice',
        'scanDevice',
        'listenToScanningOfDevices',
        'unsubscribeToScanningDevicesEvents'

      ]);
    }
    return this.testApiService;
  }
  /*
  *  device store service
  *
  */
  get deviceStoreService(): DeviceStoreService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testDeviceStoreService) {
      this.testDeviceStoreService = jasmine.createSpyObj('DeviceStoreService', [
        'fetchDeviceTreeNodes',
        'getDeviceTree'
      ]);
    }
    return this.testDeviceStoreService;
  }
  /*
  * translate service
  *
  */
  get translateService(): TranslateService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testtranslateService) {
      this.testtranslateService = jasmine.createSpyObj('TranslateService', [
        'instant','get','addLangs','use'
      ]);
    }
    return this.testtranslateService;
  }
  /*
  * filling line service
  *
  */
  get fillingLineService(): FillingLineService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testFillingLineService) {
      this.testFillingLineService = jasmine.createSpyObj('FillingLineService', [
        'clearFillingLine',
        'getFillingLine',
        'createFillingAreaData',
        'selectDevice',
        'updateArea',
        'deleteArea',
        'updateNode',
        'getFillingAreaData',
        'createAreaList',
        'getFillingNodeData',
        'createNodeList',
        'deselectDevices',
        'getUpdatedNodeData',
        'deleteNode'
      ]);
    }
    return this.testFillingLineService;
  }
  /*
  *  overlay service
  *
  */
  get overlayService(): OverlayService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testOverlayService) {
      this.testOverlayService = jasmine.createSpyObj('OverlayService', [
        'changeOverlayState',
        'confirm',
        'information',
        'loader',
        'success',
        'warning',
        'error',
        'clearOverlayData'
      ]);
    }
    return this.testOverlayService;
  }
  /*
  *  error handle service
  *
  */
  get errorHandleService(): ErrorHandleService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testErrorHandleService) {
      this.testErrorHandleService = jasmine.createSpyObj('ErrorHandleService', [
        'handleServerCrashError',
        'executionErrorsList',
        'updateErrorList'
      ]);
    }
    return this.testErrorHandleService;
  }
  /*
  *  resize service
  *
  */
  get resizeService(): ResizeService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testResizeService) {
      this.testResizeService = jasmine.createSpyObj('ResizeService', ['resizeEditorWidth','resizeDeviceWidth']);
    }
    return this.testResizeService;
  }
  /*
  *  socket service
  *
  */
  get socketService(): SocketService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testSocketService) {
      this.testSocketService = jasmine.createSpyObj([
        'initSocket',
        'getIo',
        'emitEditorAreaEvent',
        'emitEditorDataEvent'
      ]);
    }
    return this.testSocketService;
  }
  /*
  * opc node service
  *
  */
  get opcNodeService(): OPCNodeService {
     /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testOPCNodeService) {
      this.testOPCNodeService = jasmine.createSpyObj([
        'updateNodeMoveData',
        'updateState'
      ]);
    }
    return this.testOPCNodeService;
}

getMonitorService(): MonitorAdapter {

  if (!this.testMonitorService) {
    this.testMonitorService = jasmine.createSpyObj([
      'handleConnectionMonitoringForOuterArea'
    ]);
  }
  return this.testMonitorService;

}

get zoomOperationsService(): ZoomOperationsService {

      /*
    * If the spy object doesn't exists create a new spy object
    */
    if (!this.testZoomOperationService) {
      this.testZoomOperationService = jasmine.createSpyObj([
        'zoomPercentObs',
        'zoomPercentChange',
        'setZoomIn',
        'setZoomOut',
        'changeZoomPercent',
        'setZoomPercent',
        'adjustNodesInEditorForSelectedZoom',
        'fitToHeightScaling',
        'selectedZoomPercent',
        'drawCanvasForOnlineAndOffline',
        'setSubconnectionAllignment'
      ]);
    }
    return this.testZoomOperationService;

 }

}

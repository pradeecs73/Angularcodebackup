/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable, Injector } from '@angular/core';
import { AdapterMethods } from '../../enum/enum';
import { DataAdapterManagers } from '../../opcua/adapter/adapter-manager';
import { MonitorAdapter } from '../../opcua/adapter/base-adapter/monitor-adapter';
import { DeviceService } from '../../devices/services/device.service';
import { PlantAreaService } from '../../opcua/opcnodes/area';
import { ConnectorService } from '../../opcua/opcnodes/connector';
import { NodeAnchorService } from '../../opcua/opcnodes/node-anchor';
import { OPCNodeService } from '../../opcua/opcnodes/opcnode';
import { SubConnectorService } from '../../opcua/opcnodes/subConnector';
import { ConnectionService } from '../../opcua/opcua-services/connection.service';
import { EditorService } from '../../opcua/opcua-services/livelink-editor.service';
import { DragDropService } from '../../livelink-editor/services/drag-drop.service';
import { AlignConnectionsService } from '../../services/align-connections.service';
import { ApiService } from '../../services/api.service';
import { ApplicationStateService } from '../../services/application-state.service';
import { AreaUtilityService } from '../../services/area-utility.service';
import { CommonService } from '../../services/common.service';
import { DeviceStoreService } from '../../services/device-store.service';
import { DrawService } from '../../services/draw.service';
import { FillingLineService } from '../../services/filling-line-store.service';
import { MenuService } from '../../services/menu.service';
import { NotifcationService } from '../../services/notifcation.service';
import { ResizeService } from '../../services/resize.service';
import { SaveProjectService } from '../../services/save-project.service';
import { XmlParsingHelperService } from '../../services/xml-parsing-helper.service';
import { ProjectDataService } from '../../shared/services/dataservice/project-data.service';
import { OverlayService } from '../../shared/services/overlay.service';
import { ErrorHandleService } from './../../services/error-handle.service';
import { StrategyManagerService } from './strategy-manager.service';
import { SocketService } from '../../services/socket.service';
import { TranslateService } from '@ngx-translate/core';
import { HTMLNodeService } from '../../opcua/opcnodes/htmlNode';
import { ZoomOperationsService } from '../../services/zoom-operations.service';
import { languages } from '../../utility/constant';

@Injectable({
    providedIn: 'root'
})
export class FacadeService {

    private _applicationService: ApplicationStateService;
    private _areaUtilityService: AreaUtilityService;
    private _strategyManagerService: StrategyManagerService;

    private _opcNodeService: OPCNodeService;
    private _plantAreaService: PlantAreaService;
    private _nodeAnchorService: NodeAnchorService;
    private _connectorService: ConnectorService;
    private _subConnectorService: SubConnectorService;

    private _dataService: ProjectDataService;
    private _overlayService: OverlayService;
    private _commonService: CommonService;
    private _drawService: DrawService;
    private _editorService: EditorService;
    private _fillingLineService: FillingLineService;
    private _saveService: SaveProjectService;
    private _menuService: MenuService;
    private _dragDropService: DragDropService;
    private _connectionService: ConnectionService;
    private _apiService: ApiService;
    private _deviceStoreService: DeviceStoreService;
    private _errorHandleService: ErrorHandleService;
    private _resizeService: ResizeService;
    private _xmlHelperService: XmlParsingHelperService;
    private _alignService: AlignConnectionsService;
    private _anchorService: NodeAnchorService;
    private _deviceService: DeviceService;
    private _notificationService: NotifcationService;
    public _monitorService: MonitorAdapter;
    private _socketService: SocketService;
    private _translateService: TranslateService;
    private _htmlNodeService: HTMLNodeService;
    private _zoomOperationService: ZoomOperationsService;

    constructor(readonly injector: Injector
    ) {

    }
    /*
    *Html Node Service
    */
    get htmlNodeService(): HTMLNodeService {
        if (!this._htmlNodeService) {
            this._htmlNodeService = this.injector.get(HTMLNodeService);
        }
        return this._htmlNodeService;
    }
    /*
    * Anchor Service
    */
    get anchorService(): NodeAnchorService {
        if (!this._anchorService) {
            this._anchorService = this.injector.get(NodeAnchorService);
        }
        return this._anchorService;
    }
    /*
    *Translate Service
   */
    get translateService(): TranslateService {
        if (!this._translateService) {
            this._translateService = this.injector.get(TranslateService);
            this._translateService.currentLang =languages[0].value;
        }
        return this._translateService;
    }
    /*
    *Device Service
   */
    get deviceService(): DeviceService {
        if (!this._deviceService) {
            this._deviceService = this.injector.get(DeviceService);
        }
        return this._deviceService;
    }
    /*
   *Application state Service
   */
    get applicationStateService(): ApplicationStateService {
        if (!this._applicationService) {
            this._applicationService = this.injector.get(ApplicationStateService);
        }
        return this._applicationService;
    }
    /*
   *Area utility Service
   */
    get areaUtilityService(): AreaUtilityService {
        if (!this._areaUtilityService) {
            this._areaUtilityService = this.injector.get(AreaUtilityService);
        }
        return this._areaUtilityService;
    }
    /*
    *Stratergy manager Service
   */
    get strategyManagerService(): StrategyManagerService {
        if (!this._strategyManagerService) {
            this._strategyManagerService = this.injector.get(StrategyManagerService);
        }
        return this._strategyManagerService;
    }
    /*
    *Sub connector Service
   */
    get subConnectorService(): SubConnectorService {
        if (!this._subConnectorService) {
            this._subConnectorService = this.injector.get(SubConnectorService);
        }
        return this._subConnectorService;
    }
    /*
    *Connector Service
   */
    get connectorService(): ConnectorService {
        if (!this._connectorService) {
            this._connectorService = this.injector.get(ConnectorService);
        }
        return this._connectorService;
    }
    /*
    *Data Service
   */
    get dataService(): ProjectDataService {
        if (!this._dataService) {
            this._dataService = this.injector.get(ProjectDataService);
        }
        return this._dataService;
    }
    /*
    *plant area Service
   */
    get plantAreaService(): PlantAreaService {
        if (!this._plantAreaService) {
            this._plantAreaService = this.injector.get(PlantAreaService);
        }
        return this._plantAreaService;
    }
    /*
    *Node anchor Service
   */
    get nodeAnchorService(): NodeAnchorService {
        if (!this._nodeAnchorService) {
            this._nodeAnchorService = this.injector.get(NodeAnchorService);
        }
        return this._nodeAnchorService;
    }
    /*
    *Overlay Service
    */
    get overlayService(): OverlayService {
        if (!this._overlayService) {
            this._overlayService = this.injector.get(OverlayService);
        }
        return this._overlayService;
    }
    /*
    *opc Node Service
   */
    get opcNodeService(): OPCNodeService {
        if (!this._opcNodeService) {
            this._opcNodeService = this.injector.get(OPCNodeService);
        }
        return this._opcNodeService;
    }
    /*
    *Common Service
   */
    get commonService(): CommonService {
        if (!this._commonService) {
            this._commonService = this.injector.get(CommonService);
        }
        return this._commonService;
    }
    /*
    *Editor Service
   */
    get editorService(): EditorService {
        if (!this._editorService) {
            this._editorService = this.injector.get(EditorService);
        }
        return this._editorService;
    }
    /*
    *Draw Service
   */
    get drawService(): DrawService {
        if (!this._drawService) {
            this._drawService = this.injector.get(DrawService);
        }
        return this._drawService;
    }
    /*
    *Filling line Service
   */
    get fillingLineService(): FillingLineService {
        if (!this._fillingLineService) {
            this._fillingLineService = this.injector.get(FillingLineService);
        }
        return this._fillingLineService;
    }
    /*
    * Save Service
   */
    get saveService(): SaveProjectService {
        if (!this._saveService) {
            this._saveService = this.injector.get(SaveProjectService);
        }
        return this._saveService;
    }
    /*
   *Menu Service
   */
    get menuService(): MenuService {
        if (!this._menuService) {
            this._menuService = this.injector.get(MenuService);
        }
        return this._menuService;
    }
    /*
   *drag drop Service
   */
    get dragdropService(): DragDropService {
        if (!this._dragDropService) {
            this._dragDropService = this.injector.get(DragDropService);
        }
        return this._dragDropService;
    }
    /*
   *connection Service
   */
    get connectionService(): ConnectionService {
        if (!this._connectionService) {
            this._connectionService = this.injector.get(ConnectionService);
        }
        return this._connectionService;
    }
    /*
    *api Service
   */
    get apiService(): ApiService {
        if (!this._apiService) {
            this._apiService = this.injector.get(ApiService);
        }
        return this._apiService;
    }
    /*
   *Device store Service
   */
    get deviceStoreService(): DeviceStoreService {
        if (!this._deviceStoreService) {
            this._deviceStoreService = this.injector.get(DeviceStoreService);
        }
        return this._deviceStoreService;
    }
    /*
    *error handle Service
   */
    get errorHandleService(): ErrorHandleService {
        if (!this._errorHandleService) {
            this._errorHandleService = this.injector.get(ErrorHandleService);
        }
        return this._errorHandleService;
    }
    /*
    *notification Service
   */
    get notificationService(): NotifcationService {
        if (!this._notificationService) {
            this._notificationService = this.injector.get(NotifcationService);
        }
        return this._notificationService;
    }
    /*
   *resize Service
   */
    get resizeService(): ResizeService {
        if (!this._resizeService) {
            this._resizeService = this.injector.get(ResizeService);
        }
        return this._resizeService;
    }
    /*
   *xml parsing Service
   */
    get xmlHelperService(): XmlParsingHelperService {
        if (!this._xmlHelperService) {
            this._xmlHelperService = this.injector.get(XmlParsingHelperService);
        }
        return this._xmlHelperService;
    }
    /*
    *align connection Service
   */
    get alignConnectionService(): AlignConnectionsService {
        if (!this._alignService) {
            this._alignService = this.injector.get(AlignConnectionsService);
        }
        return this._alignService;
    }
    /*
   *Monitor Service
   */
    getMonitorService(adapterType): MonitorAdapter {
        if (!this._monitorService) {
            this._monitorService = this.injector.get(DataAdapterManagers.getadapter(adapterType, AdapterMethods.MONITOR));
        }
        return this._monitorService;
    }
    /* Socket Service
   */
    get socketService(): SocketService {
        if (!this._socketService) {
            this._socketService = this.injector.get(SocketService);
        }
        return this._socketService;
    }

    get zoomOperationsService(): ZoomOperationsService {
        if (!this._zoomOperationService) {
            this._zoomOperationService = this.injector.get(ZoomOperationsService);
        }
        return this._zoomOperationService;
    }
}

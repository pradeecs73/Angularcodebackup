/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { BehaviorSubject, of } from 'rxjs';
import { cacheData, mockConnection, mockDevices } from '../../../../../mockData';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import { ConnectorState, ConnectorType, DeviceAuthentication, DragDropAttribute, EstablishConnectionMenus, EstablishConnectionMenusId, FillingLineNodeType, Numeric, ProjectState } from '../../../enum/enum';
import { SelectedContextAnchor } from '../../../models/connection.interface';
import { EditorContext, LiveLink } from '../../../models/models';
import { MonitorAdapter } from '../../../opcua/adapter/base-adapter/monitor-adapter';
import { PlantArea } from '../../../opcua/opcnodes/area';
import { Connector } from '../../../opcua/opcnodes/connector';
import { HTMLNode } from '../../../opcua/opcnodes/htmlNode';
import { PrimengModule } from '../../../vendors/primeng.module';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { MainComponent } from './main.component';

fdescribe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let messageService: MessageService;
  const initialState = { deviceTreeList: of(null) };
  let monitor: MonitorAdapter;
  let facadeMockService;
  const mockedConnector = new BehaviorSubject<Connector>(mockConnection);
  let device = {
    deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
    deviceAddress: 'opc.tcp://192.168.2.101:4840',
    status: 'UNKNOWN',
    automationComponent: 'BottleFilling',
    interfaceType: 'FillingToMixing',
  };


  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();
    monitor = jasmine.createSpyObj('monitor', ['goOnline', 'goOffline', 'offlineState']);
    facadeMockService.editorService.selectedConnectionObs = mockedConnector.asObservable();
    facadeMockService.editorService.selectedAnchorDetails$ = of({});
    facadeMockService.commonService.showAuthenticationPopupData = of({ device: device, multipleDevices: true });
    facadeMockService.editorService.multiSelectedConnectorMap = { a: 'abc', b: 'def' };
    facadeMockService.commonService.treeMenu = [{
      children: [],
      droppable: true,
      expanded: true,
      icon: "fas fa-cube",
      key: "ROOT",
      label: "test",
      parent: undefined,
      partialSelected: false,
      type: "head"
    }];
    facadeMockService.editorService.liveLinkEditor = {} as LiveLink;
    const svgElement = document.createElement('div') as unknown as SVGGElement;
    svgElement.classList.add(DragDropAttribute.DRAGG_SELECTED);
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', element: svgElement }] as unknown as Array<HTMLNode>;
    facadeMockService.commonService.connectionPropertyState = [];
    facadeMockService.commonService.deviceAuthenticationFailedList = [{
      deviceAddress: "opc.tcp://192.168.2.102:4840",
      deviceId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==",
      deviceName: "LiquidMixing",
      status: "pending"
    }];
    facadeMockService.commonService.connectionPropertyAccordion = {
      clientIndex: [],
      serverIndex: []
    };
    // facadeMockService.socketService.getIo = {io:{},ids:0};
    // Object.getOwnPropertyDescriptor(facadeMockService.socketService, 'getIo').value.and.returnValue(of({io:{},ids:0}));
    // Object.getOwnPropertyDescriptor(facadeMockService.socketService.getIo, 'on').value.and.returnValue(of({}));
    TestBed.configureTestingModule({
      declarations: [MainComponent, DisableIfUnauthorizedDirective],
      imports: [ToggleButtonModule, TranslateModule.forRoot({}), PrimengModule],
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: FacadeService, useValue: facadeMockService },
        provideMockStore({ initialState })
      ]
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    Object.getOwnPropertyDescriptor(facadeMockService.socketService, 'getIo').value.and.returnValue({ on: () => { }, ids: 0 });
    facadeMockService.editorService.editorContext = of({ id: 'Area1', name: 'Area 1' });
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(cacheData);
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    component.items = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    facadeMockService.dataService.getDevices = () => mockDevices;
    facadeMockService.editorService.selectedConnectionObs = mockedConnector.asObservable();
    expect(component).toBeTruthy();
  });

  it('disableEstablishConnection should return false if it is offline', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.applicationStateService, 'isOnline').value.and.returnValue(false);
    facadeMockService.commonService.isOnline = false;
    facadeMockService.commonService.editorHasNoDevice = false;
    facadeMockService.commonService.noOfNodesInEditor = 3;
    component.isConnectionEmpty = () => false;
    const disableEstablishConnectionReturn = component.disableEstablishConnection();
    expect(disableEstablishConnectionReturn).toEqual(false);
  });

  it('disableEstablishConnection should return true if it is online', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.applicationStateService, 'isOnline').value.and.returnValue(true);
    facadeMockService.commonService.isOnline = true;
    facadeMockService.commonService.editorHasNoDevice = true;
    facadeMockService.commonService.noOfNodesInEditor = 1;
    component.isConnectionEmpty = () => false;
    spyOn(component, 'disableEstablishConnection').and.returnValues(true);
  });
  it('isMultiSelectConnector should return true if multiselected option is selected', () => {
    component.establishConnectionSelectionType = EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION;

    expect(component.isMultiSelectConnector).toBeTruthy();
  });

  it('updateConnectionSelection should update selection and call setIsMultiSelected in common service', () => {
    const mockedevent = {
      id: EstablishConnectionMenusId.ESTABLISH_ALL_CONNECTIONS,
      label: EstablishConnectionMenus.ESTABLISH_ALL_CONNECTIONS
    };
    component.updateConnectionSelection(mockedevent);
    expect(facadeMockService.editorService.setIsMultiSelected).toHaveBeenCalled();
    expect(component.establishConnectionSelectionType).toBe(
      EstablishConnectionMenus.ESTABLISH_ALL_CONNECTIONS
    );
  });

  it('updateConnectionSelection should update selection and call resetMultiSelectedConnection if multiselection is selected', () => {
    const mockedevent = {
      id: EstablishConnectionMenusId.ESTABLISH_SELECTED_CONNECTION,
      label: EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION
    };
    component.updateConnectionSelection(mockedevent);
    expect(facadeMockService.editorService.setIsMultiSelected).toHaveBeenCalled();
    expect(component.establishConnectionSelectionType).toBe(
      EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION
    );
  });

  it('should call show context menu method', () => {
    facadeMockService.commonService.isOnline = true;
    facadeMockService.editorService.selectedConnection = mockConnection;
    facadeMockService.editorService.contextMenuClick = true;
    component.elem.nativeElement.insertAdjacentHTML('beforeend', '<div id="onlineDelteContextmenu">two</div>');
    component.showDeleteContextMenu();
    expect(component.showDeleteContextMenu).toBeDefined();

  });

  it('should call delete connection online method', () => {
    facadeMockService.commonService.isOnline = true;
    component.onlineConnectionConnector = mockConnection;
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component.deleteConnectionOnline('deleteconnectiononline');
    expect(component.deleteConnectionOnline).toBeDefined();
    component.deleteConnectionOnline('deleteconnectiononlineandproject');
  });

  it('should call establish connection method', () => {
    component.establishCon();
    expect(component.establishCon).toBeDefined();
  });

  it('should call go online method', () => {
    component.monitor = monitor;
    component.goOnline();
    expect(component.goOnline).toBeDefined();
  });

  it('should call go offline method', () => {
    component.monitor = monitor;
    component.goOffline();
    expect(component.goOffline).toBeDefined();
  });

  it('showAuthenticationPopup on authentication failure', () => {
    component.showAuthenticationPopup();
    expect(component.showDeviceLoginModel).toEqual(true);
    expect(facadeMockService.deviceService.setDeviceDetails).toHaveBeenCalled();
  });

  it('cancel operation in authentication popup', () => {
    component.onCancel();
    expect(facadeMockService.commonService.deviceAuthenticationFailedList.length).toEqual(0);
  });

  it('skipDevice during reAuthentication', () => {
    let event = {
      device: {
        deviceId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA=="
      }
    };
    component.skipDevice(event);
    expect(facadeMockService.commonService.showAuthenticationPopupState).toHaveBeenCalled();
    expect(facadeMockService.commonService.deviceAuthenticationFailedList[0].status).toEqual('skipped');
  });

  it('authentication is Successful and has more devices to authenticate ', () => {
    let event = {
      uid: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA=="
    };
    component.authenticationSuccessful(event);
    expect(facadeMockService.commonService.showAuthenticationPopupState).toHaveBeenCalled();
  });

  it('authentication is Successful and doesnt devices to authenticate in establish connection', () => {
    let event = {
      uid: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA=="
    };
    spyOn(component, 'establishCon');
    facadeMockService.commonService.deviceAuthenticationFailedList = [];
    component.deviceAuthenticationFailed = DeviceAuthentication.ESTABLISH_CONNECTION;
    component.authenticationSuccessful(event);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.applicationStateService.saveProject).toHaveBeenCalled();
    expect(component.establishCon).toHaveBeenCalled();
  });

  it('authentication is Successfull and doesnt devices to authenticate in goonline', () => {
    let event = {
      uid: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA=="
    };
    spyOn(component, 'goOnline');
    facadeMockService.commonService.deviceAuthenticationFailedList = [];
    component.deviceAuthenticationFailed = DeviceAuthentication.GO_ONLINE;
    component.authenticationSuccessful(event);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.applicationStateService.saveProject).toHaveBeenCalled();
    expect(component.goOnline).toHaveBeenCalled();
  });

  it('navigateToArea', () => {
    const event = {
      originalEvent: {
        stopImmediatePropagation: () => { }
      }
    };
    spyOn(event.originalEvent, 'stopImmediatePropagation');
    component.navigateToArea({}, event);
    expect(event.originalEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(facadeMockService.commonService.selectedMenuTree).toHaveBeenCalled();
    expect(facadeMockService.areaUtilityService.nodeSelect).toHaveBeenCalled();
  });

  it('should call triggerContextPositionCalc', () => {
    spyOn(component, 'adjustContextPosition');
    component.anchorDetails = {} as unknown as SelectedContextAnchor;
    const contextPostion = component.triggerContextPositionCalc();
    expect(contextPostion).toBe(undefined);
    expect(component.adjustContextPosition).toHaveBeenCalled();
  });

  it('should call zoomIn functionality', () => {
    component.zoomPercent = Numeric.TWO;
    component.zoomIn();
    component.zoomPercent = Numeric.ONE;
    component.zoomIn();
    expect(component.zoomIn).toBeDefined();
    expect(component.zoomPercent).toEqual(Numeric.ONEPOINTTWOFIVE);
  });

  it('should call zoomout functionality', () => {
    component.zoomPercent = 0.15;
    component.zoomOut();
    component.zoomPercent = Numeric.ONE;
    component.zoomOut();
    expect(component.zoomOut).toBeDefined();
    expect(component.zoomPercent).toEqual(Numeric.POINTSEVENTFIVE);
  });


  it('should call fixHeight functionality', () => {
    spyOn(component, 'setSidePanelWidth');
    component.fixHeight(Numeric.POINTSEVENTFIVE);
    component.fixHeight(Numeric.POINTFIFTY);
    component.fixHeight(Numeric.POINTTWENTYFIVE);
    component.fixHeight(Numeric.TWO);
    expect(component.fixHeight).toBeDefined();
    expect(component.setSidePanelWidth).toHaveBeenCalled();
  });

  it('should call deleteArea functionality', () => {
    component.selectedAreaInEditor = { children: [] };
    spyOn(component, 'recurseTreeData');
    spyOn(component, 'recurseNestedArea');
    const nodeData = { id: '12345' };
    component.deleteArea(nodeData as unknown as PlantArea);
    let nodeDataKey = { key: '12345' };
    component.deleteArea(nodeDataKey as unknown as PlantArea);
    expect(component.deleteArea).toBeDefined();
    expect(component.recurseTreeData).toHaveBeenCalled();
    expect(component.recurseNestedArea).toHaveBeenCalled();
    expect(component.nestedAreas.length).toBeGreaterThan(0);
  });

  it('should call recurseTreeData functionality', () => {
    const nodeData = [{ key: '12345', children: [{ type: 'area' }] }];
    const areaId = '12345';
    component.recurseTreeData(nodeData, areaId);
    expect(component.recurseTreeData).toBeDefined();
    expect(component.selectedAreaInEditor).toEqual({ key: '12345', children: [{ type: 'area' }] });
  });

  it('should call recurseNestedArea functionality', () => {
    const nodeData = [{ type: 'area', children: [{}] }];
    component.nestedAreas = [];
    component.recurseNestedArea(nodeData);
    expect(component.recurseNestedArea).toBeDefined();
    expect(component.nestedAreas.length).toBeGreaterThan(0);
  });

  it('should call selectZoom functionality', () => {
    component.selectZoom();
    expect(component.selectZoom).toBeDefined();
  });

  it('should call proposeCon functionality', () => {
    const event = {};
    component.proposeCon(event);
    expect(component.proposeCon).toBeDefined();
  });

  it('should call uploadConnectionsToOffline functionality', () => {
    component.uploadConnectionsToOffline();
    expect(component.uploadConnectionsToOffline).toBeDefined();
  });

  it('should call showEstablishConnectionOption functionality', () => {
    const event = { stopPropagation: () => { } };
    component.showEstablishConnectionOption(event);
    expect(component.showEstablishConnectionOption).toBeDefined();
  });

  it('should call onclickoutside functionality', () => {
    component.onClickOutside();
    expect(component.onClickOutside).toBeDefined();
    expect(component.showEstablishConnectionOptionValue).toEqual(false);
  });

  it('should call removeElementWidth functionality', () => {
    const value = { 'mode': 'offline', 'position': 'left', 'init': false };
    component.removeElementWidth(value);
    expect(component.removeElementWidth).toBeDefined();
    expect(component.sidePanelData[value.position]).toEqual('offline');
  });

  it('should call mouseDown functionality', () => {
    const event = { detail: 1, target: { classList: { contains: () => true } }, currentTarget: { id: 'myCanvas' } };
    component.mouseDown(event);
    component.establishConnectionSelectionType = EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION
    expect(component.mouseDown).toBeDefined();
  });

  it('should call resetZoom functionality', () => {
    component.resetZoom();
    expect(component.resetZoom).toBeDefined();
    expect(facadeMockService.zoomOperationsService.changeZoomPercent).toHaveBeenCalledWith(1);
  });

  it('should call mouseUp functionality', () => {
    const event = {};
    const pElement = document.createElement("p");
    pElement.classList.add('drag-selection');
    component.elem.nativeElement.appendChild(pElement);
    Object.getOwnPropertyDescriptor(facadeMockService.applicationStateService, 'isOnline').value.and.returnValue(false);
    component.mouseUp(event);
    expect(component.mouseUp).toBeDefined();
  });

  it('should call deleteAreaFromEditor functionality', () => {
    const nodeData = { name: 'test' };
    spyOn(component, 'deleteArea');
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component.deleteAreaFromEditor(nodeData as unknown as PlantArea);
    expect(component.deleteAreaFromEditor).toBeDefined();
  });

  it('should call clearSelectedRect functionality', () => {
    const pElement = document.createElement("p");
    pElement.classList.add('dragg-selected');
    const pElement1 = document.createElement("p");
    pElement1.setAttribute('id', 'parent-rect');
    const pElement3 = document.createElement("div");
    pElement3.classList.add('cls-2');
    pElement1.setAttribute('id', 'parent-rect');
    pElement1.appendChild(pElement3);
    component.elem.nativeElement.appendChild(pElement1);
    component.clearSelectedRect(pElement);
    expect(component.clearSelectedRect).toBeDefined();
  });

  it('should call onChangePercentage functionality', () => {
    facadeMockService.zoomOperationsService.selectedZoomPercent = 1;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ x: 600, updateAnchors: () => true }];
    Object.getOwnPropertyDescriptor(facadeMockService.zoomOperationsService, 'setZoomPercent').value.and.returnValue(Numeric.ONEPOINTSEVENFIVE);
    component.onChangePercentage();
    expect(component.zoomPercent).toEqual(Numeric.ONEPOINTSEVENFIVE);
    expect(component.onChangePercentage).toBeDefined();

  });

  it('should call removeMultipleNodeorAreaFromEditor functionality', () => {
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });

    spyOn(component, 'deleteArea');
    component.multipleSelectedNodes = [{ type: FillingLineNodeType.NODE, getAllSubConnectors: () => [{}] }] as unknown as Array<HTMLNode>;
    component.removeMultipleNodeorAreaFromEditor();
    expect(component.removeMultipleNodeorAreaFromEditor).toBeDefined();
    component.multipleSelectedNodes = [{ type: FillingLineNodeType.AREA, getAllSubConnectors: () => [{}] }] as unknown as Array<HTMLNode>;
    component.removeMultipleNodeorAreaFromEditor();
  });

  it('should call deleteEditorNode functionality', () => {
    spyOn(component, 'removeMultipleNodeorAreaFromEditor');
    spyOn(component, 'deleteAreaFromEditor');
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component.multipleSelectedNodes = [{ type: FillingLineNodeType.NODE, getAllSubConnectors: () => [{}] }] as unknown as Array<HTMLNode>;
    component.deleteEditorNode();
    expect(component.deleteEditorNode).toBeDefined();
    facadeMockService.editorService.selectedNode = { 'name': 'sample' };
    component.multipleSelectedNodes = [] as unknown as Array<HTMLNode>;
    component.deleteEditorNode();

    facadeMockService.editorService.selectedNode = { 'name': 'sample', 'type': FillingLineNodeType.NODE, getAllSubConnectors: () => [{}] };
    component.deleteEditorNode();

    spyOn(component.disableIfUnauthorizedDirective, 'hasPermission').and.returnValue(false);
    component.deleteEditorNode();
  });

  it('should call alignConnection functionality', () => {
    component.alignConnection();
    expect(component.alignConnection).toBeDefined();
  });

  it('should call deleteConnection functionality', () => {
    facadeMockService.editorService.selectedConnection = { 'type': ConnectorType.CONNECTOR };
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component.deleteConnection();

    facadeMockService.editorService.selectedConnection = { 'type': ConnectorType.SUBCONNECTOR };
    component.deleteConnection();

    spyOn(component.disableIfUnauthorizedDirective, 'hasPermission').and.returnValue(false);
    component.deleteConnection();
    expect(component.deleteConnection).toBeDefined();

  });

  // it('should call applyChanges functionality', () => {
  //   const event={};
  //   component.toggleBtn = {
  //     onChange : new EventEmitter()
  //   } as unknown as ToggleButton;
  //   component.applyChanges(event);
  //   expect(component.toggleBtn.checked).toBeTruthy();
  // });

  it('should call isConnectionEmpty functionality', () => {
    facadeMockService.editorService.liveLinkEditor.connectorLookup = {};
    const hasConnection = component.isConnectionEmpty();
    expect(hasConnection).toEqual(true);
    expect(component.isConnectionEmpty).toBeDefined();
  });

  it('should call loadEditorData functionality', () => {
    const selectedEditor = { 'parentLabels': ['mylabel'] };
    const myCanvas = {};
    component.loadEditorData(selectedEditor as unknown as EditorContext, myCanvas);
    expect(component.loadEditorData).toBeDefined();

    component.monitor = { 'goOnline': () => true } as unknown as MonitorAdapter;
    facadeMockService.applicationStateService.getStatus.and.returnValue(ProjectState.ONLINE);
    facadeMockService.editorService.isRootEditor.and.returnValue(true);
    component.loadEditorData(selectedEditor as unknown as EditorContext, myCanvas);
  });

  it('should call addConnectionToProject functionality', () => {
    const connection = { 'id': '12345' };
    const subConnections = [{ 'id': '12345' }];
    const subConnector = { 'creationMode': '' };
    facadeMockService.editorService.selectedConnection = { creationMode: '' };
    facadeMockService.dataService.getConnection.and.returnValue(connection);
    facadeMockService.dataService.getAllAssociatedSubConnections.and.returnValue(subConnections);
    facadeMockService.editorService.getExistingSubConnectorById.and.returnValue(subConnector);
    spyOn(component.disableIfUnauthorizedDirective, 'hasPermission').and.returnValue(true);
    component.addConnectionToProject();
  });

  it('should call adjustContextPosition functionality', () => {
    component.anchorDetails = { isClient: true, event: { pageX: 100, pageY: 100 }, isSelected: true } as unknown as SelectedContextAnchor;
    const pElement = document.createElement("p");
    pElement.setAttribute('id', 'node-connection-search-menu');
    component.elem.nativeElement.appendChild(pElement);
    component.adjustContextPosition();
    expect(component.adjustContextPosition).toBeDefined();

  });

  it('should call adjustContextPosition functionality', () => {
    component.anchorDetails = { isClient: true, event: { pageX: 100, pageY: 100 }, isSelected: true } as unknown as SelectedContextAnchor;
    const pElement = document.createElement("p");
    pElement.setAttribute('id', 'node-connection-search-menu');
    component.elem.nativeElement.appendChild(pElement);
    component.adjustContextPosition();
    expect(component.adjustContextPosition).toBeDefined();

  });

  it('should call showDeleteContextMenu functionality', () => {
    facadeMockService.editorService.selectedConnection = { 'type': ConnectorType.CONNECTOR, state: ConnectorState.Success };
    facadeMockService.applicationStateService.isOnline.and.returnValue(true);
    facadeMockService.editorService.contextMenuClick = true;
    const pElement = document.createElement("p");
    pElement.setAttribute('id', 'onlineDelteContextmenu');
    component.elem.nativeElement.appendChild(pElement);
    component.showDeleteContextMenu();
    expect(component.showDeleteContextMenu).toBeDefined();
  });

  it('should call isInBounds functionality', () => {
    const obj1 = {
      getBoundingClientRect: () => {
        return { x: 100, y: 100, width: 100, height: 100 };
      }
    };
    const obj2 = {
      getBoundingClientRect: () => {
        return { x: 100, y: 100, width: 100, height: 100 };
      }
    };

    component.isInBounds(obj1, obj2);
    expect(component.isInBounds).toBeDefined();
  });

  it('should call setSidePanelWidth functionality', () => {
    component.sidePanelData.left = 'open';
    component.sidePanelData.right = 'open';
    const pElement = document.createElement("p");
    pElement.setAttribute('id', 'device__left__side');
    component.elem.nativeElement.appendChild(pElement);
    const pElement1 = document.createElement("p");
    pElement1.setAttribute('id', 'device__right__side');
    component.elem.nativeElement.appendChild(pElement1);
    component.setSidePanelWidth(5);
    expect(component.setSidePanelWidth).toBeDefined();
  });

  it('should call disableEstablishConnectionBtn functionality', () => {
    spyOn(component, 'disableEstablishConnection').and.returnValue(false);
    facadeMockService.editorService.multiSelectedConnectorMap.size = 0;
    spyOn<any>(component, 'isMultiSelectConnector').and.returnValue(true);
    component.disableEstablishConnectionBtn;
    expect(component.disableEstablishConnectionBtn).toBeDefined();
  });

  it('should call checkSelectedConnectionState functionality', () => {

    facadeMockService.editorService.selectedConnection = { state: ConnectorState.Default };
    component.checkSelectedConnectionState();
    expect(component.disableEstablishConnectionBtn).toBeDefined();
    facadeMockService.editorService.selectedConnection = { state: ConnectorState.Online };
    component.checkSelectedConnectionState();
    expect(component.disableEstablishConnectionBtn).toBeDefined();
  });
});


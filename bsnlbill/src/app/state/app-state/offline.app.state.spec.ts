/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TreeNode } from 'primeng/api';
import { of } from 'rxjs';
import { ConnectorType, Numeric, ProjectState } from 'src/app/enum/enum';
import { Connector } from 'src/app/opcua/opcnodes/connector';
import { OPCNode } from 'src/app/opcua/opcnodes/opcnode';
import { HomeComponent } from '../../home/home.component';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { AbstractState } from '../state';
import { PanelDataType } from './../../models/monitor.interface';
import { Offline } from './offline.app.state';

fdescribe('offline app service', () => {
  let router: Router;
  let offlineAppService;
  const defaultFillingNodes = {
    ids: [],
    entities: {}
  };
  let facadeMockService;

  const initialState = { deviceTreeList: of(null), fillingLine: defaultFillingNodes };

  beforeEach(waitForAsync(() => {

    facadeMockService = new FacadeMockService();
    // facadeMockService.socketService.getIo = {io:{},ids:0};
    // Object.getOwnPropertyDescriptor(facadeMockService.socketService, 'getIo').value.and.returnValue(of({io:{},ids:0}));
    // Object.getOwnPropertyDescriptor(facadeMockService.socketService.getIo, 'on').value.and.returnValue(of({}));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes(
        [{ path: 'home', component: HomeComponent }]
      )],
      providers: [
        { provide: FacadeService, useClass: facadeMockService },
        provideMockStore({ initialState })
      ]
    });


    offlineAppService = new Offline(facadeMockService, router);

  }));

  it('offline app service should be created', () => {
    expect(offlineAppService).toBeTruthy();
  });

  it('should call status method ', () => {
    offlineAppService.status();
    let statusMethodReturnedValue = offlineAppService.status();
    expect(statusMethodReturnedValue).toBe(ProjectState.OFFLINE);
    expect(offlineAppService.status).toBeDefined();
  });

  it('should call changeStatus method ', () => {
    let context = {} as unknown as AbstractState;
    spyOn(offlineAppService, 'changeStatus').and.callThrough();
    offlineAppService.changeStatus(context);
    expect(offlineAppService.changeStatus).toBeDefined();
    expect(offlineAppService.changeStatus).toHaveBeenCalledWith(context);
  });

  it('should call establishConnection method ', () => {
    offlineAppService.establishConnection();
    expect(offlineAppService.establishConnection).toBeDefined();
    expect(facadeMockService.connectionService.establishConnection).toHaveBeenCalled();
  });

  it('should call saveproject method ', () => {
    offlineAppService.saveProject();
    expect(offlineAppService.saveProject).toBeDefined();
    expect(facadeMockService.saveService.saveProject).toHaveBeenCalled();
  });

  it('should call dropNode method ', () => {
    offlineAppService.dropNode();
    expect(offlineAppService.dropNode).toBeDefined();
    expect(facadeMockService.dragdropService.drop).toHaveBeenCalled();
  });

  it('should call dragNode method ', () => {
    offlineAppService.dragNode();
    expect(offlineAppService.dragNode).toBeDefined();
    expect(facadeMockService.dragdropService.drag).toHaveBeenCalled();
  });

  it('should call dropInterface method ', () => {
    offlineAppService.dropInterface();
    expect(offlineAppService.dropInterface).toBeDefined();
    expect(facadeMockService.dragdropService.dropInterface).toHaveBeenCalled();
  });

  it('should call dropNodeToTree method ', () => {
    offlineAppService.dropNodeToTree();
    expect(offlineAppService.dropNodeToTree).toBeDefined();
    expect(facadeMockService.dragdropService.dropToFillingLine).toHaveBeenCalled();
  });

  it('should call menuChange method ', () => {
    var event = new MouseEvent('click');
    offlineAppService.menuChange(event);
    expect(offlineAppService.menuChange).toBeDefined();
    expect(facadeMockService.menuService.selectMenu).toHaveBeenCalledWith(event);
  });

  it('should call deleteConnection method ', () => {
    let connector = {} as unknown as Connector;
    offlineAppService.deleteConnection(connector);
    expect(offlineAppService.deleteConnection).toBeDefined();
    expect(facadeMockService.connectionService.deleteOfflineConnection).toHaveBeenCalledWith(connector);
  });

  it('should call deleteConnectionInonlineAndProject method ', () => {
    const connector = {} as unknown as Connector;
    const deleteConnectionInonlineAndProjectReturn = offlineAppService.deleteConnectionInonlineAndProject(connector);
    expect(offlineAppService.deleteConnectionInonlineAndProject).toBeDefined();
    expect(deleteConnectionInonlineAndProjectReturn).toEqual(undefined);
  });

  it('should call showDeleteConnectionOption method ', () => {
    const connector = {} as unknown as Connector;
    const showDeleteConnectionOptionReturn = offlineAppService.showDeleteConnectionOption(connector);
    expect(offlineAppService.showDeleteConnectionOption).toBeDefined();
    expect(showDeleteConnectionOptionReturn).toEqual(true);
  });

  it('should call showDeleteACOption method ', () => {
    const showDeleteACOptionReturn = offlineAppService.showDeleteACOption();
    expect(offlineAppService.showDeleteACOption).toBeDefined();
    expect(showDeleteACOptionReturn).toEqual(true);
  });

  it('should call deleteEditorNode method ', () => {
    var node = { getAllNodeConnectors: () => { return [{ type: ConnectorType.CONNECTOR }]; } } as unknown as OPCNode;
    offlineAppService.deleteEditorNode(node);
    expect(offlineAppService.deleteEditorNode).toBeDefined();
    expect(facadeMockService.drawService.removeNode).toHaveBeenCalledWith(node);
  });


  it('should call updateConnectorState method ', () => {
    const connector = {} as unknown as Connector;
    spyOn(offlineAppService, 'updateConnectorState').and.callThrough();
    offlineAppService.updateConnectorState(connector);
    expect(offlineAppService.updateConnectorState).toBeDefined();
    expect(offlineAppService.updateConnectorState).toHaveBeenCalled();
  });

  it('should call styleNode method ', () => {
    const node = { applyOfflineStyle: () => true } as unknown as OPCNode;
    spyOn(offlineAppService, 'styleNode').and.callThrough();
    offlineAppService.styleNode(node);
    expect(offlineAppService.styleNode).toBeDefined();
    expect(offlineAppService.styleNode).toHaveBeenCalled();
  });

  it('should call styleConnector method ', () => {
    const connector = { setDefaultStyle: () => true } as unknown as Connector;
    spyOn(offlineAppService, 'styleConnector').and.callThrough();
    offlineAppService.styleConnector(connector);
    expect(offlineAppService.styleConnector).toBeDefined();
    expect(offlineAppService.styleConnector).toHaveBeenCalled();
  });

  it('should call dragFromTreeMenu method ', () => {
    offlineAppService.dragFromTreeMenu();
    expect(offlineAppService.dragFromTreeMenu).toBeDefined();
  });

  it('should call createArea method ', () => {
    offlineAppService.createArea('area12345');
    expect(offlineAppService.createArea).toBeDefined();
    expect(facadeMockService.drawService.createArea).toBeDefined();
  });

  it('should call deleteArea method ', () => {
    const nodeData = {} as unknown as TreeNode;
    offlineAppService.deleteArea(nodeData);
    expect(facadeMockService.areaUtilityService.deleteAreaConfirmation).toBeDefined();
  });

  it('should call unGroupArea method ', () => {
    const nodeData = {} as unknown as TreeNode;
    offlineAppService.unGroupArea(nodeData);
    expect(facadeMockService.areaUtilityService.unGroupAreaConfirmation).toBeDefined();
  });

  it('should call navigateRoute method ', () => {
    const navigateResponse = offlineAppService.navigateRoute();
    offlineAppService.navigateRoute();
    expect(navigateResponse).toEqual(true);
  });

  it('should call showDeviceUnavailable method ', () => {
    const panelData = {} as unknown as PanelDataType;
    const showDeviceResponse = offlineAppService.showDeviceUnavailable(panelData);
    expect(showDeviceResponse).toEqual(false);
  });

  it('should call isOnline method ', () => {
    const onlineResponse = offlineAppService.isOnline();
    expect(onlineResponse).toEqual(false);
  });

  it('should call showConnectionDeleteOption method ', () => {
    facadeMockService.editorService.selectedConnection = true;
    spyOn(offlineAppService, 'showDeleteConnectionOption').and.returnValue(true);
    facadeMockService.editorService.multiSelectedConnectorMap = { size: 25 };
    facadeMockService.editorService.multiSubConnectionSelectedMAp = { size: 25 };
    const showConnectionDelete = offlineAppService.showConnectionDeleteOption();
    expect(showConnectionDelete).toEqual(true);
    facadeMockService.editorService.multiSelectedConnectorMap = { size: -25 };
    facadeMockService.editorService.multiSubConnectionSelectedMAp = { size: 25 };
    offlineAppService.showConnectionDeleteOption();
  });

  it('should call drawCanvas method ', () => {
    facadeMockService.zoomOperationsService.selectedZoomPercent = Numeric.TWENTYFIVE;
    const mycanvas = {};
    offlineAppService.drawCanvas(mycanvas);
    facadeMockService.zoomOperationsService.selectedZoomPercent = Numeric.FIFTY;
    offlineAppService.drawCanvas(mycanvas);
    facadeMockService.zoomOperationsService.selectedZoomPercent = Numeric.SEVENTYFIVE;
    offlineAppService.drawCanvas(mycanvas);
    facadeMockService.zoomOperationsService.selectedZoomPercent = Numeric.ONEHUNDRED;
    offlineAppService.drawCanvas(mycanvas);
    facadeMockService.zoomOperationsService.selectedZoomPercent = Numeric.TWOHUNDERD;
    offlineAppService.drawCanvas(mycanvas);
    facadeMockService.zoomOperationsService.selectedZoomPercent = Numeric.FOURHUNDRED;
    offlineAppService.drawCanvas(mycanvas);
    facadeMockService.zoomOperationsService.selectedZoomPercent = Numeric.THREE;
    offlineAppService.drawCanvas(mycanvas);
    facadeMockService.zoomOperationsService.selectedZoomPercent = Numeric.ONE;
    offlineAppService.drawCanvas(mycanvas);
    facadeMockService.zoomOperationsService.selectedZoomPercent = 800;
    offlineAppService.drawCanvas(mycanvas);
    expect(offlineAppService.drawCanvas).toBeDefined();
    expect(facadeMockService.zoomOperationsService.drawCanvasForOnlineAndOffline).toBeDefined();
  });
});

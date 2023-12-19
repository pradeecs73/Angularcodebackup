/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TreeNode } from 'primeng/api';
import { of } from 'rxjs';
import { DeviceState, Numeric, ProjectState } from '../../enum/enum';
import { HomeComponent } from '../../home/home.component';
import { BaseConnector } from '../../opcua/opcnodes/baseConnector';
import { Connector } from '../../opcua/opcnodes/connector';
import { OPCNode } from '../../opcua/opcnodes/opcnode';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { AbstractState } from '../state';
import { Online } from './online.app.state';


fdescribe('online app service', () => {

  let router: Router;
  let onlineAppService;
  const defaultFillingNodes = {
    ids: [],
    entities: {}
  };

  let facadeMockService;

  const initialState = { deviceTreeList: of(null), fillingLine: defaultFillingNodes };

  beforeEach(waitForAsync(() => {

    facadeMockService = new FacadeMockService();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(
        [{ path: 'home', component: HomeComponent }]
      )],
      providers: [
        { provide: FacadeService, useClass: facadeMockService },
        provideMockStore({ initialState })
      ]
    });

    onlineAppService = new Online(facadeMockService, router);

  }));

  it('online app service should be created', () => {
    expect(onlineAppService).toBeTruthy();
  });

  it('should call establishConnection method ', () => {
    var establishConnectionReturn = onlineAppService.establishConnection();
    expect(onlineAppService.establishConnection).toBeDefined();
    expect(establishConnectionReturn).toEqual(undefined);
  });

  it('should call saveProject method ', () => {
    var saveProjectReturn = onlineAppService.saveProject();
    expect(onlineAppService.saveProject).toBeDefined();
    expect(saveProjectReturn).toEqual(undefined);
  });

  it('should call showDeleteACOption method ', () => {
    onlineAppService.showDeleteACOption();
    let showDeleteACOptionValue = onlineAppService.showDeleteACOption();
    expect(showDeleteACOptionValue).toBe(false);
    expect(onlineAppService.showDeleteACOption).toBeDefined();
  });

  it('should call status method ', () => {
    onlineAppService.status();
    let statusMethodReturnedValue = onlineAppService.status();
    expect(statusMethodReturnedValue).toBe(ProjectState.ONLINE);
    expect(onlineAppService.status).toBeDefined();
  });


  it('should call deleteEditorNode method ', () => {
    var node = {} as unknown as OPCNode;
    const editorNodeReturn = onlineAppService.deleteEditorNode(node);
    expect(onlineAppService.deleteEditorNode).toBeDefined();
    expect(editorNodeReturn).toEqual(undefined);
  });

  it('should call menuChange method ', () => {
    var event = new MouseEvent('click');
    onlineAppService.menuChange(event);
    expect(onlineAppService.menuChange).toBeDefined();
    expect(facadeMockService.menuService.selectMenu).toHaveBeenCalledWith(event);
  });

  it('should call deleteConnection method ', () => {
    var connector = {} as unknown as Connector;
    onlineAppService.deleteConnection(connector);
    expect(onlineAppService.deleteConnection).toBeDefined();
    expect(facadeMockService.connectionService.deleteConnectionFromServer).toHaveBeenCalledWith(connector);
  });

  it('should call updateConnectorState method ', () => {
    spyOn(onlineAppService, 'updateConnectorState').and.callThrough();
    var connector = { updateConnectorStateinOnline: () => { return true; } } as unknown as BaseConnector;
    onlineAppService.updateConnectorState(connector);
    expect(onlineAppService.updateConnectorState).toBeDefined();
    expect(onlineAppService.updateConnectorState).toHaveBeenCalledWith(connector);
  });

  it('should call styleNode method ', () => {
    spyOn(onlineAppService, 'styleNode').and.callThrough();
    var node = { applyOnlineStyle: () => { return true; } } as unknown as OPCNode;
    onlineAppService.styleNode(node);
    expect(onlineAppService.styleNode).toBeDefined();
    expect(onlineAppService.styleNode).toHaveBeenCalledWith(node);
  });

  it('should call styleConnector method ', () => {
    spyOn(onlineAppService, 'styleConnector').and.callThrough();
    var connector = { setOnlineStyle: () => { return true; } } as unknown as Connector;
    onlineAppService.styleConnector(connector);
    expect(onlineAppService.styleConnector).toBeDefined();
    expect(onlineAppService.styleConnector).toHaveBeenCalledWith(connector);
  });

  it('should call deleteConnectionInonlineAndProject method ', () => {
    var connector = {} as unknown as Connector;
    onlineAppService.deleteConnectionInonlineAndProject(connector);
    expect(onlineAppService.deleteConnectionInonlineAndProject).toBeDefined();
    expect(facadeMockService.connectionService.deleteConnectionFromServer).toHaveBeenCalledWith(connector);
    expect(facadeMockService.connectionService.deleteOfflineConnection).toHaveBeenCalledWith(connector);
  });

  it('should call showDeleteConnectionOption method ', () => {
    var connector = { state: 'OFFLINE' } as unknown as Connector;
    let showDeleteConnectionOptionReturn = onlineAppService.showDeleteConnectionOption(connector);
    expect(showDeleteConnectionOptionReturn).toEqual(false);
    expect(onlineAppService.showDeleteConnectionOption).toBeDefined();
    connector = false as unknown as Connector;
    showDeleteConnectionOptionReturn = onlineAppService.showDeleteConnectionOption(connector);
    expect(showDeleteConnectionOptionReturn).toEqual(true);
  });

  it('should call dropNode method ', () => {
    spyOn(onlineAppService, 'dropNode').and.callThrough();
    onlineAppService.dropNode();
    expect(onlineAppService.dropNode).toBeDefined();
    expect(onlineAppService.dropNode).toHaveBeenCalled();
  });

  it('should call dropNodeToTree method ', () => {
    spyOn(onlineAppService, 'dropNodeToTree').and.callThrough();
    onlineAppService.dropNodeToTree();
    expect(onlineAppService.dropNodeToTree).toBeDefined();
    expect(onlineAppService.dropNodeToTree).toHaveBeenCalled();
  });

  it('should call dragNode method ', () => {
    spyOn(onlineAppService, 'dragNode').and.callThrough();
    onlineAppService.dragNode();
    expect(onlineAppService.dragNode).toBeDefined();
    expect(onlineAppService.dragNode).toHaveBeenCalled();
  });

  it('should call dropInterface method ', () => {
    spyOn(onlineAppService, 'dropInterface').and.callThrough();
    onlineAppService.dropInterface();
    expect(onlineAppService.dropInterface).toBeDefined();
    expect(onlineAppService.dropInterface).toHaveBeenCalled();
  });

  it('should call changeStatus method ', () => {
    let context = {} as unknown as AbstractState;
    spyOn(onlineAppService, 'changeStatus').and.callThrough();
    onlineAppService.changeStatus(context);
    expect(onlineAppService.changeStatus).toBeDefined();
    expect(onlineAppService.changeStatus).toHaveBeenCalledWith(context);
  });

  it('should call createArea method ', () => {
    onlineAppService.createArea('area12345');
    expect(onlineAppService.createArea).toBeDefined();
    expect(facadeMockService.drawService.createArea).toBeDefined();
  });

  it('should call deleteArea method ', () => {
    const nodeData = {} as unknown as TreeNode;
    onlineAppService.deleteArea(nodeData);
    expect(facadeMockService.areaUtilityService.deleteAreaConfirmation).toBeDefined();
  });

  it('should call unGroupArea method ', () => {
    const nodeData = {} as unknown as TreeNode;
    onlineAppService.unGroupArea(nodeData);
    expect(facadeMockService.areaUtilityService.unGroupAreaConfirmation).toBeDefined();
  });

  it('should call navigateRoute method ', () => {
    onlineAppService.router = { navigate: () => { return true; } };
    const navigateResponse = onlineAppService.navigateRoute();
    expect(navigateResponse).toEqual(false);
  });

  it('should call showConnectionDeleteOption method ', () => {
    const showConnectionDeleteOptionResponse = onlineAppService.showConnectionDeleteOption();
    expect(onlineAppService.showConnectionDeleteOption).toBeDefined;
    expect(showConnectionDeleteOptionResponse).toEqual(false);
  });

  it('should call isOnline method ', () => {
    const onlineResponse = onlineAppService.isOnline();
    expect(onlineResponse).toEqual(true);
  });

  it('should call drawCanvas method ', () => {
    facadeMockService.commonService.selectedZoomPercent = Numeric.TWENTYFIVE;
    const mycanvas = {};
    onlineAppService.drawCanvas(mycanvas);
    facadeMockService.commonService.selectedZoomPercent = Numeric.FIFTY;
    onlineAppService.drawCanvas(mycanvas);
    facadeMockService.commonService.selectedZoomPercent = Numeric.SEVENTYFIVE;
    onlineAppService.drawCanvas(mycanvas);
    facadeMockService.commonService.selectedZoomPercent = Numeric.ONEHUNDRED;
    onlineAppService.drawCanvas(mycanvas);
    facadeMockService.commonService.selectedZoomPercent = Numeric.TWOHUNDERD;
    onlineAppService.drawCanvas(mycanvas);
    facadeMockService.commonService.selectedZoomPercent = Numeric.FOURHUNDRED;
    onlineAppService.drawCanvas(mycanvas);
    facadeMockService.commonService.selectedZoomPercent = Numeric.THREE;
    onlineAppService.drawCanvas(mycanvas);
    facadeMockService.commonService.selectedZoomPercent = Numeric.ONE;
    onlineAppService.drawCanvas(mycanvas);
    facadeMockService.commonService.selectedZoomPercent = 800;
    onlineAppService.drawCanvas(mycanvas);
    expect(onlineAppService.drawCanvas).toBeDefined();
    expect(facadeMockService.commonService.changeZoomPercent).toBeDefined();
  });

  it('should call showDeviceUnavailable method ', () => {
    const panelData = { deviceState: DeviceState.AVAILABLE };
    onlineAppService.showDeviceUnavailable(panelData);
    expect(onlineAppService.showDeviceUnavailable).toBeDefined();
  });

});

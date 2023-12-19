/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TreeNode } from 'primeng/api';
import { of } from 'rxjs';
import { HomeComponent } from '../home/home.component';
import { PanelDataType } from '../models/monitor.interface';
import { BaseConnector } from '../opcua/opcnodes/baseConnector';
import { Connector } from '../opcua/opcnodes/connector';
import { HTMLNode } from '../opcua/opcnodes/htmlNode';
import { OPCNode } from '../opcua/opcnodes/opcnode';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { ApplicationStateService } from './application-state.service';

fdescribe('application state service', () => {
  let service: ApplicationStateService;
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
        { provide: FacadeService, useValue: facadeMockService },
        provideMockStore({ initialState })
      ]
    });

    service = TestBed.inject(ApplicationStateService);

  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call changeApplicationStatus method', () => {
    spyOn(service, 'changeApplicationStatus').and.callThrough();
    service.changeApplicationStatus();
    expect(service.changeApplicationStatus).toBeDefined();
    expect(service.changeApplicationStatus).toHaveBeenCalled();
  });

  it('should call establishConenction method', () => {
    spyOn(service, 'establishConenction').and.callThrough();
    service.establishConenction();
    expect(service.establishConenction).toBeDefined();
    expect(service.establishConenction).toHaveBeenCalled();
  });

  it('should call saveProject method', () => {
    spyOn(service, 'saveProject').and.callThrough();
    service.saveProject();
    expect(service.saveProject).toBeDefined();
    expect(service.saveProject).toHaveBeenCalled();
  });

  it('should call selectMenu method', () => {
    let event = {};
    spyOn(service, 'selectMenu').and.callThrough();
    service.selectMenu(event);
    expect(facadeMockService.menuService.selectMenu).toBeDefined();
    expect(facadeMockService.menuService.selectMenu).toHaveBeenCalledWith(event);
  });

  it('should call getStatus method', () => {
    spyOn(service, 'getStatus').and.callThrough();
    service.getStatus();
    expect(service.getStatus).toBeDefined();
    expect(service.getStatus).toHaveBeenCalled();
  });

  it('should call deleteConnection method', () => {
    let connector = {} as Connector;
    spyOn(service, 'deleteConnection').and.callThrough();
    service.deleteConnection(connector);
    expect(service.deleteConnection).toBeDefined();
    expect(service.deleteConnection).toHaveBeenCalledWith(connector);
  });

  it('should call dropNode method', () => {
    spyOn(service, 'dropNode').and.callThrough();
    service.dropNode();
    expect(service.dropNode).toBeDefined();
    expect(service.dropNode).toHaveBeenCalled();
  });

  it('should call dropInterface method', () => {
    spyOn(service, 'dropInterface').and.callThrough();
    service.dropInterface();
    expect(service.dropInterface).toBeDefined();
    expect(service.dropInterface).toHaveBeenCalled();
  });

  it('should call dragNode method', () => {
    spyOn(service, 'dragNode').and.callThrough();
    service.dragNode();
    expect(service.dragNode).toBeDefined();
    expect(service.dragNode).toHaveBeenCalled();
  });

  it('should call showDeleteACIcon method', () => {
    spyOn(service, 'showDeleteACIcon').and.callThrough();
    service.showDeleteACIcon();
    expect(service.showDeleteACIcon).toBeDefined();
    expect(service.showDeleteACIcon).toHaveBeenCalled();
  });

  it('should call dropNodeToTree method', () => {
    spyOn(service, 'dropNodeToTree').and.callThrough();
    service.dropNodeToTree();
    expect(service.dropNodeToTree).toBeDefined();
    expect(service.dropNodeToTree).toHaveBeenCalled();
  });

  it('should call deleteNode method', () => {
    var node = { getAllNodeConnectors: () => { return []; } } as unknown as HTMLNode;
    spyOn(service, 'deleteNode').and.callThrough();
    service.deleteNode(node);
    expect(service.deleteNode).toBeDefined();
    expect(service.deleteNode).toHaveBeenCalledOnceWith(node);
  });

  it('should call deleteConnectionInonlineAndProject method', () => {
    var connector = {} as unknown as BaseConnector;
    spyOn(service, 'deleteConnectionInonlineAndProject').and.callThrough();
    service.deleteConnectionInonlineAndProject(connector);
    expect(service.deleteConnectionInonlineAndProject).toBeDefined();
    expect(service.deleteConnectionInonlineAndProject).toHaveBeenCalledOnceWith(connector);
  });

  it('should call showDeleteConnectionIcon method', () => {
    var connector = {} as unknown as BaseConnector;
    spyOn(service, 'showDeleteConnectionIcon').and.callThrough();
    service.showDeleteConnectionIcon(connector);
    expect(service.showDeleteConnectionIcon).toBeDefined();
    expect(service.showDeleteConnectionIcon).toHaveBeenCalledOnceWith(connector);
  });

  it('should call updateConnectorStatus method', () => {
    var connector = {} as unknown as BaseConnector;
    spyOn(service, 'updateConnectorStatus').and.callThrough();
    service.updateConnectorStatus(connector);
    expect(service.updateConnectorStatus).toBeDefined();
    expect(service.updateConnectorStatus).toHaveBeenCalledOnceWith(connector);
  });

  it('should call styleEditorNode method', () => {
    var node = { applyOfflineStyle: () => { return []; } } as unknown as OPCNode;
    spyOn(service, 'styleEditorNode').and.callThrough();
    service.styleEditorNode(node);
    expect(service.styleEditorNode).toBeDefined();
    expect(service.styleEditorNode).toHaveBeenCalledOnceWith(node);
  });

  it('should call styleConnection method', () => {
    var connector = { setDefaultStyle: () => { return []; } } as unknown as BaseConnector;
    spyOn(service, 'styleConnection').and.callThrough();
    service.styleConnection(connector);
    expect(service.styleConnection).toBeDefined();
    expect(service.styleConnection).toHaveBeenCalledOnceWith(connector);
  });

  it('should call dragFromTreeMenu method', () => {
    spyOn(service, 'dragFromTreeMenu').and.callThrough();
    service.dragFromTreeMenu();
    expect(service.dragFromTreeMenu).toBeDefined();
    expect(service.dragFromTreeMenu).toHaveBeenCalledOnceWith();
  });

  it('createArea', () => {
    spyOn(service, 'createArea').and.callThrough();
    service.createArea('test');
    expect(service.createArea).toBeDefined();
    expect(service.createArea).toHaveBeenCalledOnceWith('test');
  });


  it('deleteArea', () => {
    spyOn(service, 'deleteArea').and.callThrough();
    service.deleteArea({} as unknown as TreeNode);
    expect(service.deleteArea).toBeDefined();
  });


  it('unGroupArea', () => {
    spyOn(service, 'unGroupArea').and.callThrough();
    service.unGroupArea({} as unknown as TreeNode);
    expect(service.unGroupArea).toBeDefined();
  });

  it('reOrderArea', () => {
    spyOn(service, 'reOrderArea').and.callThrough();
    const event = {
      dragNode: {} as unknown as TreeNode,
      dropNode: {} as unknown as TreeNode,
      index: 10,
      originalEvent: {},
      accept: true
    };
    service.reOrderArea(event, [] as unknown as TreeNode[]);
    expect(service.reOrderArea).toBeDefined();
  });

  it('navigateRoute', () => {
    spyOn(service, 'navigateRoute').and.callThrough();
    service.navigateRoute();
    expect(service.navigateRoute).toBeDefined();
    expect(service.navigateRoute).toHaveBeenCalled();
  });

  it('showDeviceUnavailable', () => {
    spyOn(service, 'showDeviceUnavailable').and.callThrough();
    service.showDeviceUnavailable({} as unknown as PanelDataType);
    expect(service.showDeviceUnavailable).toBeDefined();
  });

  it('drawCanvas', () => {
    spyOn(service, 'drawCanvas').and.callThrough();
    service.drawCanvas({});
    expect(service.drawCanvas).toBeDefined();
  });

  it('isOnline', () => {
    spyOn(service, 'isOnline').and.callThrough();
    service.isOnline();
    expect(service.isOnline).toBeDefined();
  });








});
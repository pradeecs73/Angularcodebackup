/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { MonitorAdapter } from '../../../app/opcua/adapter/base-adapter/monitor-adapter';
import { HomeComponent } from '../../home/home.component';
import { DragDropService } from './../../livelink-editor/services/drag-drop.service';
import { FacadeMockService } from './facade.mock.service';
import { FacadeService } from './facade.service';

let mockMessageService: MessageService;
let service: FacadeService;
const initialState = { deviceTreeList: of(null) };

fdescribe('Device service', () => {

  let facadeMockService: FacadeMockService;
  beforeEach(() => {

    facadeMockService = new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useValue: mockMessageService }, provideMockStore({ initialState }), DragDropService, HttpClient, HttpHandler],
      imports: [TranslateModule.forRoot({}), RouterTestingModule.withRoutes(
        [{ path: 'home', component: HomeComponent }]
      )]
    });
    service = TestBed.inject(FacadeService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call htmlNodeService', () => {
    const htmlNodeService = service.htmlNodeService;
    expect(service.htmlNodeService).toBeDefined();
    expect(htmlNodeService).toBeTruthy();
  });

  it('should call anchorService', () => {
    const anchorService = service.anchorService;
    expect(service.anchorService).toBeDefined();
    expect(anchorService).toBeTruthy();
  });

  it('should call translateService', () => {
    const translateService = service.translateService;
    expect(service.anchorService).toBeDefined();
    expect(translateService).toBeTruthy();
  });

  it('should call deviceService', () => {
    const deviceService = service.deviceService;
    expect(service.deviceService).toBeDefined();
    expect(deviceService).toBeTruthy();
  });

  it('should call applicationStateService', () => {
    const applicationStateService = service.applicationStateService;
    expect(service.applicationStateService).toBeDefined();
    expect(applicationStateService).toBeTruthy();
  });

  it('should call areaUtilityService', () => {
    const areaUtilityService = service.areaUtilityService;
    expect(service.areaUtilityService).toBeDefined();
    expect(areaUtilityService).toBeTruthy();
  });


  it('should call strategyManagerService', () => {
    const strategyManagerService = service.strategyManagerService;
    expect(service.strategyManagerService).toBeDefined();
    expect(strategyManagerService).toBeTruthy();
  });

  it('should call connectorService', () => {
    const connectorService = service.connectorService;
    expect(service.connectorService).toBeDefined();
    expect(connectorService).toBeTruthy();
  });

  it('should call nodeAnchorService', () => {
    const nodeAnchorService = service.nodeAnchorService;
    expect(service.nodeAnchorService).toBeDefined();
    expect(nodeAnchorService).toBeTruthy();
  });

  it('should call saveService', () => {
    const saveService = service.saveService;
    expect(service.saveService).toBeDefined();
    expect(saveService).toBeTruthy();
  });

  it('should call menuService', () => {
    const menuService = service.menuService;
    expect(service.menuService).toBeDefined();
    expect(menuService).toBeTruthy();
  });

  it('should call dragdropService', () => {
    const dragdropService = service.dragdropService;
    expect(service.dragdropService).toBeDefined();
    expect(dragdropService).toBeTruthy();
  });

  it('should call connectionService', () => {
    const connectionService = service.connectionService;
    expect(service.connectionService).toBeDefined();
    expect(connectionService).toBeTruthy();
  });

  it('should call apiService', () => {
    const apiService = service.apiService;
    expect(service.apiService).toBeDefined();
    expect(apiService).toBeTruthy();
  });

  it('should call deviceStoreService', () => {
    const deviceStoreService = service.deviceStoreService;
    expect(service.deviceStoreService).toBeDefined();
    expect(deviceStoreService).toBeTruthy();
  });

  it('should call errorHandleService', () => {
    const errorHandleService = service.errorHandleService;
    expect(service.errorHandleService).toBeDefined();
    expect(errorHandleService).toBeTruthy();
  });

  it('should call notificationService', () => {
    const notificationService = service.notificationService;
    expect(service.notificationService).toBeDefined();
    expect(notificationService).toBeTruthy();
  });

  it('should call resizeService', () => {
    const resizeService = service.resizeService;
    expect(service.resizeService).toBeDefined();
    expect(resizeService).toBeTruthy();
  });

  it('should call xmlHelperService', () => {
    const xmlHelperService = service.xmlHelperService;
    expect(service.xmlHelperService).toBeDefined();
    expect(xmlHelperService).toBeTruthy();
  });

  it('should call xmlHelperService', () => {
    const xmlHelperService = service.xmlHelperService;
    expect(service.xmlHelperService).toBeDefined();
    expect(xmlHelperService).toBeTruthy();
  });

  it('should call alignConnectionService', () => {
    const alignConnectionService = service.alignConnectionService;
    expect(service.alignConnectionService).toBeDefined();
    expect(alignConnectionService).toBeTruthy();
  });

  it('should call getMonitorService', () => {
    service._monitorService = true as unknown as MonitorAdapter;
    const getMonitorService = service.getMonitorService('monitor');
    expect(service.getMonitorService).toBeDefined();
    expect(getMonitorService).toBeTruthy();
  });



});
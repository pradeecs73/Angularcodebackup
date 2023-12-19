/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { HttpClient } from '@angular/common/http';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { connector } from 'mockData/mockConnector';
import { ConnectorCreationMode, EstablishConnectionMenus, FillingLineNodeType, SubConnectorCreationMode } from 'src/app/enum/enum';
import { HTMLNodeConnector } from 'src/app/models/models';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { ConnectionAdapter } from '../adapter/base-adapter/connection-adapter';
import { ServiceInjectorModule } from '../adapter/service-injector.module';
import { Connector } from '../opcnodes/connector';
import { ConnectionService } from './connection.service';


let mockHttpClientService: HttpClient;
let mockStore: Store;
let facadeMockService;
let service:ConnectionService;

const connectorLookup = {
  'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type': connector
}

class ConnectionAdapterClass extends ConnectionAdapter {
  establishConnection(): void {
    return;
  }

  deleteConnectionFromServer(connector: Connector) {
    return;
  }

  executeConnectCall(connection: Connector) {
    return;
  }
}

const getSubConnectionRes = {
  id: 'abc',
  data: 'def',
  x: 10,
  y: 20,
  areaId: 'mno',
  isclient: true,
  connectionId: 'hji',
  creationMode: SubConnectorCreationMode.MANUALONLINE,
  acId: 'hji'
}

fdescribe('EstablishConnectionService', () => {
  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    const InterfaceDetailsRes = {
      interfaceId: 'ABC',
      deviceId: 'DEFG',
      automationComponentId: 'HJI',
      subConnectionId: 'YUI',
      isClientInterface: true,
      adapterType: 'YIOS',
      interfaceExposedMode: SubConnectorCreationMode.MANUAL
    }

    TestBed.configureTestingModule({
      imports: [
        ServiceInjectorModule
      ],
      providers: [
        { provide: FacadeService, useValue: facadeMockService},
        { provide: HttpClient, useValue: mockHttpClientService },
        { provide: Store, useValue: mockStore },
        Injector
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    facadeMockService.editorService.isConnectionMultiSelect = false;
    facadeMockService.commonService.editorHasNoDevice = false;
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getSubConnection').value.and.returnValue(getSubConnectionRes);
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getExistingSubConnectorById').value.and.returnValue({connectionId:'test',creationMode:SubConnectorCreationMode.MANUALONLINE});
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getClientInterfaceDetailsById').value.and.returnValue(InterfaceDetailsRes);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getServerInterfaceDetailsById').value.and.returnValue(InterfaceDetailsRes);
  }));

  beforeEach(() => {
     service= TestBed.inject(ConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deleteOfflineConnection', () => {
    service.deleteOfflineConnection(connector as unknown as Connector);
    expect(connector).toBeDefined();
  });

  it('deleteConnectionFromServer',()=>{
    connector.inputAnchor.parentNode.type = FillingLineNodeType.AREA;
    connector.creationMode = ConnectorCreationMode.ONLINE;
    spyOn(TestBed.get(Injector), 'get').and.returnValue(
      {deleteConnectionFromServer: ()=>{
        return true;
      }}
    ); 
    service.deleteConnectionFromServer(connector as unknown as Connector);
    expect(facadeMockService.apiService.deleteOpcConnection).toBeDefined();
  })

  it('establishConnection',()=>{
    service['connectionAdapterService'] = new ConnectionAdapterClass();
    spyOn<any>(service,'makeConnections')
    spyOn(service,'getConnectors').and.returnValue(connector as unknown as HTMLNodeConnector);
    service.establishConnection();
    expect(service.getConnectors).toHaveBeenCalled();
  })

  it('establishConnection',()=>{
    service['connectionAdapterService'] = new ConnectionAdapterClass();
    spyOn<any>(service,'makeConnections')
    spyOn(service,'getConnectors').and.returnValue(null);
    service.establishConnection();
    expect(service.getConnectors).toHaveBeenCalled();
  })

  it('updateEndpointDataAndconnectionState', () => {
    service['connectionAdapterService'] = new ConnectionAdapterClass();
    spyOn<any>(service,'updateSubconAfterDeleteConFromServer').and.callThrough();
    service.updateEndpointDataAndconnectionState(connector as unknown as Connector);
    expect(service.updateSubconAfterDeleteConFromServer).toHaveBeenCalled(); 
  });

  it('getConnectors',()=>{
    facadeMockService.editorService.establishConnectionType = EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION;
    facadeMockService.editorService.multiSelectedConnectorMap = {a: 'abc',b :'def'};
    const res = service.getConnectors();
    expect(res).toBeDefined();

    facadeMockService.editorService.establishConnectionType = EstablishConnectionMenus.ESTABLISH_ALL_CONNECTIONS;
    const res1 = service.getConnectors();
    expect(res1).not.toBeDefined();
  })

  it('createEstablishConnectionsPayload',()=>{
    spyOn(TestBed.get(Injector), 'get').and.returnValue(
      {executeConnectCall: ()=>{
        return true;
      }}
    ); 
    expect(service['createEstablishConnectionsPayload']([connector] as unknown as HTMLNodeConnector)).toBeDefined();
  })

  

});

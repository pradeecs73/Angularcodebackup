/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { connector } from 'mockData/connector';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { Device } from 'src/app/models/targetmodel.interface';
import { MonitorAdapter } from 'src/app/opcua/adapter/base-adapter/monitor-adapter';
import { BaseConnector } from 'src/app/opcua/opcnodes/baseConnector';
import {
  mockConnection,
  mockPanelData,
  mockedServerDiagnostic
} from '../../../../../mockData';
import { AdapterMethods, AddressModelType, ConnectorState, ConnectorType, DeviceState, FillingLineNodeType } from '../../../enum/enum';
import {
  MonitorObservable,
  MonitorPayload,
  PanelDataType,
  PropertiesType,
  TreeData
} from '../../../models/monitor.interface';
import { DataAdapterManagers } from '../../../opcua/adapter/adapter-manager';
import { Connector } from '../../../opcua/opcnodes/connector';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { ConnectionPropertiesPanelComponent } from './connection-properties-panel.component';

const mockDeviceData: Device = {
  name: 'Device1',
  uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi43NTo0ODQw',
  address: 'opc.tcp://192.168.2.75:4840',
  state: DeviceState.UNKNOWN,
  adapterType: AddressModelType.CLIENT_SERVER,
  'automationComponents': [
    {
      name: 'MyMachine1',
      address: '',
      deviceId: '',
      deviceName: '',
      state: DeviceState.UNKNOWN,
      id: 'test12345',
      clientInterfaces: [],
      serverInterfaces: []
    },
    {
      name: 'MyMachine2',
      address: '',
      deviceId: '',
      deviceName: '',
      state: DeviceState.UNKNOWN,
      id: 'test',
      clientInterfaces: [],
      serverInterfaces: []
    }
  ],
  'deviceSet': []
};
let facadeMockService;

fdescribe('ConnectionPropertiesPanelComponent', () => {
  let component: ConnectionPropertiesPanelComponent;
  let fixture: ComponentFixture<ConnectionPropertiesPanelComponent>;
  let messageService: MessageService;
  const panelDataSubject = new Subject<PanelDataType>();
  panelDataSubject.next(mockPanelData);
  const deviceState = new Subject<Device>();
  mockDeviceData.state = DeviceState.UNAVAILABLE;
  deviceState.next(mockDeviceData);
  const mockedConnector = new BehaviorSubject<Connector>(
    mockConnection as Connector
  );
  const monitorService = DataAdapterManagers.getadapter(
    mockPanelData.adapterType,
    AdapterMethods.MONITOR
  );

  beforeEach(async () => {
    facadeMockService = new FacadeMockService();
    facadeMockService.commonService.monitorPanelData = panelDataSubject.asObservable();
    facadeMockService.commonService.monitorPanelData.subscribe();
    facadeMockService.commonService.deviceStateData = deviceState.asObservable();
    facadeMockService.commonService.deviceStateData.subscribe();
    facadeMockService.editorService.connectionMonitor$ = mockedConnector.asObservable();
    facadeMockService.editorService.selectedConnectionObs = mockedConnector.asObservable();
    facadeMockService.commonService['globalConnectionList'] = [];
    TestBed.configureTestingModule({
      declarations: [ConnectionPropertiesPanelComponent],
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: FacadeService, useValue: facadeMockService },
        Injector
      ],
      imports: [
        TranslateModule.forRoot({})
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionPropertiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    /*  let mockServerData =  new Map<string,string[]>();
    mockServerData.set('key',['value']); */
    spyOn(TestBed.get(Injector), 'get').and.callFake((token) => {
      if (token === monitorService) {
        return {
          tagMonitorObseravablesMap: new Map<
            string,
            Map<string, MonitorObservable>
          >(),
          getTagMonitorItems: () => {
            return null;
          },
          setTagMonitorItems: () => { },
          setTagObservable: () => { },
          setTagChangeListener: () => { },
          getServerDiagnosticData: () => of(mockedServerDiagnostic),
          monitorTags: () => of(null),
          getCachedServerDiagnosticData: () => false,
          setServerDiagnosticData: () => of(null),
          getConnectionMonitorData: () => null,
          setConnectionMonitor: () => of(null),
          resetServerMonitoringData: () => { },
        };
      }
    });
  });

  it('should create', () => {
    facadeMockService.commonService.isOnline = false;
    facadeMockService.editorService.selectedConnectionObs = mockedConnector.asObservable();
    component.selectedConnection$ = mockedConnector.asObservable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Connection selection subscription', () => {
    facadeMockService.commonService.isOnline = true;
    spyOn(TestBed.get(monitorService), 'getServerDiagnosticData');
    facadeMockService.commonService.monitorPanelData = of(mockPanelData);
    facadeMockService.commonService.changePanelData(mockPanelData);
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.cols).toBeDefined();
  });

  it('On deviceStateData change with subscription should update isDeviceStateUnavailable', (done) => {
    //given
    component.isDeviceStateUnavailable$ = of(false);
    facadeMockService.commonService.isOnline = true;
    facadeMockService.commonService.changePanelData(mockPanelData);
    component.ngOnInit();
    component['panelData'] = mockPanelData;
    mockDeviceData.state = DeviceState.AVAILABLE;
    deviceState.next(mockDeviceData);
    component['selectedConnector'] = mockConnection as BaseConnector;
    facadeMockService.editorService.selectedConnectionObs = mockedConnector.asObservable();
    mockDeviceData.state = DeviceState.AVAILABLE;
    facadeMockService.commonService.changeDeviceState(mockDeviceData);
    fixture.detectChanges();
    // expected
    component.isDeviceStateUnavailable$.subscribe((response) => {
      expect(response).toBe(false);
      done();
    });
  });

  it('checkConnectorType', () => {
    expect(component.checkConnectorType({ type: ConnectorType.CONNECTOR, connectionStatus: true } as unknown as BaseConnector)).toEqual(true);
  });

  it('getOutputAnchorDetails', () => {
    let connector = {
      outputAnchor: {
        devicedId: 'test',
        parentNode: {
          type: FillingLineNodeType.AREA,
          deviceId: 'testtt'
        }
      }
    };
    expect(component.getOutputAnchorDetails(connector)).toBeDefined();
    connector.outputAnchor.parentNode.type = FillingLineNodeType.HEADER;
    expect(component.getOutputAnchorDetails(connector)).toBeDefined();
  });

  it('updateConnectorDetails', () => {
    component.monitor = {
      getCachedServerDiagnosticData: () => {
        return {} as unknown as TreeData[];
      },
      getMonitorDataById: () => {
        return ['a', 'b'] as unknown as TreeData[];
      },
      removeFromCachedServerMonitoringData: () => {
        return true;
      }
    } as unknown as MonitorAdapter;
    component.updateConnectorDetails(connector as unknown as Connector);
    expect(facadeMockService.commonService.updatePropertyState).toHaveBeenCalled();
  });

  it('registerTagsForMonitoring', () => {
    spyOn(component, 'setAllTagsChangeListeners');
    component.monitor = {
      getTagMonitorItems: () => {
        return { id: 'test' } as unknown as MonitorPayload;
      },
      tagMonitorObseravablesMap: {
        get: () => {
          return true;
        }
      },
      monitorTags: () => {
        return of(true);
      }
    } as unknown as MonitorAdapter;
    component.registerTagsForMonitoring();
    expect(component.setAllTagsChangeListeners).toHaveBeenCalled();
  });

  it('setAllTagsChangeListeners', () => {
    spyOn(component, 'setTagValue');
    component.monitor = {
      getTagMonitorItems: () => {
        return { id: 'test' } as unknown as MonitorPayload;
      },
      tagMonitorObseravablesMap: {
        get: () => {
          return { keys: () => { return ['a']; }, get: () => { return { event: of('test') }; } };
        }
      },
      monitorTags: () => {
        return of(true);
      }
    } as unknown as MonitorAdapter;
    component.setAllTagsChangeListeners();
    expect(component.setTagValue).toHaveBeenCalled();
  });

  it('setTagValue', () => {
    component.monitor = {
      setTagValueFromMonitor: () => {
        return [{ children: ['a'] }];
      }
    } as unknown as MonitorAdapter;
    component['browseService'] = {
      createPanelTreeData: () => {
        return ['a'];
      }
    };
    component.setTagValue('test', 'test');
    expect(component.treeData).toBeDefined();
  });

  it('setAttributeData', () => {
    spyOn(component, 'setEventData');
    component.setAttributeData(['a'] as unknown as Array<PropertiesType>);
    expect(component.setEventData).toHaveBeenCalled();
  });

  it('createCopy', () => {
    const data = [{
      name: 'test',
      value: 'test',
      type: 'test',
      children: [{
        name: 'test1',
        value: 'test1',
        type: 'test'
      }]
    }];
    expect(component.createCopy(data)).toBeDefined();
  });

  it('formatToKeyValuePair', () => {
    expect(component.formatToKeyValuePair({ errorCount: 0, totalCount: 0 })).toBeDefined();
  });

  it('setEventData', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.commonService, 'setExpandedState').value.and.returnValue({ eventName: 'test', name: "SessionDiagnostics", children: [] });
    const data = [{
      name: "totalCount",
      type: "",
      value: 0,
      data: {
        name: "totalCount",
        type: "",
        value: 0
      }
    }];
    expect(component.setEventData(data)).toBeDefined();
  });

  it('formatData', () => {
    const data = [{
      name: "totalCount",
      type: "",
      value: 0
    }, {
      name: "errorCount",
      type: "",
      value: { id: 'test' }
    }];
    expect(component.formatData(data)).toBeDefined();
  });

  it('getAddressFromConnectorObject', () => {
    expect(component.getAddressFromConnectorObject({ relatedEndPoint: { address: 'test' } } as unknown as Connector)).toEqual('test');
    expect(component.getAddressFromConnectorObject({ relatedEndPoint: { address: { 'address': 'test' } } } as unknown as Connector)).toEqual('test');
  });

  it('generateClientDiagnosticData', () => {
    expect(component.generateClientDiagnosticData(connector)).toBeDefined();
  });

  it('getServerDiagnosticData', () => {
    expect(component['getServerDiagnosticData']({}, connector)).toBeDefined();
  });

  it('updateShowConnectionAvailable', () => {
    component.selectedConnector = null;
    facadeMockService.commonService.deviceStateData = of('test');
    component.monitor = { resetServerMonitoringData: () => { } } as unknown as MonitorAdapter;
    component['updateShowConnectionAvailable']();
  });

  it('removeChildrenValues', () => {
    let data = [{
      eventName: 'test',
      name: 'teset',
      type: 'test',
      value: 'test',
      children: [{}, {}]
    }];
    component['removeChildrenValues'](data);
    let data1 = [{
      eventName: 'test',
      name: 'teset',
      type: 'test',
      value: { id: 'test' },
      children: [{}, {}]
    }];
    expect(component['removeChildrenValues'](data1)).toBeDefined();
  });

  it('getMonitorItem', () => {
    spyOn<any>(component, 'getMonitorConnectionList');
    component.monitor = { getTagMonitorItems: () => { return undefined; }, setTagMonitorItems: () => { } } as unknown as MonitorAdapter;
    component['getMonitorItem']();
  });

  it('getMonitorConnectionList', () => {
    component.monitor = {
      setTagObservable: () => { },
      setTagChangeListener: () => { }
    } as unknown as MonitorAdapter;
    component['getMonitorConnectionList']([{ eventName: 'test', name: "SessionDiagnostics" }]);
    expect(component.monitor).toBeDefined();
  });

  it('isConnectionNotOnline', () => {
    component.selectedConnector = { state: ConnectorState.Default } as unknown as BaseConnector;
    const spy = spyOnProperty(component, 'isConnectionNotOnline').and.callThrough();
    expect(component.isConnectionNotOnline).toEqual(true);
    expect(spy).toHaveBeenCalled();
  });
});

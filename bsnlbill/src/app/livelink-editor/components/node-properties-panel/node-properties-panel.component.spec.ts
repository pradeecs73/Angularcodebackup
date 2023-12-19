/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { mockCreatedTreeData, mockPanelData } from 'mockData';
import { of, Subject } from 'rxjs';
import { Device, DeviceSetConfig } from 'src/app/models/targetmodel.interface';
import {
 AdapterMethods,
 AddressModelType,
 DeviceState
} from '../../../enum/enum';
import {
    MonitorObservable,
 MonitorPayload,
 PanelDataType
} from '../../../models/monitor.interface';
import { DataAdapterManagers } from '../../../opcua/adapter/adapter-manager';
import { NodePropertiesPanelComponent } from './node-properties-panel.component';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from '../../../home/home.component';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { MonitorAdapter } from './../../../opcua/adapter/base-adapter/monitor-adapter';

let mockApiService: ApiService;
const defaultFillingNodes = {
 ids: [],
 entities: {}
};
const initialState = {
 deviceTreeList: of(null),
 fillingLine: defaultFillingNodes
};

const mockDeviceData: Device = {
 name: 'Device1',
 uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi43NTo0ODQw',
 address: 'opc.tcp://192.168.2.75:4840',
 state: DeviceState.UNKNOWN,
 adapterType: AddressModelType.CLIENT_SERVER,
 automationComponents: [
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
 deviceSet: []
};

fdescribe('NodePropertiesPanelComponent', () => {
 let component: NodePropertiesPanelComponent;
 let fixture: ComponentFixture<NodePropertiesPanelComponent>;
 const panelDataSubject = new Subject<PanelDataType>();
 panelDataSubject.next(mockPanelData);
 const deviceState = new Subject<Device>();
 mockDeviceData.state = DeviceState.UNAVAILABLE;
 deviceState.next(mockDeviceData);
 let mockHttpClientService: HttpClient;
 let mockMessageService: MessageService;
 let facadeMockService;

 beforeEach(
  waitForAsync(() => {
   facadeMockService = new FacadeMockService();

   facadeMockService.commonService.monitorPanelData = panelDataSubject.asObservable();
   facadeMockService.commonService.monitorPanelData.subscribe();
   facadeMockService.commonService.deviceStateData = deviceState.asObservable();
   facadeMockService.commonService.deviceStateData.subscribe();
   facadeMockService.commonService.isOnline = false;
   facadeMockService.commonService.deviceStateData = of({
    uid: 'device123',
    state: 'offline'
   });
   facadeMockService.commonService.updatePropertyState = function () {};
   TestBed.configureTestingModule({
    imports: [
     RouterTestingModule.withRoutes([
      { path: 'home', component: HomeComponent }
     ]),
     TranslateModule.forRoot({})
    ],
    declarations: [NodePropertiesPanelComponent],
    providers: [
     { provide: HttpClient, useValue: mockHttpClientService },
     { provide: MessageService, useValue: mockMessageService },
     { provide: FacadeService, useValue: facadeMockService },
     Injector,
     provideMockStore({ initialState })
    ]
   }).compileComponents();
  })
 );

 beforeEach(() => {
  fixture = TestBed.createComponent(NodePropertiesPanelComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
 });

 it('should create', () => {
  expect(component).toBeTruthy();
 });

 it('monitorPanelData subscription', () => {
  const monitorService = DataAdapterManagers.getadapter(
   mockPanelData.adapterType,
   AdapterMethods.MONITOR
  );
  const browseService = DataAdapterManagers.getadapter(
   mockPanelData.adapterType,
   AdapterMethods.BROWSE
  );
  spyOn(TestBed.get(Injector), 'get').and.callFake(token => {
   if (token === browseService) {
    return {
     createPanelTreeData: () => {
      return mockCreatedTreeData;
     }
    };
   }
   if (token === monitorService) {
    return {
     getTagMonitorItems: () => {
      return null;
     },
     setTagMonitorItems: () => {},
     setTagObservable: () => {},
     setTagChangeListener: () => {},
     getMonitorDataById: () => {},
     setMonitorData: () => {}
    };
   }
  });
  spyOn(TestBed.get(monitorService), 'setTagMonitorItems');
  facadeMockService.commonService.monitorPanelData = of(mockPanelData);
  facadeMockService.commonService.changePanelData(mockPanelData);
  component.ngOnInit();
  fixture.detectChanges();
  expect(component.panelData).toBeDefined();
 });
 it('If monitorPanelData subscription is empty then treeData and panelData is changed to null ', () => {
  const monitorService = DataAdapterManagers.getadapter(
   mockPanelData.adapterType,
   AdapterMethods.MONITOR
  );
  const browseService = DataAdapterManagers.getadapter(
   mockPanelData.adapterType,
   AdapterMethods.BROWSE
  );
  spyOn(TestBed.get(Injector), 'get').and.callFake(token => {
   if (token === browseService) {
    return {
     createPanelTreeData: () => {
      return mockCreatedTreeData;
     }
    };
   }
   if (token === monitorService) {
    return {
     getTagMonitorItems: () => {
      return null;
     },
     setTagMonitorItems: () => {},
     setTagObservable: () => {},
     setTagChangeListener: () => {},
     getMonitorDataById: () => {},
     setMonitorData: () => {}
    };
   }
  });
  spyOn(TestBed.get(monitorService), 'setTagMonitorItems');
  facadeMockService.commonService.monitorPanelData = of(null);
  component.ngOnInit();
  fixture.detectChanges();
  expect(component.treeData).toBeNull();
  expect(component.panelData).toBeNull();
 });
 it('If deviceStateData is changed then common changePanelData is called ', () => {
  facadeMockService.commonService.changePanelData(mockPanelData);
  component.panelData = mockPanelData as PanelDataType;
  const monitorService = DataAdapterManagers.getadapter(
   mockPanelData.adapterType,
   AdapterMethods.MONITOR
  );
  const browseService = DataAdapterManagers.getadapter(
   mockPanelData.adapterType,
   AdapterMethods.BROWSE
  );
  spyOn(TestBed.get(Injector), 'get').and.callFake(token => {
   if (token === browseService) {
    return {
     createPanelTreeData: () => {
      return mockCreatedTreeData;
     }
    };
   }
   if (token === monitorService) {
    return {
     getTagMonitorItems: () => {
      return null;
     },
     setTagMonitorItems: () => {},
     setTagObservable: () => {},
     setTagChangeListener: () => {},
     getMonitorDataById: () => {},
     setMonitorData: () => {}
    };
   }
  });
  spyOn(TestBed.get(monitorService), 'setTagMonitorItems');
  facadeMockService.commonService.monitorPanelData = of(null);
  mockDeviceData.state = DeviceState.AVAILABLE;
  deviceState.next(mockDeviceData);
  component.deviceStateChange();
  mockDeviceData.state = DeviceState.UNAVAILABLE;
  deviceState.next(mockDeviceData);
  component.panelData = mockPanelData as PanelDataType;
  fixture.detectChanges();
  expect(facadeMockService.commonService.changePanelData).toHaveBeenCalled();
 });

 it('should call setTagValue method', () => {
  component['monitor'] = ({
   setTagValueFromMonitor: () => {
    return [{ children: '' }];
   }
  } as unknown) as MonitorAdapter;
  component['browseService'] = {
   createPanelTreeData: () => {
    return false;
   }
  };
  fixture.detectChanges();
  component.setTagValue('myevent', 25);
  expect(component.setTagValue).toBeDefined();
 });

 it('should call translateName method', () => {
  component.translateName('Server Interface');
  expect(component.translateName).toBeDefined();
 });

 it('should call deviceStateChange method', () => {
  component.panelData = ({ deviceId: 'device123' } as unknown) as PanelDataType;
  fixture.detectChanges();
  component.deviceStateChange();
  expect(component.deviceStateChange).toBeDefined();
 });

 it('should call registerTagsForMonitoring method', () => {
  facadeMockService.commonService.isOnline = true;
  spyOn(component, 'getMonitorItem').and.returnValue(
   (of({}) as unknown) as MonitorPayload
  );
  spyOn(component, 'setAllTagsChangeListeners');
  spyOn(component, 'doesMonitorMapContainsTagValue').and.returnValue(false);
  component['monitor'] = ({
   monitorTags: () => {
    return of('data');
   }
  } as unknown) as MonitorAdapter;
  fixture.detectChanges();
  component.registerTagsForMonitoring();
  expect(component.registerTagsForMonitoring).toBeDefined();
 });


 it('should call convertMonitorInt64ToString method', () => {

    const numberArray=[1,2,3,4,5];
    component.convertMonitorInt64ToString(numberArray);
    expect(component.convertMonitorInt64ToString).toBeDefined();

    component.convertMonitorInt64ToString(null);
    expect(component.convertMonitorInt64ToString).toBeDefined();

   });

   it('should call setTagValueBasedOnTagEventMapValue method', () => {

    const event="click";
    const tagEventMap={get:()=>{
        return {
            event:{
                subscribe:()=>true
            }

        };
    }} as unknown as Map<string, MonitorObservable>;
    spyOn(component, 'setTagValue');

    component['setTagValueBasedOnTagEventMapValue'](event,tagEventMap);
    expect(component['setTagValueBasedOnTagEventMapValue']).toBeDefined();

   });

 it('should call getTagEventMap method', () => {

    const event="click";
    component['monitor']={
        tagMonitorObseravablesMap:{
            get:()=>true
        }
    } as unknown as MonitorAdapter;

    spyOn(component, 'setTagValue');

    component['getTagEventMap']();
    expect(component['getTagEventMap']).toBeDefined();

   });

   it('should call setAllTagsChangeListeners method', () => {

    spyOn<any>(component, 'getTagEventMap').and.returnValue({keys:()=>['key1','key2']});
    spyOn<any>(component, 'setTagValueBasedOnTagEventMapValue').and.returnValue({});

    component.setAllTagsChangeListeners();
    expect(component.setAllTagsChangeListeners).toBeDefined();

   });

   it('should call getTagEventMap method', () => {

    const event="click";
    component['monitor']={
        tagMonitorObseravablesMap:{
            get:()=>true
        }
    } as unknown as MonitorAdapter;

    spyOn(component, 'setTagValue');

    component['getTagEventMap']();
    expect(component['getTagEventMap']).toBeDefined();

   });

   it('should call callCorrespondingDataTypeFormatter method', () => {

    const monitorData={
        type:'monitor'
    };

    component.dataTypeMap={
        has:()=>true,
       'monitor':{},
        get:()=>'getTagEventMap'
    } as unknown as Map<any, any>;

    spyOn<any>(component, 'getTagEventMap').and.returnValue({});

    component.callCorrespondingDataTypeFormatter(monitorData);
    expect(component.callCorrespondingDataTypeFormatter).toBeDefined();

   });


   it('should call formatDataBasedOnDataTypes method', () => {

    const treeData=[{children:[{name:'samplename'}]}];

    spyOn<any>(component, 'callCorrespondingDataTypeFormatter').and.returnValue({});

    component.formatDataBasedOnDataTypes(treeData);
    expect(component.formatDataBasedOnDataTypes).toBeDefined();

   });

   it('should call doesMonitorMapContainsTagValue method', () => {

    spyOn<any>(component, 'getTagEventMap').and.returnValue({
        keys:()=>['key1','key2'],
        get:()=>{return {value:true}}
    });

    spyOn<any>(component, 'setTagValueBasedOnTagEventMapValue').and.returnValue({});

    component.doesMonitorMapContainsTagValue();
    expect(component.doesMonitorMapContainsTagValue).toBeDefined();

    const mapValue={
        keys:()=>['key1','key2'],
        get:()=>{return {value:false}}
    };

    component['getTagEventMap']=()=>mapValue as unknown as Map<string, MonitorObservable>;

    component.doesMonitorMapContainsTagValue();
    expect(component.doesMonitorMapContainsTagValue).toBeDefined();

   });


});

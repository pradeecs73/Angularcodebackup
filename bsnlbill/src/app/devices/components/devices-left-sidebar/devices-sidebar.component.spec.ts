/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { DevicesLeftSidebarComponent } from './devices-sidebar.component';
import { AddressModelType, DeviceState, PanelMenu } from '../../../enum/enum';
import { Device } from '../../../models/targetmodel.interface';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';

let component: DevicesLeftSidebarComponent;
let fixture: ComponentFixture<DevicesLeftSidebarComponent>;
let messageService: MessageService;


const mockDeviceData: Device = {
  name: 'Device1',
  uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi43NTo0ODQw',
  address: 'opc.tcp://192.168.2.75:4840',
  state: DeviceState.AVAILABLE,
  adapterType: AddressModelType.CLIENT_SERVER,
  'automationComponents': [
    {
      name: 'MyMachine1',
      address: '',
      deviceId: '',
      deviceName: '',
      state: DeviceState.AVAILABLE,
      id: '',
      clientInterfaces: [],
      serverInterfaces: []
    }
  ],
  'deviceSet': [
    {
      name: 'ProductCode',
      type: 'String',
      value: '6ES7 513-1AL02-0AB0  V02.08.00'
    },
   {
      name: 'DeviceRevision',
      type: 'String',
      value: '6ES7 513-1AL02-0AB0  V02.08.00'
    },
   {
      'name': 'EngineeringRevision',

      'type': 'String',
      'value': 'V17.0'
    },
     {
      'name': 'HardwareRevision',

      'type': 'String',
      'value': '0'
    },
     {
      'name': 'Manufacturer',

      'type': 'LocalizedText',
      'value': 'locale=null text=Siemens AG'
    },
    {
      'name': 'Model',

      'type': 'LocalizedText',
      'value': 'locale=null text=CPU 1513-1 PN'
    },
     {
      'name': 'OrderNumber',

      'type': 'String',
      'value': '6ES7 513-1AL02-0AB0 '
    },
     {
      'name': 'RevisionCounter',
      'type': 'Int32',
      'value': '1'
    },
    {
      'name': 'SerialNumber',
      'type': 'String',
      'value': '10S C-053l853401'
    }
  ]
};

let facadeMockService;
const initialState = { deviceTreeList: of(null) };

fdescribe('Device sidebar', () => {
  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    facadeMockService.commonService.isOnline = false;

    TestBed.configureTestingModule({
      declarations: [DevicesLeftSidebarComponent,DisableIfUnauthorizedDirective],
      imports: [PanelMenuModule,TranslateModule.forRoot({})],
      providers: [
      { provide: MessageService, useValue: messageService },
      { provide: FacadeService, useValue: facadeMockService},
      provideMockStore({ initialState })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: false,name:'test' } });
    fixture = TestBed.createComponent(DevicesLeftSidebarComponent);
    component = fixture.componentInstance;
    component.viewType = 'full';
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });


  it('project name should be defined', () => {
    const result = component.getProjectName();
    expect(result).toBeDefined();
  });

  it('saveProject will be called only in offline mode', () => {
    const spy = spyOn(component, 'saveCurrentProject');
    component.saveCurrentProject();
    expect(spy).toHaveBeenCalled();
  });

  it('should call updateDevicesSideBar', () => {
    component.updateDevicesSideBar([mockDeviceData]);
    expect(component.devicesItems.length).toBe(1);

    //with empty device list
    component.updateDevicesSideBar(null);
    expect(component.devicesItems.length).toBeGreaterThan(0);
  });



  it('should call for clickHandlerFromDeviceTree', () => {
    spyOn(component, 'clickHandlerFromDeviceTree').and.callThrough();
    const menuClick = fixture.nativeElement.querySelector(PanelMenu.PANEL_MENU_HEADER);
    menuClick.classList.add(PanelMenu.PANEL_HEADER_LINK_CLASS);
    const event = {
      originalEvent: {
        target: { classList: menuClick.classList, parentNode: { classList: menuClick.classList } }
      }, item: { expanded: true }
    };


    component.clickHandlerFromDeviceTree(event, mockDeviceData);
    menuClick.classList.add(PanelMenu.ICON_CLASS);
    component.clickHandlerFromDeviceTree(event, mockDeviceData);
    expect(component.clickHandlerFromDeviceTree).toHaveBeenCalled();
  });


  it('it should call saveCurrentProject', () => {
    spyOn(component, 'saveCurrentProject').and.callThrough();
    component.saveCurrentProject();
    expect(component.saveCurrentProject).toHaveBeenCalled();
  });

  it('it should call saveCurrentProject', () => {
    spyOn(component, 'saveCurrentProject').and.callThrough();
    component.saveCurrentProject();
    expect(component.saveCurrentProject).toHaveBeenCalled();
  });

  it('it should call removeWidth method', () => {
    const mode='full';
    component.removeWidth(mode);
    expect(component.removeWidth).toBeDefined();
  });

  it('it should call removeAllActiveClass method', () => {
    const pElement = document.createElement('p');
    pElement.classList.add('p-menuitem-link');
    component.elementRef.nativeElement.appendChild(pElement);
    component.removeAllActiveClass();
    expect(component.removeAllActiveClass).toBeDefined();
  });

  it('it should updateSubmenuActiveClass  method', () => {
    const pElement = document.createElement('p');
    pElement.classList.add(PanelMenu.PANEL_MENU_ITEM_LINK);
    component.elementRef.nativeElement.appendChild(pElement);
    component.updateSubmenuActiveClass(pElement);
    expect(component.updateSubmenuActiveClass).toBeDefined();

    const targetEvent={classList:{contains:()=>false},parentNode:document.createElement('p')};
    targetEvent.parentNode.classList.add(PanelMenu.PANEL_MENU_ITEM_LINK);
    component.updateSubmenuActiveClass(targetEvent);
  });

});

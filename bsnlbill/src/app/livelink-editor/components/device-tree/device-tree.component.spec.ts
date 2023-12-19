/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { AddressModelType, DeviceState } from '../../../enum/enum';
import { Node } from '../../../models/models';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { DeviceRightbarComponent } from './device-tree.component';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis.pipe';

fdescribe('DeviceTree Component', () => {
  let facadeMockService;
  let component: DeviceRightbarComponent;
  let fixture: ComponentFixture<DeviceRightbarComponent>;
  const initialState = { deviceTreeList: of(null) };
  let mockMessageService: MessageService;
  let mockHttpClientService: HttpClient;
  facadeMockService = new FacadeMockService();
  const mockDeviceDataDeviceSync: any = {
    name: 'Device1',
    uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi43NTo0ODQw',
    address: 'opc.tcp://192.168.2.75:4840',
    state: DeviceState.AVAILABLE,
    adapterType: AddressModelType.CLIENT_SERVER,
    'automationComponents': [
      {
        name: 'MyMachine1',
        address: '',
        deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi43NTo0ODQw',
        deviceName: '',
        state: DeviceState.AVAILABLE,
        id: 'test12345',
        clientInterfaces: [],
        serverInterfaces: []
      },
      {
        name: 'MyMachine2',
        address: '',
        deviceId: '',
        deviceName: '',
        state: DeviceState.AVAILABLE,
        id: 'test',
        clientInterfaces: [],
        serverInterfaces: []
      }
    ]
  };

  beforeEach(waitForAsync(() => {
    Object.getOwnPropertyDescriptor(facadeMockService.deviceStoreService, 'getDeviceTree').value.and.returnValue(of({}));
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    TestBed.configureTestingModule({
      declarations: [DeviceRightbarComponent,EllipsisPipe],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [{ provide: MessageService, useValue: mockMessageService },
      { provide: FacadeService, useValue: facadeMockService },
      { provide: HttpClient, useValue: mockHttpClientService },
      provideMockStore({ initialState })]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceRightbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.devices = [mockDeviceDataDeviceSync];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleExpandState  method', () => {
    const collapsibleElement = fixture.debugElement.nativeElement.querySelector('.collapsible');
    collapsibleElement.click();
    expect(component.toggleExpandState).toBeDefined();
  });

  it('should call toggleElement  method', () => {
    component.toggleExpandState('Device1');
    expect(component.toggleExpandState).toBeDefined();
  });

  it('should call loadFillingArea  method', () => {
    const areas = [{ 'name': 'Area 1', 'parent': 'area12345' }];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue(areas);
    component.loadFillingArea();
    expect(component.loadFillingArea).toBeDefined();
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue(null);
    component.loadFillingArea();
  });

  it('should call loadFillingLineStore  method', () => {
    component.loadFillingLineStore([mockDeviceDataDeviceSync]);
    expect(component.loadFillingArea).toBeDefined();
  });

  it('should call loadFillingNode  method', () => {
    const nodes = [{ 'id': 'test12345', 'deviceId': 'b3BjLnRjcDovLzE5Mi4xNjguMi43NTo0ODQw' }];
    component.loadFillingNode([mockDeviceDataDeviceSync], nodes as unknown as Array<Node>);
    expect(component.loadFillingNode).toBeDefined();
  });

});

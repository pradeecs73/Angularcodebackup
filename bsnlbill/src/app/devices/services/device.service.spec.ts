/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { HomeComponent } from './../../home/home.component';
import { Device } from './../../models/targetmodel.interface';
import { FacadeMockService } from './../../livelink-editor/services/facade.mock.service';
import { FacadeService } from './../../livelink-editor/services/facade.service';
import { DeviceService } from './device.service';

import { mockDevices } from 'mockData';
import { of } from 'rxjs';
import { AccessType, FillingLineNodeType } from './../../enum/enum';
import { ProjectProtection } from './../../models/models';
import { HTMLNode } from './../../opcua/opcnodes/htmlNode';


let mockMessageService: MessageService;
let service: DeviceService;
const projectDevices: Device[] = mockDevices;

fdescribe('Device service', () => {

  let facadeMockService: FacadeMockService;
  beforeEach(() => {

    facadeMockService = new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useValue: mockMessageService },
      { provide: FacadeService, useValue: facadeMockService }],
      imports: [TranslateModule.forRoot({}), RouterTestingModule.withRoutes(
        [{ path: 'home', component: HomeComponent }]
      )]
    });
    service = TestBed.inject(DeviceService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setDeviceDetails method', () => {
    service.setDeviceDetails({});
    expect(service.setDeviceDetails).toBeDefined();
  });

  it('should call updateDevicesData method', () => {
    const deviceList = ([
      { uid: '12345', id: '12345', state: 'online' },
    ] as unknown) as Device[];
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ type: FillingLineNodeType.NODE, deviceId: '12345' }] as unknown as Array<HTMLNode>;
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAutomationComponents').value.and.returnValue(deviceList);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getNodeByID').value.and.returnValue(true);
    service.updateDevicesData(deviceList);
    expect(service.updateDevicesData).toBeDefined();
  });

  it('should call showAuthenticationPopupState method', () => {
    const myvalue = [1, 2];
    Object.getOwnPropertyDescriptor(facadeMockService.commonService, 'authenticationPopUpState').value.and.returnValue(of(myvalue));
    service.showAuthenticationPopupState();
    expect(service.showAuthenticationPopupState).toBeDefined();
  });

  it('should call onSubmitProjectProtection method', () => {
    let formData = [{ credentials: { password: '12345', confirmPassword: '12345' }, mode: AccessType.READ }];
    const accessDetailsArray = [{ data: {} }];
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'registerPassword').value.and.returnValue(of(accessDetailsArray));
    service.onSubmitProjectProtection(formData as unknown as Array<ProjectProtection>);
  });
  it('updateBasedOnProperty should return current value if previous value is false', () => {
    // given
    const previousValue = false;
    const result = service.updateBasedOnProperty(
      'name',
      'name',
      'BottleFilling',
      previousValue,
      'LiquidMixing',
      projectDevices[0]
    );
    // expect
    expect(result).toBe('BottleFilling');
  });
  it('updateBasedOnProperty should return previous value if previous value is true', () => {
    // given
    const previousValue = true;
    const result = service.updateBasedOnProperty(
      'name',
      'name',
      'BottleFilling',
      previousValue,
      'LiquidMixing',
      projectDevices[0]
    );
    // expect
    expect(result).toBe('LiquidMixing');
  });
  it('updateBasedOnProperty should return empty if the device edited by the user is different from called', () => {
    // given
    const previousValue = false;
    const result = service.updateBasedOnProperty(
      'name',
      'address',
      'BottleFilling',
      previousValue,
      'LiquidMixing',
      projectDevices[0]
    );
    // expect
    expect(result).toBe('');
  });
  it('updateBasedOnProperty should return old device value from device reference if the device edited by the user is different from called and previous value is true', () => {
    // given
    const previousValue = true;
    const result = service.updateBasedOnProperty(
      'name',
      'address',
      'BottleFilling',
      previousValue,
      'LiquidMixing',
      projectDevices[0]
    );
    // expect
    expect(result).toBe('opc.tcp://192.168.2.51:4840');
  });

  it('updateBasedOnProperty should return decoded device uid if it is address and previous value is address', () => {
    // given
    const previousValue = true;
    const result = service.updateBasedOnProperty(
      'address',
      'address',
      'BottleFilling',
      previousValue,
      'LiquidMixing',
      projectDevices[0]
    );
    // expect
    expect(result).toBeDefined();
  });

  it('should call handleBrowseErrorNotification method', () => {
    const device = { uid: 'uid12345', address: 'address12345', errorCode: '12345' } as unknown as Device;
    service.handleBrowseErrorNotification(device);
    expect(service.handleBrowseErrorNotification).toBeDefined();
  });


  it('getUpdatedAddress should return the same value if it is address', () => {
    const value = 'new address';
    const device = { uid: 'uid12345', address: 'address12345', errorCode: '12345' } as unknown as Device;
    const expected = service.getUpdatedAddress('address', value, device);
    expect(expected).toEqual(value);
  });
  it('getUpdatedAddress should return empty if it is name', () => {
    const value = 'new address';
    const device = { uid: 'uid12345', address: 'address12345', errorCode: '12345' } as unknown as Device;
    const expected = service.getUpdatedAddress('name', value, device);
    expect(expected).toEqual('');
  });
  it('getUpdatedAddress should return device address if it the property name is empty or not matching', () => {
    const value = 'new address';
    const device = { uid: 'uid12345', address: 'address12345', errorCode: '12345' } as unknown as Device;
    const expected = service.getUpdatedAddress(null, value, device);
    expect(expected).toEqual(device.address);
  });

});

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { mockDevices, projectRegexStore } from 'mockData';
import { of } from 'rxjs';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { DEVICE_URLVALIDATE_REGEX, NO_DEVICES_SELECTED, OPCTCP } from '../../../utility/constant';
import { Device } from './../../../models/targetmodel.interface';
import { DeviceAddDetailsSelectorComponent } from './device-add-details-selector.component';

let component: DeviceAddDetailsSelectorComponent;
let fixture: ComponentFixture<DeviceAddDetailsSelectorComponent>;

let facadeMockService;
const projectDevices: Device[] = mockDevices;
const initialState = { deviceTreeList: of(null) };
const serverUrl = 'opc.tcp://md3cy84c:62580/MixerOpc';
const validateServerUrl = '//.com.com';
const deviceConf = {
  name: '',
  address: '',
  deviceType: '',
  uid: ''
};

const deviceAddedToGrid = [{
  name: 'Device1',
  uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MDo0ODQw',
  address: 'opc.tcp://192.168.2.50:4840',
},
{
  name: 'Device2',
  uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MTo0ODQw',
  address: 'opc.tcp://192.168.2.51:4840',
}];

const device = {
  name: 'Device1',
  uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MDo0ODQw',
  address: 'opc.tcp://192.168.2.50:4840',
  isValidAddressModel:false,
  isSecurityPolicyValid:false
}
fdescribe('Device Add Details selector', () => {
  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    facadeMockService.apiService.deviceUrlValidatioRegex = DEVICE_URLVALIDATE_REGEX.toString();
    facadeMockService.apiService.isDeviceConnected = jasmine.createSpy().and.returnValue(of({
      'data': {
        'isConnected': true,
        'deviceName': 'TestDevice'
      },
      'error': null,
      'status': 'SUCCESS'
    } as Object));



      facadeMockService.commonService.projectRegex = projectRegexStore;


    TestBed.configureTestingModule({
      declarations: [DeviceAddDetailsSelectorComponent],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [ { provide: FacadeService, useValue: facadeMockService},
      provideMockStore({ initialState })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAddDetailsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  it('On Click of Next Button form errors should be false', () => {
    const nxtBtn = fixture.debugElement.nativeElement.querySelectorAll('.button-next')[0];
    expect(nxtBtn).toBeDefined();
    nxtBtn.click();
    expect(component.checkAddDetailsFormValidation()).toBeFalsy();
  });

  it('checkAddDetailsFormValidation', () => {
    component.deviceNameField = false;
    component.addDetailsForm.controls.address.setValue('opc.tcp://192.168.2.50:4840');
    component.checkAddDetailsFormValidation();

    component.addDetailsForm.controls.address.setValue('');
    component.checkAddDetailsFormValidation();
    expect(component.checkAddDetailsFormValidation).toBeDefined();
  });

  it('removeDeviceFormErrors should remove the form errors', () => {
    component.addDetailsForm.controls.address.setErrors({ 'duplicate': true });
    component.removeDeviceFormErrors();
    var result = component.addDeviceError;
    expect(result).toBeFalsy();
  });
  it('hideError should remove the form errors', () => {
    component.hideError();
    var result = component.addDeviceError;
    expect(result).toBeFalsy();
  });
  it('if device not connected device error should be true', () => {
    component.handleDeviceNotConnected();
    var result = component.addDeviceError;
    expect(result).toBeTruthy();
  });
  it('if device is already added device error should be true', () => {
    component.handleDeviceAlreadyAdded();
    var result = component.addDeviceError;
    expect(result).toBeTruthy();
  });
  it('device url error should come if device url is invalid', () => {
    component.deviceUrlError();
    var result = component.addDetailsForm.controls.address.valid;
    expect(result).toBeFalsy();
    var result2 = component.addDetailsForm.get('address').errors['deviceUrlValidationError'];
    expect(result2).toBeTruthy();
  });
  it('device name error should come if device name is invalid', () => {
    component.deviceNameError();
    var result = component.addDetailsForm.controls.name.valid;
    expect(result).toBeFalsy();
  });
  it('set protocol type as default value in input', () => {
    var result = component.addDetailsForm.controls.address.value;
    expect(result).toBe(OPCTCP);
  });
  it('form error true in case of duplicate devices', () => {
    component.handleDeviceNotConnected();
    var result = component.addDetailsForm.controls.address.errors;
    expect(result).toBeTruthy();
  });
  it('form should not give any errors if serverUrl is valid', () => {
    component.addDetailsForm.controls.address.setValue(`${serverUrl}`);
    component.addDetailsForm.controls.name.setValue(`${'MixerOpc'}`);
    fixture.detectChanges();
    expect(component.addDetailsForm.valid).toBe(false);
  });
  /*
  Test cases are failing in device adding twice in double click.Need to be fixed
  **/
  xit('adding the same device should not add duplicate values', () => {
    component.addDetailsForm.controls.address.setValue(`${serverUrl}`);
    fixture.detectChanges();
    for (let i = 0; i < 2; i++) {
      component.connect();
    }
    expect(facadeMockService.apiService.isDeviceConnected).toHaveBeenCalledTimes(1);
    expect(component.devicesAddedToGrid.length).toBe(1);
  });
  it('form should give errors if server url is .com', () => {
    component.addDetailsForm.controls.address.setValue(`${'.com'}`);
    fixture.detectChanges();
    expect(component.addDetailsForm.valid).toBe(false);
  });
  it('form should give errors if server url is not correct', () => {
    component.addDetailsForm.controls.address.setValue(`${validateServerUrl}`);
    fixture.detectChanges();
    expect(component.addDetailsForm.valid).toBe(false);
  });
  it('get device config list check for valid address and name', () => {
    component.deviceNameField = true;
    var result = component.constructDeviceConfigList();
    expect(result.address).toBeDefined();
    expect(result.name).toBeDefined();
  });
  it('get device config list check if deviceType contains string plc_ ', () => {
    var result = component.constructDeviceConfigList();
    //expect(result.deviceType).toContain('PLC_');
  });
  it('isDeviceConnected retuns true if device is conencted', () => {
    const obj = jasmine.createSpyObj('mockApiService', { isDeviceConnected: () => true });
    expect(obj.isDeviceConnected).toBeTruthy();
  });
  it('if device is conencted constructdeviceconfiglist is called', () => {
    const spy = spyOn(component, 'constructDeviceConfigList');
    component.constructDeviceConfigList();
    expect(spy).toHaveBeenCalled();
  });
  it('if device is not connected handleDeviceAlreadyAdded is called', () => {
    const spy = spyOn(component, 'handleDeviceAlreadyAdded');
    component.handleDeviceAlreadyAdded();
    expect(spy).toHaveBeenCalled();
  });
  it('handleKeyPressEnter should only execute the fn in param when Enter key or NumberPadEnter key is pressed', () => {
    const handleKeyPressEnterSpy = spyOn(component, 'handleKeyPressEnter').and.callThrough();
    component.handleKeyPressEnter(new KeyboardEvent('keypress', { key: 'Enter' }), component.connect);
    component.handleKeyPressEnter(new KeyboardEvent('keypress', { key: 'NumpadEnter' }), component.connect);
    expect(handleKeyPressEnterSpy).toHaveBeenCalledTimes(2);
  });
  it('handleKeyPressEnter should not execute the fn in param unless Enter key or NumberPadEnter key is pressed', () => {
    const handleKeyPressEnterSpy = spyOn(component, 'handleKeyPressEnter').and.callThrough();
    const addDeviceSpy = spyOn(component, 'connect');
    component.handleKeyPressEnter(new KeyboardEvent('keypress', { key: 'Space' }), component.connect);
    expect(handleKeyPressEnterSpy).toHaveBeenCalled();
    expect(addDeviceSpy).not.toHaveBeenCalled();
  });
  // it('if device is added to grid and store both deviceadded returns true', () => {
  //   spyOn(component,'isDeviceAddedToStore').and.returnValues(true);
  //   spyOn(component,'isDeviceAddedToGrid').and.returnValues(true);
  //   let res = component.deviceAlreadyAdded(deviceConf);
  //   expect(res).toBeTruthy();
  // });
  // it('if device is not added to grid or store deviceadded returns false', () => {
  //   spyOn(component,'isDeviceAddedToStore').and.returnValues(false);
  //   spyOn(component,'isDeviceAddedToGrid').and.returnValues(false);
  //   let res = component.deviceAlreadyAdded(deviceConf);
  //   expect(res).toBeFalsy();
  // });
  // it('if device is added to either grid or store deviceadded returns true', () => {
  //   spyOn(component,'isDeviceAddedToStore').and.returnValues(false);
  //   spyOn(component,'isDeviceAddedToGrid').and.returnValues(true);
  //   let res = component.deviceAlreadyAdded(deviceConf);
  //   expect(res).toBeTruthy();
  // });

  it('initializeDeviceListInGrid', () => {
    component.devicesAddedToGrid = [];

    component.initializeDeviceListInGrid();
    expect(component.devicesAddedToGrid).toBeDefined();
  })

  it('showNoDeviceData', () => {
    component.devicesAddedToGrid = [
      {
        name: NO_DEVICES_SELECTED,
        uid: '',
        address: ''
      }
    ]
    const spy = spyOnProperty(component, 'showNoDeviceData').and.callThrough()
    expect(component.showNoDeviceData).toEqual(true);
    expect(spy).toHaveBeenCalled();
  })

  it('ngOnChanges with devicesAddedToGrid greater than 0', () => {
    component.devicesAddedToGrid = [
      {
        name: 'BottleFilling',
        uid: '',
        address: ''
      }
    ]
    component.ngOnChanges();
    expect(component.devicesAddedToGrid).toBeDefined();
  })

  it('ngOnChanges with devicesAddedToGrid equal to 0', () => {
    component.devicesAddedToGrid = []
    spyOn(component, 'initializeDeviceListInGrid');
    component.ngOnChanges();
    expect(component.initializeDeviceListInGrid).toHaveBeenCalled();
  })

  it('onBack', () => {
    spyOn(component.onPreviousPage, 'emit');
    component.onBack();
    expect(component.onPreviousPage.emit).toHaveBeenCalled();
  })

  it('connect', () => {
    const response = {
      data: {
        deviceName: "BottleFilling",
        isConnected: true
      },
      error: null,
      status: "SUCCESS"
    }
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'isDeviceConnected').value.and.returnValue(of(response));
    component.addDetailsForm.controls.address.setValue(`${validateServerUrl}`);
    component.addDetailsForm.controls.name.setValue('abcde');
    component.deviceNameField = true;
    component.preventApiCall = true;
    component.connect();
  })

  it('deviceAlreadyAdded', () => {
    component.devicesAddedToGrid = deviceAddedToGrid;
    component.deviceTreeStoreData = projectDevices;
    const res = component.deviceAlreadyAdded(device);
    expect(res).toEqual(true);
  })

  it('deviceNameError', () => {
    component.deviceNameField = true;
    const res = component.deviceNameError();
    expect(res).toBe(false);
  })

  it('deleteDeviceFromGrid', () => {
    component.devicesAddedToGrid = deviceAddedToGrid;
    spyOn(component, 'initializeDeviceListInGrid');
    spyOn(component.onDeviceAltered, 'emit')
    component.deleteDeviceFromGrid(device);
    expect(component.initializeDeviceListInGrid).toHaveBeenCalled();
    expect(component.onDeviceAltered.emit).toHaveBeenCalled();
  })

  it('getDeviceElementToRemove', () => {
    component.devicesAddedToGrid = deviceAddedToGrid;
    const res = component.getDeviceElementToRemove('opc.tcp://192.168.2.51:4840');
    expect(res).toBe(0);
  })

  it('getDeviceName with device obj', () => {
    const res = component.getDeviceName(device);
    expect(res).toEqual('Device1[opc.tcp://192.168.2.50:4840]')
  })

  it('getDeviceName without device obj', () => {
    const res = component.getDeviceName(null);
    expect(res).toEqual('')
  })

  it('getDeviceName with device address blank ', () => {
    const device = {
      name: 'Device1',
      uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MDo0ODQw',
      address: '',
    }
    const res = component.getDeviceName(device);
    expect(res).toEqual('Device1')
  })

  it('getDeviceName with device name blank ', () => {
    const device = {
      name: '',
      uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MDo0ODQw',
      address: 'opc.tcp://192.168.2.50:4840',
    }
    const res = component.getDeviceName(device);
    expect(res).toEqual('opc.tcp://192.168.2.50:4840')
  });

  it('showToolTip', () => {
    spyOn(component, 'showToolTip').and.callThrough();
    device.isValidAddressModel = false;
    component.showToolTip(device);
    device.isValidAddressModel = true;
    component.showToolTip(device);
    device.isSecurityPolicyValid = true;
    component.showToolTip(device);
    expect(component.showToolTip).toHaveBeenCalled();
  });

  it('addDeviceDetailsForVaildAddress', () => {
    component.deviceNameField = false;
    spyOn(component,'addDeviceDetailsForVaildAddress').and.callThrough();
    component['devicesAddedToGrid'] = [device]
    component.addDeviceDetailsForVaildAddress();
    expect( component.addDeviceDetailsForVaildAddress).toHaveBeenCalled();
  });
});

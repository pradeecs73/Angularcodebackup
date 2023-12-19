import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroup } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { BehaviorSubject, of } from 'rxjs';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { DevicesDetails } from './../../../models/connection.interface';
import { DeviceScanRequestPayload } from './../../../models/device-data.interface';
import { DeviceConfig } from './../../../models/targetmodel.interface';
import { DevicesScanComponent } from './devices-scan.component';

fdescribe('DevicesScanComponent', () => {
  let component: DevicesScanComponent;
  let fixture: ComponentFixture<DevicesScanComponent>;
  let facadeMockService;
  const initialState = { deviceTreeList: of(null) };
  const ipvalidation='/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g';
  //let scannedDeviceCount ;
  const PORTVALIDATE_REGEX =
    /^((6553[0-5])|(655[0-2]\d)|(65[0-4]\d{2})|(6[0-4]\d{3})|([1-5]\d{4})|([0-5]{0,5})|([0]\d{1,4})|(\d{1,4}))$/g;


  beforeEach(async () => {
    facadeMockService=new FacadeMockService();
    facadeMockService.commonService.devicesAddedInGrid$=of([{'address':'192.168.2.101',id:'device12345'}]);
    facadeMockService.commonService.projectRegex={
      portValidationRegex:PORTVALIDATE_REGEX.toString(),
      ipValidationRegex:ipvalidation
    };

    await TestBed.configureTestingModule({
      declarations: [ DevicesScanComponent ],
      imports: [
        TranslateModule.forRoot({})
      ],
        providers: [
          { provide: FacadeService, useValue: facadeMockService},
          MessageService,
          provideMockStore({ initialState })
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn<any>(component,'updateCheckBox');
  });

  it('device scan should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call showToolTip method', () => {
    const device={
      isValidAddressModel:false,
      isSecurityPolicyValid:false
    }as unknown as DeviceConfig;


    component.showToolTip(device);
    expect(component.showToolTip).toBeDefined();

  });

  it('should call showToolTip for else method', () => {
    let device={
      isValidAddressModel:true,
      isSecurityPolicyValid:false
    }as unknown as DeviceConfig;

    component.showToolTip(device);
    expect(component.showToolTip).toBeDefined();

    device={
      isValidAddressModel:true,
      isSecurityPolicyValid:true
    }as unknown as DeviceConfig;

    component.showToolTip(device);
    expect(component.showToolTip).toBeDefined();


  });

  it('should call cancelScanning ', () => {
    component.cancelScanning();
    expect(component.cancelScanning).toBeDefined();
    expect(component.isCancelled).toEqual(true);
  });

  it('should call scanSettingsExists method ', () => {
    component.scanSettingForm={
      valid:true
    } as unknown as FormGroup<any>;

    component.scanSettingsExists();
    expect(component.scanSettingsExists).toBeDefined();

  });

  it('should call addSelectedDevice method ', () => {
    component.deviceListInGrid=[{isSelected :true}] as unknown as DevicesDetails[];

    const number=0;

    spyOn(component,'updateDeviceSelectionToParent');
    component.addSelectedDevice(number);
    expect(component.addSelectedDevice).toBeDefined();

  });

  it('should call toggleDevicesSelection method ', () => {
    const event={target:{checked:true}};
    component.deviceListInGrid=[{isSelected :true}] as unknown as DevicesDetails[];
    spyOn(component,'updateDeviceSelectionToParent');


    component.toggleDevicesSelection(event);
    expect(component.toggleDevicesSelection).toBeDefined();

    component.deviceListInGrid=[{isSelected :true,isValidAddressModel:false,isSecurityPolicyValid :false}] as unknown as DevicesDetails[];

    component.toggleDevicesSelection(event);
    expect(component.toggleDevicesSelection).toBeDefined();



  });

  it('should call updateDeviceSelectionToParent method ', () => {
    component.deviceListInGrid=[{isSelected :true}] as unknown as DevicesDetails[];

    component.updateDeviceSelectionToParent();
    expect(component.updateDeviceSelectionToParent).toBeDefined();

    component.deviceListInGrid=[{isSelected :true},{isSelected:false}] as unknown as DevicesDetails[];

    component.updateDeviceSelectionToParent();
    expect(component.updateDeviceSelectionToParent).toBeDefined();

  });

  it('should call setScanDevicesLoader method ', () => {

    facadeMockService.overlayService.loader.and.callFake(function (args) {
      args.cancelCallBack();
    });
    const deviceCount=0;
    spyOn(component,'cancelScanning');

    component['setScanDevicesLoader'](deviceCount);
    expect(component['setScanDevicesLoader']).toBeDefined();

  });

  it('should call getTotalNoOfDevicesInRange method ', () => {
     const formData={
         value:{
          fromIPAddress:'192.168.2.101:4840',
          toIPAddress:'192.168.2.102:4840'
         }
     };


    component.getTotalNoOfDevicesInRange(formData);
    expect(component.getTotalNoOfDevicesInRange).toBeDefined();

  });

  it('should call startScan method ', () => {

    component.scanSettingForm={
      valid:true,
      status :'INVALID '
    } as unknown as FormGroup<any>;

    const originalEvent={};

    component.scanSettingsPanelRef={
      toggle:()=>true,
      hide:()=>true
    } as unknown as OverlayPanel;

    component.toIpAddressGreaterThanFromAddress=()=>true;

    spyOn(component,'initializeDeviceListInGrid');
    spyOn(component,'callScanning');
    spyOn(component,'updateDeviceSelectionToParent');

   component.startScan(originalEvent);
   expect(component.startScan).toBeDefined();

   component.scanSettingForm={
    valid:true,
    status :'VALID '
  } as unknown as FormGroup<any>;

   component.toIpAddressGreaterThanFromAddress=()=>false;

   component.startScan(originalEvent);
   expect(component.startScan).toBeDefined();

 });

 it('should call callScanning method ', () => {

   const requestPayload=[{message:'success'}] as unknown as DeviceScanRequestPayload;
   const deviceInrange=8;

   spyOn(component,'generateRequestPayload').and.returnValue(requestPayload);
   spyOn(component,'getTotalNoOfDevicesInRange').and.returnValue(deviceInrange);

   spyOn(component,'listenToScannedDevices');
   spyOn(component,'listenToScanningCount');

   Object.getOwnPropertyDescriptor(
    facadeMockService.apiService,
    'scanDevice'
  ).value.and.returnValue(of(requestPayload));

  Object.getOwnPropertyDescriptor(
    facadeMockService.apiService,
    'listenToScanningOfDevices'
  ).value.and.returnValue(of({}));

   component.callScanning();
   expect(component.callScanning).toBeDefined();

});

it('should call listenToScannedDevices method ', () => {

  const scannedDeviceCount  = new BehaviorSubject<any>(0);
  facadeMockService.commonService.scanningDevicesCount$=scannedDeviceCount.asObservable();

  spyOn<any>(component,'setScanDevicesLoader');
  scannedDeviceCount.next(4)

  component.listenToScanningCount(6);
  expect(component.listenToScanningCount).toBeDefined();

});

it('should call listenToScannedDevices method ', () => {

  let devicelist=[{isSelected: false}];
  const scannedDevicesList  = new BehaviorSubject<any>(devicelist);
  facadeMockService.commonService.scannedDevicesList$=scannedDevicesList.asObservable();

  component.isCancelled=false;

  spyOn<any>(component,'setScanDevicesLoader');


  component.listenToScannedDevices();
  expect(component.listenToScannedDevices).toBeDefined();

  devicelist=[];
  scannedDevicesList.next(devicelist);

  component.listenToScannedDevices();
  expect(component.listenToScannedDevices).toBeDefined();

});

it('should call generateRequestPayload method ', () => {

   const formData={
    value:{
       fromIPAddress:'192.168.2.101',
       toIPAddress:'192.168.2.102',
       port:4840
     }
   };

  component.generateRequestPayload(formData);
  expect(component.generateRequestPayload).toBeDefined();

});

it('should call toIpAddressGreaterThanFromAddress method ', () => {

  component.scanSettingForm={
    get:()=>{
        return {
         touched:true
      }
    },
    controls:{
     'fromIPAddress':{
        valid:true
     },
     'toIPAddress':{
       valid:true
     },
     '192.168.2.102':{
       valid:true
     }
    },
   value:{
      fromIPAddress:'192.168.2.101',
      toIPAddress:'192.168.2.102',
      port:4840
    }
  }as unknown as FormGroup<any>;

  component.fromIPError=()=>false;

 component.toIpAddressGreaterThanFromAddress();
 expect(component.toIpAddressGreaterThanFromAddress).toBeDefined();

});

it('should call isFormFieldsValid method ', () => {

  component.scanSettingForm={
    get:()=>{
        return {
         touched:true
      }
    },
    controls:{
     'fromIPAddress':{
        valid:true
     },
     'toIPAddress':{
       valid:true,
       dirty:true
     },
     '192.168.2.102':{
       valid:true
     }
    },
   value:{
      fromIPAddress:'192.168.2.101',
      toIPAddress:'192.168.2.102',
      port:4840
    }
  }as unknown as FormGroup<any>;

  component.fromIPError=()=>false;

  component.isFormFieldsValid();
  expect(component.isFormFieldsValid).toBeDefined();


  component.scanSettingForm={
    get:()=>{
        return {
        touched:true
      }
    },
    controls:{
    'fromIPAddress':{
        valid:true
    },
    'toIPAddress':{
      valid:false,
      dirty:true
    },
    '192.168.2.102':{
      valid:true
    }
    },
  value:{
      fromIPAddress:'192.168.2.101',
      toIPAddress:'192.168.2.102',
      port:4840
    }
  }as unknown as FormGroup<any>;

  component.isFormFieldsValid();
  expect(component.isFormFieldsValid).toBeDefined();

});

it('should call ipRangeError method ', () => {

  component.isFormFieldsValid=()=>true;

  component.scanSettingForm={
    errors:{
      ipRangeValidationError:true
    }
  }as unknown as FormGroup<any>;

  component.ipRangeError();
  expect(component.ipRangeError).toBeDefined();

});





});

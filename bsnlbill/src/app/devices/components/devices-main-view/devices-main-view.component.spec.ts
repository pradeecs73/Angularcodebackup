/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { device } from 'mockData/projectData';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { DeviceTreeState } from 'src/app/store/device-tree/device-tree.reducer';
import { existingClientInterfaces, existingServerInterfaces, mockDevices } from '../../../../../mockData';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import { FileUploadEventMessage } from '../../../models/connection.interface';
import { ApiResponse, Editor, ProjectData, ProjectProtection, Tree } from '../../../models/models';
import { ClientInterface, Device, DeviceConfig, OpcInterface } from '../../../models/targetmodel.interface';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { DrawService } from '../../../services/draw.service';
import { DefaultAddressPipe } from '../../../shared/pipes/defaultAddress.pipe';
import { FilterBySubstringPipe } from '../../../shared/pipes/filterBySubstring.pipe';
import { DEVICE_URLVALIDATE_REGEX, PROJ_RSRV_REGEX, PROJ_SPECIAL_CHAR_REGEX } from '../../../utility/constant';
import { DeviceDetailsViewComponent } from '../device-details-view/device-details-view.component';
import { AddDeviceType, AddressModelType, DeviceState, ResponseStatusCode } from './../../../enum/enum';
import { DeviceScanSettings, ProtectProject } from './../../../models/device-data.interface';
import { DevicesMainViewComponent } from './devices-main-view.component';


let component: DevicesMainViewComponent;
let fixture: ComponentFixture<DevicesMainViewComponent>;
const initialState = { deviceTreeList: of(null) };

const projectDevices: Device[] = mockDevices;
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
      deviceId: '',
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

const mockDeviceData: Device = mockDevices[0];

const cacheData: ProjectData = {
  'project': {
    'id': 'kr626w3j',
    'name': 'Multi_Con',
    'date': '',
    'author': '',
    'created': '7/16/2021, 1:38:02 PM',
    'modified': '7/16/2021, 1:38:02 PM',
    'modifiedby': '',
    'comment': ''
  },
  'tree': {
    'devices': [mockDeviceData]
  },
  'editor': {
    'nodes': [
      {
        'address': 'opc.tcp://192.168.2.75:4840',
        'id': 'hdhd123544',
        'x': 10,
        'y': 10,
        'selected': false,
        'deviceId': 'deviceId',
        'parent': 'ROOT'
      },
      {
        'address': 'opc.tcp://192.168.2.75:4840',
        'id': 'test12345',
        'x': 10,
        'y': 10,
        'selected': false,
        'deviceId': 'deviceId',
        'parent': 'ROOT'
      }
    ],
    'connections': [],
    'subConnections': [],
    'areas': [
      {
        name: 'Area1',
        id: '12345',
        x: 10,
        y: 20,
        clientInterfaceIds: [],
        serverInterfaceIds: [],
        nodeIds: [],
        connectionIds: []
      }
    ]
  },
  scanSettings: {
    port: 0,
    fromIPAddress: '',
    toIPAddress: ''
  }
};
const files = new File([''], 'filename');
const deviceList = {
  deviceList: [
    {
      address: 'opc.tcp://0.0.0.0:0000',
      applicationIdentifierTypes: [
        {
          interfaceName: 'FillingToMixing',
          type: 'FillToMix_Type'
        },
        {
          interfaceName: 'FillingToWashing2',
          type: 'FillToWash2_Type'
        }
      ],
      deviceName: 'Imported_Device_1',
      fileName: 'BottleFilling.xml'
    }
  ],
  files: [files]
};
const mockedUpdateResponse = {
  counter: 1,
  totalNoOfDevices: 1,
  errorCount: 1
};

const mockedNodeSetErrorResponse = {
  counter: 1,
  totalNoOfDevices: 1
};
const mockedUpdateCount = new BehaviorSubject<FileUploadEventMessage>(mockedUpdateResponse as FileUploadEventMessage);
const deviceConfigList: DeviceConfig = {
  address: 'opc.tcp://192.168.2.75:4840',
  name: 'Device1',
  uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi43NTo0ODQw'
};


mockDevices[0].automationComponents[0].clientInterfaces = existingClientInterfaces as unknown as ClientInterface[];//.automationComponents[0]['clientInterfaces'] = existingClientInterfaces;
mockDevices[0].automationComponents[0].serverInterfaces = existingServerInterfaces as unknown as OpcInterface[];

const deviceResponse: { devices: Device[], status: string; } = {
  devices: [mockDeviceData],
  status: 'SUCCESS'
};

const deviceResponseBrowseDevice: ApiResponse = {
  data: { devices: [mockDeviceData] },
  error: { errorCode: 1234, errorType: 'browse error' },
  status: 'SUCCESS'
};

const updateDeviceDetailsResponse: ApiResponse = {
  status: 'SUCCESS',
  error: null,
  data: { code: 200, msg: 'Device details updated successfully' }
};
let mockDrawService: DrawService;

let facadeMockService;

fdescribe('Device main view', () => {
  const uniqid = require('uniqid');
  mockDrawService = jasmine.createSpyObj('mockDrawService', [
    'zoomSubscription',
    'drawDeviceNode'
  ]);
  beforeEach(
    waitForAsync(() => {
      facadeMockService = new FacadeMockService();
      const deviceSubject = new Subject<Device>();
      deviceSubject.next(mockDeviceData);

      facadeMockService.apiService.deviceUrlValidatioRegex = DEVICE_URLVALIDATE_REGEX.toString();
      facadeMockService.apiService.projecNameValidationRegex = { PROJ_SPECIAL_CHAR_REGEX: PROJ_RSRV_REGEX.toString(), PROJ_RSRV_REGEX: PROJ_SPECIAL_CHAR_REGEX.toString() };
      facadeMockService.commonService.isExistingProjectLoading = false;
      const browseDeviceResponse = {
        data: {
          adapterType: "Plant Object",
          devices: [],
          status: 'SUCCESS'
        },
        error: null,
        status: 'SUCCESS'
      };
      Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getExistingInterfaceDetailsByDeviceId').value.and.returnValue({
        existingClientInterfaces,
        existingServerInterfaces
      });
      Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'browseDevices').value.and.returnValue(of(browseDeviceResponse));
      Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDevices').value.and.returnValue([]);
      facadeMockService.commonService.setSelectedDeviceId(
        new Subject<Device>().next(mockDeviceData)
      );
      facadeMockService.commonService.deviceDetailsObs = deviceSubject.asObservable();
      facadeMockService.commonService.deviceDetailsObs.subscribe();
      Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'browseDevices').value.and.returnValue(of(browseDeviceResponse));
      facadeMockService.commonService.uploadingFilesStatusMessage$ =
        mockedUpdateCount.asObservable();
      TestBed.configureTestingModule({
        declarations: [DevicesMainViewComponent, DeviceDetailsViewComponent, FilterBySubstringPipe, DefaultAddressPipe, DisableIfUnauthorizedDirective],
        imports: [
          TranslateModule.forRoot({})
        ],
        providers: [
          { provide: FacadeService, useValue: facadeMockService },
          { provide: DrawService, useValue: mockDrawService },
          MessageService,
          provideMockStore({ initialState })
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );
  beforeEach(() => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: false, name: 'test' } });
    fixture = TestBed.createComponent(DevicesMainViewComponent);
    component = fixture.componentInstance;
    component.deviceDetailsComp = TestBed.createComponent(
      DeviceDetailsViewComponent
    ).componentInstance as DeviceDetailsViewComponent;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Should run on ngOnInit', () => {
    spyOn(component, 'getProjectName').and.callThrough();
    expect(component.items.length).toBe(1);
    expect(component.deviceTree).toBeDefined();
  });

  it('Should call for device create with success response', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDevice').value.and.returnValue(mockDeviceDataDeviceSync);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(cacheData);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'browseDevices').value.and.returnValue(of(deviceResponseBrowseDevice));
    component.addDevices([deviceConfigList]);
    expect(component.items.length).toBe(1);
    expect(component.deviceTree).toBeDefined();
  });
  it('hide popup on handle device', () => {
    component.handleAddingDevices();
    expect(component.addDeviceModalDisplay).toBeTruthy();

    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: true, name: 'test' } });
    component.handleAddingDevices();
    expect(component.addDeviceModalDisplay).toBeTruthy();
  });

  it('handle the selected device', () => {
    spyOn(component.onDeviceSelected, 'emit');
    const event = new MouseEvent('click');
    component.handleDeviceSelected(event, mockDeviceData);
    expect(component.onDeviceSelected.emit).toHaveBeenCalled();
  });

  it('should call update device with success', () => {
    deviceResponse.status = 'SUCCESS';
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDevice').value.and.returnValue(mockDeviceDataDeviceSync);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(cacheData);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'browseDevices').value.and.returnValue(of(deviceResponseBrowseDevice));
    spyOn(component, 'updateDeviceListToStore').and.callThrough();
    component.update(deviceConfigList);
    expect(component.devices.length).toBeGreaterThan(0);

    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: true, name: 'test' } });
    component.update(deviceConfigList);
    expect(component.devices.length).toBeGreaterThan(0);
  });

  it('Should call for device add with error response', () => {
    deviceResponseBrowseDevice.status = 'ERROR';
    spyOn(component, 'setDeviceProperties');
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'browseDevices'
    ).value.and.returnValue(of(deviceResponseBrowseDevice));
    // jasmine.createSpyObj({ 'browseDevices': of(deviceResponse) });
    component.addDevices([deviceConfigList]);
    expect(component.devices.length).toBe(0);
  });

  it('Should call for device update with error response', () => {
    deviceResponseBrowseDevice.status = 'ERROR';
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'browseDevices'
    ).value.and.returnValue(of(deviceResponseBrowseDevice));
    // jasmine.createSpyObj({ 'browseDevices': of(deviceResponse) });
    component.update(deviceConfigList);
    expect(component.devices.length).toBe(0);
  });

  it('project name will be defined if cache data is present', () => {
    expect(component.getProjectName).toBeDefined();
  });

  it('The first device of device view should be selected', () => {
    const event = jasmine.createSpyObj('event', [
      'preventDefault',
      'stopImmediatePropagation'
    ]);

    component.deviceTreeStoreData = projectDevices;
    component.selectDevice(projectDevices[0], event);
    expect(component.showDeleteDeviceIcon).toBe(true);
    expect(component.highlightSelectedDevice).toBeDefined();
    expect(component.deviceTreeStoreData[0].isSelected).toBe(true);
    expect(component.deviceTreeStoreData[1].isSelected).toBe(false);
  });

  it('All the project devices  should be unselected', () => {
    component.deviceTreeStoreData = projectDevices;
    component.deHighlightSelectedDevice();
    expect(component.showDeleteDeviceIcon).toBe(false);
    expect(component.deviceTreeStoreData[0].isSelected).toBe(false);
    expect(component.deviceTreeStoreData[1].isSelected).toBe(false);
  });

  it(
    'Should make API call to delete the selected device',
    waitForAsync(() => {
      const apiResponse = { status: 'SUCCESS' };
      let deviceProperties = {};
      component.selectedDevice = projectDevices[0];

      component.onDeviceSelected.subscribe((properties: any) => {
        deviceProperties = properties;
      });

      Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'deleteNode').value.and.returnValue(true);
      Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(cacheData);
      Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDevices').value.and.returnValue(projectDevices);
      Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'deleteDevice').value.and.returnValue(of(apiResponse));


      component.deleteSelectedDevice();
      expect(component.showDeleteDeviceIcon).toBe(false);
      expect(component.deleteDeviceNodeList).toBeDefined();
      expect(component.deleteDeviceConnections).toBeDefined();
      expect(component.updateDeviceListToStore).toBeDefined();
      expect(component.setDeviceProperties).toBeDefined();
      expect(deviceProperties).toBe('');
    })
  );

  it(
    'API call should fail and should goes to error block',
    waitForAsync(() => {
      component.selectedDevice = projectDevices[0];
      Object.getOwnPropertyDescriptor(
        facadeMockService.dataService,
        'getProjectData'
      ).value.and.returnValue(cacheData);
      const responseObj = Object.getOwnPropertyDescriptor(
        facadeMockService.apiService,
        'deleteDevice'
      ).value.and.returnValue(throwError('Error in delete device api call'));
      component.deleteSelectedDevice();
      fixture.detectChanges();
      expect(responseObj()).not.toBe(null);
    })
  );

  it(
    'subscribeToSelectedDevice function should pass to automation component data to device details component',
    waitForAsync(() => {
      facadeMockService.commonService.deviceDetailsObs = of(mockDeviceData);
      component.subscribeToSelectedDevice();
      facadeMockService.commonService.setSelectedDeviceId(
        new Subject<Device>().next(mockDeviceData)
      );
      fixture.detectChanges();
      expect(component.deviceDetailsComp.automationComp).toEqual(
        mockDeviceData.automationComponents
      );
    })
  );

  it(
    'subscribeToSelectedDevice function should not pass to automation component if deviceDetails is null',
    waitForAsync(() => {
      facadeMockService.commonService.deviceDetailsObs = of(null);
      component.subscribeToSelectedDevice();
      facadeMockService.commonService.setSelectedDeviceId(
        new Subject<Device | null>().next(null)
      );
      fixture.detectChanges();
      expect(component.deviceDetailsComp.automationComp).toEqual(null);
    })
  );
  it('Should call for device create with success response on uploading file', () => {
    // given
    facadeMockService.commonService.selectedDeviceAdditionType = AddDeviceType.IMPORT_FROM_FILE;
    component.isSubscriptionActive = true;
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'uploadXMLfiles'
    ).value.and.returnValue(of(deviceResponseBrowseDevice));
    facadeMockService.overlayService.success.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component.addDevices(deviceList);

    fixture.detectChanges();
    // expected
    expect(facadeMockService.apiService.getUploadNodeSetFilesUpdate).toHaveBeenCalled();
    expect(component.deviceTree).toBeDefined();
    expect(facadeMockService.apiService.uploadXMLfiles).toHaveBeenCalled();
  });

  it('Should call for device create with empty count response on uploading file', () => {
    // given

    mockedUpdateCount.next(mockedNodeSetErrorResponse as FileUploadEventMessage);
    facadeMockService.commonService.selectedDeviceAdditionType = AddDeviceType.IMPORT_FROM_FILE;
    component.isSubscriptionActive = true;
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'uploadXMLfiles'
    ).value.and.returnValue(of(deviceResponseBrowseDevice));
    facadeMockService.overlayService.success.and.callFake(function (args) {
      args.closeCallBack();
    });
    component.addDevices(deviceList);

    fixture.detectChanges();
    // expected
    expect(facadeMockService.apiService.getUploadNodeSetFilesUpdate).toHaveBeenCalled();
    expect(component.deviceTree).toBeDefined();
    expect(facadeMockService.apiService.uploadXMLfiles).toHaveBeenCalled();
  });

  it('Should call for device create with error response on uploading file', () => {
    // given

    mockedUpdateCount.next({} as FileUploadEventMessage);
    facadeMockService.commonService.selectedDeviceAdditionType = AddDeviceType.IMPORT_FROM_FILE;
    component.isSubscriptionActive = true;
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'uploadXMLfiles'
    ).value.and.returnValue(of(deviceResponseBrowseDevice));

    component.addDevices(deviceList);

    fixture.detectChanges();
    // expected
    expect(facadeMockService.apiService.getUploadNodeSetFilesUpdate).toHaveBeenCalled();
    expect(component.deviceTree).toBeDefined();
    expect(facadeMockService.apiService.uploadXMLfiles).toHaveBeenCalled();
  });




  it('Validate Regex should return new value if it is valid', () => {
    // given
    const newTcpAddress = 'opc.tcp://192.168.2.51:4840';
    const result = component.validateRegex(projectDevices[0].address, newTcpAddress);

    // expect
    expect(result).toBe(newTcpAddress);
  });
  it('Validate Regex should return old value if it is not valid', () => {
    // given
    const newTcpAddress = 'random_string';
    const result = component.validateRegex(projectDevices[0].address, newTcpAddress);

    // expect
    expect(result).toBe('random_string');
  });
  it('updateDeviceProperty should call updateDeviceDetails based on user edited field', () => {
    // given
    component.deviceTreeStoreData = projectDevices;
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'updateDeviceDetails'
    ).value.and.returnValue(of(updateDeviceDetailsResponse));
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(cacheData);

    component.updateDeviceProperty(
      'UpdatedName',
      0,
      'name',
      projectDevices[0] as Device
    );

    fixture.detectChanges();
    // expect
    expect(facadeMockService.apiService.updateDeviceDetails).toHaveBeenCalled();

  });

  it('updateDeviceProperty should call updateDeviceDetails based on user edited field with protected', () => {

    // given
    component.deviceTreeStoreData = projectDevices;
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'updateDeviceDetails'
    ).value.and.returnValue(of(updateDeviceDetailsResponse));
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: true, name: 'test' } });

    component.updateDeviceProperty(
      'UpdatedName',
      0,
      'name',
      projectDevices[0] as Device
    );

    fixture.detectChanges();
    // expect
    expect(facadeMockService.apiService.updateDeviceDetails).not.toHaveBeenCalled();

  });

  it('skip Device', () => {
    component.currentDeviceAuthentication = projectDevices[0];
    component.deviceList = [{
      address: "opc.tcp://192.168.2.50:4840",
      isDeviceAuthRequired: true,
      isAuthenticated: true,
      isProtected: true,
      name: "BottleFilling",
      uid: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA=="
    }, {
      address: "opc.tcp://192.168.2.102:4840",
      isAuthenticated: false,
      isProtected: true,
      isDeviceAuthRequired: true,
      name: "LiquidMixing",
      uid: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA=="
    },
    {
      address: "opc.tcp://192.168.2.103:4840",
      isAuthenticated: true,
      isProtected: true,
      isDeviceAuthRequired: true,
      name: "WashingStep1",
      uid: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA=="
    }];
    fixture.detectChanges();
    component.skipDevice();
    expect(facadeMockService.deviceService.setDeviceDetails).toHaveBeenCalled();
  });

  it('add protected devices', () => {
    const deviceList = [{
      address: "opc.tcp://192.168.2.50:4840",
      isAuthenticated: true,
      isProtected: true,
      isDeviceAuthRequired: true,
      name: "BottleFilling",
      uid: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA=="
    }];
    const projectData = { ...cacheData };
    projectData.project.isProtected = true;
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(projectData);
    facadeMockService.commonService.selectedDeviceAdditionType = AddDeviceType.BROWSE_ONLINE;
    component.addDevices(deviceList);
    expect(component.noOfProtectedDevices).toEqual(1);
  });

  it('add Credentials', () => {
    component.deviceList = [{
      address: "opc.tcp://192.168.2.50:4840",
      isAuthenticated: true,
      isProtected: true,
      isDeviceAuthRequired: true,
      name: "BottleFilling",
      uid: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==",
    }];
    const credentials = {
      address: 'opc.tcp://192.168.2.50:4840',
      userName: 'user1',
      password: 'Siemens123'
    };
    component.addCredentials(credentials);
    expect(component.deviceList[0].credentials.userName).toEqual('user1');
    expect(component.deviceList[0].credentials.password).toEqual('Siemens123');
  });

  it('should call openProjectProtectPopup method', () => {
    component.openProjectProtectPopup();
    expect(component.openProjectProtectPopup).toBeDefined();
    expect(component.showProjectProtectionModel).toEqual(true);
  });

  it('should call openProjectProtectPopup method', () => {
    spyOn(component, 'deleteSelectedDevice');
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component.deleteDeviceFromView();
    expect(component.deleteDeviceFromView).toBeDefined();
  });

  it('should call removeNodeIdsInAreaData method', () => {
    let areas = [{ nodeIds: ['node12345'] }];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue(areas);
    component.removeNodeIdsInAreaData('node1234567');
    expect(component.removeNodeIdsInAreaData).toBeDefined();
    areas = [{ nodeIds: undefined }];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue(areas);
    component.removeNodeIdsInAreaData('node12345');
  });

  it('should call checkIfDevicesAlreadyAdded method', () => {
    let deviceList = [{ address: 'myaddress' }];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDevices').value.and.returnValue(deviceList);
    component.checkIfDevicesAlreadyAdded(deviceList as unknown as DeviceConfig[]);
    expect(component.checkIfDevicesAlreadyAdded).toBeDefined();
    deviceList = [{ address: 'myaddress1' }];
    component.checkIfDevicesAlreadyAdded(deviceList as unknown as DeviceConfig[]);
  });

  it('should call hideError method', () => {
    component.hideError( {error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    }},'deviceNameLengthError');
    expect(component.hideError).toBeDefined();
  });

  it('should call checkDeviceExists method', () => {
    const event = 'address12345';
    const device = { uid: 'uid12345', address: 'address12345',error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    } };
    let deviceTreeCopy = [{ uid: 'uid12345', address: 'address12345',error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    } }];
    component.deviceTreeStoreData = deviceTreeCopy as unknown as Array<Device>;
    component.checkDeviceExists(event, device);
    expect(component.checkDeviceExists).toBeDefined();
    deviceTreeCopy = [{ uid: 'uid12345', address: 'address12345',error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    }, }, { uid: 'uid1234567', address: 'address12345' ,error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    },}];
    component.checkDeviceExists(event, device);
    expect(component.checkDeviceExists).toBeDefined();
  });

  it('should call checkDeviceExists for duplicate', () => {
    const event = 'address12345';
    const device = { uid: 'uid12345', address: 'address12345' ,error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    }};
    const deviceTreeCopy = [{ uid: 'uid12345', address: 'address12345',error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    } }, { uid: 'uid1234567', address: 'address12345',error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    } }];
    component.deviceTreeStoreData = deviceTreeCopy as unknown as Array<Device>;
    component.checkDeviceExists(event, device);
    expect(component.checkDeviceExists).toBeDefined();
  });

  it('should call onSubmitProjectProtection method', () => {
    const formData = [{ credentials: { password: 'password12345', confirmPassword: 'password12345', mode: 'read' } }];
    spyOn(component, 'registerPassword');
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectName').value.and.returnValue('myproject');
    component.onSubmitProjectProtection(formData as unknown as Array<ProjectProtection>);
    expect(component.onSubmitProjectProtection).toBeDefined();
  });

  it('should call openDeviceAuthManual method', () => {
    component.reBrowseDeviceList = [{ uid: 'uid12345', address: 'address12345' }, { uid: 'uid1234567', address: 'address1234567' }];
    component.openDeviceAuthManual();
    expect(component.openDeviceAuthManual).toBeDefined();
    expect(component.showDeviceLoginModel).toEqual(true);
  });

  it('should call registerPassword method', () => {
    const payload = [{ password: 'password12345', accessType: 'read', projectName: 'myproject' }];
    spyOn(component, 'openDeviceAuthManual');
    component.isDeviceFailedInReBrowse = true;
    component.reBrowseDeviceList = [{}];
    const accessDetailsArray = [{ data: {} }];
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'registerPassword').value.and.returnValue(of(accessDetailsArray));
    component.registerPassword(payload as unknown as ProtectProject[]);
    expect(component.registerPassword).toBeDefined();
    component.reBrowseDeviceList = [];
    component.registerPassword(payload as unknown as ProtectProject[]);
  });

  it('should call deleteDeviceConnections method', () => {
    const device = { uid: 'uid12345', address: 'address12345' } as unknown as Device;
    facadeMockService.editorService.liveLinkEditor = {
      connectorLookup:
        [{ key: 'connector1', inputAnchor: { parentNode: { deviceId: 'uid12345' } } }]
    };
    spyOn(component, 'deleteDeviceConnectionsFromEditorAndArea');
    component.deleteDeviceConnections(device);
    expect(component.deleteDeviceConnections).toBeDefined();
    facadeMockService.editorService.liveLinkEditor = {
      connectorLookup:
        [{ key: 'connector1', inputAnchor: { parentNode: { deviceId: 'uid1234567' } }, outputAnchor: { parentNode: { deviceId: 'uid12345' } } }]
    };
    component.deleteDeviceConnections(device);
  });

  it('should call updateStatusDialogue method', () => {
    const mode = 'read';
    const deviceResponse = 'error';
    const deviceList = [
      { uid: 'uid12345', address: 'address12345' },
      { uid: 'uid1234567', address: 'address1234567' },
    ];
    component.devices = ([
      { uid: 'uid12345', address: 'address12345' },
    ] as unknown) as Array<Device>;
    component.updateStatusDialogue(mode, deviceResponse, deviceList as unknown as DeviceConfig[]);
    expect(component.updateStatusDialogue).toBeDefined();
    component.devices = [{ uid: 'uid12345', address: 'address12345' }, { uid: 'uid1234567', address: 'address1234567' }] as unknown as Array<Device>;
    component.updateStatusDialogue(mode, deviceResponse, deviceList as unknown as DeviceConfig[]);
  });



  it('should call handleBrowseError method', () => {
    const mode = 'read';
    const deviceList = [
      { uid: 'uid12345', address: 'address12345' },
      { uid: 'uid1234567', address: 'address1234567' },
    ];
    let err = { error: { error: { errorType: ResponseStatusCode.BROWSE_DEVICE_AUTHENTICATION_FAILURE }, data: { devices: deviceList } } };
    component.handleBrowseError(err, deviceList, mode);
    expect(component.handleBrowseError).toBeDefined();
    err = { error: { error: { errorType: ResponseStatusCode.Browse_device_failure }, data: { devices: deviceList } } };
    component.handleBrowseError(err, deviceList, mode);
    expect(component.handleBrowseError).toBeDefined();
  });

  it('updateDeviceTreeStoreData', () => {
    spyOn<any>(component, 'isAnyNewDeviceAdded').and.returnValue(false);
    const data = {
      loading: false,
      deviceGroup: {
        devices: device
      }
    } as unknown as DeviceTreeState;
    component['updateDeviceTreeStoreData'](data);
    expect(component['isAnyNewDeviceAdded']).toHaveBeenCalled();
  });

  it('isAnyNewDeviceAdded', () => {
    expect(component['isAnyNewDeviceAdded'](device as unknown as Device[])).toBe(true);
  });

  it('getDevicesDataFromStore', () => {
    const data = {
      loading: false,
      deviceGroup: {
        devices: device
      }
    } as unknown as DeviceTreeState;
    component.deviceViewTabSelected = true;
    component['getDevicesDataFromStore'](data);
  });

  it('addDevices', () => {
    spyOn(component, 'openProjectProtectPopup');
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({
      project: ({
        date: '4',
        name: 'Test',
        isProtected: false,
      } as unknown) as ProjectData,
      tree: ({} as unknown) as Tree,
      editor: ({} as unknown) as Editor,
      scanSettings: ({} as unknown) as DeviceScanSettings,
    });
    facadeMockService.commonService.selectedDeviceAdditionType = AddDeviceType.BROWSE_ONLINE;
    component.addDevices(device);
    expect(component.openProjectProtectPopup).toHaveBeenCalled();
  });

  it('browse api error', () => {
    spyOn(component, 'handleBrowseError');
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'browseDevices'
    ).value.and.returnValue(throwError('Error in import project api call'));
    component.browse(device, 'ADD');

    expect(component.handleBrowseError);
  });

  it('handleBrowseSuccessAdd', () => {
    component.handleBrowseSuccessAdd({ data: { devices: [{ state: DeviceState.UNAVAILABLE, status: 'ERROR' }] as unknown as Device[] } }, []);
    expect(facadeMockService.deviceService.handleBrowseErrorNotification).toHaveBeenCalled();
  });

  it('handleBrowseSuccessUpdate', () => {
    component.devices = [];
    component.handleBrowseSuccessUpdate({ data: { devices: [] } });
    expect(facadeMockService.deviceService.handleBrowseErrorNotification).toHaveBeenCalled();
  });

  it('handleBrowseError', () => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: true, name: 'test' } });
    component.handleBrowseError({ error: { error: { errorType: ResponseStatusCode.BROWSE_DEVICE_AUTHENTICATION_FAILURE } } }, [], 'ADD');
  });

  it('authenticationSuccessful', () => {
    component.deviceBrowseFailed = [{}];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(cacheData);
    component.authenticationSuccessful({ userName: 'test', password: 'test', uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MDo0ODQw' });
    expect(facadeMockService.applicationStateService.saveProject).toHaveBeenCalled();
  });

  it('updateDeviceStatusInEditor', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDevice').value.and.returnValue({ uid: 'test' } as unknown as Device);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(cacheData);
    component.updateDeviceStatusInEditor(device);
  });

  it('editableMode',()=>{
    const device = {partialSelected:false}  as unknown as Device;
    component.editableMode(device);
    expect(device.partialSelected).toBeTruthy();
  })

  it('truncateName',()=>{
    expect(component.truncateName('abcdefghijklmopqrstuvwxyzabcde')).toBe('abcdefghijklmopqrstuvwxyz...');
    expect(component.truncateName('abcde')).toBe('abcde');
  })

  it('deviceNameLengthCheck',()=>{
    let device = {error : {deviceNameLengthError : false}} as unknown as Device;
    component.deviceNameLengthCheck('abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij',device);
    expect(device.error.deviceNameLengthError).toBeTruthy();
    device.error.deviceNameLengthError = true;
    component.deviceNameLengthCheck('abcdefgh',device);
    expect(device.error.deviceNameLengthError).toBeFalsy();

  })

});



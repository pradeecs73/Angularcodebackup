/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { projectRegexStore } from 'mockData';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { AddDeviceType } from 'src/app/enum/enum';
import { FileUploadList } from 'src/app/models/connection.interface';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { DEVICE_URLVALIDATE_REGEX, emptyUploadFileList, NO_DEVICES_SELECTED } from '../../../utility/constant';
import { DevicesBaseModalDialogComponent } from './devices-base-modal-dialog.component';
let component: DevicesBaseModalDialogComponent;
let fixture: ComponentFixture<DevicesBaseModalDialogComponent>;


let messageService: MessageService;
const initialState = { deviceTreeList: of(null) };
const deviceListArray = [];

for (let index = 1; index < 10; index++) {
  const element = {
    deviceName: `Imported_Device_${index}`,
    file: new File([''], `fileName${index}`),
    isValid: Math.random() < 0.5,
    address: `opc.tcp://0.0.0.0:000${index}`,
    fileName: `file{index}.xml`,
    error: 'No Errors',
    applicationIdentifierTypes: []
  };
  deviceListArray.push(element);
}
const deviceListData = [
  {
    file: new File([''], `fileName1`),
    deviceName: 'Imported_Device_1',
    isValid: true,
    address: 'opc.tcp://0.0.0.0:0000',
    fileName: 'WashingStep1.xml',
    error: 'No Errors',
    name: 'SampleData',
    applicationIdentifierTypes: [
      {
        interfaceName: 'Washing1ToMixing',
        type: 'Wash1ToMix_Type'
      },
      {
        interfaceName: 'Washing2ToWashing1',
        type: 'Wash2ToWash1_Type'
      }
    ]
  }
];
const deviceArray = [
  {
    name: 'BottleFilling',
    uid: '12345',
    address: 'opc.tcp//:192.168.2.101:4840'
  },
  {
    name: 'LiquidMixing',
    uid: '12345',
    address: 'opc.tcp//:192.168.2.102:4840'
  }
]
let facadeMockService;
fdescribe('DevicesBaseModalDialogComponent', () => {
  facadeMockService = new FacadeMockService();
  facadeMockService.apiService.deviceUrlValidatioRegex = DEVICE_URLVALIDATE_REGEX.toString();
  beforeEach(waitForAsync(() => {



    facadeMockService.commonService.projectRegex = projectRegexStore;

    TestBed.configureTestingModule({
      declarations: [DevicesBaseModalDialogComponent],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: FacadeService, useValue: facadeMockService },
        provideMockStore({ initialState })
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesBaseModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  it('if device list is empty disable add', () => {
    if (component.importedDeviceList[0].deviceName === NO_DEVICES_SELECTED) {
      expect(component.addButtonDisabled()).toBeTruthy();
    }
  });
  it('device grid length is fixed upto 8 devices', () => {
    expect(component.maxGridLength).toBe(8);
  });
  it('Initially no device in device list in Grid', () => {
    expect(component.importedDeviceList[0].deviceName).toMatch(emptyUploadFileList);
  });
  it('load device add detail when next is clicked', () => {
    component.loadOnlineBrowsePage('abc');
    expect(component.nextTabView).toMatch('abc');
  });
  it('load device addMethod when back button is clicked', () => {
    component.loadAddSelectionPage('abc');
    expect(component.tabView).toMatch('abc');
  });
  it('Request mapper function should map only the requied fields and remove unwanted fields', () => {
    const mappedRequest = component.requestMapper(deviceListData);
    const expectedResult = [
      {
        address: 'opc.tcp://0.0.0.0:0000',
        applicationIdentifierTypes: [
          {
            interfaceName: 'Washing1ToMixing',
            type: 'Wash1ToMix_Type'
          },
          {
            interfaceName: 'Washing2ToWashing1',
            type: 'Wash2ToWash1_Type'
          }
        ],
        deviceName: 'Imported_Device_1',
        fileName: 'WashingStep1.xml'
      }
    ];
    expect(expectedResult).toEqual(mappedRequest);
  });
  it('customValidationForAddress should return the default input address if it is non valid', () => {
    const event = { target: { value: 'Random string' } };
    const value = { event, i: 0 };
    component.customValidationForAddress(value);
    const defaultAddress = component.importedDeviceList[0].address;
    expect(defaultAddress).toEqual('opc.tcp://0.0.0.0:0000');
  });
  it('customValidationForAddress should return the user input address if it is valid', () => {
    const validAddress = 'opc.tcp://192.168.2.104:4840';
    const event = { target: { value: validAddress } };
    const value = { event, i: 0 };

    component.customValidationForAddress(value);
    const defaultAddress = component.importedDeviceList[0].address;
    expect(defaultAddress).toEqual(validAddress);
  });
  //deviceListArray
  it('addNodeSetFilesToList should update filesToUpload with the valid files', () => {

    const extractFiles = deviceListArray.filter(file => file.isValid);
    component.addNodeSetFilesToList(deviceListArray);
    expect(component.filesToUpload.length).toEqual(extractFiles.length);

  });
  it('deleteFileByDeviceName should delete the particular device from filesToUpload', () => {
    component.addNodeSetFilesToList(deviceListArray);

    component.deleteFileByDeviceName(deviceListArray[1]);
    const expectedCount = deviceListArray.length;
    const isDeletedElementPresent = component.importedDeviceList.some(ele => ele.deviceName === deviceListArray[1].deviceName);
    expect(component.importedDeviceList.length).toEqual(8);
    expect(isDeletedElementPresent).toEqual(false);
  });

  //Todo:-Fix failed UT and functionality
  xit('onFinalDeviceAdd should generate the req body based on tab view ', () => {
    component.addNodeSetFilesToList(deviceListData as FileUploadList[]);
    spyOn(component.onAddingDeviceToMain, 'emit');
    component.onFinalDeviceAdd();
    const expected = {
      deviceList: [
        {
          address: deviceListData[0].address,
          applicationIdentifierTypes: [
            {
              interfaceName: 'Washing1ToMixing',
              type: 'Wash1ToMix_Type'
            },
            {
              interfaceName: 'Washing2ToWashing1',
              type: 'Wash2ToWash1_Type'
            }
          ],
          deviceName: 'Imported_Device_2',
          fileName: deviceListData[0].name
        }
      ],
      files: [new File([''], `fileName1`)]
    };
    expect(component.onAddingDeviceToMain.emit).toHaveBeenCalledWith(expected);
  });

  it('loadOnlineBrowsePage', () => {
    component.loadOnlineBrowsePage('abcde');
    expect(facadeMockService.commonService.updateDeviceAdditionType).toHaveBeenCalled();
    expect(component.nextTabView).toBe('abcde');
  })

  it('loadAddSelectionPage', () => {
    component.loadAddSelectionPage('back');
    expect(component.filesToUpload).toEqual([]);
    expect(component.tabView).toEqual('back');
    expect(component.nextTabView).toEqual(AddDeviceType.BROWSE_ONLINE);
  })

  it('addDeviceToList', () => {

    component.addDeviceToList(deviceArray);
    expect(component.addedDeviceList).toEqual(deviceArray);
    expect(facadeMockService.commonService.updateDevicesListInGrid).toHaveBeenCalled();
  })

  it('cance', () => {
    spyOn(component.hide, 'emit');
    component.cancel();
    expect(component.hide.emit).toHaveBeenCalled();
  })

  it('addButtonDisabled', () => {
    component.tabView = AddDeviceType.BROWSE_ONLINE;
    component.addedDeviceList = [];
    const res = component.addButtonDisabled();
    expect(res).toEqual(true);
  })

  it('addButtonDisabled Import Project', () => {
    component.importedDeviceList = [
      {
        deviceName: NO_DEVICES_SELECTED
      }
    ]
    const res = component.addButtonDisabled();
    expect(res).toEqual(true);
  })

  it('onFinalDeviceAdd with browse online', () => {
    component.tabView = AddDeviceType.BROWSE_ONLINE;
    spyOn(component.onAddingDeviceToMain, 'emit');
    component.onFinalDeviceAdd();
    expect(component.onAddingDeviceToMain.emit).toHaveBeenCalled();

  })

  it('onFinalDeviceAdd with import device', () => {
    component.tabView = AddDeviceType.IMPORT_FROM_FILE;
    spyOn(component.onAddingDeviceToMain, 'emit');
    component.onFinalDeviceAdd();
    expect(component.onAddingDeviceToMain.emit).toHaveBeenCalled();
  })

  it('getDeviceElementToRemove', () => {
    component.addedDeviceList = deviceArray;
    component.importedDeviceList = [{
      deviceName: `BottleFilling [opc.tcp//:192.168.2.101:4840]`
    },
    {
      deviceName: `LiquidMixing [opc.tcp//:192.168.2.102:4840]`
    }]
    const res = component.getDeviceElementToRemove('BottleFilling');
    expect(res).toEqual(-1);
  })

  it('nex', () => {
    component.nextTabView = 'browseOnline';
    component.next();
    expect(component.tabView).toEqual('browseOnline')
  })

  it('onScannedDevicesAdded', () => {
    const event = deviceArray;
    component.onScannedDevicesAdded(event);
    expect(component.previousChecked).toEqual(event);
  })

  it('deviceConfigMapper', () => {
    const res = component.deviceConfigMapper(deviceArray, deviceArray, deviceArray);
    expect(res).toBeDefined();
  })
});


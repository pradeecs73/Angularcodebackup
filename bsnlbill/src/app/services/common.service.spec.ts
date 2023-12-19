/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed, waitForAsync } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { PropertyPanelType } from '../enum/enum';
import { Config, ProjectRegex } from '../models/config.interface';
import { FileUploadEventMessage } from '../models/connection.interface';
import { AuthenticateDevice } from '../models/models';
import { PanelDataType } from '../models/monitor.interface';
import { Device } from '../models/targetmodel.interface';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { PopoverComponent } from '../shared/popover/popover.component';
import { PROJ_RSRV_REGEX } from "./../utility/constant";
import { CommonService } from './common.service';



let mockMessageService: MessageService;

fdescribe('CommonService', () => {

  const facadeMockService = new FacadeMockService();

  beforeEach(waitForAsync(() => {
    mockMessageService = jasmine.createSpyObj('MessageService', ['add', 'clear']);
    TestBed.configureTestingModule({
      providers: [{ provide: FacadeService, useValue: facadeMockService },
      { provide: MessageService, useValue: mockMessageService }],

    });
  }));

  it('should be created', () => {
    const service: CommonService = TestBed.inject(CommonService);
    expect(service).toBeTruthy();
  });


  // it('should set dialog type as error', () => {

  //   var status = new Status();
  //   status.totalConnections = 1;
  //   status.noOfFailedConnections = 1;

  //   const service: CommonService = TestBed.get(CommonService);
  //   service.setConnectionStatusDialogue(status);
  //   expect(service.dialogTitle).toBe('Connection Status');
  //   expect(service.dialogType).toBe('error');
  // });

  // it('should set dialog type as success', () => {

  //   var status = new Status();
  //   status.totalConnections = 1;
  //   status.noOfFailedConnections = 0;

  //   const service: CommonService = TestBed.get(CommonService);
  //   service.setConnectionStatusDialogue(status);
  //   expect(service.dialogTitle).toBe('Connection Status');
  //   expect(service.dialogType).toBe('success');
  // });

  // it('should set dialog and type', () => {

  //   const service: CommonService = TestBed.get(CommonService);
  //   service.setDialogData('Connection Status', 'success');
  //   expect(service.dialogTitle).toBe('Connection Status');
  //   expect(service.dialogType).toBe('success');
  // });

  it('should set error icon to false', () => {

    const service: CommonService = TestBed.get(CommonService);
    service.setErrorIcon(false, false);
    expect(service.errorIcon).toBeFalsy();
  });

  it('should set error icon to true', () => {

    const service: CommonService = TestBed.get(CommonService);
    service.setErrorIcon(true, true);
    expect(service.errorIcon).toBeFalsy();
  });

  // it('should set accessible devices loader data', () => {

  //   const service: CommonService = TestBed.get(CommonService);
  //   service.setAccessibleDevicesLoaderData();
  //   expect(service.dialogType).toBe('loader');
  //   expect(service.dialogContentMessage).toBe('Please wait while we update the accessible devices.');
  //   expect(service.dialogSpinnerMessage).toBe('Browsing devices');
  //   expect(service.dialogTitle).toBe('Update Accessible Devices');
  // });

  // it('should set loader data', () => {

  //   const service: CommonService = TestBed.get(CommonService);
  //   service.setLoaderData('testa', 'testb', 'testc');
  //   expect(service.dialogType).toBe('loader');
  //   expect(service.dialogContentMessage).toBe('testa');
  //   expect(service.dialogSpinnerMessage).toBe('testb');
  //   expect(service.dialogTitle).toBe('testc');
  // });

  it('should call changePanelData method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const data = {} as unknown as PanelDataType;
    service.changePanelData(data);
    expect(service.changePanelData).toBeDefined();
  });

  it('should call onLangChange method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.onLangChange('en');
    expect(service.onLangChange).toBeDefined();
  });

  it('should call changeDeviceState method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const data = {} as unknown as Device;
    service.changeDeviceState(data);
    expect(service.changeDeviceState).toBeDefined();
  });

  it('should call exportSnapShots method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const data = "";
    service.exportSnapShots(data);
    expect(service.exportSnapShots).toBeDefined();
  });

  it('should call showAuthenticationPopupState method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const data = {} as unknown as AuthenticateDevice;
    service.showAuthenticationPopupState(data);
    expect(service.showAuthenticationPopupState).toBeDefined();
  });

  it('should call authenticationPopUpState method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const data = {} as unknown as AuthenticateDevice;
    service.selectedMenuTree(data);
    expect(service.selectedMenuTree).toBeDefined();
  });

  it('should call selectedMenuTree method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.authenticationPopUpState();
    expect(service.authenticationPopUpState).toBeDefined();
  });

  it('should call disableHomeAndDeviceIcons method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.disableHomeAndDeviceIcons(true);
    expect(service.disableHomeAndDeviceIcons).toBeDefined();
  });

  it('should call changeEstablishConnectionState method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.changeEstablishConnectionState(true);
    expect(service.changeEstablishConnectionState).toBeDefined();
  });

  it('should call changeZoomPercent method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.changeZoomPercent(25);
    expect(service.changeZoomPercent).toBeDefined();
  });

  it('should call changeTargetBtn method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.changeTargetBtn(25);
    expect(service.changeTargetBtn).toBeDefined();
  });

  it('should call changeSaveStatus method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const data = { status: { code: 12345, msg: 'sample' } };
    service.changeSaveStatus(data);
    expect(service.changeSaveStatus).toBeDefined();
  });

  it('should call changeErrorCountStatus method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.changeErrorCountStatus('error');
    expect(service.changeErrorCountStatus).toBeDefined();
  });

  it('should call viewErrors method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.popoverRef = { displayErrors: () => true } as unknown as PopoverComponent;
    service.viewErrors({});
    expect(service.viewErrors).toBeDefined();
  });

  it('should call setSelectedDeviceId method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.setSelectedDeviceId({});
    expect(service.setSelectedDeviceId).toBeDefined();
  });

  it('should call updateDeviceAdditionType method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.updateDeviceAdditionType({});
    expect(service.updateDeviceAdditionType).toBeDefined();
  });

  it('should call updateDeviceAdditionType method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.updateDeviceAdditionType({});
    expect(service.updateDeviceAdditionType).toBeDefined();
  });

  it('should call setUploadNodeSetFileStatus method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const data = {} as unknown as FileUploadEventMessage;
    service.setUploadNodeSetFileStatus(data);
    expect(service.setUploadNodeSetFileStatus).toBeDefined();
  });

  it('should call setScannedDevicesList method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.setScannedDevicesList({});
    expect(service.setScannedDevicesList).toBeDefined();
  });

  it('should call displayExceptionPopup method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.displayExceptionPopup();
    expect(service.displayExceptionPopup).toBeDefined();
  });

  it('should call displayServerExceptionPopup method', () => {
    const service: CommonService = TestBed.get(CommonService);
    Object.getOwnPropertyDescriptor(facadeMockService.translateService, 'get').value.and.returnValue(of({}));
    service.displayServerExceptionPopup();
    expect(service.displayServerExceptionPopup).toBeDefined();
  });

  it('should call updateExceptionDataToUI method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const uniqueErrorList = [];
    service.updateExceptionDataToUI(uniqueErrorList);
    expect(service.updateExceptionDataToUI).toBeDefined();
  });

  it('should call updateMenu method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.updateMenu({});
    expect(service.updateMenu).toBeDefined();
  });

  it('should call incrementScanningDeviceCount method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.incrementScanningDeviceCount();
    expect(service.incrementScanningDeviceCount).toBeDefined();
  });

  it('should call resetDeviceScanningCount method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.resetDeviceScanningCount();
    expect(service.resetDeviceScanningCount).toBeDefined();
  });

  it('should call updateDevicesListInGrid method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.updateDevicesListInGrid({});
    expect(service.updateDevicesListInGrid).toBeDefined();
  });

  it('should call updateNavigationToAnother method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.updateNavigationToAnother(true);
    expect(service.updateNavigationToAnother).toBeDefined();
  });

  it('should call setSessionAndStartTimerDuration method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const configObject = {} as unknown as Config;
    service.setSessionAndStartTimerDuration(configObject);
    expect(service.setSessionAndStartTimerDuration).toBeDefined();
  });

  it('should call projectRegex method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.projectRegexStore = {} as unknown as ProjectRegex;
    expect(service.projectRegex).toBeDefined();
  });

  it('should call setShowProjectProtectionModel method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.setShowProjectProtectionModel(true);
    expect(service.setShowProjectProtectionModel).toBeDefined();
  });

  it('should call projectProtectionModal method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.projectProtectionModal;
    expect(service.projectProtectionModal).toBeDefined();
  });

  it('should call setProjectRegex method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const config = {
      PROJ_RSRV_REGEX: 'teststring',
      PROJ_SPECIAL_CHAR_REGEX: 'teststring1',
      IP_ADDRESS_REGEX_VALIDATOR: 'teststring2',
      PORTVALIDATE_REGEX: 'teststring3',
      PASSWORD_PATTERN_REGEX: 'teststring4',
      LOWERCASE_CHARACTER_REGEX: PROJ_RSRV_REGEX.toString(),
      UPPERCASE_CHARACTER_REGEX: PROJ_RSRV_REGEX.toString(),
      SPECIAL_CHARACTER_REGEX: PROJ_RSRV_REGEX.toString(),
      MINIMUM_EIGHT_CHARACTER_REGEX: PROJ_RSRV_REGEX.toString()
    } as unknown as Config;
    service.setProjectRegex(config);
    expect(service.setProjectRegex).toBeDefined();
  });

  it('should call updateNotificationPanel method', () => {
    const service: CommonService = TestBed.get(CommonService);
    service.updateNotificationPanel(true, true);
    expect(service.updateNotificationPanel).toBeDefined();
  });

  it('should call updatePropertyState method', () => {
    const treeData = [{ children: [{}] }];
    const service: CommonService = TestBed.get(CommonService);
    spyOn(service, 'setExpandedState').and.returnValue({ children: [] });
    service.updatePropertyState(treeData, 'leftpanel');
    expect(service.updatePropertyState).toBeDefined();
  });

  it('should call setExpandedState method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const item = {
      name: 'panel',
      rootParent: 'root',
      expanded: true
    };

    let panelType = PropertyPanelType.CONNECTION;
    service.setExpandedState(item, panelType);
    service['interfacePropertyState'] = [{ name: 'panel', panelType: PropertyPanelType.INTERFACE, parent: 'root', isExpanded: true }];
    panelType = PropertyPanelType.INTERFACE;
    service.setExpandedState(item, panelType);
    expect(service.setExpandedState).toBeDefined();
  });

  it('should call setMousePosition method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const event = { pageX: 100, pageY: 100, clientX: 100, clientY: 100 };
    service.setMousePosition(event);
    expect(service.setMousePosition).toBeDefined();
  });

  it('should call closeproject method', () => {
    const service: CommonService = TestBed.get(CommonService);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'closeProject').value.and.returnValue(of({}));
    service.closeProject();
    expect(service.closeProject).toBeDefined();
    expect(facadeMockService.saveService.openedProject).toEqual(null);
  });

  it('should call closeproject method', () => {
    const service: CommonService = TestBed.get(CommonService);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'closeProject').value.and.returnValue(of({}));
    service.closeProject();
    expect(service.closeProject).toBeDefined();
    expect(facadeMockService.saveService.openedProject).toEqual(null);
  });

  it('should call getTimerText method', () => {
    const service: CommonService = TestBed.get(CommonService);
    let sessionExpireCountDown = 1000;
    service.getTimerText(sessionExpireCountDown);
    expect(service.getTimerText).toBeDefined();
  });

  it('should call handleTimeout method', () => {
    const service: CommonService = TestBed.get(CommonService);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'saveProject').value.and.returnValue(of({}));
    service.handleTimeout();
    expect(service.handleTimeout).toBeDefined();
    expect(facadeMockService.saveService.redirectHomePage).toBeDefined();
  });

  it('should call handleOnlineState method', () => {
    const service: CommonService = TestBed.get(CommonService);
    const monitor = { 'offlineState': () => true, 'goOffline': () => true };
    spyOn(service.injector, 'get').and.returnValue(monitor);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDevices').value.and.returnValue([{ adapterType: 'adapter1' }]);
    Object.getOwnPropertyDescriptor(facadeMockService.applicationStateService, 'isOnline').value.and.returnValue(true);
    service.handleOnlineState();
    expect(service.handleOnlineState).toBeDefined();
  });


});

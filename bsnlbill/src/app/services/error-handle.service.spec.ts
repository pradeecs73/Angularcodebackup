/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { HomeComponent } from '../home/home.component';
import { Device } from '../models/targetmodel.interface';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { DeviceState, ErrorResponse, ResponseStatusCode } from './../enum/enum';
import { ApiResponse } from './../models/models';
import { ErrorHandleService } from './error-handle.service';

let mockMessageService: MessageService;
let service: ErrorHandleService;
const mockedErrorData: ApiResponse = {
  status: '500',
  error: {
    errorCode: 120023,
    errorType: 'common_error',
  },
  data: {
    code: 500,
    msg: 'Project Name not unique',
    client: {
      deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MDo0ODQw',
      status: 'UNAVAILABLE',
    },
    server: {
      deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MTo0ODQw',
      status: 'UNKNOWN',
    },
  },
};

const mockedErrorDataForErrorService: any = {
  error: mockedErrorData
};




fdescribe('ErrorHandleService', () => {

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
    service = TestBed.inject(ErrorHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should call delete project error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Delete_Project_failure;
    mockedErrorDataForErrorService.error.error.errorCode = 120024;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('should call delete device error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Delete_Device_failure;
    mockedErrorDataForErrorService.error.error.errorCode = 120025;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('should call device connect error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Is_Device_conneted_failure;
    service.handleError(mockedErrorDataForErrorService);
    expect(service.deviceConnectedError).toBeDefined();
  });

  it('should call validate project error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Validate_Project_failure;
    service.handleError(mockedErrorDataForErrorService);
    expect(service.handleValidateProjectError).toBeDefined();
  });

  it('should call import project error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Import_Project_failure;
    mockedErrorDataForErrorService.error.error.errorCode = 120026;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('should call recent project error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Recent_Project_failure;
    mockedErrorDataForErrorService.error.error.errorCode = 120027;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('should call browse device error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Browse_device_failure;
    mockedErrorDataForErrorService.error.error.errorCode = 120028;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('should call close connection error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Close_Connection_Invalid_payload;
    mockedErrorDataForErrorService.error.error.errorCode = 120029;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('should call save or update project error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Save_Project_failure;
    mockedErrorDataForErrorService.error.error.errorCode = 120030;
    service.handleError(mockedErrorDataForErrorService);
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Update_Project_failure;
    service.handleError(mockedErrorDataForErrorService);
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Close_Project_failure;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('should call device not running connection error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Establish_Connection_Client_Device_Not_Running;
    mockedErrorDataForErrorService.error.error.errorCode = 120031;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Establish_Connection_Server_Device_Not_Running;
    service.handleError(mockedErrorDataForErrorService);
  });

  it('should call invalid session client error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Establish_Connection_Client_Device_Invalid_Session;
    mockedErrorDataForErrorService.error.error.errorCode = 120032;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
  });

  it('should invalid client data connection error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Establish_Connection_Error_Invalid_Client_Data;
    mockedErrorDataForErrorService.error.error.errorCode = 120033;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
  });

  it('should invalid bad timeout connection error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.BADTIMEOUT;
    mockedErrorDataForErrorService.error.error.errorCode = 120034;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
  });

  it('should invalid client data connection error', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.BAD_INTERNALERROR;
    mockedErrorDataForErrorService.error.error.errorCode = 120035;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
  });

  it('should call handle go online device error ', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Go_Online_Unavailable_Devices_List;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.overlayService.changeOverlayState).toHaveBeenCalled();
  });

  it('should call handle go online service error ', () => {
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Go_Online_failure;
    mockedErrorDataForErrorService.error.error.errorCode = 120036;
    service.handleError(mockedErrorDataForErrorService);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('should call handle server crash error', () => {
    service.handleServerCrashError();
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('open project should fail when its opened in other browser', () => {
    spyOn(service, 'handleOpenProjectErrorBySession');
    mockedErrorDataForErrorService.error.error.errorType = ResponseStatusCode.Open_Project_Failed_Opened_In_Another_Session;
    mockedErrorDataForErrorService.error.error.errorCode = 120055;
    service.handleError(mockedErrorDataForErrorService);
    expect(service.handleOpenProjectErrorBySession).toHaveBeenCalled();

  });

  it('should call handleError method', () => {
    mockedErrorDataForErrorService.error.error = '';
    service.handleError(mockedErrorDataForErrorService as unknown as HttpErrorResponse);
    service.errorTypeCollection = [];
    mockedErrorDataForErrorService.error.error = {
      'errorCode': 120023,
      'errorType': 'common_error'
    };
    service.handleError(mockedErrorDataForErrorService as unknown as HttpErrorResponse);
    expect(service.handleError).toBeDefined();
  });

  it('should call handleTokenExpiry method', () => {
    service.handleTokenExpiry();
    expect(service.handleTokenExpiry).toBeDefined();
  });

  it('should call handleCookieExpiry method', () => {
    spyOn(service.router, 'navigateByUrl');
    service.handleCookieExpiry(mockedErrorDataForErrorService);
    expect(service.handleCookieExpiry).toBeDefined();
  });

  it('handleErrorType', () => {
    service.handleErrorType();
  });

  it('handleCertificateValidationError', () => {
    service.handleCertificateValidationError('test');
    expect(facadeMockService.overlayService.changeOverlayState).toHaveBeenCalled();
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('handleEstablishConnectionError', () => {
    const error = {
      error: {
        errorCode: '1234',
        errorType: 'test'
      } as unknown as ErrorResponse
    };
    service.handleEstablishConnectionError(error);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('handleUpdateDeviceOrChangeAddressError', () => {
    const error1 = {
      data: {
        address: 'test'
      },
      error: {
        errorCode: '1234',
        errorType: 'test'
      } as unknown as ErrorResponse
    };
    service.handleUpdateDeviceOrChangeAddressError(error1);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('handleCommonError', () => {
    const error = {
      error: {
        errorCode: '1234',
        errorType: 'test'
      } as unknown as ErrorResponse
    };
    Object.getOwnPropertyDescriptor(facadeMockService.translateService, 'instant').value.and.returnValue('testttt');
    service['handleCommonError'](error);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('handleDeviceInvalidCredentialsError', () => {
    const error = {
      error: {
        errorCode: '1234',
        errorType: 'test'
      } as unknown as ErrorResponse
    };
    Object.getOwnPropertyDescriptor(facadeMockService.translateService, 'instant').value.and.returnValue('testttt');
    service.handleDeviceInvalidCredentialsError(error);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('updateNotificationPanel', () => {
    service.updateNotificationPanel(true, true);
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.displayExceptionPopup).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('updateErrorList', () => {
    const device = {
      name: 'test',
      state: DeviceState.UNAVAILABLE,
      address: '192.168.2.101:4840'
    };
    service.updateErrorList(device as unknown as Device, true);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
  });

  it('updateErrorList', () => {
    const device = {
      name: 'test',
      state: DeviceState.UNAVAILABLE,
      address: '192.168.2.101:4840'
    };
    service.updateErrorList(device as unknown as Device, true);
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
  });

  it('handleDeleteProjectErrorBySession', () => {
    spyOn(service, 'generateToastAndErrorNotification');
    const error = {
      error: {
        errorCode: '1234',
        errorType: 'test'
      } as unknown as ErrorResponse
    };
    service.handleDeleteProjectErrorBySession(error);
    expect(service.generateToastAndErrorNotification).toHaveBeenCalled();
  });

  it('handleOpenProjectErrorBySession', () => {
    spyOn(service, 'handleOverlayErrorPopupMessage');
    service.handleOpenProjectErrorBySession();
    expect(service.handleOverlayErrorPopupMessage).toHaveBeenCalled();

  });

  it('handleBrowseDeviceAuhthenticationFailure', () => {
    const error = {
      error: {
        errorCode: '1234',
        errorType: 'test'
      } as unknown as ErrorResponse
    };
    spyOn(service, 'handleOverlayErrorPopupMessage');
    service.handleBrowseDeviceAuhthenticationFailure(error);
    expect(service.handleOverlayErrorPopupMessage).toHaveBeenCalled();
  });

});

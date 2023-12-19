/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/


import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Notification } from '../models/notification.interface';
import { Device } from '../models/targetmodel.interface';
import { FacadeService } from '../livelink-editor/services/facade.service';
import {
  DeviceState,
  ErrorResponse,
  ErrorTypeList,
  NotificationType,
  ResponseStatusCode,
  errorHandleMethods
} from './../enum/enum';
import { ConnectionResponsePayload } from './../models/connection.interface';
import { ApiResponse } from './../models/models';
import { isNullOrEmpty, isNullOrUnDefined } from './../utility/utility';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleService {

  errorTypeCollection=[ResponseStatusCode.Establish_Connection_Failure,ResponseStatusCode.Update_Device_Or_Change_Device_Address,
    ResponseStatusCode.Establish_Connection_Client_Device_Not_Running,ResponseStatusCode.Establish_Connection_Server_Device_Not_Running,
    ResponseStatusCode.Establish_Connection_Client_Device_Invalid_Session,ResponseStatusCode.Establish_Connection_Server_Device_Invalid_Session,
    ResponseStatusCode.Establish_Connection_Error_Invalid_Client_Data,ResponseStatusCode.BADTIMEOUT,ResponseStatusCode.BAD_INTERNALERROR,
    ResponseStatusCode.Save_Project_failure,ResponseStatusCode.Update_Project_failure,ResponseStatusCode.Close_Project_failure,
    ResponseStatusCode.Close_Connection_Invalid_payload,ResponseStatusCode.Close_Connection_Device_error_Config,ResponseStatusCode.Close_Connection_Device_Not_Running,
    ResponseStatusCode.Close_Connection_Device_Invalid_Session,ResponseStatusCode.Recent_Project_failure,ResponseStatusCode.Validate_Project_failure,
    ResponseStatusCode.Import_Project_failure,ResponseStatusCode.Is_Device_conneted_failure,ResponseStatusCode.Browse_device_failure,
    ResponseStatusCode.Delete_Device_failure,ResponseStatusCode.Delete_Project_failure,ResponseStatusCode.Go_Online_Unavailable_Devices_List,
    ResponseStatusCode.Go_Online_failure,ResponseStatusCode.Invalid_Device_Credentials,ResponseStatusCode.Register_Password_Failure_Or_Read_Write_Same,
    ResponseStatusCode.Incorrect_Old_Password,ResponseStatusCode.Register_Password_Failure_Invalidpayload,ResponseStatusCode.Change_Password_failure_Old_New_Same,
    ResponseStatusCode.Access_And_Refresh_Tokens_Expired,ResponseStatusCode.Authorization_Failure,ResponseStatusCode.Delete_Project_Failure_Inavlid_Password,
    ResponseStatusCode.Delete_Project_Failure_In_Another_Session,ResponseStatusCode.Open_Project_Failed_Opened_In_Another_Session,
    ResponseStatusCode.Browse_device_Device_Authentication_Failure,
    ResponseStatusCode.Invalid_Address_Model,ResponseStatusCode.Authenticate_Project_Failure];

    errorMap = new Map();

  notificationList: Notification[] = [];
  errorFailed = this.facadeService.translateService.instant('messageService.error.failed.summary');
  constructor(private readonly facadeService: FacadeService,
    private readonly messageService: MessageService,
    public readonly router: Router) {
      this.initializeErrorMethods();
    }

    initializeErrorMethods(){
      this.errorMap.set(ResponseStatusCode.Establish_Connection_Failure,{method:errorHandleMethods.handleEstablishConnectionError});
      this.errorMap.set(ResponseStatusCode.Update_Device_Or_Change_Device_Address,{method:errorHandleMethods.handleUpdateDeviceOrChangeAddressError});
      this.errorMap.set(ResponseStatusCode.Establish_Connection_Client_Device_Not_Running,{method:errorHandleMethods.updateDeviceNotRunningData});
      this.errorMap.set(ResponseStatusCode.Establish_Connection_Server_Device_Not_Running,{method:errorHandleMethods.updateDeviceNotRunningData});
      this.errorMap.set(ResponseStatusCode.Establish_Connection_Client_Device_Invalid_Session,{method:errorHandleMethods.updateInvalidSessionData});
      this.errorMap.set(ResponseStatusCode.Establish_Connection_Server_Device_Invalid_Session,{method:errorHandleMethods.updateInvalidSessionData});
      this.errorMap.set(ResponseStatusCode.Establish_Connection_Error_Invalid_Client_Data,{method:errorHandleMethods.updateDeviceInvalidClientData});
      this.errorMap.set(ResponseStatusCode.BADTIMEOUT,{method:errorHandleMethods.updateBadTimeOutErrorData});
      this.errorMap.set(ResponseStatusCode.BAD_INTERNALERROR,{method:errorHandleMethods.updateConnectedToFaultyDevice});
      this.errorMap.set(ResponseStatusCode.Save_Project_failure,{method:errorHandleMethods.saveOrUpdateProjectError});
      this.errorMap.set(ResponseStatusCode.Update_Project_failure,{method:errorHandleMethods.saveOrUpdateProjectError});
      this.errorMap.set(ResponseStatusCode.Close_Project_failure,{method:errorHandleMethods.saveOrUpdateProjectError});
      this.errorMap.set(ResponseStatusCode.Close_Connection_Invalid_payload,{method:errorHandleMethods.handleCloseConnectionError});
      this.errorMap.set(ResponseStatusCode.Close_Connection_Device_error_Config,{method:errorHandleMethods.handleCloseConnectionError});
      this.errorMap.set(ResponseStatusCode.Close_Connection_Device_Not_Running,{method:errorHandleMethods.handleCloseConnectionError});
      this.errorMap.set(ResponseStatusCode.Close_Connection_Device_Invalid_Session,{method:errorHandleMethods.handleCloseConnectionError});
      this.errorMap.set(ResponseStatusCode.Recent_Project_failure,{method:errorHandleMethods.handleRecentProjectError});
      this.errorMap.set(ResponseStatusCode.Validate_Project_failure,{method:errorHandleMethods.handleValidateProjectError});
      this.errorMap.set(ResponseStatusCode.Import_Project_failure,{method:errorHandleMethods.importProjectError});
      this.errorMap.set(ResponseStatusCode.Is_Device_conneted_failure,{method:errorHandleMethods.deviceConnectedError});
      this.errorMap.set(ResponseStatusCode.Browse_device_failure,{method:errorHandleMethods.handleBrowseDeviceError});
      this.errorMap.set(ResponseStatusCode.Delete_Device_failure,{method:errorHandleMethods.handleDeleteDeviceError});
      this.errorMap.set(ResponseStatusCode.Delete_Project_failure,{method:errorHandleMethods.handleDeleteProjectError});
      this.errorMap.set(ResponseStatusCode.Go_Online_Unavailable_Devices_List,{method:errorHandleMethods.handleGoOnlineDeviceError});
      this.errorMap.set(ResponseStatusCode.Go_Online_failure,{method:errorHandleMethods.handleGoOnlineServerError});
      this.errorMap.set(ResponseStatusCode.Invalid_Device_Credentials,{method:errorHandleMethods.handleDeviceInvalidCredentialsError});
      this.errorMap.set(ResponseStatusCode.Register_Password_Failure_Or_Read_Write_Same,{method:errorHandleMethods.handleErrorType});
      this.errorMap.set(ResponseStatusCode.Incorrect_Old_Password,{method:errorHandleMethods.handleErrorType});
      this.errorMap.set(ResponseStatusCode.Register_Password_Failure_Invalidpayload,{method:errorHandleMethods.handleErrorType});
      this.errorMap.set(ResponseStatusCode.Change_Password_failure_Old_New_Same,{method:errorHandleMethods.handleErrorType});
      this.errorMap.set(ResponseStatusCode.Access_And_Refresh_Tokens_Expired,{method:errorHandleMethods.handleTokenExpiry});
      this.errorMap.set(ResponseStatusCode.Authorization_Failure,{method:errorHandleMethods.handleCookieExpiry});
      this.errorMap.set(ResponseStatusCode.Delete_Project_Failure_Inavlid_Password,{method:errorHandleMethods.handleDeleteProjectError});
      this.errorMap.set(ResponseStatusCode.Delete_Project_Failure_In_Another_Session,{method:errorHandleMethods.handleDeleteProjectErrorBySession});
      this.errorMap.set(ResponseStatusCode.Open_Project_Failed_Opened_In_Another_Session,{method:errorHandleMethods.handleOpenProjectErrorBySession});
      this.errorMap.set(ResponseStatusCode.Browse_device_Device_Authentication_Failure,{method:errorHandleMethods.handleBrowseDeviceAuhthenticationFailure});
      this.errorMap.set(ResponseStatusCode.Invalid_Address_Model,{method:errorHandleMethods.handleErrorType});
      this.errorMap.set(ResponseStatusCode.Authenticate_Project_Failure,{method:errorHandleMethods.handleErrorType});
    }




  /**
   *
   *his method is a entry point once the error comes from the interceptor
   * @param {HttpErrorResponse} err error from the interceptor
   *
   */
  handleError(err: HttpErrorResponse) {

    /**
   *
   * checking the error type in switch case to handle different type of errors
  */
    if (err && err.error && err.error.error) {
      if (this.errorTypeCollection.indexOf(err.error.error.errorType) > -1) {
        const errorFunction = this.errorMap.get(err.error.error.errorType);
        const method = errorFunction.method;
        this[method](err.error);
      }
      else {
        this.handleCommonError(err.error);
      }
    } else {
      const errData = { error: { errorCode: err.status }  as unknown as ErrorResponse } as unknown as HttpErrorResponse;
      this.handleCommonError(errData);
    }
  }


  /**
   *
   * Use this method when no actions need to be performed after the error is thrown
   */
  handleErrorType(){
    return;
  }



  /**
    *
    * This method will called on token expiry error from the interceptor
   */

  handleTokenExpiry() {
    this.messageService.add({
      key: 'commonError', severity: 'error', summary: this.facadeService.translateService.instant('messageService.error.tokenExpired.summary'),
      detail: this.facadeService.translateService.instant('messageService.error.tokenExpired.detail')
    });
    this.facadeService.notificationService.pushNotificationToPopup({content :'messageService.error.tokenExpired.detail' ,params:{}}, NotificationType.ERROR, '120043');
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
    this.router.navigateByUrl('/home');
    this.facadeService.commonService.closeProject();
  }

  handleCookieExpiry(error) {
    this.messageService.add({
      key: 'commonError', severity: 'error', summary: this.facadeService.translateService.instant('messageService.error.projectAuthenticationFailed.summary'),
      detail: this.facadeService.translateService.instant('messageService.error.projectAuthenticationFailed.detail')
    });
    this.facadeService.notificationService.pushNotificationToPopup({content :'messageService.error.projectAuthenticationFailed.detail' ,params:{}},
     NotificationType.ERROR, error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
    this.router.navigateByUrl('/home');
    this.facadeService.commonService.closeProject();
  }

  /**
    *
    * This method will called to handle online device error during goonline
   */
  handleGoOnlineDeviceError() {
    this.facadeService.overlayService.changeOverlayState(false);
  }

  /**
    *
    * This method will called on any server error during go-online
    *  @param error:error from the interceptor
   */
  handleGoOnlineServerError(error: ApiResponse) {
    this.facadeService.overlayService.changeOverlayState(false);
    this.messageService.add({
      key: 'commonError',
      severity: 'error',
      summary: this.errorFailed,
      detail: this.facadeService.translateService.instant('messageService.error.failed.goOnlineFailed')
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      {content : `notification.error.${error.error.errorCode}`,params:{}},
      NotificationType.ERROR, error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

  /**
    *
    * This method will called on any server crash in the backend
   */
  handleServerCrashError() {
    this.facadeService.overlayService.changeOverlayState(false);
    this.messageService.add({
      key: 'commonError', severity: 'error', summary: this.facadeService.translateService.instant('messageService.error.errNodeServer.summary'),
      detail: this.facadeService.translateService.instant('messageService.error.serverCrash.detail')
    });
    this.facadeService.notificationService.pushNotificationToPopup({content : 'notification.error.serverCrash',params:{}}, NotificationType.ERROR, '120029');
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

  /**
    *
    * This method will called on certificate validation error in the backend
   */
  handleCertificateValidationError(error) {
    this.facadeService.overlayService.changeOverlayState(false);
    this.messageService.add({
      key: 'commonError', severity: 'warn', summary: this.facadeService.translateService.instant(`messageService.error.invalidCertificate.${error}.summary`),
      detail: this.facadeService.translateService.instant(`messageService.error.invalidCertificate.${error}.detail`)
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      { content: `messageService.error.invalidCertificate.${error}.detail`, params: {} },
      NotificationType.WARNING, '120029');
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }


  /**
    *
    * This method will called on invalid security policy used by device in backend
   */
  handleInvalidSecurityPolicyNotification(msg: { securityMode: string, endpoint: string, securityPolicy: string; }) {
    this.facadeService.notificationService.pushNotificationToPopup({
      content: `messageService.warn.invalidSecurityPolicy.detail`, params: {
        securityPolicy: msg.securityPolicy,
        securityMode: msg.securityMode, endpoint: msg.endpoint
      }
    }, NotificationType.WARNING, '120029');
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

  /**
    *
    * This method will called if their is any error during update or in saving the project
    *  @param error:error from the interceptor
   */
  saveOrUpdateProjectError(error: {error:ErrorResponse}) {
    const key=this.facadeService.translateService.instant('messageService.error.updateProjectFailed.key');
    const summary=this.facadeService.translateService.instant('messageService.error.updateProjectFailed.summary');
    this.messageService.add({ key: key, severity: 'error',
     summary: summary, detail: this.facadeService.translateService.instant('notification.error.saveProjectError') });
    this.facadeService.notificationService.pushNotificationToPopup(
      {content : `notification.error.${error.error.errorCode} Error`,params:{}},
       NotificationType.ERROR, error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

  /**
    *
    * This method will called if their is any error during closing the connection
    *  @param error:error from the interceptor
   */
  handleCloseConnectionError(error: {error:ErrorResponse}) {
    this.messageService.add({
      key: 'closeConnection',
      severity: 'error',
      summary: this.facadeService.translateService.instant('messageService.error.handleCloseConnectionError.summary'),
      detail: this.facadeService.translateService.instant('messageService.error.handleCloseConnectionError.detail')
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      this.facadeService.translateService.instant(`notification.error.${error.error.errorCode}`),
      NotificationType.ERROR, error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }


  /**
    *
    * This method will called if their is any error during establish connection
    *  @param error:error from the interceptor
   */
  handleEstablishConnectionError(error: { error: ErrorResponse }) {
    this.messageService.add({
      key: 'establishConnection',
      severity: 'error',
      summary: this.facadeService.translateService.instant('overlay.error.establishConnectionFailed.header'),
      detail: this.facadeService.translateService.instant('messageService.error.handleCloseConnectionError.detail')
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      {content : `notification.error.${error.error.errorCode}`,params:{}},
      NotificationType.ERROR, error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }


   /**
    *
    * This method will called if their is any error during address change
    *  @param error:error from the interceptor
   */
   handleUpdateDeviceOrChangeAddressError(error: {data:{address:string},error:ErrorResponse}) {
    this.facadeService.notificationService.pushNotificationToPopup(
      {content : `notification.error.${error.error.errorCode}`,params:{address:error.data.address}},
      NotificationType.ERROR, error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

  /**
    *
    * This method will called if their is any error with session data
    * @param connectionResult:Array of connections
   */
 updateInvalidSessionData(connectionResult: ConnectionResponsePayload) {
    if (!isNullOrUnDefined(connectionResult.data) && !isNullOrUnDefined(connectionResult.data.client.deviceId)) {
      const msg = this.facadeService.translateService.instant(`notification.error.${connectionResult.error.errorCode}`,
      { deviceId: connectionResult.data.client.deviceId });
      this.facadeService.notificationService.pushNotificationToPopup(msg, NotificationType.ERROR, connectionResult.error.errorCode);
    }
  }

  /**
    *
    * This method will called if their is device is in not running state
   */
  updateDeviceNotRunningData(connectionResult: ConnectionResponsePayload) {
    let device = '';
    if (connectionResult.data && connectionResult.data.client.deviceId && connectionResult.data.server.deviceId) {
      if (connectionResult.error.errorType === ResponseStatusCode.Establish_Connection_Server_Device_Not_Running) {
        device = connectionResult.data.server['automationComponent'];
      }
      else {
        device = connectionResult.data.client['automationComponent'];
      }
      const msg = {
      key :`notification.error.${connectionResult.error.errorCode}`,
      params:  {
        clientAC: connectionResult.data.client['automationComponent'],
        clientInterface: connectionResult.data.client['interfaceType'],
        serverAC: connectionResult.data.server['automationComponent'],
        serverInterface: connectionResult.data.server['interfaceType'],
        device: device
      }};
       this.facadeService.notificationService.pushNotificationToPopup({content : msg.key,params:msg.params}, NotificationType.ERROR, connectionResult.error.errorCode);
    }
  }

  /**
    *
    * This method will called if their is any time out in fetching device address
   */
   updateBadTimeOutErrorData(connectionResult: ConnectionResponsePayload) {
    const msg = {key : 'notification.error.2148139008', params: {
      clientDeviceID: this.facadeService.dataService.getDeviceAddress(connectionResult.data.client.deviceId),
      serverDeviceId: this.facadeService.dataService.getDeviceAddress(connectionResult.data.server.deviceId)
    }};
    this.facadeService.notificationService.pushNotificationToPopup({content : msg.key,params:msg.params}, NotificationType.ERROR, connectionResult.error.errorCode);
  }

  /**
    *
    * This method will called if their is any operation done on faulty device
    * @param result:Response from the Api
   */
  updateConnectedToFaultyDevice(result: ConnectionResponsePayload) {
    if (!isNullOrUnDefined(result.data.client.deviceId) && !isNullOrEmpty(result.data.server.deviceId)) {
      const msg = {key : 'notification.error.2147614720',
      params:  {
        clientDeviceAddress: result.data.client.deviceAddress,
        serverDeviceAddress: result.data.server.deviceAddress
      }};
       this.facadeService.notificationService.pushNotificationToPopup({content : msg.key,params:msg.params}, NotificationType.ERROR, result.error.errorCode);
    }
  }

  /**
    *
    * This method will called if their is invalid client data in making a connection
   */
   updateDeviceInvalidClientData(connectionResult: ConnectionResponsePayload) {
    const msg = {key : `notification.error.${connectionResult.error.errorCode}`,
    params : {
      clientDeviceAddress: connectionResult.data.client.deviceAddress,
      serverDeviceAddress: connectionResult.data.server.deviceAddress
    }};
     this.facadeService.notificationService.pushNotificationToPopup({content : msg.key,params:msg.params}, NotificationType.ERROR, connectionResult.error.errorCode);
  }

  /**
    *
    * This method will called if their is error in opening a recent projects
    * @param error:error from the interceptor
   */
   handleRecentProjectError(error: {error:ErrorResponse}) {
    this.messageService.add({
      key: 'commonError',
      severity: 'error',
      summary: this.errorFailed,
      detail: this.facadeService.translateService.instant('messageService.error.failed.handleRecentProjectError')
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      {content :`notification.error.${error.error.errorCode}` ,params:{}},
      NotificationType.ERROR, error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

  /**
    *
    * This method will called during project validation
    *  @param error:error from the interceptor
   */
  handleValidateProjectError(_error: {error:ErrorResponse}) {
    return;
  }

  /**
    *
    * This method will called if their is any error in importing the project
    *  @param error:error from the interceptor
   */
   importProjectError(error: {error:ErrorResponse}) {
    this.messageService.add({
      key: 'commonError',
      severity: 'error',
      summary: this.errorFailed,
      detail: this.facadeService.translateService.instant('messageService.error.failed.importProjectError')
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      {content :'notification.error.importProjectError' ,params:{}},
      NotificationType.ERROR,
      error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

  /**
    *
    * This method will called if their is any error in browsing the devices
    *  @param error:error from the interceptor
   */
   handleBrowseDeviceError(error: {error:ErrorResponse}) {
    this.messageService.add({
      key: 'commonError',
      severity: 'error',
      summary: this.errorFailed,
      detail: this.facadeService.translateService.instant('messageService.error.failed.handleBrowseDeviceError')
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      {content : `notification.error.${error.error.errorCode}`,params:{}},
      NotificationType.ERROR, error.error.errorCode
    );
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }


  /**
    *
    * This method will called if their is any error in device connection
    *  @param error:error from the interceptor
   */
  deviceConnectedError(_error: { error: ErrorResponse }) {
    return;
  }

  /**
    *
    * This method will called if their is any error in deleting the device
    *  @param error:error from the interceptor
   */
   handleDeleteDeviceError(error: {error:ErrorResponse}) {
    this.messageService.add({
      key: 'commonError',
      severity: 'error',
      summary: this.errorFailed,
      detail: this.facadeService.translateService.instant('messageService.error.failed.deleteDeviceFailed')
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      {content : `notification.error.${error.error.errorCode}`,params:{}},
      NotificationType.ERROR, error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

   /**
    *
    * This method will called if their is any error in deleting the project
    *  @param error:error from the interceptor
   */
   handleDeleteProjectError(error: {error:ErrorResponse}) {
    this.generateToastAndErrorNotification(error,'messageService.error.failed.deleteProjectFailed');
    this.handleOverlayErrorPopupMessage('overlay.error.authenticationFailed.header','overlay.error.authenticationFailed.message.title',
    'overlay.error.authenticationFailed.message.content');
  }

   /**
    *
    * This method is a generic method to handle common errors from interceptor
    *  @param error:error from the interceptor
   */
  private handleCommonError(error: { error: ErrorResponse }) {
    let content: { content: string, params: {} };
    let detail: string;
    if (error && error.error && error.error.errorCode) {
      if (this.facadeService.translateService.instant(`notification.error.${error.error.errorCode}`) !==
        `notification.error.${error.error.errorCode}`) {
        content = { content: `notification.error.${error.error.errorCode}`, params: { errorCode: error.error.errorCode } };
        detail = this.facadeService.translateService.instant(`notification.error.${error.error.errorCode}`, { errorCode: error.error.errorCode });
      }
      else {
        content = { content: `notification.error.handleCommonError`, params: { errorCode: error.error.errorCode } };
        detail = this.facadeService.translateService.instant(`notification.error.handleCommonError`, { errorCode: error.error.errorCode });
      }
    }
    this.facadeService.overlayService.changeOverlayState(false);
    this.messageService.add({
      key: 'commonError',
      severity: 'error',
      summary: this.errorFailed,
      detail
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      content,
      NotificationType.ERROR, error.error.errorCode
    );
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

  /**
   *
   * This method is called on invalid credentials while opening the project
   *  @param error:error from the interceptor
  */
  handleDeviceInvalidCredentialsError(error: { error: ErrorResponse; }) {
    this.messageService.add({
      key: 'commonError',
      severity: 'error',
      summary: this.errorFailed,
      detail: this.facadeService.translateService.instant(`notification.error.${error.error.errorCode}`)
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      {content :`notification.error.${error.error.errorCode}` ,params:{}},
      NotificationType.ERROR,
      error.error.errorCode
    );
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }

  /**
    *
    * This method is called to update the notification panel
   */
  updateNotificationPanel(isError: boolean, showError: boolean) {
    if (isError === true && showError === true) {
      this.facadeService.commonService.setErrorIcon(true, true);
      this.facadeService.commonService.displayExceptionPopup();
      this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
    }
  }

  /**
    *
    * This method is called during goOnline error if device not running
   */
  updateErrorList(device: Device, showError: boolean) {
    if (device && device.state === DeviceState.UNAVAILABLE && showError) {
       this.facadeService.notificationService.pushNotificationToPopup({content : 'notification.error.deviceNotRunning',
       params:{ deviceName: device.name, deviceAddress: device.address }},
       NotificationType.ERROR, 'GO_ONLINE_ERROR');
    }
  }

   /**
    *
    * This method is called during project delete if project is in different session
    *  @param error:error from the interceptor
   */
  handleDeleteProjectErrorBySession(error:{error:ErrorResponse})
  {
    this.generateToastAndErrorNotification(error,'messageService.error.failed.deleteProjectFailed');
    this.handleOverlayErrorPopupMessage('overlay.error.deleteProjectFailed.header','overlay.error.deleteProjectFailed.message.title',
          'overlay.error.deleteProjectFailed.message.content');
  }

  handleOpenProjectErrorBySession(){
    this.messageService.add({
      key: 'commonError',
      severity: 'error',
      summary: this.errorFailed,
      detail: this.facadeService.translateService.instant('messageService.error.failed.openProjectFailed')
    });
    this.handleOverlayErrorPopupMessage('overlay.error.openProjectFailedOpenedInAnotherSession.header',
            'overlay.error.openProjectFailedOpenedInAnotherSession.message.title',
            'overlay.error.openProjectFailedOpenedInAnotherSession.message.content');
  }

   /**
    *
    * This method is called during authentication failure when we add device
    *  @param error:error from the interceptor
   */
  handleBrowseDeviceAuhthenticationFailure(_error:{error:ErrorResponse}){
    this.handleOverlayErrorPopupMessage('overlay.error.handleBrowseDeviceFailure.header',
            'overlay.error.handleBrowseDeviceFailure.message.title',
            'overlay.error.handleBrowseDeviceFailure.message.content');
  }

  /**
    *
    * This is a generic method to display the content of error popup
    *  @param header:error popup header
    *  @param title:error popup title
    *  @param error:error popup content
   */
  handleOverlayErrorPopupMessage(header, title, content) {
    this.facadeService.overlayService.error({
      header: this.facadeService.translateService.instant(header),
      message: {
        title: this.facadeService.translateService.instant(title),
        content: [this.facadeService.translateService.instant(content)]
      },
      successLabel: this.facadeService.translateService.instant('common.buttons.ok')
    });
  }

   /**
    *
    * This is a generic method to push message to toast and error popup
    *  @param error:error from the interceptor
   */
  generateToastAndErrorNotification(error:{error:ErrorResponse},detail){
    this.messageService.add({
      key: 'commonError',
      severity: 'error',
      summary: this.errorFailed,
      detail: this.facadeService.translateService.instant(detail)
    });
    this.facadeService.notificationService.pushNotificationToPopup(
      {content : `notification.error.${error.error.errorCode}`,params:{}},
      NotificationType.ERROR, error.error.errorCode);
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
  }
}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConnectionRequestPayload } from '../models/connection.interface';
import { DeviceScanRequestPayload } from '../models/device-data.interface';
import { OnlineParam, ProjectData, PasswordResponse, SaveProjectResponse, Tree } from '../models/models';
import { MonitorPayload } from '../models/monitor.interface';
import { Notification } from '../models/notification.interface';
import { ChangeProjectPasswordPayload, ReadProjectPayload } from '../models/payload.interface';
import { DeviceConfig } from '../models/targetmodel.interface';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { log } from '../utility/utility';
import { ContentType, IoEvents, Numeric } from './../enum/enum';

const PORT = '3000';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  levelCount = 0;
  isMockServer: boolean;
  url: string;


  constructor(private readonly http: HttpClient, private readonly facadeService: FacadeService) {
    // Disable this for IIS this.url = `${window.location.protocol}//${window.location.hostname}:${PORT}`;
    const currentOrigin = `${window.location.origin}`;
    this.url = `${currentOrigin}/apis`;
    this.facadeService.socketService.initSocket();
    this.getErrorDataFromServer();
  }
  /*
  Api to register password */
  registerPassword(payload): Observable<PasswordResponse[]> {
    const endpoint = `${this.url}/register-password`;
    return this.http.post<PasswordResponse[]>(endpoint, payload);
  }

  /*Api to fetch project data
  */
  getProjectData(payload: ReadProjectPayload) {
    //test for '' and null
    const endpoint = `${this.url}/readProject`;
    return this.http.post(endpoint, payload);
  }
  /*Api to get project list
  */
  getProjects() {
    const endpoint = `${this.url}/getProjects`;
    return this.http.get(endpoint);
  }
  /*Api to get project list
  */
  fetchRecentProjects() {
    const endpoint = `${this.url}/recent-projects?no=${Numeric.TEN}`;
    return this.http.get(endpoint);
  }
  /*Api to import project
  */
  importProject(payload) {
    const endpoint = `${this.url}/import-project`;
    return this.http.post(endpoint, payload);
  }
  /*Api to authenticate device
  */
  deviceAuthenticate(payload, flag) {
    let endpoint;
    if (flag) {
      endpoint = `${this.url}/update-device-credentials`;
    } else {
      endpoint = `${this.url}/authenticate-device`;
    }
    return this.http.post(endpoint, payload);
  }
  /*Api to delete project
  */
  deleteProject(project: string, deleteProjectPayload) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: deleteProjectPayload
    };
    const endpoint = `${this.url}/delete-project?name=` + encodeURIComponent(project);
    return this.http.delete(endpoint, options);
  }
  /*Api to validate project
  */
  validateProject(project: string) {
    const endpoint = `${this.url}/validate-project?name=` + encodeURIComponent(project);
    return this.http.get(endpoint);
  }
  /*Api to scan the devices
  */
  discoverDevices() {
    const projectData = this.facadeService.dataService.getProjectTree();
    if (projectData) {
      return of(JSON.parse(JSON.stringify(projectData)) as Tree);
    } else {
      return of({} as Tree);
    }
  }
  /*Api to ,check if devices is connected
  */
  connectToDevice(ad) {
    const serviceEndPoint = `${this.url}/connect`;
    const param = { ad };
    return this.http.post(serviceEndPoint, param);
  }
  /*Api to connect to api
  */
  connectToOpc(param: ConnectionRequestPayload) {
    const endpoint = `${this.url}/connect`;
    return this.http.post(endpoint, param).pipe(catchError(error => of(error)));
  }
  /*Api to go online
  */
  goOnline(param: OnlineParam) {
    const serviceEndPoint = `${this.url}/go-online`;
    return this.http.post(serviceEndPoint, param);
  }
  /*Api to scan devices
  */
  scanDevice(requestPayload: DeviceScanRequestPayload) {
    const scanSettingAPIEndPoint = `${this.url}/scanDevices`;
    return this.http.post(scanSettingAPIEndPoint, requestPayload);
  }
  /*Api to listen to scanning devices
  */
  listenToScanningOfDevices() {
    const io = this.facadeService.socketService.getIo();

    io.on(IoEvents.SCAN_DEVICES_RESULT_EVENT, response => {
      this.facadeService.commonService.setScannedDevicesList(response);
    });
  }
  /*Api to monitor in online mode
  */
  subscribeTo(param: MonitorPayload): Observable<Object> {
    const serviceEndPoint = `${this.url}/monitor`;
    return this.http.post(serviceEndPoint, { ...param });
  }
  /*cancel
  */
  cancelScanningDevice() {
    const io = this.facadeService.socketService.getIo();

    io.emit(IoEvents.IS_CANCEL_EVENT, true, response => {
      log(response);
    });
  }
  /*update device in real time
  */
  updateScanningDeviceInRealTime() {
    const io = this.facadeService.socketService.getIo();
    io.on(IoEvents.SCAN_DEVICE_COUNT, _response => {
      this.facadeService.commonService.incrementScanningDeviceCount();
    });
  }
  /*Unsubscribe to scanning devices event
  */
  unsubscribeToScanningDevicesEvents() {
    const io = this.facadeService.socketService.getIo();
    io.off(IoEvents.SCAN_DEVICE_COUNT);
  }
  /*Api to end monitoring
  */
  unSubscribe(param: MonitorPayload) {
    const serviceEndPoint = `${this.url}/end-monitor`;
    return this.http.post(serviceEndPoint, { ...param });
  }
  /*Api for offline
  */
  goOffLine() {
    const serviceEndPoint = `${this.url}/go-offline`;
    return this.http.get(serviceEndPoint);
  }

  /*
  * Not Used
  */
  readNodeValue(param: { deviceId: string, nodeId: string, project: string }) {
    const endpoint = `${this.url}/read-value`;
    return this.http.post(endpoint, param);
  }

  // ---> change eventName key to more generic name
  readMultipleNodeValue(param: { deviceId: string, nodeList: { eventName: string, nodeId: string }[] }) {
    const endpoint = `${this.url}/read-multipleNodeValue`;
    return this.http.post(endpoint, param);
  }
  /*Api for deleting opc connection
  */
  deleteOpcConnection(param: ConnectionRequestPayload) {
    const endpoint = `${this.url}/disconnect`;
    return this.http.post(endpoint, param);
  }
  /*Get error data from server
  */
  getErrorDataFromServer() {
    const io = this.facadeService.socketService.getIo();
    let uniqueErrorList: Notification[] = [];

    io.on(IoEvents.ERROR_EXCEPTION_HANDLING, (errOj: Notification) => {
      uniqueErrorList.push(errOj);
      this.facadeService.commonService.updateExceptionDataToUI(uniqueErrorList);
    });

    io.on(IoEvents.EMPTY_EXCEPTION_QUEUE, () => {
      uniqueErrorList = [];
    });

    io.on(IoEvents.Server_Crash_Event, _error => {
      this.facadeService.errorHandleService.handleServerCrashError();
    });

    io.on(IoEvents.INVALID_SECURITY_POLICY_EVENT, msg => {
      this.facadeService.errorHandleService.handleInvalidSecurityPolicyNotification(msg);
    });

    io.on(IoEvents.CERTIFICATE_VALIDATION_EVENT, err => {
      this.facadeService.errorHandleService.handleCertificateValidationError(err);
    });
  }
  /*Get upload node-set files update
  */
  getUploadNodeSetFilesUpdate(noOfDevices: number) {
    const io = this.facadeService.socketService.getIo();
    let loaderDetails = {
      counter: 0,
      totalNoOfDevices: 0,
      errorCount: 0
    };
    io.on(IoEvents.BROWSE_DEVICE_COUNT, response => {
      // using promise in uploading files in BE,order is not preserved and
      // counter is manually added for each emit
      // counter can't be more than the total devices
      if (loaderDetails.counter < noOfDevices) {
        loaderDetails = {
          counter: loaderDetails.counter + 1,
          totalNoOfDevices: noOfDevices,
          errorCount: 0
        };
      }
      log(response);
      this.facadeService.commonService.setUploadNodeSetFileStatus(loaderDetails);
    });
  }

  public getUnique(arr, comp) {
    // store the comparison  values in array
    return arr.map(e => e[comp])
      // store the indexes of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the false indexes & return unique objects
      .filter(e => arr[e]).map(e => arr[e]);
  }
  /*Api to save project
  */

  saveProject(payload:ProjectData): Observable<SaveProjectResponse> {
    const endpoint = `${this.url}/saveProject`;
    return this.http.post<SaveProjectResponse>(endpoint, payload);
  }
  /*Api to create project
  */
  createProject(payload) {
    const endpoint = `${this.url}/createProject`;
    return this.http.post(endpoint, payload);
  }
  /*Api to update project
  */
  updateProject(payload) {
    const endpoint = `${this.url}/updateProject`;
    return this.http.post(endpoint, payload);
  }
  /*Api to return global settings related to application
  */
  getLanguage() {
    const endpoint = `${this.url}/settings`;
    return this.http.get(endpoint);
  }
  /*Api to handle idle timeout
  */
  idleTimeout(payload: ProjectData) {
    const endpoint = `${this.url}/handle-idle-time`;
    return this.http.post(endpoint, payload);
  }
  /*Api to save global settings
  */
  setLanguage(payload) {
    const endpoint = `${this.url}/settings`;
    return this.http.post(endpoint, payload);
  }
  /*Api to update global settings
  */
  updateLanguage(payload) {
    const endpoint = `${this.url}/update-settings`;
    return this.http.post(endpoint, payload);
  }
  /*Api to close project
  */
  closeProject(project:string, isRefresh = false) {
    //In the Same API we are clearing the data from activeDeviceManage Map
    let param = `project=${encodeURIComponent(project)}`;
    if (isRefresh) {
      param = `${param}&refresh=${isRefresh}`;
    }
    const serviceEndPoint = `${this.url}/close-project?${param}`;
    return this.http.get(serviceEndPoint);
  }

  /*Api to clear session
  */
  clearSessions() {
    //In the Same API we are clearing the data from activeDeviceManage Map
    const serviceEndPoint = `${this.url}/clear-session`;
    return this.http.post(serviceEndPoint, {});
  }
  /*Api to check if device is connection
  */
  isDeviceConnected(param: { address: string }) {
    const endpoint = `${this.url}/isDeviceConnected`;
    return this.http.post(endpoint, param);
  }
  /*Api to browse devices
  */
  browseDevices(param: { deviceConfigList: Array<DeviceConfig>, project: string }) {
    const endpoint = `${this.url}/browse`;
    return this.http.post(endpoint, param);
  }
  /*Api to remove password protection
  */
  removePasswordProtection(param: { projectName: string, password: string, accessType: string }) {
    const endpoint = `${this.url}/remove-password`;
    return this.http.post(endpoint, param);
  }
  /*Api to delete device
  */
  deleteDevice(param: { project: string, uId: string }) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': ContentType.Json
      }),
      body: param
    };
    const endpoint = `${this.url}/delete-device`;
    return this.http.delete(endpoint, options);
  }
  /*Api to get server diagnostic data
  */
  getServerDiagnosticData(connectionRequestPayload: ConnectionRequestPayload) {
    const endpoint = `${this.url}/server-dignostics`;
    return this.http.post(endpoint, connectionRequestPayload);
  }
  /*Api to upload xml files
  */
  uploadXMLfiles(uploadXMLPayload: FormData) {
    const endpoint = `${this.url}/upload-nodeset-files`;
    const headers = this.generateHeadersForMultiForm();
    return this.http.post(endpoint, uploadXMLPayload, {
      headers: headers
    });
  }
  /*Api to update device details
  */
  updateDeviceDetails(reqPayload) {
    const endpoint = `${this.url}/update-device-details`;
    return this.http.post(endpoint, reqPayload);
  }
  /*Api to change project password
  */
  changeProjectPassword(payload: ChangeProjectPasswordPayload): Observable<PasswordResponse> {
    const endpoint = `${this.url}/change-project-password`;
    return this.http.post<PasswordResponse>(endpoint, payload);
  }

  private generateHeadersForMultiForm() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', ContentType.Multi_Part_Form_Data);
    headers.append('Accept', ContentType.Json);
    return headers;
  }

}



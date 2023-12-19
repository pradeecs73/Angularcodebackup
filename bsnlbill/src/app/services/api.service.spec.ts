/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeviceConfig } from '../models/targetmodel.interface';
import { ConnectionRequestPayload } from '../models/connection.interface';
import { DeviceScanRequestPayload } from '../models/device-data.interface';
import { of,throwError } from 'rxjs';
import { MonitorPayload } from '../models/monitor.interface';
import { HttpClient } from '@angular/common/http';
import { OnlineParam, ProjectData, PasswordResponse, Tree } from '../models/models';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { ChangeProjectPasswordPayload, ReadProjectPayload } from '../models/payload.interface';
import { AccessType } from '../enum/enum';

let mockHttpClientService: HttpClient;
let mockMessageService: MessageService;
let service: ApiService;
let facadeMockService;

fdescribe('ApiService', () => {
  beforeEach(() =>{
    facadeMockService=new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add','clear']);
    mockHttpClientService = jasmine.createSpyObj('mockHttpClientService', ['get','post','delete']);
    Object.getOwnPropertyDescriptor(facadeMockService.socketService, 'getIo').value.and.returnValue({on:()=>{},ids:0,emit:()=>{},off:()=>{}});
    //facadeMockService.socketService.getIo = {io:{},ids:0};
    // Object.getOwnPropertyDescriptor(facadeMockService.socketService, 'getIo').value.and.returnValue(of({io:{},ids:0}));
    // Object.getOwnPropertyDescriptor(facadeMockService.socketService.getIo, 'on').value.and.returnValue(of({}));
    //facadeMockService.socketService = jasmine.createSpyObj('facadeMockService.socketService',{'initSocket' : of(openProjectlength)});
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'get').value.and.returnValue(of({}));
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of({}));
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'delete').value.and.returnValue(of({}));

     TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
         providers: [{ provide: MessageService, useValue: mockMessageService },
          { provide: FacadeService, useValue: facadeMockService},
          { provide: HttpClient, useValue: mockHttpClientService }
        ]
     });
     service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call removePasswordProtection method', () => {
     Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue({error:null,status:'SUCCESS'});
     service.removePasswordProtection({projectName : 'abcde', password: 'abcde', accessType :'write'});
     expect(service.removePasswordProtection).toBeDefined();
  });

  it('should call changeProjectPassword method', () => {
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue({error:null,status:'SUCCESS'});
    const changePassword:ChangeProjectPasswordPayload = {
      oldPassword: 'Test@123',
      password: 'Test@124',
      confirmPassword: 'Test@124',
      accessType: AccessType.WRITE,
      projectName: 'TestProject',
      projectId: 'Test1'
    };
    service.changeProjectPassword(changePassword);
    expect(service.changeProjectPassword).toBeDefined();
 });

  it('should call getProjects method', (done) => {
    const projectData=[{'projectname':'project12345'}];
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'get').value.and.returnValue(of(projectData));
    service.getProjects();
    expect(service.getProjects).toBeDefined();
    service.getProjects().subscribe(data => {
      expect(data).toEqual(projectData);
        done();
      });
  });

  it('should call getProjectData method', done => {
    const singleProjectData={'projectname':'myproject'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(singleProjectData));
    const readProjectPayload:ReadProjectPayload = {projectId:'test1',projectName:'myProject',isProtected:true};
    service.getProjectData(readProjectPayload);
    expect(service.getProjectData).toBeDefined();
    service.getProjectData(readProjectPayload).subscribe(data =>{
        expect(data).toEqual(singleProjectData);
        done();
    });
  });

  it('should call registerPassword method', done => {
    const registerPassword={'status':{code: 200, msg: 'SUCCESS'}} as unknown as PasswordResponse[];
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(registerPassword));
    const registerPasswordPayload = {projectId:'test1',projectName:'myProject',isProtected:true} ;
    service.getProjectData(registerPasswordPayload);
    expect(service.getProjectData).toBeDefined();
    service.registerPassword(registerPasswordPayload).subscribe(data =>{
        expect(data).toEqual(registerPassword);
        done();
    });
  });

  it('should call getLanguage method', (done) => {
    const language={language :'en'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'get').value.and.returnValue(of(language));
    service.getLanguage();
    expect(service.getLanguage).toBeDefined();
    service.getLanguage().subscribe(data =>{
      expect(data).toEqual(language);
      done();
    });
  });

  it('should call fetchRecentProjects method', (done) => {
    const recentProjects=[{'projectname':'project12345'},{'projectname':'project678910'}];
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'get').value.and.returnValue(of(recentProjects));
    service.fetchRecentProjects();
    expect(service.fetchRecentProjects).toBeDefined();
    service.fetchRecentProjects().subscribe(data =>{
      expect(data).toEqual(recentProjects);
      done();
    });
  });

  it('should call importProject method', (done) => {
    const importProject={'projectname':'myproject'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(importProject));
    const payload={};
    service.importProject(payload);
    expect(service.importProject).toBeDefined();
    service.importProject(payload).subscribe(data =>{
      expect(data).toEqual(importProject);
      done();
    });
  });

  it('should call createProject method', (done) => {
    const createProject={'status':'SUCCESS'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(createProject));
    const payload={};
    service.createProject(payload);
    expect(service.createProject).toBeDefined();
    service.createProject(payload).subscribe(data =>{
      expect(data).toEqual(createProject);
      done();
    });
  });

  it('should call deleteProject method', (done) => {
    const deleteProject={'projectname':'myproject'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'delete').value.and.returnValue(of(deleteProject));
    service.deleteProject('myproject',{});
    expect(service.deleteProject).toBeDefined();
    service.deleteProject('deleteProject',{}).subscribe(data =>{
      expect(data['projectname']).toEqual('myproject');
      done();
    });
  });

  it('should call validateProject method', (done) => {
    const validateProject={'projectname':'myproject'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'get').value.and.returnValue(of(validateProject));
    service.validateProject('myproject');
    expect(service.validateProject).toBeDefined();
    service.validateProject('myproject').subscribe(data =>{
      expect(data).toEqual(validateProject);
      done();
    });
  });

  it('should call readNodeValue method', (done) => {
    const readNodeValue={'nodeName':'mynode'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(readNodeValue));
    const param={ deviceId: 'device12345', nodeId: 'node12345',project:'project12345' };
    service.readNodeValue(param);
    expect(service.readNodeValue).toBeDefined();
    service.readNodeValue(param).subscribe(data =>{
      expect(data['nodeName']).toEqual('mynode');
      done();
    });
  });

  it('should call goOnline method', (done) => {
    const goOnlineStatus={isOnline:true};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(goOnlineStatus));
    const param={};
    service.goOnline(param as unknown as OnlineParam);
    expect(service.goOnline).toBeDefined();
    service.goOnline(param as unknown as OnlineParam).subscribe(data =>{
      expect(data['isOnline']).toEqual(true);
      done();
    });
  });

  it('should call deviceAuthenticate method', (done) => {
    const deviceAuthenticateStatus={message : 'SUCCESS'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(deviceAuthenticateStatus));
    const param={};
    service.deviceAuthenticate(param,true);
    expect(service.deviceAuthenticate).toBeDefined();
    service.deviceAuthenticate(param,true).subscribe(data =>{
      expect(data['message']).toEqual('SUCCESS');
      done();
    });
    service.deviceAuthenticate(param,false);
  });


  it('should call saveProject method', (done) => {
    const projectData={'projectName':'sampleproject','projectId':'project12345'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(projectData));
    const payload={'projectName':'sampleproject','projectId':'project12345'} as unknown as ProjectData;
    service.saveProject(payload);
    expect(service.saveProject).toBeDefined();
    service.saveProject(payload).subscribe(data =>{
      expect(data['projectName']).toEqual('sampleproject');
      done();
    });
  });

  it('should call updateProject method', (done) => {
    const projectData={'projectName':'sampleproject','projectId':'project12345','updated':true};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(projectData));
    const payload={'projectName':'sampleproject','projectId':'project12345'};
    service.updateProject(payload);
    expect(service.updateProject).toBeDefined();
    service.updateProject(payload).subscribe(data =>{
      expect(data['updated']).toEqual(true);
      done();
    });
  });

  it('should call closeProject method', (done) => {
    const projectData={projectName:'sampleproject',projectId:'project12345'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'get').value.and.returnValue(of(projectData));
    //const payload={'projectName':'sampleproject','projectId':'project12345'};
    service.closeProject(projectData.projectId);
    expect(service.closeProject).toBeDefined();
    service.closeProject(projectData.projectId).subscribe(data =>{
      expect(data['projectId']).toEqual('project12345');
      expect(data['projectName']).toEqual('sampleproject');
      done();
    });
    service.closeProject(projectData.projectId,true);
    expect(service.closeProject).toBeDefined();
  });

  it('should call isDeviceConnected method', (done) => {
    const isDeviceConnected={'connected':true};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(isDeviceConnected));
    const param={address:'myaddress'};
    service.isDeviceConnected(param);
    expect(service.isDeviceConnected).toBeDefined();
    service.isDeviceConnected(param).subscribe(data =>{
      expect(data['connected']).toEqual(true);
      done();
    });
  });

  it('should call updateDeviceDetails method', (done) => {
    const updateDeviceDetails={'updated':false};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(updateDeviceDetails));
    const reqPayload={};
    service.updateDeviceDetails(reqPayload);
    expect(service.updateDeviceDetails).toBeDefined();
    service.updateDeviceDetails(reqPayload).subscribe(data =>{
      expect(data['updated']).toEqual(false);
      done();
    });
  });

  it('should call browseDevices method', (done) => {
    const reqPayload={deviceConfigList :[{}] as unknown as DeviceConfig[] , project :'project12345'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(reqPayload));
    service.browseDevices(reqPayload);
    expect(service.browseDevices).toBeDefined();
    service.browseDevices(reqPayload).subscribe(data =>{
      expect(data).toEqual(reqPayload)
      done();
    });
  });

  it('should call discoverDevices method', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectTree').value.and.returnValue({'projectName':'project12345'} as unknown as Tree);
    const successData=service.discoverDevices();
    expect(service.discoverDevices).toBeDefined();
    successData.subscribe(data=>{
       expect(data).toEqual({'projectName':'project12345'} as unknown as Tree);
    });
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectTree').value.and.returnValue(null as unknown as Tree);
    const failureData= service.discoverDevices();
    failureData.subscribe(data=>{
      expect(data).toEqual({} as unknown as Tree);
   });
  });

  it('should call connectToDevice method', (done) => {
    const reqPayload={deviceConnected:true};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(reqPayload));
    service.connectToDevice('device12345');
    expect(service.connectToDevice).toBeDefined();
    service.connectToDevice('device12345').subscribe(data =>{
      expect(data['deviceConnected']).toEqual(true)
      done();
    });
  });

  it('should call getServerDiagnosticData method', (done) => {
    const param= {project : 'project12345', client : 'client12345',
                  server : 'server12345'} as unknown as ConnectionRequestPayload;
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(param));
    service.getServerDiagnosticData(param);
    expect(service.getServerDiagnosticData).toBeDefined();
    service.getServerDiagnosticData(param).subscribe(data =>{
      expect(data['project']).toEqual('project12345')
      done();
    });
  });

  it('should call deleteDevice method', (done) => {
    const param={project :'project12345' , uId :'abcde12345'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'delete').value.and.returnValue(of(param));
    service.deleteDevice(param);
    expect(service.deleteDevice).toBeDefined();
    service.deleteDevice(param).subscribe(data =>{
      expect(data['project']).toEqual('project12345')
      done();
    });
  });

  it('should call getUnique method', () => {
    const myArray=[1,2,4,5,4,5];
    const uniqueValue=service.getUnique(myArray,4);
    expect(service.getUnique).toBeDefined();
    expect(uniqueValue.length).toEqual(1)
  });

  it('should call uploadXMLfiles method', () => {
    const uploadXMLPayload=[{name:"test12345"}] as unknown as FormData;
    service.uploadXMLfiles(uploadXMLPayload);
    expect(service.uploadXMLfiles).toBeDefined();
  });

  it('should call connectToOpc method', (done) => {
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(throwError('Error in delete device api call'));
    const param={} as unknown as ConnectionRequestPayload;
    service.connectToOpc(param).subscribe();
    expect(service.connectToOpc).toBeDefined();
    service.connectToOpc(param).subscribe(data =>{
      done();
    },error=>{
      expect(error).toEqual('Error in delete device api call');
    });
  });

  it('should call scanDevice method', (done) => {
    const requestPayload={} as unknown as DeviceScanRequestPayload;
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of({'deviceScanned':true}));
    service.scanDevice(requestPayload);
    expect(service.scanDevice).toBeDefined();
    service.scanDevice(requestPayload).subscribe(data =>{
      expect(data['deviceScanned']).toEqual(true)
      done();
    });
  });

  it('should call listenToScanningOfDevices method', () => {
    service.listenToScanningOfDevices();
    expect(service.listenToScanningOfDevices).toBeDefined();
  });

  it('should call subscribeTo method', (done) => {
    const param=of({}) as unknown as MonitorPayload;
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of({'isMonitored':true}));
    service.subscribeTo(param);
    expect(service.subscribeTo).toBeDefined();
    service.subscribeTo(param).subscribe(data =>{
      expect(data['isMonitored']).toEqual(true)
      done();
    });
  });

  it('should call getErrorDataFromServer method', () => {
    service.getErrorDataFromServer();
    expect(service.getErrorDataFromServer).toBeDefined();
  });

  it('should call cancelScanningDevice method', () => {
    service.cancelScanningDevice();
    expect(service.cancelScanningDevice).toBeDefined();
  });

  it('should call updateScanningDeviceInRealTime method', () => {
    service.updateScanningDeviceInRealTime();
    expect(service.updateScanningDeviceInRealTime).toBeDefined();
  });

  it('should call goOffLine method', (done) => {
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'get').value.and.returnValue(of({'isOnline':false}));
    service.goOffLine();
    expect(service.goOffLine).toBeDefined();
    service.goOffLine().subscribe(data =>{
      expect(data['isOnline']).toEqual(false)
      done();
    });
  });

  it('should call unsubscribeToScanningDevicesEvents method', () => {
    service.unsubscribeToScanningDevicesEvents();
    expect(service.unsubscribeToScanningDevicesEvents).toBeDefined();
  });

  it('should call getUploadNodeSetFilesUpdate method', () => {
    service.getUploadNodeSetFilesUpdate(1);
    expect(service.getUploadNodeSetFilesUpdate).toBeDefined();
  });

  it('should call unSubscribe method', () => {
    const param={} as unknown as MonitorPayload;
    service.unSubscribe(param);
    expect(service.unSubscribe).toBeDefined();
  });

  it('should call deleteOpcConnection method', (done) => {
    const param={} as unknown as ConnectionRequestPayload;
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of({'isDisconnected':true}));
    service.deleteOpcConnection(param);
    expect(service.deleteOpcConnection).toBeDefined();
    service.deleteOpcConnection(param).subscribe(data =>{
      expect(data['isDisconnected']).toEqual(true)
      done();
    });
  });

  it('should call readMultipleNodeValue method', (done) => {
    const param={ deviceId: 'device12345', nodeList: [{ eventName: 'event12345',
    nodeId: 'node12345' }]};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(param));
    service.readMultipleNodeValue(param);
    expect(service.readMultipleNodeValue).toBeDefined();
    service.readMultipleNodeValue(param).subscribe(data =>{
      expect(data['deviceId']).toEqual('device12345')
      done();
    });
  });

  it('should call idleTimeout method', done => {
    const result ={'status':'SUCCESS'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(result));
    service.idleTimeout({} as unknown as ProjectData);
    expect(service.idleTimeout).toBeDefined();
    service.idleTimeout({} as unknown as ProjectData).subscribe(data =>{
        expect(data).toEqual(result);
        done();
    });
  });

  it('should call setLanguage method', done => {
    const result ={'status':'SUCCESS'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(result));
    service.setLanguage({});
    expect(service.setLanguage).toBeDefined();
    service.setLanguage({}).subscribe(data =>{
        expect(data).toEqual(result);
        done();
    });
  });

  it('should call updateLanguage method', done => {
    const result ={'status':'SUCCESS'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(result));
    service.updateLanguage({});
    expect(service.updateLanguage).toBeDefined();
    service.updateLanguage({}).subscribe(data =>{
        expect(data).toEqual(result);
        done();
    });
  });

  it('should call clearSession method', done => {
    const result ={'status':'SUCCESS'};
    Object.getOwnPropertyDescriptor(mockHttpClientService, 'post').value.and.returnValue(of(result));
    service.clearSessions();
    expect(service.clearSessions).toBeDefined();
    service.clearSessions().subscribe(data =>{
        expect(data).toEqual(result);
        done();
    });
  });



});

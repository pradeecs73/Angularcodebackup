import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { DeviceAuthentication, ResponseStatusCode } from 'src/app/enum/enum';
import { Project, ProjectData } from 'src/app/models/models';
import { FacadeMockService } from 'src/app/livelink-editor/services/facade.mock.service';
import { FacadeService } from 'src/app/livelink-editor/services/facade.service';
import { TranslateModule } from '@ngx-translate/core';

import { DeviceAuthDialogComponent } from './device-auth-dialog.component';
const project = <Project>{"date":"4","name":"firstProj","comment":"projectComment" ,"author":"projectauthor","id" : 'abcde',"isProtected":true};
const projectData = <ProjectData>{project : project, tree:null,editor:null ,scanSettings:null};
const deviceDetailsSubject = new Subject<any>();
let obj = {authenticatedCount: 0,title: '',device : {deviceId :'123'}, index : 1,noOfProtectedDevices:2,multipleDevices:true};
fdescribe('DeviceAuthDialogComponent', () => {
  let component: DeviceAuthDialogComponent;
  let fixture: ComponentFixture<DeviceAuthDialogComponent>;
  let facadeMockService;

  beforeEach(async () => {
    facadeMockService=new FacadeMockService();
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(projectData);
    facadeMockService.deviceService.$deviceDetails  = deviceDetailsSubject.asObservable();
    deviceDetailsSubject.next(obj);
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ],
      declarations: [ DeviceAuthDialogComponent ],
      providers : [{ provide: FacadeService, useValue: facadeMockService}]
    })
    .compileComponents();
    fixture = TestBed.createComponent(DeviceAuthDialogComponent);
    component = fixture.componentInstance;
    component.deviceDetails = obj;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cancel',()=>{
    spyOn(component.hide, 'emit');
    component.cancel();
    expect(component.hide.emit).toHaveBeenCalled();
  });

  it('login for protected device is successful',()=>{
    spyOn(component.onLoginEvent, 'emit');
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'deviceAuthenticate').value.and.returnValue(of({message : 'SUCCESS'}));
    component.loginAuth();
    expect(component.onLoginEvent.emit).toHaveBeenCalled();
  });

  it('skipDeviceEmitter',()=>{
    spyOn(component.skipDeviceEvent, 'emit');
    component.skipDeviceEmitter();
    expect(component.skipDeviceEvent.emit).toHaveBeenCalled();
  });

  it('login for protected device fails',()=>{
    let err = {
      error :{
        error: {
          errorType: ResponseStatusCode.Invalid_Device_Credentials
        }
      }
    }
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'deviceAuthenticate'
    ).value.and.returnValue(throwError(err));
    component.loginAuth();
    expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();
  });

  it('device authentication during establish connection failure,go online failure',()=>{
    obj.multipleDevices = false;
    deviceDetailsSubject.next(obj);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'deviceAuthenticate').value.and.returnValue(of({message : 'SUCCESS'}));
    component.loginAuth();
    expect(facadeMockService.apiService.deviceAuthenticate).toHaveBeenCalled();
  });

  it('device authentication during add selected device to list and browse device failure',()=>{
    obj.title = DeviceAuthentication.ADD_SELECTED_DEVICE_TO_LIST;
    deviceDetailsSubject.next(obj);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'deviceAuthenticate').value.and.returnValue(of({message : 'SUCCESS'}));
    component.loginAuth();
    expect(facadeMockService.apiService.deviceAuthenticate).toHaveBeenCalled();
  });

  it('device authentication during add selected device to list and browse device failure',()=>{
    obj.title = DeviceAuthentication.BROWSE_DEVICE;
    deviceDetailsSubject.next(obj);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'deviceAuthenticate').value.and.returnValue(of({message : 'SUCCESS'}));
    component.loginAuth();
    expect(facadeMockService.apiService.deviceAuthenticate).toHaveBeenCalled();
  });

});

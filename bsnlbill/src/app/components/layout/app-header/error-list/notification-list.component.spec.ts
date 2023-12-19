/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Notification } from '../../../../models/notification.interface';
import { FacadeMockService } from '../../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../../livelink-editor/services/facade.service';
import { SocketService } from '../../../../services/socket.service';
import { NotificationPipe } from '../../../../shared/pipes/notification.pipe';
import { NotificationType } from './../../../../enum/enum';
import { NotificationMsgListComponent } from './notification-list.component';

let mockSocketService: SocketService;
let mockHttpClientService: HttpClient;

fdescribe('NotificationListComponent', () => {
  let component: NotificationMsgListComponent;
  let fixture: ComponentFixture<NotificationMsgListComponent>;
  var errorDataList: { type: string, message: string, code: string; }[] = [];
  var count: number = 0;
  let facadeMockService;

  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();

    facadeMockService.commonService.errorCountStatusObs = of(count);
    mockSocketService = jasmine.createSpyObj(['initSocket']);
    TestBed.configureTestingModule({
      declarations: [NotificationMsgListComponent, NotificationPipe],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        { provide: SocketService, useValue: mockSocketService },
        { provide: FacadeService, useValue: facadeMockService },
        { provide: HttpClient, useValue: mockHttpClientService },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationMsgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get error data', () => {
    component.ngOnInit();
    expect(component.notificationMsgList).toBeDefined();
  });

  it('should call notificationType', () => {
    component.notificationType;
    expect(component.notificationType).not.toBeDefined();
  });

  it('should call readMessage method', () => {
    spyOn(component, 'getUnReadErrorMessageCount');
    component.notificationMsgList = [{ isRead: true }] as unknown as Notification[];
    component.readMessage(0);
    expect(component.readMessage).toBeDefined();
  });

  it('should call markAllRead method', () => {
    spyOn(component, 'getUnReadErrorMessageCount');
    facadeMockService.commonService.notificationType = 'info';
    component.notificationMsgList = [{ type: 'info', isRead: true }] as unknown as Notification[];
    component.markAllRead();
    expect(component.markAllRead).toBeDefined();
  });

  it('should call markAllRead method', () => {
    spyOn(component, 'getUnReadErrorMessageCount');
    facadeMockService.commonService.notificationType = 'info';
    component.notificationMsgList = [{ type: 'info', isRead: true }] as unknown as Notification[];
    component.markAllRead();
    expect(component.markAllRead).toBeDefined();
  });

  it('should call getUnReadErrorMessageCount method', () => {
    component.notificationMsgList = [{ type: NotificationType.INFO, isRead: false }, { type: NotificationType.WARNING, isRead: false },
    { type: NotificationType.ERROR, isRead: false }] as unknown as Notification[];
    component.getUnReadErrorMessageCount();
    expect(component.getUnReadErrorMessageCount).toBeDefined();
    expect(facadeMockService.commonService.noOfInfoMsgs).toEqual(1);
    expect(facadeMockService.commonService.noOfWarningMsgs).toEqual(1);
    expect(facadeMockService.commonService.noOfErrorMsgs).toEqual(1);
  });

  it('should call clearErrorMessages method', () => {
    component.notificationMsgList = [{ type: NotificationType.INFO, isRead: false }, { type: NotificationType.WARNING, isRead: false },
    { type: NotificationType.ERROR, isRead: false }] as unknown as Notification[];

    component.clearErrorMessages(NotificationType.INFO);
    component.clearErrorMessages(NotificationType.WARNING);
    component.clearErrorMessages(NotificationType.ERROR);
    expect(component.clearErrorMessages).toBeDefined();

  });

  it('should call getUpdatedErrorData method', () => {
    component.updateErrorData('ERROR');
    component.updateErrorData('EXCEPTION');
    component.updateErrorData('EXECUTION_ERROR');
    component.updateErrorData('OTHER');
    expect(component.updateErrorData).toBeDefined();
  });

  it('should call showArrow method', () => {
    const error = { message: { content: {}, params: {} } };
    const myarray = Array.from(Array(200).keys());
    Object.getOwnPropertyDescriptor(facadeMockService.translateService, 'instant').value.and.returnValue([]);
    component.showArrow(error);
    expect(component.showArrow).toBeDefined();
    Object.getOwnPropertyDescriptor(facadeMockService.translateService, 'instant').value.and.returnValue(myarray);
    component.showArrow(error);
  });

  it('should call updateErrorList method', () => {
    const myarray = Array.from(Array(200).keys());
    Object.getOwnPropertyDescriptor(facadeMockService.translateService, 'instant').value.and.returnValue(myarray);
    const errorData = [{ type: NotificationType.INFO, isRead: false, message: {}, code: '12345' }, { type: NotificationType.WARNING, isRead: false, message: {}, code: '12345' },
    { type: NotificationType.ERROR, isRead: false, message: {}, code: '12345' }] as unknown as Notification[];
    spyOn(component, 'getUpdatedErrorData').and.returnValues(errorData);
    component.updateErrorData('OTHER');
    expect(component.updateErrorData).toBeDefined();
    Object.getOwnPropertyDescriptor(facadeMockService.translateService, 'instant').value.and.returnValue([]);
    fixture.detectChanges();
    component.updateErrorData('OTHER');
  });

  it('should call updateErrorList method for else', () => {
    const myarray = Array.from(Array(200).keys());
    Object.getOwnPropertyDescriptor(facadeMockService.translateService, 'instant').value.and.returnValue([]);
    const errorData = [{ type: NotificationType.INFO, isRead: false, message: {}, code: '12345' }, { type: NotificationType.WARNING, isRead: false, message: {}, code: '12345' },
    { type: NotificationType.ERROR, isRead: false, message: {}, code: '12345' }] as unknown as Notification[];
    spyOn(component, 'getUpdatedErrorData').and.returnValues(errorData);
    component.updateErrorData('OTHER');
    expect(component.updateErrorData).toBeDefined();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'getErrorsList');
    facadeMockService.commonService.showErrorIcon = true;
    facadeMockService.commonService.allErrorCodeList = [];
    component.ngOnInit();
    expect(component.updateErrorData).toBeDefined();
    fixture.detectChanges();
    facadeMockService.commonService.allErrorCodeList = [{}];
    component.ngOnInit();
    facadeMockService.commonService.allErrorCodeList = [];
    facadeMockService.commonService.allGenericNotificationList = [{}];
    component.ngOnInit();
    facadeMockService.commonService.allErrorCodeList = [];
    facadeMockService.commonService.allGenericNotificationList = [];
    facadeMockService.notificationService.notificationList = [{}];
    component.ngOnInit();
  });




  // it('should get the valid error data', () => {
  //   mockCommonService.showErrorIcon = true;
  //  // mockCommonService.dialogTitle = 'test';
  //   component.ngOnInit();
  //   expect(component.errorList[0].message).toBe('An error has occured during test');
  //   expect(component.errorList[0].type).toBe('Error');
  //   expect(component.errorList[0].code).toBe('');
  // });

  // it('should get the unknown-error data', () => {
  //   mockCommonService.showErrorIcon = true;

  //   component.ngOnInit();
  //   expect(component.errorList[0].message).toBe('An unknown error has occured during the executed operation');
  //   expect(component.errorList[0].type).toBe('Unknown Error');
  //   expect(component.errorList[0].code).toBe('');
  // });
});

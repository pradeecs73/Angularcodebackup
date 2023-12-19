/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { TestBed } from '@angular/core/testing';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { NotifcationService } from './notifcation.service';

fdescribe('notification service', () => {
  let service;
  let facadeMockService = new FacadeMockService();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService },
      ]
    });
    service = TestBed.inject(NotifcationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('pushNotificationToPopup', () => {
    service.pushNotificationToPopup({} as Notification);
    expect(facadeMockService.commonService.setErrorIcon).toHaveBeenCalled();
    expect(facadeMockService.commonService.changeErrorCountStatus).toHaveBeenCalled();
  });

  it('clearNotifications', () => {
    service.clearNotifications([] as Notification[]);
    expect(service.notificationList.length).toEqual(0);
  });
});

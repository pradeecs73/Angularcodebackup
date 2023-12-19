/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { Project, ProjectData } from '../models/models';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { SaveProjectService } from './save-project.service';

let service: SaveProjectService;
let messageService: MessageService;
let mockHttpClientService: HttpClient;
let mockStore: Store;
const uniqid = require('uniqid');
const project = <Project>{
  date: '4',
  name: 'firstProj',
  comment: 'projectComment',
  author: 'projectauthor',
  id: uniqid.time(),
};
const projectData = <ProjectData>{
  project: project,
  tree: { devices: [] },
  editor: null,
  scanSettings: null,
};

fdescribe('SaveProjectService', () => {
  const facadeMock = new FacadeMockService();
  beforeEach(() => {
    messageService = jasmine.createSpyObj('MessageService', [
      'clear',
      'add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpClientService },
        { provide: MessageService, useValue: messageService },
        { provide: Store, useValue: mockStore },
        { provide: FacadeService, useValue: facadeMock },
      ],
      imports: [TranslateModule.forRoot({})]
    }),
      service = TestBed.inject(SaveProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('save project', () => {
    const res = {
      data: {
        code: 200,
        msg: 'The project has been saved'
      },
      error: null,
      status: "Success"
    };
    Object.getOwnPropertyDescriptor(facadeMock.apiService, 'saveProject').value.and.returnValue(of(res));
    Object.getOwnPropertyDescriptor(facadeMock.apiService, 'clearSessions').value.and.returnValue(of(res));
    service.saveProject();
    expect(facadeMock.commonService.changeSaveStatus).toHaveBeenCalled();
  });

  it('save project with error', () => {
    Object.getOwnPropertyDescriptor(facadeMock.apiService, 'saveProject').value.and.returnValue(throwError('Error in saveProject api call'));
    service.saveProject();
    expect(facadeMock.commonService.changeSaveStatus).toHaveBeenCalled();
  });

  it('setProjectData', () => {
    service.setProjectData(projectData);
    expect(facadeMock.dataService.setDefaultState).toHaveBeenCalled();
    expect(facadeMock.dataService.setProjectData).toHaveBeenCalled();
    expect(facadeMock.deviceStoreService.fetchDeviceTreeNodes).toHaveBeenCalled();
    expect(facadeMock.commonService.isExistingProjectLoading).toBe(true);
  });

  it('cleanProjectData', () => {
    service.cleanProjectData();
    expect(facadeMock.dataService.clearProjectData).toHaveBeenCalled();
    expect(facadeMock.deviceStoreService.fetchDeviceTreeNodes).toHaveBeenCalled();
    expect(facadeMock.fillingLineService.clearFillingLine).toHaveBeenCalled();
  });

  it('change edit state', () => {
    service.changeEditState(project);
    expect(service.openedProject).toBe(project);
  });

  it('changeSaveASState', () => {
    service.changeSaveASState(project);
  });

  it('resetSaveServiceData', () => {
    service.resetSaveServiceData();
    expect(service.devices).toEqual([]);
  });

  it('remove Devices with  opened project', () => {
    const res = {
      data: {
        code: 200,
        msg: 'Successful'
      },
      error: null,
      status: "SUCCESS"
    };
    const resOffline = {
      data: {
        code: 200,
        msg: 'killed all the existing connections'
      },
      error: null,
      status: "SUCCESS"
    };
    Object.getOwnPropertyDescriptor(facadeMock.apiService, 'closeProject').value.and.returnValue(of(res));
    Object.getOwnPropertyDescriptor(facadeMock.apiService, 'goOffLine').value.and.returnValue(of(resOffline));
    Object.getOwnPropertyDescriptor(facadeMock.apiService, 'clearSessions').value.and.returnValue(of());
    service.openedProject = project;
    const event = new Event('unload');
    const result = service.clearOnUnload(event);
    expect(result).toBeDefined();
  });

  it('remove Devices with no opened project', () => {
    const res = {
      data: {
        code: 200,
        msg: 'Successful'
      },
      error: null,
      status: "SUCCESS"
    };
    const resOffline = {
      data: {
        code: 200,
        msg: 'killed all the existing connections'
      },
      error: null,
      status: "SUCCESS"
    };
    Object.getOwnPropertyDescriptor(facadeMock.apiService, 'closeProject').value.and.returnValue(of(res));
    Object.getOwnPropertyDescriptor(facadeMock.apiService, 'goOffLine').value.and.returnValue(of(resOffline));
    Object.getOwnPropertyDescriptor(facadeMock.apiService, 'clearSessions').value.and.returnValue(of());
    service.openedProject = null;
    const event = new Event('unload');
    const result = service.clearOnUnload(event);
    expect(result).toBeDefined();
  });


});

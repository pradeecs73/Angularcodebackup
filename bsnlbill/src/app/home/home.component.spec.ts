/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { LiveLinkEditorGuardService } from '../services/livelink-guard.service';
import { HomeComponent } from './home.component';
import { NgIdleModule } from '@ng-idle/core';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DisableIfUnauthorizedDirective } from '../directives/access-check/access-check.directive';
import { ExpireSession, HTTPStatus, LocalStorageKeys, Numeric, OperationMode, ResponseStatusCode } from '../enum/enum';
import { Project, ProjectData } from '../models/models';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { EllipsisPipe } from '../shared/pipes/ellipsis.pipe';
import { FormatDatePipe } from '../shared/pipes/formatDate.pipe';
import { ProjectTableDetails } from '../utility/constant';


let component: HomeComponent;
let fixture: ComponentFixture<HomeComponent>;
let mockStore: Store;
let mockLiveLinkGuardService: LiveLinkEditorGuardService;
//let mockConfirmationService : ConfirmationService;
let messageService: MessageService;

const uniqid = require('uniqid');
let projectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(), 'isSelected': true, 'isProtected': true },
<Project>{ 'date': '3', 'name': 'secondProj', 'id': uniqid.time(), 'isSelected': false, 'isProtected': false }
];
const projectListCopy = JSON.parse(JSON.stringify(projectList));
const editedProject = { ...projectList[0], name: 'firstProj edit' };
const saveProject = <Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time() };
const openedProjectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time() }];
const openProjectlength = 1;
let response = {
  'data': {
    'project': <Project>{ 'id': 'l6j2xslg', 'name': 'tset', 'comment': '', 'author': '', 'created': '8/7/2022, 2:15:33 PM', 'modified': '8/7/2022, 2:15:33 PM', 'modifiedby': '' },
    'tree': { 'devices': [{ name: 'abcde' }, { name: '' }] },
    'zoomSettings':'0.75',
    'userDetails' : { 'haveReadAccess' : true}
  },
  'status': 'SUCCESS',
  'error': null
};
const mode = { mode: 'create' };
const project = <Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(),'modified':'30/2/2020' };
const projectData = <ProjectData>{ project: project, tree: { devices: [] }, editor: null, scanSettings: null };
let facadeMockService;
let event = {
  delta: 10,
  element: {
    innerText: ProjectTableDetails.projectName
  }
};

fdescribe('HomeComponent on Page Load', () => {
  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();
    facadeMockService.saveService.editProjectStateChange = of(editedProject);
    facadeMockService.saveService.closeLastOpenedProjectValue = of();
    let response = 'SUCCESS';
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'closeProject').value.and.returnValue(of(response));
    const projectListMock = { data: [{ 'id': '12345', 'modified': new Date() }] } as unknown as Project[];
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'fetchRecentProjects').value.and.returnValue(of(projectListMock));
    facadeMockService.saveService.projectList = projectList;
    facadeMockService.dataService.projectData = projectData;
    facadeMockService.saveService.openedProject = <Project>{};
    facadeMockService.saveService.saveasProjectStateChange = of(saveProject);
    facadeMockService.saveService.$refreshProjectList = of();
    facadeMockService.commonService.startIdleTimer = 0;
    facadeMockService.saveService.closeLastOpenedProjectValue = of(true);
    facadeMockService.commonService.sessionIdleTimeout = 0;
    mockLiveLinkGuardService = jasmine.createSpyObj('mockLiveLinkGuardService', { 'changeLiveLinkRouteActiveteState': of(openProjectlength) });
    Object.getOwnPropertyDescriptor(facadeMockService.socketService, 'getIo').value.and.returnValue({ on: () => { }, ids: 0 });
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({}),
        NgIdleModule.forRoot()
      ],
      declarations: [HomeComponent, EllipsisPipe, FormatDatePipe, DisableIfUnauthorizedDirective],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: FacadeService, useValue: facadeMockService },
        { provide: LiveLinkEditorGuardService, useValue: mockLiveLinkGuardService },
        { provide: MessageService, useValue: messageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    spyOn(component, 'startTimer');
    component.ellipsisValue = {
      'projectName': Numeric.FIFTEEN,
      'author': Numeric.FIFTEEN,
      'creationTime': Numeric.TWENTY,
      'lastChanged': Numeric.TWENTY,
      'lastModifiedBy': Numeric.FIFTEEN,
      'comment': Numeric.FIFTEEN
    };
    fixture.detectChanges();
  });

  afterEach(() => {
    projectList = JSON.parse(JSON.stringify(projectListCopy));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call fetchRecentProjects list api to get project list', (() => {
    localStorage.setItem(LocalStorageKeys.windows, '0');
    localStorage.setItem('applicationTimeStamp', `${new Date()}`);
    component.openedProject = { 'id': '12345', 'modified': new Date() } as unknown as Project;
    const projectListMock = { data: [{ 'id': '12345', 'modified': new Date() }] } as unknown as Project[];

    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'fetchRecentProjects').value.and.returnValue(of(projectListMock));
    fixture.detectChanges();
    component.fetchProjectList({ 'id': '12345', 'modified': new Date() });
    expect(component.deselectProjects).toBeDefined();
  }));

  it('Fetchprojectlist api returns an error', (() => {
    spyOn(window.console, 'log').and.callThrough();
    const responseObj = Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'fetchRecentProjects'
    ).value.and.returnValue(throwError('Error in fetchRecentProjects api call'));
    component.fetchProjectList();
    fixture.detectChanges();
    expect(window.console.log).toHaveBeenCalled();
  }));

  it('import project function call', () => {
    component.importProject();
    expect(component.importprojectModalDisplay).toBe(true);
  });

  it('close project function call', () => {
    component.close();
    expect(component.importprojectModalDisplay).toBe(false);
  });

  it('createProject', () => {
    component.createProject();
    expect(component.createprojectModalDisplay).toEqual(true);
    expect(component.createProjectInput).toEqual(mode);
  });

  it('dont open the project if the disabled button is true', () => {
    component.disabled = true;
    var result = component.openProject();
    expect(result).not.toBeDefined();
  });

  it('check to avoid the password popup if the same project is already opened', () => {
    component.openedProject = { 'id': '12345', 'name': 'project1','modified': new Date() } as unknown as Project;
    component.selectedProject = component.openedProject;
    spyOn(component, 'fetchProjectDetail');
    var result = component.openProject();
    expect(result).not.toBeDefined();
  });

  it('call fetch project detail if isCreate value is false', () => {
    spyOn(component, 'saveOldProject');
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
      component.openedProject = { 'id': '12345', 'name': 'project1','modified': new Date() } as unknown as Project;
      args.optionalCallBack();
    });
    component.openedProject = { 'id': '12345', 'name': 'project1' ,'modified': new Date()} as unknown as Project;
    component.selectedProject = { 'id': '678910' } as unknown as Project;
    component.projectList = [{ 'id': '12345' ,'modified': new Date()}] as unknown as Project[];
    const projectDataMock = { 'project': { 'modified': new Date() } };
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectDataAsSaveJson').value.and.returnValue(projectDataMock);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'getProjectData').value.and.returnValue(of(response));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'saveProject').value.and.returnValue(of({ 'id': '12345' }));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'closeProject').value.and.returnValue(of({}));
    const projectListMock = { data: [{ 'id': '678910', 'modified': new Date(), isSelected: true }] } as unknown as Project[];
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'fetchRecentProjects').value.and.returnValue(of(projectListMock));
    component.openProject(false);
    spyOn(component, 'fetchProjectDetail');
    component.fetchProjectDetail('id', 'firstProj', true);
    expect(component.fetchProjectDetail).toHaveBeenCalledWith('id', 'firstProj', true);
  });


  it('should call error call back method of fetchRecentProjects', () => {
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      component.openedProject = { 'id': '12345', 'name': 'project1','modified': new Date() } as unknown as Project;
      args.optionalCallBack();
    });
    component.openedProject = { 'id': '12345', 'name': 'project1','modified': new Date() } as unknown as Project;
    component.selectedProject = { 'id': '678910' } as unknown as Project;
    component.projectList = [{ 'id': '12345','modified': new Date() }] as unknown as Project[];

    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'closeProject').value.and.returnValue(of({}));

    const error = {
      error: {
        error: {
          errorType: 'Fetch_Project_Detail_Error'
        }
      }
    };

    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'fetchRecentProjects').value.and.returnValue(throwError(error));
    component.openProject(false);
  });


  it('call setProjectList when the project list is empty', () => {
    facadeMockService.saveService.projectList = [];
    const spy = spyOn(component, 'fetchProjectList');
    component.setProjectList();
    expect(spy).toHaveBeenCalled();
  });


  it('should initialize the projectList with fetchRecentProjects() of API Service', () => {
    expect(component.projectList).toBeDefined();
    expect(component.projectList[0].name).toEqual('firstProj');
    expect(component.projectList[1].name).toEqual('secondProj');
  });

  it('setSelection() method should select the project', () => {
    const spy = spyOn(component, 'setSelection').and.callThrough();
    component.setSelection(projectList[0]);
    expect(spy).toHaveBeenCalledWith(projectList[0]);

    expect(projectList[0].isSelected).toBeTruthy();
    expect(component.disabled).toBeFalsy();
  });

  it('On Click of Open Project Button openProject() should be called', () => {

    const openProjectBtn = fixture.debugElement.nativeElement.querySelector('.open-project');
    expect(openProjectBtn).toBeDefined();
    const spy = spyOn(component, 'openProject');
    openProjectBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('fetch project details using project name', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'getProjectData').value.and.returnValue(of(response));
    fixture.detectChanges();
    component.fetchProjectDetail('test1', 'firstProj', true);
    expect(facadeMockService.saveService.setProjectData).toHaveBeenCalled();
  });

  it('fetchProjectDetail api returns an error', waitForAsync(() => {
    spyOn(window.console, 'log').and.callThrough();
    const error = {
      error: {
        error: {
          errorType: 'Authenticate_Project_Failure'
        }
      }
    };
    const responseObj = Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'getProjectData'
    ).value.and.returnValue(throwError(error));
    component.fetchProjectDetail('test1', 'firstProj', true);
    fixture.detectChanges();
    expect(window.console.log).toHaveBeenCalled();

    const error1 = {
      error: {
        error: {
          errorType: ResponseStatusCode.Session_Already_Opend_With_Project
        }
      }
    };
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'getProjectData'
    ).value.and.returnValue(throwError(error1));
    component.fetchProjectDetail('test1', 'firstProj', true);
    fixture.detectChanges();
    expect(window.console.log).toHaveBeenCalled();
  }));

  it('dont execute fetchproject detail function  if name is not defined', () => {
    var result = component.fetchProjectDetail(null, null, true);
    expect(result).not.toBeDefined();
  });

  it('onCancel',()=>{
    component.openedProject = { 'id': '12345', 'name': 'project1','modified': new Date() } as unknown as Project;
    component.projectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': '12345', 'isSelected': true, 'isProtected': true }];
    component.onCancel();
    expect(component.projectList[0].isSelected).toBe(true);
  })

  it('get the project position in project list', () => {
    var result = -1;
    component.projectList = projectListCopy;
    var result = component.getProjectPosition();
    expect(result).toBe(0);
  });

  it('get the project name of the selected project in project list', () => {
    var result = '';
    component.projectList = projectListCopy;
    var result = component.getSelectedProjectName();
    expect(result).toBe('firstProj');
  });

  it('edit the project in the existing project list', () => {
    let projectData = <Project>{ 'date': '4', 'name': 'firstProj123', 'id': uniqid.time() };
    component.openedProject = projectListCopy[0];
    component.projectList = projectListCopy;
    component.edittoExistingProject(projectData);
    expect(component.projectList[0]).toBe(projectData);
  });

  it('on Project closed', () => {
    component.openedProject = project;
    component.onProjectClosed();
    expect(facadeMockService.apiService.closeProject).toHaveBeenCalled();
  });

  it('open protected project', () => {
    component.projectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(), 'isSelected': true, 'isProtected': true }];
    component.disabled = false;
    component.openedProject = { 'id': '12345', 'name': 'projec1' ,'modified': new Date()} as unknown as Project;
    component.selectedProject = { 'id': '12345' ,'modified': new Date()} as unknown as Project;
    component.openProject(false);
    expect(component.openProtectedProjectInput).toEqual({ mode: 'openProtectedProject', projectName: 'firstProj' });
    expect(component.passwordValidationModalDisplay).toEqual(true);
  });

  it('verify the protected project', () => {
    spyOn(component, 'fetchProjectDetail');
    component.projectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(), 'isSelected': true, 'isProtected': true }];
    component.openProtectedProjectInput = { mode: OperationMode.MODE_OPEN_PROTECTED_PROJECT, projectName: 'firstProj' };
    component.verifyProtectedProject({ value: { passwordText: 'abc' } });
    expect(component.fetchProjectDetail).toHaveBeenCalled();
    expect(facadeMockService.saveService.cleanProjectData).toHaveBeenCalled();
  });

  it('addtoExistingProjectList', () => {
    spyOn(component, 'setSelection');
    spyOn(component, 'openProject');
    component.projectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(), 'isSelected': true, 'isProtected': true }];
    component.addtoExistingProjectList(project, true);
    expect(component.projectList.length).toEqual(2);
    expect(component.setSelection).toHaveBeenCalled();
    expect(component.openProject).toHaveBeenCalled();
  });

  it('onProjectClosed', fakeAsync(() => {
    component.openedProject = project;
    const projectListMock = { data: [{ 'id': '12345', 'modified': new Date() }] } as unknown as Project[];
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'fetchRecentProjects').value.and.returnValue(of(projectListMock));
    component.onProjectClosed();
    tick(500);
    fixture.whenStable().then(() => {
      expect(component.openedProject).toEqual(null);
    });
  }));

  it('columnsResized for project name ', () => {
    component.columnsResized(event);
    expect(component.ellipsisValue.projectName).toEqual(Numeric.SIXTEEN);

    event.element.innerText = ProjectTableDetails.author;
    component.columnsResized(event);
    expect(component.ellipsisValue.author).toEqual(Numeric.SIXTEEN);
    expect(component.ellipsisValue.creationTime).toEqual(Numeric.NINETEEN);

    event.element.innerText = ProjectTableDetails.creationTime;
    component.columnsResized(event);
    expect(component.ellipsisValue.creationTime).toEqual(Numeric.TWENTY);
    expect(component.ellipsisValue.lastChanged).toEqual(Numeric.NINETEEN);

    event.delta = -10;
    event.element.innerText = ProjectTableDetails.lastChanged;
    component.columnsResized(event);
    expect(component.ellipsisValue.lastChanged).toEqual(Numeric.EIGHTEEN);
    expect(component.ellipsisValue.lastModifiedBy).toEqual(Numeric.SIXTEEN);

    event.delta = 10;
    event.element.innerText = ProjectTableDetails.lastModifiedBy;
    component.columnsResized(event);
    expect(component.ellipsisValue.lastModifiedBy).toEqual(Numeric.SEVENTEEN);
    expect(component.ellipsisValue.comment).toEqual(Numeric.FOURTEEN);

    event.delta = 10;
    event.element.innerText = '';
    component.columnsResized(event);
  });

  it('formatDate', () => {
    const res = component.formatDate('2/7/2023, 12:18:09 PM');
    expect(res).toEqual('2/7/2023, 12:18 PM');
  });

  it('showWarningPopup',()=>{
    facadeMockService.overlayService.warning.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component['showWarningPopup'](100,'test','test');
    expect(facadeMockService.overlayService.warning).toHaveBeenCalled();
  })

  it('showSessionExpireDetails',()=>{
    spyOn<any>(component,'showWarningPopup');
    component.projectData = {project: { 'id': '12345', 'name': 'project1','modified': new Date() } as unknown as Project} as unknown as ProjectData;
    component['showSessionExpireDetails']({type: ExpireSession.TOKEN,projectId:'12345'},10);
    expect(component['showWarningPopup']).toHaveBeenCalled();
    component['showSessionExpireDetails']({type: ExpireSession.SESSION,projectId:'12345'},10);
    expect(component['showWarningPopup']).toHaveBeenCalled();
  })

  it('openProject',()=>{
    component.disabled = false;
    component.openedProject = {id:'test',name:'abcde'} as unknown as Project;
    component.selectedProject = {id:'test123',name:'abcde'} as unknown as Project;
   spyOn(component,'overlayContentForOpenOrCreateProject').and.returnValue({message:{content:['test']},header:'test',successLabel:'test',optionalLabel:'test',acceptCallBack:()=>{}})
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectDataAsSaveJson').value.and.returnValue(of(projectData));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'saveProject').value.and.returnValue(of({ 'id': '12345' ,'modified': new Date()}));
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component.openProject(false);
    expect(component.overlayContentForOpenOrCreateProject).toHaveBeenCalled();
  })

  it('openProject',()=>{
    component.disabled = false;
    component.openedProject = {id:'test',name:'abcde'} as unknown as Project;
    component.selectedProject = {id:'test123',name:'abcde'} as unknown as Project;
    spyOn(component,'overlayContentForOpenOrCreateProject').and.returnValue({message:{content:['test']},header:'test',successLabel:'test',optionalLabel:'test',acceptCallBack:()=>{}})
    component.disableIfUnauthorizedDirective = {
      hasPermission : ()=>{
        return false
      }
    }
    spyOn(component,'saveOldProject');
    component.openProject(false);
    expect(component.saveOldProject).toHaveBeenCalled();
  })

  it('verifyProtectedProject',()=>{
    spyOn(component,'deleteSelectedProject');
    component.projectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(), 'isSelected': true, 'isProtected': true }];
    component.openProtectedProjectInput = {mode:OperationMode.MODE_DELETE_PROTECTED_PROJECT}
    component.verifyProtectedProject({value: {passwordText:'test'}});
    expect(component.deleteSelectedProject).toHaveBeenCalled();
  })

  it('if all the devices are having device name',()=>{
    response.data.tree.devices[1].name = 'test';
    component.projectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(), 'isSelected': true, 'isProtected': true }];
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'getProjectData').value.and.returnValue(of(response));
    component.openedProject = {id:'test',name:'abcde',isProtected:true} as unknown as Project;
    component.fetchProjectDetail('test1', 'firstProj', true);
    expect(component.openedProject).toBeDefined();
  })

  // it('delete Protected Project',()=>{
  //   component.deleteDisabled = false;
  //   facadeMockService.overlayService.confirm.and.callFake(function (args) {
  //     args.acceptCallBack();
  //   });
  //   spyOn(component, 'getSelectedProjectName').and.returnValue('project1');
  //   component.projectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(), 'isSelected': true, 'isProtected': true }];
  //   component.deleteProject();
  // })

  it('deleteSelectedProject',()=>{
    const deleteProjectResponse = { data: { code: HTTPStatus.SUCCESS } };
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'deleteProject').value.and.returnValue(of(deleteProjectResponse));
    component.deleteSelectedProject('test')
    expect(facadeMockService.apiService.deleteProject).toHaveBeenCalled();
  })

  it('addtoExistingProjectListSaveAs',()=>{
    component.addtoExistingProjectListSaveAs(<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(),'modified':'30/2/2020',isProtected:true });
    expect(component.openProtectedProjectInput).toBeDefined();
  })

});

fdescribe('HomeComponent on Switch View From Editor', () => {

  const projectListWithSelection = projectList;
  projectListWithSelection[0].isSelected = true;
  let facadeMockService;
  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();
    facadeMockService.saveService.projectList = projectListWithSelection;
    facadeMockService.saveService.openedProject = <Project>{ date: '4', name: 'firstProj', id: uniqid.time() };
    facadeMockService.saveService.editProjectStateChange = of(editedProject);
    facadeMockService.saveService.saveasProjectStateChange = of(saveProject);
    facadeMockService.saveService.closeLastOpenedProjectValue = of();
    facadeMockService.saveService.$refreshProjectList = of();
    facadeMockService.commonService.startIdleTimer = 0;
    facadeMockService.commonService.sessionIdleTimeout = 0;
    mockLiveLinkGuardService = jasmine.createSpyObj('mockLiveLinkGuardService', { 'changeLiveLinkRouteActiveteState': of(openProjectlength) });
    Object.getOwnPropertyDescriptor(facadeMockService.socketService, 'getIo').value.and.returnValue({ on: () => { }, ids: 0 });
    TestBed.configureTestingModule({
      declarations: [HomeComponent, EllipsisPipe, FormatDatePipe, DisableIfUnauthorizedDirective],
      imports: [
        TranslateModule.forRoot({}),
        NgIdleModule.forRoot()
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: LiveLinkEditorGuardService, useValue: mockLiveLinkGuardService },
        { provide: FacadeService, useValue: facadeMockService },
        { provide: MessageService, useValue: messageService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Page should load with Save Service Opened Projects', () => {
    expect(component.openedProject).toBeDefined();
    expect(component.projectList[0].name).toEqual('firstProj');
  });

  it('Open Project Button should be enabled', () => {
    component.setSelection(component.openedProject);
    const openProjectBtn: HTMLElement = fixture.debugElement.nativeElement.querySelector('#OpenButton');
    expect(component.disabled).toBeFalsy();
    expect(openProjectBtn).toBeDefined();
    const spy = spyOn(component, 'openProject');
    openProjectBtn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should call saveOldProject functionality ', () => {
    component.projectList = [{ 'name': 'sampleproject', 'isSelected': true, 'isProtected': false }] as unknown as Project[];
    spyOn(component, 'fetchProjectDetail');
    facadeMockService.saveService.cleanProjectData.and.returnValue({});
    component.saveOldProject(false);
    expect(component.fetchProjectDetail).toHaveBeenCalled();
    expect(component.saveOldProject).toBeDefined();
  });

  it('should call checkProjectAlreadyOpen functionality ', () => {

    const projectDataMock = { 'project': { 'modified': new Date() } };
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
      component.openedProject = { 'id': '12345', 'name': 'project1','modified': new Date() } as unknown as Project;
      args.optionalCallBack();
    });
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectDataAsSaveJson').value.and.returnValue(projectDataMock);
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'getProjectData').value.and.returnValue(of(response));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'saveProject').value.and.returnValue(of({ 'id': '12345' ,'modified': new Date()}));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'closeProject').value.and.returnValue(of({}));
    spyOn(component, 'fetchProjectList');
    component.openedProject = { 'id': '12345', 'name': 'project1' ,'modified': new Date()} as unknown as Project;
    component.projectList = [{ 'id': '12345','modified': new Date() }] as unknown as Project[];

    component.checkProjectAlreadyOpen();
    expect(component.checkProjectAlreadyOpen).toBeDefined();
  });

  it('should call deleteProject functionality ', () => {
    spyOn(component, 'getSelectedProjectName').and.returnValue('project1');
    component.projectList = [<Project>{ 'date': '4', 'name': 'firstProj', 'id': uniqid.time(), 'isSelected': true, 'isProtected': false }];
    spyOn(component, 'getProjectPosition').and.returnValue(1);
    spyOn(component, 'checkAnySelection').and.returnValue(false);
    spyOn(component, 'fetchProjectList');
    const deleteProjectResponse = { data: { code: HTTPStatus.SUCCESS } };
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'deleteProject').value.and.returnValue(of(deleteProjectResponse));
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component.deleteDisabled = true;
    component.deleteProject();
    expect(component.deleteProject).toBeDefined();
    component.deleteDisabled = false;
    component.deleteProject();
    expect(component.getProjectPosition).toHaveBeenCalled();
    expect(component.checkAnySelection).toHaveBeenCalled();
    expect(component.fetchProjectList).toHaveBeenCalled();

  });


});



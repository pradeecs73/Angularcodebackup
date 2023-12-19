/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { Project, ProjectData } from '../../../models/models';
import { EllipsisPipe } from '../../../shared/pipes/ellipsis.pipe';
import { OpenProjectComponent } from './open-project.component';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import { TranslateModule } from '@ngx-translate/core';
import { FormatDatePipe } from 'src/app/shared/pipes/formatDate.pipe';

class DummyProject implements Project {
 date: string;
 created: string | Date;
 isSelected: boolean;
 name: string;
 author: string;
 modified: Date;
 modifiedby: string;
 comment: string;
 id: string;
}


let mockStore: Store;
//let mockConfirmationService:ConfirmationService;
let mockOpenProjectComponent: OpenProjectComponent;
let messageService: MessageService;
let facadeMockService;
fdescribe('openProjectComponent', () => {
 const uniqid = require('uniqid');
 let component: OpenProjectComponent;
 let fixture: ComponentFixture<OpenProjectComponent>;

 const recentProject: DummyProject = new DummyProject();
 recentProject.author = '';
 recentProject.comment = '';
 recentProject.created = new Date('1991.01.16');
 recentProject.date = '';
 recentProject.isSelected = true;
 recentProject.modified = new Date('1991.01.16');
 recentProject.modifiedby = '';
 recentProject.name = 'firstproj';

 const newProject: DummyProject = new DummyProject();
 newProject.author = '';
 newProject.comment = '';
 newProject.created = new Date('1991.01.16');
 newProject.date = '';
 newProject.isSelected = true;
 newProject.modified = new Date('1991.01.16');
 newProject.modifiedby = '';
 newProject.name = 'secondProj';
 const projects = <Project>{
  date: '4',
  name: 'firstProj',
  comment: 'projectComment',
  author: 'projectauthor',
  id: uniqid.time()
 };
 const projectData = <ProjectData>{
  project: projects,
  tree: null,
  editor: null,
  scanSettings: null
 };

 const project: DummyProject = newProject;

 beforeEach(waitForAsync(() => {
facadeMockService=new FacadeMockService();
  facadeMockService.saveService.devices = [];
  //mockDragDropService = jasmine.createSpy();
  facadeMockService.commonService.selectedProject = ' ';

  facadeMockService.saveService.editProjectStateChange = of(recentProject);

  TestBed.configureTestingModule({
   declarations: [OpenProjectComponent, EllipsisPipe, DisableIfUnauthorizedDirective,FormatDatePipe],
   imports: [
    TranslateModule.forRoot({})
  ],
   providers: [
    { provide: MessageService, useValue: messageService },
    { provide: FacadeService, useValue: facadeMockService},
    //{ provide: ConfirmationService, useValue: mockConfirmationService },
   ],
   schemas: [NO_ERRORS_SCHEMA]
  }).compileComponents();
 }));
 beforeEach(() => {
  const zoomPercent = new Subject<any>();
  zoomPercent.next(null);
  facadeMockService.commonService.zoomPercentObs = zoomPercent.asObservable();
 });

 beforeEach(() => {
  Object.getOwnPropertyDescriptor(
    facadeMockService.dataService,
    'getProjectData'
  ).value.and.returnValue({ project: { isProtected: false,name:'test' } });
  fixture = TestBed.createComponent(OpenProjectComponent);
  component = fixture.componentInstance;
  component.projectData = project;
  component.project = project;
  fixture.detectChanges();
 });

 it('should create', () => {
  expect(component).toBeTruthy();
 });

 it('should update the edit project modal display to true', () => {
  component.editProject();
  expect(component.editprojectModalDisplay).toBeTruthy();
  spyOn(component.disableIfUnauthorizedDirective,'hasPermission').and.returnValue(false);
  component.editProject();
 });

 it('verify the project list to be defined', () => {
  component.subscribeToEditStateChange();
  expect(component.project).toBeDefined();
 });
 it('Verifying the edit to existing project list', () => {
  component.project = project;
  component.subscribeToEditStateChange();
  expect(component.project.author).toEqual('');
  expect(component.project.comment).toEqual('');
  expect(component.project.name).toEqual('firstproj');
 });

 it('when ngOnchange is called', () => {
  component.ngOnChanges();
  component.project = projectData;
  expect(component.project).toEqual(projectData);
 });

 xit('save project using save as', () => {
  component.saveProjectCopy();
  expect(component.saveasprojectModalDisplay).toBe(true);
 });

 it('save the project', () => {
  const event = jasmine.createSpyObj('event', ['preventDefault']);
  component.saveProject(event);
  expect(facadeMockService.applicationStateService.saveProject).toHaveBeenCalled();
  spyOn(component.disableIfUnauthorizedDirective,'hasPermission').and.returnValue(false);
  component.saveProject(event);
 });

 it('when the project is closed', () => {
  component.onCloseProject();
  expect(component.project.isSelected).toBe(false);
 });

 it('when project is exported', () => {
  component.onExport();
  expect(facadeMockService.overlayService.confirm).toHaveBeenCalled();
 });

 it('when project is closed', () => {
  facadeMockService.overlayService.confirm.and.callFake(function (args) {
    args.acceptCallBack();
    args.optionalCallBack();
  });
  Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'saveProject').value.and.returnValue(of({data:{}}));
  component.closeProject();
  expect(facadeMockService.overlayService.confirm).toHaveBeenCalled();
  spyOn(component.disableIfUnauthorizedDirective,'hasPermission').and.returnValue(false);
  component.closeProject();
 });

 it('download the project', () => {
  let projectDatastring = JSON.stringify(projectData);
  Object.getOwnPropertyDescriptor(
   facadeMockService.dataService,
   'getProjectData'
  ).value.and.returnValue(projectData);
  component.downloadProject(projectData);
  expect(component.cachedata).toEqual(projectDatastring);
 });

 it('should call saveProjectCopy method', () => {
  spyOn(component.disableIfUnauthorizedDirective,'hasPermission').and.returnValue(true);
  facadeMockService.overlayService.confirm.and.callFake(function (args) {
    args.acceptCallBack();
  });
  component.saveProjectCopy();
  expect(component.saveProjectCopy).toBeDefined();
  component.disableIfUnauthorizedDirective.hasPermission=()=>{return false};
  component.saveProjectCopy();
  expect(component.saveasprojectModalDisplay).toEqual(true);
 });

 it('should call loadProjectData method', () => {
      spyOn(component,'downloadProject');
      Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'getProjectData').value.and.returnValue(of({data:{}}));
      component.loadProjectData(true);
      expect(component.loadProjectData).toBeDefined();
 });


});

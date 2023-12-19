/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { projectRegexStore } from 'mockData';
import { of, throwError } from 'rxjs';
import { Project, ProjectData } from 'src/app/models/models';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { DEVICE_URLVALIDATE_REGEX, PROJ_RSRV_REGEX, PROJ_SPECIAL_CHAR_REGEX } from '../../../utility/constant';
import { CreateEditProjectComponent } from './create-edit-project.component';

fdescribe('CreateEditProjectComponent', () => {
  const uniqid = require('uniqid');
  let component: CreateEditProjectComponent;
  let fixture: ComponentFixture<CreateEditProjectComponent>;
  let facadeMockService;
  let mockStore:Store;
  let savedProjectResponse = {"data":{"code":200,"msg":"The project has been saved"},"status":"SUCCESS","error":null}
  const project = <Project>{"date":"4","name":"firstProj","comment":"projectComment" ,"author":"projectauthor","id" : uniqid.time(),"isProtected":true};
  const editedProject = <Project>{"date":"4","name":"firstProjEdit", "comment":"editedprojectComment" ,"author":"editedprojectauthor","id" : uniqid.time()};
  const projectData = <ProjectData>{project : project, tree:null,editor:null ,scanSettings:null}
  const editedprojectData = <ProjectData>{project : editedProject, tree:null,editor:null ,scanSettings:null}
  const projectList = [<Project>{"date":"4","name":"firstProj", "id" : uniqid.time(),"isSelected": true},<Project>{"date":"3","name":"secondProj","id" : uniqid.time(),"isSelected": false}];
  const validateProjectresponse = {"data":{"code":200,"msg":"The project is unique"},"status":"SUCCESS","error":null}

  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();

    facadeMockService.apiService.deviceUrlValidatioRegex = DEVICE_URLVALIDATE_REGEX.toString();
    facadeMockService.apiService.projecNameValidationRegex = { PROJ_SPECIAL_CHAR_REGEX : PROJ_RSRV_REGEX.toString(),PROJ_RSRV_REGEX : PROJ_SPECIAL_CHAR_REGEX.toString()};


   facadeMockService.commonService.projectRegex = projectRegexStore;
   Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'createProject').value.and.returnValue(of(savedProjectResponse));
    TestBed.configureTestingModule({
      declarations: [ CreateEditProjectComponent ],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
      { provide: Store, useValue: mockStore },
      { provide: FacadeService, useValue: facadeMockService},
      ],
      schemas: [NO_ERRORS_SCHEMA]
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditProjectComponent);
    component = fixture.componentInstance;
    component.projects = project;
    fixture.detectChanges();
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectDataAsSaveJson').value.and.returnValue({project:{isProtected:false}});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should hide the component', () => {
  //   component.cancel();
  //   var result = component.show;
  //   expect(result).toBeFalsy();
  // });

  it('should update name, author and comments', () => {
    component.ngOnChanges();
    expect(component.createForm.controls.name).toBeDefined();
    expect(component.createForm.controls.author).toBeDefined();
    expect(component.createForm.controls.comment).toBeDefined();
  });

  it('should remove the form errors', () => {
    component.removeFormErrors();
    var result = component.error;
    expect(result).toBeFalsy();
  });

  it('should hide the errors', () => {
    component.hideError();
    var result = component.error;
    expect(result).toBeFalsy();
  });

  it('project name valdiator : con',() => {
    component.createForm.controls.name.setValue(`${'con'}`);
    fixture.detectChanges();
    expect(component.createForm.valid).toBe(false);
  })
   it('project name valdiator : com1',() => {
    component.createForm.controls.name.setValue(`${'com1'}`);
    fixture.detectChanges();
    expect(component.createForm.valid).toBe(false);
  })
   it('project name valdiator : acom2',() => {
    component.createForm.controls.name.setValue(`${'acom2'}`);
    fixture.detectChanges();
    expect(component.createForm.valid).toBe(true);
  })
  it('project name valdiator : com',() => {
    component.createForm.controls.name.setValue(`${'com'}`);
    fixture.detectChanges();

      expect(component.createForm.valid).toBe(true);

  })
   it('project name valdiator : prn',() => {
    component.createForm.controls.name.setValue(`${'prn'}`);
    fixture.detectChanges();

      expect(component.createForm.valid).toBe(false);

  })
   it('project name valdiator : aux',() => {
    component.createForm.controls.name.setValue(`${'aux'}`);
    fixture.detectChanges();

      expect(component.createForm.valid).toBe(false);

  })
  it('project name valdiator : cona',() => {
    component.createForm.controls.name.setValue(`${'cona'}`);
    fixture.detectChanges();

      expect(component.createForm.valid).toBe(true);

  })
  it('project name valdiator : cprn',() => {
    component.createForm.controls.name.setValue(`${'cprn'}`);
    fixture.detectChanges();

      expect(component.createForm.valid).toBe(true);

  })
  it('project name valdiator : first proj',() => {
    component.createForm.controls.name.setValue(`${'first proj'}`);
    fixture.detectChanges();

      expect(component.createForm.valid).toBe(true);

  })
  it('project name valdiator : proj*',() => {
    component.createForm.controls.name.setValue(`${'proj*'}`);
    fixture.detectChanges();

      expect(component.createForm.valid).toBe(false);

  })
   it('project name valdiator : ?project5',() => {
    component.createForm.controls.name.setValue(`${'?project5'}`);
    fixture.detectChanges();

      expect(component.createForm.valid).toBe(false);

  })
  it('project name valdiator : 4tax',() => {
    component.createForm.controls.name.setValue(`${'4tax'}`);
    fixture.detectChanges();

      expect(component.createForm.valid).toBe(true);

  })
  it('project name valdiator : pr0j',() => {
    component.createForm.controls.name.setValue(`${'pr0j'}`);
    fixture.detectChanges();
    expect(component.createForm.valid).toBe(true);
  })
  it('project name valdiator : Pr@Pr@j0cts.}{-_+!^&()[]\'',() => {
    component.createForm.controls.name.setValue(`${'Pr@Pr@j0cts.}{-_+!^&()[]\''}`);
    fixture.detectChanges();
    expect(component.createForm.valid).toBe(true);
  })
  it('project name valdiator : ABC/',() => {
    component.createForm.controls.name.setValue(`${'ABC/'}`);
    fixture.detectChanges();
    expect(component.createForm.valid).toBe(false);
  })
  it('project name valdiator : com6e',() => {
    component.createForm.controls.name.setValue(`${'com6e'}`);
    fixture.detectChanges();
    expect(component.createForm.valid).toBe(true);
  })

  it('when the project is edited',()=>{
    component.mode = 'edit';
    component.projects = project;
    component.init();
    spyOn(component,'setEditOrSaveAsFormData')
    component.setEditOrSaveAsFormData();
    expect(component.setEditOrSaveAsFormData).toHaveBeenCalled();
  })

  it('check if the form value changed',()=>{
    component.init();
    expect(component.createForm).toBeDefined();
    component.createForm.valueChanges.subscribe(res =>{
    spyOn(component,'checkForFormValueChanges')
    component.checkForFormValueChanges(res);
    expect(component.checkForFormValueChanges).toHaveBeenCalledWith(res);
    })
  })


  it('when the name of the project  is edited',()=>{
    component.originalFormData = projectData;
    component.checkForFormValueChanges(editedprojectData['project'] as unknown as ProjectData);
    fixture.detectChanges();
    expect(component.formEdited).toBe(true);
    expect(component.nameEdited).toBe(true);
  })

  it('when the name of the project  is not edited',()=>{
    component.originalFormData = projectData['project'] as unknown as ProjectData;
    component.checkForFormValueChanges(projectData['project'] as unknown as ProjectData);
    fixture.detectChanges();
    expect(component.formEdited).toBe(false);
    expect(component.nameEdited).toBe(false);
  })

  it('on click of  cancel',()=>{
    component.cancel();
    expect(Object.values(component.createForm.value).every(x => x === null )).toBe(true);
  })

  it('create project',()=>{
    component.mode='create';
    let saveProjectResponse = {"status":"SUCCESS","data":{"code":200,"msg":"The project has been saved"},"error":null}
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'validateProject').value.and.returnValue(of(validateProjectresponse));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'saveProject').value.and.returnValue(of(saveProjectResponse));
    component.createProject();
    component.onProjectAdded.subscribe(res =>{
      expect(res).toBe(project)
    })
    component.onProjectAdded.emit(project);

  })

  it('edit  project by editing the name',()=>{
    component.mode='edit';
    component.projects = project
    let updateProjectResponse = {"data":{"code":200,"msg":"The project has been updated"},"status":"SUCCESS","error":null}
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'validateProject').value.and.returnValue(of(validateProjectresponse));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'updateProject').value.and.returnValue(of(updateProjectResponse));
    component.createProject();
    expect(facadeMockService.apiService.updateProject).toHaveBeenCalled()
  })

  it('create project with save as option',()=>{
    component.mode='saveas';
    component.createForm.patchValue(projectData.project);
    let saveAsProjectResponse = {"data":{"code":200,"msg":"The project has been updated"},"status":"SUCCESS","error":null}
    let savaAsProjectData = JSON.parse(JSON.stringify(projectData))
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'validateProject').value.and.returnValue(of(validateProjectresponse));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'saveProject').value.and.returnValue(of(saveAsProjectResponse));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'getProjectData').value.and.returnValue(of({data: projectData}));
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(projectData);
    component.createProject();
    expect(facadeMockService.apiService.validateProject).toHaveBeenCalled()
  })

  it('validate project returns error',()=>{
    const responseObj = Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'validateProject'
    ).value.and.returnValue(throwError('Error in validate project api call'));
    component.createProject();
    fixture.detectChanges();
    expect(component.error).toBe(true);
  })

  it('edit  project without editing the name',()=>{
    component.mode='edit';
    component.projects = project;
    component.nameEdited = false;
    let updateProjectResponse = {"data":{"code":200,"msg":"The project has been updated"},"status":"SUCCESS","error":null}
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'updateProject').value.and.returnValue(of(updateProjectResponse));
    component.createProject();
    expect(facadeMockService.apiService.updateProject).toHaveBeenCalled()
  })

});

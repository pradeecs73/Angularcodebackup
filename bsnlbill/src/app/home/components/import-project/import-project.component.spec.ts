/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { projectRegexStore } from 'mockData';
import { of, throwError } from 'rxjs';
import { Project, ProjectData } from 'src/app/models/models';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { ImportProjectComponent } from './import-project.component';
const uniqid = require('uniqid');
let facadeMockService;
let importFileSource = {
  'Content': null,
  'ContentString': "project:\n  id: l6d94p2r\n  name: ptest\n  comment: ''\n  author: ''\n  created: 8/3/2022, 12:22:16 PM\n  modified: 8/3/2022, 12:22:16 PM\n  modifiedby: ''\n  isSelected: true\ntree:\n  devices: []\neditor: null\nscanSettings: null\n",
  'FileName': "ptest.yaml",
  'Size': 220
}

let formData = {
  author: "projectauthor",
  'comment': "projectComment",
  'created': "8/17/2022, 6:32:42 PM",
  'id': "l6xmj0rv",
  'isSelected': true,
  'modified': "8/17/2022, 6:32:42 PM",
  'modifiedby': "",
  'name': "firstProj",
  'sourcePath': {
    'Content': null,
    'ContentString': "project:\n  date: '4'\n  name: firstProj\n  comment: projectComment\n  author: projectauthor\n  id: l6w14vds\ntree: null\neditor: null\nscanSettings: null\n",
    'FileName': "firstProj.yaml",
    'Size': 147
  }
}
const project = <Project>{ "date": "4", "name": "firstProj", "comment": "projectComment", "author": "projectauthor", "id": uniqid.time() };
const projectData = <ProjectData>{ project: project, tree: null, editor: null, scanSettings: null }

fdescribe('ImportProjectComponent', () => {
  let component: ImportProjectComponent;
  let fixture: ComponentFixture<ImportProjectComponent>;

  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();

   facadeMockService.commonService.projectRegex = projectRegexStore;

    TestBed.configureTestingModule({
      declarations: [ImportProjectComponent],
      providers: [ { provide: FacadeService, useValue: facadeMockService}
      ],
      imports: [
        TranslateModule.forRoot({})
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // fit('should Cancel import project', () => {
  //   expect(component.show).toBeFalsy();
  // });

  it('should get the project name', () => {
    expect(component.getProjectName("test.test")).toEqual("test");
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

  it('subscription to when the import file changes', () => {
    component.importForm.controls['sourcePath'].patchValue(importFileSource);
    expect(component.importForm).toBeDefined();
    component.importForm.controls.sourcePath.valueChanges.subscribe(res => {
      spyOn(component, 'enablecontrols')
      expect(component.enablecontrols).toHaveBeenCalled();
    })
  })

  it('when the modal is reset', () => {
    component.resetModal();
    expect(Object.values(component.importForm.value).every(x => x === null)).toBe(true);
  })

  it('on click of cancel', () => {
    component.cancel();
    spyOn(component, 'resetModal')
    component.resetModal();
    expect(component.resetModal).toHaveBeenCalled();
  })

  it('when the project is imported', () => {
    let response = { "status": "SUCCESS", "data": { "code": 200, "msg": "The project has been imported" }, "error": null };
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'importProject').value.and.returnValue(of(response));
    component.importForm.controls['sourcePath'].setValue(importFileSource);
    component.importProject();
    expect(facadeMockService.apiService.importProject).toHaveBeenCalled()
  })

  it('import project api returns error', () => {
    component.importForm.controls['sourcePath'].setValue(importFileSource);
    const responseObj = Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'importProject'
    ).value.and.returnValue(throwError('Error in import project api call'));
    component.importProject();
    fixture.detectChanges();
    expect(component.error).toBe(true);
  })

  it('get the payload of import', () => {
    component.getImportPayload(projectData, formData);
    expect(projectData.project.author).toBe(formData.author);
  })
  it('check if the project projection data is correct in yaml(only write access)',()=>{
    let formData = {
      project : {
        isProtected: true
      },
      userPasswordDetails : [{
        password: '$2a$10$yZpR6jh6/m5rfsPleUk0LurcALbYP9NkIX.FGDj4FGme1aJFEALS',
        accessType : 'write'
      }
      ]
    } as unknown as ProjectData;
    expect(component.checkProjectProtection(formData)).toBe(false);
})

it('check if the project projection data is correct in yaml(along with read access)',()=>{
  let formData = {
    project : {
      isProtected: true
    },
    userPasswordDetails : [{
      password: '$2a$10$yZpR6jh6/m5rfsPleUk0LurcALbYP9NkIX.FGDj4FGme1aJFEALS',
      accessType : 'write'
    },
    {
      password: '$2a$10$yZpR6jh6/m5rfsPleUk0LurcALbYP9NkIX.FGDj4FGme1aJFEALS',
      accessType : 'read'
    }
    ]
  } as unknown as ProjectData;
  expect(component.checkProjectProtection(formData)).toBe(false);
})

it('check if the project projection data when isProtected is false',()=>{
let formData = {
  project : {
    isProtected: true
  },
  userPasswordDetails : {}
} as unknown as ProjectData;
expect(component.checkProjectProtection(formData)).toBe(true);
})

});

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { projectRegexStore } from 'mockData';
import { MessageService } from 'primeng/api';
import { CardModule } from "primeng/card";
import { ToolbarModule } from 'primeng/toolbar';
import { Subject } from 'rxjs';
import { CreateEditProjectComponent } from 'src/app/home/components/create-edit-project/create-edit-project.component';
import { ImportProjectComponent } from 'src/app/home/components/import-project/import-project.component';
import { FacadeMockService } from 'src/app/livelink-editor/services/facade.mock.service';
import { FacadeService } from 'src/app/livelink-editor/services/facade.service';
import { ApiService } from 'src/app/services/api.service';
import { ProjectDataService } from '../../../shared/services/dataservice/project-data.service';
import { DynamicDialogDirective } from './directives/dynamic-dialog.directive';
import { FormDialogComponent } from './form-dialog.component';

fdescribe('FormDialogComponent', () => {
  let component: FormDialogComponent;
  let fixture: ComponentFixture<FormDialogComponent>;
  let componentData = 'create-edit';
  let http: HttpClient;
  let messageService: MessageService;
  let projectDataService: ProjectDataService;
  let mockApiService: ApiService;
  let facadeMockService;
  mockApiService = jasmine.createSpyObj(['getConfig']);
  let mockStore: Store;
  let data = {
    author: '',
    comment: '',
    created: '8/18/2022, 5:10:00 PM',
    id: 'l6yz0i5a',
    isSelected: true,
    modified: '8/18/2022, 5:10:00 PM',
    modifiedby: '',
    name: 'test',
  };
  const saveEvent = new Subject<any>();
  const cancelEvent = new Subject<any>();
  const customActionEvent = new Subject<any>();


  beforeEach(async () => {
    facadeMockService = new FacadeMockService();

    facadeMockService.commonService.projectRegex = projectRegexStore;

    await TestBed.configureTestingModule({
      declarations: [FormDialogComponent, ImportProjectComponent, DynamicDialogDirective, CreateEditProjectComponent],
      imports: [
        TranslateModule.forRoot({}),
        CardModule,
        ToolbarModule],
      providers: [
        { provide: HttpClient, useValue: http },
        { provide: MessageService, useValue: messageService },
        { provide: ProjectDataService, useValue: projectDataService },
        { provide: Store, useValue: mockStore },
        { provide: FacadeService, useValue: facadeMockService }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDialogComponent);
    component = fixture.componentInstance;
    component.component = componentData;
    fixture.detectChanges();
    component.componentRef.instance['onProjectAdded'] = saveEvent.asObservable();
    component.componentRef.instance['hide'] = cancelEvent.asObservable();
    component.componentRef.instance['valid'] = customActionEvent.asObservable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Assigning the input', () => {
    component.inputs = { mode: 'create' };
    component.loadComponent();
    expect(component.componentRef.instance).toBeDefined();
  });

  it('save event subscription', () => {
    component.componentMetadata.customActionEvent = '';
    component.assignOutputs();
    saveEvent.next(data);
    expect(component.componentRef.instance['onProjectAdded']).toBeDefined();
    component.componentRef.instance['onProjectAdded'].subscribe(res => {
      spyOn(component, 'onSave');
      fixture.detectChanges();
      expect(component.onSave).toHaveBeenCalledWith(data);
    });
  });

  it('cancel event subscription', () => {
    component.componentMetadata.customActionEvent = '';
    component.assignOutputs();
    cancelEvent.next(data);
    expect(component.componentRef.instance['hide']).toBeDefined();
    component.componentRef.instance['hide'].subscribe(res => {
      spyOn(component, 'cancel');
      fixture.detectChanges();
      expect(component.cancel).toHaveBeenCalledWith();
    });
  });

  it('customActionEvent  subscription', () => {
    fixture.detectChanges();
    customActionEvent.next(data);
    component.componentMetadata.customActionEvent = 'valid';
    component.assignOutputs();
  });

  it('should call customActionEvent method', () => {
    const data = {};
    component.customActionEvent(data);
    expect(component.customActionEvent).toBeDefined();
    expect(component.show).toEqual(false);
  });

  it('should call removeValidationErrorMessages method', () => {
    component.removeValidationErrorMessages();
    expect(component.removeValidationErrorMessages).toBeDefined();
  });

});

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectSettingsComponent } from './project-settings.component';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { MessageService } from 'primeng/api';
import { PrimengModule } from '../vendors/primeng.module';
import { FormsModule } from '@angular/forms';
import { DisableIfUnauthorizedDirective } from '../directives/access-check/access-check.directive';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('ProjectSettingsComponent', () => {
  let component: ProjectSettingsComponent;
  let fixture: ComponentFixture<ProjectSettingsComponent>;
  let mockMessageService: MessageService;
  let facadeMockService;

  beforeEach(async () => {

    facadeMockService = new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: false } });

    await TestBed.configureTestingModule({
      declarations: [ProjectSettingsComponent,DisableIfUnauthorizedDirective],
      providers: [
        { provide: FacadeService, useValue: facadeMockService },
        { provide: MessageService, useValue: mockMessageService },
      ],
      imports: [FormsModule, PrimengModule,TranslateModule.forRoot({})]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProjectSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should call write password', () => {
    const formValue = { password: 'test12345', confirmPassword: 'test12345', mode: 'write' };
    component.setWritePassword(formValue);
    expect(component.setWritePassword).toBeDefined();
    expect(component.writePassword).toEqual('test12345');
  });

  it('Should call save write password', () => {
    component.saveWritePassword();
    expect(component.saveWritePassword).toBeDefined();
  });

});

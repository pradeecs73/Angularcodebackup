/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { PrimengModule } from '../../../vendors/primeng.module';
import { AccessType, OperationMode } from './../../../enum/enum';
import { FormDialogComponent } from './../../../shared/dialog/form-dialog/form-dialog.component';
import { SecuritySettingsComponent } from './security-settings.component';

fdescribe('SecuritySettingsComponent', () => {
  let component: SecuritySettingsComponent;
  let fixture: ComponentFixture<SecuritySettingsComponent>;
  let mockMessageService: MessageService;
  let facadeMockService;
  const fdComponent: FormDialogComponent = jasmine.createSpyObj('FormDialogComponent', [
    'removeValidationErrorMessages', 'changePasswordError', 'setPasswordError'
  ]);


  beforeEach(async () => {

    facadeMockService = new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: false } });

    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'haveReadAccess'
    ).value.and.returnValue(true);

    await TestBed.configureTestingModule({
      declarations: [SecuritySettingsComponent, FormDialogComponent, DisableIfUnauthorizedDirective],
      providers: [
        { provide: FacadeService, useValue: facadeMockService },
        { provide: MessageService, useValue: mockMessageService },
      ],
      imports: [FormsModule, PrimengModule, TranslateModule.forRoot({})]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SecuritySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should call openWritePasswordPopup method', () => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: false } });

    component.checkProtection = true;
    component.openWritePasswordPopup();
    expect(component.passwordModalDisplay).toEqual(true);

    component.checkProtection = false;
    component.openWritePasswordPopup();
    expect(component.checkProtection).toBeFalsy();
    expect(component.passwordModalDisplay).toEqual(false);


  });

  it('Should call openWritePasswordPopup method with protected', () => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: true } });
    component.checkProtection = false;
    component.openWritePasswordPopup();
    expect(component.checkProtection).toBeFalsy();
    expect(component.passwordModalDisplay).toEqual(false);
  });

  it('should clear', () => {
    component.clear();
    expect(component.checkProtection).toBeTruthy();
  });

  it('should removePassword', () => {
    component.removePassword(OperationMode.REMOVE_READ_PASSWORD);
    expect(component.accessType).toBe(AccessType.READ);
  });

  it('should removePasswordProtect', () => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: false } });
    const response = { data: { Success: 'success' } };
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'removePasswordProtection'
    ).value.and.returnValue(of(response));
    spyOn(component, 'updatePasswordProtect').and.callThrough();
    component.accessType = AccessType.READ;
    component.removePasswordProtect('Test@123');
    expect(component.passwordValidationModalDisplay).toBeFalsy();

    component.accessType = AccessType.WRITE;
    component.removePasswordProtect('Test@123');
    expect(component.checkProtection).toBeFalsy();
  });


  it('should removePasswordProtect with protected', () => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: true } });
    const response = { data: { Success: 'success' } };
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'removePasswordProtection'
    ).value.and.returnValue(of(response));
    spyOn(component, 'updatePasswordProtect').and.callThrough();
    component.removePasswordProtect('Test@123');
    expect(component.updatePasswordProtect).not.toHaveBeenCalled();
  });

  it('should removePasswordProtect with error response', () => {
    const errorResponse = { error: { data: { msg: 'not removed' } } };
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'removePasswordProtection'
    ).value.and.returnValue(throwError(errorResponse));
    spyOn(component, 'updatePasswordProtect').and.callThrough();
    component.removePasswordProtect('Test@123');
    expect(component.passwordValidationModalDisplay).toBeFalsy();
  });




  it('Should call close method', () => {
    component.close();
    expect(component.passwordModalDisplay).toEqual(false);
  });


  it('Should call setWritePassword method', () => {
    const response = [
      { data: { token: 'token12345', userDetails: { accessType: AccessType.WRITE } } }];
    component.fdComponent = fdComponent;
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'registerPassword'
    ).value.and.returnValue(of(response));

    const formValue = { password: 'test12345', confirmPassword: 'test12345', mode: AccessType.WRITE };
    component.setPassword(formValue);

    expect(component.setPassword).toBeDefined();
    expect(component.writePassword).toEqual('********');
    formValue.mode = AccessType.READ;
    component.setPassword(formValue);
    expect(component.readPassword).toEqual('********');

    const errorResponse = { error: { error: { error: { errorCode: '12345' } } } };

    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'registerPassword'
    ).value.and.returnValue(throwError(errorResponse));

    component.setPassword(formValue);
  });

  it('Should call openReadPasswordPopup method', () => {
    component.openReadPasswordPopup();
    expect(component.passwordModalDisplay).toEqual(true);
    expect(component.openReadPasswordPopup).toBeDefined();

    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: true } });
    component.openReadPasswordPopup();
    expect(component.passwordModalDisplay).toEqual(true);

  });

  it('Should call openChangeWritePasswordPopup method', () => {

    component.openChangeWritePasswordPopup();
    expect(component.passwordModalDisplay).toEqual(true);
    expect(component.openChangeWritePasswordPopup).toBeDefined();

    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: true } });
    component.openChangeWritePasswordPopup();
    expect(component.passwordModalDisplay).toEqual(true);

  });

  it('Should call openChangeReadPasswordPopup method', () => {

    component.openChangeReadPasswordPopup();
    expect(component.passwordModalDisplay).toEqual(true);
    expect(component.openChangeReadPasswordPopup).toBeDefined();

    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: true } });
    component.openChangeReadPasswordPopup();
    expect(component.passwordModalDisplay).toEqual(true);

  });

  it('Should call changeReadOrWritePassword method', () => {
    const formValue = { password: 'test12345', confirmPassword: 'test12345', mode: AccessType.WRITE };
    component.fdComponent = fdComponent;
    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'changeProjectPassword'
    ).value.and.returnValue(of({ data: { msg: 'password changed successfully' } }));

    component.changeReadOrWritePassword(formValue);
    expect(component.changeReadOrWritePassword).toBeDefined();

    formValue.mode = AccessType.READ;
    component.changeReadOrWritePassword(formValue);
    expect(component.changeReadOrWritePassword).toBeDefined();

    Object.getOwnPropertyDescriptor(
      facadeMockService.apiService,
      'changeProjectPassword'
    ).value.and.returnValue(throwError({ error: { error: { error: { errorCode: '12345' } } } }));
    component.changeReadOrWritePassword(formValue);

    const formValueForChangePassword = { password: 'test12345', confirmPassword: 'test12345', mode: OperationMode.CHANGE_WRITE_PASSWORD };
    component.changeReadOrWritePassword(formValueForChangePassword);
    component.setPassword(formValueForChangePassword);

    formValueForChangePassword.mode = OperationMode.CHANGE_READ_PASSWORD;
    component.changeReadOrWritePassword(formValueForChangePassword);

  });


});

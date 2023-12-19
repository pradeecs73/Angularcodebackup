/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { projectRegexStore } from 'mockData/mockRegexData';
import { MessageService } from 'primeng/api';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { PrimengModule } from '../../../vendors/primeng.module';
import { AccessType, OperationMode } from './../../../enum/enum';
import { PasswordPopupComponent } from './password-popup.component';

fdescribe('PasswordPopupComponent', () => {
  let component: PasswordPopupComponent;
  let fixture: ComponentFixture<PasswordPopupComponent>;
  let mockMessageService: MessageService;
  let facadeMockService;

  beforeEach(async () => {
    facadeMockService = new FacadeMockService();

    facadeMockService.commonService.projectRegex = projectRegexStore;

    await TestBed.configureTestingModule({
      declarations: [PasswordPopupComponent],
      providers: [
        { provide: FacadeService, useValue: facadeMockService },
        { provide: MessageService, useValue: mockMessageService },
      ],
      imports: [FormsModule, PrimengModule, ReactiveFormsModule, TranslateModule.forRoot({})]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasswordPopupComponent);
    component = fixture.componentInstance;
    component.isFromProtectProject = true;
    component.mode = AccessType.READ;
    fixture.detectChanges();
  });

  it('Should create', () => {
    component.isFromProtectProject = false;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component).toBeTruthy();

  });

  it('Should call close method', () => {
    component.close();
    expect(component.close).toBeDefined();
  });

  it('Should call onSubmit method', () => {
    component.passwordsForm.controls['password'].setValue('Test@123');
    component.passwordsForm.controls['confirmPassword'].setValue('Test@123');

    let emittedValue = null;
    component.onSettingWritePassword.subscribe((value: number) => {
      emittedValue = value;
    });

    component.onSubmit();
    expect(component.passwordsForm.valid).toBeTruthy();
    expect(emittedValue).not.toBe(null);

  });

  it('Should call onSubmit method with invalid', () => {
    component.passwordsForm.controls['password'].setValue('Test');
    component.passwordsForm.controls['confirmPassword'].setValue(null);

    let emittedValue = null;
    component.onSettingWritePassword.subscribe((value: number) => {
      emittedValue = value;
    });

    component.onSubmit();
    expect(component.passwordsForm.valid).toBeFalsy();
  });

  it('Form should be valid', () => {
    component.passwordsForm.controls['password'].setValue('Test@123');
    component.passwordsForm.controls['confirmPassword'].setValue('Test@123');
    expect(component.passwordsForm.invalid).toEqual(false);
  });

  it('Form should be invalid', () => {
    component.passwordsForm.controls['password'].setValue('Test@');
    component.passwordsForm.controls['confirmPassword'].setValue('Test@');
    expect(component.passwordsForm.invalid).toEqual(true);
  });

  it('Minimum character check should return true ', () => {
    component.passwordsForm.controls['password'].setValue('Test@123');
    const minimumCharacterCheck = component.minimumCharacterCheck();
    expect(minimumCharacterCheck).toEqual(true);
  });

  it('Minimum character check should return false ', () => {
    component.passwordsForm.controls['password'].setValue('Test@');
    const minimumCharacterCheck = component.minimumCharacterCheck();
    expect(minimumCharacterCheck).toEqual(false);
  });

  it('Upper case character check should return true ', () => {
    component.passwordsForm.controls['password'].setValue('Test@123');
    const upperCaseCheck = component.upperCaseCheck();
    expect(upperCaseCheck).toEqual(true);
  });

  it('Upper case character check should return false ', () => {
    component.passwordsForm.controls['password'].setValue('test@123');
    const upperCaseCheck = component.upperCaseCheck();
    expect(upperCaseCheck).toEqual(false);
  });

  it('Lower case character check should return true ', () => {
    component.passwordsForm.controls['password'].setValue('Test@123');
    const lowerCaseCheck = component.lowerCaseCheck();
    expect(lowerCaseCheck).toEqual(true);
  });

  it('Lower case character check should return false ', () => {
    component.passwordsForm.controls['password'].setValue('TEST@123');
    const lowerCaseCheck = component.lowerCaseCheck();
    expect(lowerCaseCheck).toEqual(false);
  });

  it('Special character check should return true ', () => {
    component.passwordsForm.controls['password'].setValue('Test@123');
    const specialCharacterCheck = component.specialCharacterRegexCheck();
    expect(specialCharacterCheck).toEqual(true);
  });

  it('Special character check should return false ', () => {
    component.passwordsForm.controls['password'].setValue('Test123');
    const specialCharacterCheck = component.specialCharacterRegexCheck();
    expect(specialCharacterCheck).toEqual(false);
  });

  it('Passwords match check should return true ', () => {
    component.passwordsForm.controls['password'].setValue('Test@123');
    component.passwordsForm.controls['confirmPassword'].setValue('Test@123');
    const passwordsMatch = component.passwordsMatchCheck();
    expect(passwordsMatch).toEqual(true);
  });

  it('Passwords match check should return false ', () => {
    component.passwordsForm.controls['password'].setValue('Test@123');
    component.passwordsForm.controls['confirmPassword'].setValue('Test@12');
    const passwordsMatch = component.passwordsMatchCheck();
    expect(passwordsMatch).toEqual(false);
  });

  it('Should call get password method ', () => {
    component.passwordsForm.controls['password'].setValue('Test@123');
    component.password;
    expect(component.password).toBeDefined();
  });

  it('Should call get confirm password method ', () => {
    component.passwordsForm.controls['confirmPassword'].setValue('Test@123');
    component.confirmPassword;
    expect(component.confirmPassword).toBeDefined();
  });

  it('Should call subscription method of showpassword', () => {
    component.passwordsForm.controls['showPassword'].setValue(true);
    component.ngOnInit();
    component.passwordsForm.controls['showPassword'].setValue(false);
    component.ngOnInit();
    expect(component.ngOnInit).toBeDefined();
  });

  it('should call setupPopUpFields method', () => {
    component.mode = AccessType.WRITE;
    component.setupPopUpFields();
    component.mode = AccessType.READ;
    component.setupPopUpFields();
    component.mode = OperationMode.CHANGE_WRITE_PASSWORD;
    component.setupPopUpFields();
    component.mode = OperationMode.CHANGE_READ_PASSWORD;
    component.setupPopUpFields();
    component.mode = 'default';
    component.setupPopUpFields();

    expect(component.setupPopUpFields).toBeDefined();
  });

  it('Should call get oldPassword  method ', () => {
    const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[#$@!%^&*?]).{8,}$';
    component.passwordsForm.addControl('oldPassword', new FormControl('', [Validators.required, Validators.pattern(passwordPattern)]));
    component.passwordsForm.controls['oldPassword'].setValue('Test@123');
    component.oldPassword;
    expect(component.oldPassword).toBeDefined();
  });


});

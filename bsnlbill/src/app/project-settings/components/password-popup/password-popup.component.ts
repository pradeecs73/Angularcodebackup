/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { FormOverlay } from '../../../shared/dialog/form-dialog/form-overlay';
import { validateRegex } from '../../../shared/services/validators.service';
import { AccessType, OperationMode } from './../../../enum/enum';
@Component({
  selector: 'app-password-popup',
  templateUrl: './password-popup.component.html',
  styleUrls: ['./password-popup.component.scss', './../../../shared/dialog/form-dialog/form-overlay-body.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PasswordPopupComponent extends FormOverlay implements OnInit {
  @Input() isFromProtectProject = false;
  passwordsForm: FormGroup;
  textType = 'password';
  showPassword = false;
  @Input() mode: string;
  passwordValidationError = '';
  title: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  oldPasswordLabel: string;
  @Output() onSettingWritePassword = new EventEmitter();
  @Output() hide = new EventEmitter();
  @Output('formValueChanges') emitFormGroup = new EventEmitter();

  constructor(private readonly passwordFb: FormBuilder,
    private readonly facadeService: FacadeService,
    private readonly el: ElementRef) {
    super();
  }
  /* Password field
  */
  get password() {
    return this.passwordsForm.get('password');
  }
  /* confirm password field
  */
  get confirmPassword() {
    return this.passwordsForm.get('confirmPassword');
  }
  /* old field
  */
  get oldPassword() {
    return this.passwordsForm.get('oldPassword');
  }

  ngOnInit(): void {
    this.title = this.facadeService.translateService.instant(`setting.securitySetting.buttons.setup${this.mode}password`);
    let validators = [Validators.required, Validators.pattern(this.facadeService.commonService.projectRegex.passwordPatternValidationRegex)];
    if (this.isFromProtectProject && this.mode === AccessType.READ) {
      validators = [Validators.pattern(this.facadeService.commonService.projectRegex.passwordPatternValidationRegex)];
    }
    /* Initializes the form
    */
    this.passwordsForm = this.passwordFb.group({
      password: ['', validators],
      confirmPassword: ['', validators],
      showPassword: [false]
    }, { validator: this.checkPasswordsIdentity});
    /* When show password is selected or deselected
    */
    this.passwordsForm.get('showPassword').valueChanges
      .subscribe(showPasswordValue => {
        if (showPasswordValue) {
          this.textType = 'text';
        } else {
          this.textType = 'password';
        }
      });
    this.passwordsForm.valueChanges.subscribe(_res=>{
      /* REmove the error as soon as the new password is typed
      */
      if(this.passwordValidationError !== ''){
       this.passwordValidationError = '';
      }
    });
    this.setupPopUpFields();
    /* If its from device page
    */
    if (this.isFromProtectProject) {
      this.emitFormGroup.emit(this.passwordsForm);
      this.passwordsForm.valueChanges.subscribe(_form => {
        this.emitFormGroup.emit(this.passwordsForm);
      });
    }
  }
  /* Set up the data for the pop-up
  *
  */
  setupPopUpFields() {
    switch (this.mode) {
      /* For read and write
      */
      case AccessType.READ:
      case AccessType.WRITE:
        this.title = this.facadeService.translateService.instant(`setting.securitySetting.titles.setup${this.mode}Password`);
        this.passwordLabel = this.facadeService.translateService.instant(`setting.securitySetting.titles.password${this.mode}Access`);
        this.confirmPasswordLabel = this.facadeService.translateService.instant(`setting.securitySetting.titles.repeatPasswordFor${this.mode}`);
        this.passwordsForm.removeControl('oldPassword');
        break;
        /* for change write password
        */
      case OperationMode.CHANGE_WRITE_PASSWORD:
        this.title = this.facadeService.translateService.instant(`setting.securitySetting.buttons.changewritePassword`);
        this.oldPasswordLabel = this.facadeService.translateService.instant(`setting.securitySetting.titles.passwordwriteAccess`);
        this.passwordLabel = this.facadeService.translateService.instant(`setting.securitySetting.titles.newPassowordForWrite`);
        this.confirmPasswordLabel = this.facadeService.translateService.instant(`setting.securitySetting.titles.repeatNewPasswordForWrite`);
        this.passwordsForm.addControl('oldPassword', new FormControl('', [Validators.required,
          Validators.pattern(this.facadeService.commonService.projectRegex.passwordPatternValidationRegex)]));
        break;
        /* for change read password
        */
      case OperationMode.CHANGE_READ_PASSWORD:
        this.title = this.facadeService.translateService.instant(`setting.securitySetting.buttons.changereadPassword`);
        this.oldPasswordLabel = this.facadeService.translateService.instant(`setting.securitySetting.titles.passwordreadAccess`);
        this.passwordLabel = this.facadeService.translateService.instant(`setting.securitySetting.titles.newPassowordForRead`);
        this.confirmPasswordLabel = this.facadeService.translateService.instant(`setting.securitySetting.titles.repeatNewPasswordForRead`);
        this.passwordsForm.addControl('oldPassword', new FormControl('', [Validators.required,
           Validators.pattern(this.facadeService.commonService.projectRegex.passwordPatternValidationRegex)]));
        break;
        /* default
        */
      default:
        return;
    }
  }
  /*
  *when we click on close
  */
  close() {
    this.hide.emit();
  }
  /*
  *On submit the data is sent to parent component after which it is sent to the api
  */
  onSubmit() {
    /**
     * If all the fields in the form field valid then will submit the form
     * Otherwise show the focus on invalid field
     */
    if (this.passwordsForm.valid) {
      this.passwordsForm.value.mode = this.mode;
      this.onSettingWritePassword.emit(this.passwordsForm.value);
    }
    /**
     * If the form is invalid, loop the invalid fields and focus on that particular field
     */
    else {
      for (const key of Object.keys(this.passwordsForm.controls)) {
        if (this.passwordsForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector(`[formcontrolname="${key}"]`);
          invalidControl.focus();
          break;
        }
      }
    }
  }

  /* Check if password and confirm password are same
  */
  checkPasswordsIdentity(controls: AbstractControl) {
    let result:unknown = true;
    if(controls.get('password').value !== '' && controls.get('confirmPassword').value !== ''){
      if (controls.get('password').value !== controls.get('confirmPassword').value) {
        controls.get('confirmPassword').setErrors({ matching: true });
        result =  { invalid: true };
      }else{
      /**
       * Return true if password and confirm password equal
       */
        controls.get('confirmPassword').setErrors(null);
      }
    }
    return result;
  }
  /*
  *Check if there are 8 minimum characters in password
  */
  minimumCharacterCheck() {
    return validateRegex(
      this.facadeService.commonService.projectRegex
        .minimumEightCharacterValidationRegex,
      this.passwordsForm.get('password')?.value
    );
  }
  /*
  *Check if there is a uppercase in password
  */
  upperCaseCheck() {
    return validateRegex(
      this.facadeService.commonService.projectRegex.uppercaseValidationRegex,
      this.passwordsForm.get('password')?.value
    );
  }
  /*
  *Check if there is a lowercase in password
  */
  lowerCaseCheck() {
    return validateRegex(
      this.facadeService.commonService.projectRegex.lowercaseValidationRegex,
      this.passwordsForm.get('password')?.value
    );
  }
  /*
  *Check if there is a special in password
  *
  */
  specialCharacterRegexCheck() {
    return validateRegex(
      this.facadeService.commonService.projectRegex
        .specialCharacterValidationRegex,
      this.passwordsForm.get('password')?.value
    );
  }
  /*
  *Check if password matches
  */
  passwordsMatchCheck() {
    return (
      this.passwordsForm.get('password')?.value ===
      this.passwordsForm.get('confirmPassword').value &&
      this.passwordsForm.get('password')?.value !== '' &&
      this.passwordsForm.get('confirmPassword').value !== ''
    );
  }

}

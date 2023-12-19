/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OperationMode } from '../../../enum/enum';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { FormOverlay } from '../form-dialog/form-overlay';

@Component({
  selector: 'app-password-validation',
  templateUrl: './password-validation.component.html',
  styleUrls: ['./password-validation.component.scss', './../form-dialog/form-overlay-body.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PasswordValidationComponent extends FormOverlay implements OnInit {
  /*
  *
  *Variables are declared here
  */
  title: string;
  dialogData;
  @Input() mode: string;
  @Input() projectName: string;
  @Output() passwordVerification = new EventEmitter();
  showPassword = false;
  textType = 'password';
  constructor(private readonly facadeService: FacadeService) {
    super();
  }
  @ViewChild('passwordValidation') passwordForm: NgForm;
  @Output() hide = new EventEmitter();
  @Output() test = new EventEmitter();
  /*
  *
  *This life cycle hook is called when the component is initialized
  */
  ngOnInit(): void {
    this.setDialogData();
  }
  /*
  * Function is used to set the dialog data
  *
  */
  setDialogData() {
    switch (this.mode) {
      /* Mode : Open protected project
      */
      case OperationMode.MODE_OPEN_PROTECTED_PROJECT:
        this.title = this.facadeService.translateService.instant('home.messages.openProtectedProject.title');
        this.dialogData = {
          message:this.facadeService.translateService.instant('home.messages.openProtectedProject.dialogData.message',{projectName: this.projectName}),
          title: this.facadeService.translateService.instant('home.messages.openProtectedProject.dialogData.title'),
          buttonName: this.facadeService.translateService.instant('home.titles.openProject')
        }
        break;
        /* Mode :remove password protect
        */
      case OperationMode.REMOVE_PASSWORD_PROTECT:
        this.title = this.facadeService.translateService.instant('setting.securitySetting.message.removePasswordProtect.title');
        this.dialogData = {
          message:  this.facadeService.translateService.instant('setting.securitySetting.message.removePasswordProtect.dialogData.message'),
          title: this.facadeService.translateService.instant('setting.securitySetting.message.removePasswordProtect.dialogData.title'),
          buttonName: this.facadeService.translateService.instant('setting.securitySetting.message.removePasswordProtect.dialogData.buttonName')
        }
        break;
      /* Mode : remove read passoword
      */
      case OperationMode.REMOVE_READ_PASSWORD:
        this.title = this.facadeService.translateService.instant('setting.securitySetting.message.removeReadPassword.title');
          this.dialogData = {
            message: this.facadeService.translateService.instant('setting.securitySetting.message.removeReadPassword.dialogData.message'),
            title: this.facadeService.translateService.instant('setting.securitySetting.message.removeReadPassword.dialogData.title'),
            buttonName: this.facadeService.translateService.instant('setting.securitySetting.message.removeReadPassword.dialogData.buttonName')
          }
          break;
      /* Mode : Delete protected project
      */
      case OperationMode.MODE_DELETE_PROTECTED_PROJECT:
        this.title = this.facadeService.translateService.instant('home.messages.deleteProtectedProject.title');
        this.dialogData = {
          message:this.facadeService.translateService.instant('home.messages.deleteProtectedProject.dialogData.message',{projectName: this.projectName}),
          title: this.facadeService.translateService.instant('home.messages.deleteProtectedProject.dialogData.title'),
          buttonName: this.facadeService.translateService.instant('home.titles.deleteProject')
        }
          break;
      /* Mode : Default
      */
      default:
        this.dialogData = {
          message: '',
          title: '',
          buttonName: ''
        }
        break;
    }
  }
  /*
  * when the submit button is clicked
  *
  */
  onSubmit() {
    this.passwordVerification.emit(this.passwordForm);
    this.passwordForm.reset();
  }
  /*
  * when we click on cancel button
  *
  */
  cancel() {
    this.passwordForm.reset();
    this.hide.emit();
  }
  /*
  *
  * When we click on show password
  */
  changeInputTextType() {
    if (this.showPassword) {
      this.textType = 'text';
    } else {
      this.textType = 'password';
    }
  }


}

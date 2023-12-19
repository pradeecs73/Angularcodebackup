/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectProtection } from '../../../models/models';
import { AccessType, Numeric } from '../../../enum/enum';
import { FormOverlay } from '../../../shared/dialog/form-dialog/form-overlay';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
@Component({
  selector: 'app-add-project-protection',
  templateUrl: './add-project-protection.component.html',
  styleUrls: ['./add-project-protection.component.scss']
})
export class AddProjectProtectionComponent extends FormOverlay {
  /*
  * Variable declarations for the component
  */
  title = this.facadeService.translateService.instant('devices.titles.projectProtection');
  readAccess = AccessType.READ;
  writeAccess = AccessType.WRITE;
  errorMessage = '';
  @Output() onSubmitEvent = new EventEmitter();
  @Output() hide = new EventEmitter();
  passwordFormGroups = [];
  constructor(private readonly facadeService: FacadeService) {
    super();
  }
  /*
  *
  * Form initalizations
  *
  */
  formEvent(formGroup: FormGroup, mode: AccessType) {
    const formData = [...this.passwordFormGroups];
    if (formData.length === 0) {
      formData.push({ mode, formGroup });
    } else {
      const index = formData.findIndex(el => el.mode === mode);
      if (index !== -1) {
        formData[index].formGroup = formGroup;
      } else {
        formData.push({ mode, formGroup });
      }
    }
    this.passwordFormGroups = [...formData];
     /*
      *
      * If both read and write password is set by user
      * 
      */ 
    if (this.passwordFormGroups.length === Numeric.TWO) {
      const form1 = this.passwordFormGroups[0].formGroup.value;
      const form2 = this.passwordFormGroups[1].formGroup.value;
      this.errorMessage = '';
      if (form1.password !== '' && form2.password !== '' && form1.password === form2.password) {
        this.errorMessage = this.facadeService.translateService.instant('setting.securitySetting.error.120036');
      }
    }
  }
 /*
  *
  * When the protect project button is clicked
  * 
  */ 
  protectProject(data: Array<ProjectProtection>) {
    if (data && data.length > 0) {
      const credentials = data.map(formData => {
        return {
          credentials: formData.formGroup.value,
          mode: formData.mode
        };
      });
      if (!this.errorMessage) {
        this.onSubmitEvent.emit(credentials);
      }
    }
  }
  /*
  *
  * On click of cancel this function is called
  * 
  */ 
  cancel() {
    this.hide.emit();
  }

}

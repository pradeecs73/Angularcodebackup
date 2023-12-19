/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import { ProjectData, ProjectPasswords } from '../../../models/models';
import { ChangeProjectPasswordPayload, RemoveProjectPasswordPayload } from '../../../models/payload.interface';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { accessControl, AccessType, HTTPStatus, NotificationType, OperationMode } from './../../../enum/enum';
import { FormDialogComponent } from './../../../shared/dialog/form-dialog/form-dialog.component';

@Component({
  selector: 'app-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SecuritySettingsComponent implements OnInit {
  /*
  *
  * Variables for the component are declared here
  */
  passwordModalDisplay = false;
  checkProtection = false;
  writePassword = '';
  readPassword = '';
  passwordType: { mode: AccessType | OperationMode } = { mode: AccessType.WRITE };
  projectData: ProjectData;
  passwordValidationModalDisplay = false;
  accessType: AccessType;

  @Output() passwordFromPopup = new EventEmitter();
  @ViewChild('fdComponent') fdComponent: FormDialogComponent;
  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;
  openRemovePasswordInput: { mode: string };

  constructor(private readonly facadeService: FacadeService, private readonly cdr: ChangeDetectorRef, private readonly messageService: MessageService) { }

  ngOnInit(): void {
    this.init();
  }
  /*
  * Called in the beginning
  *
  */
  init() {
    this.projectData = this.facadeService.dataService.getProjectData();
    /*
    * If the project is protected
    */
    if (this.projectData.project.isProtected) {
      this.checkProtection = true;
      this.writePassword = '********';
      /*
      *If it has read access
       */
      if (this.facadeService.dataService.haveReadAccess) {
        this.readPassword = '********';
      }
    }
  }
  /*
  * Access control(read/write) for the project is returned using this getter method
  *
  */
  get accessControl() {
    return accessControl;
  }
  /*
  * If the mode is read/write : set password else change password
  *
  */
  setPassword(formValue: ProjectPasswords) {
    if (formValue.mode === AccessType.READ || formValue.mode === AccessType.WRITE) {
      const payload = [{
        password: formValue.password,
        accessType: formValue.mode,
        projectName: this.facadeService.dataService.getProjectName()
      }];
      this.registerPassword(payload, formValue);
    }
    else {
      this.changeReadOrWritePassword(formValue);
    }
  }
  /*
  * APi call for setting up the password
  *
  */
  registerPassword(payload, formValue: ProjectPasswords) {
    this.facadeService.apiService.registerPassword(payload).subscribe(accessDetails => {
      if (accessDetails && accessDetails[0].data) {
        this.facadeService.dataService.setAccessType(AccessType.WRITE);
        this.facadeService.dataService.updateProtectionToProject(true);
        this.facadeService.saveService.updateProjectListInGrid();
      }
      this.setInputData(formValue);
      this.messageService.add({
        key: 'saveProject', severity: 'success',
        summary: this.facadeService.translateService.instant('messageService.success.setPassword'),
        detail: this.facadeService.translateService.instant('notification.info.passwordSetSuccessfully',
          { mode: formValue.mode })
      });
      this.facadeService.notificationService.pushNotificationToPopup(
        { content: 'notification.info.passwordSetSuccessfully', params: { mode: formValue.mode } }, NotificationType.INFO, HTTPStatus.SUCCESS);

      this.passwordFromPopup.emit(formValue);
      if (this.fdComponent) {
        this.fdComponent.removeValidationErrorMessages();
      }
      this.cdr.detectChanges();
      this.passwordModalDisplay = false;

    }, err => {
      if (err) {
        /*
        * show error in the password popup component 
        */
        if (this.fdComponent) {
          this.fdComponent.setPasswordError(err.error.error.errorCode);
          this.cdr.detectChanges();
        }
      }
    });
  }
  /*
  * Fill the input fields if the password is present
  *
  */
  setInputData(formValue: ProjectPasswords) {
    /*for write access*/
    if (formValue.mode === AccessType.WRITE) {
      this.writePassword = '********';
    }
    /*for read access*/
    if (formValue.mode === AccessType.READ) {
      this.readPassword = '********';
      this.facadeService.dataService.setHaveReadAccess(true);
    }
  }
  /*
  * Change read or write password
  *
  */
  changeReadOrWritePassword(formValue: ProjectPasswords) {
    let accessType;
    if (formValue.mode === OperationMode.CHANGE_WRITE_PASSWORD) {
      accessType = AccessType.WRITE;
    }
    if (formValue.mode === OperationMode.CHANGE_READ_PASSWORD) {
      accessType = AccessType.READ;
    }
    const payload: ChangeProjectPasswordPayload = {
      oldPassword: formValue.oldPassword,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      accessType: accessType,
      projectName: this.facadeService.dataService.getProjectName(),
      projectId: this.facadeService.dataService.getProjectId()
    };
    /**Api call for changing the password */
    this.facadeService.apiService.changeProjectPassword(payload).subscribe(() => {
      this.passwordModalDisplay = false;
      this.messageService.add({
        key: 'saveProject',
        severity: 'success',
        summary: this.facadeService.translateService.instant('setting.securitySetting.buttons.changePassword'),
        detail: this.facadeService.translateService.instant('notification.info.passwordChangedSuccessfully', { accessType: accessType })
      });
      this.facadeService.notificationService.pushNotificationToPopup(
        { content: 'notification.info.passwordChangedSuccessfully', params: { accessType: accessType } },
        NotificationType.INFO,
        HTTPStatus.SUCCESS);
    }, err => {
      if (err) {
        /*
        * show error in the password popup component 
        */
        this.fdComponent.changePasswordError(err.error.error.errorCode);
        this.cdr.detectChanges();
      }
    });

  }
  /*
  *
  * Open the write password popup 
  */
  openWritePasswordPopup() {
    /* If there is no access return
    */
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
      return;
    }
    /*if project is not protected open popup else show a notification to remove password */
    if (this.checkProtection) {
      this.passwordModalDisplay = true;
      this.passwordType = { mode: AccessType.WRITE };
    } else {
      this.passwordModalDisplay = false;
      const msg = this.facadeService.translateService.instant('overlay.warning.disableProjectProtection.message.removeReadAccess');
      const confirmationMessage = this.facadeService.translateService.instant('overlay.warning.disableProjectProtection.message.confirm');
      this.facadeService.overlayService.warning({
        header: this.facadeService.translateService.instant('overlay.warning.disableProjectProtection.header'),
        message: {
          title: this.facadeService.translateService.instant('overlay.warning.disableProjectProtection.message.title'),
          content: [msg, confirmationMessage]
        },
        prolongedText: true,
        successLabel: this.facadeService.translateService.instant('common.buttons.yes'),
        optionalLabel: this.facadeService.translateService.instant('common.buttons.no'),
        acceptCallBack: () => {
          this.facadeService.overlayService.changeOverlayState(false);
          this.removePassword(OperationMode.REMOVE_PASSWORD_PROTECT);
          this.accessType = AccessType.WRITE;
        },
        optionalCallBack: () => {
          this.checkProtection = true;
        },
        closeCallBack: () => {
          this.checkProtection = true;
        }
      });
    }
  }
  /*
  *
  * When we click on clear
  */
  clear() {
    this.checkProtection = true;
  }
  /*
  *
  * User can remove the read password by providing the write password 
  */
  removePassword(mode) {
    if (mode === OperationMode.REMOVE_READ_PASSWORD) {
      this.accessType = AccessType.READ;
    }
    this.passwordValidationModalDisplay = true;
    this.openRemovePasswordInput = { mode: mode };
  }
  /*
  *
  * Function to remove the password protection
  */
  removePasswordProtect(passwordText: string) {
    /* If there is no access return
    */
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
      return;
    }
    const param: RemoveProjectPasswordPayload = {
      projectId: this.projectData.project.id,
      projectName: this.projectData.project.name,
      password: passwordText,
      accessType: this.accessType
    };
    /*
    * remove api call request 
    */
    this.facadeService.apiService.removePasswordProtection(param).subscribe(() => {
      this.passwordValidationModalDisplay = false;
      this.facadeService.overlayService.success({
        header: this.facadeService.translateService.instant('overlay.success.authenticationSuccessful.header'),
        message: {
          content: [this.facadeService.translateService.instant('overlay.success.authenticationSuccessful.message.content')]
        },
        successLabel: this.facadeService.translateService.instant('common.buttons.ok')
      });
      this.updatePasswordProtect();
    },
      _error => {
        this.facadeService.overlayService.error({
          header: this.facadeService.translateService.instant('overlay.error.authenticationFailed.header'),
          message: {
            title: this.facadeService.translateService.instant('overlay.error.authenticationFailed.message.title'),
            content: [this.facadeService.translateService.instant('overlay.error.authenticationFailed.message.content')]
          },
          successLabel: this.facadeService.translateService.instant('common.buttons.ok')
        });
      }
    );
  }
  /*
  *
  * Function to update the password protection
  */
  updatePasswordProtect() {
    /*for read access*/
    if (this.accessType === AccessType.READ) {
      this.readPassword = '';
      this.facadeService.notificationService.pushNotificationToPopup(
        { content: 'notification.info.readPasswordRemovedSuccessfully', params: {} },
        NotificationType.INFO,
        HTTPStatus.SUCCESS);
    } else {
      /* for write access*/
      this.readPassword = '';
      this.writePassword = '';
      this.checkProtection = false;
      this.facadeService.dataService.updateProtectionToProject(false);
      this.facadeService.notificationService.pushNotificationToPopup(
        { content: 'notification.info.writePasswordRemovedSuccessfully', params: {} },
        NotificationType.INFO,
        HTTPStatus.SUCCESS);
    }
    this.facadeService.dataService.setHaveReadAccess(false);
    this.facadeService.saveService.updateProjectListInGrid();
  }
  /*
  *
  * Open popup to setup read password
  */
  openReadPasswordPopup() {
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
      return;
    }
    this.passwordModalDisplay = true;
    this.passwordType = { mode: AccessType.READ };
  }
  /*
  *
  * Open popup to change write password
  */
  openChangeWritePasswordPopup() {
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
      return;
    }
    this.passwordModalDisplay = true;
    this.passwordType = { mode: OperationMode.CHANGE_WRITE_PASSWORD };
  }
/*
  *
  * Open popup to change read password
  */
  openChangeReadPasswordPopup() {
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
      return;
    }
    this.passwordModalDisplay = true;
    this.passwordType = { mode: OperationMode.CHANGE_READ_PASSWORD };
  }
  /*
  *
  * close
  */
  close() {
    if (this.passwordType.mode === AccessType.WRITE) {
      this.checkProtection = false;
    }
    this.passwordModalDisplay = false;
  }

}

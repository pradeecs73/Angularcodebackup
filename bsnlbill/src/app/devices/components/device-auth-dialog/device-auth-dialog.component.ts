/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DeviceAuthentication, error, HTTPStatus, NotificationType, ResponseStatusCode } from '../../../enum/enum';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { FormOverlay } from '../../../shared/dialog/form-dialog/form-overlay';
import { log } from '../../../utility/utility';

@Component({
  selector: 'app-device-auth-dialog',
  templateUrl: './device-auth-dialog.component.html',
  styleUrls: ['./device-auth-dialog.component.scss', '../../../shared/dialog/form-dialog/form-overlay-body.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeviceAuthDialogComponent extends FormOverlay implements OnDestroy {
  /*
  *
  *
  * Variable declarations for the component
  */
  title = this.facadeService.translateService.instant('devices.messages.addSelectedDevice');
  @Output() onLoginEvent = new EventEmitter();
  @Output() hide = new EventEmitter();
  @Output() skipDeviceEvent = new EventEmitter();
  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  deviceName = '';
  ipAddr = '';
  deviceDetailsSubscription: Subscription;
  deviceDetails;

  constructor(private readonly facadeService: FacadeService) {
    super();
    /*
    *
    *
    * Initialize the device data which has to be authenticated
    */
    this.deviceDetailsSubscription = this.facadeService.deviceService.$deviceDetails.subscribe(data => {
      this.deviceDetails = data;
      this.title = data.title;
      if (data.title === DeviceAuthentication.ADD_SELECTED_DEVICE_TO_LIST || data.title === DeviceAuthentication.BROWSE_DEVICE) {
        this.deviceName = this.deviceDetails.device.name;
        this.ipAddr = this.deviceDetails.device.address;
      } else {
        this.deviceName = this.deviceDetails.device.deviceName;
        this.ipAddr = this.deviceDetails.device.deviceAddress;
      }
      this.loginForm.reset();
    });
  }
  /*
  * When login button is click this function is called
  */
  loginAuth() {
    let payload, updateDeviceCredentials;
    /*
    *
    *
    * First time when the device is authenticated to add to list
    */
    if (this.deviceDetails.title === DeviceAuthentication.ADD_SELECTED_DEVICE_TO_LIST) {
      payload = {
        name: this.deviceName,
        address: this.ipAddr,
        ...this.loginForm.value
      };
      updateDeviceCredentials = false;
    } else {
      let uid;
      /*
      *
      *
      * If the authentication expires during browse
      */
      if (this.deviceDetails.title !== DeviceAuthentication.BROWSE_DEVICE) {
        uid = this.deviceDetails.device.deviceId;
      } else {
        uid = this.deviceDetails.device.uid;
      }
      payload = {
        project: this.facadeService.dataService.getProjectData().project.id,
        uid: uid,
        ...this.loginForm.value
      };
      updateDeviceCredentials = true;
    }
    this.facadeService.apiService.deviceAuthenticate(payload, updateDeviceCredentials).subscribe(() => {
      this.onLoginEvent.emit(payload);
    }, err => {
      log(err);
      /*
    *
    *
    * When the wrong credentials are entered for device authentication
    */
      if (err.error.error.errorType === ResponseStatusCode.Invalid_Device_Credentials) {
        this.facadeService.overlayService.error({
          header: this.facadeService.translateService.instant('overlay.error.authenticationFailed.header'),
          message: {
            title: this.facadeService.translateService.instant('overlay.error.authenticationFailed.message.title'),
            content: [this.facadeService.translateService.instant('overlay.error.authenticationFailed.message.content')]
          },
          successLabel: this.facadeService.translateService.instant('common.buttons.ok')
        });
        this.facadeService.notificationService.pushNotificationToPopup(
          { content: `notification.error.${err.error.error.errorCode}`, params: {} },
          NotificationType.ERROR,
          HTTPStatus.ERROR);
      }
      /*
      *
      *
      * If server times out during device authentication
      */
      if (err.error.error.errorType === ResponseStatusCode.Internal_Server_Error && err.error.data.includes(error.ETIMEDOUT)) {
        this.facadeService.overlayService.error({
          header: this.facadeService.translateService.instant('overlay.error.addDevicesFailed.header'),
          message: {
            title: this.facadeService.translateService.instant('overlay.error.addDevicesFailed.message.title'),
            content: [this.facadeService.translateService.instant('overlay.error.addDevicesFailed.message.content')]
          },
          successLabel: this.facadeService.translateService.instant('common.buttons.ok')
        });
      }
    });
  }

   /**
    * When skip device is clicked
    */
  skipDeviceEmitter() {
    this.skipDeviceEvent.emit(this.deviceDetails);
  }

   /**
    * On click of cancel button
    */
  cancel() {
    this.hide.emit();
  }

  ngOnDestroy(): void {
    this.deviceDetails = null;
  }


}

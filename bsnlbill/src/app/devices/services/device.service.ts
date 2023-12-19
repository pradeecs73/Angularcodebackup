/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  AccessType,
  DeviceState,
  FillingLineNodeType,
  HTTPStatus,
  NotificationType
} from '../../enum/enum';
import { AuthenticateDevice, ProjectProtection } from '../../models/models';
import { Device } from '../../models/targetmodel.interface';
import { OPCNode } from '../../opcua/opcnodes/opcnode';
import { FacadeService } from '../../livelink-editor/services/facade.service';

@Injectable({
    providedIn : 'root'
})
export class DeviceService {

  private readonly deviceDetailsSubject = new BehaviorSubject(null);
  $deviceDetails = this.deviceDetailsSubject.asObservable();
  constructor(private readonly facadeService: FacadeService){}
  /*
  *
  *
  * Function is used to update the device data
  */
  updateDevicesData(deviceList: Device[]): boolean {
  /*
  *
  *
  * removes the duplicate deviceId
  */
    let errorForNodes = false;
    if (deviceList) {
      const devices = Array.from(
        new Set(deviceList?.map(device => device.uid))
      ).map(id => deviceList.find(device => device.uid === id));
      for (const device of devices) {
        this.facadeService.dataService.updateDeviceState(device.uid, device.state);
        this.updateNodeState(device.uid, device.state);
        const showError = this.showErrorForAC(device);
        if (showError) {
          errorForNodes = true;
        }
        this.facadeService.errorHandleService.updateErrorList(device, showError);
        this.facadeService.commonService.changeDeviceState(device);
      }
      /*
      *
      *
      * Update Store Data
      */
      this.facadeService.deviceStoreService.fetchDeviceTreeNodes();
    }
    return errorForNodes;
  }
  /*
  *
  *
  * Function is used to set the device details
  */
  setDeviceDetails(data: unknown) {
    this.deviceDetailsSubject.next(data);
  }
  /*
  *
  *
  * Function is used to show error related to AC
  *
  */
 private showErrorForAC(device: Device): boolean {
  const automationComp = this.facadeService.dataService.getAutomationComponents(
   device.uid
  );
    let showError = false;
    automationComp.forEach(ac => {
      if (this.facadeService.dataService.getNodeByID(ac.id)) {
        showError = true;
      }
    });
    return showError;
  }
   /*
  *
  *
  * Function is used to update the node state
  *
  */
  private updateNodeState(deviceId: string, state: DeviceState) {
    if (deviceId && state) {
   const nodes = this.facadeService.editorService.liveLinkEditor.editorNodes.filter(
    node =>
     node.type === FillingLineNodeType.NODE &&
     (node as OPCNode).deviceId === deviceId
   );
      nodes.forEach((node: OPCNode) => {
        if (node.type === FillingLineNodeType.NODE) {
          this.facadeService.opcNodeService.updateState(node, state);
        }
      });
    }
  }
 /*
  *
  *
  * When the project protection is submitted
  *
  */
 onSubmitProjectProtection(formData: Array<ProjectProtection>) {
  if (formData && formData.length > 0) {
   const validCredentials = formData.filter(
    el => el.credentials.password && el.credentials.confirmPassword
   );
   const payload = validCredentials.map(el => {
    return {
     accessType: el.mode,
     password: el.credentials.password,
     projectName: this.facadeService.dataService.getProjectName()
    };
   });
   this.facadeService.apiService
    .registerPassword(payload)
    .subscribe(accessDetailsArray => {
     accessDetailsArray.forEach(accessDetails => {
      if (accessDetails && accessDetails.data) {
       const haveReadAccess = payload.some(
        el => el.accessType === AccessType.READ
       );
       if (haveReadAccess) {
        this.facadeService.dataService.setHaveReadAccess(true);
       }
       this.facadeService.dataService.updateProtectionToProject(true);
      }
     });
     this.facadeService.commonService.setShowProjectProtectionModel(false);
     this.facadeService.dataService.setAccessType(AccessType.WRITE);
     this.facadeService.notificationService.pushNotificationToPopup(
      { content: 'notification.info.writePasswordSetup', params: {} },
      NotificationType.INFO,
      HTTPStatus.SUCCESS
     );
    });
  }
 }

  /*
  *
  *
  * Function to show authenticate popup for protected device
  *
  */
  showAuthenticationPopupState() {
    this.facadeService.commonService.authenticationPopUpState()
      .pipe(filter(Boolean))
      .subscribe(({ device, multipleDevices, title }: AuthenticateDevice) => {
        this.facadeService.commonService.showAuthenticationPopupState({
          device,
          multipleDevices,
          title
        });
      });
  }


    /*
  *  Show a popup and notification if device update fails
  *
  */
    handleBrowseErrorNotification(device) {
      if(device.hasOwnProperty('errorCode'))  {
        const message = {content : `notification.error.${device.errorCode}`, params: {deviceName:device.name, deviceAddress:device.address}};
        this.facadeService.notificationService.pushNotificationToPopup(message, NotificationType.ERROR, HTTPStatus.SUCCESS);
        this.facadeService.overlayService.error({
          header: this.facadeService.translateService.instant('overlay.error.updateDeviceFailed.header'),
          message: {
            content: [ this.facadeService.translateService.instant( `notification.error.${device.errorCode}`,{deviceName:device.name, deviceAddress:device.address})]
          },
          successLabel: this.facadeService.translateService.instant('common.buttons.ok')
        });
      }
    }

 /**
   * @param {string} propertyType - propertyType to be updated clicked by the user
   * @param {string} propertyTypeToBeUpdated - propertyTypeToBeUpdated to be updated
   * @param {string} currentValue - currentValue entered by the user
   * @param {boolean} isPreviousValue - is it called from the original value
   * @param {string} oldValue - previous value
   * @param {string} device - device reference
   *
   */
 updateBasedOnProperty(propertyType: string, propertyTypeToBeUpdated: string, currentValue: string, isPreviousValue: boolean, oldValue?: string, device?: Device) {
  if (propertyTypeToBeUpdated === 'address' && isPreviousValue) {
    /*
    * currently uid is generated in the backend,
    * Each time address is updated,it should update with the original value
    * which is generated from BE during nodeSet upload,not the user previously updated
    */
    return device.address;
  }
  if (propertyType === propertyTypeToBeUpdated && isPreviousValue) {
    return oldValue;
  } else if (propertyType !== propertyTypeToBeUpdated && isPreviousValue) {
    return device[propertyTypeToBeUpdated];
  }
  else if (propertyType === propertyTypeToBeUpdated && !isPreviousValue) {
    return currentValue;
  } else {
    return '';
  }
}

/**
 *
 * Generate payload for updating device
 * @param {Device} device
 * @param {string} propertyName
 * @param {string} value
 * @return {*}
 * @memberof DeviceService
 */
generatePayloadForUpdateDevice(device:Device, propertyName:string,value:string) {
  return {
    project: this.facadeService.dataService.getProjectId(),
    deviceDetails: [{
      uid: device.uid,
      deviceName: device.name,
      address: device.address,
      updatedDeviceName: this.updateBasedOnProperty(propertyName, 'name', value, false, null, device),
      updatedAddress: this.getUpdatedAddress(propertyName, value, device)
    }]
  };
}

  /*
  *  returns the updated address
  *
  */
  getUpdatedAddress(propertyName, value, device) {
    const address = device?.address;
    if (propertyName === 'address') {
      return value;
    }
    if (propertyName === 'name') {
      return '';
    }
    return address;
  }

}

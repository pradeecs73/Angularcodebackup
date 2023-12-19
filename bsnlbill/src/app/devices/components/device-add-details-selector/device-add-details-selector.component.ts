/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Numeric } from '../../../enum/enum';
import { ApiResponse } from '../../../models/models';
import { Device, DeviceConfig } from '../../../models/targetmodel.interface';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { deviceUrlValidator } from '../../../shared/services/validators.service';
import { AppState } from '../../../store/app.reducer';
import { DeviceTreeState } from '../../../store/device-tree/device-tree.reducer';
import { NO_DEVICES_SELECTED, OPCTCP } from '../../../utility/constant';
import { isNullOrEmpty } from '../../../utility/utility';

@Component({
  selector: 'device-add-details-selector',
  templateUrl: './device-add-details-selector.component.html',
  styleUrls: ['./device-add-details-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeviceAddDetailsSelectorComponent implements OnInit {
  /*
  * Variable declarations for the component
  */
  addDetailsForm: FormGroup;
  @Output() onPreviousPage = new EventEmitter();
  @Output() onDeviceAltered = new EventEmitter();
  @Input() devicesAddedToGrid: Array<DeviceConfig | null>;

  preventApiCall = false;
  addDeviceError = false;
  addDeviceErrorMessage = '';
  addDeviceErrorSolution = '';
  deviceTree: Observable<DeviceTreeState>;
  deviceTreeStoreData: Array<Device>;
  deviceNameField = false;
  deviceName: string;
  maxGridLength: number = Numeric.EIGHT;
  addedDevice = 0;

  constructor(private readonly facadeService: FacadeService,
    private readonly store: Store<AppState>) {
    this.deviceTreeStoreData = [];
  }
  /*
  *
  * Function to initialize the device list in grid
  *
  */
  initializeDeviceListInGrid() {
    if (!this.devicesAddedToGrid || this.devicesAddedToGrid.length === 0) {
      this.devicesAddedToGrid = this.createFixedArray(this.maxGridLength);
    }
    if (isNullOrEmpty(this.devicesAddedToGrid[0])) {
      this.devicesAddedToGrid[0] = {
        name: this.generateDeviceNameIfEmpty(),
        address: '',
        uid: null
      };
    }
  }
  /*
  *
  * Show no devices selected if there are no devices
  *
  */
  generateDeviceNameIfEmpty() {
    return NO_DEVICES_SELECTED;
  }
  /*
  *
  * Show no devices selected if there are no devices
  *
  */
  get showNoDeviceData() {
    return this.devicesAddedToGrid[0].name === NO_DEVICES_SELECTED;
  }
  /*
  *
  * This lifecycle hook is called when there are changes in the model
  *
  */
  ngOnChanges() {
    if (this.devicesAddedToGrid && this.devicesAddedToGrid.length > 0) {
      const remainingGridLength = Math.abs(this.maxGridLength - this.devicesAddedToGrid.length);
      this.devicesAddedToGrid = this.devicesAddedToGrid.concat(this.createFixedArray(remainingGridLength));
    }
    else {
      this.initializeDeviceListInGrid();
    }
  }
  /*
  *
  * This lifecycle hook is called when page is initialized
  *
  */
  ngOnInit() {
    this.addDetailsForm = new FormGroup({
      address: new FormControl(OPCTCP, [Validators.required, deviceUrlValidator(this.facadeService.commonService.projectRegex.deviceUrlValidationRegex)]),
      name: new FormControl(null, Validators.required)
    });

    this.deviceTree = this.store.select('deviceTreeList');
    this.subscribeToDeviceTree();
    /*
    *
    * remove form error and display 'opc.tcp://' when address is empty
    *
    */
    this.addDetailsForm.get('address').valueChanges.subscribe(() => {
      this.removeDeviceFormErrors();

      if (this.addDetailsForm.controls.address.value !== null) {
        if (this.addDetailsForm.controls.address.value.length < 1) {
          this.addDetailsForm.controls.address.setValue(OPCTCP);
        }
      }
    });

  }

  /**
    *
    *
    * Subscribe to device tree store
    */
  private subscribeToDeviceTree() {

    if (!isNullOrEmpty(this.deviceTree)) {
      this.deviceTree.subscribe(data => {

        this.deviceTreeStoreData = this.getDevicesDataFromStore(data);
      });
    }
  }

  /**
    *
    *
    * Updates the devices data from store when the device is newly added
    */
  private getDevicesDataFromStore(data: DeviceTreeState) {
    let result: Array<Device> = [];

    if (!isNullOrEmpty(data) && !isNullOrEmpty(data.deviceGroup) && !isNullOrEmpty(data.deviceGroup.devices)) {
      result = data.deviceGroup.devices;
    }
    return result;
  }

  /**
  *
  *
  * Emits 'add' to device add dialog which calls device add method page on click of back button
  */
  onBack() {
    this.onPreviousPage.emit('add');
  }

  /**
 *
 *
 * Check whether the device is connected or not on click of 'next' button and send the form
 * data to device add dialog
 */
  connect() {
    if (!isNullOrEmpty(this.addDetailsForm?.controls?.address)
      && ((this.deviceNameField && !isNullOrEmpty(this.addDetailsForm?.controls?.name))
        || !this.deviceNameField)) {
      if (!(this.checkAddDetailsFormValidation()) || this.preventApiCall) {
        return;
      }
      this.addDeviceDetailsForVaildAddress();
    }
  }

  addDeviceDetailsForVaildAddress() {
    this.preventApiCall = true;
    this.facadeService.apiService.isDeviceConnected({ 'address': this.addDetailsForm.controls.address.value }).subscribe((res: ApiResponse) => {
      if (res?.data.isConnected) {
        this.preventApiCall = false;
        if (isNullOrEmpty(res.data.deviceName) && !this.deviceNameField) {
          this.deviceNameField = true;
          return;
        }
        this.deviceName = res.data.deviceName;
        const deviceconfig = this.constructDeviceConfigList();
        deviceconfig.isProtected = res.data.isProtected;
        deviceconfig.isDeviceAuthRequired = res.data.isDeviceAuthRequired;
        deviceconfig.isSecurityPolicyValid = res.data.isSecurityPolicyValid;
        deviceconfig.isValidAddressModel = res.data.isValidAddressModel;
        if (this.deviceAlreadyAdded(deviceconfig)) {
          this.handleDeviceAlreadyAdded();
        } else {
          this.handleAddDevicesToGrid(deviceconfig);
          this.deviceNameField = false;
        }
      }
    }, () => {
      this.handleDeviceNotConnected();
      this.preventApiCall = false;
    });
  }
  /**
   *
   *
   * Throw error if the device is not connected
   */
  handleDeviceNotConnected() {
    this.addDeviceError = true;
    this.addDeviceErrorMessage = this.facadeService.translateService.instant('devices.error.deviceNotConnected.errorMessage');
    this.addDeviceErrorSolution = this.facadeService.translateService.instant('devices.error.deviceNotConnected.errorSolution');
    this.addDetailsForm.controls.address.setErrors({ 'duplicate': true });
  }
  /**
 *
 *
 * Throw error if the device is already added
 */
  handleDeviceAlreadyAdded() {
    this.addDeviceError = true;
    this.addDeviceErrorMessage = this.facadeService.translateService.instant('devices.error.deviceAlreadyAdded.errorMessage');
    this.addDeviceErrorSolution = this.facadeService.translateService.instant('devices.error.deviceAlreadyAdded.errorSolution');
    this.addDetailsForm.controls.address.setErrors({ 'duplicate': true });
  }

  private handleAddDevicesToGrid(deviceconfig: DeviceConfig) {
    if (!isNullOrEmpty(deviceconfig) && !isNullOrEmpty(deviceconfig.address) && !isNullOrEmpty(deviceconfig.name)) {
      this.devicesAddedToGrid[this.devicesAddedToGrid.length] = deviceconfig;
      this.addedDevice++;
    }
    this.onDeviceAltered.emit(this.devicesAddedToGrid.filter(device => device !== null && device.address !== ''));
    this.addDetailsForm.reset();
    this.addDetailsForm.controls.address.setValue(OPCTCP);
  }
  /**
  *
  *
  * Function to check if device is already added
  */
  deviceAlreadyAdded(deviceconfig: DeviceConfig) {

    let result = false;
    const isDeviceAddedToGrid = this.isDeviceAdded(deviceconfig.address, this.devicesAddedToGrid);
    const isDeviceAddedToStore = this.isDeviceAdded(deviceconfig.address, this.deviceTreeStoreData);

    if (isDeviceAddedToGrid || isDeviceAddedToStore) {
      result = true;
    }

    return result;
  }


  constructDeviceConfigList(): DeviceConfig {

    const device = {} as DeviceConfig;
    let deviceName = '';
    let deviceAddress = '';

    if (!isNullOrEmpty(this.addDetailsForm) && !isNullOrEmpty(this.addDetailsForm.controls)) {
      if ((this.deviceNameField && !isNullOrEmpty(this.addDetailsForm?.controls?.name)) || !this.deviceNameField) {
        if (this.deviceNameField) {
          deviceName = this.addDetailsForm.controls.name.value;
        }
        else {
          deviceName = this.deviceName;
        }
      }
      if (!isNullOrEmpty(this.addDetailsForm.controls.address)) {
        deviceAddress = this.addDetailsForm.controls.address.value;
      }
    }

    device.address = deviceAddress;
    device.name = deviceName;
    device.uid = uuidv4();

    return device;
  }
  /**
  *
  *
  * Function to check if device is already added
  */
  isDeviceAdded(deviceAddress: string, data: Array<DeviceConfig> | Array<Device>) {
    let result = false;
    if (!isNullOrEmpty(data) && data.length > 0) {
      for (const item of data) {
        if (!isNullOrEmpty(item) && deviceAddress === item.address) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  /**
  *
  *
  *hides error dialog on click
  */
  hideError() {
    this.addDeviceError = false;
    this.addDetailsForm.reset();
    this.addDetailsForm.controls.address.setValue(OPCTCP);
  }

  /**
 *
 *
 * show device url error dialog in case regex expression mismatch
 */
  deviceUrlError() {
    return !this.addDetailsForm.controls.address.valid && this.addDetailsForm.get('address').touched
      && this.addDetailsForm.get('address').errors['deviceUrlValidationError'];
  }

  /**
*
* show device name error dialog if the field is left empty
*/
  deviceNameError() {
    if (this.deviceNameField) {
      return (!this.addDetailsForm.controls.name.valid && this.addDetailsForm.get('name').touched);
    }
    return false;
  }

  /**
 *
 * checks for add details form validation
 */
  checkAddDetailsFormValidation(): boolean {
    let result = false;
    if (((this.deviceNameField && this.addDetailsForm?.controls?.name?.valid) || !this.deviceNameField)
      && this.addDetailsForm.controls.address.valid) {
      result = true;
    }
    return result;
  }

  /**
*
make device address error as null
*/
  removeDeviceFormErrors() {
    if (this.addDetailsForm.controls.address.hasError('duplicate')) {
      this.addDetailsForm.controls.address.setErrors({ 'duplicate': null });
    }
    this.addDeviceError = false;
  }

  /**
   *
   * Call the function arguement only when Enter key or NumberPad Enter key is pressed
   */
  handleKeyPressEnter(ev: KeyboardEvent, fn) {
    if (ev.key === 'Enter' || ev.key === 'NumpadEnter') {
      this[fn.name]();
    }
  }
  /**
   *
   * Called when the device is deleted from grid
   */
  deleteDeviceFromGrid(device: DeviceConfig) {
    const deviceIndexToRemove = this.devicesAddedToGrid.findIndex(item => item.address === device.address);
    this.devicesAddedToGrid.splice(deviceIndexToRemove, 1);
    this.devicesAddedToGrid = this.devicesAddedToGrid.concat(this.createFixedArray(1));
    this.initializeDeviceListInGrid();
    this.onDeviceAltered.emit(this.devicesAddedToGrid.filter(item => item !== null && item.address !== ''));
  }

  /**
   * Create a fixed array of max grid length
   */
  createFixedArray(length): DeviceConfig[] {
    return Array(length).fill(null);
  }

  /**
* Get the element of the array to be deleted from device grid
*/
  getDeviceElementToRemove(address: string): number {
    let result = -1;
    for (let i = 0; i < this.devicesAddedToGrid.length; i++) {
      this.devicesAddedToGrid[i].name = `${this.devicesAddedToGrid[i].name} [${this.devicesAddedToGrid[i].address}]`;

      if (this.devicesAddedToGrid[i].address === address) {
        result = i;
        break;
      }
    }
    return result;
  }
  /**
 *
 * Function to get the device name
 */
  getDeviceName(device: DeviceConfig) {
    let deviceDisplayName = '';
    if (!device) {
      return deviceDisplayName;
    }
    if (device?.name && device?.address !== '') {
      deviceDisplayName = `${device.name}[${device?.address}]`;
    }
    else {
      if (device?.address === '') {
        deviceDisplayName = device.name;
      }
      else {
        deviceDisplayName = device?.address;
      }
    }
    return deviceDisplayName;
  }

  /**
   *
   *
   *  Function to show tooltip is address model of device is wrong
   */
  showToolTip(device: DeviceConfig) {
    if(device && device.isValidAddressModel === false) {
      return this.facadeService.translateService.instant('devices.messages.invalidAddressModel');
    }
    if(device && device.isSecurityPolicyValid === false) {
      return this.facadeService.translateService.instant('devices.messages.invalidSecurityPolicy');
    }
    return '';
  }

}


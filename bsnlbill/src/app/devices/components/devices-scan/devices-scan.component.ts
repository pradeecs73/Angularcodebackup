/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { DeviceConfig } from '../../../models/targetmodel.interface';
import { FacadeService } from '../../../livelink-editor/services/facade.service';

import { Numeric } from '../../../enum/enum';
import { DevicesDetails } from '../../../models/connection.interface';
import {
  DeviceScanRequestPayload,
  DeviceScanSettings,
  DeviceScanSuccessResponse,
  IValidationErrors
} from '../../../models/device-data.interface';
import { ipRangeValidator, ipValidator, portValidator } from '../../../shared/services/validators.service';
import { deviceIpErrorMessage, START_SCAN } from '../../../utility/constant';
import {
  getHostPartFromIp,
  isFormFieldHasError,
  isNullOrEmpty, validateAddress,
  validateField
} from '../../../utility/utility';


@Component({
  selector: 'app-devices-scan',
  templateUrl: './devices-scan.component.html',
  styleUrls: ['./devices-scan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DevicesScanComponent implements OnInit, OnDestroy {


  @Input() deviceInGrid: DeviceConfig[];
  @Output() onDevicesAdded = new EventEmitter<DevicesDetails[]>();
  @ViewChild('addSettings') scanSettingsPanelRef: OverlayPanel;
  deviceHeaderCheckbox = false;
  deviceIpErrorMessages;
  deviceListInGrid: Array<DevicesDetails | null>;
  isCancelled: boolean;
  isSubscriptionActive: boolean;
  maxGridLength: number = Numeric.TEN;
  scanSetting: DeviceScanSettings;
  scanSettingForm: UntypedFormGroup;
  scanTableColumns: string[] = ['', 'devices.titles.deviceName', 'devices.titles.address', 'devices.titles.status'];
  totalNoOfDevicesInRange: number;
  validationErrorList: IValidationErrors;

  private readonly subscriptions: Subscription = new Subscription();


  constructor(
    private readonly facadeService: FacadeService
  ) {
    this.deviceListInGrid = this.createFixedArray();
    this.initializeDeviceListInGrid();
    this.deviceIpErrorMessages = deviceIpErrorMessage;
  }
  /*
  *
  *
  * To Fill the contents in the table
  *
  */
  createFixedArray() {
    return Array(this.maxGridLength).fill(null);
  }
   /*
  *
  *
  * Called when the cancel button is clicked during scanning
  */
  cancelScanning() {
    this.isCancelled = true;
    this.deviceListInGrid = this.createFixedArray();
    this.deviceListInGrid[0] = {
      isValid: false,
      deviceName: START_SCAN
    };
    this.facadeService.apiService.cancelScanningDevice();
  }
  /*
  *
  *
  * This life cycle hook is called when the component is initialized
  */
  ngOnInit(): void {
    this.scanSetting = this.facadeService.dataService.getScanSettingsData() || {} as DeviceScanSettings;
    this.updateCheckBox();
    this.facadeService.apiService.updateScanningDeviceInRealTime();
    if (isNullOrEmpty(this.scanSetting)) {
      this.scanSetting.port = 4840;
      this.scanSetting.fromIPAddress = '';
      this.scanSetting.toIPAddress = '';
    }
    this.scanSettingForm = new FormGroup(
      {
        port: new UntypedFormControl(this.scanSetting.port, [
          Validators.required,
          portValidator(this.facadeService.commonService.projectRegex.portValidationRegex)
        ]),
        fromIPAddress: new UntypedFormControl(this.scanSetting.fromIPAddress, [
          Validators.required,
          ipValidator(this.facadeService.commonService.projectRegex.ipValidationRegex)
        ]),
        toIPAddress: new UntypedFormControl(this.scanSetting.toIPAddress, [
          Validators.required,
          ipValidator(this.facadeService.commonService.projectRegex.ipValidationRegex)
        ])
      },
      ipRangeValidator('fromIPAddress', 'toIPAddress')
    );
    this.scanSettingForm.valueChanges
      .pipe(debounceTime(Numeric.THOUSAND))
      .subscribe(data => {
        if (this.scanSettingForm.valid) {
          this.facadeService.dataService.addOrUpdateDeviceScanSettings(data);
        }
    });

  }
  /*
  *
  *
  * If the from ip address is filled on focus out to ip address is also filled
  */
  onFocusOutEvent(_event){
    if(this.scanSettingForm.controls.fromIPAddress.valid && this.scanSettingForm.controls.toIPAddress.value === ''){
      this.scanSettingForm.controls.toIPAddress.setValue(this.scanSettingForm.controls.fromIPAddress.value);
    }
  }
  /*
  *
  *
  * Function to listen to each device scan
  */
  listenToScannedDevices() {
    this.subscriptions.add(
      this.facadeService.commonService.scannedDevicesList$
        .pipe(
          filter(scannedDevices => scannedDevices && !this.isCancelled)
        )
        .subscribe((deviceList: DevicesDetails[]) => {
          this.facadeService.overlayService.changeOverlayState(false);
          if (deviceList.length > 0) {
            this.deviceListInGrid = deviceList.map(device => ({ ...device, isSelected: false }));
          } else {
            this.initializeDeviceListInGrid();
          }
        }));
  }
  /*
  *
  *
  * Function to get the scan count
  */
  listenToScanningCount(totalNoOfDevicesInRange) {
    this.facadeService.commonService.scanningDevicesCount$
      .pipe(
        filter(deviceCount => deviceCount < totalNoOfDevicesInRange)
      )
      .subscribe((scannedDeviceCount: number) => {
        this.setScanDevicesLoader(scannedDeviceCount);
      });
  }

  /**
   *
   *
   *
   *
   * checks for add details form validation
   */
  initializeDeviceListInGrid() {
    this.deviceListInGrid = this.createFixedArray();
    this.deviceListInGrid[0] = {
      isValid: false,
      deviceName: START_SCAN
    };
  }

  get showNoDeviceData() {
    return this.deviceListInGrid[0].deviceName === START_SCAN;
  }

  /**
   *
   *
   *
   *
   * checks for add details form validation
   */
  scanSettingsExists(): boolean {
    let result = false;
    if (this.scanSettingForm && this.scanSettingForm.valid) {
      result = true;
    }
    return result;
  }
/*
  *
  *
  * This function is called when start scan button is clicked
  */
  startScan(originalEvent) {
    if (this.scanSettingForm.status === 'INVALID' || this.toIpAddressGreaterThanFromAddress()) {
      this.scanSettingsPanelRef.toggle(originalEvent);
    } else {
      this.isSubscriptionActive = true;
      this.scanSettingsPanelRef.hide();
      this.isCancelled = false;
      this.initializeDeviceListInGrid();
      this.callScanning();
    }
  }
  /*
  *
  *
  * Returns the no of devices within the range given
  */
  getTotalNoOfDevicesInRange(formData) {
    const { fromIPAddress, toIPAddress } = formData.value;
    const fromIPHostPart = getHostPartFromIp(fromIPAddress);
    const toIPHostPart = getHostPartFromIp(toIPAddress);
    return (toIPHostPart - fromIPHostPart) + 1;
  }
  /*
  *
  *
  * This function is called to scan the devices in range
  */
  callScanning() {
    const requestPayload = this.generateRequestPayload(this.scanSettingForm);
    this.totalNoOfDevicesInRange = this.getTotalNoOfDevicesInRange(this.scanSettingForm);
    this.listenToScannedDevices();
    this.listenToScanningCount(this.totalNoOfDevicesInRange);
    this.facadeService.commonService.resetDeviceScanningCount();
    this.subscriptions.add(
      this.facadeService.apiService
        .scanDevice(requestPayload).pipe(
          filter((response: DeviceScanSuccessResponse) => response.message === 'success'
          )
        ).subscribe(() => this.facadeService.apiService.listenToScanningOfDevices())
    );
  }

  /*
  *
  *
  * Function is used to generate payload for device scan
  */

  generateRequestPayload(formData): DeviceScanRequestPayload {
    const { fromIPAddress, port, toIPAddress } = formData.value;
    return {
      port: port,
      deviceIpRange: {
        start: fromIPAddress,
        end: toIPAddress
      }
    };
  }
  /*
  *
  *
  * Function to add the selected devices
  */
  addSelectedDevice(i:number) {
    this.deviceListInGrid[i].isSelected = !this.deviceListInGrid[i].isSelected;
    this.updateDeviceSelectionToParent();
  }
  /*
  *
  *
  * Function is called when the device is selected or deselected
  */
  toggleDevicesSelection(event) {
    let isSelected: boolean;
    this.deviceListInGrid = this.deviceListInGrid.map(device =>
      {
        if(device && (device.isValidAddressModel === false || device.isSecurityPolicyValid === false)) {
          isSelected = false;
        }
        else {
          isSelected =  event.target.checked;
        }
        return {
          ...device,
          isSelected
        };
      }
    );
    this.updateDeviceSelectionToParent();
  }

  updateDeviceSelectionToParent() {
    const selectedDevices = this.deviceListInGrid.filter(device => device.isSelected);
    if (selectedDevices.length < this.deviceListInGrid.length) {
      this.deviceHeaderCheckbox = false;
    }
    if (selectedDevices.length === this.deviceListInGrid.length) {
      this.deviceHeaderCheckbox = true;
    }
    this.onDevicesAdded.emit(selectedDevices);
  }
  /**
   *
   *  validation error if device port error is wrong
   */
  devicePortError() {
    return isFormFieldHasError(this.scanSettingForm, 'port', 'portValidationError');
  }
  /**
   *
   *  validation error if to ip address is wrong
   */
  toIPError() {
    return isFormFieldHasError(this.scanSettingForm, 'toIPAddress', 'ipAddressValidationError');
  }
  /**
   *
   *  validation error if to from address is wrong
   */
  fromIPError() {
    return isFormFieldHasError(this.scanSettingForm, 'fromIPAddress', 'ipAddressValidationError');
  }

  /**
   *
   * @returns validation error if toIpAddress range greater than fromIpAddress Range
   */
  toIpAddressGreaterThanFromAddress() {
    const { fromIPAddress, toIPAddress } = this.scanSettingForm.value;
    return (
      !this.fromIPError() &&
      this.scanSettingForm.controls['fromIPAddress'].valid &&
      validateField(this.scanSettingForm, 'toIPAddress') &&
      validateAddress(fromIPAddress, toIPAddress)
    );
  }

  /**
   *
   * @returns validates if the from and to ip address is valid
   * or it is dirty(used for saved projects)
   */
  isFormFieldsValid() {
    return this.scanSettingForm.controls['fromIPAddress'].valid &&
      (this.scanSettingForm.controls['toIPAddress'].valid || this.scanSettingForm.controls['toIPAddress'].dirty);
  }
  /**
   *
   * @returns validates if the first three parts of the
   * from and to ip address is same
   */
  ipRangeError() {
    return (
      this.isFormFieldsValid() &&
      this.scanSettingForm.errors && this.scanSettingForm.errors.hasOwnProperty('ipRangeValidationError')
    );
  }
  /**
   *
   *
   *  This life cycle hook is called when the page is destroyed
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.facadeService.apiService.unsubscribeToScanningDevicesEvents();
  }

  private setScanDevicesLoader(deviceCount): void {
    this.facadeService.overlayService.loader({
      header: this.facadeService.translateService.instant('overlay.loader.scanningDevices.header'),
      message: {
        title: this.facadeService.translateService.instant('overlay.loader.scanningDevices.header'),
        content: [this.facadeService.translateService.instant('overlay.loader.scanningDevices.message.content',
        {deviceCount:deviceCount,
        totalNoOfDevicesInRange:this.totalNoOfDevicesInRange})]
      },
      cancelLabel: this.facadeService.translateService.instant('overlay.loader.scanningDevices.cancelLabel'),
      enableCancelButton: true,
      cancelCallBack: () => {
        this.cancelScanning();
      }
    });
    this.facadeService.overlayService.changeOverlayState(true);
  }



  private updateCheckBox() {
    this.facadeService.commonService.devicesAddedInGrid$.subscribe(devicesAddedInGrid => {
      this.deviceListInGrid = this.deviceListInGrid.map(device => {
        const isDeviceAddedToGrid = devicesAddedInGrid.find(deviceInGrid => device && deviceInGrid.address === device.address);
        if (!isDeviceAddedToGrid && device) {
          device.isSelected = false;
        }
        return device;
      });
      this.updateHeaderCheckbox();
    }
    );
  }

  private updateHeaderCheckbox() {
    const selectedDevice = this.deviceListInGrid.filter(device => Boolean(device && device.isSelected));
    if (selectedDevice.length < this.deviceListInGrid.length) {
      this.deviceHeaderCheckbox = false;
    }
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


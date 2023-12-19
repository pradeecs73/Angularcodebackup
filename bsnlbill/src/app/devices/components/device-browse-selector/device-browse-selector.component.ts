/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { DeviceConfig } from '../../../models/targetmodel.interface';

@Component({
  selector: 'app-device-browse-selector',
  templateUrl: './device-browse-selector.component.html',
  styleUrls: ['./device-browse-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeviceBrowseSelectorComponent {

  @Output() onPreviousPage = new EventEmitter();
  @Output() onDeviceAltered = new EventEmitter();
  @Input() devicesAddedToGrid: Array<DeviceConfig>;
  @Output() onScannedDeviceAdded = new EventEmitter();

  /**
  * When add button is clicked this function is called
  */
  addDeviceToList(data: Array<DeviceConfig>) {
    this.onDeviceAltered.emit(data);

  }
  /**
    * When device is added to the list.This function is called
    */
  onDevicesAdded(data) {
    this.onScannedDeviceAdded.emit(data);
  }

}

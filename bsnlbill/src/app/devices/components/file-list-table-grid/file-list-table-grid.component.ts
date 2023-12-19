/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-list-table-grid',
  templateUrl: './file-list-table-grid.component.html',
  styleUrls: ['./file-list-table-grid.component.scss']
})
export class FileListTableGridComponent {
  /*
  *
  *Variables for component
  * 
  */
  @Input()
  tabView: string;
  @Input()
  uploadFileTableColumns;
  @Input()
  showNoDeviceData;
  @Input()
  deviceListInGrid;

  @Output() deleteFromGrid = new EventEmitter();
  @Output() customValidationForDeviceAddress = new EventEmitter();
  /*
  *
  * Function is called when the device is deleted from the grid
  * 
  */
  deleteDeviceFromGrid(device) {
    this.deleteFromGrid.emit(device);

  }
  /*
  *
  * Validation for address
  * 
  */
  customValidationForAddress(event, i) {
    this.customValidationForDeviceAddress.emit({event, i});
  }
}


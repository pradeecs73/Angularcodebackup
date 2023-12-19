/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Device } from '../../../models/targetmodel.interface';
import { DeviceRightbarComponent } from '../../../livelink-editor/components/device-tree/device-tree.component';
@Component({
  selector: 'devices-right-sidebar',
  templateUrl: './devices-right-sidebar.component.html',
  styleUrls: ['./devices-right-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DevicesRightSidebarComponent {
/**
     *
     *Component variables
  */
  @Input() selectedDeviceData: Device;
  @Output() removeElementWidth = new EventEmitter();
  
  viewType = 'full';
  isUpdateEnabled = true;
  @ViewChild(DeviceRightbarComponent) treeView: DeviceRightbarComponent;

  /**
     *
     *Called when the side panel is collapsed
  */
  removeWidth(mode) {
    this.viewType = mode;
    const emitObj = { mode: mode, position: 'right' };
    this.removeElementWidth.emit(emitObj);
  }
}

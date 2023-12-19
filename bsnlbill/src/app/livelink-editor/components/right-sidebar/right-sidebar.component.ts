/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DeviceRightbarComponent } from '../device-tree/device-tree.component';


import { Observable } from 'rxjs';
import { BaseConnector } from '../../../opcua/opcnodes/baseConnector';
import { FacadeService } from '../../services/facade.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RightSidebarComponent implements OnInit{
  /*
  * Right side bar for editor page
  */
  viewType = 'full';
  isUpdateEnabled = true;
  selectedConnection$:Observable<BaseConnector>;
 /*
  * Event emitter when the right sidebar is collapsed or expanded
  *
  *
  */
  @Output() removeElementWidth = new EventEmitter();
  @ViewChild(DeviceRightbarComponent) treeView: DeviceRightbarComponent;
  constructor(public readonly common: CommonService,
    private readonly facadeService: FacadeService) { }

  ngOnInit(): void {
    this.selectedConnection$ = this.facadeService.editorService.selectedConnectionObs;
  }
  /*
  * Function to collapse or expand the right sidebar
  *
  *
  */
  removeWidth(mode) {
    this.viewType = mode;
    const emitObj = { mode: mode, position: 'right' };
    this.removeElementWidth.emit(emitObj);
    this.facadeService.editorService.setDevicePropertyPanelData(mode);
  }
}

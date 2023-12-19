/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, Output } from '@angular/core';
import { FacadeService } from '../../services/facade.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent  {
  /*
  * Event emitter when the left sidebar is collapsed or expanded
  */
  @Output() removeElementWidth = new EventEmitter();

  constructor(private readonly facadeService: FacadeService){

  }
 /*
  * Function to collapse or expand the left sidebar
  */
  removeWidth(event) {
    this.facadeService.editorService.setDeviceTreePanelData(event.mode);
    this.removeElementWidth.emit(event);
  }
}

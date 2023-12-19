/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, ElementRef, OnInit } from '@angular/core';
import { Device } from '../models/targetmodel.interface';
import { FacadeService } from '../livelink-editor/services/facade.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {


  isIframe = false;
  selectedDeviceData: Device;

  constructor(
    private readonly elementRef:ElementRef,
    private readonly facadeService: FacadeService) { }
    /*
    *
    * Life cycle hook is called when the component is initialized
    */
  ngOnInit() {
    this.isIframe = this.inIframe();
  }

  inIframe() {
    /*
    *
    * will be true if iFrame else False
    */
    try {
      return window.self !== window.top; // 
    } catch (e) {
      return true;
    }
  }
   /*
    *
    * Function to display device properties
    */
  displayDeviceProperties(deviceData: Device){
    this.selectedDeviceData = deviceData;
  }
   /*
    *
    * Function is called when the panel is collapsed or expanded
    */
  removeElementWidth(value) {
    this.facadeService.resizeService.resizeDeviceWidth(value,this.elementRef);
  }
}

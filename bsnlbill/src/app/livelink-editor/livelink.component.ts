/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, ElementRef, OnInit } from '@angular/core';
import { FacadeService } from './services/facade.service';
@Component({
  selector: 'app-livelink',
  templateUrl: './livelink.component.html',
  styleUrls: ['./livelink.component.scss']
})
export class LiveLinkComponent implements OnInit {
  /*
  * Component for editor page
  */
  isIframe = false;

  constructor( private readonly facadeService: FacadeService,
    private readonly elementRef: ElementRef) {
  }

  ngOnInit() {
    this.facadeService.commonService.updateMenu('plantview');
    this.isIframe = this.inIframe();
  }
  /*
  * Function to collapse or expand the panels
  */
  removeElementWidth(value) {
    this.facadeService.resizeService.resizeEditorWidth(value, this.elementRef);
  }
  /*
  * will be true if iFrame else False
  */
  inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {
  isIframe = false;
  /*
  *called when the component initialized 
  */
  ngOnInit() {

    this.isIframe = this.inIframe();

  }

  inIframe() {
    try {
        /*
        *
        *  will be true if iFrame else False
        *
        */
      return window.self !== window.top; 
    } catch (e) {
      return true;
    }
  }
}

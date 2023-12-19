/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(public readonly elem: ElementRef) { }

/*
*
*  Function to close the nav bar
*
*/
  closeNav() {
    const nav = this.elem.nativeElement.querySelector('#sideNav');
    nav.style.width = 0;
  }
}

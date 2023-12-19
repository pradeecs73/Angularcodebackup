/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FacadeService } from '../../livelink-editor/services/facade.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class AboutPageComponent implements OnInit {

  constructor(public facadeService: FacadeService) { }

  ngOnInit(): void {
    this.facadeService.commonService.updateMenu('about');
  }

}

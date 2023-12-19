/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, OnInit } from '@angular/core';
import versionData from '../../../assets/document/version.json';
import { productVersion } from '../../utility/constant';

@Component({
  selector: 'app-about-details',
  templateUrl: './about-details.component.html',
  styleUrls: ['./about-details.component.scss']
})
export class AboutDetailsComponent implements OnInit {
  baseVersion;
  fullVersion;
  versionDetails;
  constructor() { /* this constructor is empty */  this.versionDetails = versionData; }

  ngOnInit(): void {
    this.baseVersion = this.versionDetails['base version'] || productVersion.productVersion;
    this.fullVersion = this.versionDetails['full version'] || productVersion.fullVersion;
  }

}

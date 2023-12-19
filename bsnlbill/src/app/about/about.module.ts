/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

/**
 * Import Statements
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutPageComponent } from './about-page/about-page.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PrimengModule } from '../vendors/primeng.module';
import { AboutDetailsComponent } from './about-details/about-details.component';


/**
 * Configurations
 */
@NgModule({
  declarations: [
    AboutPageComponent,
    AboutDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: AboutPageComponent}
  ]),
  TranslateModule.forChild({}),
  PrimengModule
  ]
})

/**
 * Export class
 */
export class AboutModule { }

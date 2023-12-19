/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

/*
* Modules imported
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationSettingsComponent } from './configuration-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../vendors/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';


/*
* 
*
*Configurations for the modules
*/

@NgModule({
  declarations: [
    ConfigurationSettingsComponent,
    GeneralSettingsComponent
  ],
  imports: [
    RouterModule.forChild([
      {path: '', component: ConfigurationSettingsComponent}
  ]),
  TranslateModule.forChild({}),
  CommonModule,
  PrimengModule,
  FormsModule,
  ReactiveFormsModule,
  SharedModule
  ]
})

/*
* 
*
*Class for configuration settings module
*/
export class ConfigurationSettingsModule { }

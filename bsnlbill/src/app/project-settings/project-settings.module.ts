/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

/*
* Modules
*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../vendors/primeng.module';
/*
* Components
*/
import { ProjectSettingsComponent } from './project-settings.component';
import { SecuritySettingsComponent } from './components/security-settings/security-settings.component';
import { LiveLinkEditorGuardService } from '../services/livelink-guard.service';
import { HomeGuardService } from '../services/home-guard-service';
import { TranslateModule } from '@ngx-translate/core';

/*
* Configuration
*/
@NgModule({
    declarations :[
        ProjectSettingsComponent,
        SecuritySettingsComponent
    ],
    imports :[
        RouterModule.forChild([
            {path: '', component: ProjectSettingsComponent,canActivate: [LiveLinkEditorGuardService,HomeGuardService]}
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
* class
*/
export class ProjectSettingsModule {}

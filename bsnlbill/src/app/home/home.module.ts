/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
* 
*
*Modules imported
*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../vendors/primeng.module';

/*
* Components wrt to home page
*/
import { CreateEditProjectComponent } from './../home/components/create-edit-project/create-edit-project.component';
import { ImportProjectComponent } from './../home/components/import-project/import-project.component';
import { OpenProjectComponent } from './../home/components/open-project/open-project.component';
import { HomeGuardService } from './../services/home-guard-service';
import { HomeComponent } from './home.component';

/*
* 
*
*Configurations for the modules
*/
@NgModule({
    declarations :[
        CreateEditProjectComponent,
        HomeComponent,
        ImportProjectComponent,
        OpenProjectComponent
    ],
    imports :[
        RouterModule.forChild([
            {path: '', component: HomeComponent ,canActivate: [HomeGuardService]}
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
* Class for home module
*/
export class HomeModule {}

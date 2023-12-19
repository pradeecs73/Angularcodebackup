/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
  *
  * Modules
  *
*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PrimengModule } from '../vendors/primeng.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
/*
  *
  *Components wrt device page
  *
  *
*/
import {
    DeviceAddDetailsSelectorComponent
} from './components/device-add-details-selector/device-add-details-selector.component';

import {
    DeviceAddMechanismSelectorComponent
} from './components/device-add-mechanism-selector/device-add-mechanism-selector.component';
import { DeviceDetailsViewComponent } from './components/device-details-view/device-details-view.component';
import { DevicePropertiesPanelComponent } from './components/device-properties-panel/device-properties-panel.component';
import { DevicesBaseModalDialogComponent } from './components/devices-base-modal-dialog/devices-base-modal-dialog.component';
import {
    DevicesImportFromFileModalComponent
} from './components/devices-import-from-file-modal/devices-import-from-file-modal.component';
import { DevicesLeftSidebarComponent } from './components/devices-left-sidebar/devices-sidebar.component';
import { DevicesMainViewComponent } from './components/devices-main-view/devices-main-view.component';
import { DevicesRightSidebarComponent } from './components/devices-right-sidebar/devices-right-sidebar.component';
import { FileListTableGridComponent } from './components/file-list-table-grid/file-list-table-grid.component';
import { DevicesComponent } from './devices.component';
import { DeviceBrowseSelectorComponent } from './components/device-browse-selector/device-browse-selector.component';
import { DevicesScanComponent } from './components/devices-scan/devices-scan.component';
import { DeviceAuthDialogComponent } from './components/device-auth-dialog/device-auth-dialog.component';
import { AddProjectProtectionComponent } from './components/add-project-protection/add-project-protection.component';
/*
  *
  * Services wrt service page
  *
  *
*/
import { HomeGuardService } from '../services/home-guard-service';
import { LiveLinkEditorGuardService } from '../services/livelink-guard.service';

/**
 *
 *
 * Module configuration
 */
@NgModule({
    declarations :[
        DevicesComponent,
        DevicesLeftSidebarComponent,
        DevicesBaseModalDialogComponent ,
        DevicesMainViewComponent,
        DeviceAddMechanismSelectorComponent,
        DeviceAddDetailsSelectorComponent,
        DevicesRightSidebarComponent,
        DevicePropertiesPanelComponent,
        DeviceDetailsViewComponent,
        DevicesImportFromFileModalComponent,
        FileListTableGridComponent,
        DeviceBrowseSelectorComponent,
        DevicesScanComponent,
        DeviceAuthDialogComponent,
        AddProjectProtectionComponent
    ],
    imports :[
        RouterModule.forChild([
            {path: '', component: DevicesComponent ,canActivate: [LiveLinkEditorGuardService,HomeGuardService]}
        ]),
        TranslateModule.forChild({}),
        CommonModule,
        FormsModule,
        PrimengModule,
        ReactiveFormsModule,
        SharedModule
    ]
})
/*
* Device module class
*/
export class DevicesModule {}

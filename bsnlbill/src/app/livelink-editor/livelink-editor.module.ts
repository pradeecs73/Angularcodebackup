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
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { PrimengModule } from '../vendors/primeng.module';
/*
*
* Services
*
*/
import { LiveLinkEditorGuardService } from '../services/livelink-guard.service';
/*
*
* Components
*
*/
import { ConnectionListComponent } from './components/connection-list/connection-list.component';
import { ConnectionPropertiesPanelComponent } from './components/connection-properties-panel/connection-properties-panel.component';
import { DeviceRightbarComponent } from './components/device-tree/device-tree.component';
import { InterfaceExposedAreaComponent } from './components/interface-exposed-area/interface-exposed-area.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { MainComponent } from './components/main/main.component';
import { MenuViewComponent } from './components/menu-view/menu-view.component';
import { NodeConnectionSearchGridComponent } from './components/node-connection-search-grid/node-connection-search-grid.component';
import { NodePropertiesPanelComponent } from './components/node-properties-panel/node-properties-panel.component';
import { NodeComponent } from './components/node/node.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { TreeMenuComponent } from './components/tree-menu/tree-menu.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { LiveLinkComponent } from './livelink.component';
/*
*
* Configuration
*
*/
@NgModule({
    declarations :[
        TreeViewComponent,
        MainComponent,
        PropertiesPanelComponent,
        RightSidebarComponent,
        MenuViewComponent,
        LeftSidebarComponent,
        NodeComponent,
        ConnectionListComponent,
        LiveLinkComponent,
        DeviceRightbarComponent,
        ConnectionPropertiesPanelComponent,
        NodePropertiesPanelComponent,
        TreeMenuComponent,
        NodeConnectionSearchGridComponent,
        InterfaceExposedAreaComponent
    ],
    imports :[
        RouterModule.forChild([
            {path: '', component: LiveLinkComponent ,canActivate: [LiveLinkEditorGuardService]}
        ]),
        CommonModule,
        TranslateModule.forChild({}),
        PrimengModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    providers:[
        //DragDropService
    ]
})

/*
*
* Plant editor module class
*/
export class LiveLinkModule {}

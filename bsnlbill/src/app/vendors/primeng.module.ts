/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
*
* Other modules
*
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
/*
*
* Prime ng modules
*
*
*/
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule} from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import {DragDropModule} from 'primeng/dragdrop';
import {DropdownModule} from 'primeng/dropdown';
/*
*
* Module configuration
*
*/
@NgModule({
    /*
    * declarations
    */
    declarations: [],
    /*
    * modules imported
    */
    imports: [
        CommonModule,
        PanelModule,
        TabViewModule,
        MenuModule,
        ToolbarModule,
        PanelMenuModule,
        ButtonModule,
        TooltipModule,
        BreadcrumbModule,
        OverlayPanelModule,
        CardModule,
        ToastModule,
        ToggleButtonModule,
        AccordionModule,
        TableModule,
        InputTextModule,
        CheckboxModule,
        DialogModule,
        HttpClientModule,
        TreeTableModule,
        DragDropModule,
        DropdownModule
    ],
    /*
    * modules exported
    *
    */
    exports:
        [
            CommonModule,
            PanelModule,
            TabViewModule,
            MenuModule,
            ToolbarModule,
            ButtonModule,
            PanelMenuModule,
            TooltipModule,
            BreadcrumbModule,
            OverlayPanelModule,
            CardModule,
            ToastModule,
            ToggleButtonModule,
            AccordionModule,
            TableModule,
            InputTextModule,
            CheckboxModule,
            DialogModule,
            HttpClientModule,
            TreeTableModule,
            TreeModule,
            DropdownModule
        ]

})
/*
*
* Primengmodule class
*
*/
export class PrimengModule { }

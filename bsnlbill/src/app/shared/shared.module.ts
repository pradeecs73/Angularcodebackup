/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
*
* Imports related to shared module
*
*/
import { FactoryProvider, ModuleWithProviders, NgModule } from '@angular/core';
import { PrimengModule } from '../vendors/primeng.module';
import { DynamicDialogDirective } from './dialog/form-dialog/directives/dynamic-dialog.directive';
import { FormDialogComponent } from './dialog/form-dialog/form-dialog.component';
import { OverlayComponent } from './dialog/overlay/overlay.component';
import { ProjectDataService } from './services/dataservice/project-data.service';
import { OverlayService } from './services/overlay.service';

// Pipes
import { DefaultAddressPipe } from './pipes/defaultAddress.pipe';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { FilterBySubstringPipe } from './pipes/filterBySubstring.pipe';

import { DisableIfUnauthorizedDirective } from '../directives/access-check/access-check.directive';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { StrategyManagerService } from '../livelink-editor/services/strategy-manager.service';
import { AreaOperationsStrategy } from '../livelink-editor/strategy/area-operations-strategy';
import { NestedDifferentParentAreaStrategy } from '../livelink-editor/strategy/nested-area-under-different-parent-operation-strategy';
import { NestedSiblingsAreaStrategy } from '../livelink-editor/strategy/nested-sibling-area-operation-strategy';
import { RootOrSameAreaStrategy } from '../livelink-editor/strategy/root-or-same-area-operation-strategy';
import { PasswordPopupComponent } from './../project-settings/components/password-popup/password-popup.component';
import { SettingsPopupFooterComponent } from './../project-settings/components/settings-popup-footer/settings-popup-footer.component';
import { ResizableDirective } from './directives/resizableDirective.directive';
import { PasswordValidationComponent } from './dialog/password-validation/password-validation.component';
import { FileBrowseComponent } from './file-browse/file-browse.component';
import { FormatDatePipe } from './pipes/formatDate.pipe';
/*
*
* Strategy service factory
*
*/
export function strategyServiceFactory(...strategies: Array<AreaOperationsStrategy>): StrategyManagerService {
  return new StrategyManagerService(strategies);
}
/*
*
* Provider for area strategy
*
*/
const AREA_STRATEGY_PROVIDER: FactoryProvider = {
  provide: StrategyManagerService,
  useFactory: strategyServiceFactory,
  deps: [
    NestedDifferentParentAreaStrategy,
    RootOrSameAreaStrategy,
    NestedSiblingsAreaStrategy
  ]
};
/*
*
* Configuration
*
*/
@NgModule({
  declarations: [
    OverlayComponent,
    FileBrowseComponent,
    FormDialogComponent,
    DynamicDialogDirective,
    EllipsisPipe,
    FilterBySubstringPipe,
    DefaultAddressPipe,
    FormatDatePipe,
    PasswordValidationComponent,
    PasswordPopupComponent,
    SettingsPopupFooterComponent,
    DisableIfUnauthorizedDirective,
    ResizableDirective
  ],
  imports: [PrimengModule,FormsModule,ReactiveFormsModule,TranslateModule.forChild({}),],
  exports: [
    OverlayComponent,
    FileBrowseComponent,
    FormDialogComponent,
    DynamicDialogDirective,
    EllipsisPipe,
    FilterBySubstringPipe,
    DefaultAddressPipe,
    FormatDatePipe,
    PasswordPopupComponent,
    SettingsPopupFooterComponent,
    DisableIfUnauthorizedDirective,
    ResizableDirective
  ]
})
/*
*
* Shared module export class
*
*/
export class SharedModule {
  /*
  *
  * Root
  *
  */
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        ProjectDataService,
        AREA_STRATEGY_PROVIDER,
        NestedDifferentParentAreaStrategy,
        RootOrSameAreaStrategy,
        NestedSiblingsAreaStrategy,
        OverlayService]
    };
  }
  /*
  *
  * child
  *
  */
  static forChild(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [AREA_STRATEGY_PROVIDER]
    };
  }
}

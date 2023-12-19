/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
  *
  * angular modules
  *
*/
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule,HTTP_INTERCEPTORS,HttpClient, HttpBackend} from '@angular/common/http';
/*
  *
  * third party modules
  *
*/

import { PrimengModule } from './vendors/primeng.module';
/*
  *
  * user-defined modules
  *
*/
import {ServiceInjectorModule } from './opcua/adapter/service-injector.module';

import { MenuComponent } from './components/layout/menu/menu.component';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/layout/app-header/app-header.component';
import { NotificationMsgListComponent } from './components/layout/app-header/error-list/notification-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { PopoverComponent } from './shared/popover/popover.component';
/*
  *
  * ngRx
  *
*/
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducer } from './store/app.reducer';
import { DeviceTreeEffects } from './store/device-tree/device-tree.effects';
/*
  *
  * Directives
  *
*/
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
/*
  *
  * services
  *
*/
import { ConfigService } from './services/config.service';
import { ApiService } from './services/api.service';
import { ResizeService } from './services/resize.service';
import { DrawService } from './services/draw.service';
import { CommonService } from './services/common.service';
import { SocketService } from './services/socket.service';
import { MessageService } from 'primeng/api';
import { AlignConnectionsService } from './services/align-connections.service';
import { LayoutComponent } from './components/layout/layout.component';
import { BodyComponent } from './components/layout/body/body.component';
import { LiveLinkEditorGuardService } from './services/livelink-guard.service';
import { SharedModule } from './shared/shared.module';
import { HomeGuardService } from './services/home-guard-service';
import { ProjectDataService } from './shared/services/dataservice/project-data.service';
import { DragDropService } from './livelink-editor/services/drag-drop.service';
import {InterceptService} from './interceptor/httpconfig.interceptor';
import {ErrorHandleService} from './services/error-handle.service';
import { XmlParsingHelperService } from './services/xml-parsing-helper.service';
import { NotificationPipe } from './shared/pipes/notification.pipe';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgIdleModule } from '@ng-idle/core';
import { ZoomOperationsService } from './services/zoom-operations.service';
/*
  *
  * Used for translations
  *
*/
const initializeConfig = (configService:ConfigService) =>  () => configService.getConfig();
export function httpLoaderFactory(httpBackend: HttpBackend) {
  return new TranslateHttpLoader(new HttpClient(httpBackend));
}
/*
  *
  * Configuration
  *
*/
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AppHeaderComponent,
    NotificationMsgListComponent,
    SettingsComponent,
    LoaderComponent,
    PopoverComponent,
    ClickOutsideDirective,
    LayoutComponent,
    BodyComponent,
    NotificationPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    ServiceInjectorModule,
    StoreModule.forRoot(appReducer),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpBackend]
      },
      defaultLanguage : 'en'
    }),
    EffectsModule.forRoot([DeviceTreeEffects]),
    SharedModule.forRoot(),
    NgIdleModule.forRoot()

  ],
  providers: [
    ApiService,
    DrawService,
    CommonService,
    SocketService,
    MessageService,
    AlignConnectionsService,
    LiveLinkEditorGuardService,
    ProjectDataService,
    HomeGuardService,
    DragDropService,
    ResizeService,
    ErrorHandleService,
    XmlParsingHelperService,
    ZoomOperationsService,
    {provide:HTTP_INTERCEPTORS,useClass:InterceptService,multi:true},
    {
      provide: APP_INITIALIZER,
      useFactory: initializeConfig,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

/*
* App module class
*/
export class AppModule { }

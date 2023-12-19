/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
// Import statements
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


/*
*
* Routes are configured for the application
*
*/
const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren : () => import('./home/home.module').then(m => m.HomeModule) },
  {path: 'devices', loadChildren : () => import('./devices/devices.module').then(m => m.DevicesModule)},
  {path: 'editor', loadChildren : () => import('./livelink-editor/livelink-editor.module').then(m => m.LiveLinkModule)},
  {path: 'settings', loadChildren : () => import('./project-settings/project-settings.module').then(m => m.ProjectSettingsModule)},
  {path: 'configuration-settings', loadChildren : () => import('./configuration-settings/configuration-settings.module').then(m => m.ConfigurationSettingsModule)},
  {path: 'about', loadChildren : () => import('./about/about.module').then(m => m.AboutModule)}
];
@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true, relativeLinkResolution: 'legacy' , preloadingStrategy :PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

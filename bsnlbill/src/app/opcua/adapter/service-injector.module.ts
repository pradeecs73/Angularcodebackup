/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { NgModule, Injector } from '@angular/core';

export let ServiceInjector: Injector;
 /*
  * Service injector module
  */
@NgModule()
export class ServiceInjectorModule {
  constructor(private readonly injector: Injector) {
    ServiceInjector = this.injector;
  }
}

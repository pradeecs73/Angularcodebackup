/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamicDialog]'
})
export class DynamicDialogDirective {
  /*
  * Directive to dynamically load the components in form-dialog component
  *
  */
  constructor(public viewContainerRef: ViewContainerRef) { }
}

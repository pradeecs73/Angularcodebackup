/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Pipe, PipeTransform } from '@angular/core';
/*
*In Nodeset upload , if the address starts with
*opc.tcp://0.0.0 and random port,then it is transformed to
*opc.tcp://0.0.0.0:0000
*
*/
@Pipe({ name: 'defaultAddressPipe' })
export class DefaultAddressPipe implements PipeTransform {
  transform(value: string): string {
    if (value.includes('opc.tcp://0.0.0')) {
      return 'opc.tcp://0.0.0.0:0000';
    } else {
      return value;
    }
  }
}

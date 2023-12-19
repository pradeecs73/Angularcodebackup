/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*
*/

import { Pipe, PipeTransform } from '@angular/core';
import { Properties } from '../../models/targetmodel.interface';

@Pipe({
  name: 'filterBySubstring'
})
export class FilterBySubstringPipe implements PipeTransform {
  transform(deviceSets: Properties[], ...args: string[]): string {
    let value:string;
    /**Loop all devicesets and find only matched data */
    for (const deviceSet of deviceSets) {
      if  (deviceSet.name === args[1] ) {
        value = deviceSet.value;
      }

    }
    const substringValue = args[0];
    /* It extracts the text after the provided substring
       value:  locale=null text=CPU-1234
       substring: text=
       result: extracts CPU-1234
    */
    if (value && value.indexOf(substringValue) !== -1) {
      return value.substring(
        value.indexOf(substringValue) + substringValue.length
      );
    } else {
      /*
      *If the substring is not present it returns the original value
      *
      */
      return value;
    }
  }
}

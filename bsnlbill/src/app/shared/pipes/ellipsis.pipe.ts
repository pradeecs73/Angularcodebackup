/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Pipe, PipeTransform } from '@angular/core';
import { htmlStrippedRegex } from '../../../app/utility/constant';
import { Numeric } from '../../enum/enum';
import { checkRegexSafety } from '../services/validators.service';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {
  /*
  * Truncates the text and appends '...' if the length is greater than the maxLength
  */
  transform(value: string, maxLength: number = Numeric.SEVENTEEN): string {
    let result = '';
    if (value) {
      const htmlStripped = this.stripTags(value.toString());
      /*
      * If the length is greater than maxLength
      */
      if (htmlStripped.length > maxLength) {
        result = `${htmlStripped.slice(0, maxLength)}...`;
      }
      /*
      * If the length is lesser than maxLength
      */
      else {
        result = htmlStripped;
      }
    }
    return result;
  }

  stripTags(htmlToBeStripped: string) {
    if (checkRegexSafety(htmlStrippedRegex)) {
      return htmlToBeStripped.replace(htmlStrippedRegex, "");
    }
    return htmlToBeStripped;
  }

}

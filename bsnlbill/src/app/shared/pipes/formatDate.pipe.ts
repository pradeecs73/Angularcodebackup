/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Pipe, PipeTransform } from '@angular/core';
import { multiLanguage } from '../../utility/constant';

@Pipe({
  //name of the pipe
  name: 'formatDate'
})
 //used to change the time format based on country
export class FormatDatePipe implements PipeTransform {
  timezone: string;
  //function to transform the time which accepts time and language as inputs
  transform(time: string, lang = 'en') {
    switch (lang) {
        //german language
        case multiLanguage.de.lang:
          this.timezone = multiLanguage.de.key;
          break;
        //english language
        case multiLanguage.en.lang:
          this.timezone = multiLanguage.en.key;
          break;
        //default case if the language is not provided
        default:
          break;
      }
      //format the date
      return new Date(time).toLocaleString(this.timezone).split(',')[0];
  }
}


/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { AbstractControl, AbstractControlOptions, ValidatorFn } from '@angular/forms';
import safe_regex from 'safe-regex';
/*
* Validate project name
*/
export const projectNameValidator = (regexArr: string[]): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    let result = true;
    for (const item of regexArr) {
      const regex = convertStringToRegex(item);
      if (!validateRegex(regex, control.value)) {
        result = false;
        break;
      }
    }
    let res = null;
    if(!result){
      res = { projectNameError: { value: control.value } };
    }
    return res;
  };
};
/*
*custom validator for address control in add details form
*matches the input with regex expression
*
*/
export const deviceUrlValidator = (regexString: string): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    let result = true;

    const regex = convertStringToRegex(regexString);
    if (!validateRegex(regex, control.value)) {
      result = false;
    }
    let res = null;
    if(!result){
      res = { deviceUrlValidationError: { value: control.value } };
    }
    return res;

  };
};
/*
* Validate ip address
*
*/
export const ipValidator = (regexString: string): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    let result = true;

    const regex = convertStringToRegex(regexString);
    if (!validateRegex(regex, control.value)) {
      result = false;
    }
    let res = null;
    if(!result){
      res = { ipAddressValidationError: { value: control.value } };
    }
    return res;

  };
};
/*
* Validate port address
*
*/
export const portValidator = (regexString: string): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    let result = true;
    const regex = convertStringToRegex(regexString);
    if (!validateRegex(regex, control.value)) {
      result = false;
    }
    let res =null;
    if(!result){
      res = { portValidationError: { value: control.value } };
    }
    return res;
  };
};
/*
* Validates ip range
*/
export const ipRangeValidator = (fromIPFieldName: string, toIPFieldName: string): ValidatorFn | ValidatorFn[] | AbstractControlOptions => {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    let result = true;

    const fromIP = control.get(fromIPFieldName).value;
    const toIP = control.get(toIPFieldName).value;

    const classCSubnetMaskIP1 = fromIP.substring(0, fromIP.lastIndexOf('.'));
    const classCSubnetMaskIP2 = toIP.substring(0, toIP.lastIndexOf('.'));
    if (classCSubnetMaskIP1 !== classCSubnetMaskIP2) {
      result = false;
    }
    let res =null;
    if(!result){
      res = { ipRangeValidationError: { value: control.value } };
    }
    return res;
  };
};
/*
* Function to validate regex where regex is string : it first converts the string to regex then validates
*/
export const validateTextRegex = (regexString: string, inputText: string) => {
  const regex = convertStringToRegex(regexString);
  return validateRegex(regex, inputText);
};
/*
* Function to convert string to regex
*/
export const convertStringToRegex = (regex: string) => {
  const intRegex = regex.lastIndexOf('/');
  return new RegExp(regex.slice(1, intRegex), regex.slice(intRegex + 1));
};
/*
* Function to validate regex
*/
export const validateRegex = (regex: RegExp, testString: string): boolean => {
  const regexOk = checkRegexSafety(regex);
  let result = false;
  if (regexOk) {
    result = regex.test(testString);
  }
  return result;
};

/*
* Function to check regex safety using safe regex
*/
export const checkRegexSafety = (expression: RegExp) =>  safe_regex(expression);
/*
* Function to validate address
*/
export const validateAddress = (regexExp: RegExp, value: string) => {
  const regexOk = checkRegexSafety(regexExp);
  if (regexOk) {
    return regexExp.test(value);
  }
  return false;
};

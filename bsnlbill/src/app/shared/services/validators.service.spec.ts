/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */

import { FormControl } from '@angular/forms';
import * as validators from '../../../app/shared/services/validators.service';

fdescribe('validator service suite', () => {
  it('projectNameValidator', () => {
    let arr = [
      '/^[\\w\\-.@}{^&!(\'=",);\\[\\]`+ ]*$/gi',
      '/^((aux|con|nul|prn|com[1-9]$|lpt[1-9]$)[^<>:"\\/\\\\|?*]+|(?!aux|con|nul|prn|com[1-9]$|lpt[1-9]$))/gi',
    ];
    const projectNameValidator = validators.projectNameValidator(arr);
    const control = new FormControl('input');
    control.setValue('12345');
    expect(projectNameValidator(control)).toBeDefined();
  });

  it('deviceUrlValidator', () => {
    const deviceUrlValidator = validators.deviceUrlValidator(
      '/^(opc.tcp://[w.?]{1,253}:[0-9]{1,65535})/g'
    );
    const control = new FormControl('input');
    control.setValue('opc.tcp://192.168.2.101:4840');
    expect(deviceUrlValidator(control)).toBeDefined();
  });

  it('ipValidator', () => {
    const ipValidator = validators.ipValidator(
      '/^(opc.tcp://[w.?]{1,253}:[0-9]{1,65535})/g'
    );
    const control = new FormControl('input');
    control.setValue('192.168.2.101:4840');
    expect(ipValidator(control)).toBeDefined();
  });

  it('port Validator', () => {
    const portValidator = validators.portValidator(
      '/^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0][0-9]{1,4})|([0-9]{1,4}))$/g'
    );
    const control = new FormControl('input');
    control.setValue('4840');
    expect(portValidator(control)).toBeDefined();
  });

  it('ipRangeValidator Validator', () => {
    const ipRangeValidator = validators.ipRangeValidator(
      'fromIPAddress',
      'toIPAddress'
    );
    const control = new FormControl('input');
    control.setValue('fromIPAddress');
  });

  it('validateTextRegex Validator', () => {
    const validateTextRegex = validators.validateTextRegex(
      '/^(opc.tcp://[w.?]{1,253}:[0-9]{1,65535})/g',
      '192.168.2.101:4840'
    );
    const control = new FormControl('input');
    control.setValue('fromIPAddress');
  });

  it('validateAddress', () => {
    const regex = new RegExp(
      '^opc\\.tcp:\\/\\/((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)(?::\\d{0,4})?\\b)',
      'g'
    );
    const validateAddress = validators.validateAddress(
      regex,
      'opc.tcp://192.168.2.102:4840'
    );
    expect(validateAddress).toEqual(false);
  });
});

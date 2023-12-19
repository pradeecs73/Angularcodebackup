/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { EllipsisPipe } from './ellipsis.pipe';

fdescribe('EllipsisPipe', () => {
  it('create an instance', () => {
    const pipe = new EllipsisPipe();
    expect(pipe).toBeTruthy();
  });

  it('transform the lengh of string to given length + 3', () => {
    const pipe = new EllipsisPipe();
    const transformLength = 17;
    const transformedValue = pipe.transform('testing_long_project_name_testing_long_project_name_again', transformLength);
    const ellipsisLength = 3;
    const length = transformLength + ellipsisLength;
    expect(transformedValue.length).toBe(length);
    pipe.transform('testing_long_project_name_testing_long_project_name_again', 20000);
    pipe.transform('testing_long_project_name_testing_long_project_name_again');
  });
});

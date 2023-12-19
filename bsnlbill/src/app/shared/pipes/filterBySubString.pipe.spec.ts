/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { device } from 'mockData/projectData';
import { deviceSets } from '../../utility/constant';
import { FilterBySubstringPipe } from './filterBySubstring.pipe';

fdescribe('FilterBySubstringPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterBySubstringPipe();
    expect(pipe).toBeTruthy();
  });

  it('Extract to needed formatted based on user substring format', () => {
    const pipe = new FilterBySubstringPipe();
    const transformedValue = pipe.transform(device[0].deviceSet, ...['text=', deviceSets.MANUFACTURER]);
    expect(transformedValue).toBe('Siemens AG');
  });
});

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { FormatDatePipe } from '../pipes/formatDate.pipe';

fdescribe('FormatDatePipe', () => {
  const pipe = new FormatDatePipe();
  const time = '1/12/2023, 11:38:37 AM';
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('format Date pipe with english', () => {
    const res = pipe.transform(time, 'en');
    expect(res).toBeDefined();
    expect(pipe.timezone).toEqual('en-US');
  });

  it('format Date pipe with german', () => {
    const res = pipe.transform(time, 'de');
    expect(res).toBeDefined();
    expect(pipe.timezone).toEqual('de-DE');
  });

  it('default', () => {
    const res = pipe.transform(time);
    expect(res).toBeDefined();
    expect(pipe.timezone).toEqual('en-US');
  });
});

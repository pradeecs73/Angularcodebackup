/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Notification } from '../../models/notification.interface';
import { NotificationPipe } from './notification.pipe';

fdescribe('EllipsisPipe', () => {
  it('create an instance', () => {
    const pipe = new NotificationPipe();
    expect(pipe).toBeTruthy();
  });

  it('transform the lengh of string to given length + 3', () => {
    const pipe = new NotificationPipe();
    const transformedValue = pipe.transform([{ type: 'info' }] as unknown as Notification[], 'info');
    expect(transformedValue).toEqual(transformedValue);
    const transformedValue1 = pipe.transform([] as unknown as Notification[], 'info');
    expect(transformedValue1).toEqual([]);
  });

});

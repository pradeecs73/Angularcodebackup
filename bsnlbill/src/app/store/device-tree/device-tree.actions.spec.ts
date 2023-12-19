/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Tree } from "src/app/models/models";
import { DeviceTreeActionTypes, FetchDevicesFailure, FetchDevicesRequest, FetchDevicesSuccess, GetDevices, UpdateDeviceState } from "./device-tree.actions";

fdescribe('FetchDevicesRequest', () => {
  it('should create an action', () => {
    const action = new FetchDevicesRequest();
    expect(action.type).toEqual(DeviceTreeActionTypes.FETCH_DEVICES_REQUEST);
  });
});
fdescribe('FetchDevicesSuccess', () => {
  it('should create an action', () => {
    const payload = {};
    const action = new FetchDevicesSuccess(payload as unknown as Tree);
    expect(action.type).toEqual(DeviceTreeActionTypes.FETCH_DEVICES_SUCCESS);
  });
});

fdescribe('UpdateDeviceState', () => {
  it('should create an action', () => {
    const payload = {};
    const action = new UpdateDeviceState(payload as unknown as Tree);
    expect(action.type).toEqual(DeviceTreeActionTypes.UPDATE_DEVICE_STATE);
  });
});
fdescribe('FetchDevicesFailure', () => {
  it('should create an action', () => {
    const payload = 'abc';
    const action = new FetchDevicesFailure(payload);
    expect(action.type).toEqual(DeviceTreeActionTypes.FETCH_DEVICES_FAILURE);
  });
});
fdescribe('GetDevices', () => {
  it('should create an action', () => {
    const action = new GetDevices();
    expect(action.type).toEqual(DeviceTreeActionTypes.GET_DEVICES);
  });
});

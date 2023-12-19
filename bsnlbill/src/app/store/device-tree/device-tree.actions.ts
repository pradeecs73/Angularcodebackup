/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Action } from '@ngrx/store';
import { Tree } from '../../models/models';


export enum DeviceTreeActionTypes {
    FETCH_DEVICES_REQUEST = 'FETCH_DEVICES_REQUEST',
    //LOAD_SAVED_DEVICES_REQUEST = 'LOAD_SAVED_DEVICES_REQUEST',
    FETCH_DEVICES_SUCCESS = 'FETCH_DEVICES_SUCCESS',
    FETCH_DEVICES_FAILURE = 'FETCH_DEVICES_FAILURE',
    GET_DEVICES = 'GET_DEVICES',
    UPDATE_DEVICE_STATE = 'UPDATE_DEVICES_STATE'
}

/*
* Fetch devices
*/
export class FetchDevicesRequest implements Action {
    readonly type = DeviceTreeActionTypes.FETCH_DEVICES_REQUEST;
}

/*
* Fetch devices : Success
*/
export class FetchDevicesSuccess implements Action {

    readonly type = DeviceTreeActionTypes.FETCH_DEVICES_SUCCESS;
    constructor(public payload: Tree) {

    }
}

/*
* Update devices
*/
export class UpdateDeviceState implements Action {
    readonly type = DeviceTreeActionTypes.UPDATE_DEVICE_STATE;
    constructor(public payload: Tree) {

    }
}
/*
* Fetch devices : Failure
*/
export class FetchDevicesFailure implements Action {
    readonly type = DeviceTreeActionTypes.FETCH_DEVICES_FAILURE;
    constructor(public payload: string) { }
}
/*
* Get devices
*/
export class GetDevices implements Action {
    readonly type = DeviceTreeActionTypes.GET_DEVICES;
}

// export class LoadSavedDevices implements Action {
//     readonly type = DeviceTreeActionTypes.LOAD_SAVED_DEVICES_REQUEST;
// }

export type FetchDeviceActions = FetchDevicesRequest | FetchDevicesSuccess | FetchDevicesFailure | GetDevices;// | LoadSavedDevices;

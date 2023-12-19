/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { DeviceTreeActionTypes, FetchDeviceActions } from './device-tree.actions';
import { Tree } from '../../models/models';


export interface DeviceTreeState {
    loading: boolean;
    deviceGroup: Tree;
    err: string;
    //devicesAvailable : boolean;
}

const initialFetchDevicesState: DeviceTreeState = {
    loading: false,
    deviceGroup: null,
    err: ''
    //devicesAvailable : true
};

export function fetchDevicesTreeReducer(state: DeviceTreeState = initialFetchDevicesState,action: FetchDeviceActions ): DeviceTreeState {

    switch (action.type) {
        /*
        * Fetch devices
        */
        case DeviceTreeActionTypes.FETCH_DEVICES_REQUEST:

            return {
                ...state,
                loading: true
            };
        /*
        * Fetch devices : Success
        */
        case DeviceTreeActionTypes.FETCH_DEVICES_SUCCESS:

            return {
                ...state,
                loading: false,
                deviceGroup: {...action.payload}
            };
        /*
        * Get devices
        */    
        case DeviceTreeActionTypes.FETCH_DEVICES_FAILURE:

            return {
                ...state,
                loading: false,
                err: action.payload
            };
        /*
        * Fetch devices : Failure
        */
        case DeviceTreeActionTypes.GET_DEVICES:
            return state;
        /*
        * Default
        */
        default:

            return state;

    }
}

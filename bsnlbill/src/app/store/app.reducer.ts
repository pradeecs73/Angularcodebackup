/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { DeviceTreeState, fetchDevicesTreeReducer } from './device-tree/device-tree.reducer';
import { FillingLineState as fillingLineState, fillingLineReducer } from './filling-line/filling-line.reducer';
import { ActionReducerMap } from '@ngrx/store';
/*
*App State
*/
export interface AppState {
    deviceTreeList: DeviceTreeState;
    fillingLine: fillingLineState;
}

export const appReducer: ActionReducerMap<AppState> = {
    deviceTreeList: fetchDevicesTreeReducer,
    fillingLine: fillingLineReducer
    //projectdata
    //connections
    //editorstate or project state
};

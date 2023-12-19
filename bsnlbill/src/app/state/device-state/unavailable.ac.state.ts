/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { DeviceState } from '../../../app/enum/enum';
import { OPCNode } from '../../../app/opcua/opcnodes/opcnode';
import { AutomationComponetState } from './ac.state';

export class Unavailable extends AutomationComponetState {
    /* When the AC is unavailable */
    /* Returns unavailable status for AC*/
    public status() {
        return DeviceState.UNAVAILABLE;
    }
    /*
    * Applies style to AC when its in unavailable state
    */
    public applyStyleInEditor(node:OPCNode) {
        node.styleUnavailableNode();
    }
}

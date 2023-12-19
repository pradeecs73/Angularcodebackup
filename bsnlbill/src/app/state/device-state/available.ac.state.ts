/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { DeviceState } from '../../../app/enum/enum';
import { OPCNode } from '../../../app/opcua/opcnodes/opcnode';
import { AutomationComponetState } from './ac.state';

export class Available extends AutomationComponetState {
    /* When the AC is available */
    /* Returns available status for AC*/
    public status() {
        return DeviceState.AVAILABLE;
    }
    /*
    * Applies style to AC when its in available state
    */
    public applyStyleInEditor(node:OPCNode) {
        node.styleAvailableNode();
    }
}

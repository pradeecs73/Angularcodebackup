/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { OPCNode } from '../../opcua/opcnodes/opcnode';
import { AbstractState } from '../state';
import { AutomationComponetState } from './ac.state';

export class AutomationComponent extends AbstractState {
    /*
    * Getter and setter method to return the application state
    */
    _state: AutomationComponetState;
    get state(): AutomationComponetState {
        return this._state;
    }

    set state(state: AutomationComponetState) {
        this._state = state;
    }
    /*
    * Returns state offline/online
    */
    public getStatus() {
        return this.state.status();
    }
    /*
    * Function to change the status from online-> offline and offline->online
    */
    public applyStyleInEditor(node:OPCNode) {
        this.state.applyStyleInEditor(node);
    }
}

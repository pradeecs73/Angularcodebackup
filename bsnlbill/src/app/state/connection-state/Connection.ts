/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Connector } from '../../opcua/opcnodes/connector';
import { AbstractState } from '../state';
import { ConnectionStaus } from './connection.state';

export class Connection extends AbstractState {
    _state: ConnectionStaus;
     /*
    * Getter and setter method to return the application state
    */
    get state(): ConnectionStaus {
        return this._state;
    }

    set state(state: ConnectionStaus) {
        this._state = state;
    }
    /*
    * Returns state offline/online
    */
    public getStatus() {
        return this.state.status();
    }
    /*
    * Applies the styles for the connector based on state
    */
    public style(connector:Connector) {
        this.state.style(connector);
    }
}

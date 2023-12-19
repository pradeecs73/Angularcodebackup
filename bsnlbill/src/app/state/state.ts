/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
export interface State<T> {
    status();
}

export abstract class AbstractState {
    /*
    * Method to get the state and status
    */
    abstract _state;
    abstract get state();
    abstract set state(state: State<string>);
    abstract getStatus();
}

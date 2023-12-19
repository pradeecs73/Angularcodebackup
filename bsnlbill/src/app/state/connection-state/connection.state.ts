/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/


import { Connector } from '../../opcua/opcnodes/connector';
import { AbstractState, State } from '../state';


export abstract class ConnectionStaus implements State<AbstractState>{
    /*
    * Abstract class with status and style abstract methods for connection
    */
    public abstract status();

    public abstract style(connector :Connector);

}

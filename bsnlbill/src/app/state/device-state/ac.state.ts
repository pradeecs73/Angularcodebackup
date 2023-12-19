/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { OPCNode } from '../../opcua/opcnodes/opcnode';
import { AbstractState, State } from '../state';


export abstract class AutomationComponetState implements State<AbstractState>{
    /*
    * Abstract class with status and style abstract methods for AC
    */
    public abstract status();

    public abstract applyStyleInEditor(node:OPCNode);

}

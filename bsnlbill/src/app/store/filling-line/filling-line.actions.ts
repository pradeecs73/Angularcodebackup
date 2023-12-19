/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Action } from '@ngrx/store';
import { FillingArea, FillingNode } from './filling-line.reducer';
import { Update } from '@ngrx/entity';

/*
* Enum for actions
*/
export enum fillingLineActionTypes {
    CREATE_NODE = 'CREATE_NODE',
    CREATE_NODELIST = 'CREATE_NODELIST',
    UPDATE_NODE = 'UPDATE_NODE',
    DELETE_NODE = 'DELETE_NODE',
    //UPDATE_MOUSE_POSITION = 'UPDATE_MOUSE_POSITION',
    SELECT_DEVICE = 'SELECT_DEVICE',
    DESELECT_ALL_DEVICE = 'DESELECT_ALL_DEVICE',
    CLEAR_FILLING_LINE = 'CLEAR_FILLING_LINE',
    //UPDATE_NODE_LIST = 'UPDATE_NODE_LIST'
    CREATE_AREA = 'CREATE_AREA',
    CREATE_AREALIST = 'CREATE_AREALIST',
    UPDATE_AREA = 'UPDATE_AREA',
    DELETE_AREA = 'DELETE_AREA'
}
/* Create Node
*/
export class CreateNode implements Action {
    readonly type = fillingLineActionTypes.CREATE_NODE;
    constructor(public node: FillingNode) { }
}
/* Create Node List
*/
export class CreateNodeList implements Action {
    readonly type = fillingLineActionTypes.CREATE_NODELIST;
    constructor(public nodeList: Array<FillingNode>) { }
}
/* Update Node
*/
export class UpdateNode implements Action {
    readonly type = fillingLineActionTypes.UPDATE_NODE;
    constructor(public id: string, public changes: Partial<FillingNode>) { }
}
/* Delete Node
*/
export class DeleteNode implements Action {
    readonly type = fillingLineActionTypes.DELETE_NODE;
    constructor(public id: string) { }
}

/* Select Device
*/
export class SelectDevice implements Action {
    readonly type = fillingLineActionTypes.SELECT_DEVICE;
    constructor(public id: string, public changes: Partial<FillingNode>) { }
}
/* Deselect all device */
export class DeselectAllDevice implements Action {
    readonly type = fillingLineActionTypes.DESELECT_ALL_DEVICE;
    constructor(public updates: Update<FillingNode>[]) { }
}
/* Clear filling line */
export class ClearFillingLine implements Action {
    readonly type = fillingLineActionTypes.CLEAR_FILLING_LINE;
}
/* Create Area */
export class CreateArea implements Action {
    readonly type = fillingLineActionTypes.CREATE_AREA;
    constructor(public area: FillingArea) { }
}
/* Create Area list*/
export class CreateAreaList implements Action {
    readonly type = fillingLineActionTypes.CREATE_AREALIST;
    constructor(public areaList: Array<FillingArea>) { }
}
/* Update Area */
export class UpdateArea implements Action {
    readonly type = fillingLineActionTypes.UPDATE_AREA;
    constructor(public id: string, public changes: Partial<FillingArea>) { }
}
/* Delete Area */
export class DeleteArea implements Action {
    readonly type = fillingLineActionTypes.DELETE_AREA;
    constructor(public id: string) { }
}

export type FillingLineActions = CreateNode | CreateNodeList | UpdateNode | DeleteNode | SelectDevice | DeselectAllDevice | ClearFillingLine
    | CreateArea | CreateAreaList | UpdateArea | DeleteArea;

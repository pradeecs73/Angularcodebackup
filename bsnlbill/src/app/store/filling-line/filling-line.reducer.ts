/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { DeviceState, FillingLineNodeType } from '../../enum/enum';
import { Area } from '../../models/models';
import { AreaClientInterface, AreaInterface, AutomationComponent } from '../../models/targetmodel.interface';
import { FillingLineActions, fillingLineActionTypes } from './filling-line.actions';

/*
* main data interface
*/
export interface FillingNode extends AutomationComponent {
  id: string;
  //Needs AC adaptation.delete deviceData param
  //deviceData ?: Device;
  //nodeData ?: AutomationComponent;
  element: SVGGElement;
  selected?: boolean;
  state: DeviceState; // online offline
  x: number;
  y: number;
  adapterType: string;
  type: FillingLineNodeType.NODE,
  parent: string;
}

export interface FillingArea extends Area {
  element: SVGGElement,
  type: FillingLineNodeType.AREA;
  repositionRequired: boolean;
  clientInterfaces: Array<AreaClientInterface>;
  serverInterfaces: Array<AreaInterface>;
}

/*
* entity adapter
*/
export const fillingNodeAdapter = createEntityAdapter<FillingNode | FillingArea>();
export interface FillingLineState extends EntityState<FillingNode | FillingArea> { } //NOSONAR

/*
* Default data/ initial state
*/

const defaultFillingNodes = {
  ids: [],
  entities: {}
};

export const initialState: FillingLineState = fillingNodeAdapter.getInitialState(defaultFillingNodes);

export function fillingLineReducer(state: FillingLineState = initialState, action: FillingLineActions) { //NOSONAR

  switch (action.type) {
    /* Create Node */
    case fillingLineActionTypes.CREATE_NODE:
      return fillingNodeAdapter.addOne(action.node, state);
    /* Create Node List */
    case fillingLineActionTypes.CREATE_NODELIST:
      return fillingNodeAdapter.addMany(action.nodeList, state);
    /* Update node or area */
    case fillingLineActionTypes.UPDATE_NODE:
    case fillingLineActionTypes.UPDATE_AREA:
    case fillingLineActionTypes.SELECT_DEVICE:
      return fillingNodeAdapter.updateOne({ id: action.id, changes: action.changes }, state);
    /* Delete node*/
    case fillingLineActionTypes.DELETE_NODE:
    case fillingLineActionTypes.DELETE_AREA:
      return fillingNodeAdapter.removeOne(action.id, state);
    /* Deselect all device */
    case fillingLineActionTypes.DESELECT_ALL_DEVICE:
      return fillingNodeAdapter.updateMany(action.updates, state);
    /* Clear filling line */
    case fillingLineActionTypes.CLEAR_FILLING_LINE:
      return fillingNodeAdapter.removeAll(state);
    /* Create area */
    case fillingLineActionTypes.CREATE_AREA:
      return fillingNodeAdapter.addOne(action.area, state);
    /* Create area List */
    case fillingLineActionTypes.CREATE_AREALIST:
      return fillingNodeAdapter.addMany(action.areaList, state);
    default: return state;
  }
}

/*
*create the default selectors
*/

export const getFillingNodes = createFeatureSelector<FillingLineState>('fillingLine');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = fillingNodeAdapter.getSelectors(getFillingNodes);


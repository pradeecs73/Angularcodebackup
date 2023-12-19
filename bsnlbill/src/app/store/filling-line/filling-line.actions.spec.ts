/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */

import { Update } from '@ngrx/entity';
import {
  ClearFillingLine,
  CreateArea,
  CreateAreaList,
  CreateNode,
  CreateNodeList,
  DeleteArea,
  DeleteNode,
  DeselectAllDevice,
  fillingLineActionTypes,
  SelectDevice,
  UpdateArea,
  UpdateNode,
} from './filling-line.actions';
import { FillingArea, FillingNode } from './filling-line.reducer';

fdescribe('CreateNode', () => {
  it('should create an action', () => {
    const action = new CreateNode(({} as unknown) as FillingNode);
    expect(action.type).toEqual(fillingLineActionTypes.CREATE_NODE);
  });
});

fdescribe('CreateNodeList', () => {
  it('should create an action', () => {
    const action = new CreateNodeList(({} as unknown) as Array<FillingNode>);
    expect(action.type).toEqual(fillingLineActionTypes.CREATE_NODELIST);
  });
});

fdescribe('UpdateNode', () => {
  it('should create an action', () => {
    const action = new UpdateNode(
      'abc',
      ({} as unknown) as Partial<FillingNode>
    );
    expect(action.type).toEqual(fillingLineActionTypes.UPDATE_NODE);
  });
});

fdescribe('DeleteNode', () => {
  it('should create an action', () => {
    const action = new DeleteNode('abc');
    expect(action.type).toEqual(fillingLineActionTypes.DELETE_NODE);
  });
});

fdescribe('SelectDevice', () => {
  it('should create an action', () => {
    const action = new SelectDevice(
      'abc',
      ({} as unknown) as Partial<FillingNode>
    );
    expect(action.type).toEqual(fillingLineActionTypes.SELECT_DEVICE);
  });
});

fdescribe('DeselectAllDevice', () => {
  it('should create an action', () => {
    const action = new DeselectAllDevice(
      ({} as unknown) as Update<FillingNode>[]
    );
    expect(action.type).toEqual(fillingLineActionTypes.DESELECT_ALL_DEVICE);
  });
});

fdescribe('ClearFillingLine', () => {
  it('should create an action', () => {
    const action = new ClearFillingLine();
    expect(action.type).toEqual(fillingLineActionTypes.CLEAR_FILLING_LINE);
  });
});

fdescribe('CreateArea', () => {
  it('should create an action', () => {
    const action = new CreateArea(({} as unknown) as FillingArea);
    expect(action.type).toEqual(fillingLineActionTypes.CREATE_AREA);
  });
});

fdescribe('CreateAreaList', () => {
  it('should create an action', () => {
    const action = new CreateAreaList(({} as unknown) as Array<FillingArea>);
    expect(action.type).toEqual(fillingLineActionTypes.CREATE_AREALIST);
  });
});

fdescribe('UpdateArea', () => {
  it('should create an action', () => {
    const action = new UpdateArea(
      'abc',
      ({} as unknown) as Partial<FillingArea>
    );
    expect(action.type).toEqual(fillingLineActionTypes.UPDATE_AREA);
  });
});

fdescribe('CreateArea', () => {
  it('should create an action', () => {
    const action = new DeleteArea('abc');
    expect(action.type).toEqual(fillingLineActionTypes.DELETE_AREA);
  });
});

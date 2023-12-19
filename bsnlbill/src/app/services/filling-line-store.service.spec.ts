/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */
import { TestBed } from '@angular/core/testing';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Area } from '../models/models';
import { AutomationComponent } from '../models/targetmodel.interface';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import {
  FillingArea,
  FillingNode,
} from '../store/filling-line/filling-line.reducer';
import { FillingLineService } from './filling-line-store.service';

fdescribe('Filling Line store service', () => {
  let service;
  let mockStore: Store;
  let facadeMockService;
  const acData = ({
    id: '1234',
    state: 'TESt',
    deviceId: '12345',
    clientInterfaces: [],
    serverInterfaces: [],
    address: '192.168.2.101',
    name: 'FillingToMixing',
    deviceName: 'BottleFilling',
  } as unknown) as AutomationComponent;
  const areaData = ({
    x: 10,
    y: 20,
    id: '1234',
    name: 'abcde',
  } as unknown) as Area;
  beforeEach(() => {
    facadeMockService = new FacadeMockService();
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: FacadeService, useValue: facadeMockService },
      ],
    });
    service = TestBed.inject(FillingLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getFillingLine', () => {
    service.getFillingLine();
    expect(mockStore.select).toHaveBeenCalled();
  });

  it('createFillingNodeData', () => {
    service.createFillingNodeData(10, 10, acData, 'a', 'b');
    expect(facadeMockService.dataService.updateInterface).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('createNodeList', () => {
    service.createNodeList(([] as unknown) as Array<FillingNode>);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('clearFillingLine', () => {
    service.clearFillingLine();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('getUpdatedNodeData', () => {
    const result = {
      id: 'abdde',
      changes: {},
    };
    const res = service.getUpdatedNodeData(
      'abdde',
      ({} as unknown) as Partial<FillingNode>
    );
    expect(res).toEqual(result);
  });

  it('clearFillingLine', () => {
    service.clearFillingLine();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('deleteNode', () => {
    service.deleteNode('123');
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('updateNode', () => {
    service.updateNode('abdde', ({} as unknown) as Partial<FillingNode>);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('deselectDevices', () => {
    service.deselectDevices(([] as unknown) as Array<Update<FillingNode>>);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('createAreaList', () => {
    service.createAreaList(([] as unknown) as Array<FillingArea>);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('updateArea', () => {
    service.updateArea('abdde', ({} as unknown) as Partial<FillingArea>);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('deleteArea', () => {
    service.deleteArea('abcde');
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('selectDevice', () => {
    service.selectDevice('abcde');
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('createFillingAreaData with areaData', () => {
    service.createFillingAreaData('ROOT', 10, 10, areaData);
    expect(facadeMockService.dataService.addArea).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('createFillingAreaData with no areaData', () => {
    service.createFillingAreaData('ROOT', 0, 10);
    expect(facadeMockService.dataService.addArea).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });
});

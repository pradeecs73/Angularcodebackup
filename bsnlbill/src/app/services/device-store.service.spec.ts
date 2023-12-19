/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */
import { Tree } from '@angular-devkit/schematics';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { DeviceStoreService } from './device-store.service';

fdescribe('Device store service', () => {
  let mockStore;
  let service;
  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: mockStore }],
    });
    service = TestBed.inject(DeviceStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetchDeviceTreeNodes', () => {
    service.fetchDeviceTreeNodes();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('getDeviceTree', () => {
    service.getDeviceTree();
    expect(mockStore.select).toHaveBeenCalled();
  });

  it('updateDevices', () => {
    service.updateDevices(({} as unknown) as Tree);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });
});

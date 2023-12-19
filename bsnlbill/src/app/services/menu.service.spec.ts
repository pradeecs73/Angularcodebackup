/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ApplicationConstant } from '../enum/enum';
import { Project } from '../models/models';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { MenuService } from './menu.service';

const uniqid = require('uniqid');
let mockHttpClientService: HttpClient;
let mockStore: Store;
let facadeMockService;
let service;

const project = <Project>{
  date: '4',
  name: 'firstProj',
  comment: 'projectComment',
  author: 'projectauthor',
  id: uniqid.time(),
};
fdescribe('menu service', () => {
  beforeEach(() => {
    facadeMockService = new FacadeMockService();
    facadeMockService.commonService.isOnline = true;
    facadeMockService.saveService.openedProject = project;
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpClientService },
        { provide: Store, useValue: mockStore },
        { provide: FacadeService, useValue: facadeMockService },
      ],
    });
    service = TestBed.inject(MenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('selectMenu with devicetreeicon with project opened ', () => {
    const item = {
      icon: 'devicetreeicon',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.icon).toEqual('devicetreeicon-active');
    expect(item.styleClass).toEqual('selected');
  });

  it('selectMenu with devicetreeicon with  no project opened ', () => {
    facadeMockService.saveService.openedProject = null;
    const item = {
      icon: 'devicetreeicon',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.icon).toEqual('devicetreeicon');
    expect(item.styleClass).toEqual(ApplicationConstant.DISABLED);
  });

  it('selectMenu with plantviewicon with project opened ', () => {
    const item = {
      icon: 'plantviewicon',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.icon).toEqual('plantviewicon-active');
    expect(item.styleClass).toEqual('selected');
  });

  it('selectMenu with devicetreeicon with  no project opened ', () => {
    facadeMockService.saveService.openedProject = null;
    const item = {
      icon: 'plantviewicon',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.icon).toEqual('plantviewicon');
    expect(item.styleClass).toEqual(ApplicationConstant.DISABLED);
  });

  it('selectMenu with plantviewicon-active with project opened ', () => {
    const item = {
      icon: 'plantviewicon-active',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual('');
  });

  it('selectMenu with plantviewicon-active with  no project opened ', () => {
    facadeMockService.saveService.openedProject = null;
    const item = {
      icon: 'plantviewicon-active',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual(ApplicationConstant.DISABLED);
  });

  it('selectMenu with default test ', () => {
    const item = {
      icon: '',
      styleClass: '',
    };
    const res = service.selectMenu(item);
    expect(res).not.toBeDefined();
  });

  it('disableMenuItem', () => {
    facadeMockService.saveService.openedProject = null;
    let item = {
      icon: 'plantviewicon-active',
      styleClass: '',
    };
    service.disableMenuItem(item);
    expect(item.icon).toEqual('plantviewicon');
    expect(item.styleClass).toEqual(ApplicationConstant.DISABLED);
  });

  it('selectMenu with homeicon inOnline Mode ', () => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.applicationStateService,
      'isOnline'
    ).value.and.returnValue(true);
    const item = {
      icon: 'homeicon',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual(ApplicationConstant.DISABLED);
  });

  it('selectMenu with homeicon inOffline Mode ', () => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.applicationStateService,
      'isOnline'
    ).value.and.returnValue(false);
    const item = {
      icon: 'homeicon',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.icon).toEqual('homeicon-active');
    expect(item.styleClass).toEqual(ApplicationConstant.SELECTED);
  });

  it('selectMenu with homeicon-active inOnline Mode ', () => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.applicationStateService,
      'isOnline'
    ).value.and.returnValue(true);
    const item = {
      icon: 'homeicon-active',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual(ApplicationConstant.DISABLED);
  });

  it('selectMenu with configurationsettingsicon', () => {
    const item = {
      icon: 'configurationsettingsicon',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual('selected');
    expect(item.icon).toEqual('configurationsettingsicon-active');
  });

  it('selectMenu with configurationsettingsicon-active ', () => {
    const item = {
      icon: 'configurationsettingsicon-active',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual('');
    expect(item.icon).toEqual('configurationsettingsicon');
  });

  it('selectMenu with settingsicon with no project opened', () => {
    facadeMockService.saveService.openedProject = null;
    const item = {
      icon: 'settingsicon',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual(ApplicationConstant.DISABLED);
    expect(item.icon).toEqual('settingsicon');
  });

  it('selectMenu with settingsicon-active with  project opened', () => {
    facadeMockService.saveService.openedProject = null;
    const item = {
      icon: 'settingsicon-active',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual(ApplicationConstant.DISABLED);
    expect(item.icon).toEqual('settingsicon');
  });

  it('selectMenu with settingsicon with no project opened', () => {
    // facadeMockService.saveService.openedProject = null;
    const item = {
      icon: 'settingsicon',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual('selected');
    expect(item.icon).toEqual('settingsicon-active');
  });

  it('selectMenu with settingsicon-active with  project opened', () => {
    //facadeMockService.saveService.openedProject = null;
    const item = {
      icon: 'settingsicon-active',
      styleClass: '',
    };
    service.selectMenu(item);
    expect(item.styleClass).toEqual('');
    expect(item.icon).toEqual('settingsicon');
  });
});

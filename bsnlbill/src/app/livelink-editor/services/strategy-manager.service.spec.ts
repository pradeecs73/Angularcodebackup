/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from "@angular/core/testing";
import { Store } from "@ngrx/store";
import { MessageService } from "primeng/api";
import { AreaOperationsStrategy } from "../strategy/area-operations-strategy";
import { StrategyManagerService } from "./strategy-manager.service";




fdescribe('strategy manager service', () => {

  let service: StrategyManagerService;
  let mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useValue: MessageService },
      { provide: Store, useValue: mockStore },]
    });
    service = TestBed.inject(StrategyManagerService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('executeStrategy', () => {
    const services = new StrategyManagerService([{ getClassName: () => { return 'test'; } }] as unknown as Array<AreaOperationsStrategy>);
    const strategyValue = services.executeStrategy('test', 'getClassName', {});
    expect(services.executeStrategy('test', 'getClassName', {})).toBeDefined();
    expect(strategyValue).toEqual('test');
  });




});

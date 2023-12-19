/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { HTMLNodeConnector } from '../models/models';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { AlignConnectionsService } from './align-connections.service';


fdescribe('AlignConnectionsService', () => {

  let service: AlignConnectionsService;
  const defaultFillingNodes = {
    ids: [],
    entities: {}
  };

  let facadeMockService;

  const initialState = { deviceTreeList: of(null), fillingLine: defaultFillingNodes };

  beforeEach(() => {

    facadeMockService = new FacadeMockService();

    TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService },
        provideMockStore({ initialState })]
    });
    service = TestBed.inject(AlignConnectionsService);

    facadeMockService.editorService['liveLinkEditor']['connectorLookup'] = {
      'connection12345': {
        x: 1000.35, y: 1000.35, id: 'connection12345', type: 'p1', quadrant: 50,
        buildCurveString: () => false, updateActualPath: () => false, plotPoints: [{ x: 4, y: 4 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 10, y: 10 }]
      },
      'connection678910': {
        x: 2000.35, y: 2000.35, id: 'connection678910', type: 'p2', quadrant: 100,
        buildCurveString: () => false, updateActualPath: () => false, plotPoints: [{ x: 4, y: 4 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 10, y: 10 }]
      },
      'connection1112': {
        x: 500.35, y: 500.35, id: 'connection1112', type: 'p3', quadrant: 400,
        buildCurveString: () => false, updateActualPath: () => false, plotPoints: [{ x: 4, y: 4 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 10, y: 10 }, { x: 25, y: 25 }, { x: 28, y: 28 }]
      },
      'connection11120': {
        x: 500.35, y: 500.35, id: 'connection11120', type: 'p8', quadrant: 400,
        buildCurveString: () => false, updateActualPath: () => false, plotPoints: [{ x: 4, y: 4 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 10, y: 10 }, { x: 25, y: 25 }, { x: 28, y: 28 }]
      }
    } as unknown as HTMLNodeConnector;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should align connections', () => {
    service.alignConnections();
    expect(service.connectionPts).toBeDefined();
    expect(service.verticalPts).toBeDefined();
  });

  it('should  call adjustThePlotPoints method', () => {

    service['connectionPts'] = [
      { x: 1000.35, y: 1000.35, id: 'connection12345', type: 'p1', quadrant: 50 },
      { x: 2000.35, y: 2000.35, id: 'connection678910', type: 'p2', quadrant: 100 },
      { x: 500.35, y: 500.35, id: 'connection1112', type: 'p3', quadrant: 400 }
    ];

    service.adjustThePlotPoints();
    expect(service.adjustThePlotPoints).toBeDefined();
  });

  it('should  call updateTheVerticalActualConnection method', () => {

    const newPtObj = {
      x: 2000.35, y: 2000.35, id: 'connection678910', type: 'p2', quadrant: 100,
      buildCurveString: () => false, updateActualPath: () => false, plotPoints: [{ x: 4, y: 4 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 10, y: 10 }]
    };

    service.updateTheVerticalActualConnection(newPtObj);
    expect(service.updateTheVerticalActualConnection).toBeDefined();
  });

  it('should  call updateTheActualConnection method', () => {

    const newPtObj = {
      x: 500.35, y: 500.35, id: 'connection1112', type: 'p3', quadrant: 400,
      buildCurveString: () => false, updateActualPath: () => false, plotPoints: [{ x: 4, y: 4 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 10, y: 10 }, { x: 25, y: 25 }, { x: 28, y: 28 }]
    };

    service.updateTheActualConnection(newPtObj);
    expect(service.updateTheVerticalActualConnection).toBeDefined();

    const newPtObj1 = {
      x: 500.35, y: 500.35, id: 'connection11120', type: 'p8', quadrant: 400,
      buildCurveString: () => false, updateActualPath: () => false, plotPoints: [{ x: 4, y: 4 }, { x: 5, y: 5 }, { x: 8, y: 8 }, { x: 10, y: 10 }, { x: 25, y: 25 }, { x: 28, y: 28 }]
    };

    service.updateTheActualConnection(newPtObj1);

  });

  it('should  call adjustTheYPlotPoints method', () => {

    service['verticalPts'] = [
      { x: 1000.35, y: 1000.35, id: 'connection12345', type: 'p1', quadrant: 50 },
      { x: 2000.35, y: 2000.35, id: 'connection678910', type: 'p2', quadrant: 100 },
      { x: 500.35, y: 500.35, id: 'connection1112', type: 'p3', quadrant: 400 }
    ];

    service.adjustTheYPlotPoints();
    expect(service.adjustTheYPlotPoints).toBeDefined();
  });

});

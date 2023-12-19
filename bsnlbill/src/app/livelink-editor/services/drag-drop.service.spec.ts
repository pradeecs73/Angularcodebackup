/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from '@angular/core/testing';

import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { FillingLineNodeType } from '../../../app/enum/enum';
import { HTMLNode } from '../../../app/opcua/opcnodes/htmlNode';
import { ROOT_EDITOR } from '../../../app/utility/constant';
import { DragDropService } from './drag-drop.service';
import { FacadeMockService } from './facade.mock.service';
import { FacadeService } from './facade.service';
let service;
let facadeMockService;
fdescribe('DragDropService', () => {
  let mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  facadeMockService = new FacadeMockService();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: FacadeService, useValue: facadeMockService }, { provide: MessageService, useValue: MessageService },
      { provide: Store, useValue: mockStore },],
    });
    service = TestBed.inject(DragDropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMovingTheNode', () => {
    let event = {
      target: {
        getAttribute: () => { return 10; },
        style: {
          webkitTransform: '',
          transform: ''
        },
        setAttribute: () => { }

      },
      dx: 10,
      dy: 10
    };
    service.onMovingTheNode(event);
    expect(event).toBeDefined();
    expect(service.onMovingTheNode).toBeDefined();

    event.target.getAttribute = () => { return null; };
    service.onMovingTheNode(event);
    expect(event).toBeDefined();
    expect(service.onMovingTheNode).toBeDefined();
  });

  it('interactionEnd', () => {
    const event = {
      target: {
        remove: () => { },
        classList: {
          remove: () => { }
        }
      },
    };
    service.interactionEnd(event, { position: { x: 10, y: 10 } });
    expect(event).toBeDefined();
    expect(event.target).toBeDefined();
  });

  it('onDropToCanvas', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'isRootEditor').value.and.returnValue(false);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue({ nodeIds: undefined });
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue({ id: ROOT_EDITOR });
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ type: FillingLineNodeType.NODE, deviceId: '12345' }] as unknown as Array<HTMLNode>;
    const nodeData = { automationComponent: { id: '937cbf35-93ec-47bb-b127-566cc2c92a25_Qm90dGxlRmlsbGluZw==', deviceId: '12345' } };
    service.onDropToCanvas(nodeData);

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue({ nodeIds: ["937cbf35-93ec-47bb-b127-566cc2c92a25_Qm90dGxlRmlsbGluZw=="] });
    service.onDropToCanvas(nodeData);
    expect(nodeData).toBeDefined();
    expect(facadeMockService.htmlNodeService.updateNodeMoveData).toBeDefined();
    expect(facadeMockService.drawService.resizeCanvas).toBeDefined();
  });

  it('dragNodeToEditor', () => {
    const event = {
      interaction: {
        pointerIsDown: true,
        interacting: () => { return false; },
        start: () => { }
      },
      target: {
        style: {
          cursor: 'move'
        }
      },
      currentTarget: {
        children: [],
        classList: { contains: () => { return true; } },
        cloneNode: () => {
          return {
            classList: {
              add: () => { },
              remove: () => { },
              contains: () => { return true; }
            },
            style: { transform: 10, position: 'bottom', left: 10, top: 10 },
            setAttribute: () => { return true; }
          };
        },
        getBoundingClientRect: () => { return { e1: 10, e2: 10 }; }
      }
    };
    service.dragNodeToEditor(event);
    expect(event).toBeDefined();
  });

  it('onDropToLeftSidePanel', () => {
    const userSelectedNode = [{
      id: 'test',
      parent: 'test'
    }];
    const nodeIdsToRemove = [
      {
        nodeId: 'test',
        removeFrom: 'area'
      }
    ];
    const fillingNodeIdList = ['a', 'b'];
    const event = {
      target: {
        classList: {
          remove: () => { return true; }
        }
      }
    };
    spyOn(service, 'validateDropOnMultipleNodeSelection').and.returnValue(true);
    spyOn(service, 'updateInEditor');
    spyOn(service, 'updateAreaDetails');
    let areas = [{ nodeIds: ['node12345'] }];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue(areas);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getNodeByID').value.and.returnValue({ parent: 'ROOT' });
    service.onDropToLeftSidePanel(userSelectedNode, 'root', nodeIdsToRemove, fillingNodeIdList, event);
    expect(service.updateInEditor).toHaveBeenCalled();
    expect(service.updateAreaDetails).toBeDefined();
  });

  it('onDropToLeftSidePanel', () => {
    const userSelectedNode = [{
      id: 'test',
      parent: 'test'
    }];
    const nodeIdsToRemove = [
      {
        nodeId: 'test',
        removeFrom: 'area'
      }
    ];
    const fillingNodeIdList = ['a', 'b'];
    const event = {
      target: {
        classList: {
          remove: () => { return true; }
        }
      }
    };
    spyOn(service, 'validateDropOnMultipleNodeSelection').and.returnValue(true);
    spyOn(service, 'updateInEditor');
    spyOn(service, 'updateAreaDetails');
    let areas = [{ nodeIds: ['node12345'] }];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue(areas);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getNodeByID').value.and.returnValue(undefined);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue({ parent: 'test' });
    service.onDropToLeftSidePanel(userSelectedNode, 'root', nodeIdsToRemove, fillingNodeIdList, event);
    expect(service.updateInEditor).toHaveBeenCalled();
    expect(facadeMockService.dataService.getNodeByID).toHaveBeenCalled();
    expect(service.updateAreaDetails).toBeDefined();
  });

  it('reOrderAreaNodeOnDrop', () => {
    const event = {
      dragEvent: {
        currentTarget: {
          children: [{ ariaLabel: 'test' }]
        }
      }
    };
    spyOn(service, 'validateDropOnMultipleNodeSelection').and.returnValue(true);
    facadeMockService.areaUtilityService.fillingLineData = {
      entities:
      {
        'ROOT': {
          nodeIds: ["937cbf35-93ec-47bb-b127-566cc2c92a25_Qm90dGxlRmlsbGluZw=="],
          type: "area",
          parent: 'test'
        },
        'test': {
          nodeIds: ["937cbf35-93ec-47bb-b127-566cc2c92a25_Qm90dGxlRmlsbGluZw=="],
          type: "area",
          parent: 'test'
        },
      }
    };
    facadeMockService.commonService.selectedMenuTreeItem = { getValue: () => { } };
    service.reOrderAreaNodeOnDrop(event, ROOT_EDITOR);
    expect(service.reOrderAreaNodeOnDrop).toBeDefined();
    expect(service.validateDropOnMultipleNodeSelection).toHaveBeenCalled();
    expect(facadeMockService.areaUtilityService.reOrderArea).toHaveBeenCalled();
  });

  it('reOrderAreaNodeOnDrop', () => {
    const event = {
      dragEvent: {
        currentTarget: {
          children: [{ ariaLabel: 'test' }]
        }
      }
    };
    spyOn(service, 'validateDropOnMultipleNodeSelection').and.returnValue(true);
    facadeMockService.areaUtilityService.fillingLineData = {
      entities:
      {
        'ROOT': {
          nodeIds: undefined,
          type: "area",
          //parent :'test'
        },
        'test': {
          nodeIds: ["937cbf35-93ec-47bb-b127-566cc2c92a25_Qm90dGxlRmlsbGluZw=="],
          type: undefined,
          parent: undefined
        },
      }
    };
    facadeMockService.commonService.selectedMenuTreeItem = { getValue: () => { } };
    service.reOrderAreaNodeOnDrop(event, ROOT_EDITOR);
    expect(service.validateDropOnMultipleNodeSelection).toHaveBeenCalled();
  });

  it('getDroppableAreaId', () => {
    const event = {
      target: {
        children: []
      }
    };
    spyOn(service, 'extractAreaID').and.returnValue('test');
    expect(service.getDroppableAreaId(event)).toEqual('test');
  });

  it('updateAreaDetails', () => {
    //spyOn(facadeMockService.plantAreaService)
    service.updateAreaDetails(['a'], 'a', [{ nodeId: 'test', removeFrom: 'area' }]);
    //expect(facadeMockService.plantAreaService.updateAreaDetails).toHaveBeenCalled();
  });

  it('extractAreaID', () => {
    const event = {
      target: {
        classList: {
          contains: () => { return true; }
        },
        nodeName: 'g',
        dataset: {
          drag: 'test:123'
        }
      }
    };
    expect(service.extractAreaID(event)).toEqual('test');
  });

  it('validateDropOnMultipleNodeSelection', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue({ parent: 'test' });
    expect(service.validateDropOnMultipleNodeSelection('test123', ROOT_EDITOR)).toBeTrue();

    //expect(service.validateDropOnMultipleNodeSelection('test','area')).toBeFalse();
  });

  it('updateInEditor', () => {
    service['updateInEditor']({ type: FillingLineNodeType.AREA }, 'droppableAreaId');
    expect(facadeMockService.areaUtilityService.updateAreaInEditor).toHaveBeenCalled();

    service['updateInEditor']({ type: FillingLineNodeType.NODE }, 'droppableAreaId');
    expect(facadeMockService.areaUtilityService.updateNodesInEditor).toHaveBeenCalled();
  });
});

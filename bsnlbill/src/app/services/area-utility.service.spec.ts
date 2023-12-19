/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { fillingAreaMockData, mockedClientInterfaceIds, mockedServerInterfaceIds } from 'mockData/mockFillingLineData';
import { mockNode } from 'mockData/mockNode';
import { projectDataObject } from 'mockData/projectData';
import { TreeNode } from 'primeng/api';
import { mockNode_particular } from '../../../mockData/mockNode_particular';
import { DisableIfUnauthorizedDirective } from '../directives/access-check/access-check.directive';
import { DeleteSubConnectionByType, FillingLineNodeType, StrategyList, SubConnectorCreationMode } from '../enum/enum';
import { InterfaceDetails, SubConnection } from '../models/connection.interface';
import { DragDropData } from '../models/models';
import { ISidePanel } from '../models/targetmodel.interface';
import { PlantArea } from '../opcua/opcnodes/area';
import { OPCNode, OPCNodeService } from '../opcua/opcnodes/opcnode';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { ROOT_EDITOR } from '../utility/constant';
import { AreaUtilityService } from './area-utility.service';

fdescribe('AreaUtilityService', () => {
  let facadeMockService;
  let areaMockData = fillingAreaMockData;
  let mockOPCNodeService: OPCNodeService;
  let service;
  const deviceId = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE';
  const device1ID = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=';
  const device2ID = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n';
  const item = {
    children: [],
    command: () => { },
    data: {
      parent: 'area'
    },
    draggable: true,
    droppable: true,
    expanded: true,
    key: 'area_lbkfajdm',
    label: 'Area 3',
    parent: {},
    styleClass: 'area-class',
    type: 'area'
  };
  const subconnector = [{
    isInput: true,
    outputAnchor: {
      interfaceData: {
        id: 'Washing1ToMixing'
      }
    },
    areaID: '100'
  }];
  const nodeObj = {
    node: () => {
      return 'header' as unknown as SVGElement;
    }
  };
  let node = {
    type: FillingLineNodeType.AREA,
    parent: {
      label: 'test'
    },
    data: {
      id: '1234'
    }
  };
  const opcnode = {
    id: '100',
    getAllSubConnectors: function () {
      return ['a', 'b'];
    },
    getAnchorInterfaceElement: function () {
      return nodeObj;
    },
    anchorElement: 'header' as unknown as SVGElement
  } as unknown as PlantArea;
  const nodes = {
    key: '100',
    parent: {
      key: 'area'
    },
    data: {
      parent: {
        key: ROOT_EDITOR
      }
    },
    children: [
      {
        type: FillingLineNodeType.AREA,
        key: deviceId
      }
    ]
  } as unknown as TreeNode;
  const areaMockDataCopy = JSON.parse(JSON.stringify(areaMockData));

  const areasList = [
    {
      id: 'area_lgaqf7p9',
      x: 65,
      y: 35.44439697265625,
      parent: 'ROOT',
      clientInterfaceIds: [],
      serverInterfaceIds: [],
      name: 'Area 1',
      nodeIds: [],
      connectionIds: [],
    }
  ];
  const result = {
    sourceAcId: deviceId,
    sourceHierarchy: ['ROOT'],
    targetAcId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MF9XYXNoaW5nU3RlcDI=',
    targetHierarchy: ['ROOT', 'area_l9h22av7']
  };
  beforeEach(() => {
    facadeMockService = new FacadeMockService();
    mockOPCNodeService = jasmine.createSpyObj('opcNodeService', ['updateNodeAreaAssigmentData', 'updateNodeMoveData']);
    facadeMockService.editorService.liveLinkEditor.editorNodes = [opcnode] as Array<OPCNode | PlantArea>;
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getExistingSubConnectorById').value.and.returnValue({ a: 10 });
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue({ id: '123' });
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getSubConnection').value.and.returnValue({ id: '123' });
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'removeInterfaceIdsFromArea').value.and.returnValue({ subConnectionId: '123' });
    Object.getOwnPropertyDescriptor(facadeMockService.plantAreaService, 'getParentOfAreaByAreaId').value.and.returnValue(projectDataObject.editor.areas);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAreaConnections').value.and.returnValue(projectDataObject.editor.connections);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAreaSubConnections').value.and.returnValue(projectDataObject.editor.subConnections);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnectionByAcID').value.and.returnValue(projectDataObject.editor.connections);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue([areaMockData]);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(areaMockData);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getNodeByID').value.and.returnValue({ deviceId: 'abcde', id: '1234', parent: 'test' });
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue({ editor: { areas: [], nodes: [] } });
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnectionListByNodeId').value.and.returnValue(projectDataObject.editor.connections);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'updateNode').value.and.returnValue({});

    TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService },
        { provide: OPCNodeService, useValue: mockOPCNodeService },
      ],
      imports: [TranslateModule.forRoot({})]
    });
    service = TestBed.inject(AreaUtilityService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('remove connection with mode value node', () => {
    spyOn(service, 'removeSubConnectionByNodeId').and.callThrough();
    service.removeSubConnection(DeleteSubConnectionByType.NODE, '100', ['a', 'b']);
    expect(service.removeSubConnectionByNodeId).toHaveBeenCalledWith('100', ['a', 'b']);
  });

  it('remove connection with mode value Sub connector', () => {
    spyOn(service, 'removeSubConnectors').and.callThrough();
    service.removeSubConnection(DeleteSubConnectionByType.SUB_CONNECTOR, '100', subconnector);
    expect(service.removeSubConnectors).toHaveBeenCalledWith(subconnector);
  });

  it('remove connection with mode value Sub connector with isInput false', () => {
    subconnector[0].outputAnchor.interfaceData.id = 'Washing2ToWashing1';
    subconnector[0].isInput = false;
    spyOn(service, 'removeSubConnectors').and.callThrough();
    service.removeSubConnection(DeleteSubConnectionByType.SUB_CONNECTOR, '100', subconnector);
    expect(service.removeSubConnectors).toHaveBeenCalledWith(subconnector);
  });

  it('remove connection with mode value Area', () => {
    spyOn(service, 'removeSubConnectionByAreaId').and.callThrough();
    service.removeSubConnection(DeleteSubConnectionByType.AREA, '100', subconnector);
    expect(service.removeSubConnectionByAreaId).toHaveBeenCalled();
    areaMockData = JSON.parse(JSON.stringify(areaMockDataCopy));
  });

  it('remove connection with mode value Area without subconnectors', () => {
    spyOn(service, 'removeSubConnectionByAreaId').and.callThrough();
    service.removeSubConnection(DeleteSubConnectionByType.AREA, '100', []);
    expect(service.removeSubConnectionByAreaId).toHaveBeenCalled();
    areaMockData = JSON.parse(JSON.stringify(areaMockDataCopy));
  });

  it('remove connection with mode value ungroup', () => {
    service.removeSubConnection(DeleteSubConnectionByType.UNGROUP, '100', subconnector);
    expect(facadeMockService.subConnectorService.removeSubConnectionFromLookupByAreaId).toHaveBeenCalled();
  });

  it('remove connection with mode value undefined', () => {
    const res = service.removeSubConnection(undefined, '100', subconnector);
    expect(res).not.toBeDefined();
  });

  xit('unGroupAreaHavingNodeID', () => {
    nodes.children[0].key = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n';
    service.unGroupAreaHavingNodeID(nodes, [device1ID]);
    expect(facadeMockService.drawService.removeAreaConnectionsFromEditor).toHaveBeenCalled();
    expect(facadeMockService.dataService.deleteSubConnectionByAreaId).toHaveBeenCalled();
    expect(facadeMockService.dataService.removeArea).toHaveBeenCalled();
  });

  it('unGroupAreaWithOutNodeID', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getNodeByID').value.and.returnValue({ parent: ROOT_EDITOR });
    nodes.parent.key = ROOT_EDITOR;
    service.unGroupAreaWithOutNodeID(nodes, nodes);
    expect(facadeMockService.fillingLineService.deleteArea).toHaveBeenCalled();
    expect(facadeMockService.dataService.deleteArea).toHaveBeenCalled();
    expect(facadeMockService.drawService.removeAreaConnectionsFromEditor).toHaveBeenCalled();
  });

  it('updateNodeConnectionsToArea', () => {
    areaMockData.id = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n';
    service.updateNodeConnectionsToArea(areaMockData, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(facadeMockService.strategyManagerService.executeStrategy).toHaveBeenCalled();
    areaMockData = JSON.parse(JSON.stringify(areaMockDataCopy));

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnectionListByNodeId').value.and.returnValue([]);
    service.updateNodeConnectionsToArea(areaMockData, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
  });
  
  it('updateNodeConnectionsToArea', () => {
    const connectionList = [{
      "in": "d53c261d-b6dc-4549-938c-4c659187c03b__area_ll6z4x7z__clientInf_ll20t1rq",
      "out": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==__area_l7ubsg95__serverInf_l6eoprq6",
      "id": "area_ll6z4x7z__area_l7ubsg95__Wash2ToWash1_Type",
      "selected": false,
      "creationMode": "Manual",
      "areaId": "ROOT",
      "hasSubConnections": true,
      "acIds": "d53c261d-b6dc-4549-938c-4c659187c03b_Qm90dGxlRmlsbGluZw==__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=",
      "subConnections": {
        "clientIds": ["d53c261d-b6dc-4549-938c-4c659187c03b_Qm90dGxlRmlsbGluZw==__Wash2ToWash1_Type__clientInf_ll20t1rq"],
        "serverIds": ["b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__Wash2ToWash1_Type__serverInf_l6eoprq6"]
      }
    }]
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnectionListByNodeId').value.and.returnValue(connectionList);
    const clone = JSON.parse(JSON.stringify(areaMockData));
    clone.id = 'area_ll6z4x7z';
    service.updateNodeConnectionsToArea(clone, 'ROOT');
    expect(facadeMockService.strategyManagerService.executeStrategy).toHaveBeenCalled();
  });

 

  it('updateNodeConnectionsToArea', () => {
    spyOn(service, 'getAllExposedConnections').and.returnValue([]);
    spyOn(service, 'reorderWithNoConnection').and.callThrough();
    areaMockData.id = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n';
    service.updateNodeConnectionsToArea(areaMockData, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnectionByACIDAndInterfaceID').value.and.returnValue(null);
    expect(service.reorderWithNoConnection).toHaveBeenCalled();
    areaMockData = JSON.parse(JSON.stringify(areaMockDataCopy));
  });

  it('get Scenarios with common parent as root editor', () => {
    const res = service.getScenario({ commonParent: ROOT_EDITOR, sourceAreaHierarchy: 'abcde', targetAreaHierarchy: 'mnop' });
    expect(res).toEqual(StrategyList.NESTED_DIFFERENT_PARENT_AREA_STRATEGY);

    const res1 = service.getScenario({ commonParent: ROOT_EDITOR, sourceAreaHierarchy: [ROOT_EDITOR], targetAreaHierarchy: 'test' });
    expect(res1).toEqual(StrategyList.NESTED_DIFFERENT_PARENT_AREA_STRATEGY);
  });

  it('get Scenarios default case', () => {
    const res = service.getScenario({ commonParent: 'abchde', sourceAreaHierarchy: 'abcde', targetAreaHierarchy: 'mnop' });
    expect(res).toEqual(StrategyList.NESTED_SIBLINGS_AREA_STRATEGY);
  });

  it('removeFromExposeConnectionsParentOrChild', () => {
    const res = service.removeFromExposeConnectionsParentOrChild('abcde', {} as unknown as InterfaceDetails, 'abcde');
    expect(res).not.toBeDefined();
  });

  it('removeFromExposeConnectionsParentOrChild', () => {
    const res = service.removeFromExposeConnectionsParentOrChild(ROOT_EDITOR, {} as unknown as InterfaceDetails, 'abcde');
    expect(res).not.toBeDefined();
  });

  it('removeFromExposeConnectionsParentOrChild with areaID', () => {
    const res = service.removeFromExposeConnectionsParentOrChild('area_l7ubsg95', {} as unknown as InterfaceDetails, 'abcde');
    expect(facadeMockService.dataService.getAllAreas).toHaveBeenCalled();
  });

  it('getExposeInterfaceDetails', () => {
    const res = service.getExposeInterfaceDetails(
      'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MF9XYXNoaW5nU3RlcDI=',
      device1ID,
      'Wash2ToWash1_Type', 'clientInf_l9clfsez', 'serverInf_l9clfsey',
      SubConnectorCreationMode.MANUAL,
      SubConnectorCreationMode.MANUAL);
    expect(res).toBeDefined();
  });

  it('updateExposedInterfaceUptoTargetArea', () => {
    const res = service.updateExposedInterfaceUptoTargetArea('area_l9h22av7', 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MF9XYXNoaW5nU3RlcDI=', { interface: {}, interfaceId: {}, type: 'client' }, 'area_l9h22av7', 'area_l9h22av7');
    expect(res).toBeDefined();
  });

  it('getSourceTargetDevice', () => {
    const res = service.getSourceTargetDevice({ commonParent: 'ROOT', sourceAreaHierarchy: ['ROOT', 'area_l9h22av7'], targetAreaHierarchy: ['ROOT'] }, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MF9XYXNoaW5nU3RlcDI=', deviceId, { isClientInterface: true });
    expect(res).toEqual(result);
  });

  it('getSourceTargetDevice', () => {
    const res = service.getSourceTargetDevice({ commonParent: 'ROOT', sourceAreaHierarchy: ['ROOT', 'area_l9h22av7'], targetAreaHierarchy: ['ROOT'] }, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MF9XYXNoaW5nU3RlcDI=', deviceId, { isClientInterface: false });
    expect(res).toEqual(result);
  });

  it('getAreaName', () => {
    const res = service.getAreaName('a', 'b');
    expect(res).toEqual('Area 1');
  });

  it('getAreaName when getarea method doesnt return name', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(null);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAutomationComponent')
    .value.and.returnValue({name:'automation12345'});
    const res = service.getAreaName('area12', 'device12','automation12');
    expect(res).toEqual('automation12345');
  });
  it('deleteAreaConfirmation', () => {
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    const node = {
      data: {
        parent: ROOT_EDITOR
      },
      children: [{
        type: FillingLineNodeType.AREA,
        children: ['a', 'b']
      },
      {
        type: FillingLineNodeType.AREA,
        children: []
      }
      ]
    };
    service.menuTreeData = {
      children: [{
        type: FillingLineNodeType.AREA,
        children: ['a', 'b']
      },
      {
        type: FillingLineNodeType.AREA,
        children: []
      }]
    };
    service.deleteAreaConfirmation(node);
    expect(service.nestedAreas.length).toBeGreaterThan(0);
  });

  it('unGroupAreaConfirmation', () => {
    spyOn(service, 'unGroupAreaHavingNodeID');
    spyOn(service, 'unGroupAreaWithOutNodeID');
    service.menuTreeData = {
      children: [{
        type: FillingLineNodeType.AREA,
        children: ['a', 'b']
      },
      {
        type: FillingLineNodeType.AREA,
        children: []
      }]
    };
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    service.unGroupAreaConfirmation({ data: { nodeIds: ['a'] } } as unknown as TreeNode);
    expect(facadeMockService.overlayService.confirm).toHaveBeenCalled();

    service.unGroupAreaConfirmation({ data: { nodeIds: [] } } as unknown as TreeNode);
    expect(facadeMockService.overlayService.confirm).toHaveBeenCalled();
  });

  it('addSingleAutomationComponentToArea', () => {
    spyOn(service, 'updateNodeConnectionsToArea');
    service.fillingLineData = {
      ids: [device1ID, 'area_l9h22av7'],
      entities: {
        'area_l9h22av7': {},
        deviceID: {}
      }
    };
    const event = {
      dragNodeId: 'area_l7ubsg95',
      dropNodeId: 'area_l9h22av7',
      dragNodeParentId: 'ROOT',
      dragNodeType: FillingLineNodeType.AREA,
      dropNodeType: FillingLineNodeType.AREA,
      dropNodeChildNodeIds: ['b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MF9XYXNoaW5nU3RlcDI=']
    };
    service.addSingleAutomationComponentToArea(event);
    expect(service.updateNodeConnectionsToArea).toHaveBeenCalled();
  });

  it('addSingleAutomationComponentToArea', () => {
    spyOn(service, 'updateNodeConnectionsToArea');
    service.fillingLineData = {
      ids: [device1ID, 'area_l9h22av7'],
      entities: {
        'area_l9h22av7': {},
        deviceID: {}
      }
    };
    const event = {
      dragNodeId: 'area_l9h22av7',
      dropNodeId: device1ID,
      dragNodeParentId: 'ROOT',
      dragNodeType: FillingLineNodeType.NODE,
      dropNodeType: FillingLineNodeType.HEADER,
      dropNodeChildNodeIds: ['b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MF9XYXNoaW5nU3RlcDI=']
    };
    service.addSingleAutomationComponentToArea(event);
    expect(service.updateNodeConnectionsToArea).toHaveBeenCalled();
  });

  it('updateAreaInEditor', () => {
    spyOn(service, 'updateNodesInEditor');
    areaMockData.id = '100';
    service.fillingLineData = {
      ids: [device1ID, '100'],
      entities: {
        '100': { x: '10' },
        deviceID: {}
      }
    };
    service.updateAreaInEditor('100', '10');
    expect(service.updateNodesInEditor).toHaveBeenCalled();
  });
  it('updateExposedInterfaceSubConnectionId', () => {

  });
  it('nodeSelect with parent data', () => {
    service.nodeSelect(item);
    expect(facadeMockService.commonService.updateNavigationToAnother).toHaveBeenCalled();
    expect(facadeMockService.editorService.selectedAreaData).toHaveBeenCalled();

    item.data.parent = ROOT_EDITOR;
    service.nodeSelect(item);
  });

  it('nodeSelect without parent data', () => {
    item.parent = undefined;
    service.menuTreeData = { children: [] };
    service.nodeSelect(item);
    expect(facadeMockService.commonService.updateNavigationToAnother).toHaveBeenCalled();
    expect(facadeMockService.editorService.selectedAreaData).toHaveBeenCalled();
  });

  it('removeInteractionEvents', () => {
    spyOn(service, 'updateSubconnectionIdAfterUngroup');
    const disableIfUnauthorizedDirective = {
      hasPermission() {
        return false;
      }
    };
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{
      element: {
        querySelector() {
          return 'header' as unknown as SVGElement;
        }
      },
      getAllAnchorNodes() {
        return [opcnode];
      }
    }];
    service.removeInteractionEvents(disableIfUnauthorizedDirective as unknown as DisableIfUnauthorizedDirective);
  });

  it('getChildExposedAreaId', () => {
    fillingAreaMockData.clientInterfaceIds = mockedClientInterfaceIds as ISidePanel[];
    fillingAreaMockData.serverInterfaceIds = mockedServerInterfaceIds as ISidePanel[];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue([fillingAreaMockData]);

    const res = service.getChildExposedAreaId('ROOT', '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==');
    expect(facadeMockService.dataService.getAllAreas).toHaveBeenCalled();
  });

  it('updateSubconnectionIdAfterUngroup', () => {
    let spyOb = spyOn(service, 'getChildExposedAreaId');
    spyOb.and.returnValue('testt');
    service.updateSubconnectionIdAfterUngroup('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=', 'test');
  });

  it('updateSubconnectionIdAfterUngroup with getChildExposedAreaId as undefined', () => {
    service.updateSubconnectionIdAfterUngroup('', 'test');
  });

  it('updateExposedInterfaceSubConnectionId', () => {
    fillingAreaMockData.clientInterfaceIds = mockedClientInterfaceIds as ISidePanel[];
    fillingAreaMockData.serverInterfaceIds = mockedServerInterfaceIds as ISidePanel[];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(fillingAreaMockData);
    service.updateExposedInterfaceSubConnectionId('ROOT', { acId: '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==' } as unknown as SubConnection);
  });

  it('updateAreaLabels', () => {
    service.updateAreaLabels(node as unknown as TreeNode, 'testtt');
    expect(facadeMockService.fillingLineService.selectDevice).toHaveBeenCalled();
    expect(facadeMockService.editorService.selectedAreaData).toHaveBeenCalled();
  });

  it('setBreadCrumAfterAreaDelete', () => {
    service.setBreadCrumAfterAreaDelete('area', node as unknown as TreeNode);
    expect(facadeMockService.editorService.selectedAreaData).toHaveBeenCalled();
  });


  //unGroupAreaHavingNodeID
  it('unGroupAreaHavingNodeID', () => {
    const nodeIds = [
      "ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n",
      "824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw=="
    ];
    Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'updateParentIfMissing').value.and.returnValue([mockNode]);
    service.unGroupAreaHavingNodeID(mockNode, nodeIds, mockNode_particular);
  });

  it('validateCommonParentWithCurrentEditor should return parent as ROOT', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue({ id: "ROOT" });
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue(areasList);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue({ parent: "ROOT" });
    expect(service.validateCommonParentWithCurrentEditor("ROOT")).toEqual('ROOT');
  });

  it('validateCommonParentWithCurrentEditor should return empty if area details is not present', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue({ id: "ROOT" });
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue(areasList);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(null);
    expect(service.validateCommonParentWithCurrentEditor("ROOT")).toEqual('');
  });

  // it('updateParentIfMissing ', () => {
  //     Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue({ id: "ROOT" });
  //     Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllAreas').value.and.returnValue(areasList);
  //     Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(null);
  //     const copyMockNode = { ...mockNode };
  //     copyMockNode[0].parent = null;
  //     copyMockNode['children'][0]['parent'] = null;
  //     console.log("copyMockNode: ", copyMockNode);
  //     expect(service.updateParentIfMissing(copyMockNode)).toEqual(mockNode);

  // });

  it('symbol', () => {
    const res = service.symbol(1);
    expect(res).toEqual('>');

    const res1 = service.symbol(0);
    expect(res1).toEqual('');
  });
  it('isExposedConnectionPresentInClientInterface', () => {
    service.isExposedConnectionPresentInClientInterface('test', 'test');
  });

  it('getExposeInterfaceDetailsOfSpecificType', () => {
    const res = service.getExposeInterfaceDetailsOfSpecificType('test', 'test', 'test', SubConnectorCreationMode.MANUAL, true, 'test');
    expect(res).toBeDefined();
    const res1 = service.getExposeInterfaceDetailsOfSpecificType('test', 'test', 'test', SubConnectorCreationMode.MANUAL, false, 'test');
    expect(res1).toBeDefined();
  });

  it('updateInterfaceExposedMode', () => {
    const res = service.updateInterfaceExposedMode('test', 'test', { interfaceExposedMode: SubConnectorCreationMode.MANUAL } as unknown as ISidePanel,
      SubConnectorCreationMode.MANUAL, SubConnectorCreationMode.MANUAL, 'test');
    expect(facadeMockService.plantAreaService.updateInterfaceDetailsToServiceNStore).toHaveBeenCalled();
  });

  it('updateParentInterfaces', () => {
    service['updateParentInterfaces']({} as unknown as InterfaceDetails, 'test', 'test', 'test', [], 'test');
    expect(facadeMockService.plantAreaService.updateInterfaceDetailsToServiceNStore).toHaveBeenCalled();
  });

  it('updateNodesInEditor', () => {
    service.fillingLineData = {
      ids: [device1ID, 'area_l9h22av7'],
      entities: {
        '100': {
          x: 10
        }
      }
    };
    service.updateNodesInEditor('100', 'test', {} as unknown as ISidePanel);
    expect(facadeMockService.drawService.assignNodetoArea).toHaveBeenCalled();
  });

  it('updateAreaFillingLine', () => {
    const dragDropNodeDetails = {
      dropNodeChildNodeIds: []
    };
    const selectedItems = [{
      data: {
        id: 'test'
      }
    }];
    service.updateAreaFillingLine(dragDropNodeDetails, selectedItems);
    expect(facadeMockService.plantAreaService.updateArea).toHaveBeenCalled();
  });

  it('updateAreaFillingLineDragNode', () => {
    service.updateAreaFillingLineDragNode({} as unknown as DragDropData, [{}] as unknown as TreeNode[], [{ id: '123' }]);
    expect(facadeMockService.plantAreaService.removeNodeIdfromArea).toHaveBeenCalled();
  });

  it('updateSubconnectionAfterUngroup', () => {
    service.updateSubconnectionAfterUngroup({});
    expect(facadeMockService.dataService.getConnectionListByNodeId).toHaveBeenCalled();
  });

  //    it('reOrderArea',()=>{
  //     service.reOrderArea({} as unknown as DragDropData,[] as unknown as TreeNode[])
  //    })

  it('reOrderArea', () => {
    spyOn(service, 'reorderMultipleAreas');
    const node = [{
      key: 'test',
      type: FillingLineNodeType.AREA
    }] as unknown as TreeNode[];
    service.selectedItems = node;
    let dragDropNode = {
      dragNodeParentId: 'test',
      dropNodeId: 'tset',
      dragNodeId: 'test'
    };
    service.reOrderArea(dragDropNode, node);

    dragDropNode.dragNodeId = 'teesst';
    service.reOrderArea(dragDropNode, node);
    expect(service.reorderMultipleAreas).toHaveBeenCalled();
  });

  it('reorderMultipleAreas', () => {
    spyOn(service, 'reorderWithNoConnection');
    spyOn(service, 'updateNodesInEditor');
    spyOn(service, 'updateNodeConnectionsToArea');
    spyOn(service, 'updateAreaFillingLine');
    spyOn(service, 'addSingleAutomationComponentToArea');
    service.reorderMultipleAreas([{ id: 'test' }], {});
    expect(service.updateAreaFillingLine).toHaveBeenCalled();

    service.reorderMultipleAreas([], {});
    expect(service.addSingleAutomationComponentToArea).toHaveBeenCalled();
  });

  it('updateNodeDetails', () => {
    spyOn(service, 'updateAreaInEditor');
    spyOn(service, 'reorderWithNoConnection');
    spyOn(service, 'updateNodeConnectionsToArea');
    service.updateNodeDetails({} as unknown as DragDropData, { type: FillingLineNodeType.AREA } as unknown as TreeNode, ['a']);
    expect(service.updateAreaInEditor).toHaveBeenCalled();
  });

});

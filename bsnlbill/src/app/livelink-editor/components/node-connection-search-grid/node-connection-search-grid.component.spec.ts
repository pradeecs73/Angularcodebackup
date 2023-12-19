/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { parentNode } from 'mockData/parentNode';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { FillingLineNodeType } from 'src/app/enum/enum';
import { AreaHierarchy } from 'src/app/models/area.interface';
import { Project } from 'src/app/models/models';
import { HTMLNode } from 'src/app/opcua/opcnodes/htmlNode';
import { EditorService } from 'src/app/opcua/opcua-services/livelink-editor.service';
import { AreaUtilityService } from 'src/app/services/area-utility.service';
import { FillingLineService } from 'src/app/services/filling-line-store.service';
import { ProjectDataService } from 'src/app/shared/services/dataservice/project-data.service';
import { ROOT_EDITOR } from 'src/app/utility/constant';
import { SelectedContextAnchor } from '../../../models/connection.interface';
import { NodeAnchor } from '../../../opcua/opcnodes/node-anchor';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { StrategyManagerService } from '../../services/strategy-manager.service';
import { NodeConnectionSearchGridComponent } from './node-connection-search-grid.component';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('NodeConnectionSearchGridComponent', () => {
  const uniqid = require('uniqid');
  let areaService: AreaUtilityService;
  let component: NodeConnectionSearchGridComponent;
  let dataService: ProjectDataService;
  let editorService: EditorService
  let facadeMockService;
  let fixture: ComponentFixture<NodeConnectionSearchGridComponent>;
  let messageService: MessageService;
  let mockFillingLineService: FillingLineService;
  let mockStore: Store;
  let strategyManagerService:StrategyManagerService;
  const compatibleInterfacesArr = [
    {
      automationComponentId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
      automationComponentName: 'LiquidMixing',
      deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==',
      displayName: 'LiquidMixing [FillingToMixing]',
      hideCheckBox: false,
      hoverDisplayName: 'test >  Area 2 > LiquidMixing > FillingToMixing',
      interfaceName: 'FillingToMixing',
      isClientInterface: false,
      isSelected: false,
      parent: 'ROOT',
      type: 'FillToMix_Type'
    }
  ]
  const radioButtonEvent = {
    target: {
      checked: true
    },
    stopImmediatePropagation: () => {

    }
  }

  const areaHierarchyMockData = {
    commonParent: "area_l8wodp9v",
    sourceAreaHierarchy: [
        "ROOT",
        "area_l8jo551s",
        "area_l8wodp9v"
    ],
    targetAreaHierarchy: [
        "ROOT",
        "area_l8jo551s",
        "area_l8wodp9v",
        "area_l8wohkdm"
    ]
} as AreaHierarchy;
  const project = <Project>{
    'date': '4',
    'name': 'firstProj',
    'comment': 'projectComment',
    'author': 'projectauthor',
    'id': uniqid.time()
  };

  const matchingInterfaces = [
    {
        "isSelected": false,
        "hideCheckBox": false,
        "hoverDisplayName": "CNP >  Area 1> Area 3> Area 4\n           > LiquidMixing > FillingToMixing",
        "displayName": "LiquidMixing [FillingToMixing]",
        "automationComponentId": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=",
        "automationComponentName": "LiquidMixing",
        "deviceId": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==",
        "interfaceName": "FillingToMixing",
        "isClientInterface": false,
        "parent": "area_l8wohkdm",
        "type": "FillToMix_Type",
        "interfaceId": "serverInf_l81dx4du"
    }
];


  const getSourceHierarchy = {
    "sourceHierarchy": [
        "ROOT",
        "area_l8jo551s",
        "area_l8wodp9v"
    ],
    "targetHierarchy": [
        "ROOT",
        "area_l8jo551s",
        "area_l8wodp9v",
        "area_l8wohkdm"
    ],
    "sourceAcId": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n",
    "targetAcId": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc="
}
 



  const areaHierarchyRes = {
    areaName: 'Area 2',
    areaList: [{
      connectionIds: [],
      id: 'area_l85tppd2',
      name: 'Area 2',
      nodeIds: ['b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc='],
      parent: 'ROOT',
      x: 15,
      y: 340
    }]
  }


  beforeEach(async () => {
    facadeMockService = new FacadeMockService();

    mockFillingLineService = jasmine.createSpyObj('FillingLineService',
      [{ 'getFillingLine': null },
        'updateNode',
        'updateArea']);
    dataService = jasmine.createSpyObj('ProjectDataService', [
      'getMappedCompatibleInterfaceByType',
      'getProjectName',
      'getArea',
      'getProjectData',
      'addOrUpdateConnection',
      'getNodeByID',
      'getAreaClientInterface',
      'getAreaServerInterface',
      'getAllAreas'
    ]);
    areaService = jasmine.createSpyObj('AreaService', [
      'exposeConnectionInParentArea',
      'generateInitialConnectionObject',
      'deleteExposeConnectionByAreaIdAndType',
      'updateSubConenctionsWithConenctionId',
      'isTargetConnectionNested',
      'getAreaHierarchy',
      'getCommonParent',
      'getSourceTargetDevice',
      'getScenario',
      'drawAreaInterfaceAndConnector',
      'validateCommonParentWithCurrentEditor']);
      
    editorService = jasmine.createSpyObj('EditorService', [
      'getCurrentAreaHierarchy',
      'toggleAnchorSelection',
      'liveLinkEditor',
      'updateHTMLNode',
      'getEditorContext',
      'selectedAreaData'
    ]);
    
    strategyManagerService = jasmine.createSpyObj('StrategyManagerService', [
      'executeStrategy'
    ])

    Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getMappedCompatibleInterfaceByType').value.and.returnValue(matchingInterfaces);
    Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getCommonParent').value.and.returnValue(areaHierarchyMockData);
    Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getAreaHierarchy').value.and.returnValue(areaHierarchyRes);
    Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getSourceTargetDevice').value.and.returnValue(getSourceHierarchy);
    Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getScenario').value.and.returnValue('NestedSiblingsAreaStrategy');
    Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getEditorContext').value.and.returnValue({ id: ROOT_EDITOR, name: '' });
    FacadeMockService['areaUtilityService'] = areaService;
    editorService.liveLinkEditor.editorNodes = [{
      type: FillingLineNodeType.AREA,
      parent: 'area_123',
      id: '1234',
    } as unknown as HTMLNode]
    await TestBed.configureTestingModule({
      declarations: [NodeConnectionSearchGridComponent],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: Store, useValue: mockStore },
        { provide: FacadeService, useValue: facadeMockService},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeConnectionSearchGridComponent);
    component = fixture.componentInstance;
    component['matchingInterfaces'] = matchingInterfaces;
    component.connectionSearchContextMenu = {
      anchorDetails: {
        interfaceData: {
          type: 'FillToMix_Type'
        },
        parentNode: parentNode,
        connectionName: 'LiquidMixin__BottleFilling'
      } as unknown as NodeAnchor,
      isClient: true
    } as unknown as SelectedContextAnchor
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('radioButtonChecked', () => {
    component.radioButtonChecked(radioButtonEvent, compatibleInterfacesArr[0]);
    fixture.detectChanges();
    expect(facadeMockService.editorService.toggleAnchorSelection).toHaveBeenCalled();
  })

  
  it('radioButtonChecked with client interface', () => {
    const serverInterface = {...compatibleInterfacesArr[0],isClientInterface:true,}
    component.radioButtonChecked(radioButtonEvent, serverInterface);
    fixture.detectChanges();
    expect(facadeMockService.editorService.toggleAnchorSelection).toHaveBeenCalled();
  })

 it('toggleSearchIcon', () => {
    component.showSearch = true;
    component.toggleSearchIcon();
    expect(component.showSearch).toEqual(false);
    expect(component.searchText).toEqual('')
  })

    /*  it('onSearch', () => {
    const event = {
      target: {
        value: 'Liquid'
      }
    }
    component.onSearch(event);
    expect(component.replaceFixedArray).toHaveBeenCalled();
  })

it('exposeConnectionUptoTarget with isCurrentAreaNestedInsideTarget and isTargetConnectionNested true ', () => {
    const isOutputNested = {
      isCurrentAreaNestedInsideTarget: true,
      isTargetConnectionNested: true,
      parentAreaDetails: {}
    }
    component.exposeConnectionUptoTarget('area_l85tppd2',
      true,
      'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==',
      'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
      'ClientServer',
      'FillingToMixing',
      isOutputNested,
      false,
      'FillToMix_Type')
    expect(dataService.getNodeByID).toHaveBeenCalled();
  })

  it('exposeConnectionUptoTarget with isCurrentAreaNestedInsideTarget and isTargetConnectionNested false ', () => {
    const isOutputNested = {
      isCurrentAreaNestedInsideTarget: true,
      isTargetConnectionNested: true,
      parentAreaDetails: {}
    }
    component.exposeConnectionUptoTarget('area_l85tppd2',
      false,
      'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==',
      'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
      'ClientServer',
      'FillingToMixing',
      isOutputNested,
      true,
      'FillToMix_Type')
    expect(dataService.getAreaServerInterface).toHaveBeenCalled();
  })

  it('exposeConnectionUptoTarget with isCurrentAreaNestedInsideTarget and isInput false ', () => {
    const isOutputNested = {
      isCurrentAreaNestedInsideTarget: false,
      isTargetConnectionNested: true,
      parentAreaDetails: {}
    }
    component.exposeConnectionUptoTarget('area_l85tppd2',
      false,
      'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==',
      'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
      'ClientServer',
      'FillingToMixing',
      isOutputNested,
      false,
      'FillToMix_Type')
    expect(dataService.getAreaServerInterface).toHaveBeenCalled();
  })

  it('exposeSelectedConnection', () => {
    const targetDevice = compatibleInterfacesArr[0];
    targetDevice.parent = 'area_l85tpop4';
    component.exposeSelectedConnection(targetDevice);
    expect(dataService.addOrUpdateConnection).toHaveBeenCalled();
  })

  it('getSiblingAreaForUpdate', () => {
    const matchingInterfaceHierarchy = {
      areaName: 'abcde',
      areaList: [{
        name: 'area',
        id: '1234',
        x: 123,
        y: 420,
        clientInterfaceIds: [],
        serverInterfaceIds: [],
        nodeIds: [],
        connectionIds: []
      }]
    }
    const connection = {
      id: 'abcde',
      in: 'shei',
      out: 'nsje',
      selected: false,
      creationMode: ConnectorCreationMode.MANUAL,
      hasSubConnections: true,
      areaId: 'abcde',
      acIds: 'shien'
    }
    const parent = {
      parent: 'area_123'
    }
    component.getSiblingAreaForUpdate(parent, {}, connection, matchingInterfaceHierarchy)
    expect(areaService.drawAreaInterfaceAndConnector).toHaveBeenCalled();
  }) */
});

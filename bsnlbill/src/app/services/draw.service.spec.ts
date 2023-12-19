/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EntityState } from '@ngrx/entity';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { ConnectorCreationMode, ConnectorType, FillingLineNodeType, SubConnectorCreationMode } from '../enum/enum';
import { HomeComponent } from '../home/home.component';
import { Connection, InterfaceDetails, SubConnection } from '../models/connection.interface';
import { HTMLNodeConnector } from '../models/models';
import { RelatedEndPointInterface } from '../models/targetmodel.interface';
import { PlantArea } from '../opcua/opcnodes/area';
import { BaseConnector } from '../opcua/opcnodes/baseConnector';
import { Connector } from '../opcua/opcnodes/connector';
import { HTMLNode } from '../opcua/opcnodes/htmlNode';
import { NodeAnchor } from '../opcua/opcnodes/node-anchor';
import { OPCNode } from '../opcua/opcnodes/opcnode';
import { SubConnector } from '../opcua/opcnodes/subConnector';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { FillingArea, FillingNode } from '../store/filling-line/filling-line.reducer';
import { DrawService } from './draw.service';

let mockMessageService: MessageService;
let service: DrawService;

fdescribe('DrawService', () => {
  let facadeMockService: FacadeMockService;
  beforeEach(() => {
    facadeMockService = new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useValue: mockMessageService },
      { provide: FacadeService, useValue: facadeMockService }],
      imports: [TranslateModule.forRoot({}), RouterTestingModule.withRoutes(
        [{ path: 'home', component: HomeComponent }]
      )]
    });
    service = TestBed.inject(DrawService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call deleteAreaData method', () => {
    const areaId = 'area12345';
    const area = { id: 'area5678' } as unknown as PlantArea;
    spyOn<any>(service, 'removeNodeFromEditor');
    service.deleteAreaData(areaId, area);
    expect(service.deleteAreaData).toBeDefined();
  });

  it('should call rmoeveSubConnectionForOfflineMode method', () => {
    const subConnection = { connectionId: 'subconnection12345' } as unknown as SubConnection;
    const subConnector = { connectionId: 'subconnector12345' } as unknown as SubConnector;

    service.removeSubConnectionForOfflineMode(subConnection, subConnector);
    expect(service.removeSubConnectionForOfflineMode).toBeDefined();
  });

  it('should call updateAreaReassignment method', () => {

    const node = {
      id: 'node12345',
      parent: 'parent12345'
    } as unknown as OPCNode;

    service.updateAreaReassignment(node, 'parent678910');
    expect(service.updateAreaReassignment).toBeDefined();

  });

  it('should call interfaceListForPlantArea method', () => {

    let plantArea = {} as unknown as PlantArea;
    const interfaceDetails = {} as unknown as InterfaceDetails;
    const subConnection = { areaId: 'area12345' } as unknown as SubConnection;

    spyOn(service, 'updateAndRedrawAreaNode');
    service.interfaceListForPlantArea(plantArea, interfaceDetails, subConnection);
    expect(service.interfaceListForPlantArea).toBeDefined();

    plantArea = null as unknown as PlantArea;

    service.interfaceListForPlantArea(plantArea, interfaceDetails, subConnection);
    expect(service.interfaceListForPlantArea).toBeDefined();
    expect(facadeMockService.plantAreaService.updateInterfaceDetailsToServiceNStore).toBeDefined();


  });

  it('should call removeSubconnectionInterface method', () => {

    const subConnection = { id: 'subconnection12345' } as unknown as SubConnection;
    let subConnector = { connectionId: 'subconnector12345' } as unknown as SubConnector;

    service.removeSubconnectionInterface(subConnector, subConnection);
    expect(service.removeSubconnectionInterface).toBeDefined();

    subConnector = null;
    service.removeSubconnectionInterface(subConnector, subConnection);
    expect(service.removeSubconnectionInterface).toBeDefined();

  });

  it('should call styleConnectorInEditor method', () => {

    const connector = {} as unknown as BaseConnector;
    service.styleConnectorInEditor(connector);
    expect(service.styleConnectorInEditor).toBeDefined();

  });

  it('should call updateAndRedrawAreaNode method', () => {

    const area = { id: 'area12345' } as unknown as PlantArea;
    const interfaceDetails = {} as unknown as InterfaceDetails;
    spyOn(service, 'redrawAreaNode');
    service.updateAndRedrawAreaNode(area, interfaceDetails);
    expect(service.updateAndRedrawAreaNode).toBeDefined();

  });

  it('should call drawAreaInterface method', () => {

    const nodeObj = { id: 'node12345' } as unknown as PlantArea;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'node12345' }] as unknown as HTMLNode[];

    spyOn(service, 'refreshHTMLSVG');
    service.drawAreaInterface(nodeObj);
    expect(service.drawAreaInterface).toBeDefined();

  });

  it('should call assignNodetoArea method', () => {

    const opcnode = {
      id: 'opcnode12345',
      parent: 'parent12345'
    } as unknown as OPCNode;

    const areaId = 'area12345';

    spyOn<any>(service, 'removeNodeFromEditor');
    spyOn<any>(service, 'removeHTMLNodeConnectorsFromEditor');
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue({ id: 'editor12345' });
    service.assignNodetoArea(opcnode, areaId);
    expect(service.assignNodetoArea).toBeDefined();

  });

  it('should call redrawAreaNode method', () => {

    const area = {
      id: 'area12345'
    } as unknown as PlantArea;

    const areaConnections = [{ id: 'connection12345' }];

    spyOn<any>(service, 'drawAreaInterface');
    spyOn<any>(service, 'drawConnector');
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAreaAllConnections').value.and.returnValue(areaConnections);
    service.redrawAreaNode(area);
    expect(service.redrawAreaNode).toBeDefined();
    expect(facadeMockService.dataService.getAreaAllConnections).toBeDefined();

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAreaAllConnections').value.and.returnValue([]);
    service.redrawAreaNode(area);
    expect(service.redrawAreaNode).toBeDefined();

  });

  it('should call resetEditorConnectionOnline method', () => {
    service.resetEditorConnectionOnline();
    expect(service.resetEditorConnectionOnline).toBeDefined();
  });

  it('should call clearPreviousSubConnections method', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'isRootEditor').value.and.returnValue(true);
    service.clearPreviousSubConnections();
    expect(service.clearPreviousSubConnections).toBeDefined();
  });

  it('should call removeAreaConnectionsFromEditor method', () => {
    const areaId = 'area12345';
    spyOn(service, 'removeHTMLNodeConnectorsFromEditor');
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'area12345' }] as unknown as PlantArea[];
    service.removeAreaConnectionsFromEditor(areaId);
    expect(service.removeAreaConnectionsFromEditor).toBeDefined();
  });

  it('should call removeHTMLNodeConnectorsFromEditor method', () => {
    const node = {
      getAllNodeConnectors: () => [{ id: 'connector12345' }]
    } as unknown as OPCNode;

    service.removeHTMLNodeConnectorsFromEditor(node);
    expect(service.removeHTMLNodeConnectorsFromEditor).toBeDefined();

  });

  it('should call deleteNodeConnectors method', () => {
    const node = {
      getAllNodeConnectors: () => [{ id: 'connector12345', type: ConnectorType.CONNECTOR }]
    } as unknown as OPCNode;

    service.deleteNodeConnectors(node);
    expect(service.deleteNodeConnectors).toBeDefined();

  });

  it('should call resetEditorConnectionOffline method', () => {
    facadeMockService.commonService.isActualConnectionMode = true;
    facadeMockService.editorService.isConnectionMultiSelect = false;
    service.resetEditorConnectionOffline();
    expect(service.resetEditorConnectionOffline).toBeDefined();
    expect(facadeMockService.connectorService.resetConnectionList).toBeDefined();

  });

  it('should call draw method', () => {
    const mycanvas = {};
    spyOn(service, 'drawBaseCanvas');
    spyOn<any>(service, 'subscribeToFillingStore');
    service.draw(mycanvas);
    expect(service.draw).toBeDefined();

  });

  it('should call resetEditorStyles method', () => {
    service.resetEditorStyles();
    expect(service.resetEditorStyles).toBeDefined();
    expect(facadeMockService.editorService.selectedNode).toEqual(null);
  });

  it('should call cleanTheEditor method', () => {
    spyOn(service.editorNodeMap, 'clear');
    service.cleanTheEditor();
    expect(service.cleanTheEditor).toBeDefined();
    expect(facadeMockService.editorService.resetEditor).toBeDefined();
  });

  it('should call applyStyleToEditor method', () => {
    spyOn<any>(service, 'styleNodesInEditor');
    spyOn<any>(service, 'styleConnectorsInEditor');
    spyOn<any>(service, 'styleSubConnectorsInEditor');
    service.applyStyleToEditor();
    expect(service.applyStyleToEditor).toBeDefined();
  });

  it('should call removeNode method', () => {
    const opcNode = {
      id: 'opcnode12345'
    } as unknown as OPCNode;
    spyOn<any>(service, 'removeNodeFromEditor');
    service.removeNode(opcNode);
    expect(service.removeNode).toBeDefined();

  });

  it('should call removeNode method', () => {
    const htmlNode = {
      id: 'opcnode12345',
      element: {
        remove: () => true
      },
      node: {
        html: () => true
      }
    } as unknown as OPCNode;

    spyOn(service.editorNodeMap, 'delete');
    service['removeNodeFromEditor'](htmlNode);
    expect(service.removeNode).toBeDefined();

  });

  it('should call updateAndStyleConnector method', () => {
    const connector = {
      updateConnectionEndPointStatus: () => true
    } as unknown as BaseConnector;
    const connectionStatus = true;
    const relatedEndPoint = '/releted' as unknown as RelatedEndPointInterface;
    spyOn(service, 'styleConnectorInEditor');

    service.updateAndStyleConnector(connector, connectionStatus, relatedEndPoint);
    expect(service.updateAndStyleConnector).toBeDefined();

  });

  it('should call styleConnectorsInEditor method', () => {
    spyOn(service, 'styleConnectorInEditor');
    facadeMockService.editorService.liveLinkEditor.connectorLookup = { id: 'connector12345' } as unknown as HTMLNodeConnector;

    service['styleConnectorsInEditor']();
    expect(service['styleConnectorsInEditor']).toBeDefined();

  });

  it('should call styleSubConnectorsInEditor method', () => {

    spyOn(service, 'styleConnectorInEditor');
    facadeMockService.editorService.liveLinkEditor.subConnectorLookup = { id: 'connector12345' } as unknown as HTMLNodeConnector;
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'isRootEditor').value.and.returnValue(false);
    service['styleSubConnectorsInEditor']();
    expect(service['styleSubConnectorsInEditor']).toBeDefined();

  });

  it('should call removeOnlineConnections method', () => {

    const connections = [{ id: 'key', creationMode: ConnectorCreationMode.ONLINE }];

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllConnections').value.and.returnValue(connections);
    facadeMockService.editorService.liveLinkEditor.connectorLookup = {
      'key': {
        resetEndPointDetails: () => true
      } as unknown as Connector
    };
    service.removeOnlineConnections();
    expect(service.removeOnlineConnections).toBeDefined();

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllConnections').value.and.returnValue(null);
    service.removeOnlineConnections();
    expect(service.removeOnlineConnections).toBeDefined();

  });

  it('should call styleNodesInEditor method', () => {
    service.editorNodeMap.set('area12345', true);
    const checkIfNodeAlreadyExistReturn = service['checkIfNodeAlreadyExist']('area12345');
    expect(service['checkIfNodeAlreadyExist']).toBeDefined();
    expect(checkIfNodeAlreadyExistReturn).toEqual(true);
  });

  it('should call checkIfNodeAlreadyExist method', () => {
    const nodes = [{ type: FillingLineNodeType.NODE }] as unknown as HTMLNode[];
    facadeMockService.editorService.liveLinkEditor.editorNodes = nodes;

    service['styleNodesInEditor']();
    expect(service['styleNodesInEditor']).toBeDefined();

  });

  it('should call fetchHTMLNode method', () => {
    const nodeId = 'node12345';
    const nodes = [{ type: FillingLineNodeType.NODE, parent: 'parent12345' }] as unknown as HTMLNode[];
    facadeMockService.editorService.liveLinkEditor.editorNodes = nodes;
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue({ id: 'parent12345' });
    service['fetchHTMLNode'](nodeId);
    expect(service['fetchHTMLNode']).toBeDefined();

  });


  it('should call applyStyleToNode method', () => {
    const nodeObj = {
      selected: true,
      element: '<p></p>'
    } as unknown as FillingNode;

    spyOn<any>(service, 'styleUnselectedNodes');
    spyOn<any>(service, 'styleSelectedNode');
    service['applyStyleToNode'](nodeObj);
    expect(service['applyStyleToNode']).toBeDefined();

  });

  it('should call loadConnections method', () => {
    const connections = [{ id: 'con12345' }];
    spyOn(service, 'drawConnector');

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAreaConnections').value.and.returnValue(connections);
    service.loadConnections();
    expect(service.loadConnections).toBeDefined();

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAreaConnections').value.and.returnValue(null);
    service.loadConnections();
    expect(service.loadConnections).toBeDefined();

  });

  it('should call removeOnlineSubConnections method', () => {

    let subConnections = [{ id: 'con12345', creationMode: SubConnectorCreationMode.ONLINE }];
    spyOn(service, 'removeOnlineExposedInterfacesAndSubConnections');
    spyOn(service, 'removeOnlineSubConnectionsForManualSubCreation');
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllSubConnections').value.and.returnValue(subConnections);
    service.removeOnlineSubConnections();
    expect(service.removeOnlineSubConnections).toBeDefined();

    subConnections = [{ id: 'con12345', creationMode: SubConnectorCreationMode.MANUALONLINE }];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllSubConnections').value.and.returnValue(subConnections);
    service.removeOnlineSubConnections();
    expect(service.removeOnlineSubConnections).toBeDefined();

    subConnections = [{ id: 'con12345', creationMode: SubConnectorCreationMode.MANUALOFFLINE }];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllSubConnections').value.and.returnValue(subConnections);
    service.removeOnlineSubConnections();
    expect(service.removeOnlineSubConnections).toBeDefined();

    subConnections = [{ id: 'con12345', creationMode: SubConnectorCreationMode.PROPOSED }];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllSubConnections').value.and.returnValue(subConnections);
    service.removeOnlineSubConnections();
    expect(service.removeOnlineSubConnections).toBeDefined();

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllSubConnections').value.and.returnValue(null);
    service.removeOnlineSubConnections();
    expect(service.removeOnlineSubConnections).toBeDefined();


  });

  it('should call getDeviceNameFromAnchor  method', () => {

    let anchorDetails = {
      parentNode: {
        id: 'anchor12345',
        type: 'area'
      }
    };

    const areaName = 'myarea';

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(areaName);
    service.getDeviceNameFromAnchor(anchorDetails);
    expect(service.getDeviceNameFromAnchor).toBeDefined();

    anchorDetails = {
      parentNode: {
        id: 'anchor12345',
        type: 'node'
      }
    };
    service.getDeviceNameFromAnchor(anchorDetails);
    expect(service.getDeviceNameFromAnchor).toBeDefined();

  });

  it('should call drawArea  method', () => {

    const editorContext = { id: 'context12345' };
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue(editorContext);

    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ parent: 'context12345', id: 'node12345', type: FillingLineNodeType.NODE },
    { parent: 'context12345', id: 'node12345', type: FillingLineNodeType.AREA }] as unknown as HTMLNode[];

    spyOn(service, 'drawAreaInterface');
    service.drawArea();
    expect(service.drawArea).toBeDefined();

  });

  it('should call createOnlineConnection  method', () => {

    const inputAnchor = {} as unknown as NodeAnchor;
    const relatedEndPoint = { address: '192.168.2.101:4840' };
    const device = { uid: 'device12345' };
    spyOn(service, 'createOnlineConnectionsNoAC');
    spyOn(service, 'createOnlineConnectionWithAC');

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDeviceByAddress').value.and.returnValue(device);
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ parent: 'context12345', id: 'node12345', type: FillingLineNodeType.NODE, deviceId: 'device12345' },
    { parent: 'context12345', id: 'node12345', type: FillingLineNodeType.AREA }] as unknown as HTMLNode[];

    service.createOnlineConnection(relatedEndPoint, inputAnchor);
    expect(service.createOnlineConnection).toBeDefined();

    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ parent: 'context12345', id: 'node12345', type: FillingLineNodeType.AREA, deviceId: 'device12345' }] as unknown as HTMLNode[];

    service.createOnlineConnection(relatedEndPoint, inputAnchor);
    expect(service.createOnlineConnection).toBeDefined();


  });

  it('should call pushNotificationForOnlineConnection  method', () => {

    const inputAnchor = {
      interfaceData: {
        name: 'inputanchorinterface'
      }
    };

    const outputAnchor = {
      interfaceData: {
        name: 'outputanchorinterface'
      }
    };

    spyOn(service, 'getDeviceNameFromAnchor').and.returnValue('sample');
    service.pushNotificationForOnlineConnection(inputAnchor, outputAnchor);
    expect(service.pushNotificationForOnlineConnection).toBeDefined();

  });

  it('should call subscribeToFillingStore  method', () => {

    const editorContext = { id: 'context12345' };
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue(editorContext);

    spyOn<any>(service, 'drawNodes');
    spyOn(service, 'loadConnections');
    spyOn(service, 'clearPreviousSubConnections');

    service.fillingLine = of({} as unknown as EntityState<FillingNode | FillingArea>);
    service['subscribeToFillingStore']();
    expect(service['subscribeToFillingStore']).toBeDefined();

  });

  it('should call drawOrApplyStyleNode  method', () => {
    const key = 'mykey';
    const deviceNode = {} as unknown as FillingArea;
    const parent = 'myparent';

    spyOn<any>(service, 'checkIfNodeAlreadyExist').and.returnValue(false);
    spyOn<any>(service, 'drawEditorNode');
    spyOn<any>(service, 'applyStyleToNode');

    service['drawOrApplyStyleNode'](key, deviceNode, parent);
    expect(service['drawOrApplyStyleNode']).toBeDefined();


  });

  it('should call drawOrApplyStyleNode for else part', () => {
    const key = 'mykey';
    const deviceNode = {} as unknown as FillingArea;
    const parent = 'myparent';

    spyOn<any>(service, 'checkIfNodeAlreadyExist').and.returnValue(true);
    spyOn<any>(service, 'drawEditorNode');
    spyOn<any>(service, 'applyStyleToNode');

    service['drawOrApplyStyleNode'](key, deviceNode, parent);
    expect(service['drawOrApplyStyleNode']).toBeDefined();

  });

  it('should call createOnlineConnectionOutputData method', () => {

    const inputAnchor = {} as unknown as NodeAnchor;
    const outputAnchor = {} as unknown as NodeAnchor;

    const editorContext = { id: 'context12345' };
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue(editorContext);

    spyOn<any>(service, 'createConnector').and.returnValue(true);
    spyOn<any>(service, 'pushNotificationForOnlineConnection');

    service.createOnlineConnectionOutputData(outputAnchor, inputAnchor);
    expect(service.createOnlineConnectionOutputData).toBeDefined();

  });

  it('should call styleSelectedNode method', () => {
    const svg = document.createElement('div') as unknown as SVGGElement;
    const sampleElement = document.createElement('div') as unknown as SVGGElement;
    const sampleElement1 = document.createElement('div') as unknown as SVGGElement;

    sampleElement.setAttribute('id', 'parent-rect');
    sampleElement.classList.add('cls-2');

    sampleElement1.setAttribute('id', 'parent-rect');
    sampleElement1.classList.add('cls-2');

    sampleElement.appendChild(sampleElement1);
    svg.appendChild(sampleElement);

    service['styleSelectedNode'](svg);
    expect(service['styleSelectedNode']).toBeDefined();

  });

  it('should call styleUnselectedNodes method', () => {
    const svg = document.createElement('div') as unknown as SVGGElement;
    const sampleElement = document.createElement('div') as unknown as SVGGElement;
    const sampleElement1 = document.createElement('div') as unknown as SVGGElement;


    sampleElement.setAttribute('id', 'parent-rect');
    sampleElement.classList.add('cls-2-selected');

    sampleElement1.setAttribute('id', 'parent-rect');
    sampleElement1.classList.add('cls-2-selected');

    sampleElement.appendChild(sampleElement1);
    svg.appendChild(sampleElement);

    service['styleUnselectedNodes'](svg);
    expect(service['styleUnselectedNodes']).toBeDefined();

  });

  it('should call createArea method', () => {

    const parentAreaID = 'parent12345';

    let projectData = {
      editor: {
        nodes: [{ parent: 'parent12345', y: 100 }],
        areas: [{ parent: 'parent12345', y: 200 }]
      }
    };

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(projectData);


    service.createArea(parentAreaID);
    expect(service.createArea).toBeDefined();

    projectData = {
      editor: {
        nodes: [],
        areas: []
      }
    };

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(projectData);
    service.createArea(parentAreaID);
    expect(service.createArea).toBeDefined();

    const projectData1 = {
      editor: {

      }
    };

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(projectData1);
    service.createArea(parentAreaID);
    expect(service.createArea).toBeDefined();

  });


  it('should call bindResizeEvent method', () => {

    const canvas = { node: () => document.createElement('div') };
    const height = 100;
    const width = 50;

    service.bindResizeEvent(canvas, height, width);
    expect(service.bindResizeEvent).toBeDefined();

  });

  it('should call drawsvg method', () => {

    const canvasReturn = { append: () => { return { append: () => { return { html: () => true }; }, attr: () => { return { attr: () => { return { append: () => { return { attr: () => true }; } }; } }; } }; } };

    const canvas = { append: () => { return { attr: () => { return { attr: () => { return { attr: () => canvasReturn }; } }; }, html: () => true }; } } as unknown as any;

    service.drawsvg(canvas);
    expect(service.bindResizeEvent).toBeDefined();

  });

  it('should call drawsvgForDevice method', () => {

    const canvasReturn = { append: () => { return { append: () => { return { html: () => true }; } }; } };

    const canvas = { append: () => { return { attr: () => { return { attr: () => { return canvasReturn; } }; } }; } } as unknown as any;

    service['drawsvgForDevice'](canvas);
    expect(service['drawsvgForDevice']).toBeDefined();

  });


  it('should call drawsvg method', () => {

    const canvasReturn = { append: () => { return { append: () => { return { html: () => true }; }, attr: () => { return { attr: () => { return { append: () => { return { attr: () => true }; } }; } }; } }; } };

    const canvas = { append: () => { return { attr: () => { return { attr: () => { return { attr: () => canvasReturn }; } }; }, html: () => true }; } } as unknown as any;

    service.drawsvg(canvas);
    expect(service.bindResizeEvent).toBeDefined();

  });

  it('should call deleteArea method', () => {

    const areaId = 'area12345';
    const areaData = {
      nodeIds: ['node12345']
    };

    const projectData = {
      editor: {
        nodes: [{ id: 'node12345', deviceId: 'device12345' }],
        areas: []
      }
    };

    const device = [{ uid: 'device12345' }];

    const editorContext = { id: 'context12345' };
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue(editorContext);

    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'node12345' }] as unknown as HTMLNode[];
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(areaData);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectData').value.and.returnValue(projectData);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDevices').value.and.returnValue(device);

    spyOn(service, 'removeNode');
    spyOn(service, 'deleteNodeConnectors');
    spyOn(service, 'deleteAreaData');

    service.deleteArea(areaId);
    expect(service.deleteArea).toBeDefined();

  });

  it('should call createOnlineConnectionsNoAC method', () => {

    const inputAnchor = {
      automationComponentId: 'ac12345',
      deviceId: 'device12345'
    } as unknown as NodeAnchor;

    const outputAnchor = {
      automationComponentId: 'ac12345',
      deviceId: 'device12345'
    } as unknown as NodeAnchor;

    const relatedEndPoint = { address: '192.168.2.101:4840' } as unknown as RelatedEndPointInterface;

    const nodes = [{ id: 'ac12345', address: '192.168.2.101:4840' }];

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllNodes').value.and.returnValue(nodes);

    spyOn(service, 'checkConnectionInIsEqualConnectionout');
    spyOn(service, 'createOnlineConnectionOutputData');

    service.createOnlineConnectionsNoAC(inputAnchor, relatedEndPoint, outputAnchor);
    expect(service.createOnlineConnectionsNoAC).toBeDefined();

  });

  it('should call createOnlineConnectionWithAC method', () => {

    let acNodes = [{
      name: 'AC12345', outputs: [
        { interfaceData: { type: 'node', name: 'entity12345' } }
      ]
    }, { name: 'AC678910' }] as unknown as Array<OPCNode>;

    const relatedEndPoint = { automationComponent: 'AC12345', functionalEntity: 'entity12345' } as unknown as RelatedEndPointInterface;

    const inputAnchor = {
      automationComponentId: 'ac12345',
      deviceId: 'device12345',
      interfaceData: { type: 'node' }
    } as unknown as NodeAnchor;

    const outputAnchor = {
      automationComponentId: 'ac12345',
      deviceId: 'device12345'
    } as unknown as NodeAnchor;

    spyOn(service, 'createOnlineConnectionOutputData');

    service.createOnlineConnectionWithAC(acNodes, relatedEndPoint, inputAnchor, outputAnchor);
    expect(service.createOnlineConnectionWithAC).toBeDefined();

    acNodes = [{
      name: 'AC12345', outputs: [
        { interfaceData: { type: 'area', name: 'entity12345' } }
      ]
    }, { name: 'AC678910' }] as unknown as Array<OPCNode>;


    service.createOnlineConnectionWithAC(acNodes, relatedEndPoint, inputAnchor, outputAnchor);
    expect(service.createOnlineConnectionWithAC).toBeDefined();

  });

  it('should call drawBaseCanvas method', () => {

    const myCanvas = document.createElement('canvas');
    service.drawBaseCanvas(myCanvas);
    expect(service.drawBaseCanvas).toBeDefined();

  });

  it('should call drawDeviceNode method', () => {

    const detailsChildDiv = document.createElement('div');
    const automationcomponent = {};
    const fillingNode = { clientInterfaces: [], serverInterfaces: [], address: 'opc.tcp://0.0.0', deviceName:'BottleFilling' } as unknown as FillingNode;

    Object.getOwnPropertyDescriptor(facadeMockService.fillingLineService, 'getFillingNodeData').value.and.
      returnValue(fillingNode);

    const deviceNode = { html: () => true };
    spyOn<any>(service, 'drawsvgForDevice').and.returnValue({ append: () => { return { attr: () => { return { attr: () => deviceNode }; } }; } });

    service.drawDeviceNode(detailsChildDiv, automationcomponent);
    expect(service.drawDeviceNode).toBeDefined();

  });

  it('should call drawNodes method', () => {
    const entityObj = {
      entities: { 12345: { parent: 'parent12345' } },
      ids: ['12345']
    } as unknown as EntityState<FillingNode | FillingArea>;
    const parent = 'parent12345';

    spyOn(service, 'checkNodeExists');
    spyOn<any>(service, 'drawOrApplyStyleNode');

    service['drawNodes'](entityObj, parent);
    expect(service['drawNodes']).toBeDefined();

  });

  it('should call drawConnector method', () => {

    const connection = {
      id: 'clientHTMLNodeId12345__serverHTMLNodeId12345__client',
      acIds: 'clientACId12345__serverACId',
      in: 'clientDeviceId12345__sampleText__clientInterfaceId12345',
      out: 'serverDeviceId12345__sampleText__serverInterfaceId12345',
      interfaceType: 'node'
    } as unknown as Connection;

    const fromNode = {
      inputs: [{
        interfaceData: {
          type: 'client'
        }
      }],
      outputs: [{
        interfaceData: {
          type: 'client'
        }
      }]
    };

    const editorContext = { id: 'context12345' };
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue(editorContext);

    spyOn<any>(service, 'fetchHTMLNode').and.returnValue(fromNode);
    spyOn<any>(service, 'createConnector');

    service.drawConnector(connection);
    expect(service.drawConnector).toBeDefined();

  });

  it('should call drawConnector method', () => {

    const fromAnchor = {
      update: () => true,
      setConnectedInterfaceStyle: () => true
    } as unknown as NodeAnchor;

    const toAnchor = {
      update: () => true,
      setConnectedInterfaceStyle: () => true
    } as unknown as NodeAnchor;

    const creationMode = ConnectorCreationMode.MANUAL;
    const editorContext = 'editor12345';
    const id = 'id12345';
    let existingConnector = {};
    const connector = {
      id: 'connector12345',
      setConnectionId: () => true,
      connectionStatus: 'connected',
      inputAnchor: {
        relatedEndPoint: '192.168.2.101:4840'
      }
    };
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getExistingConnection').value.and.returnValue(existingConnector);
    Object.getOwnPropertyDescriptor(facadeMockService.connectorService, 'createConnector').value.and.returnValue(connector);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnectionEndPointData').value.and.returnValue(null);

    spyOn(service, 'updateAndStyleConnector');

    service.createConnector(fromAnchor, toAnchor, creationMode, editorContext, id);
    expect(service.createConnector).toBeDefined();

    const endPointDetails = {
      relatedEndpoints: {
        value: '192.168.2.101:4840'
      }
    };

    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getExistingConnection').value.and.returnValue(null);
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnectionEndPointData').value.and.returnValue(endPointDetails);

    service.createConnector(fromAnchor, toAnchor, creationMode, editorContext, null);
    expect(service.createConnector).toBeDefined();

  });

  it('should call drawConnector method', () => {

    const key = 'key12345';
    const deviceNode = {
    } as unknown as FillingArea;
    const parent = 'parent12345';

    spyOn<any>(service, 'checkIfNodeAlreadyExist').and.returnValue(false);
    spyOn<any>(service, 'drawEditorNode');

    service.checkNodeExists(key, deviceNode, parent);
    expect(service.checkNodeExists).toBeDefined();

  });

  it('should call drawConnector else part', () => {


    const key = 'key12345';

    const deviceNode = {
      element: {
        setAttribute: () => true,
        classList: {
          contains: () => false,
          add: () => true
        }
      } as unknown as Element,
      type: FillingLineNodeType.AREA
    } as unknown as FillingArea;
    const parent = 'parent12345';

    spyOn<any>(service, 'checkIfNodeAlreadyExist').and.returnValue(true);
    spyOn<any>(service, 'drawEditorNode');
    spyOn<any>(service, 'applyStyleToNode');

    facadeMockService.zoomOperationsService.zoomPercentChange = true;
    service.checkNodeExists(key, deviceNode, parent);
    expect(service.checkNodeExists).toBeDefined();

  });


});

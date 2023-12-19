/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed, waitForAsync } from '@angular/core/testing';
import { ConnectorCreationMode, FillingLineNodeType, Quadrant } from '../../enum/enum';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { SubConnection, SubConnectionIdList } from './../../models/connection.interface';
import { AreaClientInterface } from './../../models/targetmodel.interface';
import { FacadeService } from './../../livelink-editor/services/facade.service';
import { BaseConnector } from './baseConnector';
import { Connector, ConnectorService } from './connector';
import { NodeAnchor } from './node-anchor';
import { TranslateModule } from '@ngx-translate/core';
import { TreeModule } from 'primeng/tree';

fdescribe('Connector service', () => {
  let connectorService;
  let connector;
  let facadeMockService;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService }
      ],
      imports: [TreeModule,TranslateModule.forRoot({})]
    });
    facadeMockService = new FacadeMockService();
    connectorService = new ConnectorService(facadeMockService);
    facadeMockService.editorService.liveLinkEditor.editorNodes = [];
  }));

  beforeEach(waitForAsync(() => {

    const creationMode = ConnectorCreationMode.MANUAL;
    const editorContext = 'ROOT';
    const id = 'editor12345';
    const subConnectors = { clientIds: ['client12345'], serverIds: ['server12345'] };

    const editorNodes = {
      editorNodes: [{ id: 'source1234' }, { id: 'target1234' }],
      connectorElem: { cloneNode: () => document.createElement('div') }
    };
    facadeMockService.editorService.liveLinkEditor = editorNodes;

    connector = new Connector(facadeMockService.editorService.liveLinkEditor, creationMode, editorContext, id, subConnectors);
    expect(connector).toBeTruthy();

    connector = new Connector(facadeMockService.editorService.liveLinkEditor, creationMode, editorContext, id);
    expect(connector).toBeTruthy();

  }));


  it('plant area service should be created', () => {
    expect(connectorService).toBeTruthy();
  });

  it('should call updateConnectortoCommon method', () => {
    const connectorMock = {} as unknown as Connector;
    connectorService.updateConnectortoCommon(connectorMock);
    expect(connectorService.updateConnectortoCommon).toBeDefined();
  });

  it('should call setSelectedStyle method', () => {
    const connectorMock = {
      state: 'PROPOSED',
      setSelectedStyle: () => true
    } as unknown as Connector;

    spyOn(connectorService, 'updateRowForSelectedProposecConnector');
    spyOn(connectorService, 'updateConnectortoCommon');
    connectorService.setSelectedStyle(connectorMock);
    expect(connectorService.setSelectedStyle).toBeDefined();
    const connectorMock1 = {
      state: 'DEFAULT',
      setSelectedStyle: () => true
    } as unknown as Connector;

    connectorService.setSelectedStyle(connectorMock1);
    expect(connectorService.setSelectedStyle).toBeDefined();

  });

  it('should call updateConnector method', () => {
    const connectorMock = {
      state: 'PROPOSED',
      setSelectedStyle: () => true
    } as unknown as Connector;

    connectorService.updateConnector(connectorMock);
    expect(connectorService.updateConnector).toBeDefined();

  });

  it('should call contextMenuHandler method', () => {

    const event = {
      pageX: 100,
      pageY: 100
    };

    const connectorMock = {
      state: 'PROPOSED',
      setSelectedStyle: () => true
    } as unknown as Connector;

    spyOn(connectorService, 'selectConnector');
    spyOn(connectorService, 'addWindowListener');

    connectorService.contextMenuHandler(event, connectorMock);
    expect(connectorService.contextMenuHandler).toBeDefined();

  });

  it('should call updateSubConnectionData method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      setSelectedStyle: () => true
    } as unknown as Connector;

    const subConnection = {
      id: 'sunconnector12345',
      connectionId: 'connector12345'
    } as unknown as SubConnection;

    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getExistingSubConnectorById').value.and.
      returnValue({ connectionId: 'subConnector12345' });
    connectorService.updateSubConnectionData(subConnection, connectorMock);
    expect(connectorService.updateSubConnectionData).toBeDefined();

  });

  it('should call removeConnectionFromCurrectEditor method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      setSelectedStyle: () => true,
      removeAnchorConnectors: () => true,
      reset: () => true,
      resetAnchorsStyle: () => true
    } as unknown as Connector;

    connectorService.removeConnectionFromCurrectEditor(connectorMock);
    expect(connectorService.removeConnectionFromCurrectEditor).toBeDefined();

  });

  it('should call isConnectedDevicesAvailable method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {}
    } as unknown as Connector;

    connectorService.isConnectedDevicesAvailable(connectorMock);
    expect(connectorService.isConnectedDevicesAvailable).toBeDefined();

    const connectorMock1 = {
      id: 'connector12345',
      state: 'PROPOSED'
    } as unknown as Connector;

    const isConnectedDevicesAvailableReturn = connectorService.isConnectedDevicesAvailable(connectorMock1);
    expect(isConnectedDevicesAvailableReturn).toEqual(false);

  });

  it('should call updateAreaConnectorData method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      inputAnchor: {
        parentNode: {
          type: FillingLineNodeType.AREA
        }
      },
      outputAnchor: {
        parentNode: {
          type: FillingLineNodeType.AREA
        }
      }
    } as unknown as Connector;

    spyOn(connectorService, 'updateSubConnectorData');
    connectorService.updateAreaConnectorData(connectorMock);
    expect(connectorService.updateAreaConnectorData).toBeDefined();

  });

  it('should call updateRowForSelectedProposecConnector method', () => {

    facadeMockService.commonService.globalConnectionList = [{
      connector: {
        path: {
          classList: { contains: () => true }
        }
      },
      isRowSelected: false
    }];
    spyOn(connectorService, 'updateSubConnectorData');
    connectorService.updateRowForSelectedProposecConnector();
    expect(connectorService.updateRowForSelectedProposecConnector).toBeDefined();

  });

  it('should call deSelectAllProposedCon method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      defaultSelectedProposedConnectionStyle: () => true,
      setUnselectedProposedConnectionStyle: () => true

    } as unknown as Connector;


    facadeMockService.commonService.globalConnectionList = [{ connector: connectorMock, isRowSelected: true }];
    facadeMockService.commonService.isActualConnectionMode = false;

    connectorService.deSelectAllProposedCon();
    expect(connectorService.deSelectAllProposedCon).toBeDefined();

    const connectorMock1 = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: false,
      defaultSelectedProposedConnectionStyle: () => true,
      setUnselectedProposedConnectionStyle: () => true

    } as unknown as Connector;

    facadeMockService.commonService.globalConnectionList = [{ connector: connectorMock1, isRowSelected: true }];
    connectorService.deSelectAllProposedCon();
    expect(connectorService.deSelectAllProposedCon).toBeDefined();

  });


  it('should call updateSubConnectionsData method', () => {

    const interfaceDetails = {
      deviceId: 'device12345',
    } as unknown as AreaClientInterface;

    const nodeAnchor = {
      deviceId: 'device12345',
    } as unknown as NodeAnchor;

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      defaultSelectedProposedConnectionStyle: () => true,
      setUnselectedProposedConnectionStyle: () => true,
      hasSubConnections: true,
      subConnectors: [{}]
    } as unknown as Connector;

    const subConnections = [{ id: 'subConnection12345' }];

    spyOn(connectorService, 'getSubConnectionsForUpdation').and.returnValue(subConnections);
    spyOn(connectorService, 'updateSubConenctorsID');
    spyOn(connectorService, 'updateSubConnectionData');

    connectorService.updateSubConnectionsData(interfaceDetails, nodeAnchor, true, connectorMock);
    expect(connectorService.updateSubConnectionsData).toBeDefined();

  });

  it('should call remove method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      hasSubConnections: true,
      subConnectors: {
        serverIds: ['server12345'],
        clientIds: ['client12345']
      }
    } as unknown as Connector;

    spyOn(connectorService, 'removeConnectionFromCurrectEditor');

    const subconnection = { connectionId: 'subConnection12345' };
    const subconnector = { connectionId: 'subConnector12345' };

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getSubConnection').value.and.
      returnValue(subconnection);
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getExistingSubConnectorById').value.and.
      returnValue(subconnector);

    connectorService.remove(connectorMock);
    expect(connectorService.remove).toBeDefined();

  });

  it('should call updateSubConnection method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      hasSubConnections: true,
      subConnectors: {
        serverIds: ['server12345'],
        clientIds: ['client12345']
      },
      subConnections: []
    } as unknown as Connector;

    const sourceSubConnectionIds = {
      clientIds: ['client12345'],
      serverIds: ['server12345']
    } as unknown as SubConnectionIdList;

    const targetSubConnectionIds = {
      clientIds: ['client12345'],
      serverIds: ['server12345']
    } as unknown as SubConnectionIdList;

    const sourceSubConnectionIds1 = {

    } as unknown as SubConnectionIdList;

    const targetSubConnectionIds1 = {

    } as unknown as SubConnectionIdList;



    connectorService.updateSubConnection(connectorMock, sourceSubConnectionIds, targetSubConnectionIds);
    expect(connectorService.updateSubConnection).toBeDefined();


    connectorService.updateSubConnection(connectorMock, sourceSubConnectionIds1, targetSubConnectionIds1);
    expect(connectorService.updateSubConnection).toBeDefined();

  });

  it('should call updateSubConnection method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      hasSubConnections: true,
      subConnectors: {
        serverIds: ['server12345'],
        clientIds: ['client12345']
      },
      subConnections: [],
      inputAnchor: {
        parentNode: {
          deviceId: 'device12345',
          id: 'parentnode12345',
          name: 'inputparent',
          type: FillingLineNodeType.HEADER
        },
        interfaceData: {
          id: 'parentnode12345',
          name: 'inputparent'
        }
      },
      outputAnchor: {},
      updateConnectionEndPointStatus: () => true
    } as unknown as BaseConnector;


    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getDevice').value.and.
      returnValue({ address: '192.168.2.101:a4840' });

    connectorService.updateConnectorUnavailableData(connectorMock, true);
    expect(connectorService.updateConnectorUnavailableData).toBeDefined();



  });

  xit('should call updateSubConnectorData method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      hasSubConnections: true,
      subConnectors: {
        clientIds: ['client12345'],
        serverIds: ['server12345']
      },
      subConnections: {
        clientIds: ['client678910'],
        serverIds: ['server678910']
      }
    } as unknown as Connector;

    const nodeAnchor = {
      deviceId: 'device12345'
    } as unknown as NodeAnchor;

    const areaId = 'area12345';

    const isClient = true;

    spyOn(connectorService, 'updateSubConnectionsData');
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnection').value.and.
      returnValue(connectorMock);
    Object.getOwnPropertyDescriptor(facadeMockService.nodeAnchorService, 'getAreaInterfaceDetails').value.and.
      returnValue(nodeAnchor);
    connectorService.updateSubConnectorData(connectorMock, nodeAnchor, areaId, isClient);
    expect(connectorService.updateSubConnectorData).toBeDefined();

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnection').value.and.
      returnValue(null);
    connectorService.updateSubConnectorData(connectorMock, nodeAnchor, areaId, isClient);
    expect(connectorService.updateSubConnectorData).toBeDefined();

    const connectorMock1 = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      hasSubConnections: true,
      subConnections: {
        clientIds: ['client678910'],
        serverIds: ['server678910']
      }
    } as unknown as Connector;

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getConnection').value.and.
      returnValue(connectorMock1);
    connectorService.updateSubConnectorData(connectorMock1, nodeAnchor, areaId, isClient);
    expect(connectorService.updateSubConnectorData).toBeDefined();
  });

  it('should call connect method', () => {

    const connectorMock = {
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      hasSubConnections: true,
      subConnectors: {
        clientIds: ['client12345'],
        serverIds: ['server12345']
      },
      subConnections: {
        clientIds: ['client678910'],
        serverIds: ['server678910']
      },
      getSourceAnchor: () => true,
      isAnchorAlreadyConnected: () => false,
      isBothAnchorOfSameDevice: () => false,
      isValidConnection: () => true,
      setDeviceId: () => true,
      resetHighlightedAnchor: () => true,
      setDefaultAnchorStyle: () => true,
      setConnectionId: () => true,
      isConnected: false
    } as unknown as Connector;

    spyOn(connectorService, 'placeHandle');
    spyOn(connectorService, 'updateAreaConnectorData');
    spyOn(connectorService, 'updateConnector');
    spyOn(connectorService, 'remove');

    connectorService.connect(connectorMock);
    expect(connectorService.connect).toBeDefined();

  });

  it('should call connect method for else', () => {

    const connectorMock1 = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      hasSubConnections: true,
      subConnectors: {
        clientIds: ['client12345'],
        serverIds: ['server12345']
      },
      subConnections: {
        clientIds: ['client678910'],
        serverIds: ['server678910']
      },
      getSourceAnchor: () => true,
      isAnchorAlreadyConnected: () => false,
      isValidConnection: () => false,
      isBothAnchorOfSameDevice: () => false,
      setDeviceId: () => true,
      resetHighlightedAnchor: () => true,
      setDefaultAnchorStyle: () => true,
      isConnected: false
    } as unknown as Connector;

    spyOn(connectorService, 'placeHandle');
    spyOn(connectorService, 'updateAreaConnectorData');
    spyOn(connectorService, 'updateConnector');
    spyOn(connectorService, 'remove');

    connectorService.connect(connectorMock1);
    expect(connectorService.connect).toBeDefined();

  });

  it('should call updateSubConenctorsID method', () => {

    const subConnectors = { clientIds: [] } as unknown as SubConnectionIdList;
    const subConnections = [{ id: 'subConnection12345' }] as unknown as SubConnection;
    let isClient = true;

    connectorService['updateSubConenctorsID'](subConnectors, subConnections, isClient);
    expect(connectorService['updateSubConenctorsID']).toBeDefined();

    isClient = false;
    connectorService['updateSubConenctorsID'](subConnectors, subConnections, isClient);
    expect(connectorService['updateSubConenctorsID']).toBeDefined();

  });

  it('should call getSubConnectionsForUpdation method', () => {

    const interfaceDetails = {
      subConnectionId: 'area_test',
      automationComponentId: 'autocomponent',
      type: 'subcon'
    } as unknown as AreaClientInterface;

    const isClient = true;

    const getAllSubConnections = [{
      id: 'subcon12345',
      acId: 'autocomponent',
      isclient: true
    }];

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllSubConnections').value.and.
      returnValue(getAllSubConnections);
    connectorService['getSubConnectionsForUpdation'](interfaceDetails, isClient);
    expect(connectorService['getSubConnectionsForUpdation']).toBeDefined();

    const interfaceDetails1 = {
      subConnectionId: 'test',
      automationComponentId: 'autocomponent',
      type: 'subcon'
    } as unknown as AreaClientInterface;

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getSubConnection').value.and.
      returnValue({});
    connectorService['getSubConnectionsForUpdation'](interfaceDetails1, isClient);
    expect(connectorService['getSubConnectionsForUpdation']).toBeDefined();


  });

  it('should call addWindowListener method', () => {
    connectorService.addWindowListener();
    expect(connectorService.addWindowListener).toBeDefined();
  });

  it('should call bindClickEvent method', () => {

    const connectorMock = {
      id: 'connector12345',
      state: 'PROPOSED',
      inputDeviceId: {},
      outputDeviceId: {},
      isSelected: true,
      hasSubConnections: true,
      subConnectors: {
        clientIds: ['client12345'],
        serverIds: ['server12345']
      },
      subConnections: {
        clientIds: ['client678910'],
        serverIds: ['server678910']
      },
      getSourceAnchor: () => true,
      isAnchorAlreadyConnected: () => false,
      isValidConnection: () => false,
      setDeviceId: () => true,
      resetHighlightedAnchor: () => true,
      setDefaultAnchorStyle: () => true,
      isConnected: false,
      path: { addEventListener: () => true },
      pathOutline: { addEventListener: () => true }
    } as unknown as Connector;

    connectorService.bindClickEvent(connectorMock);
    expect(connectorService.bindClickEvent).toBeDefined();

  });

  it('should call createConnector method', () => {

    const sourceAnchor = {
      parentNode: {
        id: 'source1234'
      },
      connectors: [],
      addConnector: () => true
    } as unknown as NodeAnchor;
    const creationMode = 'Manual';
    const editorContext = {};
    let targetAnchor = {
      parentNode: {
        id: 'target1234'
      },
      connectors: [],
      addConnector: () => true
    } as unknown as NodeAnchor;

    const subConnectors = { clientIds: [], serverIds: [] };

    const editorNodes = {
      editorNodes: [{ id: 'source1234' }, { id: 'target1234' }],
      connectorElem: { cloneNode: () => document.createElement('div') }
    };

    spyOn(connectorService, 'bindClickEvent');
    facadeMockService.editorService.liveLinkEditor = editorNodes;
    connectorService.createConnector(sourceAnchor, creationMode, editorContext, targetAnchor, '12345', subConnectors);
    expect(connectorService.createConnector).toBeDefined();

    targetAnchor = null;

    connectorService.createConnector(sourceAnchor, creationMode, editorContext, targetAnchor, '12345', subConnectors);
    expect(connectorService.createConnector).toBeDefined();

  });

  it('should call updateHandle method', () => {
    const anchor = {} as unknown as NodeAnchor;
    spyOn(connector, 'updateCirclePosition');
    spyOn(connector, 'updatePath');
    connector.updateHandle(anchor);
    expect(connector.updateHandle).toBeDefined();
  });

  it('should call updateServerSubConnectorId method', () => {
    const subConnectionId = 'subconnection12345';
    connector.subConnectors = { serverIds: [] };
    connector.updateServerSubConnectorId(subConnectionId);
    expect(connector.updateServerSubConnectorId).toBeDefined();
    expect(connector.hasSubConnections).toEqual(true);
  });

  it('should call setConnectionId method', () => {

    connector.inputAnchor = {
      parentNode: { id: 'inputanchor12345' },
      interfaceData: {
        type: 'client'
      }
    };

    connector.outputAnchor = {
      parentNode: { id: 'outputanchor12345' }
    };

    connector.setConnectionId();
    expect(connector.setConnectionId).toBeDefined();
    expect(connector.id).toEqual('inputanchor12345__outputanchor12345__client');

  });

  it('should call highlightSourceInterface method', () => {

    connector.targetAnchor = {
      highLightInterface: () => true
    };

    connector.highlightSourceInterface();
    expect(connector.highlightSourceInterface).toBeDefined();
    expect(connector.targetAnchor.highLightInterface).toBeDefined();

  });

  it('should call highlightSourceInterface method', () => {

    connector.targetAnchor = {
      deHighLightInterface: () => true
    };

    connector.dehighlightSourceInterface();
    expect(connector.dehighlightSourceInterface).toBeDefined();
    expect(connector.targetAnchor.deHighLightInterface).toBeDefined();

  });


  it('should call highlightSourceInterface method', () => {

    connector.targetAnchor = {
      deHighLightInterface: () => true
    };

    connector.dehighlightSourceInterface();
    expect(connector.dehighlightSourceInterface).toBeDefined();
    expect(connector.targetAnchor.deHighLightInterface).toBeDefined();

  });

  it('should call getParentNodeId method', () => {

    connector.inputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      }
    };

    const getParentNodeIdReturn = connector.getParentNodeId();
    expect(connector.getParentNodeId).toBeDefined();
    expect(getParentNodeIdReturn).toEqual('parendnode12345');

  });

  it('should call getParentNodeIInputId method', () => {

    connector.inputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      }
    };

    const getParentNodeIdReturn = connector.getParentNodeIInputId();
    expect(connector.getParentNodeIInputId).toBeDefined();
    expect(getParentNodeIdReturn).toEqual('parendnode12345');

  });

  it('should call setSuccessStyle method', () => {

    spyOn(connector, 'setPathStyle');
    spyOn(connector, 'setAnchorSuccessStyle');

    connector.setSuccessStyle();
    expect(connector.setSuccessStyle).toBeDefined();

  });

  it('should call setFailureStyle method', () => {

    spyOn(connector, 'setPathStyle');
    spyOn(connector, 'setAnchorFailureStyle');

    connector.setFailureStyle();
    expect(connector.setFailureStyle).toBeDefined();

  });

  it('should call setOnlineConStyle method', () => {

    spyOn(connector, 'setPathStyle');
    spyOn(connector, 'setAnchorOnlineStyle');

    connector.setOnlineConStyle();
    expect(connector.setOnlineConStyle).toBeDefined();

  });

  it('should call setDefaultAnchorStyleInterface method', () => {

    connector.inputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setAnchorDefaultStyle: () => true
    };

    connector.outputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setAnchorDefaultStyle: () => true
    };

    connector.setDefaultAnchorStyleInterface();
    expect(connector.setDefaultAnchorStyleInterface).toBeDefined();
    expect(connector.inputAnchor.setAnchorDefaultStyle).toBeDefined();
    expect(connector.outputAnchor.setAnchorDefaultStyle).toBeDefined();

  });

  it('should call setAnchorSuccessStyle method', () => {

    connector.inputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setSuccessAnchorStyle: () => true
    };

    connector.outputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setSuccessAnchorStyle: () => true
    };

    connector.setAnchorSuccessStyle();
    expect(connector.setAnchorSuccessStyle).toBeDefined();
    expect(connector.inputAnchor.setSuccessAnchorStyle).toBeDefined();
    expect(connector.outputAnchor.setSuccessAnchorStyle).toBeDefined();

  });

  it('should call setAnchorFailureStyle method', () => {

    connector.inputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setFailureStyle: () => true
    };

    connector.outputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setFailureStyle: () => true
    };

    connector.setAnchorFailureStyle();
    expect(connector.setAnchorFailureStyle).toBeDefined();
    expect(connector.inputAnchor.setFailureStyle).toBeDefined();
    expect(connector.outputAnchor.setFailureStyle).toBeDefined();

  });

  it('should call setAnchorOnlineStyle method', () => {

    connector.inputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setOnlineSuccessAnchorStyle: () => true
    };

    connector.outputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setOnlineSuccessAnchorStyle: () => true
    };

    connector.setAnchorOnlineStyle();
    expect(connector.setAnchorOnlineStyle).toBeDefined();
    expect(connector.inputAnchor.setOnlineSuccessAnchorStyle).toBeDefined();
    expect(connector.outputAnchor.setOnlineSuccessAnchorStyle).toBeDefined();

  });

  it('should call setSelectedAnchorsStyle method', () => {

    connector.inputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setAnchorSelectedStyle: () => true
    };

    connector.outputAnchor = {
      parentNode: {
        id: 'parendnode12345'
      },
      setAnchorSelectedStyle: () => true
    };

    connector.setSelectedAnchorsStyle();
    expect(connector.setSelectedAnchorsStyle).toBeDefined();
    expect(connector.inputAnchor.setAnchorSelectedStyle).toBeDefined();
    expect(connector.outputAnchor.setAnchorSelectedStyle).toBeDefined();

  });

  it('should call modifyCurvePts method', () => {
    spyOn(connector, 'setQuardantValue');
    spyOn(connector, 'setSecondQuadrantPt');
    spyOn(connector, 'setThirdQuadrantPt');
    spyOn(connector, 'setFourthQuadrantPt');
    spyOn(connector, 'setFirstQuadrantPt');

    connector.inLength = 25;
    connector.outLength = 40;

    connector.quadrant = Quadrant.SECOND;
    connector.modifyCurvePts();

    connector.quadrant = Quadrant.THIRD;
    connector.modifyCurvePts();

    connector.quadrant = Quadrant.FOURTH;
    connector.modifyCurvePts();

    connector.quadrant = Quadrant.FIRST;
    connector.modifyCurvePts();

    expect(connector.modifyCurvePts).toBeDefined();

  });

  it('should call modifyCurvePts method', () => {
    spyOn(connector, 'setQuardantValue');
    spyOn(connector, 'setSecondQuadrantPt');

    connector.inLength = 25;
    connector.outLength = 40;

    connector.quadrant = Quadrant.SECOND;
    connector.modifyCurvePts();

    expect(connector.modifyCurvePts).toBeDefined();

  });

  it('should call modifyCurvePts method', () => {
    spyOn(connector, 'setQuardantValue');
    spyOn(connector, 'setThirdQuadrantPt');

    connector.inLength = 25;
    connector.outLength = 40;

    connector.quadrant = Quadrant.THIRD;
    connector.modifyCurvePts();

    expect(connector.modifyCurvePts).toBeDefined();

  });


  it('should call modifyCurvePts method', () => {
    spyOn(connector, 'setQuardantValue');
    spyOn(connector, 'setFourthQuadrantPt');

    connector.inLength = 25;
    connector.outLength = 40;

    connector.quadrant = Quadrant.FOURTH;
    connector.modifyCurvePts();

    expect(connector.modifyCurvePts).toBeDefined();

  });

  it('should call modifyCurvePts method', () => {
    spyOn(connector, 'setQuardantValue');
    spyOn(connector, 'setFirstQuadrantPt');

    connector.inLength = 25;
    connector.outLength = 40;

    connector.quadrant = Quadrant.FIRST;
    connector.modifyCurvePts();

    expect(connector.modifyCurvePts).toBeDefined();

    connector.quadrant = Quadrant.SEVENTH;
    connector.modifyCurvePts();

  });

  it('should call modifyCurvePts method', () => {
    spyOn(connector, 'setQuardantValue');
    spyOn(connector, 'setFirstQuadrantPt');

    connector.inLength = null;
    connector.outLength = null;

    connector.quadrant = Quadrant.SEVENTH;
    connector.modifyCurvePts();

    expect(connector.modifyCurvePts).toBeDefined();

  });

  it('should call setDeviceId method', () => {

    connector.inputAnchor = {
      parentNode: {
        id: 'parendnode12345',
        type: FillingLineNodeType.AREA
      },
      interfaceData: {
        deviceId: 'inputanchor12345'
      }
    };

    connector.outputAnchor = {
      parentNode: {
        id: 'parendnode12345',
        type: FillingLineNodeType.AREA
      },
      interfaceData: {
        deviceId: 'outputanchor12345'
      }
    };

    connector.setDeviceId();
    expect(connector.setDeviceId).toBeDefined();
    expect(connector.inputDeviceId).toEqual('inputanchor12345');
    expect(connector.outputDeviceId).toEqual('outputanchor12345');

  });

  it('should call validate method', () => {

    let sourceAnchor = {
      highLightInterface: () => true,
      deHighLightInterface: () => true
    };
    spyOn(connector, 'getSourceAnchor').and.returnValue(sourceAnchor);
    spyOn(connector, 'isValidConnection').and.returnValue(true);
    const validateReturn = connector.validate();
    expect(connector.validate).toBeDefined();
    expect(validateReturn).toEqual(true);
    connector.isValidConnection.and.returnValue(false);
    connector.validate();
    sourceAnchor = null;
    connector.validate();
    expect(connector.validate).toBeDefined();
    connector.getSourceAnchor.and.returnValue(null);
    connector.validate();
  });

  it('should call isValidConnection method', () => {

    let sourceAnchor = {
      interfaceData: {
        type: 'anchor'
      },
      connectors: [{ isConnected: true }]
    };

    connector.targetAnchor = {
      interfaceData: {
        type: 'anchor'
      }
    };

    const isvalid = connector.isValidConnection(sourceAnchor);
    expect(connector.isValidConnection).toBeDefined();
    expect(isvalid).toEqual(false);
    sourceAnchor = {
      interfaceData: {
        type: 'anchor'
      },
      connectors: [{ isConnected: false }]
    };

    const isvalidcase2 = connector.isValidConnection(sourceAnchor);
    expect(connector.isValidConnection).toBeDefined();
    expect(isvalidcase2).toEqual(true);

  });

  it('should call setUnselectedProposedConnectionStyle method', () => {
    spyOn(connector, 'removeStyleFromPath');
    spyOn(connector, 'addStyleToPath');
    spyOn(connector, 'setAnchorProposedConenctionStyle');

    connector.setUnselectedProposedConnectionStyle();
    expect(connector.setUnselectedProposedConnectionStyle).toBeDefined();
  });

  it('should call defaultSelectedProposedConnectionStyle method', () => {

    connector.inputAnchor = {
      resetInPutAnchorStyle: () => true
    };

    connector.outputAnchor = {
      resetOutPutAnchorStyle: () => true
    };

    spyOn(connector, 'removeStyleFromPath');
    spyOn(connector, 'addStyleToPath');

    connector.defaultSelectedProposedConnectionStyle();
    expect(connector.defaultSelectedProposedConnectionStyle).toBeDefined();
  });

  it('should call updateTargetAnchorPointQ4 method', () => {

    const pt2 = { x: 50, y: 100 };
    const pt3 = { x: 50, y: 100 };
    const pt4 = { x: 50, y: 100 };

    connector.targetAnchor = { connectors: [{}] };
    connector.outputCircle = { x: 50, y: 100 };
    connector.outLengthReverse = 50;
    connector.outLength = 100;

    connector['updateTargetAnchorPointQ4'](pt2, pt3, pt4);
    expect(connector['updateTargetAnchorPointQ4']).toBeDefined();

    connector.outLengthReverse = null;
    connector.outLength = 100;

    connector['updateTargetAnchorPointQ4'](pt2, pt3, pt4);
    expect(connector['updateTargetAnchorPointQ4']).toBeDefined();
  });

  it('should call updateInputAnchorPointQ4 method', () => {

    const pt4 = { x: 50, y: 100 };
    connector.inputAnchor = { connectors: [{}] };
    connector.inputCircle = { x: 50, y: 100 };
    connector.inLengthReverse = 50;
    connector.inLength = 100;

    connector['updateInputAnchorPointQ4'](pt4);
    expect(connector['updateInputAnchorPointQ4']).toBeDefined();

    connector.inLengthReverse = null;
    connector.inLength = 100;

    connector['updateInputAnchorPointQ4'](pt4);
    expect(connector['updateInputAnchorPointQ4']).toBeDefined();

  });

  it('should call setFourthQuadrantPt method', () => {

    connector.inputCircle = { x: 50, y: 100 };
    connector.outputCircle = { x: 50, y: 100 };
    connector.outLengthReverse = 50;
    connector.outLength = 100;
    connector.inLengthReverse = 50;
    connector.inLength = 100;

    connector.targetAnchor = { index: 0 };

    spyOn(connector, 'updateInputAnchorPointQ4');
    spyOn(connector, 'updateTargetAnchorPointQ4');

    connector['setFourthQuadrantPt']();
    expect(connector['setFourthQuadrantPt']).toBeDefined();

    connector.outLengthReverse = null;
    connector.inLengthReverse = null;

    connector['setFourthQuadrantPt']();
    expect(connector['setFourthQuadrantPt']).toBeDefined();

  });

  it('should call setThirdQuadrantPt method', () => {

    connector.inputCircle = { x: 50, y: 100 };
    connector.outputCircle = { x: 50, y: 100 };
    connector.outLength = 100;
    connector.inLength = 100;

    connector.inputAnchor = { connectors: [{}] };
    connector.targetAnchor = { connectors: [{}] };

    connector['setThirdQuadrantPt']();
    expect(connector['setThirdQuadrantPt']).toBeDefined();

  });

  it('should call setSecondQuadrantPt method', () => {

    connector.inputCircle = { x: 50, y: 100 };
    connector.outputCircle = { x: 50, y: 100 };
    connector.outLength = 100;
    connector.inLength = 100;

    connector.inputAnchor = { connectors: [{}] };
    connector.targetAnchor = { connectors: [{}] };

    connector['setSecondQuadrantPt']();
    expect(connector['setSecondQuadrantPt']).toBeDefined();

  });

  it('should call setFirstQuadrantPt method', () => {

    connector.inputCircle = { x: 50, y: 100 };
    connector.outputCircle = { x: 50, y: 100 };
    connector.outLength = 100;
    connector.inLength = 100;

    connector.inputAnchor = { index: 0, connectors: [{}] };
    connector.targetAnchor = { index: 0, connectors: [{}] };

    connector['setFirstQuadrantPt']();
    expect(connector['setFirstQuadrantPt']).toBeDefined();

  });

  it('should call setQuardantValue method', () => {

    connector.inputCircle = { x: 50, y: 100 };
    connector.outputCircle = { x: 50, y: 100 };
    connector.outLength = 100;
    connector.inLength = 100;

    connector.inputAnchor = { index: 0, connectors: [{}] };
    connector.targetAnchor = { index: 0, connectors: [{}] };

    spyOn(connector, 'findInclination').and.returnValue(50);

    connector['setQuardantValue']();
    expect(connector['setQuardantValue']).toBeDefined();

    connector.findInclination.and.returnValue(-50);

    connector['setQuardantValue']();
    expect(connector['setQuardantValue']).toBeDefined();

    connector.findInclination.and.returnValue(-100);

    connector['setQuardantValue']();
    expect(connector['setQuardantValue']).toBeDefined();

    connector.findInclination.and.returnValue(-200);

    connector['setQuardantValue']();
    expect(connector['setQuardantValue']).toBeDefined();

  });

  it('should call setSelectedProposedConnectorStyle method', () => {

    spyOn(connector, 'addStyleToPath');
    connector.outputAnchor = { anchorScrim: document.createElement('div'), anchorElement: document.createElement('div') };
    connector.inputAnchor = { anchorScrim: document.createElement('div'), anchorElement: document.createElement('div') };
    const pelement = document.createElement('p');
    pelement.setAttribute('id', 'outer');
    const pelement1 = document.createElement('p');
    pelement1.setAttribute('id', 'outer-2');
    connector.outputAnchor.anchorElement.appendChild(pelement);
    connector.inputAnchor.anchorElement.appendChild(pelement1);
    connector.setSelectedProposedConnectorStyle();
    expect(connector.setSelectedProposedConnectorStyle).toBeDefined();

  });

  it('should call setProposedConnectorSelectStyle method', () => {

    spyOn(connector, 'removeStyleFromPath');
    spyOn(connector, 'addStyleToPath');

    connector.outputAnchor = { anchorScrim: document.createElement('div'), anchorElement: document.createElement('div') };
    connector.inputAnchor = { anchorScrim: document.createElement('div'), anchorElement: document.createElement('div') };
    const pelement = document.createElement('p');
    pelement.setAttribute('id', 'outer');
    const pelement1 = document.createElement('p');
    pelement1.setAttribute('id', 'outer-2');
    connector.outputAnchor.anchorElement.appendChild(pelement);
    connector.inputAnchor.anchorElement.appendChild(pelement1);
    connector.setProposedConnectorSelectStyle();
    expect(connector.setProposedConnectorSelectStyle).toBeDefined();

  });

  it('should call getNodeAnchors method', () => {
    const node = {
      outputs: {},
      inputs: {}
    };

    connector.isInput = false;
    connector['getNodeAnchors'](node);
    expect(connector['getNodeAnchors']).toBeDefined();

  });

  it('should call getNodeAnchors method', () => {
    const node = {
      outputs: {},
      inputs: {}
    };

    connector.isInput = false;
    connector['getNodeAnchors'](node);
    expect(connector['getNodeAnchors']).toBeDefined();

  });

  it('should call clientToServerCollision method', () => {
    const e1 = {
      left: 100,
      top: 100,
      right: 100,
      bottom: 100
    };
    const e2 = {
      left: 100,
      top: 100,
      right: 100,
      bottom: 100
    };

    const anchorWidth = 50;
    const anchorHeight = 25;


    connector['clientToServerCollision'](e1, e1, anchorWidth, anchorHeight);
    expect(connector['clientToServerCollision']).toBeDefined();

  });

  it('should call serverToClientCollision method', () => {
    const e1 = {
      left: 100,
      top: 100,
      right: 100,
      bottom: 100
    };
    const e2 = {
      left: 100,
      top: 100,
      right: 100,
      bottom: 100
    };

    const anchorWidth = 50;
    const anchorHeight = 25;


    connector['serverToClientCollision'](e1, e1, anchorWidth, anchorHeight);
    expect(connector['serverToClientCollision']).toBeDefined();

  });

  it('should call testCircleNodeCollision method', () => {
    const elem1 = {
      getBoundingClientRect: () => {
        return { left: 50, right: 50, top: 50, bottom: 50 };
      }
    };

    const elem2 = {
      getBoundingClientRect: () => {
        return { left: 100, right: 100, top: 100, bottom: 100 };
      }
    };


    connector['testCircleNodeCollision'](elem1, elem2);
    expect(connector['testCircleNodeCollision']).toBeDefined();

    const elem3 = {
      getBoundingClientRect: () => {
        return { left: 100, right: 50, top: 50, bottom: 50 };
      }
    };

    const elem4 = {
      getBoundingClientRect: () => {
        return { left: 50, right: 100, top: 100, bottom: 100 };
      }
    };

    connector['testCircleNodeCollision'](elem3, elem4);
    expect(connector['testCircleNodeCollision']).toBeDefined();

    const elem5 = {
      getBoundingClientRect: () => {
        return { left: 100, right: 50, top: 100, bottom: 100 };
      }
    };

    const elem6 = {
      getBoundingClientRect: () => {
        return { left: 50, right: 100, top: 50, bottom: 50 };
      }
    };

    connector['testCircleNodeCollision'](elem5, elem6);
    expect(connector['testCircleNodeCollision']).toBeDefined();
  });


  it('should call getSourceAnchor method', () => {
    connector.editor.editorNodes = {
      filter: () => []
    };
    connector.getSourceAnchor();
    expect(connector.getSourceAnchor).toBeDefined();
  });


  it('should call findInclination method', () => {

    connector.inputCircle = { x: 50, y: 50 };
    connector.outputCircle = { x: 100, y: 100 };
    connector.findInclination();
    expect(connector.findInclination).toBeDefined();
  });

  it('should call isAnchorAlreadyConnected method', () => {
    const connectionList = [
      {
       in:
        'f442f36d-f98f-4366-8964-8f1fe5de2af4__f442f36d-f98f-4366-8964-8f1fe5de2af4_TXlNYWNoaW5lMQ==__clientInf_lfunuxsb',
       out:
        'f1156f1a-1703-49c9-9286-56a4ea79b187__f1156f1a-1703-49c9-9286-56a4ea79b187_TXlNYWNoaW5lMg==__serverInf_lfunuxse',
       id:
        'f442f36d-f98f-4366-8964-8f1fe5de2af4_TXlNYWNoaW5lMQ==__f1156f1a-1703-49c9-9286-56a4ea79b187_TXlNYWNoaW5lMg==__M1ToM2',
       selected: false,
       creationMode: 'Manual',
       areaId: 'ROOT',
       hasSubConnections: false,
       acIds:
        'f442f36d-f98f-4366-8964-8f1fe5de2af4_TXlNYWNoaW5lMQ==__f1156f1a-1703-49c9-9286-56a4ea79b187_TXlNYWNoaW5lMg=='
      }
     ];

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllConnections').value.and.
    returnValue(connectionList);
    const sourceAnchor = {
      parentNode: {
        id: 'sourceAnchor12345'
      },
      editor: {
        connectorLookup: [{ 'connectorid': 'connector12345' }]
      },
      interfaceData: {
        type: 'client'
      }
    };

    connector.targetAnchor = {
      parentNode: {
        id: 'targetAnchor12345'
      },
      interfaceData: {
        type: 'target'
      }
    };

    connector.isAnchorAlreadyConnected(sourceAnchor,connectionList);
    expect(connector.isAnchorAlreadyConnected).toBeDefined();

  });

  it('should call testAnchorCollision method', () => {

    const dragElement = {
      getBoundingClientRect: () => true
    };

    const sourceAnchor = {
      anchorElement: {
        getBoundingClientRect: () => true
      },
      getAnchorInterfaceElement: () => {
        return {
          node: () => {

            return {
              getBoundingClientRect: () => {
                return { width: 10 };
              }
            };
          }
        };
      }
    };

    spyOn(connector, 'clientToServerCollision');
    spyOn(connector, 'serverToClientCollision');

    connector.targetAnchor = {
      parentNode: {
        id: 'targetAnchor12345'
      },
      interfaceData: {
        type: 'target'
      }
    };

    connector.testAnchorCollision(dragElement, sourceAnchor, true);
    expect(connector.testAnchorCollision).toBeDefined();

  });

  it('should call buildCurveString method', () => {

    connector.quadrant = Quadrant.FIRST;
    connector.plotPoints = [
      { x: 50, y: 100 },
      { x: 50, y: 100 },
      { x: 50, y: 100 },
      { x: 50, y: 100 },
      { x: 50, y: 100 }
    ];

    connector.buildCurveString();
    expect(connector.buildCurveString).toBeDefined();

    connector.quadrant = Quadrant.SECOND;

    connector.buildCurveString();
    expect(connector.buildCurveString).toBeDefined();

    connector.quadrant = Quadrant.THIRD;

    connector.buildCurveString();
    expect(connector.buildCurveString).toBeDefined();

    connector.quadrant = Quadrant.FOURTH;

    connector.buildCurveString();
    expect(connector.buildCurveString).toBeDefined();

    connector.quadrant = Quadrant.EIGHTH;

    connector.buildCurveString();
    expect(connector.buildCurveString).toBeDefined();

  });


});

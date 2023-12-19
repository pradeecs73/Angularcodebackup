/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { fillingAreaMockData } from 'mockData/mockFillingLineData';
import { TreeModule } from 'primeng/tree';
import { Subscription, of } from 'rxjs';
import { SubConnector } from '../../../opcua/opcnodes/subConnector';
import { AreaClientInterface, AreaInterface, ClientInterface, ISidePanel } from 'src/app/models/targetmodel.interface';
import { FillingArea, FillingLineState } from 'src/app/store/filling-line/filling-line.reducer';
import {
  ConnectorCreationMode,
  InterfaceCategory,
  SubConnectorCreationMode,
  accessControl,
  interfaceGridViewType
} from '../../../enum/enum';
import { Connection, SubConnection } from '../../../models/connection.interface';
import { BuildInterfaceNode } from '../../../models/payload.interface';
import { NodeAnchor } from '../../../opcua/opcnodes/node-anchor';
import { ROOT_EDITOR } from '../../../utility/constant';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { InterfaceExposedAreaComponent } from './interface-exposed-area.component';

fdescribe('InterfaceExposedAreaComponent', () => {
  let component: InterfaceExposedAreaComponent;
  let fixture: ComponentFixture<InterfaceExposedAreaComponent>;
  let facadeMockService;
  let element = document.createElement('div');
  element.classList.add('d-row');
  element['clientWidth '] = 10;
  const area = [
    {
      name: 'Area1',
      id: '12345',
      x: 10,
      y: 20,
      clientInterfaceIds: [],
      serverInterfaceIds: [],
      nodeIds: [],
      connectionIds: []
    }
  ];
  beforeEach(async () => {
    facadeMockService = new FacadeMockService();
    facadeMockService.zoomOperationsService.subConnectionZoomChangeObs = of({ zoomPercent: 75, zoomChangeValue: true });
    facadeMockService.editorService.scrollTopCanvasValue = of({ left: 10, top: 10 });
    facadeMockService.editorService.devicePropertyPanelViewChange = of(interfaceGridViewType.COLLAPSED);
    facadeMockService.editorService.deviceTreePanelViewChange = of(interfaceGridViewType.EXPANDED);
    facadeMockService.commonService.exportSnapShot$ = of(interfaceGridViewType.EXPANDED);
    facadeMockService.editorService.sidePanelViewChange = of(interfaceGridViewType.EXPANDED);
    facadeMockService.commonService.updateNavigation$ = of(true);
    await TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService },
      ],
      declarations: [InterfaceExposedAreaComponent],
      imports: [TreeModule, TranslateModule.forRoot({})]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceExposedAreaComponent);
    component = fixture.componentInstance;
    spyOn(component, 'updateAnchorConnection');
    spyOn(component, 'subscribeToExposeConnection');
    component.areaSubscription = new Subscription();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('accessControl', () => {
    const spy = spyOnProperty(component, 'accessControl').and.callThrough();
    expect(component.accessControl).toEqual(accessControl);
    expect(spy).toHaveBeenCalled();
  });
  it('headerLabel', () => {
    window.dispatchEvent(new Event('resize'));
    component.headerLabel = InterfaceCategory.CLIENT_INTERFACE;
    component.ngOnInit();
    expect(component.headerKey).toEqual('editor.titles.clientInterface');
  });

  it('ngOnDestroy', () => {
    component.areaSubscription = new Subscription();
    const subscription = spyOn(component.areaSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(subscription).toHaveBeenCalledTimes(1);
  });

  it('ngAfterViewInit', () => {
    component.disableIfUnauthorizedDirective = true;
    component.ngAfterViewInit();
    expect(facadeMockService.areaUtilityService.removeInteractionEvents).toHaveBeenCalled();
  });

  it('subscribeToDevicePropertyPanelChange', () => {
    facadeMockService.editorService.deviceTreePanelViewChange = of(interfaceGridViewType.COLLAPSED);
    component.subscribeToDevicePropertyPanelChange();
    expect(component.isDevicePropertyPanelCollapsed).toEqual(true);
  });

  it('checkAlreadyAdded', () => {
    const interfaces = [{
      automationComponentId: "469bd33c-e7bd-49b4-976d-c092ff339028_Qm90dGxlRmlsbGluZw==",
      connectionEndPointDetails: {},
      deviceId: "469bd33c-e7bd-49b4-976d-c092ff339028",
      id: "clientInf_lfkyi1is",
      interfaceExposedMode: "Manual",
      isClientInterface: true,
      name: "FillingToMixing",
      properties: [],
      subConnectionId: "469bd33c-e7bd-49b4-976d-c092ff339028_Qm90dGxlRmlsbGluZw==__FillToMix_Type__clientInf_lfkyi1is",
      type: "FillToMix_Type"
    }];
    const res = component.checkAlreadyAdded(interfaces);
    expect(res).toBeDefined();
  });

  it('removedInterface', () => {
    component.updatedInterfaceData = ['a', 'b', 'c'] as unknown as AreaInterface[];
    const res = component.removedInterface(['a', 'b']);
    expect(res).toBe(true);
  });

  it('adjustSvgPoints', () => {
    component.nodeAnchors = [{ id: 10 } as unknown as NodeAnchor];
    spyOn(component, 'getSvgPoints').and.returnValue({ x: 10, y: 20 });
  });

  it('addInterfaceToList', () => {
    spyOn(component, 'resetInterfacePanel');
    component.addInterfaceToList([{}] as unknown as Array<AreaClientInterface>);
    expect(component.resetInterfacePanel).toHaveBeenCalled();
    component.addInterfaceToList([] as unknown as Array<AreaClientInterface>);
    expect(component.resetInterfacePanel).toHaveBeenCalled();
  });

  it('getDeviceName', () => {
    spyOn(component, 'getDeviceNameHavingNodeId').and.returnValue('test');
    component.areaData = { nodeIds: ['abc'] } as unknown as FillingArea;
    const res = component.getDeviceName({} as unknown as AreaClientInterface, 'test');
    expect(res).toBe('test');

    spyOn(component, 'getDeviceNameWithOutNodeId').and.returnValue('test');
    component.areaData = { nodeIds: [] } as unknown as FillingArea;
    const res1 = component.getDeviceName({} as unknown as AreaClientInterface, 'test');
    expect(res).toBe('test');
  });

  it('getDeviceNameHavingNodeId', () => {
    component.areaData = { nodeIds: ['abc'] } as unknown as FillingArea;
    component.fillingLineStore = {
      entities: {
        'abc': {
          clientInterfaces: [{
            id: '123'
          }],
          serverInterfaces: [{
            id: '123'
          }],
          name: 'abccdde'
        }
      }
    } as unknown as FillingLineState;
    component.from = InterfaceCategory.CLIENT;
    const res = component.getDeviceNameHavingNodeId({ id: '123' } as unknown as AreaClientInterface);
    expect(res).toEqual('abccdde');

    component.from = InterfaceCategory.SERVER;
    const res1 = component.getDeviceNameHavingNodeId({ id: '123' } as unknown as AreaClientInterface);
    expect(res1).toEqual('abccdde');

  });

  it('getDeviceNameWithOutNodeId', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAreaByParent').value.and.returnValue(area);
    component.areaData = { id: '12345' } as unknown as FillingArea;
    spyOn(component, 'getAreaName').and.returnValue(['interface678910'] as unknown as ISidePanel);
    const res = component.getDeviceNameWithOutNodeId({} as unknown as AreaClientInterface, InterfaceCategory.CLIENT_INTERFACE_ID);
    expect(res).toEqual('Area1');
    const res1 = component.getDeviceNameWithOutNodeId({} as unknown as AreaClientInterface, InterfaceCategory.SERVER_INTERFACE_ID);
    expect(res1).toEqual('Area1');
  });

  it('getAreaName', () => {
    const interfaceID = [{ automationComponentId: 'test', interfaceId: 'test' }] as unknown as ISidePanel[];
    const res = component.getAreaName(interfaceID, { automationComponentId: 'test', id: 'test' } as unknown as AreaClientInterface);
    expect(res).toBeDefined();
  });

  it('buildInterfaceNode', () => {
    spyOn(component, 'updateSubConnectorConnectionEndPointStatus');
    spyOn(component, 'updateAreaWithSubConnection');
    spyOn(component, 'drawSubConnectionToSidePanels');
    spyOn<any>(component, 'getInterfaceIds').and.returnValue(fillingAreaMockData.serverInterfaceIds[0]);
    spyOn<any>(component, 'updateSubConnectionDetails').and.returnValue({ nodeAnchor: { connectors: ['a', 'v'] }, clonedNodeAnchor: { id: 'b' }, subConnector: { id: 'c' } });
    component.from = InterfaceCategory.CLIENT;
    spyOn(component, 'createNodeAnchor');
    const htmlEle = document.querySelector('#anchorID') as unknown as HTMLElement;
    component.buildInterfaceNode({ subConnectionId: 'test', id: 'Washing2ToWashing1' } as unknown as AreaClientInterface,
      htmlEle, 0,
      { id: 'test' } as unknown as SubConnection
    );
    expect(facadeMockService.subConnectorService.connect).toHaveBeenCalled();

    component.buildInterfaceNode({ id: 'Washing2ToWashing1' } as unknown as AreaClientInterface,
      htmlEle, 0,
      { id: 'test' } as unknown as SubConnection
    );
  });

  it('drawSubConnectionToSidePanels', () => {
    spyOn(component, 'updateAreaWithSubConnection');
    const payload = {
      nodeAnchor: {
        connectors: ['a', 'v'],
        updateConnectors: () => { }
      },
      subConnector: {
        connectionId: 'test',
        updateConnectionEndPointStatus: () => { }
      },
      interfaceDetails: {
        interfaceExposedMode: 'Manual'
      },
      interfaceData: {},
      clonedNodeAnchor: {
        global: {
          x: 10,
          y: 20
        }
      },
      subConnection: {
        x: 10,
        y: 20
      },
      index: 20
    };
    component.drawSubConnectionToSidePanels(payload as unknown as BuildInterfaceNode);
    expect(facadeMockService.applicationStateService.updateConnectorStatus).toHaveBeenCalled();
  });

  it('getSubConnection', () => {
    component.getSubConnection({ deviceId: 'test', automationComponentId: 'test', name: 'test' } as unknown as AreaClientInterface);
    expect(facadeMockService.dataService.getSubConnectionByData).toHaveBeenCalled();
  });
  it('updateNodeAnchorList', () => {
    const nodeAnchor = {
      anchorElement: {
        id: 'test'
      }
    } as unknown as NodeAnchor;
    component.nodeAnchors = [];
    component.updateNodeAnchorList(nodeAnchor);
    expect(component.nodeAnchors.length).toEqual(1);
  });

  it('nodeAnchor length is greater than 0', () => {
    const nodeAnchor = {
      anchorElement: {
        id: 'test'
      }
    } as unknown as NodeAnchor;
    component.nodeAnchors = [nodeAnchor];
    component.updateNodeAnchorList(nodeAnchor);
    expect(component.nodeAnchors.length).toEqual(1);
  });

  it('nodeAnchor length is greater than 0', () => {
    const nodeAnchor = {
      anchorElement: {
        id: 'test'
      }
    } as unknown as NodeAnchor;
    component.nodeAnchors = [{
      anchorElement: {
        id: 'test123'
      }
    } as unknown as NodeAnchor];
    component.updateNodeAnchorList(nodeAnchor);
    expect(component.nodeAnchors.length).toEqual(2);
  });

  it('updateSubConnectorConnectionEndPointStatus', () => {
    component.updateSubConnectorConnectionEndPointStatus({ id: '123', updateConnectionEndPointStatus: () => { } } as unknown as SubConnector,
      { id: '123' } as unknown as NodeAnchor, { id: '123' } as unknown as Connection);
    expect(facadeMockService.dataService.getConnectionEndPointData).toHaveBeenCalled();
  });

  it('updateCreationMode', () => {
    component.updateCreationMode({ creationMode: '' } as unknown as SubConnector, SubConnectorCreationMode.MANUAL,
      { creationMode: ConnectorCreationMode.ONLINE } as unknown as Connection);

    component.updateCreationMode({ creationMode: '' } as unknown as SubConnector, SubConnectorCreationMode.MANUAL,
      { creationMode: ConnectorCreationMode.MANUAL } as unknown as Connection);

    component.updateCreationMode({ connectionId: 'test' } as unknown as SubConnector, SubConnectorCreationMode.ONLINE, undefined);
  });

  it('updateAnchorConnection', () => {
    const interfaceGridType = interfaceGridViewType.COLLAPSED;
    component.updateAnchorConnection(interfaceGridType, 10);
  });

  it('adjustServerSubConnection', () => {
    const res = component.adjustServerSubConnection(10, 10);
    expect(res).toBeDefined();
  });

  it('getSvgPoints', () => {
    component.viewType = interfaceGridViewType.COLLAPSED;
    const nodeAnchor = {
      connectors: [{ svgGlobal: { x: 10, y: 10 } }],
      global: { x: 10, y: 10 }
    } as unknown as NodeAnchor;
    const res = component.getSvgPoints(nodeAnchor, {} as unknown as SubConnection, 0);
    const res1 = component.getSvgPoints({ connectors: null, global: { x: 10, y: 10 } } as unknown as NodeAnchor, {} as unknown as SubConnection, 0);
    component.viewType = interfaceGridViewType.EXPANDED;
    const res2 = component.getSvgPoints({ connectors: null, global: { x: 10, y: 10 } } as unknown as NodeAnchor, {} as unknown as SubConnection, 0);
    expect(res).toBeDefined();
  });

  it('getSvgPointsForSidePanelCollapsed for client ', () => {
    const nodeAnchor = {
      global: {
        x: 10,
        y: 10
      }
    } as unknown as NodeAnchor;
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(fillingAreaMockData);
    component.from = InterfaceCategory.CLIENT;
    const res = component.getSvgPointsForSidePanelCollapsed(nodeAnchor, 10);
    expect(res).toBeDefined();
  });

  it('getSvgPointsForSidePanelCollapsed for server', () => {
    const nodeAnchor = {
      global: {
        x: 10,
        y: 10
      }
    } as unknown as NodeAnchor;
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(fillingAreaMockData);
    component.from = InterfaceCategory.SERVER;
    const res = component.getSvgPointsForSidePanelCollapsed(nodeAnchor, 10);
    expect(res).toBeDefined();
  });

  it('generateDeviceName', () => {
    const res = component.generateDeviceName({}, InterfaceCategory.CLIENT);
    expect(res).toBeDefined();

    const res1 = component.generateDeviceName({}, InterfaceCategory.SERVER);
    expect(res1).toBeDefined();
  });

  it('updateInterfaceIds', () => {
    const res = component['updateInterfaceIds'](fillingAreaMockData, fillingAreaMockData.clientInterfaceIds
      , InterfaceCategory.CLIENT);
    expect(res).toBeDefined();
    const res1 = component['updateInterfaceIds'](fillingAreaMockData, fillingAreaMockData.clientInterfaceIds
      , InterfaceCategory.SERVER);
    expect(res1).toBeDefined();
  });

  it('getInterfaceIds for client ', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(fillingAreaMockData);
    component.from = InterfaceCategory.CLIENT;
    const res = component['getInterfaceIds']({ id: 'test' } as unknown as ClientInterface);

  });

  it('getInterfaceIds for server ', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(fillingAreaMockData);
    component.from = InterfaceCategory.SERVER;
    const res = component['getInterfaceIds']({ id: 'serverInf_l6eoprq6' } as unknown as ClientInterface);
  });

  it('buildSVGForSidePanel', () => {
    component['buildSVGForSidePanel'](InterfaceCategory.SERVER, {});
  });

  it('updateNodeAnchor', () => {
    const subConnector = { inputAnchor: { anchorElement: '', anchorScrim: '', update: () => { } }, outputAnchor: { anchorElement: '', anchorScrim: '', update: () => { } } };
    const nodeAnchor = { update: () => { } };
    const clonedNode = { anchorElement: 'test', anchorScrim: 'test' };
    const res = component['updateNodeAnchor'](InterfaceCategory.CLIENT, subConnector, nodeAnchor, clonedNode);
    expect(res).toBeDefined();

    const res1 = component['updateNodeAnchor'](InterfaceCategory.SERVER, subConnector, nodeAnchor, clonedNode);
    expect(res1).toBeDefined();
  });

  it('setDefaultGridStyle', () => {
    const res = component['setDefaultGridStyle']({ connectors: [{ state: '', isConnected: true }] });
    expect(res).toBeDefined();
  });

  it('updateSubConnectionDetails', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue({ id: ROOT_EDITOR });
    Object.getOwnPropertyDescriptor(facadeMockService.subConnectorService, 'createSubConnector').value.and.returnValue({ connectionId: ROOT_EDITOR });
    const res = component.updateSubConnectionDetails(undefined, {} as unknown as NodeAnchor, { connectionId: 'test' } as unknown as SubConnection, {} as unknown as ISidePanel);
    expect(res).toBeDefined();
  });



});

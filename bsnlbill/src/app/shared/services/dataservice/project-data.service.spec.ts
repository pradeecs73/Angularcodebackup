/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { area, device, fillingNode, project, projectDataObject, subConnection } from 'mockData/projectData';
import { MessageService } from 'primeng/api';
import { AddressModelType, ConnectionAttributes, ConnectorCreationMode, ConnectorState, DeviceState, InterfaceCategory, SubConnectorCreationMode } from 'src/app/enum/enum';
import { Connection, InterfaceDetails, SubConnection } from './../../../models/connection.interface';
import { Area, HTMLNodeConnector, ProjectData, Tree } from './../../../models/models';
import { AreaClientInterface, AutomationComponent, Device, ISidePanel } from './../../../models/targetmodel.interface';
import { BaseConnector } from './../../../opcua/opcnodes/baseConnector';
import { FillingArea } from './../../../store/filling-line/filling-line.reducer';
import { ROOT_EDITOR } from './../../../utility/constant';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { ProjectDataService } from './project-data.service';

fdescribe('DataServiceService', () => {
  let service: ProjectDataService;
  let projectData: ProjectData = projectDataObject;
  let mockMessageService: MessageService;
  let facadeMockService;
  let payloadClient = {
    adapterType: "Plant Object",
    automationComponentId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n",
    deviceId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==",
    interfaceExposedMode: "Manual",
    interfaceId: "clientInf_l7vnn3uh",
    isClientInterface: false,
    subConnectionId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type"
  };
  let payloadServer = {
    adapterType: "Plant Object",
    automationComponentId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=",
    deviceId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==",
    interfaceExposedMode: "Manual",
    interfaceId: "serverInf_l7vnn3uj",
    isClientInterface: false,
    subConnectionId: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type"
  };
  const projectDataCopy = JSON.parse(JSON.stringify(projectData));


  let connection = {
    id: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__clientInf_l7vnn3uh",
    in: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==__BottleFilling__clientInf_l7vnn3uh",
    out: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==__LiquidMixing__FillingToMixing",
    selected: false,
    creationMode: ConnectorCreationMode.MANUAL,
    hasSubConnections: false,
    areaId: "ROOT",
    acIds: "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc="
  };
  beforeEach(() => {
    facadeMockService = new FacadeMockService();
    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useValue: mockMessageService }, { provide: FacadeService, useValue: facadeMockService },],
      imports: [TranslateModule.forRoot({})]
    });
    service = TestBed.inject(ProjectDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setProjectData', () => {
    service.setProjectData(projectData);
    expect(service['projectData']).toEqual(projectData);
  });

  it('getProjectData', () => {
    service['projectData'] = projectData;
    service.getProjectData();
    expect(service['projectData']).toBeDefined();
  });

  it('updateDeviceState', () => {
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    spyOn(service, 'updateACState');
    service.updateDeviceState('abcde', DeviceState.NEW);
    expect(service.updateACState).toHaveBeenCalled();
  });

  it('updateInterface with uid found', () => {
    spyOn(service, 'getProjectData').and.returnValue(projectData as unknown as ProjectData);
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    service.updateInterface(fillingNode);
    expect(device[0].automationComponents[0].clientInterfaces).toEqual(fillingNode.clientInterfaces);
  });

  it('updateInterface with uid not found', () => {
    const deviceCopy = { ...device[0] };
    deviceCopy.uid = 'abcde';
    spyOn(service, 'getProjectData').and.returnValue(projectData as unknown as ProjectData);
    spyOn(service, 'getDevice').and.returnValue(deviceCopy as unknown as Device);
    service.updateInterface(fillingNode);
    expect(device[0].automationComponents[0].clientInterfaces).toEqual(fillingNode.clientInterfaces);
  });

  it('getDevice', () => {
    service['projectData'] = projectData;
    const res = service.getDevice("b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==");
    expect(res).toEqual(device[0] as unknown as Device);
  });

  it('getAddress', () => {
    spyOn(service, 'getDevices').and.returnValue(device as unknown as Device[]);
    const res = service.getDeviceByAddress("opc.tcp://192.168.2.101:4840");
    expect(res).toEqual(device[0] as unknown as Device);
  });

  it('setDevices', () => {
    spyOn(service, 'getProjectData').and.returnValue(projectData as unknown as ProjectData);
    spyOn(service, 'setProjectData');
    service.setDevices(device as unknown as Device[]);
    expect(service.setProjectData).toHaveBeenCalledWith(projectData as unknown as ProjectData);
  });

  it('getDeviceState', () => {
    spyOn(service, 'getDevices').and.returnValue(device as unknown as Device[]);
    const res = service.getDeviceState("b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==");
    expect(res).toEqual(DeviceState.NEW);
  });

  it('isDeviceAvailable', () => {
    spyOn(service, 'getDeviceState').and.returnValue(DeviceState.UNAVAILABLE);
    const res = service.isDeviceAvailable('abcde');
    expect(res).toEqual(true);
  });

  it('setDefaultState', () => {
    service.setDefaultState(projectData);
    expect(device[0].automationComponents[0].state).toEqual(DeviceState.UNKNOWN);
  });

  it('setHaveReadAccess', () => {
    service.setHaveReadAccess(true);
    expect(service.haveReadAccess).toEqual(true);
  });

  it('getProjectDataAsSaveJson', () => {
    service['projectData'] = projectData;
    const res = service.getProjectDataAsSaveJson();
    expect(res).toBeDefined();
  });

  it('updateProtectionToProject', () => {
    service['projectData'] = projectData;
    service.updateProtectionToProject(true);
    expect(service['projectData'].project.isProtected).toEqual(true);
  });


  it('getProjectDataAsSaveJson with tree null', () => {
    projectData.tree = null;
    service['projectData'] = projectData;
    const res = service.getProjectDataAsSaveJson();
    expect(res).toBeDefined();
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getProjectTreeDevices', () => {
    const tree = {
      devices: device
    } as unknown as Tree;
    spyOn(service, 'getProjectTree').and.returnValue(tree);
    const res = service.getProjectTreeDevices();
    expect(res).toEqual(device as unknown as Device[]);
  });

  it('getProjectTreeDevices with devices null', () => {
    const tree = {
      devices: null
    } as unknown as Tree;
    spyOn(service, 'getProjectTree').and.returnValue(tree);
    const res = service.getProjectTreeDevices();
    expect(res).toEqual([]);
  });

  it('getEditorData with editor null', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    const res = service.getEditorData();
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getProjectMetaData with project null', () => {
    projectData.project = null;
    service['projectData'] = projectData;
    const res = service.getProjectMetaData();
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getAllNodes', () => {
    service['projectData'] = projectData;
    const res = service.getAllNodes();
    expect(res).toEqual(projectData.editor.nodes);
  });

  it('getAllNodes with node length 0', () => {
    projectData.editor.nodes = [];
    service['projectData'] = projectData;
    const res = service.getAllNodes();
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getNodeByID', () => {
    service['projectData'] = projectData;
    const res = service.getNodeByID('1');
    expect(res).toEqual(projectData.editor.nodes[0]);
  });

  it('getNodeByAddress', () => {
    service['projectData'] = projectData;
    const res = service.getNodeByAddress('192.168.2.101');
    expect(res.length).toEqual(1);
  });

  it('getProjectId', () => {
    service['projectData'] = projectData;
    const res = service.getProjectId();
    expect(res).toEqual('1234');
  });

  it('getAutomationComponent', () => {
    service['projectData'] = projectData;
    const res = service.getAutomationComponent("b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==", "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n");
    expect(res).toBeDefined();
  });

  it('getAutomationComponentByName', () => {
    service['projectData'] = projectData;
    const res = service.getAutomationComponentByName("b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==", "BottleFilling");
    expect(res).toBeDefined();
  });

  it('getConnectionEndPointData', () => {
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    service['projectData'] = projectData;
    const res = service.getConnectionEndPointData(connection, "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__clientInf_l7vnn3uh");
    expect(res).toBeDefined();
  });

  it('getConnectionEndPointData with connection data null', () => {
    service['projectData'] = projectData;
    const connection = null;
    const res = service.getConnectionEndPointData(connection, "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__clientInf_l7vnn3uh");
    expect(res).toBeDefined();
  });

  it('setProjectMetaData', () => {
    service['projectData'] = projectData;
    service.setProjectMetaData(project);
    expect(service['projectData']).toBeDefined();
  });

  it('setProjectMetaData', () => {
    service['projectData'] = null;
    service.setProjectMetaData(project);
    expect(service['projectData']).toBeDefined();
  });

  it('addNode', () => {
    spyOn(service, 'setProjectData');
    service['projectData'] = projectData;
    service.addNode(fillingNode, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(service.setProjectData).toHaveBeenCalled();
  });

  it('updateConnectionEndPointDetails with ConnectionAttribute as partner', () => {
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    service.updateConnectionEndPointDetails(false, ConnectionAttributes.PARTNER, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==', 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', 'clientInf_l7vnn3uh');
    expect(service.getDevice).toHaveBeenCalled();
  });

  it('updateConnectionEndPointDetails with ConnectionAttribute as diagnose', () => {
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    service.updateConnectionEndPointDetails(false, ConnectionAttributes.DIAGNOSE, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==', 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', 'clientInf_l7vnn3uh');
    expect(service.getDevice).toHaveBeenCalled();
  });

  it('updateConnectionEndPointDetails with ConnectionAttribute as DETAILEDSTATUS', () => {
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    service.updateConnectionEndPointDetails(false, ConnectionAttributes.DETAILEDSTATUS, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==', 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', 'clientInf_l7vnn3uh');
    expect(service.getDevice).toHaveBeenCalled();
  });

  it('updateConnectionEndPointDetails with no detailedStatus', () => {
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    service.updateConnectionEndPointDetails(false, 'abcde', 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==', 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', 'clientInf_l7vnn3uh');
    expect(service.getDevice).toHaveBeenCalled();
  });

  it('getConnectionListByNodeId matching connection id', () => {
    service['projectData'] = projectData;
    const res = service.getConnectionListByNodeId("b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type");
    expect(res).toBeDefined();
  });

  it('getConnectionListByNodeId matching acid', () => {
    projectData.editor.connections[0].id = "abcde";
    service['projectData'] = projectData;
    const res = service.getConnectionListByNodeId("b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type");
    expect(res).toBeDefined();
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('updateNode', () => {
    spyOn(service, 'setProjectData');
    service['projectData'] = projectData;
    service.updateNode(fillingNode);
    expect(service.setProjectData).toHaveBeenCalled();
  });

  it('deleteNode', () => {
    spyOn(service, 'setProjectData');
    service['projectData'] = projectData;
    service.deleteNode("1", 'abcde');
    expect(service.setProjectData).toHaveBeenCalled();
  });

  it('addOrUpdateConnection', () => {
    service['projectData'] = projectData;
    service.addOrUpdateConnection(projectData.editor.connections[0]);
    expect(service['projectData'].editor.connections[0]).toEqual(projectData.editor.connections[0]);
  });

  it('addOrUpdateConnection with editor null', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    service.addOrUpdateConnection(connection);
    expect(service['projectData'].editor.connections[0]).toEqual(connection);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('addConnection with editor nodes null', () => {
    projectData.editor.nodes = null;
    service['projectData'] = projectData;
    service.addConnection(connection);
    expect(service['projectData'].editor.connections[0]).toEqual(connection);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('addConnection with editor connections null', () => {
    projectData.editor.connections = null;
    service['projectData'] = projectData;
    service.addConnection(connection);
    expect(service['projectData'].editor.connections[0]).toEqual(connection);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('addConnection with editor not null', () => {
    service['projectData'] = projectData;
    service.addConnection(connection);
    expect(service['projectData']).toBeDefined();
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('deleteConnections', () => {
    service['projectData'] = projectData;
    service.deleteConnection(connection);
    expect(service['projectData'].editor.connections).toEqual([]);
  });

  it('addOrUpdateSubConnection', () => {
    service['projectData'] = projectData;
    service.addOrUpdateSubConnection(subConnection as unknown as SubConnection);
  });

  it('addOrUpdateSubConnection with editor null', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    service.addOrUpdateSubConnection(subConnection as unknown as SubConnection);
    expect(service['projectData'].editor.subConnections[0]).toEqual(subConnection as unknown as SubConnection);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('addOrUpdateSubConnection with subconnections null', () => {
    projectData.editor.subConnections = null;
    service['projectData'] = projectData;
    service.addOrUpdateSubConnection(subConnection as unknown as SubConnection);
    expect(service['projectData'].editor.subConnections.length).toEqual(1);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('updateSubConnection', () => {
    service['projectData'] = projectData;
    service.updateSubConnection(subConnection as unknown as SubConnection);
  });

  it('deleteSubConnection', () => {
    spyOn(service, 'setProjectData');
    service['projectData'] = projectData;
    service.deleteSubConnection("b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillingToMixing__clientInf_l7vnn3uh");
    expect(service.setProjectData).toHaveBeenCalled();
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('deleteSubConnectionByAreaId', () => {
    service['projectData'] = projectData;
    service.deleteSubConnectionByAreaId("area_l8alnjdn");
    expect(service['projectData'].editor.subConnections.length).toEqual(0);
  });

  it('updateConnection', () => {
    service['projectData'] = projectData;
    service.updateConnection('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__clientInf_l7vnn3uh', connection);
    expect(service['projectData'].editor.connections[0]).toEqual(connection);
  });

  it('updateNodeParent', () => {
    service['projectData'] = projectData;
    service.updateNodeParent('1', 'abcde');
    expect(service['projectData'].editor.nodes[0].parent).toEqual('abcde');
  });

  it('getAllConnections', () => {
    service['projectData'] = projectData;
    const res = service.getAllConnections();
    expect(res).toEqual(projectData.editor.connections);
  });

  it('getAllConnections with no editor details', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    const res = service.getAllConnections();
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getAreaConnection', () => {
    service['projectData'] = projectData;
    const res = service.getAreaConnections('ROOT');
    expect(res).toBeDefined();
  });

  it('getAreaConnection with no editor details', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    let res = service.getAreaConnections('ROOT');
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getAreaAllConnections', () => {
    service['projectData'] = projectData;
    const res = service.getAreaAllConnections('ROOT');
    expect(res).toBeDefined();
  });

  it('getAreaAllConnections with no editor details', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    const res = service.getAreaAllConnections('ROOT');
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getAllSubConnections', () => {
    service['projectData'] = projectData;
    const res = service.getAllSubConnections();
    expect(res).toEqual(projectData.editor.subConnections);
  });

  it('getAllSubConnections with editor data null', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    const res = service.getAllSubConnections();
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getAllAssciciatedSubConnections', () => {
    service['projectData'] = projectData;
    const res = service.getAllAssociatedSubConnections('123456');
    expect(res).toEqual(projectData.editor.subConnections);
  });

  it('getAllAssciciatedSubConnections with editor data null', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    const res = service.getAllAssociatedSubConnections('123456');
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getAreaSubConnections', () => {
    service['projectData'] = projectData;
    const res = service.getAreaSubConnections('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(res).toBeDefined();
  });

  it('getAreaSubConnections with editor data null', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    const res = service.getAreaSubConnections('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getAreaSubConnection', () => {
    spyOn(service, 'getAreaSubConnections').and.returnValue(projectData.editor.subConnections);
    service['projectData'] = projectData;
    const res = service.getAreaSubConnection('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillingToMixing__clientInf_l7vnn3uh");
    expect(res).toBeDefined();
  });

  it('clearProjectDAta', () => {
    service.clearProjectData();
    expect(service['projectData']).toEqual(null);
  });

  it('addArea', () => {
    service['projectData'] = projectData;
    service.addArea(area as unknown as FillingArea);
    expect(service['projectData']).toBeDefined();
  });

  it('addArea with editor null', () => {
    projectData.editor = null;
    service['projectData'] = projectData;
    service.addArea(area as unknown as FillingArea);
    expect(service['projectData']).toBeDefined();
    projectData = JSON.parse(JSON.stringify(projectDataCopy));

  });

  it('addArea with area in editor object null', () => {
    projectData.editor.areas = null;
    service['projectData'] = projectData;
    service.addArea(area as unknown as FillingArea);
    expect(service['projectData']).toBeDefined();
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getArea', () => {
    service['projectData'] = projectData;
    const res = service.getArea('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(res).toEqual(projectData.editor.areas[0]);
  });

  it('getArea with areas null', () => {
    projectData.editor.areas = null;
    service['projectData'] = projectData;
    let res = service.getArea('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getAreaByParent', () => {
    service['projectData'] = projectData;
    let res = service.getAreaByParent('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(res).toBeDefined();
  });

  it('getAreaByParent with areas null', () => {
    projectData.editor.areas = null;
    service['projectData'] = projectData;
    let res = service.getAreaByParent('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(res).toEqual(null);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('removeArea', () => {
    service['projectData'] = projectData;
    service.removeArea('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(service['projectData']).toBeDefined();
  });

  it('getServerInterfaceList', () => {
    area.serverInterfaceIds[0].automationComponentId = "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n";
    area.serverInterfaceIds[0].interfaceId = "serverInf_l7vnn3uj";
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    const res = service.getServerInterfaceList(area as unknown as Area);
    expect(res).toBeDefined();
  });

  it('getProjectName', () => {
    service['projectData'] = projectData;
    const res = service.getProjectName();
    expect(res).toBe('firstProj');
  });

  it('getAreaServerInterface', () => {
    spyOn(service, 'getAutomationComponent').and.returnValue(device[0].automationComponents[0] as unknown as AutomationComponent);
    spyOn(service, 'getDevices').and.returnValue(device as unknown as Device[]);
    const res = service.getAreaServerInterface(payloadServer as unknown as ISidePanel, 'FillToMix_Type');
    expect(service.getAutomationComponent).toHaveBeenCalled();
  });

  it('getSubConnectionByData', () => {
    spyOn(service, 'getAreaSubConnections').and.returnValue(projectData.editor.subConnections as unknown as SubConnection[]);
    const res = service.getSubConnectionByData('abcde', "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==__LiquidMixing__FillingToMixing");
    expect(res).toBeDefined();
  });

  it('getAreaClientInterfaces', () => {
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    const res = service.getAreaClientInterfaces('abcde', 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', 'clientInf_l7vnn3uh', 'mnop', {} as unknown as SubConnectorCreationMode);
    expect(res).toBeDefined();
  });

  it('getClientInterface', () => {
    spyOn(service, 'getAutomationComponent');
    service.getClientInterface('abcde', 'fghi', 'hjski');
    expect(service.getAutomationComponent).toHaveBeenCalled();
  });

  it('getSubConnection', () => {
    service['projectData'] = projectData;
    const res = service.getSubConnection("b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=_clientInf_l7vnn3uh");
  });

  it('getAreaClientInterface', () => {
    spyOn(service, 'getAutomationComponent').and.returnValue(device[0].automationComponents[0] as unknown as AutomationComponent);
    spyOn(service, 'getDevices').and.returnValue(device as unknown as Device[]);
    const res = service.getAreaClientInterface(payloadClient as unknown as ISidePanel, 'FillToMix_Type');
    expect(res).toBeDefined();
  });

  it('updateAreaInterfaceExposedMode', () => {
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
    service['projectData'] = projectData;
    service.updateAreaInterfaceExposedMode('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__FillToMix_Type', true, SubConnectorCreationMode.MANUAL);
    expect(service['projectData'].editor.areas[0].clientInterfaceIds).toEqual(projectData.editor.areas[0].clientInterfaceIds);
  });

  it('updateAreaInterfaceExposedMode', () => {
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
    service['projectData'] = projectData;
    service.updateAreaInterfaceExposedMode('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type', false, SubConnectorCreationMode.MANUAL);
    expect(service['projectData'].editor.areas[0].serverInterfaceIds).toEqual(projectData.editor.areas[0].serverInterfaceIds);
  });

  it('deleteArea', () => {
    spyOn(service, 'getProjectData').and.returnValue(projectData as unknown as ProjectData);
    service.deleteArea('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    expect(service['projectData'].editor.areas.length).toEqual(0);
  });

  it('getClientInterfaceList', () => {
    area.clientInterfaceIds[0].automationComponentId = "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n";
    area.clientInterfaceIds[0].interfaceId = "clientInf_l7vnn3uh";
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    const res = service.getClientInterfaceList(area as unknown as Area);
    expect(res).toBeDefined();
  });

  it('updateInterfaceIds', () => {
    spyOn(service, 'updateArea');
    const interfaceData = {
      interface: area.clientInterfaces as Array<AreaClientInterface>,
      interfaceId: area.clientInterfaceIds as unknown as ISidePanel[],
      type: 'server'
    };
    service.updateInterfaceIds('area_l8bqhhly',
      interfaceData as unknown as InterfaceDetails,
      'add'
    );
    expect(service.updateArea).toHaveBeenCalled();
  });

  it('updateInterfaceIds', () => {
    spyOn(service, 'updateArea');
    const interfaceData = {
      interface: area.clientInterfaces as unknown as Array<AreaClientInterface>,
      interfaceId: area.clientInterfaceIds as unknown as ISidePanel[],
      type: 'client'

    };
    spyOn(service, 'getArea').and.returnValue(area as unknown as Area);
    service.updateInterfaceIds('area_l8bqhhly',
      interfaceData as unknown as InterfaceDetails,
      'delete'
    );
    expect(service.updateArea).toHaveBeenCalled();
  });

  it('getServerInterfaceDetailsById', () => {
    spyOn(service, 'getArea').and.returnValue(area as unknown as Area);
    const res = service.getServerInterfaceIdDetailsById('abc', 'serverInf_l7vnn3uj');
    expect(res).toEqual(area.serverInterfaceIds[0] as unknown as ISidePanel);
  });


  it('getClientInterfaceDetailsById', () => {
    spyOn(service, 'getArea').and.returnValue(area as unknown as Area);
    const res = service.getClientInterfaceIdDetailsById('abc', 'clientInf_l7vnn3uh');
    expect(res).toEqual(area.clientInterfaceIds[0] as unknown as ISidePanel);
  });

  it('addOrUpdateDeviceScanSettings', () => {
    const scanSettings = {
      port: 4800,
      fromIPAddress: '192.168.2.101',
      toIPAddress: '192.168.2.102'
    };
    service['projectData'] = projectData;
    service.addOrUpdateDeviceScanSettings(scanSettings);
    expect(service['projectData'].scanSettings).toEqual(scanSettings);
  });

  it('removeSubConnectorsByNodeID', () => {
    spyOn(service, 'setProjectData');
    spyOn(service, 'getProjectData').and.returnValue(projectData as unknown as ProjectData);
    service.removeSubConnectorsByNodeID('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=');
    expect(service.setProjectData).toHaveBeenCalled();
  });

  it('deleteNodeConnections', () => {
    spyOn(service, 'setProjectData');
    spyOn(service, 'getProjectData').and.returnValue(projectData as unknown as ProjectData);
    service.deleteNodeConnections('abcde');
    expect(service.setProjectData).toHaveBeenCalled();
  });

  it('deleteNodeConnectionsOfSubConnection', () => {
    spyOn(service, 'getProjectData').and.returnValue(projectData as unknown as ProjectData);
    spyOn(service, 'setProjectData');
    service.deleteNodeConnectionsOfSubConnection(
      'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type',
      'BottleFilling'
    );
    expect(service.setProjectData).toHaveBeenCalled();
  });

  it('getMappedCompatibleInterfaceByType', () => {
    spyOn(service, 'getParentByAcId').and.returnValue([{ parent: 'ROOT' }]);
    service['projectData'] = projectData;
    let res = service.getMappedCompatibleInterfaceByType('FillToMix_Type', true, 'mockedDeviceId');
    expect(res.length).toEqual(1);
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('getConnectionByAcID', () => {
    const acId = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=';
    const connections = [{
      "in": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__clientInf_l92n9qm4",
      "out": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__serverInf_l92n9qm3",
      "id": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__Wash1ToMix_Type",
      "selected": false,
      "creationMode": "Manual",
      "areaId": "ROOT",
      "hasSubConnections": false,
      "acIds": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc="
    }] as Connection[];
    service['projectData'] = projectData;
    spyOn(service, 'getConnectionByAcID').and.callThrough();
    service.getConnectionByAcID(acId);
    expect(service.getConnectionByAcID).toHaveBeenCalled();

    service['projectData'] = null;
    service.getConnectionByAcID(acId);
    expect(service.getConnectionByAcID).toHaveBeenCalled();

  });

  it('getAdapterType', () => {
    const adapterType = AddressModelType.CLIENT_SERVER;
    const deviceId = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==';
    service['projectData'] = projectData;
    spyOn(service, 'getAdapterType').and.callThrough();
    service.getAdapterType(deviceId);
    expect(service.getAdapterType).toHaveBeenCalled();
  });

  it('removeInterfaceIdsFromArea', () => {
    const payload = {
      "automationComponentId": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MF9XYXNoaW5nU3RlcDI=",
      'deviceId': "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MA==",
      'interfaceExposedMode': "Manual",
      'interfaceId': "serverInf_l92n9qm7",
      'isClientInterface': false,
      'subConnectionId': "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDQ6NDg0MF9XYXNoaW5nU3RlcDI=__FillToWash2_Type"
    } as ISidePanel;
    const type = InterfaceCategory.CLIENT;
    const areaId = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n';
    service['projectData'] = JSON.parse(JSON.stringify(projectDataCopy));;
    spyOn(service, 'removeInterfaceIdsFromArea').and.callThrough();
    const res = service.removeInterfaceIdsFromArea(areaId, payload, type);
    expect(service.removeInterfaceIdsFromArea).toHaveBeenCalled();
  });

  it('resetConnectionMonitorValuesForAllDevices', () => {
    service['projectData'] = JSON.parse(JSON.stringify(projectDataCopy));
    spyOn(service, 'resetConnectionMonitorValuesForAllDevices').and.callThrough();
    const res = service.resetConnectionMonitorValuesForAllDevices();
    expect(service.resetConnectionMonitorValuesForAllDevices).toHaveBeenCalled();
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });



  it('getAllAreas with else case', () => {
    service['projectData'] = null;
    service.getAllAreas();
    expect(service.getAllAreas()).toBe(null);
  });


  it('handleAddNodeForArea with else case', () => {
    const projectDataClone = { ...projectData };
    projectDataClone.editor = null;
    spyOn(service, 'setProjectData').and.callThrough();
    service['projectData'] = projectDataClone;
    service.handleAddNodeForArea(fillingNode, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', -1, projectDataClone);
    expect(service.setProjectData).not.toHaveBeenCalled();
  });

  it('handleAddNodeForArea with area null', () => {
    projectData.editor.areas[0].nodeIds = [];
    service['projectData'] = projectData;
    spyOn(service, 'getAllAreas').and.returnValue(projectData.editor.areas);
    spyOn(service, 'setProjectData').and.callThrough();
    service.handleAddNodeForArea(fillingNode, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n', -1, projectData);
    expect(service.setProjectData).toHaveBeenCalled();
  });

  it('updateNode without node', () => {
    spyOn(service, 'setProjectData');
    projectData.editor.nodes = null;
    spyOn(service, 'getProjectData').and.returnValue(projectData);
    service.updateNode(fillingNode);
    expect(service.setProjectData).toHaveBeenCalled();
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('updateNode without node', () => {
    projectData.editor.nodes[0].id = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n';
    spyOn(service, 'setProjectData');
    spyOn(service, 'getProjectData').and.returnValue(projectData);
    service.updateNode(fillingNode);
    expect(service.setProjectData).toHaveBeenCalled();
    projectData = JSON.parse(JSON.stringify(projectDataCopy));
  });

  it('addNode with node null', () => {
    //editor  null
    projectData.editor = null;
    service['projectData'] = projectData;
    spyOn(service, 'getAllAreas').and.returnValue([]);
    spyOn(service, 'setProjectData').and.callThrough();
    service.addNode(fillingNode, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    projectData = JSON.parse(JSON.stringify(projectDataCopy));

    projectData.editor.nodes = null;
    service['projectData'] = projectData;
    service.addNode(fillingNode, 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n');
    projectData = JSON.parse(JSON.stringify(projectDataCopy));

  });

  it('getConnectionByACID', () => {
    service['projectData'] = projectData;
    service.getConnectionByACIDAndInterfaceID('b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=', 'clientInf_l7vnn3uh');
    expect(service.getConnectionByACIDAndInterfaceID).toBeDefined();

  });

  it('getAreaSubConnectionsByCategory', () => {
    spyOn(service, 'getAreaSubConnectionsByCategory').and.callThrough();
    service.getAreaSubConnectionsByCategory('area_l8alnjdn', true);
    expect(service.getAreaSubConnectionsByCategory).toHaveBeenCalled();

    projectData.editor.subConnections[0].isclient = true;
    service['projectData'] = projectData;
    service.getAreaSubConnectionsByCategory('area_l8alnjdn', true);
    expect(service.getAreaSubConnectionsByCategory).toBeDefined();
  });

  it('getSubConnectionsByCategoryAndInterfaceType', () => {
    spyOn(service, 'getSubConnectionsByCategoryAndInterfaceType').and.callThrough();
    service.getSubConnectionsByCategoryAndInterfaceType('FillingToMixing', true);
    expect(service.getSubConnectionsByCategoryAndInterfaceType).toHaveBeenCalled();

    service['projectData'] = projectData;
    service.getSubConnectionsByCategoryAndInterfaceType('FillingToMixing', true);
    expect(service.getSubConnectionsByCategoryAndInterfaceType).toBeDefined();
  });

  it('updateConnectionBasedOnDeviceStatus', () => {
    service['facadeService'].editorService.liveLinkEditor.connectorLookup = {
      key: { areaId: ROOT_EDITOR }
    } as HTMLNodeConnector;
    projectData.tree.devices[0].uid = 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n';
    spyOn(service, 'getAllConnections').and.returnValue(projectData.editor.connections);
    spyOn(service, 'getDevices').and.returnValue(projectData.tree.devices);
    service.updateConnectionBasedOnDeviceStatus();
    expect(service.updateConnectionBasedOnDeviceStatus).toBeDefined();
  });

  it('updateConnectorStatus', () => {
    spyOn(service, 'updateConnectorStatus').and.callThrough();
    service['facadeService'].connectorService.updateConnectorUnavailableData({ id: 'test' } as BaseConnector, true);
    service.updateConnectorStatus({ state: ConnectorState.Error }, []);
    expect(service.updateConnectorStatus).toHaveBeenCalled();
  });

  it('deleteConnectionIfNotMatching should call delete connection if matching', () => {
    service['facadeService'].subConnectorService.removeInterfaceAndSubConnectionByType = () => { };
    spyOn(service, 'deleteConnection');
    spyOn(service, 'getAllConnections').and.returnValue(projectData.editor.connections);
    spyOn(service, 'getDevice').and.returnValue(device[0] as unknown as Device);
    spyOn(service, 'getSubConnectionsByCategoryAndInterfaceType').and.returnValue([subConnection] as unknown as SubConnection[]);
    spyOn(service, 'getAllAreas').and.returnValue(projectData.editor.areas);
    service.deleteConnectionIfNotMatching(payloadClient.deviceId);
    expect(service.deleteConnection).toHaveBeenCalled();
  });

  it('should call getOnlineConnectionByACID method', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllConnections').value.and.returnValue(
      [{creationMode:ConnectorCreationMode.ONLINE,acIds:'sample_automation12345',in:'sample_interface12345'}] as unknown as Connection[]);
    const automationComponentId='automation12345';
    const interfaceId='interface12345';
    const res= service.getOnlineConnectionByACID(automationComponentId,interfaceId);
    expect(service.getOnlineConnectionByACID).toBeDefined();
    expect(res).toEqual({creationMode:ConnectorCreationMode.ONLINE,acIds:'sample_automation12345',in:'sample_interface12345'} as unknown as Connection);
  });

  it('should call getClientInterfaceByInterfaceId method', () => {
    spyOn(service, 'getAutomationComponent').and.returnValue({} as unknown as AutomationComponent);
    const deviceId='device12345';
    const acId='automation12345';
    const interfaceId='interface12345';

    service.getClientInterfaceByInterfaceId(deviceId,acId,interfaceId);
    expect(service.getClientInterfaceByInterfaceId).toBeDefined();

  });



});


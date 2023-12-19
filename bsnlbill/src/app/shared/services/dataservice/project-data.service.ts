/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import {
  AccessType, AddressModelType, ConnectionAttributes, ConnectorCreationMode, ConnectorState, dateDefaultLanguage, DeviceState, FillingLineNodeType,
  InterfaceCategory, Numeric, SubConnectorCreationMode
} from '../../../enum/enum';
import { Connection, ConnectionDetails, InterfaceDetails, MatchingConnectionInterface, SubConnection } from '../../../models/connection.interface';
import { DeviceScanSettings } from '../../../models/device-data.interface';
import { Area, Editor, HTMLNodeConnector, Node, Project, ProjectData, Tree } from '../../../models/models';
import { PropertiesType } from '../../../models/monitor.interface';
import {
  AreaClientInterface, AreaInterface, AutomationComponent, ClientInterface, ConenctionEndPointDetails,
  Device, ISidePanel, OpcInterface
} from '../../../models/targetmodel.interface';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { FillingArea, FillingNode } from '../../../store/filling-line/filling-line.reducer';
import { ROOT_EDITOR } from '../../../utility/constant';
import { getAutomationComponentNameFromId, getConnectionDetails, getSubConnectionID, getUniqueInterfaceByAcId, isNullOrEmpty } from '../../../utility/utility';
import * as projectDataUtility from '../../../../app/utility/project-data-utility'; //NOSONAR

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  private projectData: ProjectData;
  private _haveReadAccess = false;
  private _accessDetails: AccessType;
  constructor(protected facadeService: FacadeService) { }
  /**
   *
   * @param data
   */
  setProjectData(data: ProjectData) {
    this.projectData = data;
  }
  /**
   *
   * @returns project Data
   */
  getProjectData() {
    return this.projectData;
  }
  /**
   *
   * @param deviceId
   * @param state
   */
  updateDeviceState(deviceId: string, state: DeviceState) {
    if (deviceId && state) {
      const device = this.getDevice(deviceId);
      device.state = state;
      this.updateACState(device, state);
    }
  }
  /**
   *
   * @param device
   * @param state
   */
  updateACState(device: Device, state: DeviceState) {
    for (const ac of device.automationComponents) {
      ac.state = state;
    }
  }
  /**
   *
   * @param fillingData
   */
  updateInterface(fillingData: FillingNode) {
    const device = this.getDevice(fillingData.deviceId);
    const acIndex = device.automationComponents.findIndex(ac => ac.id === fillingData.id);
    if (acIndex !== -1) {
      device.automationComponents[acIndex].clientInterfaces = fillingData.clientInterfaces;
      device.automationComponents[acIndex].serverInterfaces = fillingData.serverInterfaces;
      this.setDevice(device);
    }
  }
  /**
   * Finds the device in the list of devices
   * @param id
   * @returns
   */
  getDevice(id: string): Device {
    return this.getDevices().find(device => device.uid === id);
  }

  /**
   * Finds the device in the device list using the address provided
   * @param address
   * @returns
   */
  getDeviceByAddress(address: string) {
    return this.getDevices().find(device => device.address === address);
  }

  /**
   * Update device if it exits else add it to list
   * @param device
   */
  setDevice(device: Device) {
    let projectData: ProjectData = this.getProjectData();
    projectData = projectDataUtility.setDevice(projectData, device);
    this.setProjectData(projectData);
  }
  /**
   * Function is used to set the device if it exists
   * @param devices
   */
  setDevices(devices: Device[]) {
    const projectData: ProjectData = this.getProjectData();
    projectData.tree.devices = devices;
    this.setProjectData(projectData);
  }

  /**
   * Finds the device state in the device list using the id provided
   * @param deviceId
   * @returns
   */
  getDeviceState(deviceId: string) {
    let state = DeviceState.UNKNOWN;
    if (deviceId) {
      const device = this.getDevices().find(_device => _device.uid === deviceId);
      state = device.state;
    }
    return state;
  }

  /**
   * Check if the device is available
   * @param deviceId
   * @returns
   */
  isDeviceAvailable(deviceId: string) {
    return this.getDeviceState(deviceId) === DeviceState.UNAVAILABLE;
  }

  /**
   * Reset the device & AC state to unknown
   * @param data
   */
  setDefaultState(data: ProjectData) {
    for (const device of data.tree.devices) {
      device.state = DeviceState.UNKNOWN;
      device.automationComponents.every(ac => ac.state = device.state);
    }
  }

  /**
   * This function returns the project data which is used in save as function
   * @returns
   */
  getProjectDataAsSaveJson() {
    const projectData = {
      project: {},
      tree: {},
      editor: {},
      scanSettings: {},
      zoomSettings: {
        zoomPercent: this.facadeService.zoomOperationsService.selectedZoomPercent
      }
    } as ProjectData;
    const projectdetails = this.getProjectMetaData();
    if (projectdetails) {
      projectData.project = { ...projectdetails };
      projectData.project.modified = new Date().toLocaleString(dateDefaultLanguage.UNITED_STATES);
      delete projectData.project.isSelected;
    }
    const treeData = this.getProjectTree();
    if (treeData) {
      projectData.tree = treeData;
      projectData.tree.devices.forEach(device => {
        delete device.state;
        device.automationComponents = device.automationComponents.map(ac => {
          const AComp = { ...ac };
          delete AComp.state;
          return AComp;
        }
        );
      });
    }
    const editorData = this.getEditorData();
    if (editorData) {
      projectData.editor = editorData;
    }
    const scanSettings = this.getScanSettingsData();
    if (scanSettings) {
      projectData.scanSettings = scanSettings;
    }
    return projectData;
  }

  /**
   * Returns the project tree data if exists else returns null
   * @returns
   */
  getProjectTree(): Tree {
    const projectData = this.projectData;
    return projectDataUtility.getProjectTree(projectData);
  }

  /**
   * Returns the project devices if exists else returns null
   * @returns devices in the project data
   */
  getProjectTreeDevices() {
    const projectTreeData = this.getProjectTree();
    return projectDataUtility.getProjectTreeDevices(projectTreeData);
  }

  /**
   * Returns the project editor data if exists else returns null
   * @returns editor data
   */
  getEditorData(): Editor {
    const projectData = this.projectData;
    return projectDataUtility.getEditorData(projectData);
  }

  /**
   * Returns the project data if exists else returns null
   * @returns  project meta data
   */
  getProjectMetaData(): Project {
    const projectData = this.projectData;
    return projectDataUtility.getProjectMetaData(projectData);
  }

  /**
   * Returns the project editor nodes if exists else returns null
   * @returns
   */
  getAllNodes(): Array<Node> {
    const projectData = this.projectData;
    return projectDataUtility.getAllNodes(projectData);
  }

  /**
   * Finds the project editor node using id
   * @param nodeId
   * @returns
   */
  getNodeByID(nodeId: string): Node {
    return projectDataUtility.getNodeByID(this.projectData, nodeId);
  }

  getNodeByAddress(address:string):Node[]{
    return projectDataUtility.getNodeByAddress(this.projectData, address);
  }
  /**
   * Returns all the areas if exists else returns null
   * @returns
   */
  getAllAreas(): Array<Area> {
    const projectData = this.projectData;
    return projectDataUtility.getAllAreas(projectData);
  }
  /**
   * Returns the project name
   * @returns
   */
  getProjectName(): string {
    return projectDataUtility.getProjectName(this.projectData);
  }

  /**
   * Function returns the project id
   * @returns
   */
  getProjectId(): string {
    return projectDataUtility.getProjectId(this.projectData);
  }

  /**
   * Returns all the devices in project
   * @returns
   */
  getDevices() {
    return projectDataUtility.getDevices(this.projectData);
  }

  /**
   * Returns all the nodes present for the parentID given
   * @param deviceId
   * @returns
   */
  getAutomationComponents(deviceId: string): Array<AutomationComponent> {
    return this.getDevice(deviceId)?.automationComponents;
  }

  /**
   * Returns the AC using the AC id and device ID provided
   * @param deviceId
   * @param id
   * @returns
   */
  getAutomationComponent(deviceId: string, id: string): AutomationComponent {
    return this.getAutomationComponents(deviceId)?.find(comp => comp.id === id);
  }

  /**
   * Returns AC for the name provided as input
   * @param deviceId
   * @param name
   * @returns
   */
  getAutomationComponentByName(deviceId: string, name: string): AutomationComponent {
    const acComp = this.getAutomationComponents(deviceId);
    return projectDataUtility.getAutomationComponentByName(acComp, name);
  }

  /**
   * Returns all the client interfaces related to area
   * @param deviceId
   * @param automationComponentId
   * @param interfaceId
   * @param subConnectionId
   * @param interfaceExposedMode
   * @returns
   */
  getAreaClientInterfaces(deviceId: string, automationComponentId: string, interfaceId: string,
    subConnectionId: string, interfaceExposedMode: SubConnectorCreationMode): AreaClientInterface {
    const deviceDetails = this.getDevice(deviceId);
    const interfaceDetail = deviceDetails?.automationComponents?.find(ac => ac.id === automationComponentId)?.
      clientInterfaces?.find(cInterface => cInterface.id === interfaceId);
    return { ...interfaceDetail, deviceId, automationComponentId, subConnectionId, interfaceExposedMode };
  }

  /**
   * Returns all the server interfaces related to area
   * @param deviceId
   * @param automationComponentId
   * @param interfaceId
   * @param subConnectionId
   * @param interfaceExposedMode
   * @returns
   */
  getAreaServerInterfaces(deviceId: string, automationComponentId: string, interfaceId: string,
    subConnectionId: string, interfaceExposedMode: SubConnectorCreationMode): AreaInterface {
    const deviceDetails = this.getDevice(deviceId);
    const interfaceDetail = deviceDetails?.automationComponents?.find(ac => ac.id === automationComponentId)?.
      serverInterfaces.find(serverInterface => serverInterface.id === interfaceId);
    return { ...interfaceDetail, deviceId, automationComponentId, subConnectionId, interfaceExposedMode };
  }

  /**
   * Returns client interface based on deviceId and acID
   * @param deviceId
   * @param acID
   * @param interfaceType
   * @returns
   */
  getClientInterface(deviceId: string, acID: string, interfaceType: string): ClientInterface {
    return this.getAutomationComponent(deviceId, acID)?.clientInterfaces?.find(item => item.type === interfaceType);
  }

  /**
   * Returns server interface based on deviceId and acID
   * @param deviceId
   * @param acID
   * @param serverInterfaceType
   * @returns
   */
  getServerInterface(deviceId: string, acID: string, serverInterfaceType: string): OpcInterface {
    return this.getAutomationComponent(deviceId, acID)?.serverInterfaces?.find(item => item.type === serverInterfaceType);
  }

  /**
   * Returns connection end point data for the connection
   * @param connectionData
   * @param connectionId
   * @returns
   */
  getConnectionEndPointData(connectionData?: Connection, connectionId?: string): ConenctionEndPointDetails {
    let result;
    if (!connectionData) {
      connectionData = this.getConnection(connectionId);
    }
    if (connectionData) {
      const [fromDeviceId, , clientInfId] = connectionData.in?.split('__');
      const fromAcId = connectionData.acIds?.split('__')?.[0];
      result = this.getConnectionEndPointDetails(fromDeviceId, fromAcId, clientInfId);
    }
    return result;
  }

  /**
   * Returns connection end point details
   * @param deviceId
   * @param automationComponentId
   * @param interfaceId
   * @returns
   */
  getConnectionEndPointDetails(deviceId: string, automationComponentId: string, interfaceId: string): ConenctionEndPointDetails {
    const device: Device = this.getDevice(deviceId);
    return projectDataUtility.getConnectionEndPointDetails(automationComponentId, interfaceId, device);
  }

  /**
   * Reset the monitor values for all devices
   */
  resetConnectionMonitorValuesForAllDevices() {
    const devices = this.getDevices();
    for (const device of devices) {
      this.resetConnectionEndPointDetails(device.uid, false, true, '');
    }
  }

  /**
   * Reset connection end point details for interfaces
   * @param deviceid
   * @param diagnose
   * @param resetPartner
   * @param partner
   */
  resetConnectionEndPointDetails(deviceid: string, diagnose: boolean, resetPartner = true, partner?: string) {
    const device = this.getDevice(deviceid);
    const acs = this.getAutomationComponents(device.uid);
    for (const ac of acs) {
      const clientInterfaces = ac.clientInterfaces;
      for (const clientInterface of clientInterfaces) {
        this.updateConnectionEndPointDetails(diagnose, ConnectionAttributes.DIAGNOSE, device.uid, ac.id, clientInterface.id);
        if (resetPartner === true && typeof (partner) !== 'undefined') {
          this.updateConnectionEndPointDetails(partner, ConnectionAttributes.PARTNER, device.uid, ac.id, clientInterface.id);
        }
      }
    }
  }
  /**
   *
   * @param acID from connection details
   * @param deviceDetails all device in current project
   * @returns if any of the device related to connector having status as unavailable
   *
   * split and get the device ID from acID,then map the extracted device details to deviceID
   * check if any of the device related to connector, is having the status as unavailable
   */
  findIfAnyDeviceOfflineFromConnectionAcID(acID: string, deviceDetails: Device[]) {
    if (!isNullOrEmpty(deviceDetails)) {
      return projectDataUtility.findIfAnyDeviceOfflineFromConnectionAcID(acID, deviceDetails);
    }
    return [];
  }

  /**
   * from connectorLookup,get device details from acIds
   * if the device status corresponding to the connection status is unAvailable
   * update connector status to Unavailable
   */
  updateConnectionBasedOnDeviceStatus() {
    const connectorLookupList = this.facadeService.editorService.liveLinkEditor.connectorLookup;
    const connections = this.getAllConnections();
    const devices = this.getDevices();
    if (!isNullOrEmpty(connections) && connectorLookupList) {
      for (const connection of connections) {
        const connectorDetailsFromLookup = connectorLookupList[connection.id];
        const unAvailableDevicesList = this.findIfAnyDeviceOfflineFromConnectionAcID(connection.acIds, devices);
        this.updateConnectorStatus(connectorDetailsFromLookup, unAvailableDevicesList);
      }
    }
  }

  /**
   *updating the state of available connection in connection lookup from other areas or root editor, if the state of device
   change from current area or root
   * @param connectorDetailsFromLookup get current connector details from lookup
   * @param unAvailableDevicesList unavailable device list related to the connector
   */
  updateConnectorStatus(connectorDetailsFromLookup, unAvailableDevicesList) {
    if (connectorDetailsFromLookup && (connectorDetailsFromLookup.state !== ConnectorState.Default &&
      connectorDetailsFromLookup.state !== ConnectorState.Proposed)) {
      if ((!isNullOrEmpty(unAvailableDevicesList) || !connectorDetailsFromLookup.connectionStatus)) {
        this.facadeService.connectorService.updateConnectorUnavailableData(connectorDetailsFromLookup, false);
      }
      if (isNullOrEmpty(unAvailableDevicesList)) {
        this.facadeService.connectorService.updateConnectorUnavailableData(connectorDetailsFromLookup, true);
      }
    }
  }
  /**
    * update the diagnose value and set cache data with updated diagnose value
    * These values are accesses again while we are loading the plant editor view again in Online Mode
    */
  updateConnectionEndPointDetails(value: boolean | string, param: string, deviceId: string, automationComponentId: string, interfaceId: string): void {
    const device = this.getDevice(deviceId);
    const acIndex = device.automationComponents.findIndex(ac => ac.id === automationComponentId);
    if (acIndex > -1) {
      const ac = { ...device.automationComponents[acIndex] };
      const clientInterfaces = [...ac?.clientInterfaces] || [];
      const index = clientInterfaces.findIndex(inf => inf.id === interfaceId);
      if (index > -1) {
        this.updateClientInterfacesEndPointDetails(clientInterfaces, index, value, param, device, acIndex);
      }
    }
  }
  /**
    * Function to update the client interface end point details
    *
    */
  updateClientInterfacesEndPointDetails(clientInterfaces: Array<ClientInterface>, index: number, value, param: string, device: Device, acIndex: number) {
    let clientInterface = clientInterfaces[index];
    const clientInterfaceCopied: ClientInterface = { ...clientInterface };
    const connectionEndPointData: ConenctionEndPointDetails = { ...clientInterfaceCopied.connectionEndPointDetails };
    let property;
    if (connectionEndPointData) {
      switch (param) {
        case ConnectionAttributes.DIAGNOSE:
          property = { ...connectionEndPointData.status };
          property.value = value;
          connectionEndPointData.status = property;
          break;
        case ConnectionAttributes.PARTNER:
          property = { ...connectionEndPointData.relatedEndpoints };
          property.value = value as string;
          connectionEndPointData.relatedEndpoints = property;
          break;
        case ConnectionAttributes.DETAILEDSTATUS:
          property = { ...connectionEndPointData.detailStatus };
          property.value = value;
          connectionEndPointData.detailStatus = property;
          break;
        default: break;
      }
      clientInterfaceCopied.connectionEndPointDetails = connectionEndPointData;
      clientInterface = clientInterfaceCopied;
      clientInterfaces[index] = clientInterface;
      device.automationComponents[acIndex].clientInterfaces = clientInterfaces;
    }
  }

  /**
   * Function is used to update the project meta data
   * @param metaData
   */
  setProjectMetaData(metaData: Project) {
    if (!this.projectData) {
      this.projectData = {
        project: null,
        tree: { devices: [] },
        editor: null,
        scanSettings: null
      };
    }
    this.projectData.project = metaData;
  }

  /**
   * Function is used to add node to project data
   * @param node
   * @param editorContext
   */
  addNode(node: FillingNode, editorContext: string) {
    const projectData = this.getProjectData();
    /* operation */
    if (this.projectData) {
      let nodeIndex = -1;
      if (!this.projectData.editor) {
        this.projectData.editor = {} as Editor;
        this.projectData.editor.nodes = [];
        this.projectData.editor.connections = [];
        this.projectData.editor.areas = [];
      }
      if (!this.projectData.editor.nodes) {
        this.projectData.editor.nodes = [];
      } else {
        nodeIndex = this.projectData.editor.nodes.findIndex(item => item.id === node.id);
      }
      if (nodeIndex === -1 && node.type === FillingLineNodeType.NODE) {
        const editorNode: Node = {
          id: node.id,
          x: node.x,
          y: node.y,
          address: node.address,
          selected: node.selected,
          parent: editorContext,
          deviceId: node.deviceId
        };
        projectData.editor.nodes.push(editorNode);
        this.setProjectData(projectData);
      }
      this.handleAddNodeForArea(node, editorContext, nodeIndex, projectData);
    }
  }

  /**
   * When a node is added to an area
   * @param node
   * @param editorContext
   * @param nodeIndex
   * @param projectData
   * @returns
   */
  handleAddNodeForArea(node: FillingNode, editorContext: string, nodeIndex: number, projectData: ProjectData) {
    if (editorContext !== ROOT_EDITOR) {
      if (!this.projectData.editor || !this.projectData.editor.areas) {
        return;
      }
      const areaIndex = this.getAllAreas().findIndex(areaData => areaData.id === editorContext);
      if (areaIndex !== -1) {
        nodeIndex = -1;
        if (isNullOrEmpty(this.projectData.editor.areas[areaIndex].nodeIds)) {
          this.projectData.editor.areas[areaIndex].nodeIds = [];
          this.projectData.editor.areas[areaIndex].connectionIds = [];
        } else {
          nodeIndex = this.projectData.editor.areas[areaIndex].nodeIds.findIndex(item => item === node.id);
        }
        if (nodeIndex === -1) {
          const nodeIds = [...projectData.editor.areas[areaIndex].nodeIds, node.id];
          this.updateArea(editorContext, { nodeIds: nodeIds });
        }
      }
      this.setProjectData(projectData);
      this.updateAreaParentByAreaId(node.id, editorContext);// why node.id is an areaId ?
    }
  }

  /**
   * Used to update the area's parent by using area id
   * @param areaId
   * @param parent
   */
  updateAreaParentByAreaId(areaId: string, parent: string) {
    const projectData = this.getProjectData();
    const areaIndex = projectData.editor.areas.findIndex(areaData => areaData.id === areaId);
    if (areaIndex !== -1) {
      projectData.editor.areas[areaIndex].parent = parent;
      this.setProjectData(projectData);
    }
  }

  /**
   * Returns the connection list by using the nodeId
   * @param id
   * @returns
   */
  getConnectionListByNodeId(id: string) {
    return projectDataUtility.getConnectionListByNodeId(this.projectData, id);
  }

  /**
   * Function is used to update the node
   * @param fillingNode
   */
  updateNode(fillingNode: FillingNode) {
    let projectData = this.getProjectData();
    /* operation */
    projectData = projectDataUtility.updateNode(projectData, fillingNode);
    this.setProjectData(projectData);
  }

  /**
   * When we delete node
   * @param id
   * @param _editorContext
   */
  deleteNode(id: string, _editorContext: string) {
    const projectData = this.getProjectData();
    if (projectData && projectData.editor && projectData.editor.nodes) {
      /* operation */
      projectData.editor.nodes = projectData.editor.nodes || [];
      const index = projectData.editor.nodes.findIndex(node => node.id === id);
      if (index !== -1) {
        if (projectData.hasOwnProperty('editor') &&
          projectData.editor.hasOwnProperty('nodes') &&
          projectData.editor.nodes.length > 0) {
          projectData.editor.nodes.splice(index, 1);
        }
        this.setProjectData(projectData);
      }
    }
  }

  /**
   * When a connection is added
   * @param connection
   */
  addConnection(connection: Connection) {
    /* operation */
    this.projectData = projectDataUtility.addConnection(this.projectData, connection);
  }
  /**
   *
   * @param connection
   */
  addOrUpdateConnection(connection: Connection) {
    if (connection) {
      let connectionIndex = -1;
      if (this.projectData && this.projectData.editor && this.projectData.editor.connections) {
        connectionIndex = this.projectData.editor.connections.findIndex(con => con.id === connection.id);
        if (connectionIndex > -1) {
          this.projectData.editor.connections[connectionIndex] = connection;
        }
      }
      if (connectionIndex === -1) {
        this.addConnection(connection);
      }
    }
  }
  /**
   *
   * @param connection
   */
  deleteConnection(connection: Connection) {
    const projectData: ProjectData = this.projectData;
    /* operation */
    if (connection && projectData && projectData.editor && projectData.editor.connections) {
      const connections = projectData.editor.connections.filter(con => con.id !== connection.id);
      this.projectData.editor.connections = connections;
    }
  }
  /**
   *
   * @param subConnection
   */
  addOrUpdateSubConnection(subConnection: SubConnection) {
    if (this.projectData && subConnection) {
      let connectionIndex = -1;
      if (!this.projectData.editor || !this.projectData.editor.nodes) {
        this.projectData.editor = {} as Editor;
        this.projectData.editor.nodes = [];
        this.projectData.editor.subConnections = [];
      } else if (!this.projectData.editor.subConnections) {
        this.projectData.editor.subConnections = [];
      } else {
        connectionIndex = this.projectData.editor.subConnections.findIndex(con => con.id === subConnection.id);
      }
      if (connectionIndex === -1) {
        this.projectData.editor.subConnections.push(subConnection);
      } else {
        this.projectData.editor.subConnections[connectionIndex] = subConnection;
      }
    }
  }

  /**
   * return all online connection matching with automationComponentId, interfaceId
   * @param automationComponentId 
   * @param interfaceId 
   * @returns 
   */
  getOnlineConnectionByACID(automationComponentId, interfaceId){
    const connection =  this.facadeService.dataService.getAllConnections();
    return connection.find(conn => conn.creationMode === ConnectorCreationMode.ONLINE 
      && conn.acIds.includes(automationComponentId) && conn.in.includes(interfaceId));
  }

  /**
   *
   * @param acId
   * @param interfaceId
   * @returns connections having given acId and InterfaceID
   * Used to access the connection id for the connection for monitoring client interface
   * of a device either in root editor or in area
   */
  getConnectionByACIDAndInterfaceID(acId: string, interfaceId: string) {
    return projectDataUtility.getConnectionByAcIdAndInterfaceId(this.projectData, acId,interfaceId);
  }

  /**
   * @description checks if the subConnection found by acid and InterfaceId
   *  is present in current editor subConnector
   * @param subConnectionByAcId
   * @param subConnectorLookup
   * @returns checks if the subConnection found by acid and InterfaceId
   *  is present in current editor subConnector
   */
  checkIfSubConnectionMatchingWithLookup(subConnectionByAcId: SubConnection, subConnectorLookup: HTMLNodeConnector) {
    return projectDataUtility.checkIfSubConnectionMatchingWithLookup(subConnectionByAcId, subConnectorLookup);
  }

  /**
   * @description Function is used to update the subConnection
   * @param subConnection
   */
  updateSubConnection(subConnection: SubConnection) {
    if (this.projectData && this.projectData.editor && this.projectData.editor.subConnections) {
      this.projectData.editor.subConnections = this.projectData.editor.subConnections || [];
      const connectionIndex = this.projectData.editor.subConnections.findIndex(con => con.id === subConnection.id);
      if (connectionIndex > -1) {
        this.projectData.editor.subConnections[connectionIndex] = subConnection;
      }
    }
  }

  /**
   * @description - Function is used to delete sub connection
   * @param id - subConnection ID
   */
  deleteSubConnection(id: string) {
    const projectData = { ...this.projectData };
    if (projectData && projectData.editor && projectData.editor.subConnections && projectData.editor.subConnections.length) {
      const subConnections = [...this.getAllSubConnections()];
      const subConnectionIndex: number = subConnections?.findIndex(con => con.id === id);
      if (subConnectionIndex !== -1) {
        subConnections.splice(subConnectionIndex, 1);
        projectData.editor.subConnections = subConnections;
        this.setProjectData(projectData);
      }
    }
  }

  /**
   * Delete sub connection by using area id
   * @param areaId
   */
  deleteSubConnectionByAreaId(areaId: string) {
    if (areaId && this.projectData && this.projectData.editor && this.projectData.editor.subConnections) {
      this.projectData.editor.subConnections = this.projectData.editor.subConnections.filter(con => con.areaId !== areaId);
    }
  }

  /**
   * Function is used to update the connection
   * @param connectionId
   * @param connection
   */
  updateConnection(connectionId: string, connection: Connection) {
    if (this.projectData && this.projectData.editor && this.projectData.editor.connections.length > 0) {
      const connectionIndex = this.projectData.editor.connections.findIndex(con => con.id === connectionId);
      if (connectionIndex > -1) {
        this.projectData.editor.connections[connectionIndex] = connection;
      }
    }
  }

  /**
   * Update the node's parent when an operation is performed
   * @param nodeId
   * @param updatedValue
   */
  updateNodeParent(nodeId: string, updatedValue: string) {
    if (this.projectData && this.projectData.editor && this.projectData.editor.nodes && this.projectData.editor.nodes.length > 0) {
      for (const node of this.projectData.editor.nodes) {
        if (node.id === nodeId) {
          node.parent = updatedValue;
          break;
        }
      }
    }
  }

  /**
   * Returns connections if exists else returns null
   * @returns
   */
  getAllConnections(): Array<Connection> {
    return projectDataUtility.getAllConnections(this.projectData);
  }

  /**
   * Returns connection if it exists else returns null
   * @param id
   * @returns
   */
  getConnection(id: string): Connection {
    return projectDataUtility.getConnection(this.projectData, id);

  }

  /**
   * Returns connections related to AC by using ACId else returns null
   * @param acId
   * @returns
   */
  getConnectionByAcID(acId: string): Connection[] {
    return projectDataUtility.getConnectionByAcID(this.projectData, acId);
  }

  /**
   * Returns  connections related to area id provided
   * @param areaId
   * @returns
   */
  getAreaConnections(areaId: string): Array<Connection> {
    return projectDataUtility.getAreaConnection(this.projectData, areaId);

  }

  /**
   * Returns connections related to area id provided if exists else returns null
   * @param areaId
   * @returns
   */
  getAreaAllConnections(areaId: string): Array<Connection> {
    return projectDataUtility.getAreaAllConnections(this.projectData, areaId);
  }

  /**
   * Returns all the sub connections
   * @returns
   */
  getAllSubConnections(): Array<SubConnection> {
    return projectDataUtility.getAllSubConnections(this.projectData);
  }

  /**
   * Returns  sub connections for id provided if exists else returns null
   * @param connectionId
   * @returns
   */
  getAllAssociatedSubConnections(connectionId: string): Array<SubConnection> {
    return projectDataUtility.getAllAssociatedSubConnections(this.projectData, connectionId);
  }

  /**
   * Returns sub connections connections related to area id provided if exists else returns null
   * @param areaId
   * @returns
   */
  getAreaSubConnections(areaId: string): Array<SubConnection> {
    return projectDataUtility.getAreaSubConnections(this.projectData, areaId);
  }

  /**
   * Returns area sub connections by category client/server
   * @param areaId
   * @param isClient
   * @returns
   */
  getAreaSubConnectionsByCategory(areaId: string, isClient: boolean): Array<SubConnection> {
    return projectDataUtility.getAreaSubConnectionsByCategory(this.projectData, areaId, isClient);
  }

  /**
   * REturns the subConnection by areaId and connection data
   * @param areaID
   * @param connectionData
   * @returns
   */
  getSubConnectionByData(areaID: string, connectionData: string): SubConnection {
    return this.getAreaSubConnections(areaID)?.find(subCon => subCon.data === connectionData);
  }

  /**
   * Returns sub connections based on category(client/server) and interface type(client interface/server interface)
   * @param interfaceType
   * @param isClient
   * @returns
   */
  getSubConnectionsByCategoryAndInterfaceType(interfaceType: string, isClient: boolean): Array<SubConnection> {
    return projectDataUtility.getSubConnectionsByCategoryAndInterfaceType(this.projectData, interfaceType, isClient);
  }

  /**
   * Returns all subConnections for given areaId
   * @param areaID
   * @param id
   * @returns
   */
  getAreaSubConnection(areaID: string, id: string): SubConnection {
    return this.getAreaSubConnections(areaID).find(subCon => subCon.id === id);
  }

  /**
   * Returns the subConnections for given id
   * @param id
   * @returns
   */
  getSubConnection(id: string): SubConnection {
    return this.getAllSubConnections().find(subCon => subCon.id === id);
  }

  /**
   * clears the project data
   */
  clearProjectData() { //clearCache
    this.projectData = null;
  }

  /**
   * Add area and update it in project data
   * @param area
   */
  addArea(area: FillingArea) {
    /* operation */
    if (this.projectData) {
      let areaIndex = -1;
      if (!this.projectData.editor) {
        this.projectData.editor = {} as Editor;
        this.projectData.editor.nodes = [];
        this.projectData.editor.connections = [];
        this.projectData.editor.areas = [];
      }
      if (!this.projectData.editor.areas) {
        this.projectData.editor.areas = [];
      } else {
        areaIndex = this.projectData.editor.areas.findIndex(item => item.id === area.id);
      }
      if (areaIndex === -1) {
        const editorArea: Area = {
          id: area.id,
          name: area.name,
          x: area.x,
          y: area.y,
          selected: area.selected,
          nodeIds: area.nodeIds,
          connectionIds: area.connectionIds,
          clientInterfaceIds: area.clientInterfaceIds || [],
          serverInterfaceIds: area.serverInterfaceIds || [],
          parent: area.parent
        };
        this.projectData.editor.areas.push(editorArea);
      }
    }
  }

  /**
   * Update the existing area
   * @param areaId
   * @param fillingArea
   */
  updateArea(areaId: string, fillingArea: FillingArea | Partial<FillingArea>) {
    const projectData = this.getProjectData();
    /* operation */
    if (projectData) {
      if (!projectData.editor) {
        projectData.editor.connections = [];
        projectData.editor = {} as Editor;
        projectData.editor.areas = [];
      }
      this.updateAreaWithAreaIndex(areaId, projectData, fillingArea);
    } else {
      this.setProjectData(projectData);
    }
  }

  /**
   * Update the area if area exists else add new area
   * @param areaId
   * @param projectData
   * @param fillingArea
   */
  updateAreaWithAreaIndex(areaId: string, projectData: ProjectData, fillingArea: FillingArea | Partial<FillingArea>) {
    let areaIndex = -1;
    if (!this.projectData.editor.areas) {
      this.projectData.editor.areas = [];
    } else {
      areaIndex = this.projectData.editor.areas.findIndex(item => item.id === areaId);
      if (areaIndex !== -1) {
        const editorArea: Area = {} as Area;
        editorArea.id = this.getFillingAreaData('id', fillingArea, areaIndex);
        editorArea.x = this.getFillingAreaData('x', fillingArea, areaIndex);
        editorArea.y = this.getFillingAreaData('y', fillingArea, areaIndex);
        editorArea.selected = this.getFillingAreaData('selected', fillingArea, areaIndex);
        editorArea.parent = this.getFillingAreaData('parent', fillingArea, areaIndex);
        /*Existing area data is replaced on moved */
        editorArea.clientInterfaceIds = this.getFillingAreaData('clientInterfaceIds', fillingArea, areaIndex);
        editorArea.serverInterfaceIds = this.getFillingAreaData('serverInterfaceIds', fillingArea, areaIndex);
        editorArea.name = this.getFillingAreaData('name', fillingArea, areaIndex);
        editorArea.nodeIds = this.getFillingAreaData('nodeIds', fillingArea, areaIndex);
        editorArea.connectionIds = this.getFillingAreaData('connectionIds', fillingArea, areaIndex);
        projectData.editor.areas[areaIndex] = editorArea;
      }
    }
    this.setProjectData(projectData);
  }

  /**
   * Returns filling area data
   * @param key
   * @param fillingArea
   * @param areaIndex
   * @returns
   */
  getFillingAreaData(key: string, fillingArea: FillingArea | Partial<FillingArea>, areaIndex: number) {
    const existingEditorArea: Area = this.projectData.editor.areas[areaIndex];
    return fillingArea[key] || existingEditorArea[key];
  }

  /**
   * Finds the area which matches with the area id if it exits else returns null
   * @param id
   * @returns
   */
  getArea(id: string): Area {
    return projectDataUtility.getArea(this.projectData, id);
  }

  /**
   *
   * @param id
   * @returns
   */
  getAreaByParent(id: string): Area[] {
    return projectDataUtility.getAreaByParent(this.projectData, id);
  }
  /**
   *
   * @param id
   */
  removeArea(id: string) {
    if (this.projectData && this.projectData.editor && this.projectData.editor.areas && this.projectData.editor.areas.length > 0) {
      this.projectData.editor.areas = this.projectData.editor.areas.filter(area => area.id !== id);
    }
  }

  /**
   * Returns the server interface list
   * @param areaItem
   * @returns
   */
  getServerInterfaceList(areaItem?: Area): Array<AreaInterface> {
    return areaItem?.serverInterfaceIds?.filter(interfaceDetail => Boolean(interfaceDetail.deviceId))
      .map(interfaceDetails =>
        this.getAreaServerInterfaces(interfaceDetails.deviceId, interfaceDetails.automationComponentId,
          interfaceDetails.interfaceId, interfaceDetails.subConnectionId, interfaceDetails.interfaceExposedMode)
      );
  }

  /**
   * Returns the server interface list related to area
   * @param payload
   * @param interfaceType
   * @returns
   */
  getAreaServerInterface(payload: ISidePanel, interfaceType: string): AreaInterface {
    const serverInterface = this.getServerInterface(payload.deviceId, payload.automationComponentId, interfaceType);// inputAnchor.interfaceData.type);
    let returnVal;
    if (serverInterface) {
      const subConnectionId = getSubConnectionID(payload.automationComponentId, interfaceType, payload.interfaceId);
      returnVal = {
        ...serverInterface, deviceId: payload.deviceId, automationComponentId: payload.automationComponentId,
        subConnectionId: subConnectionId, interfaceExposedMode: payload.interfaceExposedMode
      };
    }
    return returnVal;
  }

  /**
   * Returns the client interface list related to area
   * @param payload
   * @param interfaceType
   * @returns
   */
  getAreaClientInterface(payload: ISidePanel, interfaceType: string): AreaInterface {
    const clientInterface = this.getClientInterface(payload.deviceId, payload.automationComponentId, interfaceType);// inputAnchor.interfaceData.type);
    let returnVal;
    if (clientInterface) {
      const subConnectionId = getSubConnectionID(payload.automationComponentId, interfaceType, payload.interfaceId);
      returnVal = {
        ...clientInterface, deviceId: payload.deviceId, automationComponentId: payload.automationComponentId,
        subConnectionId: subConnectionId, interfaceExposedMode: payload.interfaceExposedMode
      };
    }
    return returnVal;
  }

  /**
   *  returns the adapter type
   * @param deviceId
   * @returns
   */
  getAdapterType(deviceId: string): AddressModelType {
    return projectDataUtility.getAdapterType(this.projectData, deviceId);
  }

  /**
   * Updates area interface exposed mode(manual,manual online,offline,manual offline,proposed)
   * @param areaId
   * @param subConnectionId
   * @param isClient
   * @param exposedMode
   */
  updateAreaInterfaceExposedMode(areaId: string, subConnectionId: string, isClient: boolean, exposedMode: SubConnectorCreationMode) {
    if (this.projectData && this.projectData.editor && this.projectData.editor.areas && this.projectData.editor.areas.length > 0) {
      const areaIndex = this.projectData.editor.areas.findIndex(area => area.id === areaId);
      if (areaIndex > -1) {
        if (isClient) {
          this.updateClientAreaInterfaceExposedMode(areaIndex, subConnectionId, exposedMode);
        }
        else {
          this.updateServerAreaInterfaceExposedMode(areaIndex, subConnectionId, exposedMode);
        }
      }
    }
  }

  /**
   * Updates client interface exposed mode(manual,manual online,offline,manual offline,proposed)
   * @param areaIndex
   * @param subConnectionId
   * @param exposedMode
   */
  updateClientAreaInterfaceExposedMode(areaIndex: number, subConnectionId: string, exposedMode: SubConnectorCreationMode) {
    const clientInterfaces = [...this.projectData.editor.areas[areaIndex]?.clientInterfaceIds] || [];
    const index = this.projectData.editor.areas[areaIndex].clientInterfaceIds.findIndex(inf => inf.subConnectionId === subConnectionId);
    if (index > -1) {
      const inf = { ...clientInterfaces[index] };
      inf.interfaceExposedMode = exposedMode;
      clientInterfaces[index] = inf;
      this.projectData.editor.areas[areaIndex].clientInterfaceIds = clientInterfaces;
    }
  }

  /**
   * Updates server interface exposed mode(manual,manual online,offline,manual offline,proposed)
   * @param areaIndex
   * @param subConnectionId
   * @param exposedMode
   */
  updateServerAreaInterfaceExposedMode(areaIndex: number, subConnectionId: string, exposedMode: SubConnectorCreationMode) {
    const serverInterfaces = [...this.projectData.editor.areas[areaIndex]?.serverInterfaceIds] || [];
    const index = serverInterfaces.findIndex(inf => inf.subConnectionId === subConnectionId);
    if (index > -1) {
      const inf = { ...serverInterfaces[index] };
      inf.interfaceExposedMode = exposedMode;
      serverInterfaces[index] = inf;
      this.projectData.editor.areas[areaIndex].serverInterfaceIds = serverInterfaces;
    }
  }

  /**
   *  Deletes the area
   * @param areaId
   */
  deleteArea(areaId: string) {
    const projectData = this.getProjectData();
    const areaIndex = projectData.editor.areas.findIndex(item => item.id === areaId);
    projectData.editor.areas.splice(areaIndex, 1);
    this.setProjectData(projectData);
  }

  /**
   * returns client interface list
   * @param areaItem
   * @returns
   */
  getClientInterfaceList(areaItem: Area): Array<AreaClientInterface> {
    return areaItem?.clientInterfaceIds?.filter(interfaceDetail => Boolean(interfaceDetail.deviceId))
      .map(interfaceDetails => {
        return this.getAreaClientInterfaces(interfaceDetails.deviceId, interfaceDetails.automationComponentId,
          interfaceDetails.interfaceId, interfaceDetails.subConnectionId, interfaceDetails.interfaceExposedMode);
      });
  }

  /**
   * updates the interface ids for client and server
   * @param areaId
   * @param interfaceData
   * @param mode
   */
  updateInterfaceIds(areaId: string, interfaceData: InterfaceDetails, mode = 'add') {
    if (interfaceData.type === InterfaceCategory.CLIENT) {
      this.updateClientInterfaceIds(mode, interfaceData, areaId);
    }
    if (interfaceData.type === InterfaceCategory.SERVER) {
      this.serverUpdateClientInterfaceIds(mode, interfaceData, areaId);
    }
  }

  /**
   * Updates client interface ids
   * @param mode
   * @param interfaceData
   * @param areaId
   */
  updateClientInterfaceIds(mode: string, interfaceData: InterfaceDetails, areaId: string) {
    const areaData = { ...this.getArea(areaId) };
    let areaClientIds = areaData?.clientInterfaceIds || [];
    if (mode === 'add' || mode === 'update') {
      areaData.clientInterfaceIds = getUniqueInterfaceByAcId(areaClientIds, interfaceData?.interfaceId) || [];
    } else {
      areaClientIds = [...areaClientIds];
      const index = areaClientIds.findIndex(inf => inf.interfaceId === interfaceData.interfaceId.interfaceId);
      if (index > -1) {
        areaClientIds.splice(index, 1);
        areaData.clientInterfaceIds = areaClientIds || [];
      }
    }
    this.updateArea(areaId, areaData);
  }

  /**
   * Updates server interface ids
   * @param mode
   * @param interfaceData
   * @param areaId
   */
  serverUpdateClientInterfaceIds(mode: string, interfaceData: InterfaceDetails, areaId: string) {
    const areaData = { ...this.getArea(areaId) };
    let areaServerIds = areaData?.serverInterfaceIds || [];
    if (mode === 'add' || mode === 'update') {
      areaData.serverInterfaceIds = getUniqueInterfaceByAcId(areaServerIds, interfaceData?.interfaceId) || [];
    } else {
      areaServerIds = [...areaServerIds];
      const index = areaServerIds.findIndex(inf => inf.interfaceId === interfaceData.interfaceId.interfaceId);
      if (index > -1) {
        areaServerIds.splice(index, 1);
        areaData.serverInterfaceIds = areaServerIds || [];
      }
    }
    this.updateArea(areaId, areaData);
  }

  /**
   * returns the client interface details based on the area id
   * @param areaID
   * @param interfaceId
   * @returns
   */
  getClientInterfaceIdDetailsById(areaID: string, interfaceId: string): ISidePanel {
    const areaDetails = { ...this.getArea(areaID) };
    return projectDataUtility.getClientInterfaceIdDetailsById(areaDetails, interfaceId);
  }

  /**
   * returns the server interface details based on the area id
   * @param areaID
   * @param interfaceID
   * @returns
   */
  getServerInterfaceIdDetailsById(areaID: string, interfaceID: string): ISidePanel {
    const areaDetails = { ...this.getArea(areaID) };
    return projectDataUtility.getServerInterfaceIdDetailsById(areaDetails, interfaceID);
  }

  /**
   * Function to remove interface ids from area
   * @param areaId
   * @param interfaceIdToRemove
   * @param type
   * @returns
   */
  removeInterfaceIdsFromArea(areaId: string, interfaceIdToRemove: ISidePanel, type = InterfaceCategory.CLIENT) {
    const area = this.getArea(areaId);
    let interfaceIds: ISidePanel[];
    let exposedSidePanel: ISidePanel;
    if (type === InterfaceCategory.SERVER && area?.serverInterfaceIds) {
      interfaceIds = [...area.serverInterfaceIds];
      exposedSidePanel = this.getExposedSidePanelId(interfaceIds, interfaceIdToRemove);
      area.serverInterfaceIds = this.updateRemoveSidePanelIds(interfaceIds, interfaceIdToRemove);
    }
    if (type === InterfaceCategory.CLIENT && area?.clientInterfaceIds) {
      interfaceIds = [...area?.clientInterfaceIds];
      exposedSidePanel = this.getExposedSidePanelId(interfaceIds, interfaceIdToRemove);
      area.clientInterfaceIds = this.updateRemoveSidePanelIds(interfaceIds, interfaceIdToRemove);
    }
    this.updateArea(area.id, area);
    return exposedSidePanel;
  }

  /**
   * Updates interface ids after deleting
   * @param interfaceIds
   * @param interfaceIdToRemove
   * @returns
   */
  updateRemoveSidePanelIds(interfaceIds: ISidePanel[], interfaceIdToRemove: ISidePanel) {
    const index = interfaceIds?.findIndex(item =>
      this.checkeCondition(item, interfaceIdToRemove));
    if (index > -1) {
      interfaceIds?.splice(index, 1);
    }
    return interfaceIds;
  }

  /**
   * Returns the exposed side panel id
   * @param interfaceIds
   * @param interfaceIdToRemove
   * @returns
   */
  getExposedSidePanelId(interfaceIds: ISidePanel[], interfaceIdToRemove: ISidePanel) {
    return interfaceIds?.find(item => this.checkeCondition(item, interfaceIdToRemove));
  }

  /**
   * Checks the condition of interface id to remove
   * @param item
   * @param interfaceIdToRemove
   * @returns
   */
  checkeCondition(item, interfaceIdToRemove) {
    return item.interfaceId === interfaceIdToRemove?.interfaceId && item.automationComponentId === interfaceIdToRemove?.automationComponentId
      && item.deviceId === interfaceIdToRemove?.deviceId;
  }

  /**
   * returns scan settings data
   * @returns
   */
  getScanSettingsData(): DeviceScanSettings {
    return projectDataUtility.getScanSettingsData(this.projectData);
  }

  /**
   * Add or update device scan settings
   * @param data
   */
  addOrUpdateDeviceScanSettings(data: DeviceScanSettings) {
    this.projectData.scanSettings = data;
  }

  /**
   * Returns the nodes present in root
   * @param id
   * @param nodesPresentInRoot
   * @returns
   */
  getParentByAcId(id, nodesPresentInRoot) {
    return nodesPresentInRoot.find(node => node.id === id);
  }

  /**
   * Function to map interface details
   * @param automationComponent
   * @param _node
   * @param interfaceDetails
   * @param type
   * @param isClient
   * @param nodesPresentInRoot
   * @returns
   */
  mapInterfaceDetails(automationComponent, _node, interfaceDetails, type, isClient, nodesPresentInRoot) {
    if (interfaceDetails.length > 0) {
      const { address, deviceId, deviceName, id: automationComponentId, name } = automationComponent;
      const { name: interfaceName, id: interfaceId } = interfaceDetails && interfaceDetails[0];
      const { parent } = this.getParentByAcId(automationComponentId, nodesPresentInRoot);
      return {
        address, deviceId, deviceName, automationComponentId, name, parent, type, interfaceName, interfaceId,
        isClientInterface: isClient
      };
    }
    return {};

  }

  /**
   * Function is used to search the matching interface for AC
   * @param automationComponent
   * @param isClient
   * @param type
   * @param node
   * @param nodesPresentInRoot
   * @returns
   */
  searchCompatibleInterfaceInAutomationComponent(automationComponent, isClient: boolean, type, node, nodesPresentInRoot) {
    const matchingInterfaceInAutomation = [];
    automationComponent.forEach(ac => {
      const { clientInterfaces, serverInterfaces } = ac;
      if (isClient) {
        const matchingInterfaces = serverInterfaces.filter(serverInterface => serverInterface.type === type);
        if (matchingInterfaces.length > 0) {
          matchingInterfaceInAutomation.push(this.mapInterfaceDetails(ac, node, matchingInterfaces, type, false, nodesPresentInRoot));
        }
      } else {
        const matchingInterfaces = clientInterfaces.filter(clientInterface => clientInterface.type === type);
        if (matchingInterfaces.length > 0) {
          matchingInterfaceInAutomation.push(this.mapInterfaceDetails(ac, node, matchingInterfaces, type, true, nodesPresentInRoot));
        }
      }
    });
    return matchingInterfaceInAutomation;
  }

  /**
   * Returns the compatible interface for AC
   * @param type
   * @param isClient
   * @returns
   */
  getCompatibleInterface(type: string, isClient: boolean) {
    const { tree: { devices } } = this.projectData;
    const { editor: { nodes } } = this.projectData;

    let matchingInterfaces = [];
    const nodesPresentInRoot = nodes;
    nodesPresentInRoot.forEach((node, _i) => {
      const nodeDetails = devices.find(device => device.uid === node.deviceId);
      if (nodeDetails) {
        matchingInterfaces = [...matchingInterfaces,
        ...this.searchCompatibleInterfaceInAutomationComponent(nodeDetails.automationComponents, isClient, type, node, nodesPresentInRoot)
        ];
      }
    });
    matchingInterfaces= this.getUniqueInterfaces(this.isMatchingInterfacesConnected(matchingInterfaces, type));
    return matchingInterfaces;
  }

  /**
   * @description get unique Interface by checking if the interface is unique
   * @param interfaces
   * @returns
   */
  private getUniqueInterfaces(interfaces: MatchingConnectionInterface[]) {
    return interfaces.filter(
      (interfaceValue, i, originalInterface) =>
        originalInterface.findIndex(
          v2 => v2.automationComponentId === interfaceValue.automationComponentId
        ) === i
    );
  }

  /**
   * Checks if the matching interface is connected already
   * @param matchingInterfacesList
   * @param type
   * @returns
   */
  private isMatchingInterfacesConnected(matchingInterfacesList, type) {
    const matchingInterfaces = [...matchingInterfacesList];
    const interfaceConnected = [];
    const { editor: { connections } } = this.projectData;
    if (connections && matchingInterfaces) {
      matchingInterfaces.forEach(matchingInterface => {
        connections.forEach(connection => {
          const connectionDetails: ConnectionDetails = getConnectionDetails(connection);
          const isMatchingInterfaceConnected =
            matchingInterface.interfaceId ===
            connectionDetails.clientInterfaceId ||
            matchingInterface.interfaceId ===
            connectionDetails.serverInterfaceId;
          if (
            (matchingInterface.automationComponentId ===
              connectionDetails.clientACId ||
              matchingInterface.automationComponentId ===
              connectionDetails.serverACId) &&
            type === connectionDetails.interfaceType &&
            isMatchingInterfaceConnected
          ) {
            interfaceConnected.push(matchingInterface);
          }
        });
      });
      return matchingInterfacesList.filter(o => !interfaceConnected.some(v => v.automationComponentId === o.automationComponentId));
    }
    return matchingInterfaces;
  }

  /**
   * Returns the compatible interface based on type
   * @param type
   * @param isClient
   * @returns
   */
  getCompatibleInterfaceByType(type, isClient: boolean) {
    const compatibleInterfaceFromRoot = this.getCompatibleInterface(type, isClient);
    return { compatibleInterfaceFromRoot };
  }


  /**
   *
   *
   * @param {string} type automation type
   * @param {boolean} isClient is clicked anchor is client
   * @param {string} clickedAnchorDeviceId - clicked anchor device Id
   * @return all matching interface for connection search based on clicked anchor ac id
   * @memberof ProjectDataService
   */
  getMappedCompatibleInterfaceByType(type: string, isClient: boolean, clickedAnchorDeviceId: string) {
    const { compatibleInterfaceFromRoot } = this.getCompatibleInterfaceByType(
      type,
      isClient
    );
    let matchingInterfaceFromRoot = this.mapConnectionDetailsForRoot(
      compatibleInterfaceFromRoot
    );
    matchingInterfaceFromRoot = matchingInterfaceFromRoot.filter(matchingInterface => matchingInterface.deviceId !== clickedAnchorDeviceId);
    return [...matchingInterfaceFromRoot];
  }

  /**
   * Map panel data for interface monitoring
   * @param deviceDetails
   * @param interfaceType
   * @param deviceState
   * @param type
   * @returns
   */
  mapPanelDataForInterfaceMonitoring(deviceDetails, interfaceType: InterfaceCategory, deviceState: string, type: FillingLineNodeType) {
    const deviceName = getAutomationComponentNameFromId(deviceDetails.automationComponentId);
    const deviceDetailsFromTree = this.getProjectTreeDevices().find(device => device.uid === deviceDetails.deviceId);
    return {
      adapterType: deviceDetailsFromTree?.adapterType, automationComponent: deviceName, deviceId: deviceDetails.deviceId,
      deviceState: deviceState, id: deviceDetails.id, interfaceType: interfaceType, name: deviceDetails.name,
      properties: deviceDetails.properties as Array<PropertiesType>, deviceName, type
    };
  }

  /**
   * Map connection details for root
   * @param interfacesFromRoot
   * @returns
   */
  private mapConnectionDetailsForRoot(interfacesFromRoot) {
    const matchingInterfaces = [];
    interfacesFromRoot.forEach(interfaceMatched => {
      if (interfaceMatched) {
        const { deviceId, parent, automationComponentId, name: automationComponentName, type, interfaceName,
          isClientInterface: isClientInterface, interfaceId } = interfaceMatched;
        const projectName = this.getProjectName();
        const hoverDisplayName = `${projectName}> ${automationComponentName} > ${interfaceMatched.interfaceName}`;
        const displayName = `${automationComponentName} [${interfaceMatched.interfaceName}]`;
        matchingInterfaces.push({
          isSelected: false, hideCheckBox: false, hoverDisplayName, displayName, automationComponentId,
          automationComponentName, deviceId, interfaceName, isClientInterface, parent, type, interfaceId
        });
      }
    });
    return matchingInterfaces;
  }

  /**
   * Removes the sub connectors by using node id
   * @param nodeId
   */
  removeSubConnectorsByNodeID(nodeId: string) {
    const projectData = { ...this.getProjectData() };
    if (projectData && projectData.editor && projectData.editor.subConnections && projectData.editor.subConnections.length) {
      const subConnections = [...projectData?.editor?.subConnections];
      const filteredSubconnectionlist = subConnections.filter(connection => connection.acId !== nodeId);
      projectData.editor.subConnections = filteredSubconnectionlist;
      this.setProjectData(projectData);
    }
  }

  /**
   * Deletes all node related connections
   * @param nodeId
   */
  deleteNodeConnections(nodeId: string) {
    const projectData = this.getProjectData();
    if (projectData && projectData.editor && projectData.editor.connections) {
      const deviceConnectionList = projectData?.editor?.connections || [];
      const filteredDeviceConnectionList = deviceConnectionList.filter(connection => !connection.id.includes(nodeId) && !connection.acIds.includes(nodeId));
      projectData.editor.connections = filteredDeviceConnectionList;
      this.setProjectData(projectData);
    }
  }

  /**
   * Deletes all node related sub connections
   * @param interfaceType
   * @param interfaceId
   */
  deleteNodeConnectionsOfSubConnection(interfaceType: string, interfaceId: string) {
    const projectData = this.getProjectData();
    if (projectData && projectData.editor && projectData.editor.connections) {
      const connectionList = projectData?.editor?.connections || [];
      const filteredConnectionList = connectionList.filter(
        connection =>
          connection.id.includes(interfaceType) &&
          (connection.in.includes(interfaceId) ||
            connection.out.includes(interfaceId))
      );
      for (const con of filteredConnectionList) {
        const conIndex = projectData.editor.connections.findIndex(connection => connection.id === con.id);
        projectData.editor.connections.splice(conIndex, 1);
      }
      this.setProjectData(projectData);
    }
  }

  /**
   * Checks if project has read access
   * @param access
   */
  setHaveReadAccess(access: boolean) {
    this._haveReadAccess = access;
  }

  /**
   *  sets the access type for project
   * @param access
   */
  setAccessType(access: AccessType) {
    this._accessDetails = access;
  }

  /**
   *  Checks if project has read access
   */
  get haveReadAccess() {
    return this._haveReadAccess;
  }

  /**
   * sets the access type for project
   */
  get accessType() {
    return this._accessDetails;
  }

  /**
   * Update the isProtected flag of the project
   * @param value
   */
  updateProtectionToProject(value: boolean) {
    this.projectData.project.isProtected = value;
    this.setProjectData(this.projectData);
  }

  /**
   * Returns the device address by using the id
   * @param id
   * @returns
   */
  getDeviceAddress(id: string) {
    return this.getDevice(id)?.address || null;
  }

  /**
   * Checks if the current project is protected
   * @returns
   */
  isCurrentProjectProtected() {
    return this.projectData.project.isProtected;
  }

  /**
   *
   * @param acId //automation componentID
   * return the device which is having particular acid
   */
  getDeviceByAcID(acId: string) {
    const devices: Device[] = this.projectData.tree.devices || [];
    return devices.find(deviceData => deviceData.automationComponents.find(ac => ac.id.includes(acId)));
  }

  /**
    * filter interfaces based on interfaceID from area
    * and returns corresponding details
    * @param {string} interfaceId
    * @param {boolean} isClient
    * @return {*}
    * @memberof ProjectDataService
    */
  getInterfaceSidePanelById(interfaceId: string, isClient: boolean) {
    const areasList = this.getAllAreas();
    return areasList.map(area => {
      if (isClient) {
        return area.clientInterfaceIds.find(data => data.interfaceId === interfaceId);
      } else {
        return area.serverInterfaceIds.find(data => data.interfaceId === interfaceId);
      }
    }).filter(Boolean);
  }

  /**
 *
 * @param deviceID


  /**
   *
   * This function is used to fix the scenario when the device imported with node-set file is different
   * with IP address of the PLC ,existing connection
   * and sub-connection should be deleted
   *
   * Steps:
   * get all connections
   * get updated device details by device UID
   * get connection matching with device ID
   * get interface type from connection id
   * check filtered connection by deviceId is matching with the same type exists in update device
   * if it is not matching delete the connection and sub-connections associated with it
   * @param {string} deviceID
   * @memberof ProjectDataService
   */

  deleteConnectionIfNotMatching(deviceID: string) {
    const connectionList = this.getAllConnections();
    const device = this.getDevice(deviceID);
    if (connectionList) {
      const connectionMatchingList = this.getMatchingConnectionWithDeviceUID(connectionList, device);
      const { existingClientInterfaces, existingServerInterfaces } = this.getExistingInterfaceDetailsByDeviceId(device.uid);

      if (connectionMatchingList.length) {
        connectionMatchingList.forEach(connection => {
          const connectionType = connection.id.split('__')[Numeric.TWO];
          const isUnmatchedTypExists = this.getUnLinkedInterfaces(connection, existingClientInterfaces, existingServerInterfaces, connectionType);
          if (isNullOrEmpty(isUnmatchedTypExists)) {
            this.deleteConnection(connection);
            const InterfaceSidePanelDetails = this.getSubConnectionsByCategoryAndInterfaceType(connectionType, connection.isClient) || [];
            InterfaceSidePanelDetails.forEach(subConnection => {
              const subConnections = this.getInterfaceSidePanelById(subConnection.data.split('__')[Numeric.TWO], connection.isClient);
              subConnections.forEach(exposedConnection =>
                this.facadeService.subConnectorService.removeInterfaceAndSubConnectionByType(
                  subConnection.areaId,
                  exposedConnection,
                  connection.isClient
                )
              );
            });
          }
        });
      }
    }
  }


  /**
   *
   * check if any client/server Interface exists without
   * any matching type with the device UID
   *
   * @private
   * @param {(Connection & { isClient: boolean; })} connection
   * @param {ClientInterface[]} existingClientInterfaces
   * @param {string} connectionType
   * @param {OpcInterface[]} existingServerInterfaces
   * @return {  {(ClientInterface[] | OpcInterface[])} } isUnmatchedTypExists
   * @memberof ProjectDataService
   */
  private getUnLinkedInterfaces(
    connection: Connection & { isClient: boolean; },
    existingClientInterfaces: ClientInterface[],
    existingServerInterfaces: OpcInterface[],
    connectionType: string,
  ): ClientInterface[] | OpcInterface[] {
    let isUnmatchedTypExists;
    if (connection.isClient) {
      isUnmatchedTypExists = existingClientInterfaces.filter(
        clientInterface => clientInterface.type === connectionType
      );
    } else {
      isUnmatchedTypExists = existingServerInterfaces.filter(
        serverInterface => serverInterface.type === connectionType
      );
    }
    return isUnmatchedTypExists;
  }


  /**
   *
   *
   * @private
   * @param {Connection[]} connectionList
   * @param {Device} device
   * @return {*}
   * @memberof ProjectDataService
   */
  private getMatchingConnectionWithDeviceUID(connectionList: Connection[], device: Device) {
    return connectionList.filter(
      connection => connection.in.includes(device.uid) ||
        connection.out.includes(device.uid)
    ).map(connection => {
      let isClient = false;
      let acId = connection.acIds.split('__')[0];
      if (connection.in.includes(device.uid)) {
        acId = connection.acIds.split('__')[1];
        isClient = true;
      }
      return {
        ...connection,
        isClient,
        acId
      };
    });
  }

  /**
   *
   *
   * @param {string} deviceId
   * @return {*}
   * @memberof ProjectDataService
   */
  getExistingInterfaceDetailsByDeviceId(deviceId: string) {
    const existingDeviceDetails = this.getDevice(deviceId);
    if (existingDeviceDetails && existingDeviceDetails.automationComponents) {
      const existingAutomationComponents = existingDeviceDetails.automationComponents;
      let existingClientInterfaces = [], existingServerInterfaces = [];
      for (const automationComponent of existingAutomationComponents) {
        existingClientInterfaces = [...existingClientInterfaces, ...automationComponent.clientInterfaces];
        existingServerInterfaces = [...existingServerInterfaces, ...automationComponent.serverInterfaces];
      }
      return { existingClientInterfaces, existingServerInterfaces };
    }
    return {};
  }

  /**
   * Get client interface type based on deviceId , acID and interfaceID
   * @param deviceId 
   * @param acId 
   * @param interfaceId 
   */
  getClientInterfaceByInterfaceId(deviceId:string, acId:string, interfaceId:string) {
    return this.getAutomationComponent(deviceId, acId)?.clientInterfaces?.find(item => item.id === interfaceId);
  }
}



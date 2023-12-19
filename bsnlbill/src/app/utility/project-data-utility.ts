/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { DeviceState } from "../enum/enum";
import { Connection, SubConnection } from "../models/connection.interface";
import { Editor, HTMLNodeConnector, ProjectData, Tree } from "../models/models";
import { AutomationComponent, ClientInterface, Device } from "../models/targetmodel.interface";
import { FillingNode } from "../store/filling-line/filling-line.reducer";

/**
 *
 * @param projectData
 * @param device
 * @returns
 */
export const setDevice = (projectData : ProjectData,device : Device) =>{
    const index = projectData.tree.devices.findIndex(d => d.uid === device.uid);
    if (index !== -1) {
      projectData.tree.devices[index] = device;
    }else {
      projectData.tree.devices.push(device);
    }
    return projectData;
}
/**
 *
 * @param projectData
 * @returns
 */
export const getProjectTree = (projectData : ProjectData) =>{
    if (projectData && projectData.tree) {
        return projectData.tree;
      }else {
        return null;
      }
}
/**
 *
 * @param projectTreeData
 * @returns
 */
export const getProjectTreeDevices = (projectTreeData : Tree) => {
    if (projectTreeData !==null && projectTreeData.devices) {
        if(projectTreeData && projectTreeData.devices){
          return projectTreeData.devices;
        }
      }
      return [];
}
/**
 *
 * @param projectData
 * @returns
 */
export const getEditorData = (projectData : ProjectData) => {
    if (projectData && projectData.editor) {
        return projectData.editor;
      }else {
        return null;
      }
}
/**
 *
 * @param projectData
 * @returns
 */
export const getProjectMetaData = (projectData : ProjectData) => {
    if (projectData && projectData.project) {
        return projectData.project;
      }else {
        return null;
      }
}
/**
 *
 * @param projectData
 * @returns
 */
export const getAllNodes = (projectData : ProjectData) => {
    if (projectData && projectData.editor && projectData.editor.nodes && projectData.editor.nodes.length > 0) {
        return projectData.editor.nodes;
      }else {
        return null;
      }
}
/**
 *
 * @param projectData
 * @param nodeId
 * @returns
 */
export const getNodeByID = (projectData : ProjectData,nodeId : string) => {
    let nodes;
    if(projectData && projectData.editor && projectData.editor.nodes){
        nodes = projectData.editor.nodes.find(node=>node.id === nodeId);
      }
    return nodes;
}

export const getNodeByAddress = (projectData : ProjectData,address : string) => {
  let nodes;
  if(projectData && projectData.editor && projectData.editor.nodes){
      nodes = projectData.editor.nodes.filter(node=>node.address === address);
    }
  return nodes;
}

/**
 *
 * @param projectData
 * @returns
 */
export const getAllAreas = (projectData : ProjectData) => {
    if (projectData && projectData.editor && projectData.editor.areas && projectData.editor.areas.length > 0) {
        return projectData.editor.areas;
      }
      else {
        return null;
      }
}
/**
 *
 * @param projectData
 * @returns
 */
export const getProjectName = (projectData : ProjectData) => {
    let name;
    if(projectData && projectData.project && projectData.project.name){
        name =  projectData.project.name;
      }
      return name;
}

/**
 *
 * @param projectData
 * @returns
 */
export const  getProjectId = (projectData : ProjectData) => {
    let id:string;
    if(projectData && projectData.project && projectData.project.id){
        id =  projectData.project.id;
      }
      return id;
}

/**
 *
 * @param projectData
 * @returns
 */
export const getDevices = (projectData : ProjectData) => {
    let devices;
    if(projectData && projectData.tree && projectData.tree.devices){
      devices =  projectData.tree.devices;
    }
    return devices;
}

/**
 *
 * @param acComp
 * @returns
 */
export const getAutomationComponentByName = (acComp,name) => {
    let ac;
    if(acComp.length> 0){
      ac = acComp.find(comp => comp.name === name);
    }
    return ac;
}
/**
 *
 * @param automationComponentId
 * @param interfaceId
 * @param device
 * @returns
 */
export const getConnectionEndPointDetails = (automationComponentId : string,interfaceId : string ,device: Device) => {
    const automationComp: AutomationComponent = device.automationComponents.find(item => item.id === automationComponentId);
    const clientInterface: ClientInterface = automationComp?.clientInterfaces.find(item => item.id === interfaceId);
    if (clientInterface) {
      return clientInterface.connectionEndPointDetails;
    }else {
      return null;
    }
}
/**
 *
 * @param acID
 * @param deviceDetails
 * @returns
 */
export const findIfAnyDeviceOfflineFromConnectionAcID = (acID: string, deviceDetails: Device[]) => {
  const deviceIdList = acID.split('__');
      const extractedDeviceList = deviceIdList.map(device => device.split('_')[0]);
      const mappedDeviceDetails = extractedDeviceList.map(deviceId =>
        deviceDetails.find(devDetails => devDetails.uid === deviceId)).filter(item => item !== undefined);
      const isAnyDeviceOffline = mappedDeviceDetails.find(deviceDetail => deviceDetail.state === DeviceState.UNAVAILABLE);
      return isAnyDeviceOffline || [];
}
/**
 *
 * @param projectData
 * @param id
 * @returns
 */
export const getConnectionListByNodeId = (projectData : ProjectData,id:string) =>{
  let connections;
  if(projectData && projectData.editor &&  projectData.editor.connections){
    connections = projectData.editor.connections.filter(connection => connection.id.includes(id) || connection.acIds.includes(id) );
  }
  return connections;
}
/**
 *
 * @param projectData
 * @param fillingNode
 * @returns
 */
export const updateNode = (projectData: ProjectData,fillingNode:FillingNode) => {
  let project;
  if (projectData) {
    let nodeIndex = -1;
    if (!projectData.editor || !projectData.editor.nodes) {
      projectData.editor.connections = [];
      projectData.editor = {} as Editor;
      projectData.editor.nodes = [];
    }else {
      nodeIndex = projectData.editor.nodes.findIndex(node => node.id === fillingNode.id);
    }
    if (nodeIndex !== -1) {
      const editorNode = {
        id: fillingNode.id,
        x: fillingNode.x,
        y: fillingNode.y,
        address: fillingNode.address,
        selected: fillingNode.selected,
        parent: fillingNode.parent,
        deviceId: fillingNode.deviceId
      };
      projectData.editor.nodes[nodeIndex] = editorNode;
    }
    project =  projectData;
  }
  return project;
}
/**
 *
 * @param projectData
 * @param connection
 * @returns
 */
export const addConnection = (projectData: ProjectData,connection:Connection) => {
  if (projectData && connection) {
    let connectionIndex = -1;
    if (!projectData.editor || !projectData.editor.nodes) {
      projectData.editor = {} as Editor;
      projectData.editor.nodes = [];
      projectData.editor.connections = [];
    }else if (!projectData.editor.connections) {
      projectData.editor.connections = [];

    }else {
      connectionIndex = projectData.editor.connections.findIndex(con => con.id === connection.id );
    }
    if (connectionIndex === -1) {
      projectData.editor.connections.push(connection);
    }
  }
  return projectData;
}
/**
 *
 * @param subConnectionByAcId
 * @param subConnectorLookup
 * @returns
 */
export const checkIfSubConnectionMatchingWithLookup = (subConnectionByAcId: SubConnection, subConnectorLookup: HTMLNodeConnector) => {
  if (subConnectionByAcId && subConnectorLookup && Object.keys(subConnectorLookup).includes(subConnectionByAcId.id)) {
    return subConnectionByAcId;
  }
  return null;
}
/**
 *
 * @param projectData
 * @returns
 */
export const getAllConnections = (projectData : ProjectData) => {
    if (projectData && projectData.editor) {
      return projectData.editor.connections;
    }
    return null;
}
/**
 *
 * @param projectData
 * @param id
 * @returns
 */
export const getConnection = (projectData:ProjectData,id:string) => {
  if (projectData && projectData.editor && projectData.editor.connections && projectData.editor.connections.length) {
    return projectData.editor.connections.find(con => con.id === id);
  }
  return null;
}
/**
 *
 * @param projectData
 * @param acId
 * @returns
 */
export const getConnectionByAcID = (projectData :ProjectData,acId:string) => {
  if (projectData && projectData.editor && projectData.editor.connections && projectData.editor.connections.length) {
    return projectData.editor.connections.filter(con => con.acIds.includes(acId));
  }
  return [];
}
//Get connection object using interfaceID and Ac ID
export const getConnectionByAcIdAndInterfaceId = (projectData: ProjectData, acId: string, interfaceId: string) => {
  let connectionByAcId: Connection;
  if (projectData && projectData.editor && projectData.editor.connections && projectData.editor.connections.length) {
    connectionByAcId = projectData.editor.connections.find(conn => conn.acIds.includes(acId) && (conn.in.includes(interfaceId) || conn.out.includes(interfaceId)));
  }
  return connectionByAcId;
}

/**
 *
 * @param projectData
 * @param areaId
 * @returns
 */
export const getAreaConnection = (projectData : ProjectData,areaId: string) => {
  if (projectData && projectData.editor && projectData.editor.connections?.length) {
    return projectData.editor.connections.filter(con => con.areaId === areaId);
  }
  return null;
}
/**
 *
 * @param projectData
 * @param areaId
 * @returns
 */
export const getAreaAllConnections = (projectData : ProjectData,areaId : string) => {
  if (projectData && projectData.editor && projectData.editor.connections) {
    return projectData.editor.connections.filter(con => con.areaId===areaId);
  }
  return null;
}
/**
 *
 * @param projectData
 * @returns
 */
export const getAllSubConnections = (projectData: ProjectData) => {
  if (projectData && projectData.editor) {
    return projectData.editor.subConnections || [];
  }
  return null;
}

/**
 *
 * @param projectData
 * @param connectionId
 * @returns
 */
export const getAllAssociatedSubConnections = (projectData : ProjectData,connectionId: string) => {
  if (projectData && projectData.editor && projectData.editor.subConnections) {
    return projectData.editor.subConnections.filter(con => con.connectionId === connectionId);
  }
  return null;
}
/**
 *
 * @param projectData
 * @param areaId
 * @returns
 */
export const getAreaSubConnections = (projectData : ProjectData,areaId: string) => {
    if (projectData && projectData.editor) {
      return projectData.editor.subConnections?.filter(con => con.areaId === areaId);
    }
    return null;
}
/**
 *
 * @param projectData
 * @param areaId
 * @param isClient
 * @returns
 */
export const getAreaSubConnectionsByCategory = (projectData: ProjectData,areaId:string,isClient:boolean) => {
  if (projectData && projectData.editor) {
    return projectData.editor.subConnections?.filter(con => con.areaId === areaId && con.isclient === isClient);
  }
  return null;
}
/**
 *
 * @param projectData
 * @param interfaceType
 * @param isClient
 * @returns
 */
export const getSubConnectionsByCategoryAndInterfaceType = (projectData : ProjectData,interfaceType:string,isClient:boolean) => {
  if (projectData && projectData.editor && projectData.editor.subConnections && projectData.editor.subConnections.length>0) {
    return projectData.editor.subConnections.filter(con => con.id.includes(interfaceType) && con.isclient === isClient);
  }
  return null;
}
/**
 *
 * @param projectData
 * @param id
 * @returns
 */
export const getArea = (projectData : ProjectData,id:string) => {
  if (projectData && projectData.editor && projectData.editor.areas && projectData.editor.areas.length > 0) {
    return projectData.editor.areas.find(area => area.id === id);
  }else {
    return null;
  }
}
/**
 *
 * @param projectData
 * @param id
 * @returns
 */
export const getAreaByParent = (projectData: ProjectData,id:string) => {
  if (projectData && projectData.editor && projectData.editor.areas && projectData.editor.areas.length > 0) {
    return projectData.editor.areas.filter(area => area.parent === id);
  }else {
    return null;
  }
}
/**
 *
 * @param projectData
 * @param deviceId
 * @returns
 */
export const getAdapterType =  (projectData: ProjectData,deviceId: string) => {
  let adapterType;
    if (projectData && projectData.tree && projectData.tree.devices && projectData.tree.devices.length > 0) {
      const device=projectData.tree.devices.find(acdevice=>acdevice.uid=== deviceId);
      if(device)
      {
        adapterType =  device.adapterType;
      }
    }
    return adapterType;
}
/**
 *
 * @param areaDetails
 * @param interfaceId
 * @returns
 */
export const  getClientInterfaceIdDetailsById = (areaDetails,interfaceId) => {
  if (areaDetails) {
    return areaDetails.clientInterfaceIds.find(
      interfaceData => interfaceData.interfaceId === interfaceId
    );
  }
  return null;
}
/**
 *
 * @param areaDetails
 * @param interfaceID
 * @returns
 */
export const getServerInterfaceIdDetailsById = (areaDetails,interfaceID) => {
  if (areaDetails) {
    return areaDetails.serverInterfaceIds.find(
      interfaceData => interfaceData.interfaceId === interfaceID
    );
  }
  return null;
}
/**
 *
 * @param projectData
 * @returns
 */
export const getScanSettingsData = (projectData : ProjectData) => {
  if (projectData && projectData.scanSettings) {
    return projectData.scanSettings;
  }
  else {
    return null;
  }
}




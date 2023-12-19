/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
// Merge Sort Implementation (Recursion)
import { TreeNode } from 'primeng/api';
import {
  AccessType,
  ConnectionAttributes,
  ConnectorCreationMode,
  ConnectorState,
  ConnectorType,
  DeviceAttributes,
  FillingLineNodeType,
  InterfaceCategory,
  NodeAnchorType,
  Numeric,
  ObjectType,
  ProjectState,
  SubConnectorCreationMode
} from '../enum/enum';
import { AreaHierarchy } from '../models/area.interface';
import {
  Connection,
  ConnectionData,
  ConnectionDetails,
  ConnectionObjectDetails,
  ConnectionRequestPayload,
  InterfaceDetails,
  SidePanelInterfaceDetails,
  SubConnection,
  SubConnectionDetails,
  SubConnectionIdList,
  SubConnectionPayload
 } from '../models/connection.interface';

import { Area, ConfiguredConnectionObj, Node, ProposeConnectionObj } from '../models/models';
import { MonitorNode, MonitorPayload } from '../models/monitor.interface';
import { AreaClientInterface, AreaInterface, Device, DeviceConfig, ISidePanel, Properties, RelatedEndPointInterface } from '../models/targetmodel.interface';
import { PlantArea } from '../opcua/opcnodes/area';
import { Connector } from '../opcua/opcnodes/connector';
import { NodeAnchor } from '../opcua/opcnodes/node-anchor';
import { OPCNode } from '../opcua/opcnodes/opcnode';
import { SubConnector } from '../opcua/opcnodes/subConnector';
import { ProjectDataService } from '../shared/services/dataservice/project-data.service';
import { CONNECTION, CONNECTIONLISTROWID, ROOT_EDITOR, TAG } from '../utility/constant';

/*
* sort param
*/
export const sortParam = {
  p: ''
};
/*
* console log statement
*/
export const log = (...data) => {
  console.log(data); //NOSONAR
};
/*
* merge sort
*/
export function mergeSort(unsortedArray) {
  /*
  *No need to sort the array if the array only has one element or empty
  */
  if (unsortedArray.length <= 1) {
    return unsortedArray;
  }
  // In order to divide the array in half, we need to figure out the middle
  const middle = Math.floor(unsortedArray.length / Numeric.TWO);

  // This is where we will be dividing the array into left and right
  const left = unsortedArray.slice(0, middle);
  const right = unsortedArray.slice(middle);

  // Using recursion to combine the left and right
  return merge(
    mergeSort(left), mergeSort(right)
  );
}

/*
*Merge the two arrays: left and right
*/
function merge(left, right) {
  const resultArray = [];
  let leftIndex = 0, rightIndex = 0;

  // We will concatenate values into the resultArray in order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex][sortParam.p] < right[rightIndex][sortParam.p]) {
      resultArray.push(left[leftIndex]);
      // move left array cursor
      leftIndex++;
    } else {
      resultArray.push(right[rightIndex]);
      // move right array cursor
      rightIndex++;
    }
  }

  // We need to concat here because there will be one element remaining
  // from either left OR the right
  return resultArray
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}
/*
* REturns true if the value is null or empty
*/
export const isNullOrEmpty = (value: Object | string) => {
  let result = false;
  result = value === undefined || value === null;
  if (!result) {
    const condObjectCheck = typeof value === ObjectType.OBJECT && Object.keys(value).length === 0;
    const condStringCheck = typeof value === ObjectType.STRING && value.toString().trim().length === 0;
    result = condObjectCheck || condStringCheck;
  }
  return result;
};
/*
* Returns true if the value is null or undefined
*/
export const isNullOrUnDefined = (value: Object) => (value === undefined || value === null);
/*
* Returns true if the object is empty
*/
export const isEmpty = obj => {
  if (obj == null) {
    return true;
  } else {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
};
/*
* Returns the connection data
*/
export const getConnectionData = (connector: Connector, projectId: string): ConnectionRequestPayload => {
  let data: ConnectionRequestPayload;
  const { deviceId: inputDeviceId, automationComponent: inputAutomationComponent, interface: inputInterface } = getConnectionNodeOrAreaInterfaceDetails(connector.inputAnchor);
  const { deviceId: outputDeviceId, automationComponent: outputAutomationComponent, interface: outputInterface } = getConnectionNodeOrAreaInterfaceDetails(connector.outputAnchor);

  if (connector && connector.inputAnchor && connector.outputAnchor) {
    data = {
      project: projectId,
      client: {
        deviceId: inputDeviceId,
        automationComponent: inputAutomationComponent,
        interface: inputInterface
      },
      server: {
        deviceId: outputDeviceId,
        automationComponent: outputAutomationComponent,
        interface: outputInterface
      }
    };
  }
  return data;
};
/*
* Returns the AC name from the id
*/
export const getAutomationComponentNameFromId = (acId: string): string => {
  const encodedAcName = acId.split('_')[1];
  return atob(encodedAcName);
};
/*
* Returns connection node or area interface details
*/
export const getConnectionNodeOrAreaInterfaceDetails = anchorDetails => {
  if (anchorDetails?.parentNode.type === FillingLineNodeType.AREA) {
    return {
      deviceId: anchorDetails.interfaceData.deviceId,
      automationComponent: getAutomationComponentNameFromId(anchorDetails.interfaceData.automationComponentId),
      interface: anchorDetails.interfaceData.name
    };
  }
  else {
    return {
      deviceId: (anchorDetails.parentNode as OPCNode).deviceId,
      automationComponent: anchorDetails.parentNode?.name,
      interface: anchorDetails.interfaceData.name
    };
  }
};
/*
* Returns connect data
*/
export const getConnectData = (inputAnchor: NodeAnchor, dataService?: ProjectDataService, outputAnchor?: NodeAnchor): ConnectionData => {
  let connectData: ConnectionData;
  if (inputAnchor) {
    connectData = {
      deviceId: (inputAnchor.parentNode as OPCNode).deviceId,
      interfaceId: inputAnchor.interfaceData.id,
      interfaceName: inputAnchor.interfaceData.name,
      automationComponent: inputAnchor?.parentNode?.name,
      automationComponentId: inputAnchor?.parentNode?.id,
      serverDeviceId: (outputAnchor?.parentNode as OPCNode)?.deviceId
    };
    if (!outputAnchor) {
      connectData.serverDeviceId = dataService.getDeviceByAddress(inputAnchor?.relatedEndPoint?.address)?.uid;
    }
    if (inputAnchor?.parentNode?.type === FillingLineNodeType.AREA) {
      connectData.areaId = connectData.automationComponentId;
      const interfaceDetails = (inputAnchor.parentNode as PlantArea).clientInterfaces.find(inf => inf.id === inputAnchor.interfaceData.id);
      connectData.deviceId = interfaceDetails.deviceId;
      connectData.automationComponent = dataService.getAutomationComponent(interfaceDetails.deviceId, interfaceDetails.automationComponentId)?.name;
      connectData.automationComponentId = interfaceDetails.automationComponentId;
    }
    if (outputAnchor?.parentNode?.type === FillingLineNodeType.AREA) {
      const interfaceDetails = (outputAnchor.parentNode as PlantArea).serverInterfaces.find(inf => inf.id === outputAnchor.interfaceData.id);
      connectData.serverDeviceId = interfaceDetails.deviceId;
    }
  }
  return connectData;
};
/*
* Returns end point data
*/
export const getRelatedEndPointData = (address:string,automationComponent:string,interfaceName:string) : RelatedEndPointInterface =>
{
  const relatedEndPoint: RelatedEndPointInterface = {} as RelatedEndPointInterface;
  relatedEndPoint.address = address;
  relatedEndPoint.automationComponent = automationComponent;
  relatedEndPoint.functionalEntity = interfaceName;
  return relatedEndPoint;
};
/*
* update sub connection list
*/
export const updateSubConnectionList = (extingSubConnetions:SubConnectionIdList,updatedSubconnectionIds:SubConnectionIdList) : SubConnectionIdList=>
{
  const subConnections: SubConnectionIdList= extingSubConnetions || { clientIds: [], serverIds: [] } as SubConnectionIdList;
  if(updatedSubconnectionIds)
  {
    if (updatedSubconnectionIds.clientIds) {
      subConnections.clientIds = subConnections?.clientIds?.concat(updatedSubconnectionIds?.clientIds || []);
    }
    if (updatedSubconnectionIds.serverIds) {
      subConnections.serverIds = subConnections?.serverIds?.concat(updatedSubconnectionIds?.serverIds || []);
    }
  }
  return subConnections;
};

/*
* Connection data from sub connector
*/
export const getConnectDataFromSubConnector = (
  subConnector: SubConnector,
  connection: Connection,
  _isClient: boolean,
  dataService: ProjectDataService
): ConnectionData => {
  const connectData: ConnectionData = {} as ConnectionData;
  if (subConnector && connection) {
    const connectionDetails: ConnectionDetails = getConnectionDetails(connection);
    connectData.deviceId = connectionDetails.clientDeviceId;
    connectData.interfaceId = connectionDetails.clientInterfaceId;
    connectData.interfaceName = dataService.getClientInterface(
      connectionDetails.clientDeviceId,
      connectionDetails.clientACId,
      connectionDetails.interfaceType
    )?.name;
    connectData.automationComponent = dataService.getAutomationComponent(
      connectionDetails.clientDeviceId,
      connectionDetails.clientACId
    )?.name;
    connectData.automationComponentId = connectionDetails.clientACId;
    connectData.serverDeviceId = connectionDetails.serverDeviceId;
    connectData.areaId = subConnector.areaId;
  }
  return connectData;
};
/*
* Returns connection object
*/
export const getConnectionObject = (connector: Connector, dataService: ProjectDataService): Connection => {
  const acIds = [];
  let input: string;
  let output: string;
  let result;
  if (connector && connector.inputAnchor && connector.outputAnchor && dataService) {
    const inputAnchorData = getConnectionNameAndAcId(connector, NodeAnchorType.INPUT, dataService);
    input = inputAnchorData.connectionName;
    acIds.push(inputAnchorData.acId || '');

    const outputAnchorData = getConnectionNameAndAcId(connector, NodeAnchorType.OUTPUT, dataService);
    output = outputAnchorData.connectionName;
    acIds.push(outputAnchorData.acId || '');
    const connection: Connection = {
      in: input,
      out: output,
      id: connector.id,
      selected: connector.isSelected,
      creationMode: connector.creationMode,
      areaId: connector.areaId,
      hasSubConnections: connector.hasSubConnections,
      acIds: acIds.join('__')
    };
    if (connector.hasSubConnections && connector.subConnectors) {
      connection.subConnections =
      {
        clientIds: connector.subConnectors?.clientIds,
        serverIds: connector.subConnectors?.serverIds
      };
    }
    result = connection;
  }
  return result;
};
/*
* Returns connection details
*/
export const getConnectionDetails = (connection:Connection) : ConnectionDetails =>
{
  let result;
  if(connection?.id && connection?.acIds && connection?.in && connection?.out)
  {
    const [clientHTMLNodeId, serverHTMLNodeId, interfaceType] = connection.id.split('__');
    const [clientACId, serverACId] = connection.acIds.split('__');
    const [clientDeviceId,,clientInterfaceId] = connection.in.split('__');
    const [serverDeviceId,,serverInterfaceId] = connection.out.split('__');
    let clientAreaId,serverAreaId;
    if(clientHTMLNodeId.includes('area_'))
    {
      clientAreaId=clientHTMLNodeId;
    }
    if(serverHTMLNodeId.includes('area_'))
    {
      serverAreaId=serverHTMLNodeId;
    }
    result = {clientDeviceId,
            serverDeviceId,
            interfaceType,
            clientACId,
            serverACId,
            clientInterfaceId,
            serverInterfaceId,
            clientAreaId,
            serverAreaId,
            clientHTMLNodeId,
            serverHTMLNodeId};
  }
  return result;
};
/*
* Returns sub connection details
*/
export const getSubConnectionDetails = (SubConnectionData: SubConnection): SubConnectionDetails =>
{
  let result;
  if(SubConnectionData && SubConnectionData.id && SubConnectionData.acId && SubConnectionData.data)
  {
    const [hTMLNodeId,interfaceType] = SubConnectionData.id.split('__');
    const [deviceId,,interfaceId] = SubConnectionData.data.split('__');
    const acId =SubConnectionData.acId;
    const { areaId } =SubConnectionData;
    result = {deviceId,
            interfaceType,
            acId,
            interfaceId,
            areaId,
            hTMLNodeId};
  }
  return result;
};
/*
* Returns interface details
*/
export const getInterfaceDetails = (connector: Connector | SubConnector, anchorType: NodeAnchorType) => {
  let interfaceDetails: AreaClientInterface | AreaInterface;
  if (connector.type === ConnectorType.SUBCONNECTOR) {
    if (!connector.isInput) {
      interfaceDetails = (connector.inputAnchor.parentNode as PlantArea).serverInterfaces.find(inf => inf.id === connector.inputAnchor.interfaceData.id);
    } else {
      interfaceDetails = (connector.outputAnchor.parentNode as PlantArea).clientInterfaces.find(inf => inf.id === connector.outputAnchor.interfaceData.id);
    }
  }
  if (connector.type === ConnectorType.CONNECTOR) {
    if (anchorType === NodeAnchorType.INPUT) {
      interfaceDetails = (connector.inputAnchor.parentNode as PlantArea).clientInterfaces.find(inf => inf.id === connector.inputAnchor.interfaceData.id);
    } else {
      interfaceDetails = (connector.outputAnchor.parentNode as PlantArea).serverInterfaces.find(inf => inf.id === connector.outputAnchor.interfaceData.id);
    }
  }
  return interfaceDetails;
};
/*
* Returns connection name and ACid
*/
export const getConnectionNameAndAcId = (connector: Connector | SubConnector, anchorType: NodeAnchorType, dataService? : ProjectDataService) => {
  let connectionName: string;
  let acId: string;
  if (connector[anchorType].parentNode.type === FillingLineNodeType.NODE) {
    connectionName = getConnectionName((connector[anchorType].parentNode as OPCNode).deviceId, connector[anchorType].parentNode.id,
    connector[anchorType].interfaceData.id);
    acId = connector[anchorType].parentNode.id;
  } else {
    const interfaceDetails = getInterfaceDetails(connector, anchorType);
    if (interfaceDetails) {
      connectionName = getConnectionName(interfaceDetails?.deviceId, connector[anchorType].parentNode.id, interfaceDetails.id);
      acId = interfaceDetails.automationComponentId;
      if (connector.type === ConnectorType.CONNECTOR) {
        (connector[anchorType].parentNode as OPCNode).address = dataService.getDevice(interfaceDetails?.deviceId)?.address;
      }
    }
  }
  return { connectionName, acId };
};
/*
* Returns sub connection object
*/
export const getSubConnectionObject = (subConnector: SubConnector): SubConnection => {
  const subConnection: SubConnection = {
    data: '',
    id: subConnector.id,
    x: subConnector.svgGlobal?.x ?? 0,
    y: subConnector.svgGlobal?.y ?? 0,
    areaId: subConnector.areaId,
    isclient: subConnector.isInput,
    creationMode: subConnector.creationMode,
    acId: '',
    connectionId: subConnector.connectionId || ''
  };
  if (!subConnector.isInput) {
    const result = getConnectionNameAndAcId(subConnector, NodeAnchorType.INPUT);
    subConnection.acId = result.acId || '';
    subConnection.data = result.connectionName || '';
  }
  else {
    const result = getConnectionNameAndAcId(subConnector, NodeAnchorType.OUTPUT);
    subConnection.acId = result.acId || '';
    subConnection.data = result.connectionName || '';
  }
  return subConnection;
};
/*
* Returns sub connection
*/
export const getSubConnection = (payload: SubConnectionPayload): SubConnection => {
  const {
    acId,
    acName,
    deviceId,
    interfaceId,
    subConnectionId: id,
    connectionId,
    areaId,
    isClientInterface: isInput,
    interfaceExposedMode: creationMode
  } = payload;
  const data: string = getConnectionName(deviceId, acName, interfaceId);
  const subConnection: SubConnection = {
    data: data,
    id: id,
    x: 0,
    y: 0,
    areaId: areaId,
    isclient: isInput,
    connectionId: connectionId,
    creationMode: creationMode,
    acId: acId
  };
  return subConnection;
};
/*
* Returns unique interface by acid
*/
export const getUniqueInterfaceByAcId = (existingInterface:ISidePanel[], newInterface:ISidePanel) =>{
  const interfacesMerged = [{...newInterface},...existingInterface];
  return interfacesMerged.filter(
    (a, i) =>
      interfacesMerged.findIndex(
        s => a.automationComponentId === s.automationComponentId && a.interfaceId === s.interfaceId
      ) === i
  );
};
/*
* Returns client interface details
*/
export const getclientInterfaceDetails = (sidePanelinterfaceDetails:SidePanelInterfaceDetails):InterfaceDetails =>
{
    return {
        interface: sidePanelinterfaceDetails.clientInterface,
        interfaceId: sidePanelinterfaceDetails.clientInterfaceId,
        type: InterfaceCategory.CLIENT
    };
};
/*
* Returns server interface details
*/
export const getserverInterfaceDetails = (sidePanelinterfaceDetails:SidePanelInterfaceDetails):InterfaceDetails =>
{
    return {
        interface: sidePanelinterfaceDetails.serverInterface,
        interfaceId: sidePanelinterfaceDetails.serverInterfaceId,
        type: InterfaceCategory.SERVER
    };
};
/*
* Returns interface exposed mode in online
*/
export const getIntefaceExposeModeInOnline = (interfaceData:AreaInterface):SubConnectorCreationMode =>{
  let internetExposeMode=SubConnectorCreationMode.ONLINE;
  if(interfaceData.interfaceExposedMode === SubConnectorCreationMode.MANUAL)
  {
    internetExposeMode=SubConnectorCreationMode.MANUALONLINE;
  }
  return internetExposeMode;
};
/*
* Genertate initial connection object
*/
export const generateInitialConnectionObject = ():Connection => {
  return {
    in: '',
    out: '',
    id: '',
    selected: false,
    creationMode: ConnectorCreationMode.MANUAL,
    areaId: ROOT_EDITOR,
    hasSubConnections: false,
    subConnections: {
        clientIds: [],
        serverIds: []
    },
    acIds: ''
  };
};
/*
* Expose interface by connection list
*/
export const exposedInterfaceByConnectionList=(interfaceId: ISidePanel[],nodeId: string):ISidePanel[]=> {
  let result: ISidePanel[] = [];
  if(interfaceId && interfaceId.length>0 && !isNullOrEmpty(nodeId))
  {
    result = interfaceId?.filter(item => item.automationComponentId === nodeId);
  }
  return result;
};
/*
* Returns connection id
*/
export const getConnectionId=(hierarchy:string[], commonParent:string, acId:string)=> {
  /*
  hierarchy.length if it is root ,
  if next element to common parent index is undefined
  */
  if (hierarchy.length === 1 || !hierarchy[hierarchy.indexOf(commonParent) + 1]) {
      return acId;
  }
  return hierarchy[hierarchy.indexOf(commonParent) + 1];
};
/*
* Find connection in and out
*/
export const findConnectionInAndOut=(areaHierarchyDetails:AreaHierarchy,sourceAcId: string, targetAcId: string)=> {
  let connectionIn = getConnectionId(areaHierarchyDetails.sourceAreaHierarchy, areaHierarchyDetails.commonParent, sourceAcId);
  let connectionOut = getConnectionId(areaHierarchyDetails.targetAreaHierarchy, areaHierarchyDetails.commonParent, targetAcId);
  // if both are in same area
  if (areaHierarchyDetails.sourceAreaHierarchy[areaHierarchyDetails.sourceAreaHierarchy.length - 1]
     === areaHierarchyDetails.targetAreaHierarchy[areaHierarchyDetails.targetAreaHierarchy.length - 1]) {
      connectionIn = sourceAcId;
      connectionOut = targetAcId;
  }
  return { connectionIn,connectionOut };
};
/*
* is root to area
*/
export const isRootToArea=(areaHierarchyDetails: AreaHierarchy):boolean=>{
  return (areaHierarchyDetails.sourceAreaHierarchy.length === 1 && areaHierarchyDetails.sourceAreaHierarchy[0] === ROOT_EDITOR)
  || (areaHierarchyDetails.targetAreaHierarchy.length === 1 && areaHierarchyDetails.targetAreaHierarchy[0] === ROOT_EDITOR);
};
/*
* get source target device
*/
export const  getSourceTargetDevice=(sourceHierarchy, targetHierarchy, sourceAcId, targetAcId, device)=> {
  /* Swapping accordingly based on target/drop-node interface type(client/server) */
  if (device.isClientInterface) {
      [sourceHierarchy, targetHierarchy] = [targetHierarchy, sourceHierarchy];
      [sourceAcId, targetAcId] = [targetAcId, sourceAcId];
  }
  return {
      sourceHierarchy,
      targetHierarchy,
      sourceAcId,
      targetAcId
  };
};
/*
* get parent
*/
export const getParent=(treeData:TreeNode[], key, data?) =>{
  let parentValue = data;
  treeData = treeData.filter(node => node.type === FillingLineNodeType.AREA);
  treeData.forEach(node => {
    let nodes;
      if (node.key === key) {
          parentValue = node;
          nodes = node;
      }
      return nodes;
  });
  treeData.forEach(node => {
      parentValue = getParent(node.children, key, parentValue);
  });
  return parentValue;
};
/*
* returns bread crumb for area
*/
export const breadcrumbForArea = (node: TreeNode) => [{ ...node }, ...(getParentLabel(node))];
/*
* Returns parent label
*/
export const getParentLabel=(node: TreeNode)=> {
  if (node.parent) {
      return breadcrumbForArea(node.parent);
  }
  return [];
};
/*
* system var
*/
export const fetchSystemVar = (array: Array<Properties>): Properties => array.find(item => item.name === ConnectionAttributes.SYSTEM);
/*
* connect
*/
export const fetchConnect = (array: Array<Properties>): Properties => array.find(item => item.name === DeviceAttributes.CONNECT);
/*
* diagnose
*/
export const fetchDiagnose = (array: Array<Properties>): Properties => array.find(item => item.name === ConnectionAttributes.DIAGNOSE);
/*
* parnter
*/
export const fetchPartner = (array: Array<Properties>): Properties => array.find(item => item.name === ConnectionAttributes.PARTNER);
/*
* disconnect
*/
export const fetchDisconnect = (array: Array<Properties>): Properties => array.find(item => item.name === DeviceAttributes.DISCONNECT);

/*
*Needs AC adaptation.Add Automation Component Name
*/
export const getConnectionName = (deviceId: string, acId: string, interfaceId: string) => `${deviceId}__${acId}__${interfaceId}`;
/*
* connectionid
*/
export const getConnectionID = (inputNodeID: string, outNodeID: string, interfaceType: string) => `${inputNodeID}__${outNodeID}__${interfaceType}`;
/*
* subconnectionid
*/
export const getSubConnectionID = (aCID: string, interfaceType: string, interfaceId: string) => `${aCID}__${interfaceType}__${interfaceId}`;
/**
   * Gets the output anchor device Id of a connector
   * @param connector
   * @returns output anchor device Id
   */
export const getOutputAnchorDeviceId = (connector: Connector): string => {
  let result = '';
  if (connector && connector.outputAnchor) {
    result = (connector.outputAnchor.parentNode as OPCNode).deviceId;
  }
  return result;
};

/*
* configured connection object
*/
export const getConfiguredConenctionOnj = (connector: Connector): ConfiguredConnectionObj => {
  return {
    connector: connector,
    fromDeviceName: connector.inputAnchor.parentNode.name,
    toDeviceName: connector.outputAnchor.parentNode.name,
    isActualConRowSelected: connector.isSelected,
    version: 'V2.4',
    interfaceType: 'machineInterfaceType',
    status: false,
    //isCreatedManually: true, // true coz again propose connections should not override
    state: ConnectorState.Default,
    serverInterfaceName: connector.outputAnchor.interfaceData.name,
    clientInterfaceName: connector.inputAnchor.interfaceData.name
  };
};
/*
* return device id if parent is root
*/
const getDeviceIdIfRoot=(parent:string, acId:string)=> {
  if (parent === ROOT_EDITOR) {
      return acId;
  }
  return parent;
};
/*
* create connection object
*/
export const createConnectionObject = (connectionObjectDetails:ConnectionObjectDetails) => {
  const connectionObj = generateInitialConnectionObject();
  connectionObj.in = getConnectionName(
    connectionObjectDetails.soureDeviceId,
    connectionObjectDetails.connectionIn,
    connectionObjectDetails.clientInterfaceId
  );
  connectionObj.out = getConnectionName(
    connectionObjectDetails.targetDeviceId,
    connectionObjectDetails.connectionOut,
    connectionObjectDetails.serverInterfaceId
  );
  connectionObj.creationMode=connectionObjectDetails.creationMode;
  connectionObj.areaId = connectionObjectDetails.commonParent;
  connectionObj.id = getConnectionID(
      getDeviceIdIfRoot(connectionObjectDetails.connectionIn, connectionObjectDetails.clientAcId),
      getDeviceIdIfRoot(connectionObjectDetails.connectionOut, connectionObjectDetails.serverAcId),
      connectionObjectDetails.type
  );
  connectionObj.acIds = `${connectionObjectDetails.clientAcId}__${connectionObjectDetails.serverAcId}`;
  connectionObj.subConnections = connectionObjectDetails.subConnection;
  let subConnection = false;
  if(connectionObjectDetails?.subConnection?.clientIds?.length > 0  || connectionObjectDetails?.subConnection?.serverIds?.length > 0 ){
    subConnection =  true;
  }
  connectionObj.hasSubConnections = subConnection;
  return connectionObj;
};

export const getEventNamesFromMonitorMaps = (monitorItemsMap: Map<string, MonitorPayload>): Array<string> => {
  const events: string[] = [];
  monitorItemsMap.forEach((item: MonitorPayload) => {
    item.nodeList.forEach((node: MonitorNode) => events.push(node.eventName));
  });
  return events;
};

/**
   * Gets the input anchor device Id of a connector
   * @param connector
   * @returns input anchor device Id
   */
export const getInputAnchorDeviceId = (connector: Connector): string => {
  let result = '';
  if (connector && connector.inputAnchor) {
    result = (connector.inputAnchor.parentNode as OPCNode).deviceId;
  }
  return result;
};
/*
* tag event name
*/
export const getTagEventName = (deviceId: string, automationComponent: string, interfaceId: string, paramName: string) =>
  `${deviceId}.${automationComponent}.${interfaceId}.${TAG}.${paramName}`;
/*
* connection event name
*/
export const getConnectionEventName = (deviceId: string, automationComponent: string, interfaceId: string, paramName: string) =>
  `${deviceId}.${automationComponent}.${interfaceId}.${CONNECTION}.${paramName}`;
/*
* device interface name
*/
export const getDeviceInterfaceName = (deviceId: string, automationComponent: string, interfaceId: string) =>
  `${deviceId}.${automationComponent}.${interfaceId}`;
/*
* connection monitor key
*/
export const getConnectionMonitorKey = (deviceId: string, automationComponentId: string, interfaceId: string) =>
  `${deviceId}_${automationComponentId}_${interfaceId}`;

//export const getAdapterType = (connection: BaseConnector) => (connection?.inputAnchor?.parentNode as OPCNode)?.adapterType || AddressModelType.CLIENT_SERVER;
export const isInstanceOfConfiguredConnection = (obj: ConfiguredConnectionObj | ProposeConnectionObj):
  obj is ConfiguredConnectionObj => (obj as ConfiguredConnectionObj).status !== undefined;

/*
* isconnectionlistclick event
*/
export const isConnectionListClickEvent = (clickEvent): boolean => {
  return clickEvent.target.parentNode &&
    (clickEvent.target.parentNode.id === CONNECTIONLISTROWID ||
      clickEvent.target.parentNode.nodeName === 'TD' ||
      clickEvent.target.parentNode.nodeName === 'TR');
};
/*
* isdeviceadded
*/
export const isDeviceAdded = (deviceAddress: string, data: Array<DeviceConfig> | Array<Device>): boolean => {
  let result = false;
  if (!isNullOrEmpty(data) && data.length > 0) {
    for (const item of data) {
      if (deviceAddress === item.address) {
        result = true;
        break;
      }
    }
  }
  return result;
};
/*
*get unique element
*/
export const getUniqueElement = (elementList, key) =>
  elementList.filter(
    (elementValue, i, originalElement) =>
      originalElement.findIndex(v2 => v2[key] === elementValue[key]) === i
  );
/*
* padleading zeros
*/
export const padLeadingZeros = (ip, splittedIndex) => {
  return ip.split('.').map((splittedIp, index) => {
    if (index === splittedIndex) {
      return (`00 + ${splittedIp}`).slice(-splittedIndex);
    }
    return splittedIp;
  }).join('.');
};
/*
* hostpartfromip
*/
export const getHostPartFromIp = ipAddress => {
  return Number(
    ipAddress.split('.').length === Numeric.FOUR && ipAddress.split('.').pop()
  );
};
/*
*validateaddresslength
*/
export const validateAddressLength = ipAddress => ipAddress.split('.').length === Numeric.FOUR;
/*
* validatefromaddressrange
*/
export const validateFromAddressRange = (fromIpAddressHost, toIpAddressHost) => fromIpAddressHost > toIpAddressHost;
/*
* validatefield
*/
export const validateField = (formControl, field) =>  formControl.get(field).touched && formControl.controls[field].valid;
/*
* validateaddress
*/
export const validateAddress = (fromIPAddress, toIpAddress) => {
  const fromIPAddressHost = getHostPartFromIp(fromIPAddress);
  const toIPAddressHost = getHostPartFromIp(toIpAddress);
  return (
    validateAddressLength(fromIPAddress) &&
    validateFromAddressRange(fromIPAddressHost, toIPAddressHost)
  );
};
/*
* isformfieldhaserror
*/
export const isFormFieldHasError = (formControl, fieldName, error) => {
  return (
    !formControl.controls[fieldName].valid &&
    formControl.get(fieldName).touched &&
    formControl.get(fieldName).errors[error]
  );
};
/*
* sort editor html nodes coordinate
*/
export const sortEditorHTMLNodesCoordinate=(htmlNodeList:Node[]|Area[]):number[]=> {
  const editorYCoordinate=[];
  for (const editorNode of htmlNodeList) {
      editorYCoordinate.push(Math.round(editorNode.y));
  }
  return editorYCoordinate;
};
/*
* getSessionIDFromCookie
*/
export const getSessionIDFromCookie = () => {
  const cookies = {};
  const cookiesArray = document.cookie.split(';');
  cookiesArray.forEach(cookie => {
    const [key, value] = cookie.trim().split('=');
    cookies[key] = value;
  });
  let result = cookies['session_connection'];
  result = result?.split('.')[0].replace('s%3A', '');
  return result;
};
/*
* validateDragDropAccess
*/
export const validateDragDropAccess = (applicationStatus: ProjectState, accessType: AccessType) => {
  let result = false;
  if ((applicationStatus === ProjectState.OFFLINE && (!accessType || accessType === AccessType.WRITE))) {
    result = true;
  }
  return result;
}

 /**
     * isExposedConnectionPresentInServerInterface
     * @param previousParent
     * @param outNodeId
     * @returns boolean
     */
 export const isExposedConnectionPresentInServerInterface = (areaDetails: Area, outNodeId: string) => {
  const exposedServerInterfaces = areaDetails?.serverInterfaceIds?.map(el => el.automationComponentId);
  return exposedServerInterfaces?.includes(outNodeId);
}

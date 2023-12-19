/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ConnectorCreationMode, DeviceState, FileUploadErrors, InterfaceCategory, SubConnectorCreationMode } from '../enum/enum';
import { NodeAnchor } from '../opcua/opcnodes/node-anchor';
import { AreaClientInterface, AreaInterface, ISidePanel } from './targetmodel.interface';

/*
* Interface for connection
*/
export interface Connection {
    id :string,
    in: string;
    out: string;
    selected: boolean;
    creationMode:ConnectorCreationMode;
    connectionType?:string;
    hasSubConnections : boolean,
    areaId :string,
    subConnections ?: { clientIds : string[] , serverIds : string[]},
    acIds:string
}
/*
* Interface for sub connection
*/
export interface SubConnection {
   id : string;
   data : string,
   x: number,
   y: number,
   areaId : string,
   isclient :boolean,
   connectionId: string,
   creationMode:SubConnectorCreationMode,
   acId:string
}
/*
* Interface for sub connection payload
*/
export interface SubConnectionPayload {
    deviceId: string,
    acName: string,
    acId: string,
    interfaceId: string,
    subConnectionId: string,
    areaId: string,
    isClientInterface: boolean,
    connectionId: string,
    interfaceExposedMode: SubConnectorCreationMode
}

/*
* Interface for connection request payload
*/
export interface ConnectionRequestPayload {
    project : string,
    client : ConnectionPayloadDeviceData,
    server : ConnectionPayloadDeviceData,
}
/*
* Interface for connection payload device data
*/
export interface ConnectionPayloadDeviceData {
    deviceId : string,
    automationComponent : string,
    interface :string
}
/*
* Interface for connection response payload
*/
export interface ConnectionResponsePayload {
    status : string | 'Unknown Error';
    statusCode : string;
    /* Data type for error has to be 'any' as we receive different object structure for error object during
    Establish connection and online */
    error;
    data : ConnectionResponseData
}

/*
* Interface for connection response data
*/
export interface ConnectionResponseData
{
    client : ConnectionResponseDeviceData,
    server : ConnectionResponseDeviceData,
    connectionStatusData ?: ConenctionStatusData
}
/*
* Interface for connection response device data
*/
export interface ConnectionResponseDeviceData {
    deviceId : string,
    status : DeviceState,
    deviceAddress: string
}
/*
* Interface for  connection status
*/
export interface ConnectionStatus{
    totalConnections :number,
    noOfFailedConnections :number
    noOfSuccessfullConnections : number
}

/*
* Interface for disconnection payload
*/
export interface DisconnectPayload
{
    project : string,
    clientUId :string,
    clientData : ConnectionPayloadDeviceData
}
/*
* Interface for connection status data
*/
export interface ConenctionStatusData {
    diagnoseValue : boolean ,
    partnerValue : string
}

/*
* Interface for connection data
*/
export interface ConnectionData {
    deviceId: string,
    interfaceId:string,
    interfaceName:string,
    automationComponent:string,
    automationComponentId:string,
    serverDeviceId:string,
    areaId?:string
}
/*
* Interface for connection details
*/
export interface ConnectionDetails {
    clientDeviceId: string,
    serverDeviceId:string,
    clientACId:string,
    serverACId:string,
    clientInterfaceId:string,
    serverInterfaceId:string,
    //clientInterfaceName:string,
    //serverInterfaceName:string,
    interfaceType:string
    clientAreaId?:string,
    serverAreaId?:string,
    clientHTMLNodeId:string,
    serverHTMLNodeId:string
}
/*
* Interface for sub connection details
*/
export interface SubConnectionDetails {
    deviceId: string,
    acId:string,
    interfaceId:string,
    //interfaceName:string,
    interfaceType:string
    areaId?:string,
    hTMLNodeId:string
}
/*
* Interface for detailed status
*/
export interface DetailedStatus {
    connect: number,
    readNamespaceList: number,
    readNodeIds: number,
    read: number,
    write: number,
    disconnect: number
}
/*
* Interface for client diagnostic data
*/
export interface ClientDiagnosticData {
    status: ConnectionStatus,
    relatedEndpoint: string,
    detailedStatus: DetailedStatus
}


/*
* Interface for devices details
*/
export interface DevicesDetails{
    isValid?: boolean,
    deviceName: string,
    address?: string,
    fileName?: string,
    applicationIdentifierTypes?: Object,
    error?: FileUploadErrors,
    isSelected? :boolean,
    isProtected? :boolean,
    isValidAddressModel?: boolean,
    isSecurityPolicyValid?: boolean
}

/*
* Interface for xml request payload
*/
export interface UploadXMLRequestPayload {
    projectName: string,
    deviceList: DevicesDetails
    files: File[]
}

/*
* Interface for file upload list
*/
export interface FileUploadList {
    address: string,
    applicationIdentifierTypes: Object,
    deviceName: string,
    error: FileUploadErrors,
    file: File,
    isValid: boolean,
    name: string,
}
/*
* Interface for file upload event message
*/
export interface FileUploadEventMessage {
    counter:number,
    errorCount:number,
    totalNoOfDevices:number,
}
/*
* Interface for Establish connection options
*/
export interface EstablishConnectionMenuOptions{
    id : string,
    label : string,
}

/*
* Interface for Selected context anchro
*/
export interface SelectedContextAnchor {
    anchorDetails: NodeAnchor,
    event: MouseEvent,
    isClient: boolean
    isSelected: boolean,
}

/*
* Interface for side panel interface list
*/
export interface SidePanelInterfaceListDetails {
    clientInterfaces: Array<AreaClientInterface>,
    clientInterfaceIds: ISidePanel[],
    serverInterfaces: Array<AreaInterface>,
    serverInterfaceIds: ISidePanel[]
}

/*
* Interface for connection object details
*/
export interface ConnectionObjectDetails {
    soureDeviceId: string,
    targetDeviceId:string,
    connectionIn: string,
    connectionOut: string,
    clientInterfaceId: string,
    serverInterfaceId: string,
    commonParent: string,
    creationMode: ConnectorCreationMode,
    type: string,
    clientAcId: string,
    serverAcId: string,
    subConnection:SubConnectionIdList
}

/*
* Interface for side panels interface details
*/
export interface SidePanelInterfaceDetails {
    clientInterface: AreaClientInterface,
    clientInterfaceId: ISidePanel,
    serverInterface: AreaInterface,
    serverInterfaceId: ISidePanel
}
/*
* Interface for interface details
*/
export interface InterfaceDetails {
    interface: AreaClientInterface,
    interfaceId: ISidePanel,
    type: InterfaceCategory
}
/*
* Interface for sub connection id list
*/
export interface SubConnectionIdList{
    clientIds: string[],
    serverIds: string[]
}
/*
* Interface for matching connection interface
*/
export interface MatchingConnectionInterface {
        isSelected: boolean;
        hideCheckBox: boolean;
        hoverDisplayName: string;
        displayName: string;
        automationComponentId: string;
        automationComponentName: string;
        deviceId: string;
        interfaceName: string;
        isClientInterface: boolean;
        parent: string;
        type: string;
        interfaceId: string;
}
/*
* Interface for connection points
*/
export interface ConnectorPoints{
    x:number,
    y:number
}


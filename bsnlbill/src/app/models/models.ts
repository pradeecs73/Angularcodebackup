/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/


import { FormGroup } from '@angular/forms';
import { EntityState } from '@ngrx/entity';
import { ConnectorState,AccessType, InterfaceCategory } from '../enum/enum';
import { Connector } from '../opcua/opcnodes/connector';
import { HTMLNode } from '../opcua/opcnodes/htmlNode';
import { NodeAnchor } from '../opcua/opcnodes/node-anchor';
import { SubConnector } from '../opcua/opcnodes/subConnector';
import { FillingArea, FillingNode } from '../store/filling-line/filling-line.reducer';
import { Selection } from '../vendors/d3.module';
import { Connection, SubConnection } from './connection.interface';
import { DeviceScanSettings } from './device-data.interface';
import { AreaClientInterface, AreaInterface, Device, ISidePanel } from './targetmodel.interface';
/*
* Interface for device node
*/
interface DeviceNode {
    referenceTypeId: string;
    isForward: boolean;
    //nodeId: string;
    browseName: { namespaceIndex: number, name: string };
    displayName: { text: string };
    nodeClass: number;
    typeDefinition: string;
    deviceUid?: string;
    uid: string;
    address?: string;
    children?: Array<DeviceNode>;
}
/*
* Interface for Plant editor
*/
export interface LiveLink {
    svg: SVGSVGElement,
    workspace: Selection<SVGGElement, unknown, null, undefined>,
    nodeGroup: Selection<SVGGElement, unknown, null, undefined>,
    linkGroup: SVGGElement,
    connectorElem: SVGGElement,
    connectorPool: Array<Connector>,
    // refers to OpcNode
    editorNodes: Array<HTMLNode>,
    connectorLookup: HTMLNodeConnector,
    subConnectorLookup: HTMLNodeConnector,
    entities: EntityState<FillingNode | FillingArea>,
    nextConnectorId: number,
    nextAnchorId: number
}
/*
* Interface for editor context
*/
export interface EditorContext {
    id:string,
    name:string,
    parentLabels?:[]
}
/*
* Interface for html node connector
*/
export interface HTMLNodeConnector {
    key: Connector|SubConnector
}
/*
* Interface for Tree Data state
*/
export interface TreeDataState {
    name: string;
    rootRefereces: Array<DeviceNode>;
    uid: string;
    deviceType: string;
}

/*
* Interface for Propose connection
*/
export interface ProposeConnectionObj {
    connector: Connector;
    fromDeviceName: string;
    toDeviceName: string;
    isSelected: boolean;
    version: string;
    interfaceType: string;
    clientInterfaceName: string;
    serverInterfaceName: string;
    isRowSelected: boolean;
    //isCreatedManually: boolean;
    state: ConnectorState;
}
/*
* Interface for Configure connection obj
*/
export interface ConfiguredConnectionObj {
    connector: Connector;
    fromDeviceName: string;
    toDeviceName: string;
    isActualConRowSelected: boolean,
    isSelected?: boolean;
    version: string;
    interfaceType: string;
    clientInterfaceName: string;
    serverInterfaceName: string;
    isRowSelected?: boolean;
    state: ConnectorState
    status: boolean;/*additional property between ProposeConnectionObj & ConfiguredConnectionObj*/
}

/*
* Interface for Project data
*/
export interface ProjectData {
    project: Project;
    tree: Tree;
    editor: Editor;
    scanSettings : DeviceScanSettings;
    userDetails?:Array<UserDetails>,
    zoomSettings?:Zoom
    userPasswordDetails?:Array<UserDetails>,
}
/*
* Interface for zoom
*/
export interface Zoom{
    zoomPercent:number;
}
/*
* Interface for user details
*/
export interface UserDetails{
   password:string,
   accessType:AccessType
}
/*
* Interface for project/*
* Interface for connection
*/
export interface Project {
    name: string;
    id: string;
    date: string;
    author: string,
    created: Date | string,
    modified: Date | string,
    modifiedby: string,
    comment: string,
    isSelected?: boolean;
    isProtected?:boolean
}
/*
* Interface for Tree
*/
export interface Tree {
    devices: Array<Device>;
}

/*
* Interface for Editor
*/
export interface Editor {
    nodes: Array<Node>;
    connections: Array<Connection>;
    subConnections : Array<SubConnection>;
    areas: Array<Area>;
    //new state property - Offline/Default,Online,Propose Connection
    state?: string;
}
/*
* Interface for Node
*/
export interface Node {
    id: string; /*ac uid*/
    deviceId: string,
    address: string;
    x: number;
    y: number;
    selected: boolean;
    parent: string
}
/*
* Interface for Authenticate device
*/
export interface AuthenticateDevice{
    device,
    title : string,
    multipleDevices : boolean,
    index?: number
}
/*
* Interface for connection Interface
*/
export interface ConnectionInterfaces {
    clientInterface: NodeAnchor,
    serverInterface: NodeAnchor
}

/*
* Interface for Area
*/
export interface Area {
    name: string;
    id: string;
    x: number;
    y: number;
    selected?: boolean,
    // clientInterfaces: Array<ClientInterface>,
    // serverInterfaces: Array<OpcInterface>,
    clientInterfaceIds: Array<ISidePanel>,
    serverInterfaceIds: Array<ISidePanel>,
    nodeIds: Array<string>,
    parent?: string
    connectionIds: Array<string>;
}
/*
* Interface for Move Data
*/
export interface MoveData {
    top: number,
    left: number
}
/*
* Interface for Api response
*/
export interface ApiResponse {
    status: string,
    error: ErrorResponse,
    /* Data type for 'data' has to be 'any' as we receive different structure for each api response */
    data
}
/*
* Interface for Error Response
*/
export interface ErrorResponse {
    errorCode: number,
    errorType: string
}
/*
* Interface for connection point object
*/
export interface ConnectionPtObj {
    x: number;
    y: number;
    id?: string;
    type?: string;
    quadrant?: number;
}
/*
* Interface for Anchor circle
*/
export interface AnchorCircle extends SVGGElement {
    x: number;
    y: number;
}
/*
* Interface for connection nested
*/
export interface ConnectionNested {
    isTargetConnectionNested: boolean,
    parentAreaDetails?: Area,
    isCurrentAreaNestedInsideTarget?: boolean
}
/*
* Interface for sub connection
*/
export interface SubConnections {
    clientIds: string[],
    serverIds: string[]
}
/*
* Interface for project password
*/
export interface ProjectPasswords {
    oldPassword?:string,
    password: string,
    confirmPassword: string,
    mode:string
}
/*
* Interface for project protection
*/
export interface ProjectProtection {
    credentials? : {
      password: string,
      confirmPassword: string
    },
    mode: AccessType,
    formGroup?: FormGroup
}
/*
* Interface for drag drop data
*/
export interface DragDropData {
    dragNodeId: string,
    dropNodeId: string,
    dragNodeParentId: string,
    dragNodeType: string,
    dropNodeType: string,
    dropNodeChildNodeIds: Array<string>
}
/*
* Interface for sub connection zoom data
*/
export interface SubConnectionZoomData {
    zoomPercent:number,
    zoomChangeValue:boolean
}
/*
* Interface for Menu item
*/
export interface MenuItem {
    icon : string,
    styleClass :string
}
/*
* Interface for Langugage list
*/
export interface LanguageList {
    key : string,
    value : string
}
/*
* Interface for Interface details
*/
export interface InterfaceDetails{
    interface: AreaClientInterface,
    interfaceId: ISidePanel,
    type: InterfaceCategory
}
/*
* Interface for Menu item
*/
export interface MenuItem { 
    icon : string,
    styleClass : string
}
/*
* Interface for Error icon visibility
*/
export interface ErrorIconVisibility {
    value : boolean,
    type : string
}
/*
* Interface for Node ids to remove
*/
export interface NodeIdsToRemove{
    nodeId: string,
    removeFrom: string
}
/*
* Interface for Online param
*/
export interface OnlineParam { 
    project:string,
    deviceList:Array<string>
}

export interface AreaInterfacePayload {
    clientInterfaces?: Array<AreaClientInterface>,
    serverInterfaces ?:Array<AreaInterface>
    serverInterfaceIds?: Array<ISidePanel>
    clientInterfaceIds ?:Array<ISidePanel>
}

export interface PasswordResponse {
    data: ResponseDataForRegisterPassword;
    status: string;
    error: ErrorResponse;
  }
  export interface ResponseDataForRegisterPassword {
    userDetails: UserDetails;
    accessToken: string;
    refreshToken: string;
  }

export interface SaveProjectResponse{
    data : ResponseDataForSaveProject,
    status: ResponseDataForSaveProject;
    error: ErrorResponse;
}

export interface ResponseDataForSaveProject{
    code : number,
    msg : string
}
  

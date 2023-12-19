/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { AccessType, SubConnectorCreationMode } from '../enum/enum';
import { NodeAnchor } from '../opcua/opcnodes/node-anchor';
import { SubConnector } from '../opcua/opcnodes/subConnector';
import { SubConnection } from './connection.interface';
import { AreaClientInterface, ISidePanel } from './targetmodel.interface';
/*
*
* Payload for xml file
*/
export interface FilePayload {
    FileName: string;
    Size: number;
    Content: unknown;
    ContentString: string;
}
/*
*
* Payload for read project api
*/

export interface ReadProjectPayload {
    projectId: string,
    projectName: string,
    isProtected: boolean,
    password?: string
}
/*
*
* Payload for change project password api
*/
export interface ChangeProjectPasswordPayload {
    oldPassword: string,
    password: string,
    confirmPassword: string,
    accessType: AccessType,
    projectName: string,
    projectId: string
}
/*
*
* Payload for remove project password api
*/
export interface RemoveProjectPasswordPayload {
    projectId: string,
    projectName: string,
    password: string,
    accessType: AccessType
}

/*
*
* Payload for subconnection payload
*/

export interface SubConnectionPayload{
    deviceId: string,
    acName: string,
    acId: string,
    areaId: string,
    isClientInterface: boolean,
    connectionId: string,
    interfaceExposedMode: SubConnectorCreationMode,
    interfaceId: string,
    subConnectionId :string
}

/*
*
* Payload for building interface
*/

export interface BuildInterfaceNode{
    nodeAnchor:NodeAnchor,
    subConnector:SubConnector,
    interfaceDetails:ISidePanel,
    interfaceData:AreaClientInterface,
    clonedNodeAnchor:NodeAnchor,
    subConnection:SubConnection,
    index:number
}

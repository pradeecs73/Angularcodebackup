/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { AddressModelType, DeviceState, SubConnectorCreationMode } from '../enum/enum';
/* Interface for Device config
*/
export interface DeviceConfig {
    name: string;
    uid: string;
    address: string;
    isProtected?: boolean;
    isDeviceAuthRequired?: boolean;
    isSecurityPolicyValid?: boolean;
    isValidAddressModel?:boolean;
    credentials?: object;
}
/* Interface for device
*/
export interface Device extends DeviceConfig {
    automationComponents?: Array<AutomationComponent>,
    deviceSet: Array<Properties>,
    adapterType:AddressModelType,
    state: DeviceState,
    // manage all state related info in a single param
    isNew?: boolean,
    isUpdated?: boolean,
    isSelected?:boolean,
    status?: string;
    error? : DeviceErrors;
    partialSelected? : boolean
}

/**
 * Interface for device error
 */
export interface DeviceErrors {
    ipAddressUniqueError : boolean,
    deviceNameLengthError : boolean
}
/* Interface for Automation component
*/
export interface AutomationComponent {
    clientInterfaces: Array<ClientInterface>;
    serverInterfaces: Array<OpcInterface>;
    name: string;
    deviceId: string;
    deviceName: string;
    id: string;
    address: string;
    state: DeviceState;
}
/* Interface for selected automation component
*/
export interface SelectedAutomationComponent {
    adapterType: string,
    automationComponent: AutomationComponent;
}
/* Interface for device set config
*/
export interface DeviceSetConfig {
    Manufacturer: Properties,
    DeviceRevision: Properties,
    Model: Properties,
    EngineeringRevision: Properties,
    HardwareRevision: Properties,
    OrderNumber: Properties,
    RevisionCounter: Properties,
    SerialNumber: Properties,
    ProductCode: Properties
}
/* Interface for opc interface
*/
export interface OpcInterface {
    name: string;
    type: string | '',
    id: string;
    properties: Array<Properties>;
    isClientInterface:boolean;
}
/* Interface for Isidepanel
*/
export interface ISidePanel {
    interfaceId: string,
    deviceId: string,
    automationComponentId: string,
    subConnectionId: string,
    isClientInterface : boolean,
    adapterType?:AddressModelType,
    interfaceExposedMode:SubConnectorCreationMode
    // add interface type here
}

/* Interface for svgpoints
*/
export interface SvgPoints {
    x: number,
    y: number
}
/* Interface for client interface
*/
export interface ClientInterface extends OpcInterface {
    connectionEndPointDetails?: ConenctionEndPointDetails,
}
/* Interface for area interface
*/
export interface AreaInterface extends OpcInterface {
    deviceId: string,
    automationComponentId:string,
    subConnectionId:string,
    interfaceExposedMode:SubConnectorCreationMode
    //adapterType:string
}
/* Interface for area client interface
*/
export interface AreaClientInterface extends ClientInterface,AreaInterface {
}
/* Interface for connection end point details
*/
export interface ConenctionEndPointDetails {
    detailStatus: Properties,
    relatedEndpoints: Properties,
    status: Properties
}
/* Interface for properties
*/
export interface Properties {
    name: string;
    //nodeId: string;
    /* Data type of  value should be 'any' as the value can be different */
    value;
    type: string;
    connection?: Array<Properties>
    children?: Array<Properties>
}

/* Interface for related end point interface
*/
export interface RelatedEndPointInterface {
    address: string,
    functionalEntity?: string,
    automationComponent?: string
}
/* Interface for isconnected response
*/
export interface IsConnectedResponse {
    isConnected: boolean,
    deviceName?: string
}
/* Interface for IScroll
*/
export interface IScroll {
    top: number,
    left: number
}
/* Interface for updateAreaInterface
*/
export interface UpdateAreaInterface {
    target: unknown;
    areaId :  string;
}
/* Interface for DeviceSet
*/
export interface DeviceSet {
    property: string,
    value: string
}


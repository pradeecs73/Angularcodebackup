/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { AddressModelType, ConnectorType, FillingLineNodeType, HTTPStatus, InterfaceCategory, MONITORTYPE } from "../enum/enum";
import { EventEmitter } from '@angular/core';
import { Device } from "./targetmodel.interface";

/*
* Interface for Go online response
*/
export interface GoOnlineResponse
{
 status: HTTPStatus,
 msg: string,
 deviceList: Device[]
}
/*
* Interface for Monitor node
*/
export interface MonitorNode {
    eventName: string;
    //nodeId?: string,
    propertyName :string
    partnerUrl?: string
}

/*
* Interface for Monitor payload
*/
export interface MonitorPayload {
    project :string;
    deviceId: string,
    automationComponent :string,
    interfaceName: string,
    type: MONITORTYPE,
    nodeList: Array<MonitorNode>,
    sessionName?: string,
    serverDeviceId?:string
}

/*
* Interface for panel data type
*/
export interface PanelDataType {
  // nodeId: string;
  adapterType: AddressModelType;
  automationComponent: string;
  deviceId: string;
  deviceName: string;
  deviceState: string;
  id: string;
  interfaceType: InterfaceCategory;
  name: string;//interfaceName
  properties: Array<PropertiesType>;
  type:FillingLineNodeType;
}
/*
* Interface for properties type
*/
  export interface PropertiesType {
    name: string;
    //nodeId: string;
    value: string,
    type: string,
    children?: Array<PropertiesType>;
    doesHaveChildren?:boolean
  }
/*
* Interface for monitor observable
*/
  export interface MonitorObservable{
    eventName:string,
    /* Data type of  event and value should be 'any' */
    event:EventEmitter<string | number | unknown>,
    value
}
/*
* Interface for Attribute data
*/
export interface AttributeData {
    dataType: string,
    doesHaveChildren: boolean,
    isChild: boolean,
    name: string,
    eventName:string,
    nodeId: string,
    value: string,
  }
/*
* Interface for Property panel table column
*/
  export interface PropertyPanelTableColumn {
    field:string,
    header:string
  }
/*
* Interface for Tree data
*/
export interface TreeData extends PropertiesType {
  name: string,
  value: string,
  type: string,
  data?: string,
  eventName?: string,
}
/*
* Interface for Monitor data param
*/
export interface MonitorDataParam {
  eventDiagnose: string,
  eventPartner: string,
  eventDetailedStatus: string,
  connectorId: string,
  connectorType: ConnectorType,
  areaId: string,
  deviceId: string,
  automationComponentId: string,
  interfaceId: string
}
/*
* Interface for create connection payload
*/
export interface CreateConnectionPayload{
  param: string,
  value: unknown,
  connectorId: string,
  connectorType: ConnectorType,
  areaId: string,
  deviceId: string,
  automationComponentId: string,
  interfaceId: string
}




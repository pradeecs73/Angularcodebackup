/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ConnectionResponsePayload } from 'src/app/models/connection.interface';
import { Connector } from '../src/app/opcua/opcnodes/connector';
export const mockConnection = {
    angle: 90,
    id :'1234',
    connectionStatus: true,
    connectorStyle: 13,
    address : '192.168.2.101',
    creationMode: 'Manual',
    state: 'ONLINE',
    inputCircle: {
        x: 500,
        y: 300
    },
    isSelected : true,
    setUnSelectedStyle : () =>{},
    relatedEndPoint: {
        address: 'opc.tcp://192.168.2.103:4840',
        functionalEntity: 'Washing2ToWashing1',
        automationComponent: 'WashingStep1'
    },
    detailedStatus: {
        connect: 0,
        readNamespaceList: 0,
        readNodeIds: 0,
        read: 0,
        write: 0,
        disconnect: 0
    },
    outputAnchor: {
        parentNode: {
            deviceName: 'device1',
            deviceId : '1234567'
        },
        interfaceData: {
            name: 'interface1'
        },
        connectionName: 'opc.tcp://192.168.2.103:4840__WashingStep1__Washing2ToWashing1'
    },
    inputAnchor: {
        parentNode: {
            deviceName: 'device2',
            adapterType: 'Plant Object',
            deviceId : '123456'
        },
        interfaceData: {
            name: 'interface2'
        },
        connectionName: 'opc.tcp://192.168.2.104:4840__WashingStep2__Washing2ToWashing1',
        relatedEndPoint: {
            address: 'opc.tcp://192.168.2.103:4840',
            functionalEntity: 'Washing2ToWashing1',
            automationComponent: 'WashingStep1'
        },
        connectionStatus: true
    }
} as unknown as Connector;

export const mockEstablisConnectionPayloadSuccess = [
 {
  status: 'SUCCESS',
  statusCode: '0',
  error: null,
  data: {
   client: {
    deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
    deviceAddress: 'opc.tcp://192.168.2.101:4840',
    status: 'AVAILABLE'
   },
   server: {
    deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==',
    deviceAddress: 'opc.tcp://192.168.2.102:4840',
    status: 'AVAILABLE'
   }
  }
 }
] as unknown as Array<ConnectionResponsePayload>;



export const mockEstablisConnectionPayloadError = [
 {
  status: 'Error',
  statusCode: '1',
  error: {}
 },
 {
  status: 'SUCCESS',
  statusCode: '0',
  error: null,
  data: {
   client: {
    deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
    deviceAddress: 'opc.tcp://192.168.2.101:4840',
    status: 'AVAILABLE'
   },
   server: {
    deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==',
    deviceAddress: 'opc.tcp://192.168.2.102:4840',
    status: 'AVAILABLE'
   }
  }
 }
] as unknown as Array<ConnectionResponsePayload>;


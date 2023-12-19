/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */

import { SUCCESS_CODE } from '../src/app/utility/constant';
import { AddressModelType, DeviceState } from '../src/app/enum/enum';
import { Device } from '../src/app/models/targetmodel.interface';
import { ProjectData } from '../src/app/models/models';

const deviceSetValue = '6ES7 513-1AL02-0AB0  V02.08.00';

export const mockDevices: Device[] = [
  {
    name: 'Device1',
    uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MDo0ODQw',
    address: 'opc.tcp://192.168.2.50:4840',
    isProtected: true,
    isDeviceAuthRequired: true,
    state: DeviceState.AVAILABLE,
    status: SUCCESS_CODE,
    error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    },
    automationComponents: [
      {
        name: 'BottleFilling',
        address: '',
        deviceId: '',
        deviceName: '',
        state: DeviceState.AVAILABLE,
        id: '',
        clientInterfaces: [],
        serverInterfaces: [],
      },
    ],
    deviceSet: [
      {
        name: 'ProductCode',
        type: 'String',
        value: deviceSetValue,
      },
      {
        name: 'DeviceRevision',
        type: 'String',
        value: deviceSetValue,
      },
      {
        name: 'EngineeringRevision',

        type: 'String',
        value: 'V17.0',
      },
      {
        name: 'HardwareRevision',

        type: 'String',
        value: '0',
      },
      {
        name: 'Manufacturer',

        type: 'LocalizedText',
        value: 'locale=null text=Siemens AG',
      },
      {
        name: 'Model',

        type: 'LocalizedText',
        value: 'locale=null text=CPU 1513-1 PN',
      },
      {
        name: 'OrderNumber',

        type: 'String',
        value: '6ES7 513-1AL02-0AB0 ',
      },
      {
        name: 'RevisionCounter',
        type: 'Int32',
        value: '1',
      },
      {
        name: 'SerialNumber',
        type: 'String',
        value: '10S C-053l853401',
      },
    ],
    isSelected: false,
    adapterType: AddressModelType.CLIENT_SERVER,
  },
  {
    name: 'Device2',
    adapterType: AddressModelType.CLIENT_SERVER,
    uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi41MTo0ODQw',
    address: 'opc.tcp://192.168.2.51:4840',
    isProtected: false,
    isDeviceAuthRequired: true,
    state: DeviceState.AVAILABLE,
    status: SUCCESS_CODE,
    error: {
      ipAddressUniqueError : false,
      deviceNameLengthError : false
    },
    automationComponents: [
      {
        name: 'LiquidMixing',
        address: '',
        deviceId: '',
        deviceName: '',
        state: DeviceState.AVAILABLE,
        id: '',
        clientInterfaces: [],
        serverInterfaces: [],
      },
    ],
    deviceSet: [
      {
        name: 'ProductCode',
        type: 'String',
        value: deviceSetValue,
      },
      {
        name: 'DeviceRevision',
        type: 'String',
        value: deviceSetValue,
      },
      {
        name: 'EngineeringRevision',

        type: 'String',
        value: 'V17.0',
      },
      {
        name: 'HardwareRevision',

        type: 'String',
        value: '0',
      },
      {
        name: 'Manufacturer',

        type: 'LocalizedText',
        value: 'locale=null text=Siemens AG',
      },
      {
        name: 'Model',

        type: 'LocalizedText',
        value: 'locale=null text=CPU 1513-1 PN',
      },
      {
        name: 'OrderNumber',

        type: 'String',
        value: '6ES7 513-1AL02-0AB0 ',
      },
      {
        name: 'RevisionCounter',
        type: 'Int32',
        value: '1',
      },
      {
        name: 'SerialNumber',
        type: 'String',
        value: '10S C-053l853401',
      },
    ],
    isSelected: false,
  },
];

export const existingClientInterfaces = [
  {
    name: 'Washing2ToWashing1',
    type: 'Wash2ToWash1_Type',
    properties: [
      {
        name: 'InputData',
        type: '',
        children: [],
      },
      {
        name: 'OutputData',
        type: '',
        children: [],
      },
    ],
    isClientInterface: true,
    connectionEndPointDetails: {
      detailStatus: {
        name: 'DetailedStatus',
        value: ' ',
        type: '',
      },
      relatedEndpoints: {
        name: 'RelatedEndpoint',
        value: {
          address: 'opc.tcp://192.168.2.103:4840',
          functionalEntity: '',
          automationComponent: '',
        },
        type: '',
      },
      status: {
        name: 'Status',
        value: true,
        type: '',
      },
    },
    id: 'clientInf_lje2otef',
  },
];

export const existingServerInterfaces = [
  {
    name: 'FillingToWashing2',
    type: 'FillToWash2_Type',
    properties: [
      {
        name: 'InputData',
        type: '',
        children: [],
      },
      {
        name: 'OutputData',
        type: '',
        children: [],
      },
    ],
    isClientInterface: false,
    id: 'serverInf_lje2oteg',
  },
];


export const cacheData: ProjectData = {
  project: {
    id: 'kr626w3j',
    name: 'Multi_Con',
    date: '',
    author: '',
    created: '7/16/2021, 1:38:02 PM',
    modified: '7/16/2021, 1:38:02 PM',
    modifiedby: '',
    comment: '',
  },
  tree: {
    devices: [mockDevices[0]],
  },
  editor: {
    nodes: [
      {
        address: 'opc.tcp://192.168.2.75:4840',
        id: 'hdhd123544',
        x: 10,
        y: 10,
        selected: false,
        deviceId: 'deviceId',
        parent: 'ROOT',
      },
      {
        address: 'opc.tcp://192.168.2.75:4840',
        id: 'test12345',
        x: 10,
        y: 10,
        selected: false,
        deviceId: 'deviceId',
        parent: 'ROOT',
      },
    ],
    connections: [],
    subConnections: [],
    areas: [
      {
        name: 'Area1',
        id: '12345',
        x: 10,
        y: 20,
        clientInterfaceIds: [],
        serverInterfaceIds: [],
        nodeIds: [],
        connectionIds: [],
      },
    ],
  },
  scanSettings: {
    port: 0,
    fromIPAddress: '',
    toIPAddress: '',
  },
};
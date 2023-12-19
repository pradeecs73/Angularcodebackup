/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */

import {
  AddressModelType,
  ConnectorCreationMode,
  DeviceState,
} from '../src/app/enum/enum';
import { Connection, SubConnection } from '../src/app/models/connection.interface';
import { DeviceScanSettings } from '../src/app/models/device-data.interface';
import { Area, Editor, Project, ProjectData } from '../src/app/models/models';
import {
  ClientInterface,
  Properties,
} from '../src/app/models/targetmodel.interface';
import { FillingNode } from '../src/app/store/filling-line/filling-line.reducer';
import { ROOT_EDITOR } from '../src/app/utility/constant';

export let device = [
  {
    adapterType: AddressModelType.CLIENT_SERVER,
    address: 'opc.tcp://192.168.2.101:4840',
    isNew: true,
    isProtected: true,
    isDeviceAuthRequired: true,
    automationComponents: [
      {
        address: 'opc.tcp://192.168.2.1067:4840',
        deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
        deviceName: 'BottleFilling',
        id: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n',
        name: 'BottleFilling',
        serverInterfaces: [
          {
            automationComponentId:
              'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
            deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==',
            id: 'serverInf_l7vnn3uj',
            interfaceExposedMode: 'Manual',
            isClientInterface: false,
            name: 'FillingToMixing',
            properties: [],
            subConnectionId:
              'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type',
            type: 'FillToMix_Type',
          },
        ],
        state: 'AVAILABLE',
        clientInterfaces: [
          ({
            automationComponentId:
              'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n',
            connectionEndPointDetails: {},
            id: 'clientInf_l7vnn3uh',
            isClientInterface: true,
            name: 'FillingToMixing',
            properties: [],
            type: 'FillToMix_Type',
            deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
            subConnectionId:
              'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__FillToMix_Type',
          } as unknown) as ClientInterface,
        ],
      },
    ],
    deviceSet: ([
      {
        name: 'DeviceRevision',
        type: 'String',
        value: '6ES7 511-1AK02-0AB0  V02.08.00',
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
        value: 'locale=null text=CPU 1511-1 PN',
      },
      {
        name: 'OrderNumber',
        type: 'String',
        value: '6ES7 511-1AK02-0AB0 ',
      },
      {
        name: 'RevisionCounter',
        type: 'Int32',
        value: -1,
      },
      {
        name: 'SerialNumber',
        type: 'String',
        value: '10S C-9E19569Bw8',
      },
    ] as unknown) as Properties[],
    name: 'BottleFilling',
    state: DeviceState.AVAILABLE,
    status: 'SUCCESS',
    uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
  },
];

export const project = <Project>{
  date: '4',
  name: 'firstProj',
  comment: 'projectComment',
  author: 'projectauthor',
  id: '1234',
};

export let subConnection = {
  acId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
  areaId: 'area_l8alnjdn',
  connectionId: '123456',
  creationMode: 'Manual',
  data:
    'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==__LiquidMixing__FillingToMixing',
  id:
    'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillingToMixing__clientInf_l7vnn3uh',
  isclient: false,
  x: 656.7374877929688,
  y: 59.650001525878906,
};

export let projectDataObject = <ProjectData>{
  project: project,
  tree: { devices: device },
  editor: ({
    nodes: ([
      {
        id: '1',
        deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
        address: '192.168.2.101',
        x: 101,
        y: 200,
        selected: true,
        parent: 'abcde',
      },
    ] as unknown) as Array<Node>,
    connections: ([
      {
        id:
          'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__clientInf_l7vnn3uh',
        in:
          'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==__BottleFilling__FillingToMixing',
        out:
          'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==__LiquidMixing__FillingToMixing',
        selected: false,
        creationMode: ConnectorCreationMode.MANUAL,
        hasSubConnections: false,
        areaId: 'ROOT',
        acIds:
          'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
      },
      {
        id:
          'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__clientInf_l7vnn3uh',
        in:
          'b3BtynRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==__BottleFilling__FillingToMixing',
        out:
          'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==__LiquidMixing__FillingToMixing',
        selected: false,
        creationMode: ConnectorCreationMode.MANUAL,
        hasSubConnections: false,
        areaId: 'ROOT',
        acIds:
          'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
      },
    ] as unknown) as Array<Connection>,
    subConnections: ([subConnection] as unknown) as Array<SubConnection>,
    areas: ([
      {
        name: 'area_1',
        id: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n',
        x: 100,
        y: 200,
        parent: ROOT_EDITOR,
        clientInterfaceIds: [
          {
            automationComponentId:
              'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n',
            deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
            interfaceExposedMode: 'Manual',
            interfaceId: 'FillingToMixing',
            subConnectionId:
              'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__FillToMix_Type',
          },
        ],
        serverInterfaceIds: [
          {
            automationComponentId:
              'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
            deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==',
            interfaceExposedMode: 'Manual',
            interfaceId: 'FillingToMixing',
            subConnectionId:
              'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type',
          },
        ],
      },
    ] as unknown) as Array<Area>,
  } as unknown) as Editor,
  scanSettings: ({
    port: 4800,
    fromIPAddress: '192.168.2.101',
    toIPAddress: '192.168.2.102',
  } as unknown) as DeviceScanSettings,
};

export const fillingNode = ({
  adapterType: AddressModelType.CLIENT_SERVER,
  address: 'opc.tcp://192.168.2.101:4840',
  clientInterfaces: [
    {
      connectionEndPointDetails: {},
      id: 'clientInf_l7vnn3uh',
      isClientInterface: true,
      name: 'FillingToMixing',
      properties: [],
      type: 'FillToMix_Type',
    },
  ],
  deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
  deviceName: 'BottleFilling',
  element: null,
  id: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n',
  name: 'BottleFilling',
  parent: 'ROOT',
  selected: false,
  serverInterfaces: [
    {
      connectionEndPointDetails: {},
      id: 'clientInf_l7vnn3uh',
      isClientInterface: false,
      name: 'FillingToMixing',
      properties: [],
      type: 'FillToMix_Type',
    },
  ],
  state: 'UNKNOWN',
  type: 'node',
  x: 550,
  y: 115,
} as unknown) as FillingNode;

export let area = {
  clientInterfaces: [],
  element: null,
  id: 'area_l8bqhhly',
  name: 'Area 1',
  parent: 'ROOT',
  repositionRequired: true,
  serverInterfaces: [],
  serverInterfaceIds: [
    {
      automationComponentId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=',
      deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==',
      id: 'serverInf_l7vnn3uj',
      interfaceExposedMode: 'Manual',
      interfaceId: 'FillingToMixing',
      isClientInterface: false,
      name: 'FillingToMixing',
      properties: [],
      subConnectionId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type',
      type: 'FillToMix_Type',
    },
  ],
  clientInterfaceIds: [
    {
      automationComponentId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n',
      deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
      interfaceExposedMode: 'Manual',
      interfaceId: 'FillingToMixing',
      subConnectionId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__FillToMix_Type',
    },
  ],

  type: 'area',
  x: 15,
  y: 461,
};

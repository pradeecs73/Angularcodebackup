/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { AreaClientInterface } from 'src/app/models/targetmodel.interface';
import {
  FillingArea,
  FillingNode,
} from 'src/app/store/filling-line/filling-line.reducer';

const FillingNodeMockData = {
  id: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n',
  element: {},
  selected: false,
  state: 'UNKNOWN',
  x: 231.66668701171875,
  y: 146,
  deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
  clientInterfaces: [
    {
      name: 'FillingToMixing',
      type: 'FillToMix_Type',
      properties: [
        {
          name: 'InputData',
          type: '',
          children: [
            {
              name: 'Start',
              type: 'Boolean',
            },
            {
              name: 'Stop',
              type: 'Boolean',
            },
            {
              name: 'Hold',
              type: 'Boolean',
            },
            {
              name: 'AmountLiquid',
              type: 'Double',
            },
            {
              name: 'Error',
              type: 'Boolean',
            },
            {
              name: 'Status',
              type: 'UInt16',
            },
          ],
        },
        {
          name: 'OutputData',
          type: '',
          children: [
            {
              name: 'Running',
              type: 'Boolean',
            },
            {
              name: 'Stopped',
              type: 'Boolean',
            },
            {
              name: 'Held',
              type: 'Boolean',
            },
            {
              name: 'Error',
              type: 'Boolean',
            },
            {
              name: 'Status',
              type: 'UInt16',
            },
            {
              name: 'FaultyBottles',
              type: 'UInt32',
            },
          ],
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
            address: 'opc.tcp://192.168.2.102:4840',
            functionalEntity: '',
            automationComponent: '',
          },
          type: '',
        },
        status: {
          name: 'Status',
          value: {},
          type: '',
        },
      },
      id: 'clientInf_l6eoprq1',
    },
    {
      name: 'FillingToWashing2',
      type: 'FillToWash2_Type',
      properties: [
        {
          name: 'InputData',
          type: '',
          children: [
            {
              name: 'Start',
              type: 'Boolean',
            },
          ],
        },
        {
          name: 'OutputData',
          type: '',
          children: [
            {
              name: 'Running',
              type: 'Boolean',
            },
            {
              name: 'Stopped',
              type: 'Boolean',
            },
            {
              name: 'Held',
              type: 'Boolean',
            },
            {
              name: 'Error',
              type: 'Boolean',
            },
            {
              name: 'Status',
              type: 'UInt16',
            },
          ],
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
            address: 'opc.tcp://192.168.2.104:4840',
            functionalEntity: '',
            automationComponent: '',
          },
          type: '',
        },
        status: {
          name: 'Status',
          value: {},
          type: '',
        },
      },
      id: 'clientInf_l6eoprq2',
    },
  ],
  serverInterfaces: [],
  address: 'opc.tcp://192.168.2.101:4840',
  name: 'BottleFilling',
  deviceName: 'BottleFilling',
  adapterType: 'Plant Object',
  type: 'node',
  parent: 'ROOT',
} as FillingNode;

const fillingAreaMockData = {
  x: 15,
  y: 386,
  id: 'area_l7ubsg95',
  name: 'Area 1',
  repositionRequired: false,
  type: 'area',
  element: {},
  parent: 'ROOT',
  serverInterfaces: [
    {
      name: 'Washing2ToWashing1',
      type: 'Wash2ToWash1_Type',
      properties: [
        {
          name: 'InputData',
          type: '',
          children: [
            {
              name: 'Running',
              type: 'Boolean',
            },
          ],
        },
        {
          name: 'OutputData',
          type: '',
          children: [
            {
              name: 'Start',
              type: 'Boolean',
            },
            {
              name: 'Stop',
              type: 'Boolean',
            },
            {
              name: 'Hold',
              type: 'Boolean',
            },
          ],
        },
      ],
      isClientInterface: false,
      id: 'serverInf_l6eoprq6',
      deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
      automationComponentId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
      subConnectionId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__Wash2ToWash1_Type',
      interfaceExposedMode: 'Manual',
    },
  ],
  clientInterfaces: [
    {
      name: 'Washing1ToMixing',
      type: 'Wash1ToMix_Type',
      properties: [
        {
          name: 'InputData',
          type: '',
          children: [
            {
              name: 'Start',
              type: 'Boolean',
            },
            {
              name: 'Stop',
              type: 'Boolean',
            },
            {
              name: 'Hold',
              type: 'Boolean',
            },
            {
              name: 'AmountBottles',
              type: 'UInt32',
            },
            {
              name: 'Error',
              type: 'Boolean',
            },
            {
              name: 'Status',
              type: 'UInt16',
            },
          ],
        },
        {
          name: 'OutputData',
          type: '',
          children: [
            {
              name: 'Running',
              type: 'Boolean',
            },
            {
              name: 'Stopped',
              type: 'Boolean',
            },
            {
              name: 'Held',
              type: 'Boolean',
            },
            {
              name: 'Error',
              type: 'Boolean',
            },
            {
              name: 'Status',
              type: 'UInt16',
            },
          ],
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
            address: 'opc.tcp://192.168.2.102:4840',
            functionalEntity: '',
            automationComponent: '',
          },
          type: '',
        },
        status: {
          name: 'Status',
          value: {},
          type: '',
        },
      },
      id: 'clientInf_l6eoprq5',
      deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
      automationComponentId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
      subConnectionId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__Wash1ToMix_Type',
      interfaceExposedMode: 'Manual',
    },
  ],
  selected: false,
  nodeIds: ['b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE='],
  clientInterfaceIds: [
    {
      deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
      automationComponentId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
      interfaceId: 'Washing1ToMixing',
      isClientInterface: true,
      interfaceExposedMode: 'Manual',
      subConnectionId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__Wash1ToMix_Type',
    },
  ],
  serverInterfaceIds: [
    {
      deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
      automationComponentId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
      interfaceId: 'Washing2ToWashing1',
      isClientInterface: false,
      interfaceExposedMode: 'Manual',
      subConnectionId:
        'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__Wash2ToWash1_Type',
    },
  ],
} as FillingArea;

const interfaceMockData = {
  name: 'FillingToMixing',
  type: 'FillToMix_Type',
  properties: [
    {
      name: 'InputData',
      type: '',
      children: [
        {
          name: 'Start',
          type: 'Boolean',
        },
        {
          name: 'Stop',
          type: 'Boolean',
        },
        {
          name: 'Hold',
          type: 'Boolean',
        },
        {
          name: 'AmountLiquid',
          type: 'Double',
        },
        {
          name: 'Error',
          type: 'Boolean',
        },
        {
          name: 'Status',
          type: 'UInt16',
        },
      ],
    },
    {
      name: 'OutputData',
      type: '',
      children: [
        {
          name: 'Running',
          type: 'Boolean',
        },
        {
          name: 'Stopped',
          type: 'Boolean',
        },
        {
          name: 'Held',
          type: 'Boolean',
        },
        {
          name: 'Error',
          type: 'Boolean',
        },
        {
          name: 'Status',
          type: 'UInt16',
        },
        {
          name: 'FaultyBottles',
          type: 'UInt32',
        },
      ],
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
        address: 'opc.tcp://192.168.2.102:4840',
        functionalEntity: '',
        automationComponent: '',
      },
      type: '',
    },
    status: {
      name: 'Status',
      value: {},
      type: '',
    },
  },
  id: 'clientInf_l6eoprq1',
  deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
  automationComponentId:
    'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n',
  subConnectionId:
    'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__FillToMix_Type',
  interfaceExposedMode: 'Manual',
} as AreaClientInterface;

const mockedClientInterfaceIds = [
  {
    deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
    automationComponentId:
      '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
    interfaceId: 'clientInf_lganeuj4',
    isClientInterface: true,
    interfaceExposedMode: 'Manual',
    subConnectionId:
      '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==__FillToMix_Type__clientInf_lganeuj4',
  },
  {
    deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
    automationComponentId:
      '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
    interfaceId: 'clientInf_lganeuj5',
    isClientInterface: true,
    interfaceExposedMode: 'Manual',
    subConnectionId:
      '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==__FillToWash2_Type__clientInf_lganeuj5',
  },
];

const mockedServerInterfaceIds = [
  {
    deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
    automationComponentId:
      '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
    interfaceId: 'serverInf_lganeuj6',
    interfaceExposedMode: 'MANUALNONLINE',
    subConnectionId:
      'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n__FillToMix_Type__serverInf_lganeuj6',
    isClientInterface: false,
  },
  {
    deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
    automationComponentId:
      'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
    interfaceId: 'serverInf_lganeuj7',
    isClientInterface: false,
    interfaceExposedMode: 'Manual',
    subConnectionId:
      'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n__Wash1ToMix_Type__serverInf_lganeuj7',
  },
];

export {
  FillingNodeMockData,
  fillingAreaMockData,
  interfaceMockData,
  mockedClientInterfaceIds,
  mockedServerInterfaceIds,
};

/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */

export const parentNode = {
  adapterType: 'Plant Object',
  address: 'opc.tcp://192.168.2.101:4840',
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
      id: 'clientInf_l7vnn3uh',
    },
  ],
  deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
  deviceName: 'BottleFilling',
  dragType: 'shape',
  element: {},
  id: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n',
  inputs: [],
  name: 'BottleFilling',
  node: {},
  outputs: [],
  parent: 'ROOT',
  selected: false,
  serverInterfaces: [],
  state: 'UNKNOWN',
  type: 'node',
  x: 319.4000244140625,
  y: 65.80003356933594,
};

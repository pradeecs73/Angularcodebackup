/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */

export const mockNode = {
  children: [
    {
      children: [],
      data: {
        adapterType: 'Plant Object',
        address: 'opc.tcp://192.168.2.102:4840',
        clientInterfaces: [],
        deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
        deviceName: 'LiquidMixing',
        element: null,
        id: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
        name: 'LiquidMixing',
        parent: 'area_lgaqf7p9',
        selected: false,
        serverInterfaces: [
          {
            id: 'serverInf_lganeuj6',
            isClientInterface: false,
            name: 'FillingToMixing',
            properties: [
              {
                children: [
                  { name: 'Running', type: 'Boolean' },
                  { name: 'Stopped', type: 'Boolean' },
                  { name: 'Held', type: 'Boolean' },
                  { name: 'Error', type: 'Boolean' },
                  { name: 'Status', type: 'UInt16' },
                  { name: 'FaultyBottles', type: 'UInt32' },
                ],
                name: 'InputData',
                type: '',
              },
              {
                children: [
                  { name: 'Start', type: 'Boolean' },
                  { name: 'Stop', type: 'Boolean' },
                  { name: 'Hold', type: 'Boolean' },
                  { name: 'AmountLiquid', type: 'Double' },
                  { name: 'Error', type: 'Boolean' },
                  { name: 'Status', type: 'UInt16' },
                ],
                name: 'OutputData',
                type: '',
              },
            ],
            type: 'FillToMix_Type',
          },
          {
            id: 'serverInf_lganeuj7',
            isClientInterface: false,
            name: 'Washing1ToMixing',
            properties: [
              {
                children: [
                  { name: 'Running', type: 'Boolean' },
                  { name: 'Stopped', type: 'Boolean' },
                  { name: 'Held', type: 'Boolean' },
                  { name: 'Error', type: 'Boolean' },
                  { name: 'Status', type: 'UInt16' },
                ],
                name: 'InputData',
                type: '',
              },
              {
                children: [
                  { name: 'Start', type: 'Boolean' },
                  { name: 'Stop', type: 'Boolean' },
                  { name: 'Hold', type: 'Boolean' },
                  { name: 'AmountBottles', type: 'UInt32' },
                  { name: 'Error', type: 'Boolean' },
                  { name: 'Status', type: 'UInt16' },
                ],
                name: 'OutputData',
                type: '',
              },
            ],
            type: 'Wash1ToMix_Type',
          },
        ],
        state: 'UNKNOWN',
        type: 'node',
        x: 294.9376220703125,
        y: 387.6666564941406,
      },
      draggable: true,
      droppable: false,
      icon: 'plcicon',
      key: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
      label: 'LiquidMixing',
      styleClass: '',
      type: 'node',
    },
    {
      children: [],
      data: {
        adapterType: 'Plant Object',
        address: 'opc.tcp://192.168.2.101:4840',
        clientInterfaces: [
          {
            connectionEndPointDetails: {
              detailStatus: {
                name: 'DetailedStatus',
                type: '',
                value: {
                  connect: 0,
                  disconnect: 0,
                  read: 0,
                  readNamespaceList: 0,
                  readNodeIds: 0,
                  write: 0,
                },
              },
              relatedEndpoints: {
                name: 'RelatedEndpoint',
                type: '',
                value: '',
              },
              status: { name: 'Status', type: '', value: false },
            },
            id: 'clientInf_lganeuj4',
            isClientInterface: true,
            name: 'FillingToMixing',
            properties: [
              {
                children: [
                  { name: 'Start', type: 'Boolean' },
                  { name: 'Stop', type: 'Boolean' },
                  { name: 'Hold', type: 'Boolean' },
                  { name: 'AmountLiquid', type: 'Double' },
                  { name: 'Error', type: 'Boolean' },
                  { name: 'Status', type: 'UInt16' },
                ],
                name: 'InputData',
                type: '',
              },
              {
                children: [
                  { name: 'Running', type: 'Boolean' },
                  { name: 'Stopped', type: 'Boolean' },
                  { name: 'Held', type: 'Boolean' },
                  { name: 'Error', type: 'Boolean' },
                  { name: 'Status', type: 'UInt16' },
                  { name: 'FaultyBottles', type: 'UInt32' },
                ],
                name: 'OutputData',
                type: '',
              },
            ],
            type: 'FillToMix_Type',
          },
          {
            connectionEndPointDetails: {
              detailStatus: {
                name: 'DetailedStatus',
                type: '',
                value: {
                  connect: 0,
                  disconnect: 0,
                  read: 0,
                  readNamespaceList: 0,
                  readNodeIds: 0,
                  write: 0,
                },
              },
              relatedEndpoints: {
                name: 'RelatedEndpoint',
                type: '',
                value: '',
              },
              status: { name: 'Status', type: '', value: false },
            },
            id: 'clientInf_lganeuj5',
            isClientInterface: true,
            name: 'FillingToWashing2',
            properties: [
              {
                children: [
                  { name: 'Start', type: 'Boolean' },
                  { name: 'Hold', type: 'Boolean' },
                  { name: 'Stop', type: 'Boolean' },
                  { name: 'Speed', type: 'UInt32' },
                  { name: 'NumberBottles', type: 'UInt32' },
                  { name: 'FaultyBottles', type: 'UInt32' },
                  { name: 'Error', type: 'Boolean' },
                  { name: 'Status', type: 'Boolean' },
                ],
                name: 'InputData',
                type: '',
              },
              {
                children: [
                  { name: 'Running', type: 'Boolean' },
                  { name: 'Stopped', type: 'Boolean' },
                  { name: 'Held', type: 'Boolean' },
                  { name: 'Error', type: 'Boolean' },
                  { name: 'Status', type: 'UInt16' },
                ],
                name: 'OutputData',
                type: '',
              },
            ],
            type: 'FillToWash2_Type',
          },
        ],
        deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
        deviceName: 'BottleFilling',
        element: null,
        id: '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
        name: 'BottleFilling',
        parent: 'area_lgaqf7p9',
        selected: false,
        serverInterfaces: [],
        state: 'UNKNOWN',
        type: 'node',
        x: 201.60430908203125,
        y: 49.888946533203125,
      },
      draggable: true,
      droppable: false,
      icon: 'plcicon',
      key: '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
      label: 'BottleFilling',
      styleClass: '',
      type: 'node',
    },
  ],
  data: {
    clientInterfaceIds: [
      {
        automationComponentId:
          '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
        deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
        interfaceExposedMode: 'Manual',
        interfaceId: 'clientInf_lganeuj4',
        isClientInterface: true,
        subConnectionId:
          '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==__FillToMix_Type__clientInf_lganeuj4',
      },
      {
        automationComponentId:
          '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
        deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
        interfaceExposedMode: 'Manual',
        interfaceId: 'clientInf_lganeuj5',
        isClientInterface: true,
        subConnectionId:
          '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==__FillToWash2_Type__clientInf_lganeuj5',
      },
    ],
    clientInterfaces: [
      {
        automationComponentId:
          '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
        connectionEndPointDetails: {
          detailStatus: {
            name: 'DetailedStatus',
            type: '',
            value: {
              connect: 0,
              disconnect: 0,
              read: 0,
              readNamespaceList: 0,
              readNodeIds: 0,
              write: 0,
            },
          },
          relatedEndpoints: {
            name: 'RelatedEndpoint',
            type: '',
            value: '',
          },
          status: { name: 'Status', type: '', value: false },
        },
        deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
        id: 'clientInf_lganeuj4',
        interfaceExposedMode: 'Manual',
        isClientInterface: true,
        name: 'FillingToMixing',
        properties: [
          {
            children: [
              { name: 'Start', type: 'Boolean' },
              { name: 'Stop', type: 'Boolean' },
              { name: 'Hold', type: 'Boolean' },
              { name: 'AmountLiquid', type: 'Double' },
              { name: 'Error', type: 'Boolean' },
              { name: 'Status', type: 'UInt16' },
            ],
            name: 'InputData',
            type: '',
          },
          {
            children: [
              { name: 'Running', type: 'Boolean' },
              { name: 'Stopped', type: 'Boolean' },
              { name: 'Held', type: 'Boolean' },
              { name: 'Error', type: 'Boolean' },
              { name: 'Status', type: 'UInt16' },
              { name: 'FaultyBottles', type: 'UInt32' },
            ],
            name: 'OutputData',
            type: '',
          },
        ],
        subConnectionId:
          '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==__FillToMix_Type__clientInf_lganeuj4',
        type: 'FillToMix_Type',
      },
      {
        automationComponentId:
          '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
        connectionEndPointDetails: {
          detailStatus: {
            name: 'DetailedStatus',
            type: '',
            value: {
              connect: 0,
              disconnect: 0,
              read: 0,
              readNamespaceList: 0,
              readNodeIds: 0,
              write: 0,
            },
          },
          relatedEndpoints: {
            name: 'RelatedEndpoint',
            type: '',
            value: '',
          },
          status: { name: 'Status', type: '', value: false },
        },
        deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
        id: 'clientInf_lganeuj5',
        interfaceExposedMode: 'Manual',
        isClientInterface: true,
        name: 'FillingToWashing2',
        properties: [
          {
            children: [
              { name: 'Start', type: 'Boolean' },
              { name: 'Hold', type: 'Boolean' },
              { name: 'Stop', type: 'Boolean' },
              { name: 'Speed', type: 'UInt32' },
              { name: 'NumberBottles', type: 'UInt32' },
              { name: 'FaultyBottles', type: 'UInt32' },
              { name: 'Error', type: 'Boolean' },
              { name: 'Status', type: 'Boolean' },
            ],
            name: 'InputData',
            type: '',
          },
          {
            children: [
              { name: 'Running', type: 'Boolean' },
              { name: 'Stopped', type: 'Boolean' },
              { name: 'Held', type: 'Boolean' },
              { name: 'Error', type: 'Boolean' },
              { name: 'Status', type: 'UInt16' },
            ],
            name: 'OutputData',
            type: '',
          },
        ],
        subConnectionId:
          '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==__FillToWash2_Type__clientInf_lganeuj5',
        type: 'FillToWash2_Type',
      },
    ],
    connectionIds: [],
    element: {},
    id: 'area_lgaqf7p9',
    name: 'Area 1',
    nodeIds: [
      'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
      '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
    ],
    parent: 'ROOT',
    selected: false,
    serverInterfaceIds: [
      {
        automationComponentId:
          'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
        deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
        interfaceExposedMode: 'MANUALNONLINE',
        interfaceId: 'serverInf_lganeuj6',
        isClientInterface: false,
        subConnectionId:
          'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n__FillToMix_Type__serverInf_lganeuj6',
      },
      {
        automationComponentId:
          'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
        deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
        interfaceExposedMode: 'Manual',
        interfaceId: 'serverInf_lganeuj7',
        isClientInterface: false,
        subConnectionId:
          'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n__Wash1ToMix_Type__serverInf_lganeuj7',
      },
    ],
    serverInterfaces: [
      {
        automationComponentId:
          'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
        deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
        id: 'serverInf_lganeuj6',
        interfaceExposedMode: 'MANUALNONLINE',
        isClientInterface: false,
        name: 'FillingToMixing',
        properties: [
          {
            children: [
              { name: 'Running', type: 'Boolean' },
              { name: 'Stopped', type: 'Boolean' },
              { name: 'Held', type: 'Boolean' },
              { name: 'Error', type: 'Boolean' },
              { name: 'Status', type: 'UInt16' },
              { name: 'FaultyBottles', type: 'UInt32' },
            ],
            name: 'InputData',
            type: '',
          },
          {
            children: [
              { name: 'Start', type: 'Boolean' },
              { name: 'Stop', type: 'Boolean' },
              { name: 'Hold', type: 'Boolean' },
              { name: 'AmountLiquid', type: 'Double' },
              { name: 'Error', type: 'Boolean' },
              { name: 'Status', type: 'UInt16' },
            ],
            name: 'OutputData',
            type: '',
          },
        ],
        subConnectionId:
          'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n__FillToMix_Type__serverInf_lganeuj6',
        type: 'FillToMix_Type',
      },
      {
        automationComponentId:
          'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
        deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
        id: 'serverInf_lganeuj7',
        interfaceExposedMode: 'Manual',
        isClientInterface: false,
        name: 'Washing1ToMixing',
        properties: [
          {
            children: [
              { name: 'Running', type: 'Boolean' },
              { name: 'Stopped', type: 'Boolean' },
              { name: 'Held', type: 'Boolean' },
              { name: 'Error', type: 'Boolean' },
              { name: 'Status', type: 'UInt16' },
            ],
            name: 'InputData',
            type: '',
          },
          {
            children: [
              { name: 'Start', type: 'Boolean' },
              { name: 'Stop', type: 'Boolean' },
              { name: 'Hold', type: 'Boolean' },
              { name: 'AmountBottles', type: 'UInt32' },
              { name: 'Error', type: 'Boolean' },
              { name: 'Status', type: 'UInt16' },
            ],
            name: 'OutputData',
            type: '',
          },
        ],
        subConnectionId:
          'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n__Wash1ToMix_Type__serverInf_lganeuj7',
        type: 'Wash1ToMix_Type',
      },
    ],
    type: 'area',
    x: 65,
    y: 35.44439697265625,
  },
  draggable: true,
  droppable: true,
  expanded: true,
  icon: 'areaicon',
  key: 'area_lgaqf7p9',
  label: 'Area 1',
  styleClass: ' area-class',
  type: 'area',
};

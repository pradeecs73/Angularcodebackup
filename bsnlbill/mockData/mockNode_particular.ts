/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */


export const mockNode_particular = {
  label: 'CNP',
  icon: 'fas fa-cube',
  expanded: true,
  type: 'head',
  partialSelected: false,
  children: [
    {
      label: 'WashingStep1',
      icon: 'plcicon',
      droppable: false,
      type: 'node',
      styleClass: '',
      key: 'bdf529a3-b991-48cb-b8e5-02a2099c7496_V2FzaGluZ1N0ZXAx',
      data: {
        x: 48.27093505859375,
        y: 334.9166717529297,
        id: 'bdf529a3-b991-48cb-b8e5-02a2099c7496_V2FzaGluZ1N0ZXAx',
        element: {},
        selected: false,
        state: 'UNKNOWN',
        deviceId: 'bdf529a3-b991-48cb-b8e5-02a2099c7496',
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
                value: {
                  connect: 0,
                  readNamespaceList: 0,
                  readNodeIds: 0,
                  read: 0,
                  write: 0,
                  disconnect: 0,
                },
                type: '',
              },
              relatedEndpoints: {
                name: 'RelatedEndpoint',
                value: '',
                type: '',
              },
              status: {
                name: 'Status',
                value: false,
                type: '',
              },
            },
            id: 'clientInf_lganeuj8',
          },
        ],
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
                  {
                    name: 'Speed',
                    type: 'UInt32',
                  },
                  {
                    name: 'NumberBottles',
                    type: 'UInt32',
                  },
                  {
                    name: 'FaultyBottles',
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
            ],
            isClientInterface: false,
            id: 'serverInf_lganeuj9',
          },
        ],
        address: 'opc.tcp://192.168.2.103:4840',
        name: 'WashingStep1',
        deviceName: 'WashingStep1',
        adapterType: 'Plant Object',
        type: 'node',
        parent: 'ROOT',
      },
      draggable: true,
      children: [],
    },
    {
      label: 'WashingStep2',
      icon: 'plcicon',
      droppable: false,
      type: 'node',
      styleClass: '',
      key: '9d5b5d0b-46e9-4136-a19e-f591a1b92425_V2FzaGluZ1N0ZXAy',
      data: {
        x: 651.826416015625,
        y: 364.08680725097656,
        id: '9d5b5d0b-46e9-4136-a19e-f591a1b92425_V2FzaGluZ1N0ZXAy',
        element: {},
        selected: false,
        state: 'UNKNOWN',
        deviceId: '9d5b5d0b-46e9-4136-a19e-f591a1b92425',
        clientInterfaces: [
          {
            name: 'Washing2ToWashing1',
            type: 'Wash2ToWash1_Type',
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
                    name: 'Speed',
                    type: 'UInt32',
                  },
                  {
                    name: 'NumberBottles',
                    type: 'UInt32',
                  },
                  {
                    name: 'FaultyBottles',
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
                value: {
                  connect: 0,
                  readNamespaceList: 0,
                  readNodeIds: 0,
                  read: 0,
                  write: 0,
                  disconnect: 0,
                },
                type: '',
              },
              relatedEndpoints: {
                name: 'RelatedEndpoint',
                value: '',
                type: '',
              },
              status: {
                name: 'Status',
                value: false,
                type: '',
              },
            },
            id: 'clientInf_lganeuja',
          },
        ],
        serverInterfaces: [
          {
            name: 'FillingToWashing2',
            type: 'FillToWash2_Type',
            properties: [
              {
                name: 'InputData',
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
              {
                name: 'OutputData',
                type: '',
                children: [
                  {
                    name: 'Start',
                    type: 'Boolean',
                  },
                  {
                    name: 'Hold',
                    type: 'Boolean',
                  },
                  {
                    name: 'Stop',
                    type: 'Boolean',
                  },
                  {
                    name: 'Speed',
                    type: 'UInt32',
                  },
                  {
                    name: 'NumberBottles',
                    type: 'UInt32',
                  },
                  {
                    name: 'FaultyBottles',
                    type: 'UInt32',
                  },
                  {
                    name: 'Error',
                    type: 'Boolean',
                  },
                  {
                    name: 'Status',
                    type: 'Boolean',
                  },
                ],
              },
            ],
            isClientInterface: false,
            id: 'serverInf_lganeujb',
          },
        ],
        address: 'opc.tcp://192.168.2.104:4840',
        name: 'WashingStep2',
        deviceName: 'WashingStep2',
        adapterType: 'Plant Object',
        type: 'node',
        parent: 'ROOT',
      },
      draggable: true,
      children: [],
    },
    {
      label: 'Area 1',
      icon: 'areaicon',
      droppable: true,
      type: 'area',
      styleClass: ' area-class',
      key: 'area_lgaqf7p9',
      data: {
        id: 'area_lgaqf7p9',
        x: 65,
        y: 35.44439697265625,
        parent: 'ROOT',
        clientInterfaceIds: [
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
        ],
        serverInterfaceIds: [
          {
            deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
            automationComponentId:
              'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
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
        ],
        name: 'Area 1',
        nodeIds: [
          'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
          '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
        ],
        connectionIds: [],
        type: 'area',
        element: {},
        serverInterfaces: [
          {
            name: 'FillingToMixing',
            type: 'FillToMix_Type',
            properties: [
              {
                name: 'InputData',
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
            ],
            isClientInterface: false,
            id: 'serverInf_lganeuj6',
            deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
            automationComponentId:
              'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
            subConnectionId:
              'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n__FillToMix_Type__serverInf_lganeuj6',
            interfaceExposedMode: 'MANUALNONLINE',
          },
          {
            name: 'Washing1ToMixing',
            type: 'Wash1ToMix_Type',
            properties: [
              {
                name: 'InputData',
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
            ],
            isClientInterface: false,
            id: 'serverInf_lganeuj7',
            deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
            automationComponentId:
              'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
            subConnectionId:
              'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n__Wash1ToMix_Type__serverInf_lganeuj7',
            interfaceExposedMode: 'Manual',
          },
        ],
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
                value: {
                  connect: 0,
                  readNamespaceList: 0,
                  readNodeIds: 0,
                  read: 0,
                  write: 0,
                  disconnect: 0,
                },
                type: '',
              },
              relatedEndpoints: {
                name: 'RelatedEndpoint',
                value: '',
                type: '',
              },
              status: {
                name: 'Status',
                value: false,
                type: '',
              },
            },
            id: 'clientInf_lganeuj4',
            deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
            automationComponentId:
              '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
            subConnectionId:
              '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==__FillToMix_Type__clientInf_lganeuj4',
            interfaceExposedMode: 'Manual',
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
                  {
                    name: 'Hold',
                    type: 'Boolean',
                  },
                  {
                    name: 'Stop',
                    type: 'Boolean',
                  },
                  {
                    name: 'Speed',
                    type: 'UInt32',
                  },
                  {
                    name: 'NumberBottles',
                    type: 'UInt32',
                  },
                  {
                    name: 'FaultyBottles',
                    type: 'UInt32',
                  },
                  {
                    name: 'Error',
                    type: 'Boolean',
                  },
                  {
                    name: 'Status',
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
                value: {
                  connect: 0,
                  readNamespaceList: 0,
                  readNodeIds: 0,
                  read: 0,
                  write: 0,
                  disconnect: 0,
                },
                type: '',
              },
              relatedEndpoints: {
                name: 'RelatedEndpoint',
                value: '',
                type: '',
              },
              status: {
                name: 'Status',
                value: false,
                type: '',
              },
            },
            id: 'clientInf_lganeuj5',
            deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
            automationComponentId:
              '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
            subConnectionId:
              '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==__FillToWash2_Type__clientInf_lganeuj5',
            interfaceExposedMode: 'Manual',
          },
        ],
        selected: false,
      },
      draggable: true,
      children: [
        {
          label: 'LiquidMixing',
          icon: 'plcicon',
          droppable: false,
          type: 'node',
          styleClass: '',
          key: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
          data: {
            x: 294.9376220703125,
            y: 387.6666564941406,
            id: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224_TGlxdWlkTWl4aW5n',
            element: null,
            selected: false,
            state: 'UNKNOWN',
            deviceId: 'ee5fec06-ef03-4ce7-89dd-1b4af703b224',
            clientInterfaces: [],
            serverInterfaces: [
              {
                name: 'FillingToMixing',
                type: 'FillToMix_Type',
                properties: [
                  {
                    name: 'InputData',
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
                ],
                isClientInterface: false,
                id: 'serverInf_lganeuj6',
              },
              {
                name: 'Washing1ToMixing',
                type: 'Wash1ToMix_Type',
                properties: [
                  {
                    name: 'InputData',
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
                ],
                isClientInterface: false,
                id: 'serverInf_lganeuj7',
              },
            ],
            address: 'opc.tcp://192.168.2.102:4840',
            name: 'LiquidMixing',
            deviceName: 'LiquidMixing',
            adapterType: 'Plant Object',
            type: 'node',
            parent: 'area_lgaqf7p9',
          },
          draggable: true,
          children: [],
        },
        {
          label: 'BottleFilling',
          icon: 'plcicon',
          droppable: false,
          type: 'node',
          styleClass: '',
          key: '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
          data: {
            x: 201.60430908203125,
            y: 49.888946533203125,
            id: '824f39e7-733b-4504-b7f5-94b16389dd23_Qm90dGxlRmlsbGluZw==',
            element: null,
            selected: false,
            state: 'UNKNOWN',
            deviceId: '824f39e7-733b-4504-b7f5-94b16389dd23',
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
                    value: {
                      connect: 0,
                      readNamespaceList: 0,
                      readNodeIds: 0,
                      read: 0,
                      write: 0,
                      disconnect: 0,
                    },
                    type: '',
                  },
                  relatedEndpoints: {
                    name: 'RelatedEndpoint',
                    value: '',
                    type: '',
                  },
                  status: {
                    name: 'Status',
                    value: false,
                    type: '',
                  },
                },
                id: 'clientInf_lganeuj4',
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
                      {
                        name: 'Hold',
                        type: 'Boolean',
                      },
                      {
                        name: 'Stop',
                        type: 'Boolean',
                      },
                      {
                        name: 'Speed',
                        type: 'UInt32',
                      },
                      {
                        name: 'NumberBottles',
                        type: 'UInt32',
                      },
                      {
                        name: 'FaultyBottles',
                        type: 'UInt32',
                      },
                      {
                        name: 'Error',
                        type: 'Boolean',
                      },
                      {
                        name: 'Status',
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
                    value: {
                      connect: 0,
                      readNamespaceList: 0,
                      readNodeIds: 0,
                      read: 0,
                      write: 0,
                      disconnect: 0,
                    },
                    type: '',
                  },
                  relatedEndpoints: {
                    name: 'RelatedEndpoint',
                    value: '',
                    type: '',
                  },
                  status: {
                    name: 'Status',
                    value: false,
                    type: '',
                  },
                },
                id: 'clientInf_lganeuj5',
              },
            ],
            serverInterfaces: [],
            address: 'opc.tcp://192.168.2.101:4840',
            name: 'BottleFilling',
            deviceName: 'BottleFilling',
            adapterType: 'Plant Object',
            type: 'node',
            parent: 'area_lgaqf7p9',
          },
          draggable: true,
          children: [],
        },
      ],
      expanded: true,
    },
    {
      label: 'Area 2',
      icon: 'areaicon',
      droppable: true,
      type: 'area',
      styleClass: ' area-class',
      key: 'area_lgaqf80s',
      data: {
        id: 'area_lgaqf80s',
        x: 752.77783203125,
        y: 117.66665649414062,
        selected: false,
        parent: 'ROOT',
        clientInterfaceIds: [],
        serverInterfaceIds: [],
        name: 'Area 2',
        nodeIds: [],
        connectionIds: [],
        type: 'area',
        element: {},
        serverInterfaces: [],
        clientInterfaces: [],
      },
      draggable: true,
      children: [],
    },
  ],
  droppable: true,
  key: 'ROOT',
};

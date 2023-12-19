/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */
const sessionName = 'CE-BottleFilling-FillingToMixin_LiquidMixing-FillingToMixin';
const productUri = 'https://www.siemens.com/s7-1500';
const applicationName = 'SIMATIC.S7-1500.OPC-UA.Application:BottleFilling';
const eventDetails = {
  applicationUri: 'urn:SIMATIC.S7-1500.OPC-UA.Application:BottleFilling',
  sessionId: 'ns=1;i=3708195330',
  sessionName: sessionName,
  endpointUrl: 'opc.tcp://192.168.2.102:4840',
  ConnectionTime: '2022-08-29T08:03:52.602Z',
  productUri: productUri,
  ApplicationNameValue: applicationName
};

const mockConnectionMoniterDataEventValue = {
  sessionId: eventDetails.sessionId,
  sessionName: eventDetails.sessionName,
  clientDescription: {
    applicationUri: eventDetails.applicationUri,
    productUri: eventDetails.productUri,
    applicationName: { text: eventDetails.ApplicationNameValue },
    applicationType: 'Client',
    discoveryUrls: []
  },
  endpointUrl: eventDetails.endpointUrl,
  localeIds: [],
  actualSessionTimeout: 20000,
  maxResponseMessageSize: 2097152,
  clientConnectionTime: eventDetails.ConnectionTime,
  clientLastContactTime: '2022-08-29T08:04:07.475Z',
  currentSubscriptionsCount: 0,
  currentMonitoredItemsCount: 0,
  currentPublishRequestsInQueue: 0,
  totalRequestCount: { totalCount: 1101, errorCount: 0 },
  unauthorizedRequestCount: 0,
  readCount: { totalCount: 555, errorCount: 0 },
  historyReadCount: { totalCount: 0, errorCount: 0 },
  writeCount: { totalCount: 542, errorCount: 0 },
  historyUpdateCount: { totalCount: 0, errorCount: 0 },
  callCount: { totalCount: 0, errorCount: 0 },
  createMonitoredItemsCount: { totalCount: 0, errorCount: 0 },
  modifyMonitoredItemsCount: { totalCount: 0, errorCount: 0 },
  setMonitoringModeCount: { totalCount: 0, errorCount: 0 },
  setTriggeringCount: { totalCount: 0, errorCount: 0 },
  deleteMonitoredItemsCount: { totalCount: 0, errorCount: 0 },
  createSubscriptionCount: { totalCount: 0, errorCount: 0 },
  modifySubscriptionCount: { totalCount: 0, errorCount: 0 },
  setPublishingModeCount: { totalCount: 0, errorCount: 0 },
  publishCount: { totalCount: 0, errorCount: 0 },
  republishCount: { totalCount: 0, errorCount: 0 },
  transferSubscriptionsCount: { totalCount: 0, errorCount: 0 },
  deleteSubscriptionsCount: { totalCount: 0, errorCount: 0 },
  addNodesCount: { totalCount: 0, errorCount: 0 },
  addReferencesCount: { totalCount: 0, errorCount: 0 },
  deleteNodesCount: { totalCount: 0, errorCount: 0 },
  deleteReferencesCount: { totalCount: 0, errorCount: 0 },
  browseCount: { totalCount: 2, errorCount: 0 },
  browseNextCount: { totalCount: 0, errorCount: 0 },
  translateBrowsePathsToNodeIdsCount: { totalCount: 0, errorCount: 0 },
  queryFirstCount: { totalCount: 0, errorCount: 0 },
  queryNextCount: { totalCount: 0, errorCount: 0 },
  registerNodesCount: { totalCount: 2, errorCount: 0 },
  unregisterNodesCount: { totalCount: 0, errorCount: 0 }
};

export const mockCreatedTreeData = [
  {
    data: { name: 'InputData', type: '', value: undefined },
    eventName:
      'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==.BottleFilling.clientInf_l1v09tnh.tag.InputData',
    name: 'InputData',
    nodeId: '',
    type: '',
    children: [
      {
        name: 'Start',
        type: 'Boolean',
        value: undefined,
        eventName:
          'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==.BottleFilling.clientInf_l1v09tnh.tag.Start',
        children: [
          {
            name: 'Start',
            type: 'Boolean',
            value: undefined,
            eventName:
              'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==.BottleFilling.clientInf_l1v09tnh.tag.Start'
          }
        ]
      }
    ]
  }
];

export const mockMonitorValue = {
  actualSessionTimeout: 20000
};

const eventNameLiquidMixing = `b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==.
LiquidMixing.b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__
b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type.tag.SessionDiagnostics`;
export const mockConnectionMoniterData = {
  eventName:
    eventNameLiquidMixing,
  value: mockConnectionMoniterDataEventValue,
  treeData: [
    {
      name: 'Server interface :LiquidMixing > FillingToMixing',
      value: '',
      type: '',
      children: [
        {
          name: 'actualSessionTimeout',
          value: 20000,
          type: '',
          data: {
            name: 'actualSessionTimeout',
            type: '',
            value: 20000
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'addNodesCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName: eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'addNodesCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'addReferencesCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'addReferencesCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'browseCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 2,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 2
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'browseCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'browseNextCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'browseNextCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'callCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'callCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'clientConnectionTime',
          value: eventDetails.ConnectionTime,
          type: '',
          data: {
            name: 'clientConnectionTime',
            type: '',
            value: eventDetails.ConnectionTime
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'clientDescription',
          value: '',
          type: '',
          children: [
            {
              name: 'applicationName',
              value: '',
              type: '',
              children: [
                {
                  name: 'text',
                  value: applicationName,
                  type: '',
                  data: {
                    name: 'text',
                    type: '',
                    value: applicationName
                  },
                  eventName:
                    eventNameLiquidMixing
                }
              ],
              data: {
                name: 'applicationName',
                type: '',
                value: ''
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'applicationType',
              value: 'Client',
              type: '',
              data: {
                name: 'applicationType',
                type: '',
                value: 'Client'
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'applicationUri',
              value: eventDetails.applicationUri,
              type: '',
              data: {
                name: 'applicationUri',
                type: '',
                value: eventDetails.applicationUri
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'discoveryUrls',
              value: '',
              type: '',
              children: [],
              data: {
                name: 'discoveryUrls',
                type: '',
                value: ''
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'productUri',
              value: productUri,
              type: '',
              data: {
                name: 'productUri',
                type: '',
                value: productUri
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'clientDescription',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'clientLastContactTime',
          value: '2022-08-29T08:04:06.470Z',
          type: '',
          data: {
            name: 'clientLastContactTime',
            type: '',
            value: '2022-08-29T08:04:06.470Z'
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'createMonitoredItemsCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'createMonitoredItemsCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'createSubscriptionCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'createSubscriptionCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'currentMonitoredItemsCount',
          value: 0,
          type: '',
          data: {
            name: 'currentMonitoredItemsCount',
            type: '',
            value: 0
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'currentPublishRequestsInQueue',
          value: 0,
          type: '',
          data: {
            name: 'currentPublishRequestsInQueue',
            type: '',
            value: 0
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'currentSubscriptionsCount',
          value: 0,
          type: '',
          data: {
            name: 'currentSubscriptionsCount',
            type: '',
            value: 0
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'deleteMonitoredItemsCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'deleteMonitoredItemsCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'deleteNodesCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'deleteNodesCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'deleteReferencesCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'deleteReferencesCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'deleteSubscriptionsCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'deleteSubscriptionsCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'endpointUrl',
          value: eventDetails.endpointUrl,
          type: '',
          data: {
            name: 'endpointUrl',
            type: '',
            value: eventDetails.endpointUrl
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'historyReadCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'historyReadCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'historyUpdateCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'historyUpdateCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'localeIds',
          value: '',
          type: '',
          children: [],
          data: {
            name: 'localeIds',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'maxResponseMessageSize',
          value: 2097152,
          type: '',
          data: {
            name: 'maxResponseMessageSize',
            type: '',
            value: 2097152
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'modifyMonitoredItemsCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'modifyMonitoredItemsCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'modifySubscriptionCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'modifySubscriptionCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'publishCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'publishCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'queryFirstCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'queryFirstCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'queryNextCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'queryNextCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'readCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 516,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 516
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'readCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'registerNodesCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 2,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 2
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'registerNodesCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'republishCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'republishCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'sessionId',
          value: eventDetails.sessionId,
          type: '',
          data: {
            name: 'sessionId',
            type: '',
            value: eventDetails.sessionId
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'sessionName',
          value: sessionName,
          type: '',
          data: {
            name: 'sessionName',
            type: '',
            value: sessionName
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'setMonitoringModeCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'setMonitoringModeCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'setPublishingModeCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'setPublishingModeCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'setTriggeringCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'setTriggeringCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'totalRequestCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 1024,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 1024
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'totalRequestCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'transferSubscriptionsCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'transferSubscriptionsCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'translateBrowsePathsToNodeIdsCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'translateBrowsePathsToNodeIdsCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'unauthorizedRequestCount',
          value: 0,
          type: '',
          data: {
            name: 'unauthorizedRequestCount',
            type: '',
            value: 0
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'unregisterNodesCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 0,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'unregisterNodesCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        },
        {
          name: 'writeCount',
          value: '',
          type: '',
          children: [
            {
              name: 'errorCount',
              value: 0,
              type: '',
              data: {
                name: 'errorCount',
                type: '',
                value: 0
              },
              eventName:
                eventNameLiquidMixing
            },
            {
              name: 'totalCount',
              value: 504,
              type: '',
              data: {
                name: 'totalCount',
                type: '',
                value: 504
              },
              eventName:
                eventNameLiquidMixing
            }
          ],
          data: {
            name: 'writeCount',
            type: '',
            value: ''
          },
          eventName:
            eventNameLiquidMixing,
          parent: null
        }
      ],
      eventName:
        eventNameLiquidMixing,
      data: {
        name: 'Server interface :LiquidMixing > FillingToMixing',
        type: '',
        value: ''
      }
    }
  ]
};

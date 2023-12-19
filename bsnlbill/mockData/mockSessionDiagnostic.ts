/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */

export const mockedServerDiagnostic = {
  status: 'SUCCESS',
  error: null,
  data: {
    server: {
      sessionId: 'ns=1;i=3312867463',
      sessionName: 'CE-WashingStep2-Washing2ToWash_WashingStep1-Washing2ToWash',
      clientDescription: {
        applicationUri: 'urn:SIMATIC.S7-1500.OPC-UA.Application:WashingStep2',
        productUri: 'https://sample.com/s7-1500',
        applicationName: {
          text: 'SIMATIC.S7-1500.OPC-UA.Application:WashingStep2',
        },
        applicationType: 'Client',
        discoveryUrls: [],
      },
      endpointUrl: 'opc.tcp://192.168.2.103:4840',
      localeIds: [],
      actualSessionTimeout: 20000,
      maxResponseMessageSize: 2097152,
      clientConnectionTime: '2022-04-28T07:25:50.101Z',
      clientLastContactTime: '2022-04-28T12:28:07.801Z',
      currentSubscriptionsCount: 0,
      currentMonitoredItemsCount: 0,
      currentPublishRequestsInQueue: 0,
      totalRequestCount: {
        totalCount: 2200074,
        errorCount: 0,
      },
      unauthorizedRequestCount: 0,
      readCount: {
        totalCount: 1100978,
        errorCount: 0,
      },
      unregisterNodesCount: {
        totalCount: 0,
        errorCount: 0,
      },
    },
  },
};

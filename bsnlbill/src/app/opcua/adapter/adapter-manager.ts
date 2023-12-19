/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { AdapterMethods, AddressModelType } from '../../enum/enum';
import { ClientServerBrowse } from './client-server-model/client-server-browse-adapter';
import { ClientServerConnection } from './client-server-model/client-server-connection-adapter';
import { ClientServerMonitor } from './client-server-model/client-server-monitor-adapter';

export class DataAdapterManagers {
  /*
  * To return the adapter based on adater type received in input
  */
  static getadapter(adapterType: AddressModelType, adaperService: AdapterMethods) {
    let adapter;
    switch (adapterType) {
      /*
      * To return the adapter for client server model
      */
      case AddressModelType.CLIENT_SERVER:
        switch (adaperService) {
          /*
            * Connection adapter ts
          */
          case AdapterMethods.CONNECTION:
            adapter = ClientServerConnection;
            break;
          /*
            * Monitor adapter ts
          */
          case AdapterMethods.MONITOR:
            adapter = ClientServerMonitor;
            break;
          /*
            * browse adapter ts
          */
          case AdapterMethods.BROWSE:
            adapter = ClientServerBrowse;
            break;

          default:
            break;
        }
        break;
      case AddressModelType.FX_ADDRESSMODEL:
        break;
      default:
        break;
    }
    return adapter;
  }

}

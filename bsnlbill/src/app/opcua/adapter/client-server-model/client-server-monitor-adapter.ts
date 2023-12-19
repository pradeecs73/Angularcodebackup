/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { ObjectType } from '../../../enum/enum';
import { ConnectionRequestPayload } from '../../../models/connection.interface';
import { getConnectionData, isNullOrEmpty } from '../../../utility/utility';
import { Connector } from '../../opcnodes/connector';
import { MonitorAdapter } from '../base-adapter/monitor-adapter';

@Injectable({
  /*
    * 'root' refers service is provided at root level
    */
  providedIn: 'root',
})

export class ClientServerMonitor extends MonitorAdapter {

  /**
 * Set Attribute Data
 * @param eventName Tag Event Name
 * @param value Value
 */
  /*
  * Function to set the tag value for monitor
  */
  setTagValueFromMonitor(eventName: string, value, treeData) {
    const eventData = treeData.find(item => item.eventName === eventName);
    const index = treeData.findIndex(x => x.eventName === eventName);
    if (index > -1 && !isNullOrEmpty(value) && eventData && eventData.children) {
      treeData[index].children = this.setValues(eventData?.children, value);
    }
    return treeData;

  }


 /**
  * Function Returns the server diagnostic data
  * @param connector
  * @returns
  */
  getServerDiagnosticData(connector: Connector) {
    const connectionRequestPayload: ConnectionRequestPayload = getConnectionData(connector, this.facadeService.dataService.getProjectId());

    return this.facadeService.apiService.getServerDiagnosticData(connectionRequestPayload);
  }

  /**
   * Function to update the values for nodes
   * @param treeData
   * @param value
   * @returns
   */
  private setValues(treeData, value) {
    const obj = Object.keys(value);
    return treeData?.map(data => {
      const objData = obj.find(item =>
        item.toLocaleLowerCase() === data.name.toLocaleLowerCase()
      );
      if (objData) {
        if (typeof value[objData] === ObjectType.OBJECT && value[objData] !== null && data.children) {
          const objectKeys = Object.keys(value[objData]);
          for (const item of data.children) {
            const index = objectKeys.indexOf(item.name);
            item.value = value[objData][objectKeys[index]];
          }
          data.value = '';
        }
        else {
          data.value = value[objData];
        }
      }
      if (data && data.hasOwnProperty('children')) {
        data.children = this.setValues(data['children'], value[objData]);
      }
      return data;
    });
  }



}

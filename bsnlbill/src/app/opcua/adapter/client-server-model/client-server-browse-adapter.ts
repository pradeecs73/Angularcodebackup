/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

/*
* Imports for the service
*/ 
import { Injectable } from '@angular/core';

import { PropertiesType } from '../../../models/monitor.interface';
import { BrowseAdapter } from '../base-adapter/browse-adapter';


@Injectable({
    /*
    * 'root' refers service is provided at root level
    */
    providedIn: 'root'
})

export class ClientServerBrowse extends BrowseAdapter {
    /*
    * Used to create the panel tree data
    */ 
    createPanelTreeData(treeData:Array<PropertiesType>) {
        return this.createPanelData(treeData);
    }
    /*
    * Create panel data
    */
    private createPanelData(treeData) {
         return treeData.map(item => {
            item = { ...item }
            item['data'] = { name: item.name, type: item.type, value: item?.value };
            if (item && item.hasOwnProperty('children')) {
                item.children = this.createPanelData(item['children']);
            }

            return item;
        });
    }

}

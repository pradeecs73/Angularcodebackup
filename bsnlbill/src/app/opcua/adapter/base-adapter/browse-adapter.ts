/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { PropertiesType } from '../../../models/monitor.interface';
/*
* Interface for browser adapter
*/
interface IBrowseAdapter {
  createPanelTreeData(treeData: Array<PropertiesType>)
}

/*
* Browse adapter
*/
export abstract class BrowseAdapter implements IBrowseAdapter {
  abstract createPanelTreeData(treeData: Array<PropertiesType>);

}

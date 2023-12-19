/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Tree } from "../models/models";
import { AppState } from "../store/app.reducer";
import { FetchDevicesRequest, FetchDevicesSuccess } from "../store/device-tree/device-tree.actions";
import { DeviceTreeState } from "../store/device-tree/device-tree.reducer";

@Injectable({
  providedIn: 'root'
})
export class DeviceStoreService {

  constructor(private readonly store: Store<AppState>) { }
  /*
  *fetchDeviceTreeNodes
  */
  fetchDeviceTreeNodes(): void {
    this.store.dispatch(new FetchDevicesRequest());
  }
  /*
  *getDeviceTree
  */
  getDeviceTree(): Observable<DeviceTreeState> {
    return this.store.select('deviceTreeList');
  }
 /*
  *updateDevices
  */
  updateDevices(treeData: Tree) {
    this.store.dispatch(new FetchDevicesSuccess(treeData));
  }

}

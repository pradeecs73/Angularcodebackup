/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Actions, ofType, Effect } from '@ngrx/effects';
import { DeviceTreeActionTypes, FetchDevicesSuccess, FetchDevicesFailure } from './device-tree.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { Injectable } from '@angular/core';
import { Tree } from '../../models/models';


@Injectable()
export class DeviceTreeEffects {
    /*
    * Effects related to device tree
    */
    @Effect() fetchDevice = this.actions$.pipe(
        ofType(DeviceTreeActionTypes.FETCH_DEVICES_REQUEST),
        switchMap(() => {
            return this.api.discoverDevices()
                .pipe(
                    map((res: Tree) =>  new FetchDevicesSuccess(res)), 
                    catchError(err => of(new FetchDevicesFailure(err))
                    )
                );
        })
    );
    /*
    * end
    */

    constructor(private readonly actions$: Actions, private readonly api: ApiService) { }

}

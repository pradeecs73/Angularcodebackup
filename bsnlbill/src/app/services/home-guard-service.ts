/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { ApplicationStateService } from '../services/application-state.service';

/*
*guard plant editor route
*/
@Injectable()
/*
*class implement CanActivate interface as guard service
*/
export class HomeGuardService implements CanActivate {

    constructor(public applicationState: ApplicationStateService) { }


    /*
    *Return true if project is opened and navigate to plant editor, otherwise return false and redirect to home
    */
    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
       return this.applicationState.navigateRoute();
    }
}

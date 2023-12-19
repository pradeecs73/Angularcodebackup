/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FacadeService } from '../livelink-editor/services/facade.service';


//guard plant editor route
@Injectable({
  providedIn: 'root'
})
/*
*class implement CanActivate interface as guard service
*/
export class LiveLinkEditorGuardService implements CanActivate {
    private readonly $liveLink = new Subject();
    liveLinkActivateSub = this.$liveLink.asObservable();
    constructor(private readonly router: Router,private readonly facadeService: FacadeService) { }


    /*
    *Return true if project is opened and navigate to plant editor, otherwise return false and redirect to home
    */
    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {

        if (this.facadeService.saveService.openedProject) {
            return true;
        } else {
            this.router.navigate(['home']);
            this.changeLiveLinkRouteActiveteState(this.facadeService.saveService.openedProject);
            return false;
        }
    }

    /*
    *listens to change in when project is opened or closed
    */
    changeLiveLinkRouteActiveteState(data){
        this.$liveLink.next(data);
    }
}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { accessControl, AccessType } from '../../enum/enum';
import { FacadeService } from '../../livelink-editor/services/facade.service';

@Directive({
    selector: '[disableIfUnauthorized]'
})
export class DisableIfUnauthorizedDirective implements OnInit {
    @Input('disableIfUnauthorized') permission:accessControl; // Required permission passed in

    constructor(private readonly el: ElementRef,
        private readonly facadeService:FacadeService) { }
    /**
     *
     *
     * Check if element has permission else it assigns a disabled class to the element
  */
    ngOnInit() {
        if (!this.hasPermission(this.permission)) {
            this.el.nativeElement.classList.add('disabled')
        }
    }
    /**
     *
     *
     * Function to Check if it has read or write access
  */
    hasPermission(authGroup:accessControl) {
        if(this.facadeService.dataService.getProjectData() &&
        this.facadeService.dataService.getProjectData().project.isProtected) {
            const writeAccessFeaturesList =  JSON.parse(localStorage.getItem('config'));
            const permissionList = writeAccessFeaturesList && writeAccessFeaturesList.writeAccessFeatures;
            if (permissionList && permissionList.find(permission => {
                    return permission.name === authGroup && permission.isEnable
                    && this.facadeService.dataService.accessType === AccessType.WRITE
                })) {
                return true;
            }
            return false;
        }
        return true;
    }

}

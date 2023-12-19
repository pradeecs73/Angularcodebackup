/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { ErrorTypeList, NotificationType, Numeric ,dateDefaultLanguage} from '../enum/enum';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { Notification, NotificationDetail } from '../models/notification.interface';



@Injectable({
    providedIn: 'root'
})
export class NotifcationService {

    notificationList: Notification[] = [];

    constructor(private readonly facadeService: FacadeService) { }
    /*
    *
    * MEthod to update the notification list
    */
    pushNotificationToPopup(msg: NotificationDetail, type : NotificationType,code) {
        const notification = {
            type: type,
            message:msg,
            code: code,
            errorDate : new Date().toLocaleString(dateDefaultLanguage.UNITED_STATES),
            isRead : false
        };
        this.notificationList.push(notification);
        /*
        * Updates the services and count
        */
        this.facadeService.commonService.setErrorIcon(true, true);
        this.facadeService.commonService.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
    }

    /*
    * Function to clear all the notification
    */
    clearNotifications(notificationListArray:Notification[] ){
        this.notificationList = notificationListArray;
    }
}


/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*
*/

import { Pipe, PipeTransform } from '@angular/core';
import { Notification } from '../../models/notification.interface';
@Pipe({
    name: 'notificationPipe'
})
/*
* 
*
*Pipe to filter the notifications based on type
*/
export class NotificationPipe implements PipeTransform {
    transform(value: Notification[], notificationType: string): Notification[] {
        if(value.length && notificationType) {
            return value.filter(msg => msg.type.toLowerCase() === notificationType.toLowerCase());
        }
        return [];
    }
}



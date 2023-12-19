/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { NotificationType } from "../enum/enum"

/*
*
* Interface for the notification
*/
export interface Notification {
    type: NotificationType,
    message: NotificationDetail,
    code: string | number,
    errorDate?: string
    isRead?: boolean,
    showMore?: boolean
}
/*
*
* Interface for the notification message
*/
export interface NotificationDetail {
    content: string,
    params: unknown
}

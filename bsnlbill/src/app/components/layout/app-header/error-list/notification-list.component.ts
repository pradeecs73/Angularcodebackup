/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { isNullOrEmpty, log } from '../../../../utility/utility';
import errorLookUp from '../../../../../assets/error-data.json';
import { SUCCESS_CODE } from '../../../../utility/constant';
import { FacadeService } from '../../../../livelink-editor/services/facade.service';
import { Notification } from '../../../../models/notification.interface';
import { NotificationType,Numeric } from '../../../../enum/enum';
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationMsgListComponent implements OnInit {

  notificationMsgList: Notification[] = [];
  unreadMessageCount: Notification[] = [];
  @Output() onClearAllNotificationMessage = new EventEmitter();

  constructor(public facadeService: FacadeService) {
  }

  ngOnInit() {
  /*
  *
  * Specifically calling this method for the first time when ngOnInit() is called
  *
  */
    this.handleErrorData();
    this.subscribeToErrorCountChange();
  }
  /**
  * Fetches the notification list from common service ts
  */
  get notificationType() {
    return this.facadeService.commonService.notificationType;
  }

  /*
  *
  * called when the message is clicked
  *
  */
  readMessage(errorIndex) {
    this.notificationMsgList[errorIndex].isRead = true;
    this.facadeService.notificationService.notificationList = this.notificationMsgList;
    this.getUnReadErrorMessageCount();
  }

  /*
  *
  * To read all the notifications
  *
  */
  markAllRead() {
    this.notificationMsgList.forEach(errobj => {
      if (this.facadeService.commonService.notificationType === errobj.type) {
        errobj.isRead = true;
      }
    });
    this.facadeService.notificationService.notificationList = this.notificationMsgList;
    this.getUnReadErrorMessageCount();
  }

  /*
  *
  * Returns the unread error message count
  *
  */

  getUnReadErrorMessageCount() {
    this.unreadMessageCount = [];
    this.facadeService.commonService.noOfInfoMsgs = this.notificationMsgList.filter(msg => msg.type.toLowerCase() === NotificationType.INFO && !msg.isRead).length;
    this.facadeService.commonService.noOfWarningMsgs = this.notificationMsgList.filter(msg => msg.type.toLowerCase() === NotificationType.WARNING && !msg.isRead).length;
    this.facadeService.commonService.noOfErrorMsgs = this.notificationMsgList.filter(msg => msg.type.toLowerCase() === NotificationType.ERROR && !msg.isRead).length;
  }

  /*
  *
  * Used to clear the notification messages
  *
  */
  clearErrorMessages(type) {
    this.filterNotification(type);
    if(type === NotificationType.INFO){
      this.facadeService.commonService.noOfInfoMsgs = 0;
    }
    if(type === NotificationType.WARNING){
      this.facadeService.commonService.noOfWarningMsgs = 0;
    }
    if(type === NotificationType.ERROR){
      this.facadeService.commonService.noOfErrorMsgs = 0;
    }
    this.facadeService.notificationService.clearNotifications(this.notificationMsgList);
    this.onClearAllNotificationMessage.emit();
  }


  /**
  * Subscribing HandleErrorData() to errorCountStatusObs to handle the error data
  */
  private subscribeToErrorCountChange() {
    this.facadeService.commonService.errorCountStatusObs.subscribe(errorData => {
      const errorCategory = errorData as string;
      this.updateErrorData(errorCategory);
    });
  }

  /**
  * Handle the error data and count to be displayed in the UI
  */
  private handleErrorData(): void {
    const errorData = this.getErrorData();
    this.updateErrorList(errorData);
    this.updateErrorCount();

  }

  /**
 * Handle the error data and count to be displayed in the UI
 */
  updateErrorData(errorCategory: string): void {
    const errorData = this.getUpdatedErrorData(errorCategory);

    this.updateErrorList(errorData);
    this.updateErrorCount();
  }

  /**
   * Gets the updated error data list
   */
   getUpdatedErrorData(errorCategory: string): Notification[] {
    let errorDataList: Notification[] = [];

    switch (errorCategory) {
      case 'ERROR':
        errorDataList = this.getErrorsList();
        break;

      case 'EXCEPTION':
        errorDataList = this.getExceptionsList();
        break;

      case 'EXECUTION_ERROR':
        errorDataList = this.getExecutionErrorsList();
        break;

      default:
        errorDataList = this.updateUnknownError();
        break;
    }

    return errorDataList;

  }


  /**
  * Updates the error data for every error encountered
  */
  private updateErrorList(errorData: Notification[]): void {
    if (!isNullOrEmpty(errorData)) {
      errorData.forEach((errorObj: Notification) => {
        if(!errorObj.message.hasOwnProperty('content')){
          errorObj.message = {
            content : errorObj.code.toString(),
            params : {}
          };
        }
        if (this.facadeService.translateService.instant(errorObj.message.content,errorObj.message.params).length
        > Numeric.ONEHUNDRED) {
          errorObj.showMore = true;
        } else {
          errorObj.showMore = false;
        }
      });
      this.notificationMsgList = errorData;
      this.getUnReadErrorMessageCount();
    }
    else {
      log('No error data exists');
    }
  }
  /*
  *
  * Show arrow if the message length is greater than 100
  *
  */
  showArrow(error){
    let result;
    if (this.facadeService.translateService.instant(error.message.content,error.message.params).length
        > Numeric.ONEHUNDRED) {
          result = true;
    }else {
        result = false;
    }
    return result;
}

  /**
  * Updates the errorCount information which will be displayed in the UI
  */
  private updateErrorCount(): boolean {
    let result = false;

    if (!isNullOrEmpty(this.facadeService.commonService)) {
    this.facadeService.commonService.noOfInfoMsgs = this.notificationMsgList.filter(msg => msg.type.toLowerCase() === NotificationType.INFO && !msg.isRead).length;
    this.facadeService.commonService.noOfWarningMsgs = this.notificationMsgList.filter(msg => msg.type.toLowerCase() === NotificationType.WARNING && !msg.isRead).length;
    this.facadeService.commonService.noOfErrorMsgs = this.notificationMsgList.filter(msg => msg.type.toLowerCase() === NotificationType.ERROR && !msg.isRead).length;
      result = true;
    }
    else {
      log('Could not update number of errors encountered');
    }

    return result;
  }

  /**
  * Gets the list of all the errors data
  * @returns Error Data List
  */
  private getErrorData(): Notification[] {
    let errorDataList: Notification[] = [];

    if (this.facadeService.commonService.showErrorIcon) {
      if (!isNullOrEmpty(this.facadeService.commonService.allErrorCodeList) && this.facadeService.commonService.allErrorCodeList.length > 0) {
        errorDataList = this.getErrorsList();
      }
      else if (!isNullOrEmpty(this.facadeService.commonService.allGenericNotificationList) && this.facadeService.commonService.allGenericNotificationList.length > 0) {
        errorDataList = this.getExceptionsList();
      }
      else if (!isNullOrEmpty(this.facadeService.notificationService.notificationList) && this.facadeService.notificationService.notificationList.length > 0) {
        errorDataList = this.getExecutionErrorsList();
      }
      else {
        errorDataList = this.updateUnknownError();
      }
    }
    return errorDataList;
  }

  /**
    * Gets the errors data list
    * @returns Error Data List
    */
 getErrorsList(): Notification[] {
    const lookupData = (errorLookUp as unknown);
    const errorDataList: Notification[] = [];

    for (const item of this.facadeService.commonService.allErrorCodeList) {
      if (item !== SUCCESS_CODE) {
        const errorItem = lookupData[item];
        errorDataList.push(errorItem);
      }
    }

    return errorDataList;
  }

  /**
   * Gets the exceptions data list
   * @returns Error Data List
   */
  private getExceptionsList(): Notification[] {
    const errorDataList: Notification[] = [];

    if (!isNullOrEmpty(this.facadeService.commonService.allGenericNotificationList)) {
      this.facadeService.commonService.allGenericNotificationList.forEach(errorData => {

        if (!isNullOrEmpty(errorData.type) && !isNullOrEmpty(errorData.message) && !isNullOrEmpty(errorData.code)) {
          errorDataList.push({
            type: errorData.type,
            message: errorData.message,
            code: errorData.code
          });
        }
      });
    }

    return errorDataList;
  }

  /**
  * Returns the execution related error list
  */
  private getExecutionErrorsList(): Notification[] {
    const errorDataList: Notification[] = [];

    if (!isNullOrEmpty(this.facadeService.notificationService.notificationList)) {
      this.facadeService.notificationService.notificationList.forEach(errorData => {

        if (!isNullOrEmpty(errorData.type) && !isNullOrEmpty(errorData.message) && !isNullOrEmpty(errorData.code)) {
          errorDataList.push({
            type: errorData.type,
            message: errorData.message,
            code: errorData.code,
            errorDate : errorData.errorDate,
            isRead : errorData.isRead
          });
        }
      });
    }

    return errorDataList;
  }

  /**
 * Updates the unknown error data along with the ongoing operation
 */
  private updateUnknownError(): Notification[] {
    const errorDataList: Notification[] = [];

    if (!isNullOrEmpty(this.facadeService.overlayService.header)) {
      const onGoingOperation = this.facadeService.overlayService.header;
      errorDataList.push({
        type: NotificationType.ERROR,
        message :{
        content: 'notification.error.unknownError',
        params : {onGoingOperation :onGoingOperation }
        },
        code: ''
      });
    }
    return errorDataList;

  }
/*
  *
  * Used to filter the notifications
  *
  */
  filterNotification(type){
      this.notificationMsgList = this.notificationMsgList.filter(msg => msg.type !== type);
  }

}





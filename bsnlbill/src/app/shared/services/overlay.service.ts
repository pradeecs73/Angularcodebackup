/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OverlayType } from '../../enum/enum';

/*
* Overlay object
*/
export interface Overlay {
  message: OverlayMessage,
  type?: string;
  header: string; // title for the dialog
  successLabel?: string;
  optionalLabel?: string;
  cancelLabel?: string;
  enableCancelButton?: boolean;
  enableCloseButton?:boolean;
  acceptCallBack?: Function;
  optionalCallBack?: Function;
  cancelCallBack?: Function;
  prolongedText?: boolean;
  closeCallBack?: Function;
}
/*
* Overlay message interface
*/
export interface OverlayMessage {
  title?: string,
  content: string[];
}

@Injectable({
  providedIn: 'root'
})
export class OverlayService implements Overlay {

  successLabel: string;
  optionalLabel: string;
  cancelLabel: string;
  enableCancelButton: boolean;
  enableCloseButton: boolean;
  prolongedText : boolean;


  message: OverlayMessage;
  type: string;
  header: string;
  acceptCallBack: Function;
  optionalCallBack: Function;
  cancelCallBack: Function;
  closeCallBack : Function;


  private readonly showOverlayDialog = new Subject<boolean>();
  overlayStateChange = this.showOverlayDialog.asObservable();
  /*
  * Change overlay state to warning,error,loader
  */
  changeOverlayState(state: boolean): void {
    this.showOverlayDialog.next(state);
  }
  /*
  * To build overlay object
  */
  buildOverlayObject(overlay: Overlay): void {
    this.header = overlay.header;
    this.message = overlay.message;
    this.acceptCallBack = overlay.acceptCallBack;
    this.optionalCallBack = overlay.optionalCallBack;
    this.cancelCallBack = overlay.cancelCallBack;
    this.closeCallBack = overlay.closeCallBack;
    this.successLabel = overlay.successLabel;
    this.optionalLabel = overlay.optionalLabel;
    this.cancelLabel = overlay.cancelLabel;
    this.enableCancelButton = overlay.enableCancelButton;
    this.enableCloseButton = overlay.enableCloseButton;
    this.prolongedText = overlay.prolongedText;
  }
  /*
  * Confirm overlay popup
  */
  confirm(confirmation: Overlay): void {
    this.buildOverlayObject(confirmation);
    this.type = OverlayType.CONFIRM;
    this.changeOverlayState(true);
  }
  /*
  * loader overlay popup
  */
  loader(loader: Overlay): void {
    this.buildOverlayObject(loader);
    this.type = OverlayType.LOADER;
    this.changeOverlayState(true);
  }
  /*
  * warning overlay popup
  */
  warning(warning: Overlay): void {
    this.buildOverlayObject(warning);
    this.type = OverlayType.WARNING;
    this.changeOverlayState(true);
  }
  /*
  * error overlay popup
  */
  error(error: Overlay): void {
    this.buildOverlayObject(error);
    this.type = OverlayType.ERROR;
    this.changeOverlayState(true);
  }
  /*
  * success overlay popup
  */
  success(success: Overlay): void {
    this.buildOverlayObject(success);
    this.type = OverlayType.SUCCESS;
    this.changeOverlayState(true);
  }

  information(information: Overlay): void {
     this.buildOverlayObject(information);
     this.type = OverlayType.INFORMATION;
     this.changeOverlayState(true);
   }

  /*
  * clear the overlay object
  */
  clearOverlayData(): void {
    this.type = '';
    if (this.message) {
      this.message.content = [];
      this.message.title = '';
    }
    this.header = '';
    this.changeOverlayState(false);
  }

}

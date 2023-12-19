/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { Overlay, OverlayMessage, OverlayService } from '../../services/overlay.service';


@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverlayComponent implements Overlay {
  /*
  * Variables for the components are declared here
  */
  @Input() message: OverlayMessage;
  @Input() type: string;
  @Input() header: string; // title for the dialog
  @Input() acceptCallBack: (args) => void;
  @Input() optionalCallBack: (args?) => void;
  @Input() cancelCallBack: (args?) => void;
  @Input() closeCallBack: (args?) => void;
  @Input() successLabel = 'OK'; // title for the dialog
  @Input() optionalLabel = 'No';
  @Input() cancelLabel = 'Cancel';
  @Input() enableCancelButton = false;
  @Input() prolongedText = false;
  @Input() enableCloseButton = true;

  // @ViewChild('pop', { static: false }) pop: PopoverComponent;
  @ViewChild('viewErr') viewErr: ElementRef;
  constructor(
    private readonly facadeService: FacadeService ,private readonly overlayService : OverlayService
  ) {
  }
  /*
  * When close button is clicked
  */
  closeDialog() {
    this.overlayService.changeOverlayState(false);
    if(this.closeCallBack){
      this.closeCallBack();
    }
  }
    /*
  * Show the notification popup
  */
  viewErrors() {
    this.facadeService.commonService.viewErrorBtn = this.viewErr;
    this.facadeService.commonService.popoverRef.displayErrors();
    this.overlayService.changeOverlayState(false);

  }
  /*
  * When 'Successlabel' option is clicked
  */
  successCallBack()
  {
    this.closeDialog();
    if(this.acceptCallBack)
    {
      this.acceptCallBack(this.viewErr);
    }
  }
 /*
  * When 'CancelLabel' option is clicked
  */
  cancelCallBackHandler()
  {
    this.closeDialog();
    if(this.cancelCallBack)
    {
      this.cancelCallBack();
    }
  }
/*
  * When 'OptionLabel' option is clicked
  */
  optionalCallBackHandler()
  {
    this.closeDialog();
    if(this.optionalCallBack)
    {
      this.optionalCallBack();
    }
  }

}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { createPopperLite as createPopper, flip, preventOverflow } from '@popperjs/core';
import { Numeric } from '../../enum/enum';
import { FacadeService } from '../../livelink-editor/services/facade.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements  AfterViewInit {
  popperInstance = null;
  targetButton;
  popoverBody: HTMLElement;
  showPopOver = false;
  constructor(private readonly el: ElementRef, private readonly facadeService: FacadeService,) {
  }
  /*
  * Display the notification popup
  */
  ngAfterViewInit() {
    this.popoverBody = this.el.nativeElement.querySelector('#tooltip');

    this.facadeService.commonService.targetBtnVisibilityChange.subscribe(value => {
      this.targetButton = value;
      this.facadeService.commonService.popoverRef = this;
    });
    this.facadeService.commonService.popoverRef = this;

  }
  /*
  * Display error popup if the popup is not open &  if the popup is open close the popup
  */
  public handleErrorIconClick() : void{
    if (!this.showPopOver) {
      this.displayErrors();
    }
    else {
      this.hideErrors();
    }
  }
  /*
  * Function to display errors
  */
  public displayErrors() : void{
    this.popoverBody.setAttribute('data-show', '');
    this.createPopper();
    this.showPopOver = true;
  }
 /*
  * Function to Hide errors
  */
  public hideErrors() : void{
    this.popoverBody.removeAttribute('data-show');
    this.destroyPopper();
    this.showPopOver = false;
  }
   /*
  * Function to create error popup
  */
  private createPopper() : void{
    this.popperInstance = createPopper(this.targetButton, this.popoverBody, {
      modifiers: [preventOverflow, flip,
        {
          name: 'offset',
          options: { offset: [0, Numeric.EIGHT] }
        }]
    });
  }
   /*
  * Function to destroy error popup
  */
  private destroyPopper() : void{
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
  /*
  * Function to close error popup
  */
  closeErrorPopup(){
     this.hideErrors();
  }

}

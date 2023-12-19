/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { log } from '../../utility/utility';
import { CommonService } from '../../services/common.service';

@Directive({
  selector: '[appClickOutside]'
})
/**
     *
     *Directive to perform some actions when we click outside an area or AC
  */
export class ClickOutsideDirective {

  @Output() appClickOutside = new EventEmitter<void>();
  constructor(private readonly elementRef: ElementRef, private readonly common: CommonService) { }
  /**
     *
     *
     * Host listener when we click outside  the AC 
  */
  @HostListener('document:click', ['$event.target'])
  /**
     *
     *
     * Function is called when we click oustide the AC or an area
  */
  public onClick(target) {
    let clickInsideOverlay = false;
    if(this.elementRef )
    {
      clickInsideOverlay=this.elementRef.nativeElement.contains(target);
    }

    let clickInsideErrorIcon = false;
    if(this.common.errorIcon)
    {
      clickInsideErrorIcon=this.common.errorIcon.contains(target);
    }

    if (this.common.viewErrorBtn) {
      log(target);
      const clickInsideViewErrorBtn = this.common.viewErrorBtn.nativeElement.contains(target);

      if (!clickInsideOverlay && !clickInsideErrorIcon && !clickInsideViewErrorBtn) {
        log('directive',this.common.viewErrorBtn);
        this.appClickOutside.emit();
      }
    } else if (!clickInsideOverlay && !clickInsideErrorIcon) {
      this.appClickOutside.emit();
    }else{
      return;
    }
  }
}

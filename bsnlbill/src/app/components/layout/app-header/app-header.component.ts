/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ErrorIconVisibility } from '../../../../app/models/models';
import { NotificationType } from '../../../enum/enum';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { PopoverComponent } from '../../../shared/popover/popover.component';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppHeaderComponent implements AfterViewChecked {

  @ViewChild('pop') pop: PopoverComponent;

  showError = false;
  errorCount = this.facadeService.commonService.noOfErrorMsgs;
  items;
  constructor(public facadeService: FacadeService,
    public readonly elem: ElementRef, private readonly cdr: ChangeDetectorRef) {
  }

  ngAfterViewChecked() {

    this.facadeService.commonService.notificationVisibilityChange.subscribe((notificationIcon:  ErrorIconVisibility) => {
      this.showError = notificationIcon.value;
      if (this.showError) {
        this.facadeService.commonService.errorIcon = this.elem.nativeElement.querySelector(`.${notificationIcon.type}`);
        if (this.facadeService.commonService.errorIcon && this.facadeService.commonService.errorIcon != null) {
          this.facadeService.commonService.changeTargetBtn(this.elem.nativeElement.querySelector(`.${notificationIcon.type}`));
          this.cdr.detectChanges();
        }
      }
    });
  }

  /*
  *
  * close notification popup
  *
  */
  hidePopover() {
    this.pop.hideErrors();
  }

  /*
  *
  * Displays error notifications
  *
  */
  handleErrorIconClick() {
    this.facadeService.commonService.notificationType = NotificationType.ERROR;
    this.facadeService.commonService.changeErrorIconVisibility({ value: true, type: NotificationType.ERROR });
    this.pop?.handleErrorIconClick();
  }
  /*
  *
  * Displays info notifications
  *
  */
  handleInfoIconClick() {
    this.facadeService.commonService.notificationType = NotificationType.INFO;
    this.facadeService.commonService.changeErrorIconVisibility({ value: true, type: NotificationType.INFO });
    this.pop?.handleErrorIconClick();
  }

  /*
  *
  * Displays warning notifications
  *
  */
  handleWarningIconClick() {
    this.facadeService.commonService.notificationType = NotificationType.WARNING;
    this.facadeService.commonService.changeErrorIconVisibility({ value: true, type: NotificationType.WARNING });
    this.pop?.handleErrorIconClick();
  }

  getClassDetails(type: string) {
    return this.pop?.showPopOver && this.facadeService.commonService.notificationType === type;
  }
}

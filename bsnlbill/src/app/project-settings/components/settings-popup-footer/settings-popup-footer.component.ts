/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { AccessType, OperationMode } from './../../../enum/enum';

@Component({
  selector: 'app-settings-popup-footer',
  templateUrl: './settings-popup-footer.component.html',
  styleUrls: ['./settings-popup-footer.component.scss']
})
export class SettingsPopupFooterComponent implements OnInit, OnChanges {

  @Input() passwordForminvalid: boolean;
  @Input() formgroups;
  @Input() passwordsIdentity: boolean;
  @Output() closePopup = new EventEmitter();
  @Input() mode: string;
  submitButtonText:string;
  @Output('formSubmit') emitFormValues = new EventEmitter();

  constructor(private readonly facadeService: FacadeService) { }
  /*
  * Life cycle hook is called when the page initializes
  */
  ngOnInit(): void {
    this.setUpPopupButton();
  }
  /*
  * Sets the button name based on mode
  */
  setUpPopupButton(){
    switch (this.mode) {
      /*
      *If the mode is read or write
      */
      case AccessType.READ:
      case AccessType.WRITE:
         this.submitButtonText= this.facadeService.translateService.instant('setting.securitySetting.buttons.setupPassword');
        break;
        /*
        * If the mode is change write password
        */
       case OperationMode.CHANGE_WRITE_PASSWORD:
         this.submitButtonText= this.facadeService.translateService.instant('setting.securitySetting.buttons.changePassword');
        break;
         /*
        * If the mode is change read password
        */
       case OperationMode.CHANGE_READ_PASSWORD:
         this.submitButtonText= this.facadeService.translateService.instant('setting.securitySetting.buttons.changePassword');
        break;
         /*
        * default
        */
      default:
        return;
    }
  }
   /*
  * Life cycle hook is called when there are changes
  */
  ngOnChanges(): void {
    if (this.formgroups && Array.isArray(this.formgroups)) {
      this.passwordForminvalid = this.formgroups.some(data => data.formGroup.invalid);
      this.passwordsIdentity = !(this.formgroups.some(data => (data.formGroup.get('password')?.value !== data.formGroup.get('confirmPassword')?.value)));
    }
  }
   /*
  * On click of submit button
  */
  onSubmit() {
    if (this.formgroups) {
      this.emitFormValues.emit(this.formgroups);
    }
  }
   /*
  * On click of close button
  */
  close() {
      this.closePopup.emit();
  }

}

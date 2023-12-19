/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { addMethods } from '../../../../app/utility/constant';
import { addDeviceOption, AddDeviceType } from '../../../enum/enum';


@Component({
  selector: 'device-add-mechanism-selector',
  templateUrl: './device-add-mechanism-selector.component.html',
  styleUrls: ['./device-add-mechanism-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeviceAddMechanismSelectorComponent implements OnInit{
    addMethods;
   /*  add method form for selecting radio button */
    addMethodForm: FormGroup;
    @Output() onNextPage = new EventEmitter();

    ngOnInit(){
      this.addMethods = addMethods;
     /*  if the radio button is not disable,select the default selection */
      if(!this.addMethodForm){
        this.addMethodForm = new FormGroup({
          'addMethod' : new FormControl(addDeviceOption.ADDUSINGIP)
        });
      }
      // Form data is not emitting to parent when it is initialized
      // On manual user click it emits data
      this.onNext();
      this.addMethodForm.valueChanges.subscribe(()=>{
          this.onNext();
      });
    }

    /**
    * Emits 'detail' to device add
    * dialog which calls device add details
    * page on click of 'next' button
    *
    */
    onNext(){
      // based on user selection on clicking on next
      // corresponding event is emitted to parent component
      if (this.addMethodForm.controls.addMethod.value === addDeviceOption.ADDUSINGUPLOAD) {
        this.onNextPage.emit(AddDeviceType.IMPORT_FROM_FILE);
      } else {
        this.onNextPage.emit(AddDeviceType.BROWSE_ONLINE);
      }
    }
}

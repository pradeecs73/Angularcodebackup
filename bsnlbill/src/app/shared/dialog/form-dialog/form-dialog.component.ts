/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, OnInit, ViewChild, ComponentFactoryResolver, EventEmitter, Output, Input, ChangeDetectorRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { DynamicDialogDirective } from './directives/dynamic-dialog.directive';
import { DynamicComponentManifest } from '../../../models/dynamic-componet-manifest.interface';
import { FormOverlay } from './form-overlay';
import { formOverLayMap } from './form-overlay.util';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormDialogComponent implements OnInit,AfterViewChecked {

  @Input() component: string;
  @Input() show=false;
  @Input() data:{};
  @Input() inputs;
  @Output() onHide = new EventEmitter();
  @Output() onEventSucess = new EventEmitter();
  @Output() onEventSucess2 = new EventEmitter();
  @Output() onEventSucess3 = new EventEmitter();
  @Output() onCustomEvent = new EventEmitter();

  title:string;

  @ViewChild(DynamicDialogDirective,{static :true}) dynamicDialog:DynamicDialogDirective;

  constructor(private readonly componentFactoryResolver:ComponentFactoryResolver,private readonly cdr: ChangeDetectorRef,private readonly facadeService: FacadeService) { }


  componentRef;
  componentMetadata:DynamicComponentManifest;
  ngOnInit(): void {
    this.loadComponent();
  }
  /*
  * Function is used to load the component dynamically
  */
  loadComponent() {
    //const factories = Array.from(this.componentFactoryResolver['_factories'].keys());
    //const factoryClass = <Type<any>>factories.find((x: any) => x.name === this.component);
    //const factory = this.resolver.resolveComponentFactory(factoryClass);
    this.componentMetadata=formOverLayMap[this.component];
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentMetadata.component);
    const viewContainerRef = this.dynamicDialog.viewContainerRef;
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.title=(this.componentRef.instance as FormOverlay).title;
    this.assignInputs();
    this.assignOutputs();
  }
  /*
  * Function is used to assign the inputs to the component
  */
  assignInputs()
  {
    this.componentRef.instance[this.componentMetadata.data] = this.data;
    if(this.inputs)
    {
      Object.keys(this.inputs).forEach(input => {
        const value=this.inputs[input];
        this.componentRef.instance[input] = value;
      });
    }
  }
  /*
  * Function is used to assign the outputs of the component
  */
  assignOutputs()
  {
    this.componentRef.instance[this.componentMetadata.saveEvent].subscribe(data => {
      this.onSave(data);
    });
    this.componentRef.instance[this.componentMetadata.closeEvent].subscribe(_data => {
      this.cancel();
    });
    if (this.componentMetadata.customActionEvent && this.componentRef.instance[this.componentMetadata.customActionEvent]) {
      this.componentRef.instance[this.componentMetadata.customActionEvent].subscribe(data => {
        this.customActionEvent(data);
      });
    }
  }
  /*
  *After view is initialized title is et
  */
  ngAfterViewChecked(): void {
    this.title=this.componentRef.instance['title'];
    this.cdr.detectChanges();
  }
  /*
  * when save is clicked
  */
  onSave(data)
  {
      this.show=false;
      this.onEventSucess.emit(data);
  }
  /*
  * when cancel is clicked
  */
  cancel()
  {
    this.show=false;
    this.onHide.emit();
  }
  /*
  * Extra event to be triggered from the component
  */
  customActionEvent(data) {
    this.show = false;
    this.onCustomEvent.emit(data);
  }
  /*
  * Function is used to set error related to setup password
  */
  setPasswordError(errorCode:string){
    this.componentRef.instance.passwordsForm.patchValue({'password':'','confirmPassword':''});
    this.componentRef.instance.passwordValidationError=this.facadeService.translateService.instant(`setting.securitySetting.error.${errorCode}`);
  }
/*
  * Function is used to set error related to change password
  */
  changePasswordError(errorCode:string){
    this.componentRef.instance.passwordsForm.patchValue({'oldPassword':'','password':'','confirmPassword':''});
    this.componentRef.instance.passwordValidationError=this.facadeService.translateService.instant(`setting.securitySetting.error.${errorCode}`);
  }
  /*
  * Function is used to remove validation error message
  */
  removeValidationErrorMessages(){
    this.componentRef.instance.passwordValidationError='';
  }


}

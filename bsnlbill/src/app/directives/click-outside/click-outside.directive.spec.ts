/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ClickOutsideDirective } from './click-outside.directive';
import { CommonService } from '../../services/common.service';
import { ElementRef } from '@angular/core';


fdescribe('ClickOutsideDirective', () => {

  it('should create an instance', () => {
     let elementref={} as unknown as ElementRef<any>;
     let commonService={} as unknown as CommonService;
     const directive = new ClickOutsideDirective(elementref,commonService);
     expect(directive).toBeTruthy();
  });

  it('should call onClick method', () => {
    let elementref={
      nativeElement:{
        contains:()=>false
      }
    } as unknown as ElementRef<any>;

    let commonService={
      errorIcon:{
        contains:()=>true
      }
    } as unknown as CommonService;

    let directive = new ClickOutsideDirective(elementref,commonService);
    const target={};

    spyOn(directive.appClickOutside,'emit').and.callThrough();
    directive.appClickOutside.emit();
    directive.onClick(target);
    expect(directive).toBeTruthy();
    expect(directive.appClickOutside.emit).toHaveBeenCalled();

    commonService={
      errorIcon:{
        contains:()=>false
      },
      viewErrorBtn:{
        nativeElement:{
          contains:()=>false
        }
      }
    } as unknown as CommonService;

    directive = new ClickOutsideDirective(elementref,commonService);

    spyOn(directive.appClickOutside,'emit').and.callThrough();
    directive.appClickOutside.emit()
    directive.onClick(target);
    expect(directive).toBeTruthy();
    expect(directive.appClickOutside.emit).toHaveBeenCalled();

    let commonServicemock={
      errorIcon:{
        contains:()=>false
      },
      viewErrorBtn:null
    } as unknown as CommonService;

    directive = new ClickOutsideDirective(elementref,commonServicemock);

    const clickReturnValue= directive.onClick(target);
    expect(directive).toBeTruthy();
    expect(clickReturnValue).toBe(undefined);

 });

});

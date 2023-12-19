/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { AppHeaderComponent } from './app-header.component';
import { LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { PopoverComponent } from '../../../shared/popover/popover.component';
import { NotificationType } from '../../../enum/enum';


fdescribe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let facadeMockService;


  beforeEach(waitForAsync(() => {

    facadeMockService=new FacadeMockService();
    facadeMockService.commonService.notificationVisibilityChange = of(false);
    TestBed.configureTestingModule({
      declarations: [ AppHeaderComponent ],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [  { provide: FacadeService, useValue: facadeMockService},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show error', () => {
    facadeMockService.commonService.notificationVisibilityChange = of({value:true,type:'info'});
    const pElement = document.createElement('p');
    pElement.classList.add('info');
    component.elem.nativeElement.appendChild(pElement);
    component.ngAfterViewChecked();
    expect(component.showError).toEqual(true);
  });

  it('should call hidePopover method', () => {
    component.pop= {hideErrors: () => true} as unknown as PopoverComponent;
    spyOn(component.pop,'hideErrors');
    component.hidePopover();
    expect(component.hidePopover).toBeDefined();
    expect(component.pop.hideErrors).toHaveBeenCalled();
  });

  it('should call handleErrorIconClick method', () => {
    component.pop= {handleErrorIconClick: () => true} as unknown as PopoverComponent;
    spyOn(component.pop,'handleErrorIconClick');
    component.handleErrorIconClick();
    expect(component.handleErrorIconClick).toBeDefined();
    expect(component.pop.handleErrorIconClick).toHaveBeenCalled();
    expect(facadeMockService.commonService.notificationType).toEqual(NotificationType.ERROR);
  });

  it('should call handleInfoIconClick method', () => {
    component.pop= {handleErrorIconClick: () => true} as unknown as PopoverComponent;
    spyOn(component.pop,'handleErrorIconClick');
    component.handleInfoIconClick();
    expect(component.handleInfoIconClick).toBeDefined();
    expect(component.pop.handleErrorIconClick).toHaveBeenCalled();
    expect(facadeMockService.commonService.notificationType).toEqual(NotificationType.INFO);
  });

  it('should call handleWarningIconClick method', () => {
    component.pop= {handleErrorIconClick: () => true} as unknown as PopoverComponent;
    spyOn(component.pop,'handleErrorIconClick');
    component.handleWarningIconClick();
    expect(component.handleWarningIconClick).toBeDefined();
    expect(component.pop.handleErrorIconClick).toHaveBeenCalled();
    expect(facadeMockService.commonService.notificationType).toEqual(NotificationType.WARNING);
  });

  it('should call getClassDetails method', () => {
    component.pop= {handleErrorIconClick: () => true,showPopOver:true} as unknown as PopoverComponent;
    facadeMockService.commonService.notificationType='info';
    component.getClassDetails('info');
    expect(component.getClassDetails).toBeDefined();
  });

});

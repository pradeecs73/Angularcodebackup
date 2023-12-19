/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { PopoverComponent } from './popover.component';

declare var Popper: any;
let facadeMockService;
fdescribe('PopoverComponent', () => {
  let component: PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;
  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();
    facadeMockService.commonService.targetBtnVisibilityChange = of(true);
    TestBed.configureTestingModule({
      declarations: [PopoverComponent],
      providers: [{ provide: FacadeService, useValue: facadeMockService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleErrorIconClick method', () => {
    component.handleErrorIconClick();
    expect(component.handleErrorIconClick).toBeDefined();
    component.showPopOver = true;
    component.handleErrorIconClick();
  });

  it('should call closeErrorPopup method', () => {
    component.closeErrorPopup();
    expect(component.closeErrorPopup).toBeDefined();
  });

});

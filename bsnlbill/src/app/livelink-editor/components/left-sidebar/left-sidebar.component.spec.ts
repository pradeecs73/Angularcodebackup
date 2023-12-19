/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { LeftSidebarComponent } from './left-sidebar.component';

fdescribe('LeftSidebarComponent', () => {
  let component: LeftSidebarComponent;
  let fixture: ComponentFixture<LeftSidebarComponent>;
  let facadeMockService;

  beforeEach(async () => {
    facadeMockService = new FacadeMockService();
    await TestBed.configureTestingModule({
      declarations: [LeftSidebarComponent],
      providers: [
        { provide: FacadeService, useValue: facadeMockService },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call removeWidth method', () => {
    const event = { mode: 'full' };
    component.removeWidth(event);
    expect(component.removeWidth).toBeDefined();
  });

});

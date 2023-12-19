/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { LiveLinkComponent } from './livelink.component';
import { FacadeMockService } from './services/facade.mock.service';
import { FacadeService } from './services/facade.service';

fdescribe('LiveLinkComponent', () => {
  let component: LiveLinkComponent;
  let fixture: ComponentFixture<LiveLinkComponent>;
  let mockMessageService: MessageService;
  let facadeMockService;
  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();
    TestBed.configureTestingModule({
      declarations: [LiveLinkComponent],
      providers: [{ provide: MessageService, useValue: mockMessageService },
      { provide: FacadeService, useValue: facadeMockService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

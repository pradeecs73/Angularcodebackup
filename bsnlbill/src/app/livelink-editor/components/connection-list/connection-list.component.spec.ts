/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { ConnectionListComponent } from './connection-list.component';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('ConnectionListComponent', () => {
  let component: ConnectionListComponent;
  let fixture: ComponentFixture<ConnectionListComponent>;
  let messageService: MessageService;
  let mockStore: Store;
  let mockHttpClientService: HttpClient;
  let facadeMockService;
  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();
    TestBed.configureTestingModule({
      declarations: [ConnectionListComponent],
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: Store, useValue: mockStore },
        { provide: FacadeService, useValue: facadeMockService },
        { provide: HttpClient, useValue: mockHttpClientService },
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot({})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onApply', () => {
    const evt = new Event('mouse');
    spyOn(component.applyConChanges, 'emit');
    component.onApply(evt);
    expect(component.applyConChanges.emit).toHaveBeenCalled();
  });

  it('showList', () => {
    component.showList();
    expect(component.showList).toBeDefined();
  });

  it('confirm with true condition', () => {
    Object.getOwnPropertyDescriptor(facadeMockService.applicationStateService, 'isOnline').value.and.returnValue(true);
    const obj = {
      connector: {
        diagnose: true,
        partner: 'abc'
      }
    };
    facadeMockService.overlayService.confirm.and.callFake(function (args) {
      args.acceptCallBack();
    });
    component.confirm(obj);
    expect(facadeMockService.overlayService.confirm).toHaveBeenCalled();
  });



  it('confirm with false condition', () => {
    const obj = {
      connector: {
        diagnose: false,
        partner: ''
      }
    }
    component.confirm(obj);
    expect(facadeMockService.overlayService.confirm).toHaveBeenCalled();
  });

});

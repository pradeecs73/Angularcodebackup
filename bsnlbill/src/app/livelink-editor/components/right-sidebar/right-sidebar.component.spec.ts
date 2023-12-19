/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injector } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonService } from 'src/app/services/common.service';
import { RightSidebarComponent } from './right-sidebar.component';
import { Store } from '@ngrx/store';
import { FacadeService } from '../../services/facade.service';
import { FacadeMockService } from '../../services/facade.mock.service';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('RightSidebarComponent', () => {
  let component: RightSidebarComponent;
  let fixture: ComponentFixture<RightSidebarComponent>;
  let mockStore:Store;
  let facadeMockService;
  let messageService: MessageService;

  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    facadeMockService.commonService.isOnline = false;
    TestBed.configureTestingModule({
      declarations: [ RightSidebarComponent ],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: MessageService, useValue: messageService },
        { provide: FacadeService, useValue: facadeMockService},
        Injector
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('remove width',()=>{
    const mode = 'full';
    spyOn(component.removeElementWidth, 'emit');
    component.removeWidth(mode);
    expect(component.viewType).toEqual(mode);
    facadeMockService.editorService.setDevicePropertyPanelData(mode)
    expect(component.removeElementWidth.emit).toHaveBeenCalled();
    expect(facadeMockService.editorService.setDevicePropertyPanelData).toHaveBeenCalledWith(mode);
  })

});

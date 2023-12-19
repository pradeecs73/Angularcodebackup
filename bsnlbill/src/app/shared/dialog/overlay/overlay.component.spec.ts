/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OverlayComponent } from './overlay.component';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from "primeng/panel";
import { OverlayService } from '../../services/overlay.service';
import { PopoverComponent } from '../../popover/popover.component';
import { FacadeMockService } from 'src/app/livelink-editor/services/facade.mock.service';
import { FacadeService } from 'src/app/livelink-editor/services/facade.service';

let facadeMockService;
fdescribe('OverlayComponent', () => {
  let component: OverlayComponent;
  let fixture: ComponentFixture<OverlayComponent>;
  let mockOverlayService : OverlayService;
  facadeMockService=new FacadeMockService();

  beforeEach(waitForAsync(() => {
    mockOverlayService = jasmine.createSpyObj('mockOverlayService',[
      'changeOverlayState'
    ]);
    TestBed.configureTestingModule({
      imports: [CardModule,ToolbarModule,PanelModule],
      declarations: [ OverlayComponent ],
      providers:[
        { provide: FacadeService, useValue: facadeMockService},
        {provide:OverlayService,useValue:mockOverlayService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when the dialog is closed',()=>{
    component.closeDialog();
  expect(mockOverlayService.changeOverlayState).toHaveBeenCalledWith(false);
  })

  it('to view the errors',()=>{
    facadeMockService.commonService.popoverRef = {displayErrors: () => false} as unknown as PopoverComponent;
    component.viewErrors();
    spyOn( facadeMockService.commonService.popoverRef,'displayErrors');
    expect(mockOverlayService.changeOverlayState).toHaveBeenCalledWith(false);
   
  })

  it('when success option is clicked',()=>{
    component.successCallBack();
    const spy=spyOn(component,'closeDialog');
    component.successCallBack();
    expect(spy).toHaveBeenCalled();  
  })

  it('call cancel call back function if cancel option is clicked',()=>{
    component.cancelCallBack = (args) => {}
    component.cancelCallBackHandler();
    const spy=spyOn(component,'cancelCallBack');
    component.cancelCallBack();
    expect(spy).toHaveBeenCalled();  
  })

  it('call cancel call back function if cancel option is clicked',()=>{
    component.acceptCallBack = (args) => {}
    component.successCallBack();
    const spy=spyOn(component,'acceptCallBack');
    component.acceptCallBack(component.viewErr);
    expect(spy).toHaveBeenCalled();  
  })

  it('call optional call back function if  optional option is clicked',()=>{
    component.optionalCallBack = (args) => {}
    component.optionalCallBackHandler();
    const spy=spyOn(component,'optionalCallBack');
    component.optionalCallBack();
    expect(spy).toHaveBeenCalled();  
  })
});

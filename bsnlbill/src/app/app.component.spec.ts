/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ElementRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NgIdleModule } from '@ng-idle/core';
import {  TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { LocalStorageKeys, Numeric } from './enum/enum';
import { FacadeMockService } from './livelink-editor/services/facade.mock.service';
import { FacadeService } from './livelink-editor/services/facade.service';


fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let elem: ElementRef;
  let facadeMockService;
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    translate = jasmine.createSpyObj('TranslateService', ['addLangs','use']);
    facadeMockService=new FacadeMockService();
    facadeMockService.commonService.languageChangeSub = of('en');
    facadeMockService.overlayService.overlayStateChange = of(true);
    facadeMockService.commonService.startIdleTimer=0.1;
    facadeMockService.commonService.sessionIdleTimeout=false;
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'getLanguage').value.and.returnValue(of({data: {language: 'en'},error: null, status:'SUCCESS'}));
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'clearSessions').value.and.returnValue(of({}));
    Object.getOwnPropertyDescriptor(facadeMockService.socketService, 'getIo').value.and.
    returnValue({disconnect:()=>{return {connect:()=>true}}});
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports:[NgIdleModule.forRoot()],
      providers: [
        { provide: FacadeService, useValue: facadeMockService},
        { provide: TranslateService, useValue: translate }
      ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.title).toBeDefined();
  });

  it('should call removeDevice on beforeunload event', () => {
    component.onUnload(new Event('unload'));
    expect(component.onUnload).toBeDefined();
    expect(facadeMockService.saveService.clearOnUnload).toHaveBeenCalled();
  });

  it('should start subscribe after view init',fakeAsync(()=>{
    component.ngAfterViewInit();
    tick(Numeric.THOUSAND);
    fixture.detectChanges();
    fixture.whenStable().then(()=>{
      expect(component.showOverlayDialog).toBeFalse();
    })
  }));

  it('should call reset method',()=>{
    component.reset();
    expect(component.reset).toBeDefined();
  });

  it('should call reset method',()=>{
    component.reset();
    expect(component.reset).toBeDefined();
  });

  it('should call openSessionTimeoutNotification method',()=>{
    component.openSessionTimeoutNotification({});
    expect(component.openSessionTimeoutNotification).toBeDefined();
  });

  it('overlay state change returns undefined',()=>{
    facadeMockService.overlayService.overlayStateChange = of(undefined);
  })

  it('detectBrowserCrash',()=>{
    localStorage.setItem(LocalStorageKeys.applicationTimeStamp, `${new Date()}`);
    localStorage.setItem(LocalStorageKeys.windows, '0');
    component.restrictMultiTab();
    expect(facadeMockService.commonService.setActiveTabState).toHaveBeenCalled();
  })

  it('idle configuration',()=>{
    component.writeApplicationTimeStamp();
    expect(localStorage).toBeDefined();
  })


  it('should call  onBeforeunload event', () => {
    localStorage.setItem(LocalStorageKeys.windows, '1');
    facadeMockService.commonService.activeTabState = 2;
    component.onBeforeunload(new Event('beforeunload'));
    expect(component.onBeforeunload).toBeDefined();
  });

});

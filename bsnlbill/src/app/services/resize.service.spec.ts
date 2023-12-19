/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DevicesComponent } from '../devices/devices.component';
import { LiveLinkComponent } from '../livelink-editor/livelink.component';
import { ResizeService } from './resize.service';
let service: ResizeService;
let devicesComponent: DevicesComponent;
let devicesFixtures: ComponentFixture<DevicesComponent>;
let liveLinkFixture: ComponentFixture<LiveLinkComponent>;
let liveLinkComponent: LiveLinkComponent;
let messageService: MessageService;

export class MockElementRef extends ElementRef {
  constructor() { super(null); }
}

fdescribe('resize service', () => {
  let elementPositionCollapsedLeft = {
    mode: 'collapsed',
    position: 'left',
  };
  let elementPositionFullLeft = {
    mode: 'full',
    position: 'left',
  };
  let elementPositionCollapsedRight = {
    mode: 'collapsed',
    position: 'right',
  };
  let elementPositionFullRight = {
    mode: 'full',
    position: 'right',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevicesComponent, LiveLinkComponent],
      providers: [{ provide: ElementRef, useValue: MockElementRef },
      { provide: MessageService, useValue: messageService },
      ],
      imports: [TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(ResizeService);
    devicesFixtures = TestBed.createComponent(DevicesComponent);
    devicesComponent = devicesFixtures.componentInstance;
    devicesFixtures.detectChanges();
    liveLinkFixture = TestBed.createComponent(LiveLinkComponent);
    liveLinkComponent = liveLinkFixture.componentInstance;
    liveLinkFixture.detectChanges();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('resize device view width with collapsed mode and left side', () => {
    const elementRef: ElementRef = devicesComponent['elementRef'];
    service.resizeDeviceWidth(elementPositionCollapsedLeft, elementRef);
    expect(service.resizeDeviceWidth).toBeDefined();
  });

  it('resize device view width with full mode and right side', () => {
    const elementRef: ElementRef = devicesComponent['elementRef'];
    service.resizeDeviceWidth(elementPositionFullLeft, elementRef);
    expect(service.resizeDeviceWidth).toBeDefined();
  });

  it('resize device view width with collapsed mode and right side', () => {
    const elementRef: ElementRef = devicesComponent['elementRef'];
    service.resizeDeviceWidth(elementPositionCollapsedRight, elementRef);
    expect(service.resizeDeviceWidth).toBeDefined();
  });

  it('resize device view width with full mode and left side', () => {
    const elementRef: ElementRef = devicesComponent['elementRef'];
    service.resizeDeviceWidth(elementPositionFullRight, elementRef);
    expect(service.resizeDeviceWidth).toBeDefined();
  });

  it('resize device view width with full mode and left side', () => {
    const elementRef: ElementRef = devicesComponent['elementRef'];
    service.resizeDeviceWidth(elementPositionFullRight, elementRef, 'sidePanel');
    expect(service.resizeDeviceWidth).toBeDefined();
  });

  it('resize editor view width with collapsed mode and left side', () => {
    const elementRef: ElementRef = liveLinkComponent['elementRef'];
    service.resizeEditorWidth(elementPositionCollapsedLeft, elementRef);
    expect(service.resizeEditorWidth).toBeDefined();
  });

  it('resize editor view width with full mode and right side', () => {
    const elementRef: ElementRef = liveLinkComponent['elementRef'];
    service.resizeEditorWidth(elementPositionFullLeft, elementRef);
    expect(service.resizeEditorWidth).toBeDefined();
  });

  it('resize editor view width with collapsed mode and right side', () => {
    const elementRef: ElementRef = liveLinkComponent['elementRef'];
    service.resizeEditorWidth(elementPositionCollapsedRight, elementRef);
    expect(service.resizeEditorWidth).toBeDefined();
  });

  it('resize editor view width with full mode and left side', () => {
    const elementRef: ElementRef = liveLinkComponent['elementRef'];
    service.resizeEditorWidth(elementPositionFullRight, elementRef);
    expect(service.resizeEditorWidth).toBeDefined();
  });
});

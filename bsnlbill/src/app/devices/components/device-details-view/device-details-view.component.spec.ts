/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */

import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DeviceDetailsViewComponent } from './device-details-view.component';
import { DeviceDetailElements, DeviceState } from 'src/app/enum/enum';
import { AutomationComponent } from '../../../models/targetmodel.interface';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';

let component: DeviceDetailsViewComponent;
let fixture: ComponentFixture<DeviceDetailsViewComponent>;
let facadeMockService;

export class MockElementRef extends ElementRef {
    constructor() { super(null); }
  }


const automationComponents:AutomationComponent[] = [
  {
    name: 'BottleFilling',
    address: '',
    deviceId: '',
    deviceName: '',
    state: DeviceState.AVAILABLE,
    id: '',
    clientInterfaces: [],
    serverInterfaces: []
  }
];
fdescribe('Device details view', () => {
  beforeEach(
    waitForAsync(() => {
      facadeMockService=new FacadeMockService();
      TestBed.configureTestingModule({
        declarations: [DeviceDetailsViewComponent],
        providers: [  { provide: FacadeService, useValue: facadeMockService},
        {provide:ElementRef,useValue:MockElementRef}],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('drawDeviceDetails should call clearDeviceDetails and drawDeviceNode', () => {
    component.automationComp = automationComponents;
    component.drawDeviceDetails();

    spyOn(component, 'clearDeviceDetails').and.callThrough();
    expect(facadeMockService.drawService.drawDeviceNode).toHaveBeenCalled();
  });

  it('get automation comp should return automation component details ', () => {
    component.automationComp = automationComponents;
    expect(component.automationComp).toEqual(automationComponents);
  });

  it('drawDeviceDetails should add elements', () => {
    component.automationComp = automationComponents;
    component.drawDeviceDetails();
    fixture.detectChanges();

    const elementRef:ElementRef = component['elementRef'];
    expect(elementRef.nativeElement.querySelector(DeviceDetailElements.DETAILS_CLASS)).not.toBeNull();
  });

  it('clearDeviceDetails should remove all existing elements', () => {
    const pElement = document.createElement('p');
    pElement.classList.add('device__details__panel');
    component.elementRef.nativeElement.appendChild(pElement);
    component.automationComp = automationComponents;
    component.clearDeviceDetails();
    fixture.detectChanges();
    const elementRef:ElementRef = component['elementRef'];
    expect(elementRef.nativeElement.classList.length).toEqual(0);
    expect(elementRef.nativeElement.querySelector(DeviceDetailElements.DETAILS_CLASS)).toBeNull();
  });

});


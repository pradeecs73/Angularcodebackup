/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Device } from '../models/targetmodel.interface';

import { DevicesComponent } from './devices.component';

fdescribe('DevicesComponent', () => {
  let component: DevicesComponent;
  let fixture: ComponentFixture<DevicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call displayDeviceProperties method', () => {
    const deviceData={uid:'device12345'} as unknown as Device;
    component.displayDeviceProperties(deviceData)
    expect(component.displayDeviceProperties).toBeDefined();
    expect(component.selectedDeviceData).toEqual(deviceData);
  });

  it('should call removeElementWidth method', () => {
    component.removeElementWidth(25);
    expect(component.removeElementWidth).toBeDefined();
  });

});

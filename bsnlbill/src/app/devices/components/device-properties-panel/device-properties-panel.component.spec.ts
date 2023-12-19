/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DevicePropertiesPanelComponent } from './device-properties-panel.component';
import { TranslateModule } from '@ngx-translate/core';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import  { device} from 'mockData/projectData';
let component: DevicePropertiesPanelComponent;
let fixture: ComponentFixture<DevicePropertiesPanelComponent>;
let facadeMockService;
fdescribe('DevicePropertiesPanelComponent', () => {

  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    TestBed.configureTestingModule({
      declarations: [ DevicePropertiesPanelComponent ],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        { provide: FacadeService, useValue: facadeMockService},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePropertiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected device properties', () => {
    component.ngOnChanges({
      selectedDeviceData: new SimpleChange(device[0], device[0],true)
    });
    expect(component.deviceData).toBeDefined();
  });
});

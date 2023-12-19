/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let facadeMockService;

  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    TestBed.configureTestingModule({
      declarations: [ SettingsComponent ],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers:[
        { provide: FacadeService, useValue: facadeMockService},]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closeNav method', () => {
    const pElement = document.createElement('p');
    pElement.setAttribute('id','sideNav');
    component.elem.nativeElement.appendChild(pElement);
    component.closeNav();
    expect(component.closeNav).toBeDefined();
    expect(component.elem.nativeElement.querySelector('#sideNav')).not.toBe(null);
  });
});

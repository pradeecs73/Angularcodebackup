/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule} from '@ngx-translate/core';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { MessageService } from 'primeng/api';

import { ConfigurationSettingsComponent } from './configuration-settings.component';
import { of } from 'rxjs';

let mockMessageService: MessageService;

fdescribe('ConfigurationSettingsComponent', () => {
  let component: ConfigurationSettingsComponent;
  let fixture: ComponentFixture<ConfigurationSettingsComponent>;
  let facadeMockService;
  beforeEach(async () => {
    facadeMockService=new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationSettingsComponent ],
      imports: [TranslateModule.forRoot({})],
      providers : [{ provide: MessageService, useValue: mockMessageService },
        { provide: FacadeService, useValue: facadeMockService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit',()=>{
    component.ngOnInit();
    expect(facadeMockService.commonService.updateMenu).toHaveBeenCalled();
  });

  it('should call saveSettings method',()=>{
    Object.getOwnPropertyDescriptor(facadeMockService.apiService, 'setLanguage').value.and.returnValue(of({}));
    component.saveSettings();
    expect(component.saveSettings).toBeDefined();
  });

});

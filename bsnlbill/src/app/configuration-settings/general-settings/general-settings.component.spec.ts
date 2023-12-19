/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralSettingsComponent } from './general-settings.component';
import { TranslateModule} from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
let mockMessageService: MessageService;

fdescribe('GeneralSettingsComponent', () => {
  let component: GeneralSettingsComponent;
  let fixture: ComponentFixture<GeneralSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralSettingsComponent ],
      imports: [TranslateModule.forRoot({})],
      providers:[{ provide: MessageService, useValue: mockMessageService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call languageChanged method', () => {
     const lang={key:'lang',value:'de'};
     component.languageChanged(lang);
     expect(component.languageChanged).toBeDefined();
  });

});

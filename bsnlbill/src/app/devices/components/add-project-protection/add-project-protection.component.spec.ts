/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FacadeMockService } from '../../../../app/livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../../app/livelink-editor/services/facade.service';
import { AccessType, Numeric } from '../../../enum/enum';

import { AddProjectProtectionComponent } from './add-project-protection.component';

fdescribe('AddProjectProtectionComponent', () => {
  let component: AddProjectProtectionComponent;
  let fixture: ComponentFixture<AddProjectProtectionComponent>;
  let facadeMockService;
  beforeEach(async () => {
    facadeMockService=new FacadeMockService();
    await TestBed.configureTestingModule({
      declarations: [ AddProjectProtectionComponent ],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        { provide: FacadeService, useValue: facadeMockService},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProjectProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add formgroups in var(passwordFormGroups)', () => {
    const form = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl('')
    });
    component.formEvent(form, AccessType.READ);
    component.formEvent(form, AccessType.WRITE);
    component.formEvent(form, AccessType.WRITE);
    expect(component.passwordFormGroups.length).toBe(Numeric.TWO);
  });

  it('should emit an event on cancel fn call', () => {
    component.cancel();
    expect(component.hide).toBeDefined();
  });

  it('should emit data on protectProject fn call', () => {
    const form = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl('')
    });
    const arg = [{
      mode: AccessType.READ,
      formGroup: form
    }];
    component.protectProject(arg);
    expect(component.onSubmitEvent).toBeDefined();
  });
});

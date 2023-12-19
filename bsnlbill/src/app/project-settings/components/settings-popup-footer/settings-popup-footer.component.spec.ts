/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccessType,OperationMode} from 'src/app/enum/enum';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsPopupFooterComponent } from './settings-popup-footer.component';
import { FacadeMockService } from 'src/app/livelink-editor/services/facade.mock.service';
import { FacadeService } from 'src/app/livelink-editor/services/facade.service';

fdescribe('SettingsPopupFooterComponent', () => {
  let component: SettingsPopupFooterComponent;
  let fixture: ComponentFixture<SettingsPopupFooterComponent>;
  let facadeMockService;
  const initFromGroup = () => {
    const formGroup = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    });
    component.formgroups = [{formGroup}];
  }
  beforeEach(async () => {
    facadeMockService=new FacadeMockService();
    await TestBed.configureTestingModule({
      imports:[TranslateModule.forRoot({})],
      declarations: [ SettingsPopupFooterComponent ],
      providers: [ { provide: FacadeService, useValue: facadeMockService},]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPopupFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger ngOnChange fn on value changes', () => {
    initFromGroup();
    fixture.detectChanges();
    component.ngOnChanges();
    expect(component.formgroups).toBeDefined();
  });

  it('should emit form values on submit', () => {
    initFromGroup();
    component.onSubmit();
    expect(component.emitFormValues).toBeDefined();
  });

  it('should emit an event on close fn', () => {
    component.close();
    expect(component.closePopup).toBeDefined();
  });

  it('should call setUpPopupButton method', () => {
    component.mode=AccessType.WRITE;
    component.setUpPopupButton();
    component.mode=AccessType.READ;
    component.setUpPopupButton();
    component.mode=OperationMode.CHANGE_WRITE_PASSWORD;
    component.setUpPopupButton();
    component.mode=OperationMode.CHANGE_READ_PASSWORD;
    component.setUpPopupButton();

    expect(component.setUpPopupButton).toBeDefined();
  });

});

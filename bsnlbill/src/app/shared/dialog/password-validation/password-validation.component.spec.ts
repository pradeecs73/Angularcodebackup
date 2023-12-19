import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { OperationMode } from 'src/app/enum/enum';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordValidationComponent } from './password-validation.component';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';


fdescribe('PasswordValidationComponent', () => {
  let component: PasswordValidationComponent;
  let fixture: ComponentFixture<PasswordValidationComponent>;
  let facadeMockService;
  beforeEach(async () => {
    facadeMockService=new FacadeMockService();
    await TestBed.configureTestingModule({
      imports : [FormsModule,TranslateModule.forRoot({})],
      declarations: [ PasswordValidationComponent ],
      providers : [{ provide: FacadeService, useValue: facadeMockService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit', () => {
    spyOn(component.passwordVerification, 'emit');
    component.onSubmit();
    expect(component.passwordVerification.emit).toHaveBeenCalled();
  });

  it('cancel', () => {
    spyOn(component.passwordForm, 'reset');
    spyOn(component.hide, 'emit');
    component.cancel();
    expect(component.passwordForm.reset).toHaveBeenCalled();
    expect(component.hide.emit).toHaveBeenCalled();
  });

  it('changeInputTextType with show password true',()=>{
    component.showPassword = true;
    component.changeInputTextType();
    expect(component.textType).toEqual('text');
  });

  it('changeInputTextType with show password false',()=>{
    component.showPassword = false;
    component.changeInputTextType();
    expect(component.textType).toEqual('password');
  });

  it('setDialogData for open protected project',()=>{
    component.mode = OperationMode.MODE_OPEN_PROTECTED_PROJECT;
    component.projectName = 'test';
    component.setDialogData();
    expect(component.dialogData).toBeDefined();
  });


  it('setDialogData for remove password protected project',()=>{
    component.mode = OperationMode.REMOVE_PASSWORD_PROTECT;
    component.setDialogData();
    expect(component.dialogData).toBeDefined();
  });

  it('setDialogData for remove read protected project',()=>{
    component.mode = OperationMode.REMOVE_READ_PASSWORD;
    component.setDialogData();
    expect(component.dialogData).toBeDefined();
  });
});

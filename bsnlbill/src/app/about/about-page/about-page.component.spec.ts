import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPageComponent } from './about-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

fdescribe('AboutPageComponent', () => {
  let component: AboutPageComponent;
  let fixture: ComponentFixture<AboutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutPageComponent ],
      imports: [
        TranslateModule.forRoot({}),
      ],
      providers: [ { provide: MessageService, useValue: MessageService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component.facadeService.commonService,'updateMenu').and.callThrough();
    component.facadeService.commonService.updateMenu('about');
    expect(component.facadeService.commonService.updateMenu).toHaveBeenCalledWith('about');
  });
});

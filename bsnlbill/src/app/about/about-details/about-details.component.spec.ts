import { ComponentFixture, TestBed } from '@angular/core/testing';
import versionData from '../../../assets/document/version.json';
import { AboutDetailsComponent } from './about-details.component';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('AboutDetailsComponent', () => {
  let component: AboutDetailsComponent;
  let fixture: ComponentFixture<AboutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutDetailsComponent ],
      imports: [
        TranslateModule.forRoot({}),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('version is not available in version txt file',()=>{
    component.versionDetails = {
      'base version' : null,
      'full version' : null
    }
    component.ngOnInit();
    expect(component.versionDetails).toBeDefined();
    expect(component.versionDetails['base version']).toEqual(null);
    expect(component.versionDetails['full version']).toEqual(null);
  })
});

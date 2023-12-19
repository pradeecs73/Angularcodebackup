import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { DevicesRightSidebarComponent } from './devices-right-sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';

let component: DevicesRightSidebarComponent;
let fixture: ComponentFixture<DevicesRightSidebarComponent>;
let facadeMockService;
fdescribe('DevicesRightSidebarComponent', () => {

  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    TestBed.configureTestingModule({
      declarations: [DevicesRightSidebarComponent],
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
    fixture = TestBed.createComponent(DevicesRightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call removeWidth method', () => {
       component.removeWidth('full');
       expect(component.removeWidth).toBeDefined();
       expect(component.viewType).toEqual('full');
  });

});
/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { ApiService } from '../../../services/api.service';
import { SaveProjectService } from '../../../services/save-project.service';
import { DeviceAddMechanismSelectorComponent } from './device-add-mechanism-selector.component';

let component: DeviceAddMechanismSelectorComponent;
let fixture: ComponentFixture<DeviceAddMechanismSelectorComponent>;

let mockApiService: ApiService;
let messageService: MessageService;
let saveProjectService: SaveProjectService;
const initialState = { deviceTreeList : of(null) };
let facadeMockService;

fdescribe('DeviceAddMechanismSelectorComponent', () => {
  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    saveProjectService = jasmine.createSpyObj('saveProjectService',{'syncCacheDataFromStore' : of({})});

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ],
      declarations: [ DeviceAddMechanismSelectorComponent ],
      providers: [{ provide: ApiService, useValue: mockApiService },
        { provide: MessageService, useValue: messageService },
        { provide: SaveProjectService, useValue: saveProjectService },
        { provide: FacadeService, useValue: facadeMockService},
        provideMockStore({initialState})
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAddMechanismSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  it('Only two methods(file import and url) to add devices in grid', () => {
    let result=component.addMethods.length;
    expect(result).toBe(2);
  });
});

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TreeViewComponent } from './tree-view.component';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { AutomationComponent } from '../../../models/targetmodel.interface';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';

fdescribe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;
  let mockHttpClientService: HttpClient;
  let mockMessageService: MessageService;
  const defaultFillingNodes = {
    ids: [],
    entities: {}
};
let facadeMockService;
  const initialState = { deviceTreeList : of(null) ,fillingLine:defaultFillingNodes};

  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    TestBed.configureTestingModule({
      declarations: [TreeViewComponent,DisableIfUnauthorizedDirective],
      providers: [
        { provide: HttpClient, useValue: mockHttpClientService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: FacadeService, useValue: facadeMockService},
        provideMockStore({ initialState })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: false,name:'test' } });
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    component.automationComponent = { id: 'AC12345' } as unknown as AutomationComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call assignObject method', () => {
    const treeElement = fixture.debugElement.nativeElement.querySelector('.tree_elem');
    treeElement.dispatchEvent(new Event('mousedown'));
    expect(component.assignObject).toBeDefined();
    component.isRoot='true';
    treeElement.dispatchEvent(new Event('mousedown'));
  });

  it('should call setInputOutput method', () => {
       const node={input:'',output:''};
       const leafs=[{}];
       component.setInputOutput(node,leafs);
       expect(component.setInputOutput).toBeDefined();
  });


});

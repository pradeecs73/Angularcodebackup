/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { of } from 'rxjs';
import { OPCNodeService } from '../../../opcua/opcnodes/opcnode';
import { MenuViewComponent } from './menu-view.component';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { TranslateModule } from '@ngx-translate/core';
import { NodeAttributes } from './../../../enum/enum';

fdescribe('MenuViewComponent', () => {
  let component: MenuViewComponent;
  let fixture: ComponentFixture<MenuViewComponent>;
  let mockMessageService: MessageService;
  let mockOPCNodeService: OPCNodeService;
  let facadeMockService;

  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockOPCNodeService = jasmine.createSpyObj('opcNodeService', ['updateNodeAreaAssigmentData', 'updateNodeMoveData']);

    TestBed.configureTestingModule({
      declarations: [MenuViewComponent],
      providers: [{ provide: FacadeService, useValue: facadeMockService },
      { provide: MessageService, useValue: mockMessageService },
      { provide: OPCNodeService, useValue: mockOPCNodeService },
      ],
      imports: [TreeModule, TranslateModule.forRoot({})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectName').value.and.returnValue(of({ success: 'data' }));
    Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'getEditorContext').value.and.returnValue(of({ id: "ROOT", name: "" }));
    Object.getOwnPropertyDescriptor(facadeMockService.fillingLineService, 'getFillingLine').value.and.returnValue(of({
      ids: 'fff',
      entities: { name: 'test' }
    }));
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectName').value.and.returnValue(of({ success: 'data' }));
    fixture = TestBed.createComponent(MenuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should call save project method', () => {
    const saveButton = fixture.debugElement.nativeElement.querySelector('.save-btn');
    saveButton.click();
    expect(component.saveProject).toBeDefined();
    expect(facadeMockService.applicationStateService.saveProject).toBeDefined();
  });


  it('should call remove width  method', () => {
    spyOn(component.removeElementWidth, 'emit');
    const headerIcon = fixture.debugElement.nativeElement.querySelector('.header-icon');
    headerIcon.click();
    expect(component.removeElementWidth.emit).toHaveBeenCalled();
    expect(component.removeWidth).toBeDefined();
  });

  it('should call stop event truigger method', () => {
    const button = fixture.debugElement.nativeElement.querySelector('.menu-view--full');
    button.click();
    expect(component.stopEventsTriggerFromMenuView).toBeDefined();
  });

  it('should call click hanler method', () => {
    const selectedNodeId = 'sampleId';
    component.clickHandler(selectedNodeId);
    expect(component.clickHandler).toBeDefined();
    expect(facadeMockService.editorService.deselectAllNodes).toBeDefined();
    expect(facadeMockService.fillingLineService.selectDevice).toBeDefined();
  });

  it('should call click inside method', () => {
    var event = {
      type: 'click',
      preventDefault: function () { },
      stopPropagation: function () { }
    };

    component.clickedInside(event as Event);
    expect(component.clickedInside).toBeDefined();
  });

  it('searchParentSVGElement', () => {
    let element = { parentNode: 'test',className:()=> { } };
    component.searchParentSVGElement(element, [element]);
    expect(component.searchParentSVGElement).toBeDefined();

    element = { parentNode: 'test', className:()=> {} };
    component.searchParentSVGElement(element, undefined);
    expect(component.searchParentSVGElement).toBeDefined();
  });

  it('saveProject', () => {
    component.saveProject();
    expect(facadeMockService.applicationStateService.saveProject).toHaveBeenCalled();
  });

  it('preventDefault', () => {
    const targetEvent = {
      target: {
        classList: {
          add: () => { },
          contains: () => true
        }
      }, detail: 2, stopPropagation: () => { },
      parentNode: document.createElement('p')
    };
    component.preventDefault(targetEvent);
    expect(targetEvent.target.classList.contains()).toBeTruthy();
  });


  it('updateAreaName', () => {
    const targetEvent = {
      target: {
        classList: {
          remove: () => { },
          contains: () => true
        }
      }
    };
    component.updateAreaName(targetEvent);
    expect(facadeMockService.plantAreaService.updateArea).toHaveBeenCalled();
  });

  it('should call handleClickoutside method', () => {
    spyOn(component,'searchParentSVGElement').and.returnValue(false);
    const target=document.createElement('div');
    target.className=NodeAttributes.DEVICENODE;
    component.handleClickoutside(target);
    expect(component.handleClickoutside).toBeDefined();
    target.className='mydevice';
    component.handleClickoutside(target);
    Object.getOwnPropertyDescriptor(component,'searchParentSVGElement').value.and.returnValue([{classList:{value:NodeAttributes.DEVICENODE}}]);
    component.handleClickoutside(target);
    Object.getOwnPropertyDescriptor(component,'searchParentSVGElement').value.and.returnValue([{classList:{value:'root'}}]);
    component.handleClickoutside(target);
    Object.getOwnPropertyDescriptor(component,'searchParentSVGElement').value.and.returnValue([{classList:{value:'other'}}]);
    component.handleClickoutside(target);
  });

});

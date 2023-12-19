/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EntityState } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService, TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { of } from 'rxjs';
import { FillingLineNodeType, numConstants } from '../../../enum/enum';
import { FillingArea } from '../../../store/filling-line/filling-line.reducer';
import { LiveLinkModule } from '../../livelink-editor.module';
import { FacadeMockService } from '../../services/facade.mock.service';
import { FacadeService } from '../../services/facade.service';
import { TreeMenuComponent } from './tree-menu.component';


fdescribe('TreeMenuComponent', () => {

  let fixture: ComponentFixture<TreeMenuComponent>;
  let component: TreeMenuComponent;
  let mockStore: Store;
  let facadeMockService;
  let mockMessageService: MessageService;
  const changes = {
    deviceEntities: {
      currentValue: {
        entities: {
          b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE: {
            'id': 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
            'element': {},
            'selected': true,
            'state': 'UNKNOWN',
            'x': -22.2000732421875,
            'y': 117.79998779296875,
            'deviceId': 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
            'clientInterfaces': [],
            'serverInterfaces': [],
            'address': 'opc.tcp://192.168.2.103:4840',
            'name': 'WashingStep1',
            'deviceName': 'WashingStep1',
            'adapterType': 'Plant Object',
            'type': FillingLineNodeType.AREA,
            'parent': 'ROOT',
            'nodeIds': ['a', 'b']
          },
          b3BjDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE: {
            'id': 'b3BjDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
            'element': {},
            'selected': true,
            'state': 'UNKNOWN',
            'x': -22.2000732421875,
            'y': 117.79998779296875,
            'deviceId': 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
            'clientInterfaces': [],
            'serverInterfaces': [],
            'address': 'opc.tcp://192.168.2.103:4840',
            'name': 'WashingStep1',
            'deviceName': 'WashingStep1',
            'adapterType': 'Plant Object',
            'type': FillingLineNodeType.AREA,
            'parent': 'area123',
            'nodeIds': ['a', 'b']
          }
        },
        ids: ['b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE', 'b3BjDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE']
      },
      firstChange: false,
      previousValue: {
        entities: {},
        ids: []
      }
    }
  };

  const event = {
    stopPropagation: () => { },
    preventDefault: () => { },
    originalEvent: {
      stopImmediatePropagation: () => { }
    },
    detail: numConstants.NUM_2,
    target: {
      classList: {
        add: () => { },
        contains: () => true
      }
    }
  };

  const item = {
    children : [],
    command : () =>{},
    data : {},
    draggable : true,
    droppable : true,
    expanded : true,
    key : 'area_lbkfajdm',
    label : 'Area 3',
    parent:{},
    styleClass: 'area-class',
    type:'area'
  };

  const node = { partialSelected: true };
  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();
    facadeMockService.commonService.selectedMenuTreeItemObs = of(item);
    Object.getOwnPropertyDescriptor(
      facadeMockService.dataService,
      'getProjectData'
    ).value.and.returnValue({ project: { isProtected: false,name:'test' } });
    TestBed.configureTestingModule({
      imports: [TreeModule, LiveLinkModule,TranslateModule.forRoot({})],
      providers: [
        { provide: MessageService, useValue: mockMessageService },
        { provide: FacadeService, useValue: facadeMockService },
        { provide: Store, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeMenuComponent);
    component = fixture.componentInstance;
    component.items = [{
      children: [],
      droppable: true,
      expanded: true,
      icon: 'fas fa-cube',
      key: 'ROOT',
      label: 'test',
      parent: null,
      partialSelected: false,
      type: 'header'
    }];
    component.deviceEntities = { ...changes.deviceEntities.currentValue } as unknown as EntityState<FillingArea>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges', () => {
    component.ngOnChanges(changes as unknown as SimpleChanges);
    expect(component.deviceEntities).toBeDefined();
  });

  it('unGroupAreaData', () => {
    component.unGroupAreaData(event, {} as unknown as TreeNode);
    expect(facadeMockService.applicationStateService.unGroupArea).toHaveBeenCalled();
    spyOn(component.disableIfUnauthorizedDirective,'hasPermission').and.returnValue(false);
    component.unGroupAreaData(event, {} as unknown as TreeNode);
  });

  it('createNewArea', () => {
    component.createNewArea(event, 'abc');
    expect(facadeMockService.applicationStateService.createArea).toHaveBeenCalled();
    spyOn(component.disableIfUnauthorizedDirective,'hasPermission').and.returnValue(false);
    component.createNewArea(event, 'abc');
  });

  it('deleteAreaDetails', () => {
    component.deleteAreaDetails(event, {} as unknown as TreeNode);
    expect(facadeMockService.applicationStateService.deleteArea).toHaveBeenCalled();
    spyOn(component.disableIfUnauthorizedDirective,'hasPermission').and.returnValue(false);
    component.deleteAreaDetails(event, {} as unknown as TreeNode);
  });

  it('preventDefault', () => {
    spyOn(event, 'stopPropagation').and.callThrough();
    component.preventDefault(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('saveProject', () => {
    component.saveProject();
    expect(facadeMockService.applicationStateService.saveProject).toHaveBeenCalled();
    spyOn(component.disableIfUnauthorizedDirective,'hasPermission').and.returnValue(false);
    component.saveProject();
  });

  it('updateAreaName', () => {
    spyOn(component.renameArea, 'emit');
    component.updateAreaName('abc', 'def', node);
    expect(node.partialSelected).toEqual(false);
    expect(component.renameArea.emit).toHaveBeenCalled();
    spyOn(component.disableIfUnauthorizedDirective,'hasPermission').and.returnValue(false);
    component.updateAreaName('abc', 'def', node);
  });

  it('onDropData', () => {
    const evt = {
      dragNode: {} as unknown as TreeNode,
      dropNode: {} as unknown as TreeNode,
      index: 10,
      originalEvent: 10,
      accept: 10
    };
    component.onDropData(evt);
    component.selectedItems=null;
    component.onDropData(evt);
    expect(facadeMockService.applicationStateService.reOrderArea).toHaveBeenCalled();
  });

  it('stopEventsTriggerFromMenuView', () => {
    spyOn(event, 'stopPropagation').and.callThrough();
    component.stopEventsTriggerFromMenuView(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('onNodeExpand', () => {
    spyOn(event.originalEvent, 'stopImmediatePropagation').and.callThrough();
    component.onNodeExpand(event);
    expect(event.originalEvent.stopImmediatePropagation).toHaveBeenCalled();
  });

  it('onNodeCollapse', () => {
    spyOn(event.originalEvent, 'stopImmediatePropagation').and.callThrough();
    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getProjectName').value.and.returnValue('mysampleproject');
    const pElement = document.createElement('p');
    pElement.classList.add('p-treenode-content');
    pElement.innerText='mysampleproject';
    component.elementRef.nativeElement.appendChild(pElement);
    component.onNodeCollapse(event);

    expect(event.originalEvent.stopImmediatePropagation).toHaveBeenCalled();
  });

  it('trackData', () => {
    const res = component.trackData({ key: 'abc' });
    expect(res).toEqual('abc');
  });

  it('truncateName with string less than 10 character', () => {
    const res = component.truncateName('abcdefghi');
    expect(res).toEqual('abcdefghi');
  });

  it('truncateName with string more than 10 character', () => {
    const res = component.truncateName('abcdefghihjieoe');
    expect(res).toEqual('abcde...');
  });

  it('editableMode', () => {
    component.editableMode(node);
    expect(node.partialSelected).toEqual(true);
  });

  it('nodeSelect', () => {
    spyOn(event.originalEvent, 'stopImmediatePropagation').and.callThrough();
    const evt = { node : {}, originalEvent : event.originalEvent};
    component.nodeSelect(evt);
    expect(event.originalEvent.stopImmediatePropagation).toHaveBeenCalled();
    expect(facadeMockService.areaUtilityService.nodeSelect).toHaveBeenCalled();
  });

  it('should call addChild method', () => {
    const tree={children:[{key:'mykey'}]};
    const nodeSet={key:'mykey1'};
    component.addChildren(tree.children,nodeSet);
    expect(component.addChildren).toBeDefined();
  });


});

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PropertiesPanelComponent } from './properties-panel.component';
import { CommonService } from '../../../services/common.service';
import { Subject } from 'rxjs';
import { DeviceState, PropertyPanelType } from '../../../enum/enum';
import { MessageService } from 'primeng/api';
import { TreeData } from 'src/app/models/monitor.interface';

fdescribe('PropertiesPanelComponent', () => {
  let component: PropertiesPanelComponent;
  let fixture: ComponentFixture<PropertiesPanelComponent>;
  let mockCommonService: CommonService;
  let mockMessageService: MessageService;
  const deviceState = new Subject<DeviceState>();
  deviceState.next(DeviceState.UNAVAILABLE);
  const mockTreeData = [{
    "name": "Client interface :WashingStep1 > Washing1ToMixing",
    "value": "",
    "type": "",
    "children": [{
      "name": "detailedStatus",
      "type": "",
      "data": {
        "name": "detailedStatus",
        "type": ""
      },
      "parent": null
    }, {
      "name": "relatedEndpoint",
      "value": "opc.tcp://192.168.2.102:4840",
      "type": "",
      "data": {
        "name": "relatedEndpoint",
        "value": "opc.tcp://192.168.2.102:4840",
        "type": ""
      },
      "parent": null
    }, {
      "name": "status",
      "value": true,
      "type": "",
      "data": {
        "name": "status",
        "value": true,
        "type": ""
      },
      "parent": null
    }]
  }];
  const mockNodeData = {
    "name": "addNodesCount",
    "value": "",
    "type": "",
    "children": [],
    "data": {
      "name": "addNodesCount",
      "type": "",
      "value": ""
    },
    "eventName": "b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==.LiquidMixing.b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__Wash1ToMix_Type.tag.SessionDiagnostics",
    "parent": null,
    "expanded": true
  }

  beforeEach(waitForAsync(() => {
    mockCommonService = jasmine.createSpyObj('CommonService', ['changePanelData']);
    mockCommonService.connectionPropertyState = [];
    mockCommonService.interfacePropertyAccordion = [];
    mockCommonService.connectionPropertyAccordion = {
      clientIndex: [],
      serverIndex: []
    };
    TestBed.configureTestingModule({
      declarations: [PropertiesPanelComponent],
      providers: [
        { provide: MessageService, useValue: mockMessageService },
        { provide: CommonService, useValue: mockCommonService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Panel accordian is shown if showDeviceUnavailable is false', () => {
    component.showDeviceUnavailable = false;
    fixture.detectChanges();
    const panelData  = fixture.nativeElement.querySelector('[data-test="panel-accordian"]');
    expect(panelData).toBeDefined();
  });

  it('Panel accordian is hidden if showDeviceUnavailable is true', () => {
    component.showDeviceUnavailable = true;
    fixture.detectChanges();
    const panelData  = fixture.nativeElement.querySelector('[data-test="panel-accordian"]');
    expect(panelData).toBeNull();
  });

  it('onExpand Connection property Panel Accordion index should be added', () => {
    component.treeData = mockTreeData as TreeData[];
    component.panelType = PropertyPanelType.CONNECTION;
    component.expandAndCollapseAccordion({index: 0}, true);
    expect(mockCommonService.connectionPropertyAccordion.clientIndex.length).toBeGreaterThan(0);
    expect(mockCommonService.connectionPropertyAccordion.clientIndex).toBeInstanceOf(Array);
    expect(component.expandAndCollapseAccordion).toBeDefined();
  });

  it('onCollapse Connection property Panel Accordion index should be removed', () => {
    component.treeData = mockTreeData as TreeData[];
    component.panelType = PropertyPanelType.CONNECTION;
    component.expandAndCollapseAccordion({index: 0}, false);
    expect(mockCommonService.connectionPropertyAccordion.clientIndex.length).toBe(0);
    expect(mockCommonService.connectionPropertyAccordion.clientIndex).toBeInstanceOf(Array);
    expect(component.expandAndCollapseAccordion).toBeDefined();
  });

  it('onExpand Interface property Panel Accordion index should be added', () => {
    component.panelType = PropertyPanelType.INTERFACE;
    component.expandAndCollapseAccordion({index: 0}, true);
    expect(mockCommonService.interfacePropertyAccordion.length).toBeGreaterThan(0);
    expect(mockCommonService.interfacePropertyAccordion).toBeInstanceOf(Array);
    expect(component.expandAndCollapseAccordion).toBeDefined();
  });

  it('onCollapse Interface property Panel Accordion index should be removed', () => {
    component.panelType = PropertyPanelType.INTERFACE;
    component.expandAndCollapseAccordion({ index: 0 }, false);
    expect(mockCommonService.interfacePropertyAccordion.length).toBe(0);
    expect(mockCommonService.interfacePropertyAccordion).toBeInstanceOf(Array);
    expect(component.expandAndCollapseAccordion).toBeDefined();
  });

  it('should add the state of treeTable to connectionPropertyState on Expand', () => {
    component.panelType = PropertyPanelType.CONNECTION
    component.onNodeExpand({ node: mockNodeData }, '');
    expect(mockCommonService.connectionPropertyState.length).toBeGreaterThan(0);
    expect(mockCommonService.connectionPropertyState).toBeInstanceOf(Array);
    expect(component.onNodeExpand).toBeDefined();
  });

  it('should update the state of treeTable to connectionPropertyState on collapse', () => {
    component.panelType = PropertyPanelType.CONNECTION
    mockNodeData.expanded = true;
    component.onNodeExpand({ node: mockNodeData }, '');
    expect(mockCommonService.connectionPropertyState[0].isExpanded).toBe(true);
    expect(component.onNodeExpand).toBeDefined();

    mockNodeData.expanded = false;
    component.onNodeCollapse({ node: mockNodeData }, '');
    expect(mockCommonService.connectionPropertyState[0].isExpanded).toBe(false);
    expect(component.onNodeCollapse).toBeDefined();
  });

});

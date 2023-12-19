import { TestBed, waitForAsync } from '@angular/core/testing';
import { PlantArea, PlantAreaService } from './area';
import { FillingArea } from '../../store/filling-line/filling-line.reducer';
import {Selection } from '../../vendors/d3.module';
import { OPCNode } from '../../opcua/opcnodes/opcnode';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { Area, InterfaceDetails } from './../../models/models';
import { ROOT_EDITOR } from './../../utility/constant';
import { TreeNode } from 'primeng/api';
import { HTMLNode } from './htmlNode';
import { ISidePanel } from './../../models/targetmodel.interface';
import { TranslateModule } from '@ngx-translate/core';
import { TreeModule } from 'primeng/tree';
import { FacadeService } from './../../livelink-editor/services/facade.service';

fdescribe('Area service', () => {
  let plantAreaService;
  let areaData;
  let facadeMockService;

  beforeEach(waitForAsync(() => {
    areaData={
       id:'id12345',
       name:'area1',
       clientInterfaces:[],
       serverInterfaces:[],
       clientInterfaceIds:[],
       serverInterfaceIds:[],
       selected:true,
       x:25,
       y:25,
       repositionRequired:true,
       updateAnchors:()=>{return true},
       updateFillingLineData:(areaData)=>{return areaData},
       element:document.createElement('div') as unknown as SVGAElement
    } as unknown as PlantArea;

    TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService }
      ],
      imports: [TreeModule,TranslateModule.forRoot({})]
    });
    facadeMockService=new FacadeMockService();
    plantAreaService = new PlantAreaService(facadeMockService);
    facadeMockService.editorService.liveLinkEditor.editorNodes = [];
  }));

  it('area service should be created', () => {
    const svgElement = document.createElement('div') as unknown as SVGAElement;
    const areaElement = {
      node: function () { return svgElement }
    } as unknown as Selection<SVGGElement, unknown, null, undefined>;
    const areaObj = {} as unknown as FillingArea;
    const areaService = new PlantArea(areaElement, areaObj,facadeMockService);
    expect(areaService).toBeTruthy();
  });

  it('plant area service should be created', () => {
    expect(plantAreaService).toBeTruthy();
  });

  it('should call createArea method', () => {
    const svgElement = document.createElement('div') as unknown as SVGAElement;
    const areaElement = {
      node: function () { return svgElement }
    } as unknown as Selection<SVGGElement, unknown, null, undefined>;
    const areaObj = {
      selected: false
    } as unknown as FillingArea;

    areaObj.repositionRequired = true;
    const opcnode = {
      id: 'dragnodekey',
      testCollision: function () { },
      updateAnchors: function () { }
    } as unknown as OPCNode;

    facadeMockService.editorService.liveLinkEditor.editorNodes = [opcnode] as Array<OPCNode | PlantArea>;
    spyOn(plantAreaService, 'updateAreaElement').and.returnValue({});
    spyOn(plantAreaService, 'updateNodeMoveData').and.returnValue({});
    plantAreaService.createArea(areaElement, areaObj);
    areaObj.selected = true;

    plantAreaService.createArea(areaElement, areaObj);
    expect(plantAreaService.createArea).toBeDefined();
  });

  it('should call updateNodeMoveData method', () => {
    spyOn(plantAreaService, 'updateAreaElement').and.returnValue({});
     plantAreaService.updateNodeMoveData(areaData);
     expect(facadeMockService.fillingLineService.updateArea).toHaveBeenCalled();
     expect(facadeMockService.dataService.updateArea).toHaveBeenCalled();
  });

  it('should call recurseTreeData method', () => {
     const areaId='area12345';
     const node=[{
          key:'area12345',
          children:[{key:'area1234567',children:[]}]
     }];
     plantAreaService.recurseTreeData(node,areaId);
     expect(plantAreaService.recurseTreeData).toBeDefined();
     expect(plantAreaService.selectedAreaInEditor).toEqual({
           key:'area12345',
           children:[{key:'area1234567',children:[]}]
        });
  });

  it('should call breadcrumbForArea method', () => {
    const node={
         label:'mylabel',
         parent:[{label:'area1234567',parent:{label:'mylabel12'}}]
    };

     const bredcrumValue=plantAreaService.breadcrumbForArea(node);
      expect(plantAreaService.breadcrumbForArea).toBeDefined();
   });

   it('should call updateAreaInterfaces method', () => {
      Object.getOwnPropertyDescriptor(facadeMockService.htmlNodeService, 'updateAreaElement').value.and.returnValue({});
      spyOn(plantAreaService, 'updateAreaElement').and.returnValue({});
      plantAreaService.updateAreaInterfaces(areaData);
      expect(plantAreaService.updateAreaInterfaces).toBeDefined();
   });

   it('should call updateFillingLineData method', () => {
    plantAreaService.updateFillingLineData(areaData,{});
    expect(plantAreaService.updateFillingLineData).toBeDefined();
    expect(facadeMockService.editorService.updateHTMLNode).toHaveBeenCalled();
  });

  it('should call assignInterfaceClickEvent method', () => {
    const node={
       inputs:[{interfaceData:[]}],
       outputs:[{interfaceData:[]}]
    };

    plantAreaService.assignInterfaceClickEvent(node);
    expect(plantAreaService.assignInterfaceClickEvent).toBeDefined();
  });

  it('should call onClickHtmlNode method', () => {
    let sampleElement= document.createElement('div') as unknown as SVGAElement;
    sampleElement.innerHTML='<div id="Device-header"></div>';

    const nodeData={
      element:sampleElement
    };

    plantAreaService.onClickHtmlNode(nodeData);
    expect(plantAreaService.onClickHtmlNode).toBeDefined();
  });

  it('should call updateAreaElement method', () => {
    spyOn(plantAreaService, 'onDragToFillingLine').and.returnValue({});
    spyOn(plantAreaService, 'onClickHtmlNode').and.returnValue({});
    plantAreaService.updateAreaElement(areaData);
    expect(plantAreaService.updateAreaElement).toBeDefined();
    expect(facadeMockService.editorService.updateHTMLNode).toHaveBeenCalled();
    expect(facadeMockService.fillingLineService.updateArea).toHaveBeenCalled();
  });

  xit('should call removeAllAreaConnectionsFromEditor method', () => {
    const area={
       inputs:[{id:'anchor12345'}],
       outputs:[{id:'anchor12345'}]
    } as unknown as PlantArea;
    plantAreaService.removeAllAreaConnectionsFromEditor(area);
    expect(plantAreaService.removeAllAreaConnectionsFromEditor).toBeDefined();
    expect(facadeMockService.nodeAnchorService.removeAllConnectionsFromEditor).toBeDefined();
  });

  it('should call getParentOfAreaByAreaId method', () => {
    const areaId='area12345';
    const areaDetails=[{id:'area12345',parent:ROOT_EDITOR}] as unknown as  Area[];

    Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getArea').value.and.returnValue({id:'area12345',parent:ROOT_EDITOR});
    plantAreaService.getParentOfAreaByAreaId(areaId,areaDetails);
    expect(plantAreaService.getParentOfAreaByAreaId).toBeDefined();
  });

  it('should call removeNodeIdfromArea method', () => {
    const areaId='area12345';
    const nodeId='node12345';
    const areaData={id:'area12345',parent:ROOT_EDITOR,nodeIds:['node678910']};

    spyOn(plantAreaService,'updateArea');
    Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getArea').value.and.returnValue(areaData);
    plantAreaService.removeNodeIdfromArea(areaId,nodeId);
    expect(plantAreaService.removeNodeIdfromArea).toBeDefined();
    const areaData1={id:'area12345',parent:ROOT_EDITOR};
    Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getArea').value.and.returnValue(areaData1);
    plantAreaService.removeNodeIdfromArea(areaId,nodeId);
  });

  it('should call updateNodeIdsInAreaData method', () => {

    const nodeId='node12345';
    const areaData={id:'area12345',parent:ROOT_EDITOR,nodeIds:['node678910']};

    spyOn(plantAreaService,'updateArea');
    Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getEditorContext').value.and.returnValue({id:ROOT_EDITOR});
    plantAreaService.updateNodeIdsInAreaData(nodeId);
    expect(plantAreaService.updateNodeIdsInAreaData).toBeDefined();
    Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getEditorContext').value.and.returnValue({id:'other'});
    Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getArea').value.and.returnValue(areaData);
    plantAreaService.updateNodeIdsInAreaData(nodeId);
    expect(plantAreaService.updateArea).toHaveBeenCalled();
  });

  it('should call updateArea method', () => {

    const areaId='area12345';
    const fillingLineData={} as unknown as FillingArea | Partial<FillingArea>;
    const areaNode={} as unknown as PlantArea;

    spyOn(plantAreaService,'updateFillingLineData');
    plantAreaService.updateArea(areaId,fillingLineData,areaNode);
    expect(plantAreaService.updateArea).toBeDefined();
    expect(facadeMockService.fillingLineService.updateArea).toBeDefined();

  });

  it('should call updateBreadCrumData method', () => {
    const node={
         key:'ROOT',
         label:'mylabel',
         parent:[{label:'area1234567',parent:{label:'mylabel12'}}]
    } as unknown as TreeNode;

      const parentData=[{key:'parentkey12345',label:'parentlabel12345'}];

      plantAreaService.updateBreadCrumData(node);
      expect(plantAreaService.updateBreadCrumData).toBeDefined();
      Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService,'updateParentIfMissing').value.and.returnValue(parentData);
      node.key='NotRoot';
      plantAreaService.updateBreadCrumData(node);
   });

   it('should call updateInterfaceDetailsToServiceNStore method', () => {
       const exposeFromAreaId='area12345';
       const interfaceDetails={} as unknown as InterfaceDetails;
       const editorNodes=[{id:'area12345'}];

       spyOn(plantAreaService,'updateArea');
      facadeMockService.editorService.liveLinkEditor.editorNodes = editorNodes as unknown as Array<HTMLNode>;
      plantAreaService.updateInterfaceDetailsToServiceNStore(exposeFromAreaId,interfaceDetails);
      expect(plantAreaService.updateInterfaceDetailsToServiceNStore).toBeDefined();
   });

   it('should call updateAreaInterfaceData method', () => {
    let sidePanelData={
      isClientInterface:true,
      interfaceId:'interface12345'
    } as unknown as ISidePanel;

     areaData={
      id:'area12345',
      parent:ROOT_EDITOR,
      clientInterfaceIds:['interface678910'],
      serverInterfaceIds:['interface678910']
    };

   spyOn(plantAreaService,'updateArea');
   Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getEditorContext').value.and.returnValue({id:ROOT_EDITOR});
   Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getArea').value.and.returnValue(areaData);

   plantAreaService.updateAreaInterfaceData(sidePanelData);
   expect(plantAreaService.updateAreaInterfaceData).toBeDefined();

   sidePanelData={
    isClientInterface:false,
    interfaceId:'interface12345'
  } as unknown as ISidePanel;

  plantAreaService.updateAreaInterfaceData(sidePanelData);

  const areaData1={
    id:'area12345',
    parent:ROOT_EDITOR,
    clientInterfaceIds:['interface678910']
  };

  Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getArea').value.and.returnValue(areaData1);
  plantAreaService.updateAreaInterfaceData(sidePanelData);

  sidePanelData={
    isClientInterface:true,
    interfaceId:'interface12345'
  } as unknown as ISidePanel;

  const areaData2={
    id:'area12345',
    parent:ROOT_EDITOR,
    serverInterfaceIds:['interface678910']
  };

  Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getArea').value.and.returnValue(areaData2);
  plantAreaService.updateAreaInterfaceData(sidePanelData);
  expect(plantAreaService.updateAreaInterfaceData).toBeDefined();

});



});

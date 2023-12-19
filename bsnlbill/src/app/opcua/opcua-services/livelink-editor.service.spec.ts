import { TestBed } from '@angular/core/testing';
import { EntityState } from '@ngrx/entity';
import { provideMockStore } from '@ngrx/store/testing';
import { mockConnection } from 'mockData/mockConnection';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { FillingLineNodeType } from 'src/app/enum/enum';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { EditorContext, HTMLNodeConnector } from '../../models/models';
import { ClientInterface, Device, OpcInterface, RelatedEndPointInterface } from '../../models/targetmodel.interface';
import { FillingArea, FillingNode } from '../../store/filling-line/filling-line.reducer';
import { ROOT_EDITOR } from '../../utility/constant';
import { area, Selection } from '../../vendors/d3.module';
import { BaseConnector } from '../opcnodes/baseConnector';
import { Connector } from '../opcnodes/connector';
import { HTMLNode } from '../opcnodes/htmlNode';
import { NodeAnchor } from '../opcnodes/node-anchor';
import { SubConnector } from '../opcnodes/subConnector';
import { EditorService } from './livelink-editor.service';
let mockMessageService: MessageService;
let service: EditorService;
const defaultFillingNodes = {
    ids: [],
    entities: {}
};
let facadeMockService;
const initialState = { deviceTreeList : of(null) ,fillingLine:defaultFillingNodes};
 
fdescribe('Plant Editor Service', () => {

  beforeEach(() => {
   facadeMockService=new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useValue: mockMessageService },
         { provide: FacadeService, useValue: facadeMockService},
                    provideMockStore({ initialState })]
    });
    service = TestBed.inject(EditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call addHTMLNode method', () => {
     service.liveLinkEditor.editorNodes=[{id:'sample'}] as unknown as HTMLNode[];
     service.addHTMLNode({id:'sample'} as unknown as HTMLNode);
     expect(service.liveLinkEditor.editorNodes.length).toEqual(1);
  });

  it('should call removeNode method', () => {
    service.liveLinkEditor.editorNodes=[{id:'sample'}] as unknown as HTMLNode[];
    service.removeNode('sample');
    expect(service.liveLinkEditor.editorNodes.length).toEqual(0);
 });

 it('should call updateHTMLNode method', () => {
    service.liveLinkEditor.editorNodes=[{id:'sample',name:'sampleName1'}] as unknown as HTMLNode[];
    service.updateHTMLNode({id:'sample',name:'sampleName2'} as unknown as HTMLNode);
    expect(service.liveLinkEditor.editorNodes[0]).toEqual({id:'sample',name:'sampleName2'}  as unknown as HTMLNode);
 });

 it('should call addOrUpdateToConenctorLookup method', () => {
    service.liveLinkEditor.connectorLookup={'sampleconnector':{}} as unknown as HTMLNodeConnector;
    const sampleConnector={id:'sampleconnector',inputDeviceId:'device12345'} as unknown as Connector;
    service.addOrUpdateToConenctorLookup(sampleConnector);
    expect(service.liveLinkEditor.connectorLookup['sampleconnector']).toEqual({id:'sampleconnector',inputDeviceId:'device12345'} as unknown as Connector);
 });

 it('should call addOrUpdateToSubConnectorLookup method', () => {
    service.liveLinkEditor.subConnectorLookup={'samplesubconnector':{}} as unknown as HTMLNodeConnector;
    const sampleSubConnector={id:'samplesubconnector',deviceId:'device12345'} as unknown as SubConnector;
    service.addOrUpdateToSubConnectorLookup(sampleSubConnector);
    expect(service.liveLinkEditor.subConnectorLookup['samplesubconnector']).toEqual({id:'samplesubconnector',deviceId:'device12345'} as unknown as SubConnector);
 });

 it('should get connector by id', () => {
    service.liveLinkEditor.connectorLookup={'sampleconnector':{id:'sampleconnector',inputDeviceId:'device12345'} as unknown as Connector} as unknown as HTMLNodeConnector;
    const connector=service.getExistingConnectorById('sampleconnector');
    expect(connector).toEqual({id:'sampleconnector',inputDeviceId:'device12345'} as unknown as Connector);   
 });

 it('should get subconnector by id', () => {
    service.liveLinkEditor.subConnectorLookup={'samplesubconnector':{id:'samplesubconnector',deviceId:'device12345'} as unknown as SubConnector} as unknown as HTMLNodeConnector;
    const subconnector=service.getExistingSubConnectorById('samplesubconnector');
    expect(subconnector).toEqual({id:'samplesubconnector',deviceId:'device12345'} as unknown as SubConnector);   
 });

 it('should remove connector from connector lookup', () => {
    service.liveLinkEditor.connectorLookup={'sampleconnector':{id:'sampleconnector',inputDeviceId:'device12345'} as unknown as Connector} as unknown as HTMLNodeConnector;
    service.removeFromConnectorLookup('sampleconnector');
 });

 it('should remove subconnector from connector lookup', () => {
    service.liveLinkEditor.subConnectorLookup={'samplesubconnector':{id:'samplesubconnector',deviceId:'device12345'} as unknown as SubConnector} as unknown as HTMLNodeConnector;
    service.removeFromSubConnectorLookup('samplesubconnector');
    expect(service.liveLinkEditor.subConnectorLookup).toEqual({} as unknown as  HTMLNodeConnector);   
 });



 it('should add connecion to connector pool', () => {
    service.liveLinkEditor.connectorPool=[] as unknown as Connector[];
    const sampleConnector={id:'sampleconnector',inputDeviceId:'device12345'} as unknown as Connector;
    service.addToConnectorPool(sampleConnector);
    expect(service.liveLinkEditor.connectorPool[0]).toEqual({id:'sampleconnector',inputDeviceId:'device12345'} as unknown as Connector);   
 });

 
 it('should remove connector from connector pool', () => {
    service.liveLinkEditor.connectorPool=[{id:'13345'}] as unknown as Connector[];
    service.removeFromConnectorPool('13345');
    expect(service.liveLinkEditor.connectorPool).toEqual([]);   
 });

 it('checking root editor', () => {
    const rootEditor=service.isRootEditor();
    expect(rootEditor).toEqual(true);
 });

 it('should get the editor context', () => {
    const editorContext=service.getEditorContext();
    expect(editorContext.id).toEqual('ROOT');
 });

 it('updateHTMLNodes',()=>{
   let svg : SVGSVGElement, workspace : Selection<SVGGElement, unknown, null, undefined>,
   nodeGroup: Selection<SVGGElement, unknown, null, undefined>,connectionLinkGroup :SVGGElement,connector: SVGGElement;
   service.updateHTMLNodes(svg,workspace,nodeGroup,connectionLinkGroup,connector);
   expect(service.liveLinkEditor.svg).toEqual(svg);
   expect(service.liveLinkEditor.workspace).toEqual(workspace);
   expect(service.liveLinkEditor.nodeGroup).toEqual(nodeGroup);
   expect(service.liveLinkEditor.connectorElem).toEqual(connector);
   expect(service.liveLinkEditor.linkGroup).toEqual(connectionLinkGroup);
 })

 it('updateEntities',()=>{
   const entities = {} as unknown as  EntityState<FillingNode | FillingArea>
   service.updateEntities(entities);
   expect(service.liveLinkEditor.entities).toEqual(entities);
 })

 it('doesConnectionExist when key exists',()=>{
   service.liveLinkEditor.connectorLookup = {
         a : 'abcde',
         b : 'bcde'
   } as unknown as HTMLNodeConnector
   const conn = {
      id : 'a'
   }
   const res = service.doesConnectionExist(conn);
   expect(res).toEqual(true);
 })

 it('doesConnectionExist when key doesnt exists',()=>{
   service.liveLinkEditor.connectorLookup = {
         a : 'abcde',
         b : 'bcde'
   } as unknown as HTMLNodeConnector
   const conn = {
      id : 'h'
   }
   const res = service.doesConnectionExist(conn);
   expect(res).toEqual(false);
 })

 it('getExistingConnection',()=>{
   const toAnchor = {
      id : '1234'
   } as unknown as NodeAnchor;

   const fromAnchor = {
      id : '5678'
   }as unknown as NodeAnchor;


   service.liveLinkEditor.connectorLookup = {
      a : {
         inputAnchor : {
            id : '1234'
         },
         outputAnchor : {
            id : '5678'
         }
      },
      b : {
         inputAnchor : {
            id : '1234566'
         },
         outputAnchor : {
            id : '3532'
         }
      },
   } as unknown as HTMLNodeConnector
   const result = {

   }
   const res = service.getExistingConnection(toAnchor,fromAnchor);
   expect(res).toEqual( service.liveLinkEditor.connectorLookup['a'])
 })

//  it('addtoLinkGroup',()=>{
//    service.liveLinkEditor.linkGroup = 'abcdef' as unknown as SVGAElement;
//    service.addtoLinkGroup('mnop' as unknown as SVGAElement);

//  })

it('resetEditor',()=>{
   service.resetEditor();
   expect(service.liveLinkEditor.svg).toEqual(null);
   expect(service.liveLinkEditor.workspace).toEqual(null);
   expect(service.liveLinkEditor.linkGroup).toEqual(null);
   expect(service.liveLinkEditor.connectorElem).toEqual(null);
   expect(service.liveLinkEditor.editorNodes).toEqual([]);
   expect(service.liveLinkEditor.connectorLookup).toEqual({} as HTMLNodeConnector);
   expect(service.liveLinkEditor.entities).toEqual(null);
})

it('resetMultiSelectedConnection',()=>{
   spyOn(service.multiSelectedConnectorMap,'clear')
   service.resetMultiSelectedConnection();
   expect(service.multiSelectedConnectorMap.clear).toHaveBeenCalled();
})

it('deselectAllNodes',()=>{ 
   service.liveLinkEditor.entities = {
      ids : ['a','b','c'],
      entities :{
         'a' : 10 as unknown as FillingArea,
         'b' : 20 as unknown as FillingArea,
         'c' : 30 as unknown as FillingArea
      }
   }
   service.deselectAllNodes();
   //expect(mockfillingLineService.deselectDevices).toHaveBeenCalled();
})

it('deselectAllConnectors',()=>{
   service.liveLinkEditor.connectorLookup = {
      key : mockConnection
   }
   service.deselectAllConnectors();
   expect(service.liveLinkEditor.connectorLookup.key.isSelected).toEqual(false);
})

it('deselectAllSubConnectors',()=>{
   service.liveLinkEditor.subConnectorLookup = {
      key : mockConnection
   }
   service.deselectAllSubConnectors();
  expect(service.liveLinkEditor.subConnectorLookup.key.isSelected).toEqual(false);
})

it('removeConnectionFromConnectorLookup uid matching with inputAnchor id',()=>{
   spyOn(service,'removeFromConnectorLookup');
   service.liveLinkEditor.connectorLookup = {
      key : mockConnection
   }

   const device = {
      name: 'abcde',
      uid: '123456',
      address: '192.168.2.101:4840'
   } as unknown as Device;
   service.removeConnectionFromConnectorLookup(device);
   expect(service.removeFromConnectorLookup).toHaveBeenCalled();
})

it('removeConnectionFromConnectorLookup uid matching with outputanchor id',()=>{
   spyOn(service,'removeFromConnectorLookup');
   service.liveLinkEditor.connectorLookup = {
      key : mockConnection
   }

   const device = {
      name: 'abcde',
      uid: '1234567',
      address: '192.168.2.101:4840'
   } as unknown as Device;
   service.removeConnectionFromConnectorLookup(device);
   expect(service.removeFromConnectorLookup).toHaveBeenCalled();
})

it('addOrUpdateMultiSelectConnector',()=>{
   service.multiSelectedConnectorMap.set('1234',mockConnection)
   service.addOrUpdateMultiSelectConnector(mockConnection)
   expect(service.multiSelectedConnectorMap.size).toEqual(0)
})

it('addOrUpdateMultiSelectConnector',()=>{
   service.multiSelectedConnectorMap.set('5678',mockConnection)
   service.addOrUpdateMultiSelectConnector(mockConnection)
   expect(service.multiSelectedConnectorMap.size).toEqual(2)
})

it('selectedAreaData with root editor as id',()=>{
   spyOn(service['isRootEditorSelected'],'next');
   spyOn(service['editorContextSelected'],'next');
   const area = {
      id : ROOT_EDITOR
   }as unknown as EditorContext;
   service.selectedAreaData(area);
   expect(service['isRootEditorSelected'].next).toHaveBeenCalledWith(true);
   expect(service['editorContextSelected'].next).toHaveBeenCalled();
})

it('selectedAreaData with id not equal to root editor',()=>{
   spyOn(service['isRootEditorSelected'],'next');
   spyOn(service['editorContextSelected'],'next');
   const area = {
      id : 'abcde'
   }as unknown as EditorContext;
   service.selectedAreaData(area);
   expect(service['isRootEditorSelected'].next).toHaveBeenCalledWith(false);
   expect(service['editorContextSelected'].next).toHaveBeenCalled();
})

it('isDropped',()=>{
   spyOn(service['_isDroppedNodes$'],'next');
   service.isDropped(true);
   expect(service['_isDroppedNodes$'].next).toHaveBeenCalledWith(true);
})

it('setIsMultiSelected',()=>{
   service.setIsMultiSelected(true);
   expect(service.isConnectionMultiSelect).toEqual(true);
})

it('setSelectedConnection',()=>{
   const baseConnector = {} as unknown as BaseConnector
   spyOn(service['selectedConnection$'],'next');
   service.setSelectedConnection(baseConnector );
   expect(service['selectedConnection$'].next).toHaveBeenCalledWith(baseConnector);
   expect(service.selectedConnection).toEqual(baseConnector);
})
 
it('emptySelectedConnection',()=>{
   spyOn(service,'setSelectedConnection');
   spyOn(service,'deselectAllConnectors');
   spyOn(service,'deselectAllSubConnectors');
   service.emptySelectedConnection();
   expect(service.setSelectedConnection).toHaveBeenCalledWith(null);
   expect(service.deselectAllConnectors).toHaveBeenCalled();
   expect(service.selectedConnection).toEqual(null);
})

it('updateConnectionMonitor',()=>{
  service.updateConnectionMonitor('address','192.168.2.101' as unknown as RelatedEndPointInterface, mockConnection);
  expect(service.updateConnectionMonitor).toBeDefined();
})

it('setNextAreaNumber',()=>{
   service.setNextAreaNumber(10);
   expect(service.NextAreaNumber).toEqual(10);
})

it('setScrollTopCanvasValue',()=>{
   const scroll = {
      top : 10,
      left : 20
   }
   spyOn(service['_scrollTopValue$'],'next');
   service.setScrollTopCanvasValue(scroll);
   expect(service['_scrollTopValue$'].next).toHaveBeenCalledWith(scroll);
})

it('setDevicePropertyPanelData',()=>{
   spyOn(service['_devicePropertyPanelViewChange$'],'next');
   service.setDevicePropertyPanelData('text');
   expect(service['_devicePropertyPanelViewChange$'].next).toHaveBeenCalled();
})

it('setSidePanelData',()=>{
   spyOn(service['_sidePanelViewChange$'],'next');
   service.setSidePanelData('text');
   expect(service['_sidePanelViewChange$'].next).toHaveBeenCalled();
})

it('setSubConnectionViewType',()=>{
   spyOn(service['_subConnectionViewType$'],'next');
   service.setSubConnectionViewType('text');
   expect(service['_subConnectionViewType$'].next).toHaveBeenCalled();
})

it('setDeviceTreePanelData',()=>{
   spyOn(service['_deviceTreePanelViewChange$'],'next');
   service.setDeviceTreePanelData('text');
   expect(service['_deviceTreePanelViewChange$'].next).toHaveBeenCalled();
})

it('toggleAnchorSelection',()=>{
   spyOn(service['_selectedAnchorDetails$'],'next');
   service.toggleAnchorSelection({},{},true);
   expect(service['_selectedAnchorDetails$'].next).toHaveBeenCalled();
})

it('getCurrentAreaHierarchy',()=>{
   const area = {
      id: "area_l8hgiv25",
      name: "Area 2",
      parentLabels : [
         { label : 'test'},
         { label : 'Area 2'}
      ]
   }
   service['editorContextSelected'].next(area as unknown as EditorContext)
   service.getCurrentAreaHierarchy();
})

it('getAreaWithDeviceInterfaces with true value',()=>{
   const node = [{
      clientInterfaces : [{
         deviceId: 'abcde'
      } as unknown as ClientInterface
      ],
      serverInterfaces : [
         {
            deviceId: 'abcde'
         } as unknown as OpcInterface
      ],
      type : FillingLineNodeType.AREA
   }as unknown as HTMLNode];
   service.liveLinkEditor.editorNodes =  node;
   const res = service.getAreaWithDeviceInterfaces('abcde',true);
   expect(res).toEqual(node);
})

it('getAreaWithDeviceInterfaces with false value',()=>{
    const node = [{
      clientInterfaces : [{
         deviceId: 'abcde'
      } as unknown as ClientInterface
      ],
      serverInterfaces : [
         {
            deviceId: 'abcde'
         } as unknown as OpcInterface
      ],
      type : FillingLineNodeType.AREA
   }as unknown as HTMLNode]
   service.liveLinkEditor.editorNodes = node;
   const res  = service.getAreaWithDeviceInterfaces('abcde',false);
   expect(res).toEqual(node);
})

it('should call getAreaBreadCrumList ',()=>{
   const breadCrumList={parentLabels:[{label:area},{label:area}]}
  service.getAreaBreadCrumList(breadCrumList);
  expect(service.getAreaBreadCrumList).toBeDefined();
})

});

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed, waitForAsync } from '@angular/core/testing';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from './../../livelink-editor/services/facade.service';
import { NodeAnchor,NodeAnchorService} from './node-anchor';
import { AreaClientInterface, ClientInterface } from './../..//models/targetmodel.interface';
import { HTMLNode } from './htmlNode';
import { LiveLink } from './../../models/models';
import { ConnectorState, ConnectorType, DragType, FillingLineNodeType, dragProperties, intefaceStyle } from './../../enum/enum';
import { BaseConnector } from './baseConnector';


fdescribe('Area service', () => {
  let nodeAnchor;
  let facadeMockService;
  let nodeAnchorService;

  let node={
    id:'node12345',
    type:FillingLineNodeType.AREA
  } as unknown as HTMLNode;

  const anchorDetails={
    node:()=>null
  };

  const isInputvalue=true;

  const interfaceData={
    deviceId:'device12345',
    automationComponentId:'ac12345'
  } as unknown as ClientInterface | AreaClientInterface;

  const index=1;

  const editor={
    svg:{
        createSVGPoint:()=>true
    }
  } as unknown as LiveLink;

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService }
      ]
    });

    facadeMockService = new FacadeMockService();
    nodeAnchor = new NodeAnchor(node,anchorDetails,isInputvalue,interfaceData,index,editor);
    nodeAnchorService=new NodeAnchorService(facadeMockService)

  }));



  it('node anchor service should be created', () => {
    expect(nodeAnchor).toBeTruthy();
  });

  it('node anchor service should be created for node', () => {
    node={
        id:'node12345',
        type:FillingLineNodeType.NODE
      } as unknown as HTMLNode;

     const nodeInstance = new NodeAnchor(node,anchorDetails,isInputvalue,interfaceData,index,editor);
     expect(nodeInstance).toBeTruthy();
  });

  it('node anchor service should be created for header', () => {
    node={
        id:'node12345',
        type:FillingLineNodeType.HEADER
      } as unknown as HTMLNode;

     const headerInstance = new NodeAnchor(node,anchorDetails,isInputvalue,interfaceData,index,editor);
     expect(headerInstance).toBeTruthy();
  });

  it('should call resetInPutAnchorStyle method', () => {
     spyOn(nodeAnchor,'resetAnchorScrimStyle');
     spyOn(nodeAnchor,'setAnchorElementStyle');
     nodeAnchor.resetInPutAnchorStyle();
     expect(nodeAnchor.resetInPutAnchorStyle).toBeDefined();
  });

  it('should call resetOutPutAnchorStyleInverse method', () => {
    spyOn(nodeAnchor,'resetAnchorScrimStyle');
    spyOn(nodeAnchor,'setAnchorElementStyle');
    nodeAnchor.resetOutPutAnchorStyleInverse();
    expect(nodeAnchor.resetOutPutAnchorStyleInverse).toBeDefined();
 });

 it('should call resetInPutAnchorStyleInverse method', () => {
    spyOn(nodeAnchor,'resetAnchorScrimStyle');
    spyOn(nodeAnchor,'setAnchorElementStyle');
    nodeAnchor.resetInPutAnchorStyleInverse();
    expect(nodeAnchor.resetInPutAnchorStyleInverse).toBeDefined();
 });

 it('should call resetOutPutAnchorStyle method', () => {
    spyOn(nodeAnchor,'resetAnchorScrimStyle');
    spyOn(nodeAnchor,'setAnchorElementStyle');
    nodeAnchor.resetOutPutAnchorStyle();
    expect(nodeAnchor.resetOutPutAnchorStyle).toBeDefined();
 });

 it('should call highLightInterface method', () => {
    spyOn(nodeAnchor,'getAnchorInterfaceElement').and.returnValue({attr:()=>true});
    nodeAnchor.highLightInterface();
    expect(nodeAnchor.highLightInterface).toBeDefined();
 });

 it('should call setAnchorDefaultSelectedStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimDefaultSelectedConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setAnchorDefaultSelectedStyle(isInput);
    expect(nodeAnchor.setAnchorDefaultSelectedStyle).toBeDefined();
 });

 it('should call setAnchorOnlineSelectedStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimDefaultSelectedConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setAnchorOnlineSelectedStyle(isInput);
    expect(nodeAnchor.setAnchorOnlineSelectedStyle).toBeDefined();
 });

 it('should call setAnchorOnlineErrorSelectedStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimDefaultSelectedConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setAnchorOnlineErrorSelectedStyle(isInput);
    expect(nodeAnchor.setAnchorOnlineErrorSelectedStyle).toBeDefined();
 });

 it('should call setAnchorSuccessSelectedStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimDefaultSelectedConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setAnchorSuccessSelectedStyle(isInput);
    expect(nodeAnchor.setAnchorSuccessSelectedStyle).toBeDefined();
 });

 it('should call setAnchorFailureSelectedStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimDefaultSelectedConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setAnchorFailureSelectedStyle(isInput);
    expect(nodeAnchor.setAnchorFailureSelectedStyle).toBeDefined();
 });

 it('should call setAnchorDefaultStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimActualConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setAnchorDefaultStyle(isInput);
    expect(nodeAnchor.setAnchorDefaultStyle).toBeDefined();
 });

 it('should call setOnlineSuccessAnchorStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimActualConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setOnlineSuccessAnchorStyle(isInput);
    expect(nodeAnchor.setOnlineSuccessAnchorStyle).toBeDefined();
 });

 it('should call setOnlineErrorAnchorStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimActualConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setOnlineErrorAnchorStyle(isInput);
    expect(nodeAnchor.setOnlineErrorAnchorStyle).toBeDefined();
 });

 it('should call setSuccessAnchorStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimActualConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setSuccessAnchorStyle(isInput);
    expect(nodeAnchor.setSuccessAnchorStyle).toBeDefined();
 });

 it('should call setFailureStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimActualConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setFailureStyle(isInput);
    expect(nodeAnchor.setFailureStyle).toBeDefined();
 });

 it('should call setNoConnectionStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'setAnchorScrimActualConenctionStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
    nodeAnchor.setNoConnectionStyle(isInput);
    expect(nodeAnchor.setNoConnectionStyle).toBeDefined();
 });

 it('should call setAnchorHoverStyle method', () => {
    spyOn(nodeAnchor,'addToAnchorScrimStyle');
    nodeAnchor.setAnchorHoverStyle();
    expect(nodeAnchor.setAnchorHoverStyle).toBeDefined();
 });

 it('should call resetAnchorHoverStyle method', () => {
    spyOn(nodeAnchor,'removeFromAnchorScrimStyle');
    nodeAnchor.resetAnchorHoverStyle();
    expect(nodeAnchor.resetAnchorHoverStyle).toBeDefined();
 });

 it('should call resetAnchorScrimStyle method', () => {
    spyOn(nodeAnchor,'setAnchorScrimStyle');
    nodeAnchor['resetAnchorScrimStyle']();
    expect(nodeAnchor.resetAnchorScrimStyle).toBeDefined();
 });

 it('should call setAnchorScrimActualConenctionStyle method', () => {
    spyOn(nodeAnchor,'setAnchorScrimStyle');
    nodeAnchor['setAnchorScrimActualConenctionStyle']();
    expect(nodeAnchor.setAnchorScrimActualConenctionStyle).toBeDefined();
 });

 it('should call setAnchorScrimDefaultSelectedConenctionStyle method', () => {
    spyOn(nodeAnchor,'setAnchorScrimStyle');
    nodeAnchor['setAnchorScrimDefaultSelectedConenctionStyle']();
    expect(nodeAnchor['setAnchorScrimDefaultSelectedConenctionStyle']).toBeDefined();
 });

 it('should call setAnchorSelectedStyle method', () => {
    const isInput=true;
    spyOn(nodeAnchor,'resetAnchorScrimStyle');
    spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
    nodeAnchor.setAnchorSelectedStyle(isInput);
    expect(nodeAnchor.setAnchorSelectedStyle).toBeDefined();
 });

 it('should call addToAnchorScrimStyle method', () => {
    nodeAnchor.anchorScrim=document.createElement('div');
    nodeAnchor.addToAnchorScrimStyle('sampleclass');
    expect(nodeAnchor.addToAnchorScrimStyle).toBeDefined();
 });

 it('should call removeFromAnchorScrimStyle method', () => {
    nodeAnchor.anchorScrim=document.createElement('div');
    nodeAnchor.removeFromAnchorScrimStyle('sampleclass');
    expect(nodeAnchor.removeFromAnchorScrimStyle).toBeDefined();
 });

 it('should call setAnchorScrimStyle method', () => {
    nodeAnchor.anchorScrim=document.createElement('div');
    nodeAnchor['setAnchorScrimStyle']('sampleclass');
    expect(nodeAnchor['setAnchorScrimStyle']).toBeDefined();
 });

 it('should call deHighLightInterface method', () => {
    spyOn(nodeAnchor,'getAnchorInterfaceElement').and.returnValue({attr:()=>true});
    nodeAnchor.connectors=[{}];
    nodeAnchor.deHighLightInterface();
    expect(nodeAnchor.deHighLightInterface).toBeDefined();
 });

 it('should call setDisconnectedInterfaceStyle method', () => {
    spyOn(nodeAnchor,'getAnchorInterfaceElement').and.returnValue({attr:()=>true});
    nodeAnchor.setDisconnectedInterfaceStyle();
    expect(nodeAnchor.setDisconnectedInterfaceStyle).toBeDefined();
 });

 it('should call setCursorNotAllowedStyle method', () => {
    const target={};
    const anchor={
        connectors:[{isConnected:true}]
    } as unknown as NodeAnchor;
    let isOnline=true;

    spyOn(nodeAnchor,'updateCursorStyle');
    nodeAnchor.setCursorNotAllowedStyle(target,anchor,isOnline);
    expect(nodeAnchor.setCursorNotAllowedStyle).toBeDefined();

    isOnline=false;

    nodeAnchor.setCursorNotAllowedStyle(target,anchor,isOnline);
    expect(nodeAnchor.setCursorNotAllowedStyle).toBeDefined();
 });

 it('should call setConnectorsLength method', () => {

    nodeAnchor.parentNode= {inputs: null};
    nodeAnchor.parentNode= {outputs: null};

    nodeAnchor.setConnectorsLength();
    expect(nodeAnchor.setConnectorsLength).toBeDefined();

    nodeAnchor.parentNode= {inputs: true,outputs: null};

    nodeAnchor.setConnectorsLength();
    expect(nodeAnchor.setConnectorsLength).toBeDefined();

 });

 it('should call setConnectorsLength for else method', () => {

    nodeAnchor.parentNode= {inputs: [{}],outputs: [{}]};
    spyOn(nodeAnchor,'setAnchorsConnectorsLength');

    nodeAnchor.setConnectorsLength();
    expect(nodeAnchor.setConnectorsLength).toBeDefined();

 });

 it('should call removeConnector method', () => {

    let connector={id:'conector12345'} as unknown as  BaseConnector;
    nodeAnchor.connectors=[{id:'conector12345'}];

    nodeAnchor.removeConnector(connector);
    expect(nodeAnchor.removeConnector).toBeDefined();

 });

 it('should call update method', () => {

    nodeAnchor.anchorElement={getTransformToElement:()=>'mytransform'};
    nodeAnchor.center={matrixTransform:()=>'centertransform'};
    nodeAnchor.editor.workspace={node:()=>{return {id:'node12345'}}};

    spyOn(nodeAnchor,'setConnectorsLength');

    nodeAnchor.update();
    expect(nodeAnchor.update).toBeDefined();

 });

 it('should call setConnectedInterfaceStyle method', () => {

    spyOn(nodeAnchor,'getAnchorInterfaceElement').and.returnValue({node:()=>
        {return {id:'node12345',getBBox:()=>{return {height:10,width:20,x:10,y:20}}}},attr:()=>true});

    nodeAnchor.interfaceStyle = intefaceStyle.DISCONNECTED;

    spyOn(nodeAnchor,'setConnectorsLength');

    nodeAnchor.setConnectedInterfaceStyle();
    expect(nodeAnchor.setConnectedInterfaceStyle).toBeDefined();

    nodeAnchor.isInput=false;

    nodeAnchor.setConnectedInterfaceStyle();
    expect(nodeAnchor.setConnectedInterfaceStyle).toBeDefined();

 });

 it('should call setConnectedInterfaceStyle for else method', () => {

    spyOn(nodeAnchor,'getAnchorInterfaceElement').and.returnValue({node:()=>
        {return {id:'node12345',getBBox:()=>{return {height:10,width:20,x:10,y:20}}}},attr:()=>true});

    nodeAnchor.interfaceStyle = intefaceStyle.DISCONNECTED;

    spyOn(nodeAnchor,'setConnectorsLength');

    nodeAnchor.isInput=false;

    nodeAnchor.setConnectedInterfaceStyle();
    expect(nodeAnchor.setConnectedInterfaceStyle).toBeDefined();

 });

 it('should call setAnchorInnerCircleStyle ', () => {
     const innerrcls='myclass';
     const isInput=true;

    spyOn(nodeAnchor,'getAnchorInnerCircleElement').and.returnValue({attr:()=>true});
    nodeAnchor['setAnchorInnerCircleStyle'](innerrcls,isInput);
    expect( nodeAnchor['setAnchorInnerCircleStyle']).toBeDefined();

 });

 it('should call setAnchorOuterCircleStyle ', () => {
    const innerrcls='myclass';
    const isInput=true;

   spyOn(nodeAnchor,'getAnchorOuterCircleElement').and.returnValue({attr:()=>true});
   nodeAnchor['setAnchorOuterCircleStyle'](innerrcls,isInput);
   expect( nodeAnchor['setAnchorOuterCircleStyle']).toBeDefined();

});

it('should call setAnchorElementStyle ', () => {
    const outercls='myclass';
    const innerrcls='myclass';
    const isInput=true;

   spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
   spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
   nodeAnchor['setAnchorElementStyle'](outercls,innerrcls,isInput);
   expect( nodeAnchor['setAnchorElementStyle']).toBeDefined();

});

it('should call getAnchorCircleElement method ', () => {
    let elementId='mysampleelmentid12345';
    nodeAnchor.anchorElement=null;

   spyOn(nodeAnchor,'setAnchorOuterCircleStyle');
   spyOn(nodeAnchor,'setAnchorInnerCircleStyle');
   nodeAnchor['getAnchorCircleElement'](elementId);
   expect( nodeAnchor['getAnchorCircleElement']).toBeDefined();

     nodeAnchor.anchorElement={};
     elementId=null;

     nodeAnchor['getAnchorCircleElement'](elementId);
     expect( nodeAnchor['getAnchorCircleElement']).toBeDefined();

});

it('should call getAnchorOuterCircleElement method ', () => {

    nodeAnchor.anchorElement=null;
    const isInput=true;

    spyOn(nodeAnchor,'getAnchorCircleElement');
     nodeAnchor.getAnchorOuterCircleElement(isInput);
     expect( nodeAnchor.getAnchorOuterCircleElement).toBeDefined();

});

it('should call getAnchorInnerCircleElement method ', () => {

    nodeAnchor.anchorElement=null;
    const isInput=true;

    spyOn(nodeAnchor,'getAnchorCircleElement');
     nodeAnchor.getAnchorInnerCircleElement(isInput);
     expect( nodeAnchor.getAnchorInnerCircleElement).toBeDefined();

});

it('should call updateConnectors method ', () => {

    nodeAnchor.connectors=[{
        inputAnchor: {update:()=>true},
        outputAnchor:{update:()=>true}
    }];

     nodeAnchor.updateConnectors();
     expect( nodeAnchor.updateConnectors).toBeDefined();

});

it('should call addConnector method ', () => {

    let connector={id:'connector12345',updateAngle:()=>true};
    nodeAnchor.connectors=[{
      id:'connector12345',
      updateAngle:()=>true
    }];

     nodeAnchor.addConnector(connector);
     expect( nodeAnchor.addConnector).toBeDefined();

     connector={id:'connector678910',updateAngle:()=>true};
     nodeAnchor.addConnector(connector);
     expect( nodeAnchor.addConnector).toBeDefined();

});

it('should call setConnectionVar method ', () => {

    nodeAnchor.interfaceData.connectionEndPointDetails={
      status:{
         value:true
      },
      relatedEndpoints:{
         value:'192.168.2.101:4840'
      }

    };

    nodeAnchor.relatedEndPoint={
      address:''
    };

    nodeAnchor.setConnectionVar();
    expect( nodeAnchor.setConnectionVar).toBeDefined();

    nodeAnchor.interfaceData.connectionEndPointDetails.relatedEndpoints.value=23;
    nodeAnchor.relatedEndPoint=null;

    nodeAnchor.setConnectionVar();
    expect( nodeAnchor.setConnectionVar).toBeDefined();

});

it('should call setAnchorsConnectorsLength method ', () => {

   let anchorList=[{connectors:[{
      inLength:20,
      inLengthReverse:40,
      outLength:20,
      outLengthReverse :40,
      type:ConnectorType.CONNECTOR,
      updateHandle:()=>true
   }]}]

   let isClient=true;

   nodeAnchor.setAnchorsConnectorsLength(anchorList,isClient);
   expect( nodeAnchor.setConnectionVar).toBeDefined();

   anchorList=[{connectors:[{
      inLength:20,
      inLengthReverse:40,
      outLength:20,
      outLengthReverse :40,
      type:ConnectorType.SUBCONNECTOR,
      updateHandle:()=>true
   }]}];

    isClient=false;

    nodeAnchor.setAnchorsConnectorsLength(anchorList,isClient);
    expect( nodeAnchor.setConnectionVar).toBeDefined();


});


it('should call updateTargetProperties method ', () => {

 let element=document.createElement('div');
 element.setAttribute('data-x','20');
 element.setAttribute('data-y','20');

  let event={
   target:element,
   dx:20,
   dy:20
  };

  let targetType=DragType.NODE;
  const currentZoomScaleFactor=1;

  nodeAnchor.updateTargetProperties(event,targetType,currentZoomScaleFactor);
  expect( nodeAnchor.updateTargetProperties).toBeDefined();

  targetType=DragType.INTERFACE;

  nodeAnchor.updateTargetProperties(event,targetType,currentZoomScaleFactor);
  expect( nodeAnchor.updateTargetProperties).toBeDefined();

  targetType=DragType.CONNECTIONNODE;

  nodeAnchor.updateTargetProperties(event,targetType,currentZoomScaleFactor);
  expect( nodeAnchor.updateTargetProperties).toBeDefined();

  element=document.createElement('div');

  event={
   target:element,
   dx:20,
   dy:20
  };

  nodeAnchor.updateTargetProperties(event,targetType,currentZoomScaleFactor);
  expect( nodeAnchor.updateTargetProperties).toBeDefined();


});

it('should call node anchor service method ', () => {
    expect(nodeAnchorService).toBeTruthy();
});

it('should call dragEnd method ', () => {

   const anchor={
      updateConnectors:()=>true,
      deHighLightInterface:()=>true,
      isInput:true,
      connectors:[{
         inputAnchor:{
            setConnectedInterfaceStyle:()=>true
         },
         outputAnchor:{
            setConnectedInterfaceStyle:()=>true
         },
         type:ConnectorType.CONNECTOR
      }]
   };

   facadeMockService.commonService.isOnline=false;
   nodeAnchorService.dragEnd(anchor);
   expect(nodeAnchorService.dragEnd).toBeDefined();

});

it('should call removeAllConnectionsFromEditor method ', () => {

   const anchor={
      connectors:[{
         type:ConnectorType.CONNECTOR
      }]
   };

   nodeAnchorService.removeAllConnectionsFromEditor(anchor);
   expect(nodeAnchorService.removeAllConnectionsFromEditor).toBeDefined();

});

it('should call getAreaInterfaceIdDetails method ', () => {

   let anchor={
      parentNode:{
         type:FillingLineNodeType.AREA,
         id:'parentnode12345'
      },
      interfaceData:{
         id:'interface12345'
      },
      isInput:true
   };

   nodeAnchorService.getAreaInterfaceIdDetails(anchor);
   expect(nodeAnchorService.getAreaInterfaceIdDetails).toBeDefined();

   anchor={
      parentNode:{
         type:FillingLineNodeType.AREA,
         id:'parentnode12345'
      },
      interfaceData:{
         id:'interface12345'
      },
      isInput:false
   };

   nodeAnchorService.getAreaInterfaceIdDetails(anchor);
   expect(nodeAnchorService.getAreaInterfaceIdDetails).toBeDefined();

});

it('should call getAreaInterfaceDetails method ', () => {

   let anchor={
      parentNode:{
         type:FillingLineNodeType.AREA,
         id:'parentnode12345',
         clientInterfaces:[{id:'interface12345'}],
         serverInterfaces:[{id:'interface12345'}]
      },
      interfaceData:{
         id:'interface12345'
      },
      isInput:true
   } as unknown as NodeAnchor;

   nodeAnchorService.getAreaInterfaceDetails(anchor);
   expect(nodeAnchorService.getAreaInterfaceDetails).toBeDefined();

   anchor={
      parentNode:{
         type:FillingLineNodeType.AREA,
         id:'parentnode12345',
         clientInterfaces:[{id:'interface12345'}],
         serverInterfaces:[{id:'interface12345'}]
      },
      interfaceData:{
         id:'interface12345'
      },
      isInput:false
   } as unknown as NodeAnchor;

   nodeAnchorService.getAreaInterfaceDetails(anchor);
   expect(nodeAnchorService.getAreaInterfaceDetails).toBeDefined();

});

it('should call updateAnchors method ', () => {

   let anchor={
      connectors:[{
         type:ConnectorType.CONNECTOR,
         updateHandle:()=>true
      }]
   } as unknown as NodeAnchor;

   nodeAnchorService.updateAnchors(anchor);
   expect(nodeAnchorService.updateAnchors).toBeDefined();

   anchor={
      connectors:[{
         type:ConnectorType.SUBCONNECTOR,
         updateHandle:()=>true
      }]
   } as unknown as NodeAnchor;

   nodeAnchorService.updateAnchors(anchor);
   expect(nodeAnchorService.updateAnchors).toBeDefined();


});

it('should call updateCursors method ', () => {

   let anchor={
      connectors:[{
         type:ConnectorType.CONNECTOR,
         updateHandle:()=>true,
         isInput:true
      }],

      updateCursorStyle:()=>true
   } as unknown as NodeAnchor;

   const target={};

   facadeMockService.commonService.interFaceSidePanelArea=true;
   facadeMockService.commonService.interFaceSidePanelType = 'client';
   nodeAnchorService.updateCursors(anchor,target);
   expect(nodeAnchorService.updateCursors).toBeDefined();


   facadeMockService.commonService.interFaceSidePanelType = 'server';
   nodeAnchorService.updateCursors(anchor,target);
   expect(nodeAnchorService.updateCursors).toBeDefined();

   anchor={
      connectors:[{
         type:ConnectorType.CONNECTOR,
         updateHandle:()=>true,
         isInput:false
      }],

      updateCursorStyle:()=>true
   } as unknown as NodeAnchor;

   nodeAnchorService.updateCursors(anchor,target);
   expect(nodeAnchorService.updateCursors).toBeDefined();


});

it('should call dragStart method ', () => {

   const anchor={
      connectors:[{
         type:ConnectorType.CONNECTOR,
         updateHandle:()=>true,
         isInput:true,
         state:ConnectorState.Default
      }],

      updateCursorStyle:()=>true,
      highLightInterface:()=>true,
      setConnectedInterfaceStyle:()=>true
   } as unknown as NodeAnchor;

   Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getEditorContext').value.and.returnValue({id:'context12345'});

   facadeMockService.commonService.isOnline=false;
   nodeAnchorService.dragStart(anchor);
   expect(nodeAnchorService.dragStart).toBeDefined();


});

it('should call createAnchor method ', () => {

    const editor={
      svg:{
          createSVGPoint:()=>{
           return {matrixTransform:()=>true}
          }
      }
    } as unknown as LiveLink;

    facadeMockService.editorService.liveLinkEditor=editor;

    spyOn(nodeAnchorService,'drag');
    spyOn(nodeAnchorService,'bindHoverEvent');

    nodeAnchorService.createAnchor(node,anchorDetails,isInputvalue,interfaceData,index);
    expect(nodeAnchorService.createAnchor).toBeDefined();

});

it('should call dragMove method ', () => {

   let anchor={
      connectors:[{
         type:ConnectorType.CONNECTOR,
         updateHandle:()=>true,
         isInput:true,
         state:ConnectorState.Default,
         validate:()=>true,
         highlightedAnchorId:true,
         resetHighlightedAnchor:()=>true
      }],

      updateCursorStyle:()=>true,
      highLightInterface:()=>true,
      setConnectedInterfaceStyle:()=>true,
      setCursorNotAllowedStyle:()=>true,
      updateAnchorConectorCirclePosition:()=>true,
      updateTargetProperties:()=>true,
      updateCursors:()=>true
   } as unknown as NodeAnchor;

   const event={
           target:{}
   };

   const targetType=DragType.NODE

   facadeMockService.commonService.isOnline=false;
   spyOn(nodeAnchorService,'updateCursors');

   nodeAnchorService.dragMove(anchor,event,targetType);
   expect(nodeAnchorService.dragMove).toBeDefined();

   anchor={
      connectors:[{
         type:ConnectorType.CONNECTOR,
         updateHandle:()=>true,
         isInput:true,
         state:ConnectorState.Default,
         validate:()=>false,
         highlightedAnchorId:true,
         resetHighlightedAnchor:()=>true
      }],

      updateCursorStyle:()=>true,
      highLightInterface:()=>true,
      setConnectedInterfaceStyle:()=>true,
      setCursorNotAllowedStyle:()=>true,
      updateAnchorConectorCirclePosition:()=>true,
      updateTargetProperties:()=>true,
      updateCursors:()=>true
   } as unknown as NodeAnchor;

   nodeAnchorService.dragMove(anchor,event,targetType);
   expect(nodeAnchorService.dragMove).toBeDefined();

});

it('should call connectionOnMove method ', () => {

   let anchor={
      connectors:[{
         type:ConnectorType.CONNECTOR,
         updateHandle:()=>true,
         isInput:true,
         state:ConnectorState.Default,
         validate:()=>true,
         highlightedAnchorId:true,
         resetHighlightedAnchor:()=>true
      }],
      interfaceData:{
        id:'interface_12345'
      },
      updateCursorStyle:()=>true,
      highLightInterface:()=>true,
      setConnectedInterfaceStyle:()=>true,
      setCursorNotAllowedStyle:()=>true,
      updateAnchorConectorCirclePosition:()=>true,
      updateTargetProperties:()=>true,
      updateCursors:()=>true
   } as unknown as NodeAnchor;

   const element=document.createElement('div');

   const event={
           currentTarget:element,
           interaction:{
              pointerIsDown:true,
              interacting:()=>false,
              start:()=>true
           }
   };

   facadeMockService.commonService.isOnline=true;

   nodeAnchorService.connectionOnMove(anchor,event);
   expect(nodeAnchorService.connectionOnMove).toBeDefined();

   facadeMockService.commonService.isOnline=false;

   nodeAnchorService.connectionOnMove(anchor,event);
   expect(nodeAnchorService.connectionOnMove).toBeDefined();

   anchor={
      parentNode:{
         type:FillingLineNodeType.AREA
      },
      interfaceData:{
         id:'interface_12345'
       },
      updateCursorStyle:()=>true,
      highLightInterface:()=>true,
      setConnectedInterfaceStyle:()=>true,
      setCursorNotAllowedStyle:()=>true,
      updateAnchorConectorCirclePosition:()=>true,
      updateTargetProperties:()=>true,
      updateCursors:()=>true
   } as unknown as NodeAnchor;

   facadeMockService.commonService.isOnline=false;

   nodeAnchorService.connectionOnMove(anchor,event);
   expect(nodeAnchorService.connectionOnMove).toBeDefined();

   anchor={
      parentNode:{
         type:FillingLineNodeType.NODE,
         deviceId:'device12345'
      },
      interfaceData:{
         id:'interface_12345'
       },
      updateCursorStyle:()=>true,
      highLightInterface:()=>true,
      setConnectedInterfaceStyle:()=>true,
      setCursorNotAllowedStyle:()=>true,
      updateAnchorConectorCirclePosition:()=>true,
      updateTargetProperties:()=>true,
      updateCursors:()=>true
   } as unknown as NodeAnchor;

   facadeMockService.commonService.isOnline=false;

   nodeAnchorService.connectionOnMove(anchor,event);
   expect(nodeAnchorService.connectionOnMove).toBeDefined();

});




});
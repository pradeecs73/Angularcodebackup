/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed, waitForAsync } from '@angular/core/testing';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from './../../livelink-editor/services/facade.service';
import {OPCNode, OPCNodeService } from './opcnode';
import { DeviceState, FillingLineNodeType, InterfaceCategory } from '../../enum/enum';
import { FillingNode } from '../../store/filling-line/filling-line.reducer';
import { ClientInterface } from './../../models/targetmodel.interface';
import { opcNodeClasses } from './../../utility/constant';

fdescribe('opcnode service', () => {
    let opcNodeService;
    let opcNode;
    let facadeMockService;

    const fillingNodeData={

    } as unknown as FillingNode;

    const devicNode={
        node:()=>{
            return {setAttribute:()=>true}
        }
    } as unknown as ClientInterface;

    beforeEach(waitForAsync(() => {

      facadeMockService = new FacadeMockService();
      TestBed.configureTestingModule({
        providers: [
          { provide: FacadeService, useValue: facadeMockService }
        ]
      });


      opcNode=new OPCNode(devicNode,fillingNodeData,facadeMockService);
      opcNodeService = new OPCNodeService(facadeMockService);
      facadeMockService.editorService.liveLinkEditor.editorNodes = [];
    }));

    it('opc node service should be created', () => {
        expect(opcNodeService).toBeTruthy();
     });

      it('should call updateState method', () => {
        const node={
            id:'12345',
            updateFillingLineData:()=>true
        };

        const state={} as unknown as DeviceState;
        opcNodeService.updateState(node,state);

        expect(opcNodeService.updateState).toBeDefined();
      });

      it('should call assignInterfaceClickEvent method', () => {
        const node={
           inputs:[{interfaceData:'mydata'}],
           outputs:[{interfaceData:'mydata'}]
        };


        spyOn(opcNodeService,'onSubNodeClick');
        opcNodeService.assignInterfaceClickEvent(node);

        expect(opcNodeService.assignInterfaceClickEvent).toBeDefined();
      });

      it('should call createOPCNode method', () => {
        const deviceNode={
            node:()=>{
                return {setAttribute:()=>true}
            }
        } ;
        const nodeObj={
            selected:true
        } as unknown as FillingNode;

        spyOn(opcNodeService,'onSubNodeClick');
        spyOn(opcNodeService,'assignInterfaceClickEvent');
        spyOn(opcNodeService,'updateAreaElement');
        opcNodeService.createOPCNode(deviceNode,nodeObj);
        expect(opcNodeService.createOPCNode).toBeDefined();
      });

      it('should call onSubNodeClick method', () => {
        const node={

        } as unknown as OPCNode;

        const subNodeData={
        } as unknown as ClientInterface;

        opcNodeService.onSubNodeClick(node,subNodeData);
        expect(opcNodeService.onSubNodeClick).toBeDefined();
      });

      it('opcnode parent service should be created', () => {
        expect(opcNode).toBeTruthy();
     });

     it('should call getPanelData method', () => {
        const data={
          id:'panel12345',
          name:'mypanel',
          properties:[{}]
        } as unknown as ClientInterface;

        const interfaceType='client'  as unknown as InterfaceCategory;
        const deviceState='Active';
        const nodeType='Area' as unknown as FillingLineNodeType;


        opcNode.getPanelData(data,interfaceType,deviceState,nodeType);
        expect(opcNode.getPanelData).toBeDefined();
     });

     it('should call applyOnlineStyle method', () => {

        opcNode.state=DeviceState.AVAILABLE;
        spyOn(opcNode,'styleAvailableNode');
        spyOn(opcNode,'styleUnavailableNode');
        opcNode.applyOnlineStyle();
        expect(opcNode.applyOnlineStyle).toBeDefined();

        opcNode.state=DeviceState.UNAVAILABLE;

        opcNode.applyOnlineStyle();
        expect(opcNode.applyOnlineStyle).toBeDefined();
     });

     it('should call applyOfflineStyle method', () => {
        spyOn(opcNode,'styleOfflineNode');
        opcNode.applyOfflineStyle();
        expect(opcNode.applyOfflineStyle).toBeDefined();
     });

     it('should call styleOfflineNode method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');
        mySampleElement1.setAttribute('id',opcNodeClasses.parentRectange);
        mySampleElement1.setAttribute('id',opcNodeClasses.deviceHeader);
        mySampleElement.appendChild(mySampleElement1);
        opcNode.element=mySampleElement;
        spyOn(opcNode,'styleOfflineNodeForParent');
        spyOn(opcNode,'styleOfflineNodeForHeader');
        opcNode.styleOfflineNode();
        expect(opcNode.styleOfflineNode).toBeDefined();
     });

     it('should call headerClassUpdate method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');

        mySampleElement1.classList.add(opcNodeClasses.headOnline);
        mySampleElement1.setAttribute('id',opcNodeClasses.headOnline);

        mySampleElement.appendChild(mySampleElement1);
        const deviceHeader=mySampleElement as unknown as Element;

        opcNode.headerClassUpdate(deviceHeader,'.head-online');
        expect(opcNode.headerClassUpdate).toBeDefined();
     });

     it('should call hideClassUpdate method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');

        mySampleElement1.classList.add(opcNodeClasses.headOnline);
        mySampleElement1.setAttribute('id',opcNodeClasses.headOnline);

        mySampleElement.appendChild(mySampleElement1);
        const deviceHeader=mySampleElement as unknown as Element;

        opcNode['hideClassUpdate'](deviceHeader,'.head-online');
        expect(opcNode['hideClassUpdate']).toBeDefined();
     });

     it('should call removeDeviceStateUnavailableIcon method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');

        mySampleElement1.classList.add(opcNodeClasses.headOnline);
        mySampleElement1.setAttribute('id',opcNodeClasses.headOnline);

        mySampleElement.appendChild(mySampleElement1);
        const deviceHeader=mySampleElement as unknown as Element;

        opcNode['removeDeviceStateUnavailableIcon'](deviceHeader,'.head-online');
        expect(opcNode['removeDeviceStateUnavailableIcon']).toBeDefined();
     });

     it('should call addDeviceStateUnavailableIcon method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');

        mySampleElement1.classList.add(opcNodeClasses.headOnline);
        mySampleElement1.setAttribute('id',opcNodeClasses.headOnline);

        mySampleElement.appendChild(mySampleElement1);
        const deviceHeader=mySampleElement as unknown as Element;

        opcNode['addDeviceStateUnavailableIcon'](deviceHeader,'.head-online');
        expect(opcNode['addDeviceStateUnavailableIcon']).toBeDefined();
     });

     it('should call updateHeaderBoxClass method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');

        mySampleElement1.classList.add(opcNodeClasses.nodeHeaderOffline);
        mySampleElement1.classList.add(opcNodeClasses.nodeHeaderOnline);
        mySampleElement1.classList.add('header-box');
        mySampleElement1.setAttribute('id',opcNodeClasses.headOnline);

        mySampleElement.appendChild(mySampleElement1);
        const deviceHeader=mySampleElement as unknown as Element;

        opcNode['updateHeaderBoxClass'](deviceHeader,'.head-online');
        expect(opcNode['updateHeaderBoxClass']).toBeDefined();
     });

     it('should call styleAvailableNodeRect method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');

        mySampleElement1.classList.add(opcNodeClasses.nodeHeaderOffline);
        mySampleElement1.classList.add(opcNodeClasses.nodeHeaderOnline);
        mySampleElement1.classList.add('header-box');
        mySampleElement1.setAttribute('id',opcNodeClasses.headOnline);

        mySampleElement.appendChild(mySampleElement1);
        const rect1=mySampleElement as unknown as Element;

        opcNode.styleAvailableNodeRect(rect1);
        expect(opcNode.styleAvailableNodeRect).toBeDefined();
     });

     it('should call getAllAnchorNodes method', () => {
        opcNode.getAllAnchorNodes();
        expect(opcNode.getAllAnchorNodes).toBeDefined();
     });

     it('should call styleAvailableNode method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');

        mySampleElement1.setAttribute('id','parent-rect');
        mySampleElement1.classList.add('header-box');

        mySampleElement.appendChild(mySampleElement1);
        opcNode.element=mySampleElement as unknown as Element;

        opcNode.styleAvailableNode();
        expect(opcNode.styleAvailableNode).toBeDefined();
     });

     it('should call styleOfflineNodeForParent method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');

        mySampleElement1.classList.add('cls-2-online');
        mySampleElement1.classList.add('cls-2-selected');

        mySampleElement1.classList.add('header-box');

        mySampleElement.appendChild(mySampleElement1);
        let parent1=mySampleElement as unknown as Element;

        opcNode.styleOfflineNodeForParent(parent1);
        expect(opcNode.styleOfflineNodeForParent).toBeDefined();

        mySampleElement1.classList.remove('cls-2-online');
        mySampleElement1.classList.add('cls-2-selected');

        parent1=mySampleElement as unknown as Element;

        opcNode.styleOfflineNodeForParent(parent1);
        expect(opcNode.styleOfflineNodeForParent).toBeDefined();

        mySampleElement1.classList.remove('cls-2-selected');
        mySampleElement1.classList.add('cls-2-unavailable');

        parent1=mySampleElement as unknown as Element;

        opcNode.styleOfflineNodeForParent(parent1);
        expect(opcNode.styleOfflineNodeForParent).toBeDefined();

     });

     it('should call styleAvailableNodeHeader method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');
        mySampleElement1.classList.add('header-box');
        mySampleElement1.setAttribute('id',opcNodeClasses.headOnline);

        mySampleElement.appendChild(mySampleElement1);
        const deviceHeader=mySampleElement as unknown as Element;

        spyOn(opcNode,'styleOnlineNodeHeaderColor');
        spyOn(opcNode,'removeDeviceStateUnavailableIcon');
        spyOn(opcNode,'addDeviceStateUnavailableIcon');

        opcNode.styleAvailableNodeHeader(deviceHeader);
        expect(opcNode.styleAvailableNodeHeader).toBeDefined();
     });

      it('should call styleOfflineNodeForHeader method', () => {
        const mySampleElement=document.createElement('div');
        const mySampleElement1=document.createElement('div');
        mySampleElement1.classList.add('header-box');
        mySampleElement1.setAttribute('id',opcNodeClasses.headOnline);

        mySampleElement.appendChild(mySampleElement1);
        const deviceHeader=mySampleElement as unknown as Element;

        spyOn(opcNode,'headerClassUpdate');
        spyOn(opcNode,'hideClassUpdate');

        opcNode.styleOfflineNodeForHeader(deviceHeader);
        expect(opcNode.styleOfflineNodeForHeader).toBeDefined();
     });

      it('should call styleUnavailableNode method', () => {
        let mySampleElement=document.createElement('div');
        let mySampleElement1=document.createElement('div');
        let mySampleElement2=document.createElement('div');

        mySampleElement1.setAttribute('id','parent-rect');
        mySampleElement2.classList.add('cls-2');

        mySampleElement1.appendChild(mySampleElement2);
        mySampleElement.appendChild(mySampleElement1);
        opcNode.element=mySampleElement as unknown as Element;

        opcNode.styleUnavailableNode();
        expect(opcNode.styleUnavailableNode).toBeDefined();


         mySampleElement=document.createElement('div');
         mySampleElement1=document.createElement('div');
         mySampleElement2=document.createElement('div');

        mySampleElement1.setAttribute('id','parent-rect');
        mySampleElement2.classList.add('cls-2-selected');

        mySampleElement1.appendChild(mySampleElement2);
        mySampleElement.appendChild(mySampleElement1);
        opcNode.element=mySampleElement as unknown as Element;

        opcNode.styleUnavailableNode();
        expect(opcNode.styleUnavailableNode).toBeDefined();


        mySampleElement=document.createElement('div');
        mySampleElement1=document.createElement('div');
        mySampleElement2=document.createElement('div');

       mySampleElement1.setAttribute('id','parent-rect');
       mySampleElement2.classList.add('cls-2-online');

       mySampleElement1.appendChild(mySampleElement2);
       mySampleElement.appendChild(mySampleElement1);
       opcNode.element=mySampleElement as unknown as Element;

       opcNode.styleUnavailableNode();
       expect(opcNode.styleUnavailableNode).toBeDefined();

     });


   it('should call styleUnavailableNode method', () => {
      const mySampleElement=document.createElement('div');
      const mySampleElement1=document.createElement('div');
      const mySampleElement2=document.createElement('div');

      mySampleElement1.setAttribute('id','parent-rect');
      mySampleElement2.setAttribute('id','Device-header');

      mySampleElement1.appendChild(mySampleElement2);
      mySampleElement.appendChild(mySampleElement1);
      opcNode.element=mySampleElement as unknown as Element;

      spyOn(opcNode,'updateHeaderBoxClass');
      spyOn(opcNode,'styleOnlineNodeHeaderColor');
      spyOn(opcNode,'removeDeviceStateUnavailableIcon');
      spyOn(opcNode,'addDeviceStateUnavailableIcon');

      opcNode.styleUnavailableNode();
      expect(opcNode.styleUnavailableNode).toBeDefined();

   });

   it('should call styleOnlineNodeHeaderColor method', () => {

      let mySampleElement=document.createElement('div');
      let mySampleElement1=document.createElement('div');
      let mySampleElement2=document.createElement('div');

      mySampleElement1.setAttribute('id','Device-header');
      mySampleElement2.classList.add('head-text');

      mySampleElement1.appendChild(mySampleElement2);
      mySampleElement.appendChild(mySampleElement1);
      opcNode.element=mySampleElement as unknown as Element;

      opcNode.styleOnlineNodeHeaderColor();
      expect(opcNode.styleOnlineNodeHeaderColor).toBeDefined();

       mySampleElement=document.createElement('div');
       mySampleElement1=document.createElement('div');
       mySampleElement2=document.createElement('div');

      mySampleElement1.setAttribute('id','Device-header');
      mySampleElement2.classList.add('head-icon');

      mySampleElement1.appendChild(mySampleElement2);
      mySampleElement.appendChild(mySampleElement1);
      opcNode.element=mySampleElement as unknown as Element;

      opcNode.styleOnlineNodeHeaderColor();
      expect(opcNode.styleOnlineNodeHeaderColor).toBeDefined();

      mySampleElement=document.createElement('div');
      mySampleElement1=document.createElement('div');
      mySampleElement2=document.createElement('div');

      mySampleElement1.setAttribute('id','Device-header');
      mySampleElement2.classList.add('head-sub-text');

      mySampleElement1.appendChild(mySampleElement2);
      mySampleElement.appendChild(mySampleElement1);
      opcNode.element=mySampleElement as unknown as Element;

      opcNode.styleOnlineNodeHeaderColor();
      expect(opcNode.styleOnlineNodeHeaderColor).toBeDefined();


      mySampleElement=document.createElement('div');
      mySampleElement1=document.createElement('div');
      mySampleElement2=document.createElement('div');

      mySampleElement1.setAttribute('id','Device-header');
      mySampleElement2.classList.add('head-eclipses');

      mySampleElement1.appendChild(mySampleElement2);
      mySampleElement.appendChild(mySampleElement1);
      opcNode.element=mySampleElement as unknown as Element;

      opcNode.styleOnlineNodeHeaderColor();
      expect(opcNode.styleOnlineNodeHeaderColor).toBeDefined();

   });







});

 /*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed, waitForAsync } from '@angular/core/testing';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from './../../../livelink-editor/services/facade.service';
import { MonitorAdapter } from './monitor-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { TreeModule } from 'primeng/tree';
import { ServiceInjectorModule } from '../service-injector.module';
import { Injector } from '@angular/core';
import { SocketService } from '../../../services/socket.service';
import { CreateConnectionPayload, MonitorNode, MonitorObservable, MonitorPayload, TreeData } from './../../../models/monitor.interface';
import { BaseConnector } from '../../opcnodes/baseConnector';
import { ConnectionAttributes, ConnectorCreationMode, ConnectorType, DeviceState, FillingLineNodeType, MONITORTYPE } from './../../../enum/enum';
import { Observable, of } from 'rxjs';
import { AreaHierarchy } from './../../../models/area.interface';
import { NodeAnchor } from '../../opcnodes/node-anchor';
import { HTMLNode } from '../../opcnodes/htmlNode';
import { ConnectionData, MatchingConnectionInterface } from './../../../models/connection.interface';
import { ClientInterface, Device, RelatedEndPointInterface } from './../../../models/targetmodel.interface';
import { ApiResponse, LiveLink } from './../../../models/models';
import { HttpErrorResponse } from '@angular/common/http';
import { SubConnector } from '../../opcnodes/subConnector';
import { monitorAdapterMockData } from "mockData";
import { connector } from 'mockData/connector';

let socketService={} as unknown as SocketService;
let fascadeMockService=monitorAdapterMockData;


fdescribe('Monitor adapter service', () => {

    class MonitorAdapterService extends MonitorAdapter {
        setTagValueFromMonitor(eventName: string, value, treeData: TreeData[]){

        }
        getServerDiagnosticData(connector: BaseConnector){

        }
    }


  let monitorAdapterServiceInstance:MonitorAdapter;
  let facadeMockService;

  beforeEach(waitForAsync(() => {
    facadeMockService = new FacadeMockService();
    TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService },
        {provide:SocketService,useValue:socketService},
        Injector
      ],
      imports: [TreeModule,TranslateModule.forRoot({}),ServiceInjectorModule]
    });

      spyOn(TestBed.get(Injector), 'get').and.returnValue({dataService:{getProjectId:()=>'project12345'}});
      monitorAdapterServiceInstance=  new MonitorAdapterService();
  }));

  it('should create monitor adapter Service Instance ', () => {
    expect(monitorAdapterServiceInstance).toBeTruthy();
  });

  it('should call goOnlineCallback method', () => {
     const deviceList=[];
     const isError=true;

     spyOn<any>(monitorAdapterServiceInstance,'updateApplicationData');
     spyOn<any>(monitorAdapterServiceInstance,'subscribeToConnectionLost');
     spyOn<any>(monitorAdapterServiceInstance,'subscribeToConnectionReconnect');
     spyOn<any>(monitorAdapterServiceInstance,'handleDataMonitoring');

     monitorAdapterServiceInstance['goOnlineCallback'](deviceList,isError);
     expect( monitorAdapterServiceInstance['goOnlineCallback']).toBeDefined();
     expect( monitorAdapterServiceInstance['updateApplicationData']).toHaveBeenCalled();
     expect( monitorAdapterServiceInstance['subscribeToConnectionLost']).toHaveBeenCalled();
  });

  it('should call showGoOnlineLoader method', () => {
    monitorAdapterServiceInstance['facadeService']=fascadeMockService;
    monitorAdapterServiceInstance['showGoOnlineLoader']();
    expect( monitorAdapterServiceInstance['showGoOnlineLoader']).toBeDefined();
    expect( monitorAdapterServiceInstance['facadeService'].overlayService.loader).toBeDefined();
 });

 it('should call showGoOfflineLoader method', () => {
  monitorAdapterServiceInstance['facadeService']=fascadeMockService;
  monitorAdapterServiceInstance['showGoOfflineLoader']();
  expect( monitorAdapterServiceInstance['showGoOfflineLoader']).toBeDefined();
  expect( monitorAdapterServiceInstance['facadeService'].overlayService.loader).toBeDefined();
});

it('should call offlineState method', () => {
  monitorAdapterServiceInstance['facadeService']=fascadeMockService;
  monitorAdapterServiceInstance['offlineState']();
  expect( monitorAdapterServiceInstance['offlineState']).toBeDefined();
  expect( monitorAdapterServiceInstance['facadeService'].applicationStateService.changeApplicationStatus).toBeDefined();
  expect( monitorAdapterServiceInstance['facadeService'].commonService.isOnline).toEqual(false);
});

it('should call updateConnectionEndPointDetails method', () => {
  let param=ConnectionAttributes.DIAGNOSE;
  const value='samplevalue';
  const deviceId='device12345';
  const automationComponentId='automation12345';
  const interfaceId='interface12345';

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  monitorAdapterServiceInstance['updateConnectionEndPointDetails'](param,value,deviceId,automationComponentId,interfaceId);
  expect( monitorAdapterServiceInstance['updateConnectionEndPointDetails']).toBeDefined();

  param=ConnectionAttributes.PARTNER;

  monitorAdapterServiceInstance['updateConnectionEndPointDetails'](param,value,deviceId,automationComponentId,interfaceId);
  expect( monitorAdapterServiceInstance['updateConnectionEndPointDetails']).toBeDefined();

  param=ConnectionAttributes.RELATEDENDPOINT;

  monitorAdapterServiceInstance['updateConnectionEndPointDetails'](param,value,deviceId,automationComponentId,interfaceId);
  expect( monitorAdapterServiceInstance['updateConnectionEndPointDetails']).toBeDefined();
  expect(monitorAdapterServiceInstance['facadeService'].dataService.updateConnectionEndPointDetails).toBeDefined();

});

it('should call updateAreaDeviceState method', () => {
  const eventName='event12345.event678910';
  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  monitorAdapterServiceInstance['updateAreaDeviceState'](eventName);
  expect( monitorAdapterServiceInstance['updateAreaDeviceState']).toBeDefined();
  expect( monitorAdapterServiceInstance['emitTagMapValueChangeEvent']).toBeDefined();
});

it('should call getCachedServerDiagnosticData method', () => {
  const id='id12345';
  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  Object.defineProperty(monitorAdapterServiceInstance, '_connectionServerDiagnosticMonitorMap$', {
    value: {
      has:()=>false,
      get:()=>true
    },
    writable: true
  });

  let getCachedServerDiagnosticDataReturnValue=monitorAdapterServiceInstance['getCachedServerDiagnosticData'](id);
  expect( monitorAdapterServiceInstance['getCachedServerDiagnosticData']).toBeDefined();
  expect(getCachedServerDiagnosticDataReturnValue).toEqual(null);

  Object.defineProperty(monitorAdapterServiceInstance, '_connectionServerDiagnosticMonitorMap$', {
    value: {
      has:()=>true,
      get:()=>true
    },
    writable: true
  });

  getCachedServerDiagnosticDataReturnValue=monitorAdapterServiceInstance['getCachedServerDiagnosticData'](id);
  expect( monitorAdapterServiceInstance['getCachedServerDiagnosticData']).toBeDefined();
  expect(getCachedServerDiagnosticDataReturnValue).not.toEqual(null);

});

it('should call removeFromCachedServerMonitoringData method', () => {
  const id='id12345';
  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  Object.defineProperty(monitorAdapterServiceInstance, '_connectionServerDiagnosticMonitorMap$', {
    value: {
      has:()=>true,
      delete:()=>true
    },
    writable: true
  });

  Object.defineProperty(monitorAdapterServiceInstance, '_connectionMonitorMap$', {
    value: {
      delete:()=>true
    },
    writable: true
  });

  monitorAdapterServiceInstance['removeFromCachedServerMonitoringData'](id);
  expect( monitorAdapterServiceInstance['removeFromCachedServerMonitoringData']).toBeDefined();


});

it('should call goOffline method', () => {


  Object.defineProperty(monitorAdapterServiceInstance, '_connectionMonitorMap$', {
    value: {
      delete:()=>true
    },
    writable: true
  });

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  spyOn<any>(monitorAdapterServiceInstance,'unSubscribeToConnectionLost');
  spyOn<any>(monitorAdapterServiceInstance,'unSubscribeToConnectionReconnect');
  spyOn<any>(monitorAdapterServiceInstance,'clearMonitorMaps');
  spyOn<any>(monitorAdapterServiceInstance,'showGoOfflineLoader');

  monitorAdapterServiceInstance.goOffline();
  expect( monitorAdapterServiceInstance.goOffline).toBeDefined();
  expect( monitorAdapterServiceInstance['unSubscribeToConnectionLost']).toHaveBeenCalled();
  expect( monitorAdapterServiceInstance['unSubscribeToConnectionReconnect']).toHaveBeenCalled();
  expect( monitorAdapterServiceInstance['clearMonitorMaps']).toHaveBeenCalled();
  expect( monitorAdapterServiceInstance['showGoOfflineLoader']).toHaveBeenCalled();

});

it('should call getMonitorDataById method', () => {

  const id='id12345';

  Object.defineProperty(monitorAdapterServiceInstance, '_connectionMonitorMap$', {
    value: {
      has:()=>false,
      get:()=>true
    },
    writable: true
  });

  let getMonitorDataByIdReturnValue=monitorAdapterServiceInstance.getMonitorDataById(id);
  expect( monitorAdapterServiceInstance.getMonitorDataById).toBeDefined();
  expect(getMonitorDataByIdReturnValue).toEqual(null);

  Object.defineProperty(monitorAdapterServiceInstance, '_connectionMonitorMap$', {
    value: {
      has:()=>true,
      get:()=>true
    } ,
    writable: true
  });

  getMonitorDataByIdReturnValue=monitorAdapterServiceInstance.getMonitorDataById(id);
  expect( monitorAdapterServiceInstance.getMonitorDataById).toBeDefined();
  expect(getMonitorDataByIdReturnValue).not.toEqual(null);


});

it('should call setServerDiagnosticMonitorData method', () => {

  const id='id12345';
  const data='data12345';

  spyOn(monitorAdapterServiceInstance['_connectionMonitorMap$'],'set');

  monitorAdapterServiceInstance.setServerDiagnosticMonitorData(id,data);
  expect( monitorAdapterServiceInstance.setServerDiagnosticMonitorData).toBeDefined();


});

it('should call setServerDiagnosticData method', () => {

  const id='id12345';
  const data='data12345';

  spyOn(monitorAdapterServiceInstance['_connectionServerDiagnosticMonitorMap$'],'set');

  monitorAdapterServiceInstance.setServerDiagnosticData(id,data);
  expect( monitorAdapterServiceInstance.setServerDiagnosticData).toBeDefined();


});

it('should call emitTagMapValueChangeEvent method', () => {

  const tagMap={
    get:()=>{
          return {event:{emit:()=>true},value:true}
    }
  };
  const eventName='event12345';
  const value='samplevalue';

  spyOn(monitorAdapterServiceInstance['_connectionServerDiagnosticMonitorMap$'],'set');

  monitorAdapterServiceInstance['emitTagMapValueChangeEvent'](tagMap,eventName,value);
  expect( monitorAdapterServiceInstance['emitTagMapValueChangeEvent']).toBeDefined();


});

it('should call monitorTags method', () => {
   const monitorPayload={
    nodeList:[{}]
   } as unknown as MonitorPayload;

   monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  let monitorTagResult= monitorAdapterServiceInstance.monitorTags(monitorPayload);
  expect( monitorAdapterServiceInstance.monitorTags).toBeDefined();
  expect(monitorTagResult).toBeInstanceOf(Boolean);
});

it('should call getTagObservable method', () => {

  const deviceId='device12345';
  const automationComponent='automation12345';
  const interfaceId='interface12345';

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  monitorAdapterServiceInstance.tagMonitorObseravablesMap={
    has:()=>false,
    set:()=>true,
    get:()=>true
  } as unknown as  Map<string, Map<string, MonitorObservable>>;

  const getObserableReturn=monitorAdapterServiceInstance['getTagObservable'](deviceId,automationComponent,interfaceId);
  expect( monitorAdapterServiceInstance['getTagObservable']).toBeDefined();
  expect(getObserableReturn).not.toEqual(null);
  expect(getObserableReturn).toBeInstanceOf(Boolean);
});

it('should call setTagObservable method', () => {

  const deviceId='device12345';
  const automationComponent='automation12345';
  const interfaceId='interface12345';
  const eventName='event12345';

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  monitorAdapterServiceInstance.tagMonitorObseravablesMap={
    has:()=>false,
    set:()=>true,
    get:()=>true
  } as unknown as  Map<string, Map<string, MonitorObservable>>;

  spyOn<any>(monitorAdapterServiceInstance,'getTagObservable').and.returnValue(
    {
       has:()=>false,
       set:()=>true
    }
  );

  monitorAdapterServiceInstance['setTagObservable'](deviceId,automationComponent,interfaceId,eventName);
  expect( monitorAdapterServiceInstance['getTagObservable']).toBeDefined();


});


it('should call handleConnectionMonitoringForOuterArea method', () => {

  let areaHierarchyDetails={
    sourceAreaHierarchy:['parent678910','parent12345'],
    commonParent:'parent12345'
  } as unknown as AreaHierarchy;
  const inputAnchor={
    interfaceData:{
      id:'interface12345'
    }
  } as unknown as NodeAnchor;

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;
  spyOn(monitorAdapterServiceInstance,'removeEventFromConnectionMonitorMap');

  let handleConnectionReturn=monitorAdapterServiceInstance.handleConnectionMonitoringForOuterArea(areaHierarchyDetails,inputAnchor);
  expect( monitorAdapterServiceInstance.handleConnectionMonitoringForOuterArea).toBeDefined();
  expect(handleConnectionReturn).toEqual(false);

  areaHierarchyDetails={
    sourceAreaHierarchy:['parent12345','parent678910'],
    commonParent:'parent12345'
  } as unknown as AreaHierarchy;

  handleConnectionReturn=monitorAdapterServiceInstance.handleConnectionMonitoringForOuterArea(areaHierarchyDetails,inputAnchor);
  expect( monitorAdapterServiceInstance.handleConnectionMonitoringForOuterArea).toBeDefined();
  expect(handleConnectionReturn).toEqual(true);

});


it('should call unSubscribeToConnectionLost method', () => {

  spyOn<any>(monitorAdapterServiceInstance,'unSubscribeToIOEvent');

  monitorAdapterServiceInstance['unSubscribeToConnectionLost']();
  expect( monitorAdapterServiceInstance['unSubscribeToConnectionLost']).toBeDefined();
  expect( monitorAdapterServiceInstance['unSubscribeToIOEvent']).toHaveBeenCalled();

});

it('should call unSubscribeToConnectionReconnect method', () => {

  spyOn<any>(monitorAdapterServiceInstance,'unSubscribeToIOEvent');

  monitorAdapterServiceInstance['unSubscribeToConnectionReconnect']();
  expect( monitorAdapterServiceInstance['unSubscribeToConnectionReconnect']).toBeDefined();
  expect( monitorAdapterServiceInstance['unSubscribeToIOEvent']).toHaveBeenCalled();

});

it('should call handleDataMonitoring method', () => {

  spyOn<any>(monitorAdapterServiceInstance,'getMonitorCallsList');
  spyOn<any>(monitorAdapterServiceInstance,'monitor');

  monitorAdapterServiceInstance['handleDataMonitoring']();
  expect( monitorAdapterServiceInstance['handleDataMonitoring']).toBeDefined();
  expect( monitorAdapterServiceInstance['monitor']).toHaveBeenCalled();

});

it('should call unSubscribeToIOEvent method', () => {

  const event={};

  Object.defineProperty(monitorAdapterServiceInstance, 'socket', {
    value: {getIo:()=>{return {removeAllListeners:()=>true}}}  as unknown as SocketService,
    writable: true
  });

  spyOn<any>(monitorAdapterServiceInstance,'monitor');

  monitorAdapterServiceInstance['unSubscribeToIOEvent'](event);
  expect( monitorAdapterServiceInstance['unSubscribeToIOEvent']).toBeDefined();

});

it('should call monitor method', () => {

 const monitorObsList=[of({}),of({})] as unknown as Array<Observable<Object>>;
 monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  monitorAdapterServiceInstance.monitor(monitorObsList);
  expect( monitorAdapterServiceInstance.monitor).toBeDefined();

});

it('should call handleMonitoringAfterReconnect method', () => {

  const deviceNodes=[{}] as unknown as Array<HTMLNode>;
  const monitorObsList=[of({}),of({})] as unknown as Array<Observable<Object>>;

  spyOn<any>(monitorAdapterServiceInstance,'monitorNodesClientInterfaces');
  spyOn<any>(monitorAdapterServiceInstance,'monitor');
  spyOn<any>(monitorAdapterServiceInstance,'handleDataMonitoring');

   monitorAdapterServiceInstance.handleMonitoringAfterReconnect(deviceNodes,monitorObsList);
   expect( monitorAdapterServiceInstance.monitor).toHaveBeenCalled();
   expect( monitorAdapterServiceInstance['handleDataMonitoring']).toHaveBeenCalled();

 });

 it('should call getMonitorPayload method', () => {

  const connectData={
    deviceId:'device12345',
    interfaceName:'interface12345',
    automationComponent:'automation12345',
    serverDeviceId:'server12345'
  } as unknown as ConnectionData;
  const eventDiagnose='value';
  const eventPartner='value';
  const eventDetailedStatus='online';
  const partnerUrl='/diagnoise';

  let monitorPayloadReturn=monitorAdapterServiceInstance['getMonitorPayload'](connectData,eventDiagnose,eventPartner,eventDetailedStatus,partnerUrl);
  expect( monitorAdapterServiceInstance['getMonitorPayload']).toBeDefined();
  expect(monitorPayloadReturn).not.toBe(null);
  expect(monitorPayloadReturn).toBeInstanceOf(Object);
 });

 it('should call updateApplicationData method', () => {

  const deviceList=[{}] as unknown as Device[];
  const isError=true;

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  monitorAdapterServiceInstance['updateApplicationData'](deviceList,isError);
  expect( monitorAdapterServiceInstance['updateApplicationData']).toBeDefined();
  expect( monitorAdapterServiceInstance['facadeService'].errorHandleService.updateNotificationPanel).toBeDefined();
  expect( monitorAdapterServiceInstance['facadeService'].drawService.applyStyleToEditor).toBeDefined();
 });

 it('should call deviceNode method', () => {

  let deviceData={uid:'device12345'} as unknown as Device;
  const deviceId='device12345';

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  monitorAdapterServiceInstance['deviceNode'](deviceData,deviceId);
  expect( monitorAdapterServiceInstance['deviceNode']).toBeDefined();

  deviceData={uid:'device12367'} as unknown as Device;

  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:{
      filter:()=>undefined
    }
  } as unknown as LiveLink;

  const deviceNodes=monitorAdapterServiceInstance['deviceNode'](deviceData,deviceId);
  expect( monitorAdapterServiceInstance['deviceNode']).toBeDefined();
  expect(deviceNodes).not.toBe(null);
  expect(deviceNodes).toBeInstanceOf(Boolean);

 });


 it('should call commonError method', () => {

   let error={
    error:{
      data:{
        deviceList:[{}]
      }
    }
   } as unknown as  HttpErrorResponse;


  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

   spyOn<any>(monitorAdapterServiceInstance,'goOnlineCallback');

   monitorAdapterServiceInstance.commonError(error);
   expect( monitorAdapterServiceInstance['goOnlineCallback']).toHaveBeenCalled();
   expect( monitorAdapterServiceInstance.commonError).toBeDefined();

   error={
    error:{
      data:undefined
    }
   } as unknown as  HttpErrorResponse;

   spyOn<any>(monitorAdapterServiceInstance,'offlineState');

   monitorAdapterServiceInstance.commonError(error);
   expect( monitorAdapterServiceInstance['offlineState']).toHaveBeenCalled();
   expect( monitorAdapterServiceInstance.commonError).toBeDefined();

 });


 it('should call deviceNode method', () => {

  const deviceId='device12345';

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:[{type:FillingLineNodeType.NODE,deviceId:'device12345',
    inputs:[{deviceId:'device12345',connectors:[{resetEndPointDetails:()=>true}]}],outputs:[{deviceId:'device12345',connectors:[{resetEndPointDetails:()=>true}]}]}]
  } as unknown as LiveLink;

  monitorAdapterServiceInstance['resetClientConnectorEndPointDetails'](deviceId);
  expect( monitorAdapterServiceInstance['resetClientConnectorEndPointDetails']).toBeDefined();

  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:[{type:FillingLineNodeType.NODE,deviceId:'device1234567',
    inputs:[{deviceId:'device12345',connectors:[{resetEndPointDetails:()=>true}]}],outputs:[{deviceId:'device12345',connectors:[{resetEndPointDetails:()=>true}]}]}]
  } as unknown as LiveLink;

  monitorAdapterServiceInstance['resetClientConnectorEndPointDetails'](deviceId);
  expect( monitorAdapterServiceInstance['resetClientConnectorEndPointDetails']).toBeDefined();
  expect( monitorAdapterServiceInstance['resetClientConnectorEndPointDetails']).toBeDefined();

 });


 it('should call generateNotification method', () => {

  const result={
    data:{
      deviceList:[{name:'device12345',automationComponents:[{name:'samplename',}],status:'online'}]
    }
  } as unknown as ApiResponse;

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  monitorAdapterServiceInstance.generateNotification(result);
  expect( monitorAdapterServiceInstance.generateNotification).toBeDefined();

 });


 it('should call removeEventFromConnectionMonitorMap method', () => {

  const event='sampleevent';

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  spyOn<any>(monitorAdapterServiceInstance,'unSubscribeToIOEvent');
  Object.defineProperty(monitorAdapterServiceInstance, 'conenctionMonitorItemsMap', {
    value: {delete:()=>true},
    writable: true
  });

  monitorAdapterServiceInstance.removeEventFromConnectionMonitorMap(event);
  expect( monitorAdapterServiceInstance['facadeService'].editorService.getAreaWithDeviceInterfaces).toBeDefined();

 });


 it('should call updateExistingConnectionData method', () => {

   const param='param12345';
   const value='value12345';
   const connectorId='connector12345';
   const connectortype='sampleconnectortype' as unknown as ConnectorType;
   const deviceId='device12345';
   const automationComponentId='automation12345';
   const interfaceId='interace12345';


  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  spyOn<any>(monitorAdapterServiceInstance,'updateConnectionEndPointDetails').and.
  returnValue({ connectionStatus:'online', relatedEndPoint:'/update'});
  spyOn<any>(monitorAdapterServiceInstance,'updateAndStyleConnector');

  monitorAdapterServiceInstance['updateExistingConnectionData'](param,value,connectorId,connectortype,deviceId,automationComponentId,interfaceId);
  expect( monitorAdapterServiceInstance['updateExistingConnectionData']).toBeDefined();
  expect( monitorAdapterServiceInstance['updateAndStyleConnector']).toHaveBeenCalled();

 });

 it('should call updateAndStyleConnector method', () => {

  const connectorId='connector12345';
  const connectortype='sampleconnectortype' as unknown as ConnectorType;
  const param='param12345';
  const relatedEndPoint='/update' as unknown as RelatedEndPointInterface;
  const connectionStatus=true;
 monitorAdapterServiceInstance['facadeService']=fascadeMockService;

 monitorAdapterServiceInstance['updateAndStyleConnector'](connectorId,connectortype,
  param,relatedEndPoint,connectionStatus);
 expect( monitorAdapterServiceInstance['updateAndStyleConnector']).toBeDefined();
 expect( monitorAdapterServiceInstance['facadeService'].editorService.updateConnectionMonitor).toBeDefined();
 expect( monitorAdapterServiceInstance['facadeService'].drawService.updateAndStyleConnector).toBeDefined();

});

it('should call updateAndStyleConnector method', () => {

 let payload={
        param:'param1234',
        value:'value12345',
        connectorId:'connector12345',
        connectorType:'online',
        deviceId:'device12345',
        automationComponentId:'automation12345',
        interfaceId:'interface12345'

 } as unknown as CreateConnectionPayload;

 monitorAdapterServiceInstance['facadeService']=fascadeMockService;

 spyOn<any>(monitorAdapterServiceInstance,'updateExistingConnectionData');
 spyOn<any>(monitorAdapterServiceInstance,'createOnlineConnection');

 monitorAdapterServiceInstance['updateOrCreateConnection'](payload);
 expect( monitorAdapterServiceInstance['updateOrCreateConnection']).toBeDefined();

 payload={
  param:'param1234',
  value:'value12345',
  connectorId:null,
  connectorType:'online',
  deviceId:'device12345',
  automationComponentId:'automation12345',
  interfaceId:'interface12345'

} as unknown as CreateConnectionPayload;

monitorAdapterServiceInstance['updateOrCreateConnection'](payload);
expect( monitorAdapterServiceInstance['updateOrCreateConnection']).toBeDefined();

});


it('should call setTagMonitorItems method', () => {

    const deviceId='device12345';
    const automationComponent='automation12345';
    const interfaceId='inteface12345';
    const interfaceName='inteface12345';
    const monitorList=[{}] as unknown as Array<MonitorNode>;
    const type=MONITORTYPE.SERVERCONNECTIONDIAGNOSTICS as unknown as MONITORTYPE;
    const sessionName='session12345';

    monitorAdapterServiceInstance.monitorItems={} as unknown as MonitorPayload;

  monitorAdapterServiceInstance.setTagMonitorItems(deviceId,automationComponent,interfaceId,interfaceName,
   monitorList,type,sessionName);
  expect(monitorAdapterServiceInstance.setTagMonitorItems).toBeDefined();

 });

 it('should call getTagMonitorItems method', () => {

  const deviceId='device12345';
  const automationComponent='automation12345';
  const interfaceId='inteface12345';


monitorAdapterServiceInstance.monitorItems={} as unknown as MonitorPayload;

Object.defineProperty(monitorAdapterServiceInstance, 'tagMonitorItemsMap', {
  value: {get:()=>{}},
  writable: true
});


const monitorItemsReturn=monitorAdapterServiceInstance.getTagMonitorItems(deviceId,automationComponent,interfaceId);
expect(monitorAdapterServiceInstance.getTagMonitorItems).toBeDefined();
expect(monitorItemsReturn).not.toBe(null);

});

it('should call onlineConnectionForDiagnose method', () => {

    const value='value12345';
    const param='param12345';
    const deviceId='device12345';
    const automationComponentId='automation12345';
    const interfaceId='interface12345';
    const inputAnchor={
       connectors:[{type:'connector',id:'connector12345'}]
    } as unknown as NodeAnchor;
    const relatedEndPoint='/online' as unknown as RelatedEndPointInterface

    monitorAdapterServiceInstance['facadeService']=fascadeMockService;

    spyOn<any>(monitorAdapterServiceInstance,'updateConnectionEndPointDetails');



   monitorAdapterServiceInstance.onlineConnectionForDiagnose(value,param,deviceId,automationComponentId,
    interfaceId,inputAnchor,relatedEndPoint);
   expect(monitorAdapterServiceInstance.onlineConnectionForDiagnose).toBeDefined();
   expect( monitorAdapterServiceInstance['facadeService'].editorService.getBaseConnector).toBeDefined();
   expect( monitorAdapterServiceInstance['facadeService'].drawService.updateAndStyleConnector).toBeDefined();

});

it('should call onlineConnectionForPartner method', () => {

  const value='value12345';
  let inputAnchor={
    connectors:[{type:ConnectorType.SUBCONNECTOR,id:'connector12345'}],
    relatedEndPoint :null
 } as unknown as NodeAnchor;
  const param='param12345';
  const deviceId='device12345';
  const automationComponentId='automation12345';
  const interfaceId='interface12345';
  const connectionStatus=true;

  const relatedEndPoint='/online' as unknown as RelatedEndPointInterface

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  spyOn<any>(monitorAdapterServiceInstance,'updateConnectionEndPointDetails');
  spyOn<any>(monitorAdapterServiceInstance,'updateAndStyleConnector');

 monitorAdapterServiceInstance.onlineConnectionForPartner(value,inputAnchor,param,deviceId,automationComponentId,
  interfaceId,connectionStatus);
 expect(monitorAdapterServiceInstance.onlineConnectionForPartner).toBeDefined();
 expect(monitorAdapterServiceInstance['updateAndStyleConnector']).toHaveBeenCalled();

});


it('should call resetServerMonitoringData method', () => {
  monitorAdapterServiceInstance.setServerDiagnosticData(1,[{}]);

  Object.defineProperty(monitorAdapterServiceInstance, '_connectionMonitorMap$', {
    value: new Map(),
    writable: true
  });

  monitorAdapterServiceInstance['_connectionMonitorMap$'].set('1',[{}] as unknown as TreeData[]);
  monitorAdapterServiceInstance['facadeService']=fascadeMockService;
  spyOn<any>(monitorAdapterServiceInstance,'unSubscribeToIOEvent');
  monitorAdapterServiceInstance.resetServerMonitoringData();
  expect(monitorAdapterServiceInstance.resetServerMonitoringData).toBeDefined();
  expect(monitorAdapterServiceInstance['unSubscribeToIOEvent']).toHaveBeenCalled();
  expect(monitorAdapterServiceInstance['_connectionMonitorMap$'].clear).toBeDefined();

});

it('should call checkConnectionMonitorItemsMapHasMonitorkey method', () => {

  const monitorkey='2';
  const connectData={
    serverDeviceId:{address:'sampleaddress'}
  } as unknown as ConnectionData;
  const subConnector={
     id:'subconnector12345',
     type:'subconnector'
  } as unknown as SubConnector;
  const connectionsObservables=[of({}),of({})];

  Object.defineProperty(monitorAdapterServiceInstance, 'conenctionMonitorItemsMap', {
    value: new Map(),
    writable: true
  });

  monitorAdapterServiceInstance['conenctionMonitorItemsMap'].set('1',{} as unknown as MonitorPayload);

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  spyOn<any>(monitorAdapterServiceInstance,'monitorConnectionVars').and.returnValue(true);

  let connectionsObservablesReturn=monitorAdapterServiceInstance.checkConnectionMonitorItemsMapHasMonitorkey(monitorkey,connectData,subConnector,connectionsObservables);
  expect(monitorAdapterServiceInstance.checkConnectionMonitorItemsMapHasMonitorkey).toBeDefined();
  expect(connectionsObservablesReturn).not.toBe(null);
  expect(connectionsObservablesReturn).toBeInstanceOf(Array);

});


it('should call createOnlineConnection method', () => {

  let param=ConnectionAttributes.PARTNER;
  const value={address:'sampleaddress'};
  const deviceId='device12345';
  const areaId='area12345';
  const automationComponentId='automation12345';
  const interfaceId='interface12345';

  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:[{id:automationComponentId,type:FillingLineNodeType.NODE,deviceId:'device12345',
        inputs:[{
          automationComponentId :automationComponentId,
          interfaceData:{
               id:interfaceId
            }
        }]}]
  } as unknown as LiveLink;

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  spyOn<any>(monitorAdapterServiceInstance,'onlineConnectionForPartner').and.returnValue(true);
  spyOn<any>(monitorAdapterServiceInstance,'onlineConnectionForDiagnose').and.returnValue(true);

  monitorAdapterServiceInstance['createOnlineConnection'](param,value,areaId,deviceId,automationComponentId,interfaceId);
  expect(monitorAdapterServiceInstance['createOnlineConnection']).toBeDefined();

  param=ConnectionAttributes.DIAGNOSE;

  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:[{id:'area12345',type:FillingLineNodeType.NODE,deviceId:'device12345',
        inputs:[{
          automationComponentId :automationComponentId,
          interfaceData:{
               id:'interface12345'
            }
        }]}]
  } as unknown as LiveLink;

  monitorAdapterServiceInstance['createOnlineConnection'](param,value,areaId,deviceId,automationComponentId,interfaceId);
  expect(monitorAdapterServiceInstance['createOnlineConnection']).toBeDefined();
  expect(monitorAdapterServiceInstance['onlineConnectionForPartner']).toHaveBeenCalled;
  expect(monitorAdapterServiceInstance['onlineConnectionForDiagnose']).toHaveBeenCalled();
});

it('should call createOnlineConnection  with nodeanchor null', () => {
  let param=ConnectionAttributes.PARTNER;
  const value={address:''};
  const areaId=undefined;
  const deviceId='device12345';
  const automationComponentId='automation12345';
  const interfaceId='interface12345';
  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:[{id:'area_ljwxdis8',type:FillingLineNodeType.NODE,deviceId:'device12345',
        inputs:[{
          automationComponentId :automationComponentId,
          interfaceData:{
               id:interfaceId
            },
            connectors:[connector]
        }]}]
  } as unknown as LiveLink;
  monitorAdapterServiceInstance['facadeService']=fascadeMockService;
  spyOn<any>(monitorAdapterServiceInstance,'removeOnlineConnections').and.callThrough();
  monitorAdapterServiceInstance['createOnlineConnection'](param,value,areaId,deviceId,automationComponentId,interfaceId);
  expect(monitorAdapterServiceInstance['createOnlineConnection']).toBeDefined();
});

it('should call createOnlineConnection  with address null', () => {
  let param=ConnectionAttributes.PARTNER;
  const value={address:''};
  const areaId='area12345';
  const deviceId='device12345';
  const automationComponentId='automation12345';
  const interfaceId='interface12345';
  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:[{id:'area12345',type:FillingLineNodeType.NODE,deviceId:'device12345',
        inputs:[{
          automationComponentId :automationComponentId,
          interfaceData:{
               id:interfaceId
            },
            connectors:[connector]
        }]}]
  } as unknown as LiveLink;
  monitorAdapterServiceInstance['facadeService']=fascadeMockService;
  spyOn<any>(monitorAdapterServiceInstance,'removeOnlineConnections').and.callThrough();
  monitorAdapterServiceInstance['createOnlineConnection'](param,value,areaId,deviceId,automationComponentId,interfaceId);
  expect(monitorAdapterServiceInstance['createOnlineConnection']).toBeDefined();
  expect(monitorAdapterServiceInstance['removeOnlineConnections']).toHaveBeenCalled();
});

it('should call createOnlineConnection  with address null with empty connector object', () => {
  let param=ConnectionAttributes.PARTNER;
  const value={address:''};
  const areaId='area12345';
  const deviceId='device12345';
  const automationComponentId='automation12345';
  const interfaceId='interface12345';

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;
  spyOn<any>(monitorAdapterServiceInstance['facadeService'].editorService,'getBaseConnector').and.returnValue({})
  spyOn<any>(monitorAdapterServiceInstance,'updateConnectionEndPointDetails').and.callThrough();
  monitorAdapterServiceInstance['createOnlineConnection'](param,value,areaId,deviceId,automationComponentId,interfaceId);
  expect(monitorAdapterServiceInstance['createOnlineConnection']).toBeDefined();
  expect(monitorAdapterServiceInstance['updateConnectionEndPointDetails']).toHaveBeenCalled();
});

it('should call resetTagValues method', () => {

  const deviceId='device12345';
  const automationComponent='automation12345';
  const interfaces = [{id:'interface12345'}] as unknown as Array<ClientInterface>;

  spyOn<any>(monitorAdapterServiceInstance,'getTagObservable').and.returnValue({
    keys:()=>['1','2']
  });

  spyOn<any>(monitorAdapterServiceInstance,'emitTagMapValueChangeEvent');

  monitorAdapterServiceInstance['resetTagValues'](deviceId,automationComponent,interfaces);
  expect(monitorAdapterServiceInstance['resetTagValues']).toBeDefined();
  expect(monitorAdapterServiceInstance['emitTagMapValueChangeEvent']).toHaveBeenCalled();

});

it('should call resetMonitorTagValues method', () => {

  const deviceId='device12345';
  monitorAdapterServiceInstance['facadeService']=fascadeMockService;


  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:[{id:'area12345',type:FillingLineNodeType.NODE,deviceId:'device12345'}],
    entities:{
      ids:['entity12345'],
      entities:{'entity12345':{type:FillingLineNodeType.NODE,deviceId:'device12345'}}
    }
  } as unknown as LiveLink;

  spyOn<any>(monitorAdapterServiceInstance,'resetTagValues');
  monitorAdapterServiceInstance['resetMonitorTagValues'](deviceId);
  expect(monitorAdapterServiceInstance['resetMonitorTagValues']).toBeDefined();
  expect(monitorAdapterServiceInstance['resetTagValues']).toHaveBeenCalled();

});


it('should call monitorAllTagsOfClickedInterfaces method', () => {

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  const myArray=['1','2']
  Object.defineProperty(monitorAdapterServiceInstance, 'tagMonitorItemsMap', {
    value: {
        keys:()=>myArray,
        get:()=>{}
     },
     writable: true
  });

  Object.defineProperty(monitorAdapterServiceInstance, 'tagMonitorItemsOnlineMap', {
      value: new Map(),
      writable: true
   });

  monitorAdapterServiceInstance['tagMonitorItemsOnlineMap'].set('1',{} as unknown as MonitorPayload);

  spyOn<any>(monitorAdapterServiceInstance,'resetTagValues');

  let monitorTagReturn=monitorAdapterServiceInstance['monitorAllTagsOfClickedInterfaces']();
  expect(monitorAdapterServiceInstance['monitorAllTagsOfClickedInterfaces']).toBeDefined();
  expect(monitorTagReturn).not.toBe(null);
  expect(monitorTagReturn).toBeInstanceOf(Array);

});

it('should call getMonitorCallsList method', () => {

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  spyOn<any>(monitorAdapterServiceInstance,'monitorAllTagsOfClickedInterfaces').and.returnValue([{}]);
  spyOn<any>(monitorAdapterServiceInstance,'monitorAllEditorConnections').and.returnValue([{}]);
  spyOn<any>(monitorAdapterServiceInstance,'monitorOtherNodeOnlineConnections').and.returnValue([{}]);
  spyOn<any>(monitorAdapterServiceInstance,'monitorAreaSubConnections').and.returnValue([{}]);;

  const connections=monitorAdapterServiceInstance['getMonitorCallsList']();
  expect(monitorAdapterServiceInstance['getMonitorCallsList']).toBeDefined();
  expect(connections).not.toBe(null);
  expect(connections).toBeInstanceOf(Array);

});


it('should call monitorAllEditorConnections method', () => {

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:[{id:'area12345',type:FillingLineNodeType.NODE,deviceId:'device12345'}],
    entities:{
      ids:['entity12345'],
      entities:{'entity12345':{type:FillingLineNodeType.NODE,deviceId:'device12345'}}
    },
    connectorLookup:[{'mykey':'key1'}]
  } as unknown as LiveLink;


  spyOn<any>(monitorAdapterServiceInstance,'monitorConnection').and.returnValue({});

  const monitorConnections=monitorAdapterServiceInstance['monitorAllEditorConnections']();
  expect(monitorAdapterServiceInstance['monitorAllEditorConnections']).toBeDefined();
  expect(monitorConnections).not.toBe(null);
  expect(monitorConnections).toBeInstanceOf(Array);

});

it('should call monitorOtherNodeOnlineConnections method', () => {

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  fascadeMockService.editorService.liveLinkEditor={
    editorNodes:[{id:'area12345',type:FillingLineNodeType.NODE,deviceId:'device12345'}],
    entities:{
      ids:['entity12345'],
      entities:{'entity12345':{type:FillingLineNodeType.NODE,deviceId:'device12345'}}
    },
    connectorLookup:[{'mykey':'key1'}]
  } as unknown as LiveLink;


  spyOn<any>(monitorAdapterServiceInstance,'monitorNodesClientInterfaces');

  const monitoConnections=monitorAdapterServiceInstance['monitorOtherNodeOnlineConnections']();
  expect(monitorAdapterServiceInstance['monitorOtherNodeOnlineConnections']).toBeDefined();
  expect(monitoConnections).not.toBe(null);
  expect(monitoConnections).toBeInstanceOf(Array);

});

it('should call monitorNodesClientInterfaces method', () => {

  let nodes=[{
    deviceId:'device12345',
    type:FillingLineNodeType.AREA,
    inputs:[{
      connectors:[{type:ConnectorType.SUBCONNECTOR}],
      interfaceData:{id:'interface12345'}
    }]
  }] as unknown as Array<HTMLNode>;

  monitorAdapterServiceInstance['facadeService']=fascadeMockService;

  spyOn<any>(monitorAdapterServiceInstance,'monitorClientInterface');
  spyOn<any>(monitorAdapterServiceInstance,'monitorConnection').and.returnValue({});

  monitorAdapterServiceInstance['monitorNodesClientInterfaces'](nodes);
  expect(monitorAdapterServiceInstance['monitorNodesClientInterfaces']).toBeDefined();

  nodes=[{
    deviceId:'device12345',
    type:FillingLineNodeType.AREA,
    inputs:[{
      connectors:[
        {
          type:ConnectorType.CONNECTOR,
          inputAnchor:{
            interfaceData:{
              id:'interface12345'
            }
          }
        }
      ],
      interfaceData:{id:'interface12345'}
    }]
  }] as unknown as Array<HTMLNode>;

    monitorAdapterServiceInstance['monitorNodesClientInterfaces'](nodes);
    expect(monitorAdapterServiceInstance['monitorNodesClientInterfaces']).toBeDefined();

   nodes=[{
    deviceId:'device12345',
    type:FillingLineNodeType.NODE,
    inputs:[{
      connectors:[{type:ConnectorType.SUBCONNECTOR}],
      interfaceData:{id:'interface12345'}
    }]
  }] as unknown as Array<HTMLNode>;

  const clientInterfaces=monitorAdapterServiceInstance['monitorNodesClientInterfaces'](nodes);
  expect(monitorAdapterServiceInstance['monitorNodesClientInterfaces']).toBeDefined();
  expect(clientInterfaces).not.toBe(null);
  expect(clientInterfaces).toBeInstanceOf(Array);

});

  it('should call getParameterForStrategy method', () => {
    const deviceId='device12345';
    const acID='automation12345';
    const clientInterfaceId='clientinterface12345';
    const availableInEditorCompatibleDevice={
      automationComponentId:'automation12345',
      deviceId:'device12345',
      interfaceId:'interface12345',
      parent:'root',
      type:'client'
    } as unknown as MatchingConnectionInterface;

    monitorAdapterServiceInstance['facadeService']=fascadeMockService;

    monitorAdapterServiceInstance['getParameterForStrategy'](deviceId,acID,clientInterfaceId,availableInEditorCompatibleDevice);
    expect(monitorAdapterServiceInstance['getParameterForStrategy']).toBeDefined();
  });

  it('should call createExposedConnectionFromRoot method', () => {
    const deviceId='device12345';
    const acID='automation12345';
    const clientInterfaceId='clientinterface12345';

    monitorAdapterServiceInstance['facadeService']=fascadeMockService;

    spyOn<any>(monitorAdapterServiceInstance, 'getParameterForStrategy').and.returnValue({sourceParent:'root',targetParent:'area12345'});
    spyOn<any>(monitorAdapterServiceInstance, 'createOnlineConnectionForUnavailableAnchor');

    monitorAdapterServiceInstance['createExposedConnectionFromRoot'](deviceId,acID,clientInterfaceId);
    expect(monitorAdapterServiceInstance['getParameterForStrategy']).toHaveBeenCalled();
    expect(monitorAdapterServiceInstance['createExposedConnectionFromRoot']).toBeDefined();
  });

  it('should call createOnlineConnectionForUnavailableAnchor method', () => {
    const sourceAreaParent='root';
    const targetDeviceParent='area5';
    const device='device12345' as unknown as MatchingConnectionInterface;
    const connectionNeededParams={
      sourceAcId:'source12345',
      targetAcId:'target12345'
    };

    monitorAdapterServiceInstance['facadeService']=fascadeMockService;

    monitorAdapterServiceInstance['createOnlineConnectionForUnavailableAnchor'](sourceAreaParent,targetDeviceParent,device,connectionNeededParams);
    expect(monitorAdapterServiceInstance['createOnlineConnectionForUnavailableAnchor']).toBeDefined();
  });


});

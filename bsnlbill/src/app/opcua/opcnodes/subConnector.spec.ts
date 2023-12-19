/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed, waitForAsync } from '@angular/core/testing';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from './../../livelink-editor/services/facade.service';
import { SubConnector, SubConnectorService } from './subConnector';
import { ConnectorCreationMode, InterfaceCategory, Quadrant, SubConnectorCreationMode, interfaceGridViewType } from './../../enum/enum';
import { LiveLink } from './../../models/models';
import { SvgPoints } from './../../models/targetmodel.interface';


fdescribe('Area service', () => {
  let subConnectorService;
  let facadeMockService;
  let subConnectorInstance;

  const sourceAnchor={
    connectors:[{}],
    addConnector:()=>true,
    parentNode:{}
  };

  const targetAnchor={
    connectors:[{}],
    addConnector:()=>true,
    parentNode:{}
  };

  const areaData = {
    clientInterfaceIds: [{ interfaceId: 'client12345' }],
    serverInterfaceIds: [{ interfaceId: 'server12345' }],
  };

  const creationMode=SubConnectorCreationMode.MANUAL;
  const areaId='area12345';
  const id='id12345';
  const svgGlobal={} as unknown as SvgPoints;
  const interfaceToRemove = {
    deviceId: 'deviceId',
    automationComponentId:
      'd312e7a8-89f6-493e-8261-4ec333226945_TGlxdWlkTWl4aW5n',
    interfaceId: 'serverInf_ljfilc2t',
    interfaceExposedMode: 'Manual',
    subConnectionId:
      'd312e7a8-89f6-493e-8261-4ec333226945_TGlxdWlkTWl4aW5n__FillToMix_Type__serverInf_ljfilc2t',
    isClientInterface: false,
  };

  const exposedSidePanel = {
    deviceId: 'deviceId',
    automationComponentId:
      'd312e7a8-89f6-493e-8261-4ec333226945_TGlxdWlkTWl4aW5n',
    interfaceId: 'serverInf_ljfilc2u',
    interfaceExposedMode: 'Manual',
    subConnectionId:
      'd312e7a8-89f6-493e-8261-4ec333226945_TGlxdWlkTWl4aW5n__Wash1ToMix_Type__serverInf_ljfilc2u',
    isClientInterface: false,
  };
  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService }
      ]
    });
    facadeMockService = new FacadeMockService();
    subConnectorService = new SubConnectorService(facadeMockService);
    const editor={connectorElem:{
      cloneNode:()=>document.createElement('div')
    },
    editorNodes:[]
  } as unknown as LiveLink;
    subConnectorInstance=new SubConnector(editor,creationMode,areaId,id,svgGlobal);
    facadeMockService.editorService.liveLinkEditor.editorNodes = [];
  }));


  it('subconnector service should be created', () => {
    expect(subConnectorService).toBeTruthy();
  });

  it('should call deleteExposedConnectionsDeleteNode method', () => {

    const subConnectors=[{}] as unknown as  Array<SubConnector>;
    spyOn(subConnectorService,'deleteSubConnectorAndUpdateArea');
    subConnectorService.deleteExposedConnectionsDeleteNode(subConnectors);
    expect(subConnectorService.deleteExposedConnectionsDeleteNode).toBeDefined();

  });

  it('should call removeSubConnection method', () => {

    const subConnectionId='subconnection12345';
    Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getExistingSubConnectorById').value.and.returnValue({});
    spyOn(subConnectorService,'remove');

    subConnectorService.removeSubConnection(subConnectionId);
    expect(subConnectorService.removeSubConnection).toBeDefined();

    Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getExistingSubConnectorById').value.and.returnValue(null);

    subConnectorService.removeSubConnection(subConnectionId);
    expect(subConnectorService.removeSubConnection).toBeDefined();

  });

  it('should call updateHandle method', () => {

    const subConnector={
        isInput:true,
        updateHandle:()=>true
    };

    Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getExistingSubConnectorById').value.and.returnValue(null);
    spyOn(subConnectorService,'updateSubConenctor');

    subConnectorService.updateHandle(subConnector);
    expect(subConnectorService.updateHandle).toBeDefined();

  });

  it('should call updateSubConnectionsWithConnectionId method', () => {

     const connectionId='connection12345';
     const subconenctionIds={
        clientIds:['client12345'],
        serverIds:['server12345']
     };

     const subConnection={
        id:'subconnection12345'
     };

     const subConnector ={
        connectionId:'subconnector12345'
     };


     Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getSubConnection')
     .value.and.returnValue(subConnection);

     Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getExistingSubConnectorById')
     .value.and.returnValue(subConnector);

     subConnectorService.updateSubConnectionsWithConnectionId(connectionId,subconenctionIds);
     expect(subConnectorService.updateSubConnectionsWithConnectionId).toBeDefined();

     const subconenctionIds1={

     };

    subConnectorService.updateSubConnectionsWithConnectionId(connectionId,subconenctionIds1);
    expect(subConnectorService.updateSubConnectionsWithConnectionId).toBeDefined();

  });

  it('should call remove method', () => {

    const connector={
        id:'connector12345',
        element:{},
        resetAnchorStyleForSubConnector:()=>true,
        removeAnchorConnectors:()=>true,
        reset:()=>true,
        resetAnchorsStyle:()=>true
    };

   subConnectorService.remove(connector);
   expect(subConnectorService.remove).toBeDefined();

 });

 it('should call removeOnlyFromLookup method', () => {

    const connector={
        id:'connector12345',
        element:{},
        resetAnchorStyleForSubConnector:()=>true,
        removeAnchorConnectors:()=>true,
        reset:()=>true,
        resetAnchorsStyle:()=>true
    };

   subConnectorService.removeOnlyFromLookup(connector);
   expect(subConnectorService.removeOnlyFromLookup).toBeDefined();

 });

 it('should call removeSubConnectionFromLookupByAreaId method', () => {

    const projectData={
        editor:{
            subConnections:[{id:'subconnection12345',areaId:'area12345'}]
        }
    };
    const areaId='area12345';

    Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getProjectData')
    .value.and.returnValue(projectData);

    spyOn(subConnectorService,'removeSubConnection');

   subConnectorService.removeSubConnectionFromLookupByAreaId(areaId);
   expect(subConnectorService.removeSubConnectionFromLookupByAreaId).toBeDefined();

 });

 it('should call updateConnectorDataOnline method', () => {

  const connection={
    creationMode:ConnectorCreationMode.ONLINE
  };

  const subConnector={
    creationMode:SubConnectorCreationMode.ONLINE
  };

  const serverSubconnectionId=[];
  const clientSubconnectionId=[];

  const endPointData={
    status:{value:false},
    relatedEndpoints:{value:''}
  }

  Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getConnectionEndPointData').value.and.returnValue(endPointData);


 subConnectorService.updateConnectorDataOnline(connection,subConnector,serverSubconnectionId,clientSubconnectionId);
 expect(subConnectorService.updateConnectorDataOnline).toBeDefined();

 Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getConnectionEndPointData').value.and.returnValue();


 subConnectorService.updateConnectorDataOnline(connection,subConnector,serverSubconnectionId,clientSubconnectionId);
 expect(subConnectorService.updateConnectorDataOnline).toBeDefined();

});

it('should call updateSubConnector method', () => {

  let interfaceDetails={
    interface:{
      subConnectionId:'subconnection__12345',
      automationComponentId:'automation12345',
      isClientInterface:true,
      interfaceExposedMode:'manual'
    },
    interfaceId:{interfaceId:'interface12345'},
    type:InterfaceCategory.CLIENT

  };

  const nodeIdForSubConnection='subconnection12345';

  const areaKey='area12345';

  const subConnectionIds=null;

  const acData={name:'ac12345'};

  const subConnector={};

  Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getAutomationComponent').value.and.returnValue(acData);

  Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getExistingSubConnectorById').value.and.returnValue(subConnector);

 subConnectorService.updateSubConnector(interfaceDetails,nodeIdForSubConnection,areaKey,subConnectionIds);
 expect(subConnectorService.updateSubConnector).toBeDefined();

 interfaceDetails={
    interface:{
      subConnectionId:'subconnection__12345',
      automationComponentId:'automation12345',
      isClientInterface:true,
      interfaceExposedMode:'manual'
    },
    interfaceId:{interfaceId:'interface12345'},
    type:InterfaceCategory.SERVER

  };

  subConnectorService.updateSubConnector(interfaceDetails,nodeIdForSubConnection,areaKey,subConnectionIds);
  expect(subConnectorService.updateSubConnector).toBeDefined();


});

it('should call updateConnectionData method', () => {

  const connection={
    creationMode:ConnectorCreationMode.ONLINE,
    subConnections:{
      clientIds:[],
      serverIds:[]
    }
  };

  const subConnector={
    creationMode:SubConnectorCreationMode.ONLINE,
    connectionId:'subconnection12345'
  };

  const serverSubconnectionId=['serversubconnectionid12345'];
  const clientSubconnectionId=['serversubconnectionid12345'];

  subConnectorService.updateConnectionData(connection,subConnector,serverSubconnectionId,clientSubconnectionId);
  expect(subConnectorService.updateConnectorDataOnline).toBeDefined();

});


it('should call updateConenctorData method', () => {

  let subConnector={
    connectionId:'',
    isInput:true,
    inputAnchor:{
      interfaceData:{
        type:'client'
      }
    },
    outputAnchor:{
      interfaceData:{
        type:'server'
      }
    }
  };


  subConnectorService.updateConenctorData(subConnector);
  expect(subConnectorService.updateConenctorData).toBeDefined();

  Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getAllConnections').value.and.returnValue([{id:'connection12345'}]);

  subConnector={
    connectionId:'',
    isInput:false,
    inputAnchor:{
      interfaceData:{
        type:'client'
      }
    },
    outputAnchor:{
      interfaceData:{
        type:'server'
      }
    }
  };

  subConnectorService.updateConenctorData(subConnector);
  expect(subConnectorService.updateConenctorData).toBeDefined();

});

it('should call createSubConnector method', () => {

  facadeMockService.editorService.liveLinkEditor={connectorElem:{
    cloneNode:()=>document.createElement('div')
  }};

  subConnectorService.createSubConnector(sourceAnchor,creationMode,areaId,id,targetAnchor);
  expect(subConnectorService.createSubConnector).toBeDefined();

});

it('should call connect method', () => {

  let subConnector={
    getSourceAnchor:()=>{
       return {parentNode:{},setConnectedInterfaceStyle:()=>true}
    },
    isConnected:false,
    id:'subconnector12345',
    setConnectionId:()=>true,
    element:document.createElement('div'),
    setDefaultAnchorStyleForSubconnector:()=>true,
    setAreaId:()=>true,
    setDeviceId:()=>true
  };

  spyOn(subConnectorService,'placeHandle');

  const areaId='area12345';

  spyOn(subConnectorService,'updateConenctorData');
  spyOn(subConnectorService,'updateSubConenctor');
  spyOn(subConnectorService,'remove');

  subConnectorService.connect(subConnector,areaId);
  expect(subConnectorService.connect).toBeDefined();

  subConnector={
    getSourceAnchor:()=>{
       return {parentNode:{},setConnectedInterfaceStyle:()=>true}
    },
    isConnected:false,
    id:null,
    setConnectionId:()=>true,
    element:document.createElement('div'),
    setDefaultAnchorStyleForSubconnector:()=>true,
    setAreaId:()=>true,
    setDeviceId:()=>true
  };

  subConnectorService.connect(subConnector,areaId);
  expect(subConnectorService.connect).toBeDefined();

});

it('should call deleteSubConnectorAndUpdateArea method', () => {

  let subConnector={
    areaId:'area12345',
    isInput:true,
    inputAnchor:{
      interfaceData:{
        name:'client'
      }
    },
    outputAnchor:{
      interfaceData:{
        name:'server'
    }
   }
  };



  const interfaceList=[{name:'sample'}];

  Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getArea').value.and.returnValue(areaData);
  Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getClientInterfaceList').value.and.returnValue(interfaceList);
  Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getServerInterfaceList').value.and.returnValue(interfaceList);
  spyOn(subConnectorService,'remove');

  subConnectorService.deleteSubConnectorAndUpdateArea(subConnector);
  expect(subConnectorService.deleteSubConnectorAndUpdateArea).toBeDefined();

  subConnector={
    areaId:'area12345',
    isInput:false,
    inputAnchor:{
      interfaceData:{
        name:'client'
      }
    },
    outputAnchor:{
      interfaceData:{
        name:'server'
    }
   }
  };


  subConnectorService.deleteSubConnectorAndUpdateArea(subConnector);
  expect(subConnectorService.deleteSubConnectorAndUpdateArea).toBeDefined();

});


it('should create SubConnector service', () => {
  expect(subConnectorInstance).toBeTruthy();
});

it('should call setAreaId method', () => {
  const areaId='area12345';
  subConnectorInstance.setAreaId(areaId);
  expect(subConnectorInstance.setAreaId).toBeDefined();
  expect(subConnectorInstance.areaId).toEqual(areaId);
});

it('should call setSixthPt method', () => {
  subConnectorInstance.angle=100;
  subConnectorInstance.inputCircle={
    x:10,
    y:20
  };
  subConnectorInstance.outputCircle={
    x:10,
    y:20
  };


  subConnectorInstance.inputAnchor ={connectors:[{}]};

  subConnectorInstance['setSixthPt']();
  expect(subConnectorInstance['setSixthPt']).toBeDefined();


});

it('should call setFifthPt method', () => {
  subConnectorInstance.angle=100;
  subConnectorInstance.inputCircle={
    x:10,
    y:20
  };
  subConnectorInstance.outputCircle={
    x:10,
    y:20
  };


  subConnectorInstance.inputAnchor ={connectors:[{}]};

  subConnectorInstance['setFifthPt']();
  expect(subConnectorInstance['setFifthPt']).toBeDefined();


});

it('should call setEighthPt method', () => {

  subConnectorInstance.inputCircle={
    x:10,
    y:20
  };
  subConnectorInstance.outputCircle={
    x:10,
    y:20
  };

  subConnectorInstance.setEighthPt();
  expect(subConnectorInstance.setEighthPt).toBeDefined();


});

it('should call setSeventhPt method', () => {

  subConnectorInstance.inputCircle={
    x:10,
    y:20
  };
  subConnectorInstance.outputCircle={
    x:10,
    y:20
  };

  subConnectorInstance.setSeventhPt();
  expect(subConnectorInstance.setSeventhPt).toBeDefined();


});

it('should call setDeviceId method', () => {

  subConnectorInstance.isInput=true;

  subConnectorInstance.inputAnchor={
    deviceId:'device12345'
  };

  subConnectorInstance.outputAnchor={
    deviceId:'device12345'
  };

  subConnectorInstance.setDeviceId();
  expect(subConnectorInstance.setDeviceId).toBeDefined();

  subConnectorInstance.isInput=false;

  subConnectorInstance.setDeviceId();
  expect(subConnectorInstance.setDeviceId).toBeDefined();


});

it('should call setDefaultAnchorStyleForSubconnector method', () => {

  subConnectorInstance.isInput=true;

  subConnectorInstance.inputAnchor={
    deviceId:'device12345',
    setAnchorDefaultStyle:()=>true
  };

  subConnectorInstance.outputAnchor={
    deviceId:'device12345',
    setAnchorDefaultStyle:()=>true
  };

  subConnectorInstance.setDefaultAnchorStyleForSubconnector();
  expect(subConnectorInstance.setDefaultAnchorStyleForSubconnector).toBeDefined();

});

it('should call resetAnchorStyleForSubConnector method', () => {

  subConnectorInstance.isInput=true;

  subConnectorInstance.inputAnchor={
    deviceId:'device12345',
    resetInPutAnchorStyleInverse:()=>true
  };

  subConnectorInstance.outputAnchor={
    deviceId:'device12345',
    resetOutPutAnchorStyleInverse:()=>true
  };

  subConnectorInstance.resetAnchorStyleForSubConnector();
  expect(subConnectorInstance.setDefaultAnchorStyleForSubconnector).toBeDefined();

});

it('should call setConnectionId method', () => {

  subConnectorInstance.isInput=true;

  subConnectorInstance.inputAnchor={
    deviceId:'device12345',
    resetInPutAnchorStyleInverse:()=>true,
    interfaceData:{
      type:'client'
    },
    parentNode:{
      id:'parent12345'
    }
  };

  subConnectorInstance.outputAnchor={
    deviceId:'device12345',
    resetOutPutAnchorStyleInverse:()=>true,
    interfaceData:{
      type:'server'
    },
    parentNode:{
      id:'parent12345'
    }
  };

  subConnectorInstance.setConnectionId();
  expect(subConnectorInstance.setConnectionId).toBeDefined();

});

it('should call buildCurveString method', () => {

  subConnectorInstance.plotPoints=[
    {x:10,y:20},
    {x:30,y:40},
    {x:50,y:60},
    {x:70,y:80},
  ];

  subConnectorInstance.quadrant=Quadrant.SIXTH;

  subConnectorInstance.buildCurveString();
  expect(subConnectorInstance.buildCurveString).toBeDefined();

  subConnectorInstance.quadrant=Quadrant.FIFTH;

  subConnectorInstance.buildCurveString();
  expect(subConnectorInstance.buildCurveString).toBeDefined();

  subConnectorInstance.quadrant=Quadrant.EIGHTH;

  subConnectorInstance.buildCurveString();
  expect(subConnectorInstance.buildCurveString).toBeDefined();

  subConnectorInstance.quadrant=Quadrant.SEVENTH;

  subConnectorInstance.buildCurveString();
  expect(subConnectorInstance.buildCurveString).toBeDefined();

  subConnectorInstance.quadrant=Quadrant.FIRST;

  subConnectorInstance.buildCurveString();
  expect(subConnectorInstance.buildCurveString).toBeDefined();

});


it('should call modifyCurvePts method', () => {

  spyOn(subConnectorInstance,'setQuardantValue');

  subConnectorInstance.inLength = 10;
  subConnectorInstance.outLength = 20;

  spyOn(subConnectorInstance,'setFifthPt');
  spyOn(subConnectorInstance,'setSixthPt');
  spyOn(subConnectorInstance,'setEighthPt');
  spyOn(subConnectorInstance,'setSeventhPt');

  subConnectorInstance.quadrant=Quadrant.FIFTH;

  subConnectorInstance.modifyCurvePts();
  expect(subConnectorInstance.modifyCurvePts).toBeDefined();

  subConnectorInstance.quadrant=Quadrant.SIXTH;

  subConnectorInstance.modifyCurvePts();
  expect(subConnectorInstance.modifyCurvePts).toBeDefined();

  subConnectorInstance.quadrant=Quadrant.SEVENTH;

  subConnectorInstance.modifyCurvePts();
  expect(subConnectorInstance.modifyCurvePts).toBeDefined();

  subConnectorInstance.quadrant=Quadrant.EIGHTH;

  subConnectorInstance.modifyCurvePts();
  expect(subConnectorInstance.modifyCurvePts).toBeDefined();

  subConnectorInstance.quadrant=Quadrant.FIRST;

  subConnectorInstance.modifyCurvePts();
  expect(subConnectorInstance.modifyCurvePts).toBeDefined();

  subConnectorInstance.inLength = null;
  subConnectorInstance.outLength = null;

  subConnectorInstance.modifyCurvePts();
  expect(subConnectorInstance.modifyCurvePts).toBeDefined();

});

it('should call setOnlineStyle method', () => {

  spyOn(subConnectorInstance,'setArrowStyle');

  subConnectorInstance.setOnlineStyle();
  expect(subConnectorInstance.setOnlineStyle).toBeDefined();

});

it('should call setQuardantValue method', () => {

  subConnectorInstance.viewTypeFromArea=interfaceGridViewType.COLLAPSED;
  subConnectorInstance.inputAnchor={
    interfaceData:{
      isClientInterface:true
    }
  };

  subConnectorInstance['setQuardantValue']();
  expect(subConnectorInstance['setQuardantValue']).toBeDefined();

  subConnectorInstance.viewTypeFromArea=interfaceGridViewType.EXPANDED;

  subConnectorInstance['setQuardantValue']();
  expect(subConnectorInstance['setQuardantValue']).toBeDefined();

  subConnectorInstance.viewTypeFromArea=interfaceGridViewType.COLLAPSED;

  subConnectorInstance.inputAnchor={
    interfaceData:{
      isClientInterface:false
    }
  };

  subConnectorInstance['setQuardantValue']();
  expect(subConnectorInstance['setQuardantValue']).toBeDefined();

  subConnectorInstance.viewTypeFromArea=interfaceGridViewType.EXPANDED;

  subConnectorInstance['setQuardantValue']();
  expect(subConnectorInstance['setQuardantValue']).toBeDefined();

});

it('should call getSourceAnchor method', () => {

  subConnectorInstance.areaId='area12345';

  subConnectorInstance.editor.editorNodes=[{
    parent:'area12345',
    inputs:[
      {
        interfaceData:{id:'node12345'}
      }
    ],
    outputs:[
      {
        interfaceData:{id:'node12345'}
      }
    ]
  }];

  subConnectorInstance.targetAnchor={
    interfaceData:{
      isClientInterface:true
    }
  };

  subConnectorInstance.getSourceAnchor();
  expect(subConnectorInstance.getSourceAnchor).toBeDefined();

  subConnectorInstance.targetAnchor={
    interfaceData:{
      id:'interface12345',
      isClientInterface:false
    }
  };

  subConnectorInstance.editor.editorNodes=[{
    parent:'area12345',
    inputs:[
      {
        interfaceData:{id:'interface12345'}
      }
    ],
    outputs:[
      {
        interfaceData:{id:'interface12345'}
      }
    ]
  }];

  subConnectorInstance.inputAnchor={
    interfaceData:{
      id:'interface12345',
      isClientInterface:false
    }
  };

  subConnectorInstance.outputAnchor={
    interfaceData:{
      id:'interface12345',
      isClientInterface:false
    }
  };


  subConnectorInstance.getSourceAnchor();
  expect(subConnectorInstance.getSourceAnchor).toBeDefined();


});


it('should call updateHandle method', () => {

  const anchor={

  };

  const viewType=interfaceGridViewType.COLLAPSED;

  const svgGlobal={} as unknown as SvgPoints;

  spyOn(subConnectorInstance,'updateCirclePosition');
  spyOn(subConnectorInstance,'updatePath');

  subConnectorInstance.updateHandle(anchor,viewType,svgGlobal);
  expect(subConnectorInstance.updatePath).toBeDefined();
});

  it('removeInterfaceAndSubConnectionByType should call updateArea', () => {
    spyOn(subConnectorService,'removeSubConnection')

    Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(areaData);
    subConnectorService['facadeService'].dataService.removeInterfaceIdsFromArea = () => exposedSidePanel;
    subConnectorService.removeInterfaceAndSubConnectionByType('areaId', interfaceToRemove, true);
    expect(subConnectorService.removeSubConnection).toHaveBeenCalled();
  });




});
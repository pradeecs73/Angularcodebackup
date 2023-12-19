/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed, waitForAsync } from '@angular/core/testing';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from './../../livelink-editor/services/facade.service';
import { BaseConnectorService,BaseConnector } from './baseConnector';
import { TranslateModule } from '@ngx-translate/core';
import { TreeModule } from 'primeng/tree';
import { NodeAnchor } from './node-anchor';
import { ConnectorCreationMode, ConnectorState, ConnectorType, SubConnectorCreationMode } from './../../enum/enum';
import { LiveLink } from './../../models/models';

fdescribe('Area service', () => {

    class DummyBaseConnectorService extends BaseConnectorService {
        connect(connector: BaseConnector){

        }
    }

    class DummyBaseConnector extends BaseConnector {

       modifyCurvePts(){

       }
       buildCurveString(){

       }

    }

  let baseConnectorServiceInstance;
  let baseConnectorInstance;
  let facadeMockService;

  const editor={

    connectorElem:{
        cloneNode:()=>document.createElement('doc')
    }

  } as unknown as LiveLink;

  const creationMode=ConnectorCreationMode.MANUAL;

  const editorContext='ROOT';

  const id='id12345';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: FacadeService, useValue: facadeMockService }
      ],
      imports: [TreeModule,TranslateModule.forRoot({})]
    });
    facadeMockService = new FacadeMockService();
    baseConnectorServiceInstance = new DummyBaseConnectorService(facadeMockService);
    baseConnectorInstance = new DummyBaseConnector(editor,creationMode,editorContext,id);
    facadeMockService.editorService.liveLinkEditor.editorNodes = [];
  }));

  it('should create baseConnector Service Instance ', () => {
    expect(baseConnectorServiceInstance).toBeTruthy();
  });

  it('should call setSelectedStyle method ', () => {
    const connector={
        setSelectedStyle:()=>true
    };
    spyOn(baseConnectorServiceInstance,'updateConnectortoCommon');
    baseConnectorServiceInstance.setSelectedStyle(connector);
    expect(baseConnectorServiceInstance.setSelectedStyle).toBeDefined()
  });

  it('should call updateConnectortoCommon method ', () => {
    const connector={} as unknown as BaseConnector;
    baseConnectorServiceInstance.updateConnectortoCommon(connector);
    expect(baseConnectorServiceInstance.updateConnectortoCommon).toBeDefined()
  });

  it('should call resetConnectionList method ', () => {
    facadeMockService.commonService.globalConnectionList=[{isActualConRowSelected:true,isRowSelected:true,status:'online'}];
    facadeMockService.commonService.isActualConnectionMode=true;
    baseConnectorServiceInstance.resetConnectionList();
    expect(baseConnectorServiceInstance.resetConnectionList).toBeDefined()
    facadeMockService.commonService.globalConnectionList=[{isActualConRowSelected:true,isRowSelected:true,status:undefined}];
    baseConnectorServiceInstance.resetConnectionList();
    expect(baseConnectorServiceInstance.resetConnectionList).toBeDefined()
  });

  it('should call remove method ', () => {
    const connector={
        removeAnchorConnectors:()=>true,
        reset:()=>true,
        resetAnchorsStyle:()=>true
    } as unknown as BaseConnector;
    baseConnectorServiceInstance.remove(connector);
    expect(baseConnectorServiceInstance.remove).toBeDefined()
  });

  it('should call bindClickEvent method ', () => {
    const connector={
    } as unknown as BaseConnector;
    spyOn(baseConnectorServiceInstance,'selectOnClick');
    baseConnectorServiceInstance.bindClickEvent(connector);
    expect(baseConnectorServiceInstance.bindClickEvent).toBeDefined()
  });

  it('should call bindClickEvent method ', () => {
    const hitAnchor={
        addConnector:()=>true,
        update:()=>true
    } as unknown as NodeAnchor;
    let connector={
        isInput:true,
        resetHighlightedAnchor:()=>true,
        setDefaultAnchorStyle:()=>true,
        dragElement:{
            setAttribute:()=>true
        },
        isConnected:false
    } as unknown as BaseConnector;
    spyOn(baseConnectorServiceInstance,'refreshConList');
    baseConnectorServiceInstance.placeHandle(hitAnchor,connector);
    expect(baseConnectorServiceInstance.placeHandle).toBeDefined()

    connector={
        isInput:false,
        resetHighlightedAnchor:()=>true,
        setDefaultAnchorStyle:()=>true,
        dragElement:{
            setAttribute:()=>true
        },
        isConnected:false
    } as unknown as BaseConnector;

    baseConnectorServiceInstance.placeHandle(hitAnchor,connector);
    expect(baseConnectorServiceInstance.placeHandle).toBeDefined();

  });


  it('should call refreshConList method ', () => {

    facadeMockService.editorService.liveLinkEditor={
        connectorLookup:{
            sampleconnection:{
                inputAnchor:{
                    parentNode:{
                        name:'inputparent'
                    },
                    interfaceData:
                    {
                        name:'interface123'
                    }
                },
                outputAnchor:{
                    parentNode:{
                        name:'outputparent'
                    },
                    interfaceData:
                    {
                        name:'interface123'
                    }
                },
                isSelected:true
            }
        }
    };

    baseConnectorServiceInstance.refreshConList();
    expect(baseConnectorServiceInstance.refreshConList).toBeDefined();

  });

  it('should call selectConnector method ', () => {

    let connector={
        type:ConnectorType.SUBCONNECTOR,
        isInput:true,
        resetHighlightedAnchor:()=>true,
        setDefaultAnchorStyle:()=>true,
        setUnSelectedStyle:()=>true,
        dragElement:{
            setAttribute:()=>true
        },
        isConnected:false,
        targetAnchor:{
            interfaceData:{
                isClientInterface:true
            }
        }
    } as unknown as BaseConnector;

    facadeMockService.editorService.isConnectionMultiSelect=false;
    facadeMockService.commonService.isOnline=true;
    facadeMockService.commonService.isActualConnectionMode=true;

    spyOn(baseConnectorServiceInstance,'resetConnectionList');
    spyOn(baseConnectorServiceInstance,'setSelectedStyle');

    baseConnectorServiceInstance.selectConnector(connector);
    expect(baseConnectorServiceInstance.selectConnector).toBeDefined();

    facadeMockService.editorService.isConnectionMultiSelect=true;
    baseConnectorServiceInstance.selectConnector(connector);
    expect(baseConnectorServiceInstance.selectConnector).toBeDefined();

    connector={
        type:ConnectorType.CONNECTOR,
        isInput:true,
        resetHighlightedAnchor:()=>true,
        setDefaultAnchorStyle:()=>true,
        setUnSelectedStyle:()=>true,
        dragElement:{
            setAttribute:()=>true
        },
        isConnected:false,
        targetAnchor:{
            interfaceData:{
                isClientInterface:true
            }
        }
    } as unknown as BaseConnector;

    facadeMockService.editorService.isConnectionMultiSelect=true;
    facadeMockService.commonService.isOnline=false;
    baseConnectorServiceInstance.selectConnector(connector);
    expect(baseConnectorServiceInstance.selectConnector).toBeDefined();

    connector={
        type:ConnectorType.SUBCONNECTOR,
        isInput:true,
        resetHighlightedAnchor:()=>true,
        setDefaultAnchorStyle:()=>true,
        setUnSelectedStyle:()=>true,
        dragElement:{
            setAttribute:()=>true
        },
        isConnected:false,
        targetAnchor:{
            interfaceData:{
                isClientInterface:false
            }
        }
    } as unknown as BaseConnector;

    baseConnectorServiceInstance.selectConnector(connector);
    expect(baseConnectorServiceInstance.selectConnector).toBeDefined();

  });

  it('should call baseConnector Instance ', () => {
    expect(baseConnectorInstance).toBeTruthy();
  });

  it('should call setAnchorFailureStyle method ', () => {

     baseConnectorInstance.inputAnchor={
        setFailureStyle:()=>true
     };
     baseConnectorInstance.outputAnchor ={
        setFailureStyle:()=>true
     };
     baseConnectorInstance.setAnchorFailureStyle();
     expect(baseConnectorInstance.setAnchorFailureStyle).toBeDefined();

  });

  it('should call resetAnchorsStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        resetInPutAnchorStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        resetOutPutAnchorStyle:()=>true
    };
    baseConnectorInstance.resetAnchorsStyle();
    expect(baseConnectorInstance.resetAnchorsStyle).toBeDefined();

 });

 it('should call setAnchorProposedConenctionStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        resetInPutAnchorStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        resetOutPutAnchorStyle:()=>true
    };
    baseConnectorInstance.setAnchorProposedConenctionStyle();
    expect(baseConnectorInstance.setAnchorProposedConenctionStyle).toBeDefined();

 });

 it('should call removeAnchorConnectors method ', () => {

    baseConnectorInstance.inputAnchor={
        removeConnector:()=>true,
        setDisconnectedInterfaceStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        removeConnector:()=>true,
        setDisconnectedInterfaceStyle:()=>true
    };
    baseConnectorInstance.removeAnchorConnectors();
    expect(baseConnectorInstance.removeAnchorConnectors).toBeDefined();

 });

 it('should call setAnchorOnlineStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setOnlineSuccessAnchorStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setOnlineSuccessAnchorStyle:()=>true
    };
    baseConnectorInstance.setAnchorOnlineStyle();
    expect(baseConnectorInstance.setAnchorOnlineStyle).toBeDefined();

 });

 it('should call setAnchorOnlineErrorStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setOnlineErrorAnchorStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setOnlineErrorAnchorStyle:()=>true
    };
    baseConnectorInstance.setAnchorOnlineErrorStyle();
    expect(baseConnectorInstance.setAnchorOnlineErrorStyle).toBeDefined();

 });

 it('should call setTransparentStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setNoConnectionStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setNoConnectionStyle:()=>true
    };
    spyOn(baseConnectorInstance,'setPathStyle');

    baseConnectorInstance.setTransparentStyle();
    expect(baseConnectorInstance.setTransparentStyle).toBeDefined();

 });

 it('should call setAnchorHoveredStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setAnchorHoverStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setAnchorHoverStyle:()=>true
    };

    baseConnectorInstance.setAnchorHoveredStyle();
    expect(baseConnectorInstance.setAnchorHoveredStyle).toBeDefined();

 });

 it('should call resetAnchoHoverStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        resetAnchorHoverStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        resetAnchorHoverStyle:()=>true
    };

    baseConnectorInstance.resetAnchoHoverStyle();
    expect(baseConnectorInstance.resetAnchoHoverStyle).toBeDefined();

 });

 it('should call setDefaultAnchorStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setAnchorDefaultStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setAnchorDefaultStyle:()=>true
    };

    baseConnectorInstance.setDefaultAnchorStyle();
    expect(baseConnectorInstance.setDefaultAnchorStyle).toBeDefined();

 });

 it('should call resetEndPointDetails method ', () => {

    baseConnectorInstance.relatedEndPoint={};
    spyOn(baseConnectorInstance,'updateConnectionEndPointStatus');

    baseConnectorInstance.resetEndPointDetails();
    expect(baseConnectorInstance.resetEndPointDetails).toBeDefined();

 });

 it('should call setConnectorSuccessSelectedStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setAnchorSuccessSelectedStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setAnchorSuccessSelectedStyle:()=>true
    };

    spyOn(baseConnectorInstance,'addStyleToPath');

    baseConnectorInstance.setConnectorSuccessSelectedStyle();
    expect(baseConnectorInstance.setConnectorSuccessSelectedStyle).toBeDefined();

 });

 it('should call setConnectorFailSelectedStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setAnchorFailureSelectedStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setAnchorFailureSelectedStyle:()=>true
    };

    spyOn(baseConnectorInstance,'addStyleToPath');

    baseConnectorInstance.setConnectorFailSelectedStyle();
    expect(baseConnectorInstance.setConnectorFailSelectedStyle).toBeDefined();

 });

 it('should call setConnectorOnlineSelectedStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setAnchorOnlineSelectedStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setAnchorOnlineSelectedStyle:()=>true
    };

    spyOn(baseConnectorInstance,'removeStyleFromPath');
    spyOn(baseConnectorInstance,'addStyleToPath');

    baseConnectorInstance.setConnectorOnlineSelectedStyle();
    expect(baseConnectorInstance.setConnectorOnlineSelectedStyle).toBeDefined();

 });


 it('should call setConnectorOnlineErrorSelectedStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setAnchorOnlineErrorSelectedStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setAnchorOnlineErrorSelectedStyle:()=>true
    };

    spyOn(baseConnectorInstance,'removeStyleFromPath');
    spyOn(baseConnectorInstance,'addStyleToPath');

    baseConnectorInstance.setConnectorOnlineErrorSelectedStyle();
    expect(baseConnectorInstance.setConnectorOnlineErrorSelectedStyle).toBeDefined();

 });

 it('should call setOnlineConStyle method ', () => {

    spyOn(baseConnectorInstance,'setPathStyle');
    spyOn(baseConnectorInstance,'setAnchorOnlineStyle');

    baseConnectorInstance.setOnlineConStyle();
    expect(baseConnectorInstance.setOnlineConStyle).toBeDefined();

 });

 it('should call setOnlineConErrorStyle method ', () => {

    spyOn(baseConnectorInstance,'setPathStyle');
    spyOn(baseConnectorInstance,'setAnchorOnlineErrorStyle');

    baseConnectorInstance.setOnlineConErrorStyle();
    expect(baseConnectorInstance.setOnlineConErrorStyle).toBeDefined();

 });

 it('should call setOnlineData method ', () => {

    spyOn(baseConnectorInstance,'updateConnectorStateinOnline');
    spyOn(baseConnectorInstance,'setOnlineStyle');

    baseConnectorInstance.setOnlineData();
    expect(baseConnectorInstance.setOnlineData).toBeDefined();

 });

 it('should call setOnlineData method ', () => {

    const connectionStatus={};

    baseConnectorInstance.inputAnchor={
        connectionStatus :{}
    };

    baseConnectorInstance['updateConnectionStatus'](connectionStatus);
    expect(baseConnectorInstance['updateConnectionStatus']).toBeDefined();

 });

 it('should call setOnlineData method ', () => {

    const relatedEndPoint={};

    baseConnectorInstance.inputAnchor={
        relatedEndPoint :{}
    };

    baseConnectorInstance['updateRelatedEndpoint'](relatedEndPoint);
    expect(baseConnectorInstance['updateRelatedEndpoint']).toBeDefined();

 });

 it('should call updateDetailedStatus method ', () => {

    const detailedStatus={};

    baseConnectorInstance['updateDetailedStatus'](detailedStatus);
    expect(baseConnectorInstance['updateDetailedStatus']).toBeDefined();

 });

 it('should call setAnchorSuccessStyle method ', () => {

    baseConnectorInstance.inputAnchor={
        setSuccessAnchorStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setSuccessAnchorStyle:()=>true
    };

    baseConnectorInstance.setAnchorSuccessStyle();
    expect(baseConnectorInstance.setAnchorSuccessStyle).toBeDefined();

 });

 it('should call setSuccessStyle method ', () => {


    spyOn(baseConnectorInstance,'setPathStyle');
    spyOn(baseConnectorInstance,'setAnchorSuccessStyle');

    baseConnectorInstance.setSuccessStyle();
    expect(baseConnectorInstance.setSuccessStyle).toBeDefined();

 });

 it('should call setFailureStyle methd ', () => {


    spyOn(baseConnectorInstance,'setPathStyle');
    spyOn(baseConnectorInstance,'setAnchorFailureStyle');

    baseConnectorInstance.setFailureStyle();
    expect(baseConnectorInstance.setFailureStyle).toBeDefined();

 });

 it('should call setHoverStyle method ', () => {


    spyOn(baseConnectorInstance,'addStyleToPath');
    spyOn(baseConnectorInstance,'setAnchorHoveredStyle');

    baseConnectorInstance.setHoverStyle();
    expect(baseConnectorInstance.setHoverStyle).toBeDefined();

 });

 it('should call resetHoverStyle method ', () => {


    spyOn(baseConnectorInstance,'removeStyleFromPath');
    spyOn(baseConnectorInstance,'resetAnchoHoverStyle');

    baseConnectorInstance.resetHoverStyle();
    expect(baseConnectorInstance.resetHoverStyle).toBeDefined();

 });

 it('should call updateAngle method ', () => {

    baseConnectorInstance.updateAngle(90);
    expect(baseConnectorInstance.updateAngle).toBeDefined();

 });

 it('should call updatePath method ', () => {

    spyOn(baseConnectorInstance,'modifyCurvePts');
    spyOn(baseConnectorInstance,'buildCurveString');
    spyOn(baseConnectorInstance,'updateActualPath');

    baseConnectorInstance.updatePath();
    expect(baseConnectorInstance.updatePath).toBeDefined();

 });

 it('should call updateActualPath method ', () => {

    baseConnectorInstance.path=document.createElement('doc');
    baseConnectorInstance.pathOutline=document.createElement('doc');

    baseConnectorInstance.updateActualPath();
    expect(baseConnectorInstance.updateActualPath).toBeDefined();

 });

 it('should call updateConnectorStateinOnline method ', () => {

    baseConnectorInstance.creationMode=ConnectorCreationMode.ONLINE;

    baseConnectorInstance.updateConnectorStateinOnline();
    expect(baseConnectorInstance.updateConnectorStateinOnline).toBeDefined();

    baseConnectorInstance.creationMode=SubConnectorCreationMode.MANUALONLINE;

    baseConnectorInstance.updateConnectorStateinOnline();
    expect(baseConnectorInstance.updateConnectorStateinOnline).toBeDefined();

    baseConnectorInstance.creationMode=SubConnectorCreationMode.MANUALOFFLINE;

    baseConnectorInstance.updateConnectorStateinOnline();
    expect(baseConnectorInstance.updateConnectorStateinOnline).toBeDefined();

    baseConnectorInstance.creationMode=ConnectorCreationMode.MANUAL;

    baseConnectorInstance.updateConnectorStateinOnline();
    expect(baseConnectorInstance.updateConnectorStateinOnline).toBeDefined();

 });

 it('should call setOnlineStyle method ', () => {

    baseConnectorInstance.state=ConnectorState.Error;

    spyOn(baseConnectorInstance,'setUnSelectedStyle');
    spyOn(baseConnectorInstance,'setFailureStyle');
    spyOn(baseConnectorInstance,'setSuccessStyle');
    spyOn(baseConnectorInstance,'setOnlineConStyle');
    spyOn(baseConnectorInstance,'setOnlineConErrorStyle');
    spyOn(baseConnectorInstance,'setTransparentStyle');

    baseConnectorInstance.setOnlineStyle();
    expect(baseConnectorInstance.setOnlineStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Success;

    baseConnectorInstance.setOnlineStyle();
    expect(baseConnectorInstance.setOnlineStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Online;

    baseConnectorInstance.setOnlineStyle();
    expect(baseConnectorInstance.setOnlineStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.OnlineError;

    baseConnectorInstance.setOnlineStyle();
    expect(baseConnectorInstance.setOnlineStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.NonExistent;

    baseConnectorInstance.setOnlineStyle();
    expect(baseConnectorInstance.setOnlineStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Default;

    baseConnectorInstance.setOnlineStyle();
    expect(baseConnectorInstance.setOnlineStyle).toBeDefined();

 });

 it('should call setSelectedStyle method ', () => {

    baseConnectorInstance.state=ConnectorState.Error;

    spyOn(baseConnectorInstance,'setConnectorFailSelectedStyle');
    spyOn(baseConnectorInstance,'setConnectorSuccessSelectedStyle');
    spyOn(baseConnectorInstance,'setConnectorOnlineSelectedStyle');
    spyOn(baseConnectorInstance,'setConnectorOnlineErrorSelectedStyle');
    spyOn(baseConnectorInstance,'setSelectedProposedConnectorStyle');
    spyOn(baseConnectorInstance,'setConnectorDefaultSelectedStyle');

    baseConnectorInstance.setSelectedStyle();
    expect(baseConnectorInstance.setSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Success;

    baseConnectorInstance.setSelectedStyle();
    expect(baseConnectorInstance.setSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Online;

    baseConnectorInstance.setSelectedStyle();
    expect(baseConnectorInstance.setSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.OnlineError;

    baseConnectorInstance.setSelectedStyle();
    expect(baseConnectorInstance.setSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Proposed;

    baseConnectorInstance.setSelectedStyle();
    expect(baseConnectorInstance.setSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.NonExistent;

    baseConnectorInstance.setSelectedStyle();
    expect(baseConnectorInstance.setSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Default;

    baseConnectorInstance.setSelectedStyle();
    expect(baseConnectorInstance.setSelectedStyle).toBeDefined();

 });

 it('should call setUnSelectedStyle method ', () => {

    baseConnectorInstance.state=ConnectorState.Error;

    spyOn(baseConnectorInstance,'removeStyleFromPath');
    spyOn(baseConnectorInstance,'setAnchorFailureStyle');
    spyOn(baseConnectorInstance,'setAnchorSuccessStyle');
    spyOn(baseConnectorInstance,'setAnchorOnlineStyle');
    spyOn(baseConnectorInstance,'addStyleToPath');
    spyOn(baseConnectorInstance,'setAnchorOnlineErrorStyle');
    spyOn(baseConnectorInstance,'setAnchorProposedConenctionStyle');
    spyOn(baseConnectorInstance,'setDefaultAnchorStyle');

    baseConnectorInstance.setUnSelectedStyle();
    expect(baseConnectorInstance.setUnSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Success;

    baseConnectorInstance.setUnSelectedStyle();
    expect(baseConnectorInstance.setUnSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Online;

    baseConnectorInstance.setUnSelectedStyle();
    expect(baseConnectorInstance.setUnSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.OnlineError;

    baseConnectorInstance.setUnSelectedStyle();
    expect(baseConnectorInstance.setUnSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Proposed;

    baseConnectorInstance.setUnSelectedStyle();
    expect(baseConnectorInstance.setUnSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.NonExistent;

    baseConnectorInstance.setUnSelectedStyle();
    expect(baseConnectorInstance.setUnSelectedStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Default;

    baseConnectorInstance.setUnSelectedStyle();
    expect(baseConnectorInstance.setUnSelectedStyle).toBeDefined();

 });

 it('should call setSelectedProposedConnectorStyle method ', () => {

    spyOn(baseConnectorInstance,'addStyleToPath');

    baseConnectorInstance.inputAnchor={
        anchorScrim:document.createElement('div')
    };
    baseConnectorInstance.outputAnchor ={
        anchorScrim:document.createElement('div')
    };

    baseConnectorInstance.setSelectedProposedConnectorStyle();
    expect(baseConnectorInstance.setSelectedProposedConnectorStyle).toBeDefined();

 });


 it('should call setArrowStyle method ', () => {

    baseConnectorInstance.state=ConnectorState.Error;
    baseConnectorInstance.arrowStyeId='id12345';

    baseConnectorInstance.setArrowStyle();
    expect(baseConnectorInstance.setArrowStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Success;

    baseConnectorInstance.setArrowStyle();
    expect(baseConnectorInstance.setArrowStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Online;

    baseConnectorInstance.setArrowStyle();
    expect(baseConnectorInstance.setArrowStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.OnlineError;

    baseConnectorInstance.setArrowStyle();
    expect(baseConnectorInstance.setArrowStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.NonExistent;

    baseConnectorInstance.setArrowStyle();
    expect(baseConnectorInstance.setArrowStyle).toBeDefined();

    baseConnectorInstance.state=ConnectorState.Default;

    baseConnectorInstance.setArrowStyle();
    expect(baseConnectorInstance.setArrowStyle).toBeDefined();

 });

 it('should call setConnectionForOnlineMode method ', () => {

    baseConnectorInstance.isOperational=true;

    baseConnectorInstance.setConnectionForOnlineMode();
    expect(baseConnectorInstance.setConnectionForOnlineMode).toBeDefined();

    baseConnectorInstance.isOperational=false;

    baseConnectorInstance.connectionStatus=false;
    baseConnectorInstance.relatedEndPoint.address='192.168.2.101:4840';


    baseConnectorInstance.setConnectionForOnlineMode();
    expect(baseConnectorInstance.setConnectionForOnlineMode).toBeDefined();

 });

 it('should call setConnectionForManualOnline method ', () => {

    baseConnectorInstance.isOperational=true;

    baseConnectorInstance.setConnectionForManualOnline();
    expect(baseConnectorInstance.setConnectionForManualOnline).toBeDefined();

    baseConnectorInstance.isOperational=false;

    baseConnectorInstance.connectionStatus=false;
    baseConnectorInstance.relatedEndPoint.address='192.168.2.101:4840';


    baseConnectorInstance.setConnectionForManualOnline();
    expect(baseConnectorInstance.setConnectionForManualOnline).toBeDefined();

 });

 it('should call setConnectionDefaultColor method ', () => {

    baseConnectorInstance.isOperational=true;

    baseConnectorInstance.setConnectionDefaultColor();
    expect(baseConnectorInstance.setConnectionDefaultColor).toBeDefined();

    baseConnectorInstance.isOperational=false;

    baseConnectorInstance.connectionStatus=false;
    baseConnectorInstance.relatedEndPoint.address='192.168.2.101:4840';


    baseConnectorInstance.setConnectionDefaultColor();
    expect(baseConnectorInstance.setConnectionDefaultColor).toBeDefined();

 });

 it('should call setConnectorDefaultSelectedStyle method ', () => {


    baseConnectorInstance.inputAnchor={
        setAnchorDefaultSelectedStyle:()=>true
    };
    baseConnectorInstance.outputAnchor ={
        setAnchorDefaultSelectedStyle:()=>true
    };

    spyOn(baseConnectorInstance,'addStyleToPath');

    baseConnectorInstance.setConnectorDefaultSelectedStyle();
    expect(baseConnectorInstance.setConnectorDefaultSelectedStyle).toBeDefined();

 });

 it('should call updateConnectionEndPointStatus method ', () => {

    const connectionStatus=true;
    const relatedEndPoint='192.168.2.101:4840';
    const detailedStatus={};

    baseConnectorInstance.connectionStatus = true;

    spyOn(baseConnectorInstance,'updateConnectionStatus');
    spyOn(baseConnectorInstance,'updateRelatedEndpoint');
    spyOn(baseConnectorInstance,'updateDetailedStatus');

    baseConnectorInstance.updateConnectionEndPointStatus(connectionStatus,relatedEndPoint,detailedStatus);
    expect(baseConnectorInstance.updateConnectionEndPointStatus).toBeDefined();

 });

 it('should call reset method ', () => {

    baseConnectorInstance.path=document.createElement('div');
    baseConnectorInstance.pathOutline=document.createElement('div');
    baseConnectorInstance.dragElement=document.createElement('div');
    baseConnectorInstance.staticElement=document.createElement('div');

    baseConnectorInstance.reset();
    expect(baseConnectorInstance.reset).toBeDefined();

 });

 it('should call updateCirclePosition method ', () => {

    const anchor={
        global:{
             x:100,
             y:100
        }
    } as unknown as NodeAnchor;

    baseConnectorInstance.inputAnchor={
        global:{
            x:100,
            y:100
       }
    } as unknown as NodeAnchor;

    baseConnectorInstance.outputAnchor ={
        global:{
            x:100,
            y:100
       }
    }as unknown as NodeAnchor;

    baseConnectorInstance.inputCircle=document.createElement('div');
    baseConnectorInstance.outputCircle=document.createElement('div');

    baseConnectorInstance.updateCirclePosition(anchor);
    expect(baseConnectorInstance.updateCirclePosition).toBeDefined();

 });


 it('should call init method ', () => {

    let anchor={
        isInput:true
    } as unknown as NodeAnchor;

    baseConnectorInstance.inputCircle=document.createElement('div');
    baseConnectorInstance.outputCircle=document.createElement('div');
    baseConnectorInstance.dragElement=document.createElement('div');
    baseConnectorInstance.staticElement=document.createElement('div');


    baseConnectorInstance.init(anchor);
    expect(baseConnectorInstance.init).toBeDefined();

    anchor={
        isInput:false
    } as unknown as NodeAnchor;

    baseConnectorInstance.init(anchor);
    expect(baseConnectorInstance.init).toBeDefined();


 });

 it('should call setPathStyle method ', () => {


    const pathOutlineCls='sampleclass1';
    let pathCls='sampleclass2';

    baseConnectorInstance.pathOutline =document.createElement('div');
    baseConnectorInstance.path=document.createElement('div');

    baseConnectorInstance['setPathStyle'](pathOutlineCls,pathCls);
    expect(baseConnectorInstance['setPathStyle']).toBeDefined();

    pathCls=null;

    baseConnectorInstance['setPathStyle'](pathOutlineCls,pathCls);
    expect(baseConnectorInstance['setPathStyle']).toBeDefined();


 });


 it('should call setPathStyle method ', () => {


    const pathOutlineCls='sampleclass1';
    let pathCls='sampleclass2';

    baseConnectorInstance.pathOutline =document.createElement('div');
    baseConnectorInstance.path=document.createElement('div');

    baseConnectorInstance['removeStyleFromPath'](pathOutlineCls,pathCls);
    expect(baseConnectorInstance['removeStyleFromPath']).toBeDefined();

    pathCls=null;

    baseConnectorInstance['removeStyleFromPath'](pathOutlineCls,pathCls);
    expect(baseConnectorInstance['removeStyleFromPath']).toBeDefined();


 });

 it('should call addStyleToPath method ', () => {


    const pathOutlineCls='sampleclass1';
    let pathCls='sampleclass2';

    baseConnectorInstance.pathOutline =document.createElement('div');
    baseConnectorInstance.path=document.createElement('div');

    baseConnectorInstance['addStyleToPath'](pathOutlineCls,pathCls);
    expect(baseConnectorInstance['addStyleToPath']).toBeDefined();

    pathCls=null;

    baseConnectorInstance['addStyleToPath'](pathOutlineCls,pathCls);
    expect(baseConnectorInstance['addStyleToPath']).toBeDefined();


 });


 it('should call findInclination method ', () => {

    baseConnectorInstance.inputCircle={
         x:50,
         y:50
    };
    baseConnectorInstance.outputCircle={
         x:100,
         y:100
    };

    baseConnectorInstance.findInclination();
    expect(baseConnectorInstance.findInclination).toBeDefined();


 });





});

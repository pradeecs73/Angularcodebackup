/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ConnectorCreationMode, FillingLineNodeType, InterfaceCategory, SubConnectorCreationMode } from './../../enum/enum';
import { Area } from './../../models/models';
import { ServiceInjectorModule } from './../../opcua/adapter/service-injector.module';
import { FacadeMockService } from '../services/facade.mock.service';
import { FacadeService } from '../services/facade.service';
import { AreaOperationsStrategy } from './area-operations-strategy';
import { TranslateModule } from '@ngx-translate/core';
import { SidePanelInterfaceDetails, SubConnection } from './../../models/connection.interface';
import { ClientInterface, OpcInterface } from './../../models/targetmodel.interface';
import { NodeAnchor } from './../../opcua/opcnodes/node-anchor';
import { OPCNode } from './../../opcua/opcnodes/opcnode';
import { PlantArea } from './../../opcua/opcnodes/area';

const mockArea:Array<Area> = [{
    clientInterfaceIds: [{
        automationComponentId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
        deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
        interfaceExposedMode: SubConnectorCreationMode.MANUAL,
        interfaceId: 'Washing1ToMixing',
        subConnectionId:
            'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__Wash1ToMix_Type',
        isClientInterface:true
    }],
    id: 'area_l7yvg8pl',
    name: 'Area 17',
    nodeIds: ['b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE='],
    parent: 'ROOT',
    selected: undefined,
    serverInterfaceIds: [{
        automationComponentId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
        deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
        interfaceExposedMode: SubConnectorCreationMode.MANUAL,
        interfaceId: 'Washing1ToMixing',
        subConnectionId:
            'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__Wash1ToMix_Type',
        isClientInterface:false
    }],
    x:0,
    y:0,
    connectionIds:[]
},{
    clientInterfaceIds: [{
        automationComponentId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
        deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
        interfaceExposedMode: SubConnectorCreationMode.MANUAL,
        interfaceId: 'Washing1ToMixing',
        subConnectionId:
            'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__Wash1ToMix_Type',
        isClientInterface:true
    }],
    id: 'area_l7yvg8l',
    name: 'Area 17',
    nodeIds: ['b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE='],
    parent: 'ROOT',
    selected: undefined,
    serverInterfaceIds: [{
        automationComponentId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=',
        deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MA==',
        interfaceExposedMode: SubConnectorCreationMode.MANUAL,
        interfaceId: 'Washing1ToMixing',
        subConnectionId:
            'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDM6NDg0MF9XYXNoaW5nU3RlcDE=__Wash1ToMix_Type',
        isClientInterface:false
    }],
    x:0,
    y:0,
    connectionIds:[]
}];

fdescribe('AreaOperationsStrategy', () => {
    let areaOperationsStrategy: AreaOperationsStrategy;
    let facadeMockService;
    let mockMessageService: MessageService;


    beforeEach(() => {
        facadeMockService=new FacadeMockService();
        mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
        Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getArea').value.and.returnValue(mockArea);
        TestBed.configureTestingModule({
            imports: [
                ServiceInjectorModule,
                TranslateModule.forRoot({})
            ],
            providers: [
                { provide: FacadeService, useValue: facadeMockService},
                { provide: MessageService, useValue: mockMessageService },

            ]
        });
        areaOperationsStrategy = TestBed.inject(AreaOperationsStrategy);
    });

    it('should be created AreaOperationsStrategy', () => {
        expect(areaOperationsStrategy).toBeTruthy();
    });

   it('should call updateConnectionInOrOut method', () => {
        let subCon={isclient:true} as unknown as SubConnection;
        const areaId='area12345';
        const interfaceId='interface12345';

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getClientInterfaceIdDetailsById')
        .value.and.returnValue({});
        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getServerInterfaceIdDetailsById')
        .value.and.returnValue({});

        let sidePanelData=areaOperationsStrategy['getSidePanelData'](subCon,areaId,interfaceId);
        expect(areaOperationsStrategy['getSidePanelData']).toBeDefined();
        expect(sidePanelData).toEqual({});
        expect(sidePanelData).toBeInstanceOf(Object);

        subCon={isclient:false} as unknown as SubConnection;

        sidePanelData=areaOperationsStrategy['getSidePanelData'](subCon,areaId,interfaceId);
        expect(areaOperationsStrategy['getSidePanelData']).toBeDefined();
        expect(sidePanelData).toEqual({});
        expect(sidePanelData).toBeInstanceOf(Object);

    });


    it('should call removeSubConnectorFromLookup method', () => {
        const subConnectorId='subconnector12345';
        const subConnector={creationMode:SubConnectorCreationMode.MANUAL};

        Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getExistingSubConnectorById')
        .value.and.returnValue(subConnector);

        Object.getOwnPropertyDescriptor(facadeMockService.subConnectorService,'removeOnlyFromLookup')
        .value.and.returnValue({});

        areaOperationsStrategy['removeSubConnectorFromLookup'](subConnectorId);
        expect(areaOperationsStrategy['removeSubConnectorFromLookup']).toBeDefined();
        expect(facadeMockService.subConnectorService.removeOnlyFromLookup).toBeDefined();

    });

    it('should call updateNotificationDetails method', () => {
        const sidePanelinterfaceDetails={
            clientInterfaceId:{
                deviceId:'device12345'
            }
        } as unknown as SidePanelInterfaceDetails;
        const serverInterface={name:'serverinterface12345'} as unknown as OpcInterface;
        const inputAnchor={
            interfaceData:{
                name:'inputanchor12345'
            }
        } as unknown as NodeAnchor;

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getDevice')
        .value.and.returnValue({name:'device12345'});

        areaOperationsStrategy['updateNotificationDetails'](sidePanelinterfaceDetails,serverInterface,inputAnchor);
        expect(areaOperationsStrategy['updateNotificationDetails']).toBeDefined();
        expect(facadeMockService.dataService.getDevice).toBeDefined();

    });

    it('should call getSubConnectionIdList method', () => {
        const interfaceType='client';
        let isClient=true;
        const subConnectionList =[{id:'subconnection12345'}];

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getSubConnectionsByCategoryAndInterfaceType')
        .value.and.returnValue(subConnectionList);

        let subConnection=areaOperationsStrategy['getSubConnectionIdList'](interfaceType,isClient);
        expect(areaOperationsStrategy['getSubConnectionIdList']).toBeDefined();
        expect(subConnection).not.toBe(undefined);
        expect(subConnection).toBeInstanceOf(Object);

        isClient=false;

        subConnection=areaOperationsStrategy['getSubConnectionIdList'](interfaceType,isClient);
        expect(areaOperationsStrategy['getSubConnectionIdList']).toBeDefined();
        expect(subConnection).not.toBe(undefined);
        expect(subConnection).toBeInstanceOf(Object);

    });

    it('should call checkManualExposedConnectionUptoCommonParent method', () => {
        const areaHierarchy=['parent12345'];
        const commonParent='parent12345';
        const interfaceId='interface12345';
        const type='client' as unknown as InterfaceCategory;

        let isClient=true;
        const subConnectionList =[{id:'subconnection12345'}];

        const area={
            id:'area12345',
            clientInterfaceIds:[{interfaceId:'interface1234567'}],
            serverInterfaceIds:[{interfaceId:'interface1234567'}]
        };

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getArea')
        .value.and.returnValue(area);


        const areaId=areaOperationsStrategy['checkManualExposedConnectionUptoCommonParent'](areaHierarchy,commonParent,interfaceId,type);
        expect(areaOperationsStrategy['checkManualExposedConnectionUptoCommonParent']).toBeDefined();
        expect(areaId).toEqual('area12345');

    });


    it('should call addCreateConnectionNotification method', () => {

       const connectionIn='connectionin12345';
       const connectionOut='connectionout12345';
       const sourceAcName='source12345';
       const targetAcName='target12345';
       const areaName='area12345';

        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService,'getAreaName')
        .value.and.returnValue(null);

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getNodeByID')
        .value.and.returnValue({deviceId:'device12345'});

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getAutomationComponent')
        .value.and.returnValue({name:'automation12345'});


        areaOperationsStrategy['addCreateConnectionNotification'](connectionIn,connectionOut,sourceAcName,targetAcName);
        expect(areaOperationsStrategy['addCreateConnectionNotification']).toBeDefined();
        expect(facadeMockService.notificationService.pushNotificationToPopup).toHaveBeenCalled();

    });

    it('should call updateSubConnectionsWithConnectionId method', () => {

        const connectionId='connection12345';
        let subConnectionIds={clientIds:['client12345'],serverIds:['server12345']};


         Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getSubConnection')
         .value.and.returnValue({});

         Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getExistingSubConnectorById')
         .value.and.returnValue({connectionId:'connection12345'});


         areaOperationsStrategy['updateSubConnectionsWithConnectionId'](connectionId,subConnectionIds);
         expect(areaOperationsStrategy['updateSubConnectionsWithConnectionId']).toBeDefined();
         expect(facadeMockService.dataService.updateSubConnection).toHaveBeenCalled();

         subConnectionIds={clientIds:null,serverIds:null};

         areaOperationsStrategy['updateSubConnectionsWithConnectionId'](connectionId,subConnectionIds);
         expect(areaOperationsStrategy['updateSubConnectionsWithConnectionId']).toBeDefined();
         expect(facadeMockService.dataService.updateSubConnection).toHaveBeenCalled();

     });

     it('should call updateConnectionObject method', () => {

         const param={
            connection :{
                id:'connection__12345',
                in:'connectionin__12345',
                out:'connectionout__12345'
            },
            connectionIn:'connectionIn12345',
            connectionOut:'connectionOut12345',
            commonParent:'commonparent12345'
         };

         Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getSubConnection')
         .value.and.returnValue({});

         Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getExistingSubConnectorById')
         .value.and.returnValue({connectionId:'connection12345'});


         areaOperationsStrategy['updateConnectionObject'](param);
         expect(areaOperationsStrategy['updateConnectionObject']).toBeDefined();
         expect(facadeMockService.dataService.updateConnection).toHaveBeenCalled();
         expect(facadeMockService.connectorService.updateSubConnection).toHaveBeenCalled();
     });


     it('should call updateSubConnectionToManualOfflineForOuterAreas method', () => {

        const areaHierarchy1=['parent1234567','parent12345'];
        const commonParent='parent12345';
        const interfaceId='interface12345';
        let isClient=true;

        const subConnections=[{
             id:'subcon__id__12345',
             data:'sucondata__data__interface12345',
             acId:'subconnectionacid',
             areaId:'area12345'
        }];

        const sidePanelData={interfaceExposedMode:'client'};

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getAreaSubConnectionsByCategory').value.and.returnValue(subConnections);

        spyOn<any>(areaOperationsStrategy,'removeSubConnectorFromLookup');
        spyOn<any>(areaOperationsStrategy,'getSidePanelData').and.returnValue(sidePanelData);

        areaOperationsStrategy['updateSubConnectionToManualOfflineForOuterAreas'](areaHierarchy1,commonParent,interfaceId,isClient);
        expect(areaOperationsStrategy['updateSubConnectionToManualOfflineForOuterAreas']).toBeDefined();
        expect(facadeMockService.dataService.addOrUpdateSubConnection).toHaveBeenCalled();
        expect(areaOperationsStrategy.areaUtilityService.updateInterfaceExposedMode).toHaveBeenCalled();

    });


    it('should call createOnlineConnectionFromParent method', () => {
        let interfaceData={id:'interface12345',type:'server'} as unknown as ClientInterface;
        const serverInterface={id:'server12345',type:'server'} as unknown as OpcInterface;
        const params={
            type:'server',
            soureDeviceId:'source12345',
            targetDeviceId: 'target12345',
            commonParent:'root',
            clientInterfaceId:'client12345',
            serverInterfaceId:'server12345',
            targetAreaHierarchy:[],
            sourceAreaHierarchy:[],
            connectionIn: 'connectionin_12345',
            connectionOut: 'connectionout_12345'
        };



        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService,'getExposeInterfaceDetails')
        .value.and.returnValue({serverInterfaceId:'serverinterface12345',serverInterface:{id:'server12345',type:'server'},
                                clientInterfaceId:'client12345',clientInterface:{id:'client12345',type:'client'}});

         Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService,'updateExposedInterfaceUptoTargetArea')
         .value.and.returnValue({clientIds:[]});

        facadeMockService.editorService.liveLinkEditor.editorNodes = [
            {type: FillingLineNodeType.AREA,id:'connectionin_12345'},
            {type: FillingLineNodeType.AREA,id:'connectionout_12345'}
        ] as unknown as Array<OPCNode | PlantArea>;

        spyOn<any>(areaOperationsStrategy,'checkManualExposedConnectionUptoCommonParent').and.returnValue({});

        areaOperationsStrategy['createOnlineConnectionFromParent'](interfaceData,serverInterface,params);
        expect(areaOperationsStrategy['createOnlineConnectionFromParent']).toBeDefined();

        facadeMockService.editorService.liveLinkEditor.editorNodes = [
            {type: FillingLineNodeType.AREA,id:'connectionin_12345',},
            {type: FillingLineNodeType.AREA,id:'connectionout_12345',outputs:[{interfaceData:{type:'server'}}]}
        ] as unknown as Array<OPCNode | PlantArea>;

        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService,'updateInterfaceExposedMode')
        .value.and.returnValue({});

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getServerInterfaceIdDetailsById')
        .value.and.returnValue({interfaceExposedMode:'open'});

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getClientInterfaceIdDetailsById')
        .value.and.returnValue({interfaceExposedMode:'open'});

        spyOn<any>(areaOperationsStrategy,'updateSubConnectionToManualOfflineForOuterAreas');

        areaOperationsStrategy['createOnlineConnectionFromParent'](interfaceData,serverInterface,params);
        expect(areaOperationsStrategy['createOnlineConnectionFromParent']).toBeDefined();

        interfaceData={id:'interface12345',type:'client'} as unknown as ClientInterface;

        facadeMockService.editorService.liveLinkEditor.editorNodes = [
            {type: FillingLineNodeType.AREA,id:'connectionin_12345',inputs:[{interfaceData:{type:'client'}}]},
            {type: FillingLineNodeType.AREA,id:'connectionout_12345',outputs:[{interfaceData:{type:'server'}}]}
        ] as unknown as Array<OPCNode | PlantArea>;

        Object.getOwnPropertyDescriptor(facadeMockService.dataService,'getSubConnection')
        .value.and.returnValue({creationMode:SubConnectorCreationMode.MANUAL,areaId:'area12345',id:'subconnection12345',isclient:true});

        spyOn<any>(areaOperationsStrategy,'getSubConnectionIdList').and.returnValue({clientIds:['client12345']});

        areaOperationsStrategy['createOnlineConnectionFromParent'](interfaceData,serverInterface,params);
        expect(areaOperationsStrategy['createOnlineConnectionFromParent']).toBeDefined();

    });

    it('should call createConnectionAndAddOrUpdateConnection method', () => {

         const params={
            type:'server',
            sourceDeviceId:'source12345',
            targetDeviceId: 'target12345',
            commonParent:'root',
            clientInterfaceId:'client12345',
            serverInterfaceId:'server12345',
            connectionIn:'connectionIn12345',
            connectionOut:'connectionOut12345',
            sourceAcId:'sourceAc12345',
            targetAcId:'targetAc12345'
         };
         const subConnectionIds={clientIds:['client12345'],serverIds:['server12345']};

         Object.getOwnPropertyDescriptor(facadeMockService.dataService,'addOrUpdateConnection')
         .value.and.returnValue({});

         areaOperationsStrategy.createConnectionAndAddOrUpdateConnection(params,ConnectorCreationMode.MANUAL,subConnectionIds);
         expect(areaOperationsStrategy.createConnectionAndAddOrUpdateConnection).toBeDefined();

     });


});

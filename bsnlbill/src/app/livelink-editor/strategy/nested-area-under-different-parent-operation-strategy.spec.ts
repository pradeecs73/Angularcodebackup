/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/


import { TestBed } from '@angular/core/testing';
import { NestedDifferentParentAreaStrategy } from './nested-area-under-different-parent-operation-strategy';
import { FacadeService } from '../services/facade.service';
import { FacadeMockService } from '../services/facade.mock.service';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { ConnectorCreationMode, StrategyList, SubConnectorCreationMode } from '../../enum/enum';
import { TranslateModule } from '@ngx-translate/core';
import { NodeAnchor } from './../../opcua/opcnodes/node-anchor';
import { Connection } from './../../models/connection.interface';


fdescribe('NestedDifferentParentAreaStrategy', () => {
    let clientServerMonitor: NestedDifferentParentAreaStrategy;
    let facadeMockService;
    const defaultFillingNodes = {
        ids: [],
        entities: {}
    };

    const initialState = { deviceTreeList: of(null), fillingLine: defaultFillingNodes };

    beforeEach(() => {
        facadeMockService = new FacadeMockService();
        TestBed.configureTestingModule({
            imports: [ TranslateModule.forRoot({})],
            providers: [
                { provide: FacadeService, useValue: facadeMockService },
                NestedDifferentParentAreaStrategy,
                provideMockStore({ initialState })]
        });
        clientServerMonitor = TestBed.inject(NestedDifferentParentAreaStrategy);
        facadeMockService.dataService.getAutomationComponent = function() { return { name: ''};};
    });

    it('should be created', () => {
        expect(clientServerMonitor).toBeTruthy();
    });

    it('should call ungroup area method', () => {
        expect(function () { clientServerMonitor.unGroupArea(); }).toBeDefined();
        expect(() => clientServerMonitor.unGroupArea()).toThrowError();
    });

    it('should call getClassName method', () => {
        const classNameValue = clientServerMonitor.getClassName();
        expect(classNameValue).toEqual(StrategyList.NESTED_DIFFERENT_PARENT_AREA_STRATEGY);
    });

    it('should call connectionBySearch method', () => {
        const interfaceDetails = {
            'clientInterface': 'clientinterface',
            'clientInterfaceId': 'clientinterface12345',
            'serverInterface': 'serverInterface',
            'serverInterfaceId': 'serverInterface12345'
        };
        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getExposeInterfaceDetails').value.and.returnValue(interfaceDetails);
        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'updateExposedInterfaceUptoTargetArea').value.and.returnValue({ clientIds: [], serverIds: [] });

        const searchParam = {
            'type': 'sampletype',
            'sourceAcId': 'source12345',
            'targetAcId': 'target12345',
            'commonParent': 'area1',
            'sourceParent': 'root',
            'targetParent': 'area2',
            'clientInterfaceId': 'client1',
            'serverInterfaceId': 'server1'

        };
        clientServerMonitor.connectionBySearch(searchParam);
        expect(clientServerMonitor.connectionBySearch).toBeDefined();
        expect(facadeMockService.areaUtilityService.getExposeInterfaceDetails).toHaveBeenCalled();
        const exposeInterfaceDetails = facadeMockService.areaUtilityService.getExposeInterfaceDetails();
        expect(exposeInterfaceDetails).toEqual(interfaceDetails);
    });


   it('should call createOnlineAreaConnection method', () => {

        const param = {
            inputAnchor:{
                relatedEndPoint:{
                    address:'opc.tcp://192.168.2.102:4840',
                    automationComponent: 'LiquidMixing',
                    functionalEntity: 'FillingToMixing'
                 },
                 interfaceData:{
                    id:'client12345',
                    type:'client'
                 },
                 parentNode:{
                    id:'parent12345'
                 }
            },
            sourceAreaHierarchy:[{}],
            targetAreaHierarchy:[{}],
            commonParent:'ROOT'

        } as unknown as NodeAnchor;

        const clientSubConnector={
            subConnectorLookup:
            {
                id:'subconnection12345',
                creationMode:SubConnectorCreationMode.MANUAL
            }
        };

        const getExposeInterfaceDetails={
            clientInterface:{},
            clientInterfaceId:'clientinterface12345'

        };

        spyOn<any>(clientServerMonitor,'createOnlineConnectionsFromClientArea');
        spyOn<any>(clientServerMonitor,'createOnlineConnectionsFromParentEditorWtAnchor');
        Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllNodes').value.and.returnValue([{id:'node12345',address:'opc.tcp://192.168.2.102:4840',
        deviceId:'device12345'}]);
        Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getServerInterface').value.and.returnValue({});
        Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'isRootEditor').value.and.returnValue(false);
        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getExposeInterfaceDetails').value.and.returnValue(getExposeInterfaceDetails);
       facadeMockService.editorService.liveLinkEditor=clientSubConnector;

        clientServerMonitor.createOnlineAreaConnection(param);
        expect(clientServerMonitor.createOnlineAreaConnection).toBeDefined();
        Object.getOwnPropertyDescriptor(facadeMockService.editorService, 'isRootEditor').value.and.returnValue(true);
        clientServerMonitor.createOnlineAreaConnection(param);
        expect(clientServerMonitor.createOnlineAreaConnection).toBeDefined();
    });

    it('should call reorderHTMLNode method', () => {

        let mockConnection={
            id: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc=__FillToMix_Type',
            in: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==__BottleFilling__FillingToMixing',
            out: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MA==__LiquidMixing__FillingToMixing',
            selected: false,
            creationMode: ConnectorCreationMode.MANUAL,
            hasSubConnections: false,
            areaId: 'ROOT',
            acIds: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MF9Cb3R0bGVGaWxsaW5n__b3BjLnRjcDovLzE5Mi4xNjguMi4xMDI6NDg0MF9MaXF1aWRNaXhpbmc='
          } as unknown as Connection;


        const param = {
            sourceAreaHierarchy:[{}],
            targetAreaHierarchy:[{}],
            commonParent:'ROOT',
            connection:mockConnection,
            sourceNodePrevParent:'Area123',
            targetNodePrevParent:'Area345'
        } as unknown as NodeAnchor;

        const getExposeInterfaceDetails={
            clientInterface:{},
           clientInterfaceId:'clientinterface12345'

        };


        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getExposeInterfaceDetails').value.and.returnValue(getExposeInterfaceDetails);

        clientServerMonitor.reorderHTMLNode(param);
        expect(clientServerMonitor.reorderHTMLNode).toBeDefined();


    });



});


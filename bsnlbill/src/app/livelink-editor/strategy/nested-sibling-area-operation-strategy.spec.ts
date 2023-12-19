/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from '@angular/core/testing';
import { NestedSiblingsAreaStrategy } from './nested-sibling-area-operation-strategy';
import { FacadeService } from '../services/facade.service';
import { FacadeMockService } from '../services/facade.mock.service';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { ConnectorCreationMode, StrategyList} from '../../enum/enum';
import { TranslateModule } from '@ngx-translate/core';
import { NodeAnchor } from './../../opcua/opcnodes/node-anchor';
import { Connection } from './../../models/connection.interface';


fdescribe('NestedSiblingsAreaStrategy', () => {
    let clientServerMonitor: NestedSiblingsAreaStrategy;
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
                NestedSiblingsAreaStrategy,
                provideMockStore({ initialState })]
        });
        clientServerMonitor = TestBed.inject(NestedSiblingsAreaStrategy);
        facadeMockService.dataService.getAutomationComponent = function() { return { name: ''};};
    });

    it('should be created', () => {
        expect(clientServerMonitor).toBeTruthy();
    });

    it('should call  getClassName method', () => {
        const getClassNameReturn=clientServerMonitor.getClassName();
        expect(getClassNameReturn).toEqual(StrategyList.NESTED_SIBLINGS_AREA_STRATEGY);

    });

    it('should call unGroupArea method', () => {
        const params={};
        spyOn(clientServerMonitor,'removeExposedConnectionAndRecreate');
        clientServerMonitor.unGroupArea(params);
        expect(clientServerMonitor.unGroupArea).toBeDefined();
    });

    it('should call reorderHTMLNode method', () => {
        const params={};
        spyOn(clientServerMonitor,'removeExposedConnectionAndRecreate');
        clientServerMonitor.reorderHTMLNode(params);
        expect(clientServerMonitor.reorderHTMLNode).toBeDefined();
    });

    it('should call createOnlineAreaConnection method', () => {
        const param={
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
            commonParent:'ROOT'
        };
        Object.getOwnPropertyDescriptor(facadeMockService.dataService, 'getAllNodes').value.and.returnValue([{id:'node12345',address:'opc.tcp://192.168.2.102:4840',
        deviceId:'device12345'}]);
        Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getEditorContext').value.and.returnValue({id:'ROOT'});
        spyOn<any>(clientServerMonitor,'createOnlineConnectionsFromParentEditorWtAnchor');
        spyOn<any>(clientServerMonitor,'createOnlineConnectionsFromClientArea');
        spyOn<any>(clientServerMonitor,'createOnlineConnectionsFromParentEditorWoAnchor');
        clientServerMonitor.createOnlineAreaConnection(param);
        expect(clientServerMonitor.createOnlineAreaConnection).toBeDefined();
        Object.getOwnPropertyDescriptor(facadeMockService.editorService,'getEditorContext').value.and.returnValue({id:'other'});
        clientServerMonitor.createOnlineAreaConnection(param);

        const param1={
            targetAcId:'automation12345',
            serverInterfaceId:'serverinterface12345',
            targetDeviceId:'device12345',
            commonParent:'ROOT'
        };

        clientServerMonitor.createOnlineAreaConnection(param1);
        expect(clientServerMonitor.createOnlineAreaConnection).toBeDefined();
    });

    it('should call removeExposedConnectionAndRecreate method', () => {

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


        const params = {
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

        clientServerMonitor.removeExposedConnectionAndRecreate(params);
        expect(clientServerMonitor.removeExposedConnectionAndRecreate).toBeDefined();

    });

    it('should call removeExposedConnectionAndRecreate method', () => {

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


          const params = {
            type:'manual',
            commonParent:'ROOT',
            connection:mockConnection,
            sourceParent:'Area123',
            targetParent:'Area345',
            clientInterfaceId:'client12345',
            serverInterfaceId:'server12345',
            sourceAcId:'bottlinefilling_12345',
            targetAcId:'liquidmixing_12345'
        } as unknown as NodeAnchor;

        const getExposeInterfaceDetails={
            clientInterface:{},
           clientInterfaceId:'clientinterface12345'

        };


        spyOn<any>(clientServerMonitor,'addCreateConnectionNotification');
        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'updateExposedInterfaceUptoTargetArea').value.and.returnValue({ clientIds: [], serverIds: [] });
        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getExposeInterfaceDetails').value.and.returnValue(getExposeInterfaceDetails);

        clientServerMonitor.connectionBySearch(params);
        expect(clientServerMonitor.connectionBySearch).toBeDefined();

    });



});
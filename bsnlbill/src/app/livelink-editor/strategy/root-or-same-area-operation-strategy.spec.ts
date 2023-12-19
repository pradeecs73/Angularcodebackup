/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from '@angular/core/testing';
import { RootOrSameAreaStrategy } from './root-or-same-area-operation-strategy';
import { FacadeService } from '../services/facade.service';
import { FacadeMockService } from '../services/facade.mock.service';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { ConnectorCreationMode, StrategyList} from '../../enum/enum';
import { TranslateModule } from '@ngx-translate/core';
import { NodeAnchor } from './../../opcua/opcnodes/node-anchor';
import { Connection } from './../../models/connection.interface';


fdescribe('NestedDifferentParentAreaStrategy', () => {
    let clientServerMonitor: RootOrSameAreaStrategy;
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
                RootOrSameAreaStrategy,
                provideMockStore({ initialState })]
        });
        clientServerMonitor = TestBed.inject(RootOrSameAreaStrategy);
        facadeMockService.dataService.getAutomationComponent = function() { return { name: ''};};
    });

    it('should be created', () => {
        expect(clientServerMonitor).toBeTruthy();
    });

    it('should call  getClassName method', () => {
        const getClassNameReturn=clientServerMonitor.getClassName();
        expect(getClassNameReturn).toEqual(StrategyList.ROOT_OR_SAME_AREA_STRATEGY);

    });

    it('should call createOnlineAreaConnection method', () => {
        expect(() =>clientServerMonitor.createOnlineAreaConnection()).toThrow(new Error('Method not implemented.'));
     });

     it('should call unGroupArea method', () => {
        expect(() =>clientServerMonitor.unGroupArea()).toThrow(new Error('Method not implemented.'));
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

        spyOn<any>(clientServerMonitor,'updateConnectionObject');
        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getExposeInterfaceDetails').value.and.returnValue(getExposeInterfaceDetails);

        clientServerMonitor.reorderHTMLNode(param);
        expect(clientServerMonitor.reorderHTMLNode).toBeDefined();

     });

     it('should call connectionBySearch method', () => {

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
            clientInterfaceId:'clientinterface12345',
            serverInterface:{},
            serverInterfaceId:'clientinterface12345'
        };

        spyOn<any>(clientServerMonitor,'addCreateConnectionNotification');
        Object.getOwnPropertyDescriptor(facadeMockService.areaUtilityService, 'getExposeInterfaceDetails').value.and.returnValue(getExposeInterfaceDetails);

        clientServerMonitor.connectionBySearch(params);
        expect(clientServerMonitor.connectionBySearch).toBeDefined();

     });



});
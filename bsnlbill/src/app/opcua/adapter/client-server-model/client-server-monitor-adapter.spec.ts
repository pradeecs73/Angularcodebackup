/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { mockConnection } from "mockData";
import { mockConnectionMoniterData } from "mockData/mockCreatedTreeData";
import { MessageService } from 'primeng/api';
import { of } from "rxjs";
import { FacadeMockService } from "../../../livelink-editor/services/facade.mock.service";
import { FacadeService } from "../../../livelink-editor/services/facade.service";
import { HomeComponent } from '../../../home/home.component';
import { ServiceInjectorModule } from "../service-injector.module";
import { ClientServerMonitor } from "./client-server-monitor-adapter";
import { TranslateModule } from '@ngx-translate/core';

fdescribe('ClientServerMonitor', () => {
    let clientServerMonitor: ClientServerMonitor;
    let mockMessageService: MessageService;
    let mockHttpClientService: HttpClient;
    let facadeMockService;
    const defaultFillingNodes = {
        ids: [],
        entities: {}
    };
    const initialState = { deviceTreeList: of(null), fillingLine: defaultFillingNodes };
    beforeEach(() => {
        facadeMockService=new FacadeMockService();
        mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
        TestBed.configureTestingModule({
            imports: [
                ServiceInjectorModule,
                TranslateModule.forRoot({}),
                RouterTestingModule.withRoutes(
                    [{path: 'home', component: HomeComponent}]
                  )
            ],
            providers: [
                { provide: FacadeService, useValue: facadeMockService},
                provideMockStore({ initialState }),
                { provide: MessageService, useValue: mockMessageService },
                { provide: HttpClient, useValue: mockHttpClientService },
            ]
        });

    });

    it('should be created', () => {
        clientServerMonitor = TestBed.inject(ClientServerMonitor);
        expect(clientServerMonitor).toBeTruthy();
    });

    it('should call setTagValueFromMonitor method', () => {
        spyOn(clientServerMonitor, 'setTagValueFromMonitor').and.callThrough();
        clientServerMonitor.setTagValueFromMonitor(mockConnectionMoniterData.eventName, mockConnectionMoniterData.value, mockConnectionMoniterData.treeData);
        expect(clientServerMonitor.setTagValueFromMonitor).toHaveBeenCalled();
    });

    it('should call getServerDiagnosticData', () => {
        spyOn(clientServerMonitor,'getServerDiagnosticData').and.callThrough();
        clientServerMonitor.getServerDiagnosticData(mockConnection);
        expect(clientServerMonitor.getServerDiagnosticData).toHaveBeenCalled();
    });

});

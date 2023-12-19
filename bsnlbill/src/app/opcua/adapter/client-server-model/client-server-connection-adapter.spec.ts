/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { TestBed } from "@angular/core/testing";
import { ApiService } from "src/app/services/api.service";
import { ProjectDataService } from "src/app/shared/services/dataservice/project-data.service";
import { ServiceInjector, ServiceInjectorModule } from "../service-injector.module";
import { ClientServerConnection } from "./client-server-connection-adapter";
import { MessageService } from 'primeng/api';
import { mockConnection } from "mockData";
import {  mockEstablisConnectionPayloadError, mockEstablisConnectionPayloadSuccess } from "mockData/mockConnection";
import { ConnectionResponsePayload } from "src/app/models/connection.interface";
import { FacadeMockService } from "../../../livelink-editor/services/facade.mock.service";
import { FacadeService } from "../../../livelink-editor/services/facade.service";
import { HttpClient } from "@angular/common/http";
import { TranslateModule } from '@ngx-translate/core';


fdescribe('ClientServerConnection', () => {
    let clientServerConnection: ClientServerConnection;
    let mockMessageService: MessageService;
    let facadeMockService;
    let mockHttpClientService: HttpClient;
    beforeEach(() => {
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    facadeMockService=new FacadeMockService();
        TestBed.configureTestingModule({
            imports: [
                ServiceInjectorModule,
                TranslateModule.forRoot({})
            ],
            providers: [
                { provide: FacadeService, useValue: facadeMockService},
                { provide: MessageService, useValue: mockMessageService },
                { provide: HttpClient, useValue: mockHttpClientService },
            ]
        });

    });

    it(' ClientServerConnection instance should be created', () => {
        clientServerConnection = TestBed.inject(ClientServerConnection);
        expect(clientServerConnection).toBeTruthy();
    });

    it('should call executeConnection', ()=> {
        spyOn(clientServerConnection,'executeConnectCall').and.callThrough();
        clientServerConnection.executeConnectCall(mockConnection);
        expect(clientServerConnection.executeConnectCall).toHaveBeenCalled();
    });

    it('should call establishConnection', ()=> {
        spyOn(clientServerConnection,'establishConnection').and.callThrough();
        clientServerConnection.establishConnection(mockEstablisConnectionPayloadSuccess);
        expect(clientServerConnection.establishConnection).toHaveBeenCalled();
    })

    it('should call establishConnection partial success case', ()=> {
        spyOn(clientServerConnection,'establishConnection').and.callThrough();
        clientServerConnection.establishConnection(mockEstablisConnectionPayloadError);
        expect(clientServerConnection.establishConnection).toHaveBeenCalled();
    })

    it('should call establishConnection partial all error case', ()=> {
        spyOn(clientServerConnection,'establishConnection').and.callThrough();
        const payload = [ mockEstablisConnectionPayloadError[0] ] as unknown as Array<ConnectionResponsePayload>;
        clientServerConnection.establishConnection(payload);
        expect(clientServerConnection.establishConnection).toHaveBeenCalled();
    })

    xit('should call deleteConnectionFromServer', () => {
        spyOn(clientServerConnection,'deleteConnectionFromServer').and.callThrough();
        clientServerConnection.deleteConnectionFromServer(mockConnection);
        expect(clientServerConnection.deleteConnectionFromServer).toHaveBeenCalled();
        expect(facadeMockService.apiService.deleteOpcConnection).toBeDefined();
    });

});

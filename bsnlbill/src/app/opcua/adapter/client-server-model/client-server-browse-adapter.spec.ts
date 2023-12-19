/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { TestBed } from "@angular/core/testing";
import { mockCreatedTreeData } from "mockData";
import { ClientServerBrowse } from "./client-server-browse-adapter";


fdescribe('ClientServerBrowse', () => {
    let clientServerBrowse: ClientServerBrowse;

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        clientServerBrowse = TestBed.inject(ClientServerBrowse);
        expect(clientServerBrowse).toBeTruthy();
    });

    it('should call createPanelTreeData method', () => {
        const result = spyOn(clientServerBrowse,'createPanelTreeData').and.callThrough();
        clientServerBrowse.createPanelTreeData(mockCreatedTreeData[0].children);
        expect(result).toBeDefined();
        expect(clientServerBrowse.createPanelTreeData).toHaveBeenCalled();
    });

});

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { SubConnector } from '../../opcua/opcnodes/subConnector';
import {
    createConnectionObject, getclientInterfaceDetails, getConnectionID, getIntefaceExposeModeInOnline,
    getRelatedEndPointData,
    getserverInterfaceDetails, getSubConnectionDetails, getSubConnectionID, updateSubConnectionList
} from '../../../app/utility/utility';
import {
    ConnectorCreationMode, FillingLineNodeType, HTTPStatus, InterfaceCategory,
    NotificationType, SubConnectorCreationMode
} from '../../enum/enum';
import {
    Connection, ConnectionObjectDetails, InterfaceDetails, SidePanelInterfaceDetails,
    SubConnection,
    SubConnectionIdList
} from '../../models/connection.interface';
import { Node } from '../../models/models';
import { AreaInterface, ClientInterface, ISidePanel, OpcInterface } from '../../models/targetmodel.interface';
import { PlantArea } from '../../opcua/opcnodes/area';
import { NodeAnchor } from '../../opcua/opcnodes/node-anchor';
import { FacadeService } from '../services/facade.service';
import { ROOT_EDITOR } from '../../utility/constant';

@Injectable({
    providedIn: 'root'
})
export abstract class AreaOperationsStrategy {

    abstract connectionBySearch(param);
    abstract createOnlineAreaConnection(inputAnchor: NodeAnchor);
    abstract reorderHTMLNode(param);
    abstract unGroupArea(param);
    abstract getClassName();

    constructor(protected readonly facadeService: FacadeService) { }

    public areaUtilityService = this.facadeService.areaUtilityService;
    /*
    *
    *  Update connection object
    *
    */
    protected updateConnectionObject(param) {
        const connection = { ...param.connection } as Connection;
        const clonedConnectionId = connection.id;
        connection.in = updateConnectionInOrOut(connection.in, param.connectionIn);
        connection.out = updateConnectionInOrOut(connection.out, param.connectionOut);
        const connectionId = connection.id.split('__');
        connectionId[0] = param.connectionIn;
        connectionId[1] = param.connectionOut;
        connection.id = connectionId.join('__');
        connection.areaId = param.commonParent;
        this.facadeService.dataService.updateConnection(clonedConnectionId, connection);
        this.facadeService.connectorService.updateSubConnection(connection, param?.sourceSubConnectionIds, param?.targetSubConnectionIds);
    }

    /*
    * Add create connection notification
    *
    *
    */
    protected addCreateConnectionNotification(connectionIn: string, connectionOut: string, sourceAcId: string, targetAcId: string) {
        const sourceDeviceId = this.facadeService.dataService.getNodeByID(connectionIn)?.deviceId;
        const nodeFrom = this.facadeService.areaUtilityService.getAreaName(connectionIn, sourceDeviceId,sourceAcId);
        const targetDeviceId = this.facadeService.dataService.getNodeByID(connectionOut)?.deviceId;
        const nodeTo = this.facadeService.areaUtilityService.getAreaName(connectionOut, targetDeviceId,targetAcId);
        this.facadeService.notificationService.pushNotificationToPopup(
            {
                content: 'notification.info.connectionCreated',
                params: { nodeFrom: nodeFrom, nodeTo: nodeTo }
            },
            NotificationType.INFO, HTTPStatus.SUCCESS);
    }
    /*
    *
    *Update sub connections with connection id
    *
    */
    protected updateSubConnectionsWithConnectionId(connectionId: string, subConnectionIds: { clientIds: string[], serverIds: string[] }) {
        let subConnections = subConnectionIds?.clientIds || [];
        subConnections = subConnections.concat(subConnectionIds?.serverIds || []);
        subConnections.forEach(con => {
            const subConnection = { ...this.facadeService.dataService.getSubConnection(con) };
            const subConnector = this.facadeService.editorService.getExistingSubConnectorById(subConnection.id);
            if (subConnector) {
                subConnector.connectionId = connectionId;
                this.facadeService.editorService.addOrUpdateToSubConnectorLookup(subConnector);
            }
            subConnection.connectionId = connectionId;
            this.facadeService.dataService.updateSubConnection(subConnection);
        });
    }


    protected createOnlineConnectionsFromClientArea(inputAnchor: NodeAnchor, outputNode: Node, serverInterface: OpcInterface, param) {
        const { sourceAreaHierarchy, targetAreaHierarchy, commonParent, connectionOut } = param;
        /*
        *If inside an area expose Client SubConnetion
        *create Online Subconnector scenario - client Area interface
        */
        const clientSubConnectionId = getSubConnectionID(inputAnchor.parentNode.id, inputAnchor.interfaceData.type, inputAnchor.interfaceData.id);
        const clientSubConnector: SubConnector = this.facadeService.editorService.liveLinkEditor.subConnectorLookup[clientSubConnectionId];
        let subConnections: SubConnectionIdList;
        const sourceNodeParent = sourceAreaHierarchy[sourceAreaHierarchy.length - 1];
        let sidePanelinterfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(inputAnchor.automationComponentId,
            outputNode.id, inputAnchor.interfaceData.type, inputAnchor.interfaceData.id,
            serverInterface.id, SubConnectorCreationMode.ONLINE, SubConnectorCreationMode.ONLINE);
        if (clientSubConnector && clientSubConnector.creationMode === SubConnectorCreationMode.MANUAL) {
            /*
            *If SubConnector is already Manually exposed from client Area
            */
            subConnections = { clientIds: [clientSubConnector.id], serverIds: [] };
            /*
            *Update SubConnector Data
            */
            clientSubConnector.creationMode = SubConnectorCreationMode.MANUALONLINE;
            const endPointDetails = this.facadeService.dataService.getConnectionEndPointDetails((inputAnchor).deviceId, inputAnchor.automationComponentId,
                (inputAnchor).interfaceData.id);
            if (endPointDetails) {
                const status = endPointDetails.status?.value;
                const relatedEndPoint = getRelatedEndPointData(endPointDetails.relatedEndpoints?.value, '', '');
                this.facadeService.drawService.updateAndStyleConnector(clientSubConnector, status, relatedEndPoint);
            }
            this.facadeService.subConnectorService.updateSubConenctor(clientSubConnector);
            if (clientSubConnectionId === inputAnchor.connectors[0].id) {
                inputAnchor.connectors[0] = clientSubConnector;
            }

            /*
            *
            *Update client OPCNode Data
            */
            const inputOPCNode = this.facadeService.editorService.getOPCNode(inputAnchor.automationComponentId)
                || this.facadeService.editorService.getOPCArea(inputAnchor.parentNode.id);
            const existingAnchorIndex = inputOPCNode.inputs.findIndex(ip => ip.interfaceData.type === inputAnchor.interfaceData.type);
            inputOPCNode.inputs[existingAnchorIndex] = inputAnchor;
            this.facadeService.editorService.updateHTMLNode(inputOPCNode);

            /*
            *
            *find area Id upto which manual exposed connection exists
            */
            const startAreaIdForOnlineExpose = this.checkManualExposedConnectionUptoCommonParent(sourceAreaHierarchy,
                commonParent, inputAnchor.interfaceData.id, InterfaceCategory.CLIENT);
            if (startAreaIdForOnlineExpose) {
                /*
                *
                *Expose Connection in Online upto Common Parent From startAreaIdForOnlineExpose
                */
                sidePanelinterfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(inputAnchor.automationComponentId, outputNode.id,
                    inputAnchor.interfaceData.type, inputAnchor.interfaceData.id, serverInterface.id, SubConnectorCreationMode.ONLINE,
                    SubConnectorCreationMode.MANUALONLINE); //??
                const clientInterfaceDetails = getclientInterfaceDetails(sidePanelinterfaceDetails);
                subConnections = this.areaUtilityService.updateExposedInterfaceUptoTargetArea(startAreaIdForOnlineExpose, inputAnchor.parentNode.id,
                    clientInterfaceDetails, startAreaIdForOnlineExpose, commonParent);
            }
        }
        if (!clientSubConnector) {
            /*
            *Expose client subconnctor upto Common Parent
            */
            const clientInterfaceDetails = getclientInterfaceDetails(sidePanelinterfaceDetails);
            subConnections = this.areaUtilityService.updateExposedInterfaceUptoTargetArea(sourceNodeParent, inputAnchor.parentNode.id,
                clientInterfaceDetails, sourceNodeParent, commonParent);
        }

        /*
        *
        *Create Server subConnection in online mode
        */

        const outputNodeId = targetAreaHierarchy[targetAreaHierarchy.length - 1];
        let serverSubconnectionIds: SubConnectionIdList;

        const serverNodeAreaData = { ...this.facadeService.dataService.getArea(connectionOut) };
        const serverSidePanelData = serverNodeAreaData.serverInterfaceIds?.find(inf => inf.interfaceId === serverInterface.id);
        if (!serverSidePanelData) {
            /*
            *
            *If server interface is not exposed from server Area
            */
            sidePanelinterfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(inputAnchor.automationComponentId, outputNode.id,
                inputAnchor.interfaceData.type, inputAnchor.interfaceData.id, serverInterface.id,
                (inputAnchor.interfaceData as AreaInterface).interfaceExposedMode, SubConnectorCreationMode.ONLINE);
            const serverInterfaceDetails = getserverInterfaceDetails(sidePanelinterfaceDetails);
            serverSubconnectionIds =
                this.areaUtilityService.updateExposedInterfaceUptoTargetArea(
                    outputNodeId,
                    outputNode.id,
                    serverInterfaceDetails,
                    outputNodeId,
                    commonParent);
        }
        else {
            /*
            *
            *If server interface is already exposed from server Area
            */
            if (serverSidePanelData.interfaceExposedMode !== SubConnectorCreationMode.ONLINE) {
                serverSubconnectionIds = this.getSubConnectionIdList(serverInterface.type, false);
                this.areaUtilityService.updateInterfaceExposedMode(serverNodeAreaData.id, serverInterface.type,
                    serverSidePanelData, serverSidePanelData.interfaceExposedMode, SubConnectorCreationMode.MANUALONLINE, 'update');
            }
        }
        subConnections.serverIds = serverSubconnectionIds.serverIds;
        this.updateSubConnectionToManualOfflineForOuterAreas(sourceAreaHierarchy, commonParent, inputAnchor.interfaceData.id, true);
        this.updateSubConnectionToManualOfflineForOuterAreas(targetAreaHierarchy, commonParent, serverInterface.id, false);
         
        const sourceDeviceId = sidePanelinterfaceDetails.clientInterfaceId.deviceId;
        const targetDeviceId = sidePanelinterfaceDetails.serverInterfaceId.deviceId;
        const clientInterfaceId = sidePanelinterfaceDetails.clientInterfaceId.interfaceId;
        const serverInterfaceId = sidePanelinterfaceDetails.serverInterfaceId.interfaceId;
        const sourceAcId = sidePanelinterfaceDetails.clientInterfaceId.automationComponentId;
        const targetAcId = sidePanelinterfaceDetails.serverInterfaceId.automationComponentId;
        const type = inputAnchor.interfaceData.type;

        this.createConnectionAndAddOrUpdateConnection({
            ...param, sourceDeviceId, targetDeviceId,
            clientInterfaceId, serverInterfaceId, sourceAcId, targetAcId, type
        },
            ConnectorCreationMode.ONLINE, subConnections);
        this.updateNotificationDetails(sidePanelinterfaceDetails, serverInterface, inputAnchor);
    }

    //Create online connections from parent editor with nodeanchor
    protected createOnlineConnectionsFromParentEditorWtAnchor(inputAnchor: NodeAnchor, outputNode: Node, serverInterface: OpcInterface, param): NodeAnchor {
        return this.createOnlineConnectionFromParentEditor(inputAnchor.interfaceData, outputNode, serverInterface, param);
    }

      //Create online connections from parent editor without nodeanchor. Multisession scenarios - if nodeanchor not available
    protected createOnlineConnectionsFromParentEditorWoAnchor(interfaceData:ClientInterface|AreaInterface, serverInterface: OpcInterface, param){
        return this.createOnlineConnectionFromParent(interfaceData, serverInterface, param);
    }

    /**
     *Create online connection from parent editor with nodeanchor 
     */
    private createOnlineConnectionFromParentEditor(interfaceData:AreaInterface|ClientInterface, outputNode: Node, serverInterface: OpcInterface, param){
        const { sourceAreaHierarchy, targetAreaHierarchy, commonParent, connectionOut,parentNode } = param;
        const serverNodeAreaData: PlantArea = this.facadeService.editorService.liveLinkEditor.editorNodes
            .find(item => item.type === FillingLineNodeType.AREA && item.id === connectionOut) as PlantArea;

        const subConnections: SubConnectionIdList = this.getSubConnectionIdList(interfaceData.type, true);

        if (outputNode && serverNodeAreaData) {
            const clientInterface: AreaInterface = interfaceData as AreaInterface;
            /*
            *
            *If serverNodeAreaData is present redraw it.
            */
            let outputAnchor = serverNodeAreaData.outputs?.find(anchor => anchor?.interfaceData.type === interfaceData.type);
            let sidePanelData: ISidePanel;
            let serverSubconnectionIds: SubConnectionIdList;
            if (!outputAnchor) {
                /*
                *
                *If server interface is not exposed from the Area expose it and redraw parent area.
                */
                const sidePanelinterfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(
                    clientInterface.automationComponentId,
                    outputNode.id,
                    interfaceData.type,
                    interfaceData.id, serverInterface.id,
                    getIntefaceExposeModeInOnline(clientInterface),
                    SubConnectorCreationMode.ONLINE);
                const serverInterfaceDetails = getserverInterfaceDetails(sidePanelinterfaceDetails);
                sidePanelData = sidePanelinterfaceDetails.serverInterfaceId;

                /*
                *
                *Handle scenario for partial exposed server Connections
                */
                serverSubconnectionIds = this.updateSubconnectionModeAndGetSubConnId(targetAreaHierarchy,
                    commonParent,
                    sidePanelData,
                    serverInterfaceDetails, outputNode.id,InterfaceCategory.SERVER);
                this.facadeService.drawService.redrawAreaNode(serverNodeAreaData);
                outputAnchor = serverNodeAreaData.outputs?.find(anchor => anchor?.interfaceData.type === interfaceData.type);
            }
            else {
                sidePanelData = this.facadeService.dataService.getServerInterfaceIdDetailsById(serverNodeAreaData.id, outputAnchor.interfaceData.id);
                this.areaUtilityService.updateInterfaceExposedMode(serverNodeAreaData.id, serverInterface.type,
                    sidePanelData, sidePanelData.interfaceExposedMode, SubConnectorCreationMode.MANUALONLINE, 'update');

                serverSubconnectionIds = this.getSubConnectionIdList(serverInterface.type, false);
            }
            updateSubConnectionList(subConnections, serverSubconnectionIds);

            this.updateSubConnectionToManualOfflineForOuterAreas(sourceAreaHierarchy, commonParent, interfaceData.id, true);
            this.updateSubConnectionToManualOfflineForOuterAreas(targetAreaHierarchy, commonParent, serverInterface.id, false);

            if (outputAnchor) {
                /*
                *Update subConnections object with connectionId
                */
                const ConnectionId = getConnectionID(parentNode, outputAnchor.parentNode.id, outputAnchor.interfaceData.type);
                this.facadeService.subConnectorService.updateSubConnectionsWithConnectionId(ConnectionId, subConnections);
                return outputAnchor;
            }
        }
        return null;
    }

    /**
     * Multisession scenario - Connection is created from inside client area and go to root.
     * Another browser remove the connection
     * and establish again.Connection line should redraw.
     * this method will create connection if anchors not available in editor.
     * But event will trigger for connection.
     * If any subconnection already exposed then will update creation mode with Manual online.
     */
    private createOnlineConnectionFromParent(interfaceData:AreaInterface|ClientInterface, serverInterface: OpcInterface, params) {
        let sidePanelData: ISidePanel;
        const {  sourceAcId, targetAcId, commonParent,
           targetAreaHierarchy, sourceAreaHierarchy, connectionOut, connectionIn } = params;
        let subConnections = { clientIds: [], serverIds: [] };
        const serverNodeAreaData: PlantArea = this.facadeService.editorService.liveLinkEditor.editorNodes
            .find(item => item.type === FillingLineNodeType.AREA && item.id === connectionOut) as PlantArea;
        const clientNodeAreaData: PlantArea = this.facadeService.editorService.liveLinkEditor.editorNodes
            .find(item => item.type === FillingLineNodeType.AREA && item.id === connectionIn) as PlantArea;
        const clientInterface = interfaceData as AreaInterface;
        const sidePanelinterfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(
            sourceAcId,
            targetAcId,
            interfaceData.type,
            interfaceData.id, serverInterface.id,
            getIntefaceExposeModeInOnline(clientInterface),
            SubConnectorCreationMode.ONLINE);
        if (serverNodeAreaData) {
            const outputAnchor = serverNodeAreaData.outputs?.find(anchor => anchor?.interfaceData.type === interfaceData.type);
            if (!outputAnchor) {
                const serverInterfaceDetails = getserverInterfaceDetails(sidePanelinterfaceDetails);
                sidePanelData = sidePanelinterfaceDetails.serverInterfaceId;
                /*
                *
                *Handle scenario for partial exposed server Connections
                */
                subConnections = this.updateSubconnectionModeAndGetSubConnId(targetAreaHierarchy,
                    commonParent,
                    sidePanelData,
                    serverInterfaceDetails, targetAcId, InterfaceCategory.SERVER);
            }
            else {
                sidePanelData = this.facadeService.dataService.getServerInterfaceIdDetailsById(serverNodeAreaData.id, outputAnchor.interfaceData.id);
                this.areaUtilityService.updateInterfaceExposedMode(serverNodeAreaData.id, serverInterface.type,
                    sidePanelData, sidePanelData.interfaceExposedMode, SubConnectorCreationMode.MANUALONLINE, 'update');
                subConnections = this.getSubConnectionIdList(serverInterface.type, false);
                this.updateSubConnectionToManualOfflineForOuterAreas(sourceAreaHierarchy, commonParent, interfaceData.id, true);
                this.updateSubConnectionToManualOfflineForOuterAreas(targetAreaHierarchy, commonParent, serverInterface.id, false);
            }
        }
        if (clientNodeAreaData) {
            const inputAnchor = clientNodeAreaData.inputs?.find(anchor => anchor?.interfaceData.type === interfaceData.type);
            if (inputAnchor) {
                sidePanelData = this.facadeService.dataService.getClientInterfaceIdDetailsById(clientNodeAreaData.id, inputAnchor.interfaceData.id);
                this.areaUtilityService.updateInterfaceExposedMode(clientNodeAreaData.id, interfaceData.type,
                    sidePanelData, sidePanelData.interfaceExposedMode, SubConnectorCreationMode.MANUALONLINE, 'update');
                const clientSubconnection = this.getSubConnectionIdList(interfaceData.type, true);
                subConnections.clientIds = clientSubconnection.clientIds;
                clientSubconnection.clientIds.forEach(id => {
                    const subConnection = this.facadeService.dataService.getSubConnection(id);
                    if (subConnection.creationMode === SubConnectorCreationMode.MANUAL) {
                        subConnection.creationMode = SubConnectorCreationMode.MANUALONLINE;
                        this.facadeService.dataService.updateAreaInterfaceExposedMode(subConnection.areaId,
                            subConnection.id, subConnection.isclient, SubConnectorCreationMode.MANUALONLINE);
                        this.facadeService.dataService.addOrUpdateSubConnection(subConnection);
                    }

                });
                this.updateSubConnectionToManualOfflineForOuterAreas(sourceAreaHierarchy, commonParent, interfaceData.id, true);
                this.updateSubConnectionToManualOfflineForOuterAreas(targetAreaHierarchy, commonParent, serverInterface.id, false);
            } else {
                const clientInterfaceDetails = getclientInterfaceDetails(sidePanelinterfaceDetails);
                sidePanelData = clientInterfaceDetails.interfaceId;

                /*
                *
                *Handle scenario for partial exposed server Connections
                */
                const clientSubconnection = this.updateSubconnectionModeAndGetSubConnId(sourceAreaHierarchy,
                    commonParent,
                    sidePanelData,
                    clientInterfaceDetails, sourceAcId, InterfaceCategory.CLIENT);
                subConnections.clientIds = clientSubconnection.clientIds;

            }
        }
        this.createConnectionAndAddOrUpdateConnection(params,ConnectorCreationMode.ONLINE,subConnections);
        this.facadeService.drawService.drawArea();
    }

    /**
     * Handle scenario for partial exposed server Connections and return the subconnectionIds
     */
    private updateSubconnectionModeAndGetSubConnId(targetAreaHierarchy: string[], commonParent: string,
        sidePanelData: ISidePanel,
        interfaceDetails: InterfaceDetails,
        sourceOrTargetAcId: string,
        interfaceCategory: InterfaceCategory) {
        let outputNodeId = targetAreaHierarchy[targetAreaHierarchy.length - 1];
        /*
        *
        *Handle scenario for partial exposed server Connections
        */
        const startAreaIdForOnlineExpose = this.checkManualExposedConnectionUptoCommonParent(targetAreaHierarchy, commonParent,
            interfaceDetails.interface.id, interfaceCategory);
        if (startAreaIdForOnlineExpose) {
            outputNodeId = startAreaIdForOnlineExpose;
        }
        const notExposedIndex = targetAreaHierarchy.indexOf(startAreaIdForOnlineExpose);
        const exposedConnectionAreaList: string[] = targetAreaHierarchy.splice(notExposedIndex + 1, targetAreaHierarchy.length - 1);
        for (const area of exposedConnectionAreaList) {
            this.areaUtilityService.updateInterfaceExposedMode(area, interfaceDetails.type, sidePanelData,
                sidePanelData.interfaceExposedMode, SubConnectorCreationMode.ONLINE, 'update');
        }

        return this.areaUtilityService.updateExposedInterfaceUptoTargetArea(outputNodeId, sourceOrTargetAcId,
            interfaceDetails, outputNodeId, commonParent);
    }
  
    /*
    *
    * Update notification details
    */
    private updateNotificationDetails(sidePanelinterfaceDetails: SidePanelInterfaceDetails, serverInterface: OpcInterface, inputAnchor: NodeAnchor) {
        const serverDeviceName = this.facadeService.dataService.getDevice(sidePanelinterfaceDetails.clientInterfaceId.deviceId).name;
        const clientDeviceName = this.facadeService.dataService.getDevice(sidePanelinterfaceDetails.clientInterfaceId.deviceId).name;
        const serverInterfaceName = serverInterface.name;
        const clientInterfaceName = inputAnchor.interfaceData.name;
        const message = {
            key: 'notification.info.connectionOnlineNotInProject',
            param: {
                serverDeviceName: serverDeviceName,
                serverInterfaceName: serverInterfaceName,
                clientDeviceName: clientDeviceName,
                clientInterfaceName: clientInterfaceName
            }
        };
        this.facadeService.notificationService.pushNotificationToPopup({ content: message.key, params: message.param }, NotificationType.INFO, HTTPStatus.SUCCESS);
    }
    /*
    *
    *  Get sub connection id list
    */
    private getSubConnectionIdList(interfaceType: string, isClient: boolean): SubConnectionIdList {
        const subConnections: SubConnectionIdList = { clientIds: [], serverIds: [] };
        const subConnectionList = this.facadeService.dataService.getSubConnectionsByCategoryAndInterfaceType(interfaceType, isClient);
        if (subConnectionList && subConnectionList.length > 0) {
            const subConnectionIs = subConnectionList.map(subConnection => subConnection.id);
            if (isClient) {
                subConnections.clientIds = subConnectionIs;
            }
            else {
                subConnections.serverIds = subConnectionIs;
            }
        }
        return subConnections;
    }
    /*
    *
    *  Update sub connection to offline for outer areas
    */
    private updateSubConnectionToManualOfflineForOuterAreas(areaHierarchy: string[], commonParent: string, interfaceId: string, isClient: boolean) {
        const commonParentIndex = areaHierarchy.findIndex(id => id === commonParent);
        const outerAreaListFromCommonParent = [...areaHierarchy].splice(1, commonParentIndex);//since root is not an area
        const outerAreaListFromCommonParentReverse = [...outerAreaListFromCommonParent].reverse();
        for (const areaId of outerAreaListFromCommonParentReverse) {
            const subConnections = [...this.facadeService.dataService.getAreaSubConnectionsByCategory(areaId, isClient)];
            for (const subCon of subConnections) {
                const subConnectionData = getSubConnectionDetails(subCon);
                if (subConnectionData && subConnectionData.interfaceId === interfaceId) {
                    this.removeSubConnectorFromLookup(subCon.id);
                    subCon.creationMode = SubConnectorCreationMode.MANUALOFFLINE;
                    this.facadeService.dataService.addOrUpdateSubConnection(subCon);
                    const sidePanelData = this.getSidePanelData(subCon, areaId, interfaceId);
                    this.areaUtilityService.updateInterfaceExposedMode(areaId, subConnectionData.interfaceType,
                        sidePanelData, sidePanelData.interfaceExposedMode, SubConnectorCreationMode.MANUALOFFLINE, 'remove');
                }
            }
        }
    }
    /*
    * Remove sub connector from lookup
    *
    */
    private removeSubConnectorFromLookup(subConnectorId: string) {
        const subConnector: SubConnector = this.facadeService.editorService.getExistingSubConnectorById(subConnectorId);
        if (subConnector) {
            subConnector.creationMode = SubConnectorCreationMode.MANUALOFFLINE;
            this.facadeService.subConnectorService.removeOnlyFromLookup(subConnector);
        }
    }
    /*
    * Get side panel data
    *
    */
    private getSidePanelData(subCon: SubConnection, areaId: string, interfaceId: string) {
        let sidePanelData;
        if (subCon.isclient) {
            sidePanelData = this.facadeService.dataService.getClientInterfaceIdDetailsById(areaId, interfaceId);
        }
        else {
            sidePanelData = this.facadeService.dataService.getServerInterfaceIdDetailsById(areaId, interfaceId);
        }
        return sidePanelData;
    }
    /*
    * Check manual exposed connection upto common parent
    *
    *
    */
    private checkManualExposedConnectionUptoCommonParent(areaHierarchy: string[], commonParent: string, interfaceId: string, type: InterfaceCategory) {
        const commonParentIndex = areaHierarchy.findIndex(id => id === commonParent);
        const areaListUptoCommonParent = [...areaHierarchy].splice(commonParentIndex, areaHierarchy.length);
        const areaListUptoCommonParentReverse = [...areaListUptoCommonParent].reverse();
        let onlineExposeArea: string;
        for (const areaId of areaListUptoCommonParentReverse) {
            if (areaId !== ROOT_EDITOR) {
                const areaData = this.facadeService.dataService.getArea(areaId);
                let interfaces = areaData?.serverInterfaceIds;
                if (type === InterfaceCategory.CLIENT) {
                    interfaces = areaData?.clientInterfaceIds;
                }
                if (interfaces && !interfaces.find(inf => inf.interfaceId === interfaceId)) {
                    onlineExposeArea = areaData.id;
                    break;
                }
            }
        }
        return onlineExposeArea;
    }

    createConnectionAndAddOrUpdateConnection(params,creationMode:ConnectorCreationMode,subConnections:{ clientIds: string[], serverIds: string[] }){

        const { type, sourceAcId, targetAcId,commonParent,clientInterfaceId, serverInterfaceId } = params;
        const connectionObjectDetails: ConnectionObjectDetails = {
            soureDeviceId: params.sourceDeviceId,
            targetDeviceId: params.targetDeviceId,
            connectionIn: params.connectionIn,
            connectionOut: params.connectionOut,
            clientInterfaceId: clientInterfaceId,
            serverInterfaceId: serverInterfaceId,
            commonParent: commonParent,
            creationMode: creationMode,
            type: type,
            clientAcId: sourceAcId,
            serverAcId: targetAcId,
            subConnection:subConnections
        };
        const connectionObj = createConnectionObject(connectionObjectDetails);
        this.facadeService.subConnectorService.updateSubConnectionsWithConnectionId(connectionObj.id, subConnections);
        this.facadeService.dataService.addOrUpdateConnection(connectionObj);
        this.addCreateConnectionNotification(params.connectionIn, params.connectionOut, params.sourceAcId,params.targetAcId);

    }

}
/*
*
* Update connections in and out
*
*/
const updateConnectionInOrOut = (connectionInOrOut: string, id: string) => {
    const connObj = connectionInOrOut.split('__');
    connObj[1] = id;
    return connObj.join('__');
};

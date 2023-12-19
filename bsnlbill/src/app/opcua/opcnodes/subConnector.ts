/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import {
  Angle, ConnectorCreationMode, ConnectorType, InterfaceCategory,
  Numeric, Quadrant, SubConnectorCreationMode,
  interfaceGridViewType
} from '../../enum/enum';
import { Connection, InterfaceDetails, SubConnectionIdList, SubConnectionPayload } from '../../models/connection.interface';
import { AreaInterfacePayload, LiveLink } from '../../models/models';
import { AreaClientInterface, ISidePanel, SvgPoints } from '../../models/targetmodel.interface';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { DEFAULT_CONNECTION_LENGTH } from '../../utility/constant';
import { getSubConnection, getSubConnectionID, getSubConnectionObject, isNullOrEmpty } from '../../utility/utility';
import { select } from '../../vendors/d3.module';
import { NodeAnchor } from '../opcnodes/node-anchor';
import { PlantArea } from './area';
import { BaseConnector, BaseConnectorService } from './baseConnector';

export class SubConnector extends BaseConnector {
    viewTypeFromArea: interfaceGridViewType = interfaceGridViewType.COLLAPSED;
    svgGlobal: SvgPoints;
    type: ConnectorType = ConnectorType.SUBCONNECTOR;
    connectionId: string;
    creationMode: SubConnectorCreationMode = SubConnectorCreationMode.MANUAL;
    //arrowStyeId: string;
    deviceId: string;

    constructor(editor: LiveLink, creationMode: SubConnectorCreationMode, areaId: string, id: string, svgGlobal?: SvgPoints) {
        super(editor, creationMode, areaId, id);
        this.creationMode = creationMode;
        if (svgGlobal) {
            this.svgGlobal = svgGlobal;
        }
    }
    /*
    * Update handle
    *
    */
    updateHandle(anchor: NodeAnchor, viewType?: interfaceGridViewType, svgGlobal?: SvgPoints) {
        if (svgGlobal) {
            this.svgGlobal = svgGlobal;
        }
        if (viewType) {
            this.viewTypeFromArea = viewType;
        }
        this.updateCirclePosition(anchor, viewType, svgGlobal);
        this.updatePath();
    }
    /*
    * update circle position
    *
    */
    updateCirclePosition(anchor: NodeAnchor, viewType?: interfaceGridViewType, svgGlobal?: SvgPoints) {
        const connectorElem = anchor?.connectors[0]?.element;

        if (anchor === this.inputAnchor && svgGlobal) {
            if (viewType === interfaceGridViewType.COLLAPSED) {
                this.appendArrowOnCollapse(connectorElem, anchor.id);
            } else {
                anchor.connectors[0]?.inputCircle?.remove();
                select(this.inputCircle)
                    .attr('cx', svgGlobal.x)
                    .attr('cy', svgGlobal.y);
                this.inputCircle.x = svgGlobal.x;
                this.inputCircle.y = svgGlobal.y;
            }

        } else if (anchor === this.outputAnchor && svgGlobal) {
            if (viewType === interfaceGridViewType.COLLAPSED) {
                anchor.connectors[0]?.outputCircle?.remove();
                this.appendArrowOnCollapse(connectorElem, anchor.id);
                select(this.outputCircle)
                    .attr('cy', this.inputAnchor?.global?.y);
            } else {
                select(this.outputCircle)
                .attr('cx', svgGlobal.x)
                .attr('cy', svgGlobal.y);
            }

            this.outputCircle.x = svgGlobal.x;
            this.outputCircle.y = svgGlobal.y;
        }
        else {
            super.updateCirclePosition(anchor);
        }

    }

    /*
    * Append arrow on collapse
    *
    */
    appendArrowOnCollapse(connectorElem: SVGElement, id: string) {
        const attrId = `#head_${id}`;
        select(attrId).remove();
        select(connectorElem).append('marker')
            .attr('orient', 'auto')
            .attr('markerWidth', Numeric.THREE)
            .attr('markerHeight', Numeric.FOUR)
            .attr('refX', Numeric.ZEROPOINTONE)
            .attr('refY', Numeric.TWO)
            .attr('id', `head_${id}`);
        select(attrId).append('path')
            .attr('d', 'M0,0 V4 L2,2 Z');
        this.arrowStyeId =attrId;
        this.path.setAttribute('marker-end', `url(${attrId})`);
        this.setArrowStyle();
    }
    /*
    * Set connection id
    *
    */
    setConnectionId() {
        let acId = this.inputAnchor.parentNode.id;
        if (this.isInput) {
            acId = this.outputAnchor.parentNode.id;
        }
        this.id = getSubConnectionID(acId, this.inputAnchor.interfaceData.type, this.inputAnchor.interfaceData.id);
    }
    /*
    * Set device id
    *
    */
    setDeviceId() {
        if (this.isInput) {
            this.deviceId = this.outputAnchor.deviceId;
        }
        else {
            this.deviceId = this.inputAnchor.deviceId;
        }
    }
    /*
    * Set default anchor style for sub connector
    *
    */
    setDefaultAnchorStyleForSubconnector() {
        if (this.outputAnchor && this.inputAnchor) {
            this.inputAnchor.setAnchorDefaultStyle(false);
            this.outputAnchor.setAnchorDefaultStyle(true);
        }
    }
    /*
    * Reset anchor style for sub connector
    *
    */
    resetAnchorStyleForSubConnector() {
        if (this.outputAnchor && this.inputAnchor) {
            this.inputAnchor.resetInPutAnchorStyleInverse();
            this.outputAnchor.resetOutPutAnchorStyleInverse();
        }
    }
    /*
    * Get source anchor
    *
    */
    getSourceAnchor(): NodeAnchor {
        let sourceAnchor: NodeAnchor;
        const nodes = this.editor.editorNodes.filter(nodeElement => nodeElement.parent === this.areaId);
        const isClientInterface = this.targetAnchor.interfaceData.isClientInterface;
        for (const node of nodes) {
            if (isClientInterface) {
                sourceAnchor = node.inputs.find(anchor => anchor.interfaceData.id === this.inputAnchor?.interfaceData?.id);
            } else {
                sourceAnchor = node.outputs.find(anchor => anchor.interfaceData.id === this.outputAnchor?.interfaceData?.id);
            }
            if (sourceAnchor) {
                break;
            }
        }
        return sourceAnchor;
    }

    /* appendArrowOnCollapse(connectorElem: SVGElement, id: string) {
        const attrId = `#head_${id}`;
        select(`#head`).remove();
        select(connectorElem).append('marker')
            .attr('orient', 'auto')
            .attr('markerWidth', Numeric.THREE)
            .attr('markerHeight', Numeric.FOUR)
            .attr('refX', 0.1)
            .attr('refY', Numeric.TWO)
            .attr('id', `head_${id}`);
        select(attrId).append('path')
            .attr('d', 'M0,0 V4 L2,2 Z');
        //.attr('fill', 'black');
        this.setArrowStyle();
        this.arrowStyeId = attrId;
        this.path.setAttribute('marker-end', `url(${attrId})`);
    }

    setArrowStyle() {
        const id = this.arrowStyeId;
        switch (this.state) {
            case ConnectorState.Error:
                select(id).attr('fill', subConnectorStyleAttributes.ERROR);
                break;
            case ConnectorState.Success:
                select(id).attr('fill', subConnectorStyleAttributes.SUCCESS);
                break;
            case ConnectorState.Online:
                select(id).attr('fill', subConnectorStyleAttributes.ONLINE);
                break;
            case ConnectorState.NonExistent:
                select(id).attr('fill', subConnectorStyleAttributes.TRANSPARENT);
                break;
            case ConnectorState.Default:
            default:
                select(id).attr('fill', subConnectorStyleAttributes.DEFAULT);
                break;
        }
    } */
    /*
    * Set online style
    *
    */
    setOnlineStyle() {
        super.setOnlineStyle();
        this.setArrowStyle();
    }
    /*
    * Set default style
    *
    */
    setDefaultStyle() {
        super.setDefaultStyle();
        this.setArrowStyle();
    }
    //#region Connector Path and Curve Related Functions
    /*
    *
    * Build curve string
    */
    buildCurveString() {
        const [pt1, pt2, pt3, pt4] = this.plotPoints;
        switch (this.quadrant) {
            case Quadrant.SIXTH: {
                const ly = pt3.y - pt2.y;
                this.curve = `M${pt1.x},${pt1.y} L${pt2.x},${pt2.y} l0,${ly} L${pt4.x},${pt4.y}`;
                break;
            }
            case Quadrant.FIFTH: {
                const ly = pt4.y - pt1.y;
                this.curve = `M${pt1.x},${pt1.y} L${pt2.x},${pt2.y} l0,${ly} L${pt4.x},${pt4.y}`;
                break;
            }
            case Quadrant.EIGHTH:
                this.curve = `M${pt1.x},${pt1.y}, l${Numeric.ZERO},${Numeric.ZERO} ${Numeric.FIFTY},${Numeric.ZERO}`;
                break;
            case Quadrant.SEVENTH: {
                const [ptq1] = this.plotPoints;
                this.curve = `M${ptq1.x},${ptq1.y} l${Numeric.ZERO},${Numeric.ZERO} l-${Numeric.FIFTY},${Numeric.ZERO}`;
                break;
            }

            default: {
                this.curve = ``;
                break;
            }
        }
    }
    /*
    * modify curve points
    *
    */
    modifyCurvePts() {
        this.setQuardantValue();
        this.inLength = this.inLength || DEFAULT_CONNECTION_LENGTH;
        this.outLength = this.outLength || DEFAULT_CONNECTION_LENGTH;
        switch (this.quadrant) {
            case Quadrant.FIFTH:
                this.setFifthPt();
                break;
            case Quadrant.SIXTH:
                this.setSixthPt();
                break;
            case Quadrant.EIGHTH:
                this.setEighthPt();
                break;
            case Quadrant.SEVENTH:
                this.setSeventhPt();
                break;
            default:
                return;
        }
    }
    /*
    * Set quadrant value
    *
    */
    private setQuardantValue() {
        if (this.inputAnchor?.interfaceData.isClientInterface) {
            if (this.viewTypeFromArea === interfaceGridViewType.COLLAPSED) {
                this.quadrant = 7;
            } else {
                this.quadrant = 5;
            }

        } else {
            if (this.viewTypeFromArea === interfaceGridViewType.COLLAPSED) {
                this.quadrant = 8;
            } else {
                this.quadrant = 6;
            }
        }
    }
    /*
    * Set seventh point
    *
    */
    setSeventhPt() {
        const pt1s = {
            x: this.outputCircle.x,
            y: this.outputCircle.y
        };
        this.plotPoints = [pt1s];
    }
    /*
    * Set eight point
    *
    */
    setEighthPt() {
        const pt1s = {
            x: this.inputCircle.x,
            y: this.inputCircle.y
        };
        this.plotPoints = [pt1s];
    }

    /*
    * Set fifth point
    *
    */
    private setFifthPt() {
        const inclinedAngle = this.angle * (Math.PI / Angle.STRAIGHTLINE_ANGLE);
        const pt1 = {
            x: this.inputCircle.x,
            y: this.inputCircle.y
        };
        const pt4 = {
            x: this.outputCircle.x,
            y: this.outputCircle.y
        };
        let pt3 = {
            x: this.inputCircle.x,
            y: this.inputCircle.y + this.outLength * Math.sin(inclinedAngle)
        };

        const pt2 = {
            x: this.inputCircle.x + this.inputCircle.y,
            y: this.inputCircle.y
        };
        if (this.inputAnchor && this.inputAnchor.connectors.length === 1) {
            pt3 = {
                x: this.inputCircle.x - this.inLength,
                y: this.inputCircle.y
            };
        }
        this.plotPoints = [pt1, pt2, pt3, pt4];
    }
    /*
    * Set sixth point
    *
    */
    private setSixthPt() {
        const inclinedAngle = this.angle * (Math.PI / Angle.STRAIGHTLINE_ANGLE);
        const pt1 = {
            x: this.outputCircle.x,
            y: this.outputCircle.y
        };
        const pt2 = {
            x: this.outputCircle.x - this.outputCircle.y,
            y: this.outputCircle.y
        };


        let pt3 = {
            x: this.inputCircle.x - this.inLength,
            y: this.inputCircle.y - (this.inLength * Math.sin(inclinedAngle))
        };

        const pt4 = {
            x: this.inputCircle.x,
            y: this.inputCircle.y
        };

        if (this.inputAnchor && this.inputAnchor.connectors.length === 1) {
            pt3 = {
                x: this.inputCircle.x,
                y: this.inputCircle.y
            };
        }

        this.plotPoints = [pt1, pt2, pt3, pt4];

    }
    /*
    * Set area id
    *
    */
    setAreaId(areaID: string) {
        this.areaId = areaID;
    }

    //#endregion

}

@Injectable({
    providedIn: 'root'
})
export class SubConnectorService extends BaseConnectorService {

    constructor( protected readonly facadeService: FacadeService
    ) {
        super(facadeService);
    }
    /*
    * Create sub connector
    *
    */
    createSubConnector(sourceAnchor: NodeAnchor, creationMode: SubConnectorCreationMode, areaId: string, id: string, targetAnchor?: NodeAnchor) {
        const subConnector: SubConnector = new SubConnector(this.facadeService.editorService.liveLinkEditor, creationMode, areaId, id);
        sourceAnchor.connectors[0] = subConnector;
        sourceAnchor.addConnector(subConnector);
        this.bindClickEvent(subConnector);
        subConnector.init(sourceAnchor);
        if (targetAnchor) {
            targetAnchor.connectors[0] = subConnector;
            subConnector.init(targetAnchor);
            targetAnchor.addConnector(subConnector);
        }
        this.facadeService.editorService.addtoLinkGroup(subConnector?.element);
        this.facadeService.editorService.updateHTMLNode(sourceAnchor?.parentNode);
        return subConnector;
    }
    /*
    * connect
    *
    */
    connect(subConnector: SubConnector, areaId?: string) {
        subConnector.setAreaId(areaId);
        const sourceAnchor: NodeAnchor = subConnector?.getSourceAnchor();
        if (sourceAnchor && !subConnector.isConnected) {
            sourceAnchor.setConnectedInterfaceStyle();
            //sourceAnchor signifies Anchor connected to ClientInterface
            this.placeHandle(sourceAnchor, subConnector);
            subConnector.setDefaultAnchorStyleForSubconnector();
            if (!subConnector.id) {
                subConnector.setConnectionId();
            }
            subConnector.setDeviceId();
            this.updateConenctorData(subConnector);
            this.updateSubConenctor(subConnector);
            this.facadeService.editorService.addtoLinkGroup(subConnector?.element);
            this.facadeService.editorService.updateHTMLNode(sourceAnchor?.parentNode);
        }

        if (!subConnector?.isConnected) {
            this.remove(subConnector);
        }
    }
    /*
    * update sub connector
    *
    */
    updateSubConenctor(subConnector: SubConnector) {
        this.facadeService.editorService.addOrUpdateToSubConnectorLookup(subConnector);
        this.facadeService.dataService.addOrUpdateSubConnection(getSubConnectionObject(subConnector));
    }
    /*
    *
    * update connector data
    */
    updateConenctorData(subConnector: SubConnector) {
        const serverSubconnectionId: string[] = [];
        const clientSubconnectionId: string[] = [];
        if (subConnector && isNullOrEmpty(subConnector.connectionId)) {
            let interfaceType = '';
            if (subConnector.isInput) {
                interfaceType = subConnector.outputAnchor.interfaceData.type;
                serverSubconnectionId[0] = subConnector.id;
            }
            else {
                interfaceType = subConnector.inputAnchor.interfaceData.type;
                clientSubconnectionId[0] = subConnector.id;
            }
            const connection = this.facadeService.dataService.getAllConnections()?.find(con => con.id.includes(interfaceType));
           this.updateConnectorDataOnline(connection,subConnector,serverSubconnectionId,clientSubconnectionId);
        }
    }
    /*
    * update connection data
    *
    */
    updateConnectionData(connection:Connection,subConnector:SubConnector,serverSubconnectionId:string[],clientSubconnectionId:string[]){
        if (connection) {
            let isUpdated = false;
            subConnector.connectionId = connection?.id;
            connection.subConnections = connection.subConnections || { clientIds: [], serverIds: [] };
            const index1 = connection.subConnections.clientIds.indexOf(serverSubconnectionId[0]);
            if (index1 === -1 && serverSubconnectionId.length > 0) {
                isUpdated = true;
                connection.subConnections.clientIds = connection.subConnections.clientIds.concat(serverSubconnectionId);
            }
            const index2 = connection.subConnections.serverIds.indexOf(clientSubconnectionId[0]);
            if (index2 === -1 && clientSubconnectionId.length > 0) {
                isUpdated = true;
                connection.subConnections.serverIds = connection.subConnections.serverIds.concat(clientSubconnectionId);
            }
            if (isUpdated)//index1 === -1 || index2 === -1)
            {
                this.facadeService.dataService.addOrUpdateConnection(connection);
            }
        }
    }
    /*
    * update connector data online
    *
    */
    updateConnectorDataOnline(connection:Connection,subConnector:SubConnector,serverSubconnectionId:string[],clientSubconnectionId:string[]){
        if(connection && connection.creationMode === ConnectorCreationMode.ONLINE &&
            subConnector.creationMode === SubConnectorCreationMode.ONLINE)
        {
            // Handling scenario for Orange Dotted line - Removed Connection from Online
            const endPointData = this.facadeService.dataService.getConnectionEndPointData(connection);
            if(endPointData && endPointData.status.value === false
                && endPointData.relatedEndpoints.value === '') // connector state - Non Existent
            {
                return;
            }
        }
        this.updateConnectionData(connection,subConnector,serverSubconnectionId,clientSubconnectionId);
    }
    /*
    * update handle
    *
    */
    updateHandle(subConnector: SubConnector, anchor: NodeAnchor, svgGlobal?: SvgPoints) {
        let viewType = this.facadeService.editorService.serverInterfaceGridViewType;
        if (subConnector.isInput) {
            viewType = this.facadeService.editorService.clientInterfaceGridViewType;
        }
        subConnector.updateHandle(anchor, viewType, svgGlobal);
        this.updateSubConenctor(subConnector);
    }
    /*
    * remove
    *
    */
    remove(connector: SubConnector) {
        super.remove(connector);
        connector.resetAnchorStyleForSubConnector();
        this.facadeService.editorService.removeFromSubConnectorLookup(connector.id);
        this.facadeService.dataService.deleteSubConnection(connector.id);
        this.facadeService.editorService.removeFromLinkGroup(connector.element);
    }
    /*
    *
    * remove only from lookup
    */
    removeOnlyFromLookup(connector: SubConnector) {
        super.remove(connector);
        connector.resetAnchorStyleForSubConnector();
        this.facadeService.editorService.removeFromSubConnectorLookup(connector.id);
        this.facadeService.editorService.removeFromLinkGroup(connector.element);
    }
    /*
    * delete exposed connections
    *
    */
    deleteExposedConnectionsDeleteNode(subConnectors: Array<SubConnector>) {
        for (const connector of subConnectors) {
            if (connector) {
                this.deleteSubConnectorAndUpdateArea(connector);
            }
        }
    }
    /*
    * Delete sub connector and update area
    *
    */
    deleteSubConnectorAndUpdateArea(subConnector: SubConnector) {
        const areaData = { ...this.facadeService.dataService.getArea(subConnector.areaId) };
        const areaDataCopy = { ...areaData };
        let payload:AreaInterfacePayload = {};
        if (subConnector.isInput) {
            const filteredNodeIds = areaDataCopy?.clientInterfaceIds?.filter(interfaceObj => interfaceObj.interfaceId !== subConnector.inputAnchor.interfaceData.name);
            areaData.clientInterfaceIds = filteredNodeIds;
            payload = { clientInterfaceIds: [...filteredNodeIds] };
            payload.clientInterfaces = this.facadeService.dataService.getClientInterfaceList(areaData)?.filter(interfaceObj =>
                interfaceObj.name !== subConnector.inputAnchor.interfaceData.name);
        } else {
            const filteredNodeIds = areaDataCopy?.serverInterfaceIds?.filter(interfaceObj => interfaceObj.interfaceId !== subConnector.outputAnchor.interfaceData.name);
            areaData.serverInterfaceIds = filteredNodeIds;
            payload = { serverInterfaceIds: [...filteredNodeIds] };
            payload.serverInterfaces = this.facadeService.dataService.getServerInterfaceList(areaData)?.filter(interfaceObj =>
                interfaceObj.name !== subConnector.outputAnchor.interfaceData.name);
        }
        this.facadeService.plantAreaService.updateArea(subConnector.areaId, payload);
        this.remove(subConnector);
    }
    /*
    * Remove sub connection from lookup by area id
    *
    */
    removeSubConnectionFromLookupByAreaId(areaId: string) {
        const projectData = { ...this.facadeService.dataService.getProjectData() };
        if (projectData?.editor?.subConnections?.length) {
            const subConnections = [...projectData?.editor?.subConnections];
            subConnections?.filter(con => con.areaId === areaId)?.map(subConnection => this.removeSubConnection(subConnection.id));
        }
    }
    /*
    * REmove sub connection
    *
    */
    removeSubConnection(subConnectionId: string) {
        const subConnector = this.facadeService.editorService.getExistingSubConnectorById(subConnectionId);
        if (subConnector) {
            this.remove(subConnector);
        }
        else
        {
            this.facadeService.dataService.deleteSubConnection(subConnectionId);
        }
    }
    /*
    * update sub connections with connection id
    *
    */
    updateSubConnectionsWithConnectionId(connectionId: string, subconenctionIds: SubConnectionIdList) {
        let subconenctions = subconenctionIds?.clientIds || [];
        subconenctions = subconenctions.concat(subconenctionIds?.serverIds || []);
        subconenctions.forEach(con => {
            const subconnection = { ...this.facadeService.dataService.getSubConnection(con) };
            if(subconnection)
            {
                const subConnector = this.facadeService.editorService.getExistingSubConnectorById(subconnection.id);
                if (subConnector) {
                    subConnector.connectionId = connectionId;
                    this.facadeService.editorService.addOrUpdateToSubConnectorLookup(subConnector);
                }
                subconnection.connectionId = connectionId;
                this.facadeService.dataService.updateSubConnection(subconnection);
            }
        });
    }
    /*
    *
    * update sub connector
    */
    updateSubConnector(interfaceDetails: InterfaceDetails, nodeIdForSubConnection: string, areaKey: string,
        subConnectionIds: SubConnectionIdList): InterfaceDetails {
        subConnectionIds = subConnectionIds || { clientIds: [], serverIds: [] } as SubConnectionIdList;
        const inf: AreaClientInterface = interfaceDetails.interface;
        const interfaceId = interfaceDetails.interfaceId.interfaceId;
        const interfaceType = inf.subConnectionId.split('__')[1];
        const subConnectionId = getSubConnectionID(nodeIdForSubConnection, interfaceType, interfaceId);
        const acData = this.facadeService.dataService.getAutomationComponent(inf.deviceId, inf.automationComponentId);
        const payload:SubConnectionPayload = {
            deviceId: inf.deviceId,
            acName: acData.name,
            acId: inf.automationComponentId,
            areaId: areaKey,
            isClientInterface: inf.isClientInterface,
            connectionId: '',
            interfaceExposedMode: inf.interfaceExposedMode,
            interfaceId,
            subConnectionId
        };
        const subConnection = getSubConnection(payload);
        const subConnector = this.facadeService.editorService.getExistingSubConnectorById(subConnectionId);
        if (subConnector) {
            this.facadeService.editorService.removeFromSubConnectorLookup(subConnector.id);
        }
        this.facadeService.dataService.addOrUpdateSubConnection(subConnection);
        inf.subConnectionId = subConnectionId;
        interfaceDetails.interface = inf;
        if (interfaceDetails.type === InterfaceCategory.CLIENT) {
            subConnectionIds.clientIds.push(subConnectionId);
        }
        if (interfaceDetails.type === InterfaceCategory.SERVER) {
            subConnectionIds.serverIds.push(subConnectionId);
        }
        interfaceDetails = updateInterfaceWithSubConnectionId(interfaceDetails);
        return interfaceDetails;
    }

  /**
   *
   *  get sidePanelData by interfaceId and areaId
   *  delete the subConnection
   *  delete interface from exposed panel
   *  finally update the area(with Removed side panel data)
   * @param {string} areaId
   * @param {ISidePanel} interfaceIdToRemove
   * @param {boolean} isClient
   * @memberof SubConnectorService
   */
  removeInterfaceAndSubConnectionByType(areaId: string, interfaceIdToRemove: ISidePanel, isClient: boolean) {
    let interfaceCategory = InterfaceCategory.SERVER;
    if (isClient) {
      interfaceCategory = InterfaceCategory.CLIENT;
    }
    const exposedSidePanelData = this.facadeService.dataService.removeInterfaceIdsFromArea(areaId,
      interfaceIdToRemove,
      interfaceCategory
    );

    if (exposedSidePanelData && exposedSidePanelData.subConnectionId) {
      this.removeSubConnection(exposedSidePanelData.subConnectionId);
    }

    const area = this.facadeService.dataService.getArea(areaId);
    const clientInterface = this.facadeService.dataService.getClientInterfaceList(area) || [];
    const serverInterface = this.facadeService.dataService.getServerInterfaceList(area) || [];
    const updatedArea = this.facadeService.editorService.liveLinkEditor?.editorNodes?.find(
      node => node.id === areaId
    ) as PlantArea;
    this.facadeService.plantAreaService.updateArea(
      areaId,
      {
        clientInterfaces: clientInterface,
        clientInterfaceIds: area.clientInterfaceIds,
        serverInterfaces: serverInterface,
        serverInterfaceIds: area.serverInterfaceIds
      },
      updatedArea
    );
  }
}
    /*
    * update interface with sub connection id
    *
    */
export const updateInterfaceWithSubConnectionId=(interfaceDetails: InterfaceDetails): InterfaceDetails =>{
    const clonedClientInterfaces = { ...interfaceDetails?.interfaceId };
    if (clonedClientInterfaces?.interfaceId) {
        clonedClientInterfaces.subConnectionId =
            interfaceDetails?.interface?.subConnectionId;
        interfaceDetails.interfaceId = clonedClientInterfaces;
    }
    return interfaceDetails;
};



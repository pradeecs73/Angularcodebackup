/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ConnectorCreationMode, InterfaceCategory, Numeric, StrategyList, SubConnectorCreationMode } from '../../enum/enum';
import { NodeAnchor } from '../../opcua/opcnodes/node-anchor';
import { getclientInterfaceDetails, getserverInterfaceDetails } from '../../utility/utility';
import { AreaOperationsStrategy } from './area-operations-strategy';

export class NestedSiblingsAreaStrategy extends AreaOperationsStrategy {
    /*
    *
    * Always returns nested siblings area stratergy
    */
    getClassName() {
        return StrategyList.NESTED_SIBLINGS_AREA_STRATEGY;
      }
    /*
    *
    * Reorder html node
    */
    reorderHTMLNode(params) {
        this.removeExposedConnectionAndRecreate(params);
        this.facadeService.drawService.drawArea();
    }

    /*
    *
    * Remove exposed connection and redraw the connections
    */
    removeExposedConnectionAndRecreate(params){
        const { commonParent,
            sourceAreaHierarchy,
            targetAreaHierarchy,
            connection,
            targetNodePrevParent,
            sourceNodePrevParent } = params;
        const [, , interfaceType] = connection?.id?.split('__');
        const [inNodeId, outNodeId] = connection?.acIds?.split('__');
        const sourceNodeParent = sourceAreaHierarchy[sourceAreaHierarchy.length - 1];
        const targetNodeParent = targetAreaHierarchy[targetAreaHierarchy.length - 1];
        const [clientInterfaceId, serverInterfaceId]  = [ connection.in.split('__')[Numeric.TWO] , connection.out.split('__')[Numeric.TWO] ];
        const interfaceDetails = this.facadeService.areaUtilityService.getExposeInterfaceDetails(inNodeId,
             outNodeId, interfaceType, clientInterfaceId, serverInterfaceId,SubConnectorCreationMode.MANUAL,
             SubConnectorCreationMode.MANUAL);

        this.facadeService.areaUtilityService.removeFromExposeConnectionsParentOrChild(sourceNodePrevParent,
            getclientInterfaceDetails(interfaceDetails),connection.areaId);

        const sourceSubConnectionIds = this.facadeService.areaUtilityService.updateExposedInterfaceUptoTargetArea(sourceNodeParent,
            inNodeId,getclientInterfaceDetails(interfaceDetails),sourceNodeParent, commonParent);

        this.facadeService.areaUtilityService.removeFromExposeConnectionsParentOrChild(targetNodePrevParent,
            getserverInterfaceDetails(interfaceDetails),connection.areaId);

        const targetSubConnectionIds = this.facadeService.areaUtilityService.updateExposedInterfaceUptoTargetArea(targetNodeParent, outNodeId,
            getserverInterfaceDetails(interfaceDetails),targetNodeParent, commonParent);
        this.updateConnectionObject({ ...params, sourceSubConnectionIds, targetSubConnectionIds });
    }
    /*
    *
    * Search the matching interface using connection search
    */
    connectionBySearch(params) {
        const { type, sourceAcId, targetAcId, commonParent, sourceParent, targetParent, clientInterfaceId, serverInterfaceId } = params;
        const interfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(sourceAcId,
             targetAcId, type, clientInterfaceId, serverInterfaceId,
              SubConnectorCreationMode.MANUAL, SubConnectorCreationMode.MANUAL);

        this.areaUtilityService.removeFromExposeConnectionsParentOrChild(sourceParent,
            { interface: interfaceDetails.clientInterface, interfaceId: interfaceDetails.clientInterfaceId, type: InterfaceCategory.CLIENT },
            params.currentAreaId);
        this.areaUtilityService.removeFromExposeConnectionsParentOrChild(targetParent,
            { interface: interfaceDetails.serverInterface, interfaceId: interfaceDetails.serverInterfaceId, type: InterfaceCategory.SERVER },
            params.currentAreaId);
            const subConnections = { clientIds: [], serverIds: [] };
            const serverSubConnections = this.areaUtilityService.updateExposedInterfaceUptoTargetArea(targetParent, targetAcId,
            { interface: interfaceDetails.serverInterface, interfaceId: interfaceDetails.serverInterfaceId, type: InterfaceCategory.SERVER },
            targetParent, commonParent);
            subConnections.serverIds = serverSubConnections.serverIds;
            const clientSubConnections = this.areaUtilityService.updateExposedInterfaceUptoTargetArea(sourceParent, sourceAcId,
            { interface: interfaceDetails.clientInterface, interfaceId: interfaceDetails.clientInterfaceId, type: InterfaceCategory.CLIENT },
            sourceParent, commonParent);
            subConnections.clientIds = clientSubConnections.clientIds;

            this.createConnectionAndAddOrUpdateConnection(params,ConnectorCreationMode.MANUAL,subConnections);
            this.facadeService.drawService.drawArea();

    }
    /*
    *
    * Create online connection inside area
    */
    createOnlineAreaConnection(param): NodeAnchor {
        let result;
        const { inputAnchor, commonParent } = param;
        if (inputAnchor) {
            const outputNode = this.facadeService.dataService.getAllNodes().find(node => node.address === inputAnchor.relatedEndPoint.address);
            const serverInterface = this.facadeService.dataService.getServerInterface(outputNode.deviceId, outputNode.id, inputAnchor.interfaceData.type);
            /*
            * If it has common parent
            */
            if (this.facadeService.editorService.getEditorContext().id === commonParent) {
                result = this.createOnlineConnectionsFromParentEditorWtAnchor(inputAnchor, outputNode, serverInterface, param);
            }
            if (this.facadeService.editorService.getEditorContext().id !== commonParent) {
                this.createOnlineConnectionsFromClientArea(inputAnchor, outputNode, serverInterface, param);
            }
        }
        else {
            // Multisession scenario - if goonline from inside the area and go to root editor.From another
            // session disconnection online and establish connection.Node anchor will not present first session.
            //So will create the connection object with available acId and interfaceID
            const { targetAcId, serverInterfaceId, targetDeviceId } = param;
            const serverInterface = this.facadeService.dataService.getServerInterface(targetDeviceId, targetAcId, serverInterfaceId);
            this.createOnlineConnectionsFromParentEditorWoAnchor(inputAnchor, serverInterface, param);
        }
        return result;
    }
    /*
    *
    * Ungroup area
    */
    unGroupArea(params) {
        /*
        *Update Connection Object After Ungroup Operation
        *
        */
        this.removeExposedConnectionAndRecreate(params);
        this.facadeService.drawService.drawArea();
    }
}

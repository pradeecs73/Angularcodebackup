/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ConnectorCreationMode, InterfaceCategory, Numeric, StrategyList, SubConnectorCreationMode } from '../../enum/enum';
import { AreaOperationsStrategy } from './area-operations-strategy';

export class RootOrSameAreaStrategy extends AreaOperationsStrategy {
    /*
    * Function to get the class name which returns Root or same stratergy always
    *
    */
    getClassName() {
        return StrategyList.ROOT_OR_SAME_AREA_STRATEGY;
    }
    /*
    * Reorder html
    *
    */
    reorderHTMLNode(param) {
        const { commonParent,
            connection,
            sourceNodePrevParent,
            targetNodePrevParent
        } = param;
        const [, , interfaceType] = connection?.id?.split('__');
        const [inNodeId, outNodeId] = connection?.acIds?.split('__');
        const [clientInterfaceId, serverInterfaceId] = [connection?.in?.split('__')[Numeric.TWO], connection?.out?.split('__')[Numeric.TWO]];
        const interfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(inNodeId, outNodeId, interfaceType,
            clientInterfaceId, serverInterfaceId, SubConnectorCreationMode.MANUAL, SubConnectorCreationMode.MANUAL);
        this.areaUtilityService.removeFromExposeConnectionsParentOrChild(sourceNodePrevParent,
            { interface: interfaceDetails.clientInterface, interfaceId: interfaceDetails.clientInterfaceId, type: InterfaceCategory.CLIENT },
            connection.areaId);

        this.facadeService.areaUtilityService.removeFromExposeConnectionsParentOrChild(targetNodePrevParent,
            { interface: interfaceDetails.serverInterface, interfaceId: interfaceDetails.serverInterfaceId, type: InterfaceCategory.SERVER },
            connection.areaId);
        connection.areaId = commonParent;
        this.updateConnectionObject(param);
        this.facadeService.drawService.drawArea();

    }
    /*
    * Connection by search
    *
    */
    connectionBySearch(params) {
        const { type, sourceAcId, targetAcId,sourceParent, targetParent, clientInterfaceId, serverInterfaceId } = params;
        const interfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(sourceAcId, targetAcId,
            type, clientInterfaceId, serverInterfaceId, SubConnectorCreationMode.MANUAL,
            SubConnectorCreationMode.MANUAL);
        /*
        * remove existing subConnection
        *
        */
        const subConnections = { clientIds: [], serverIds: [] };
         this.facadeService.areaUtilityService.removeFromExposeConnectionsParentOrChild(sourceParent,
            { interface: interfaceDetails.clientInterface, interfaceId: interfaceDetails.clientInterfaceId, type: InterfaceCategory.CLIENT },
            params.currentAreaId);
        this.facadeService.areaUtilityService.removeFromExposeConnectionsParentOrChild(targetParent,
            { interface: interfaceDetails.serverInterface, interfaceId: interfaceDetails.serverInterfaceId, type: InterfaceCategory.SERVER },
            params.currentAreaId);

        this.createConnectionAndAddOrUpdateConnection(params,ConnectorCreationMode.MANUAL,subConnections);
        this.facadeService.drawService.drawArea();

    }
    /*
    * Method not implemented
    *
    */
    createOnlineAreaConnection() {
        throw new Error('Method not implemented.');
    }
    /*
    * Method not implemented
    *
    */
    unGroupArea() {
        throw new Error('Method not implemented.');
    }

}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ConnectorCreationMode,  InterfaceCategory, StrategyList, SubConnectorCreationMode } from '../../enum/enum';
import { ConnectionDetails} from '../../models/connection.interface';

import { NodeAnchor } from '../../opcua/opcnodes/node-anchor';
import { getclientInterfaceDetails, getConnectionDetails,
getserverInterfaceDetails } from '../../utility/utility';
import { AreaOperationsStrategy } from './area-operations-strategy';

export class NestedDifferentParentAreaStrategy extends AreaOperationsStrategy {
  /*
  * Function to get the class name which returns NestedDifferentParentAreaStrategy always
  */
  getClassName() {
    return StrategyList.NESTED_DIFFERENT_PARENT_AREA_STRATEGY;
  }
  /*
  * Reorder html
  */
  reorderHTMLNode(param) {
    const { commonParent,
      sourceAreaHierarchy,
      targetAreaHierarchy,
      connection,
      sourceNodePrevParent,
      targetNodePrevParent } = param;
    const sourceNodeParent = sourceAreaHierarchy[sourceAreaHierarchy.length - 1];
    const targetNodeParent = targetAreaHierarchy[targetAreaHierarchy.length - 1];
    const connectionDetails: ConnectionDetails = getConnectionDetails(connection);
    const interfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(connectionDetails.clientACId, connectionDetails.serverACId, connectionDetails.interfaceType,
      connectionDetails.clientInterfaceId, connectionDetails.serverInterfaceId, SubConnectorCreationMode.MANUAL, SubConnectorCreationMode.MANUAL);
      /*
      * client Interface updating
      */
    this.areaUtilityService.removeFromExposeConnectionsParentOrChild(sourceNodePrevParent, getclientInterfaceDetails(interfaceDetails), connection.areaId);
    const sourceSubConnectionIds = this.areaUtilityService.updateExposedInterfaceUptoTargetArea(sourceNodeParent, connectionDetails.clientACId,
      getclientInterfaceDetails(interfaceDetails), sourceNodeParent, commonParent);
      /*
      * server Interface updating
      */
    this.areaUtilityService.removeFromExposeConnectionsParentOrChild(targetNodePrevParent, getserverInterfaceDetails(interfaceDetails), connection.areaId);
    const targetSubConnectionIds = this.areaUtilityService.updateExposedInterfaceUptoTargetArea(targetNodeParent, connectionDetails.serverACId,
      getserverInterfaceDetails(interfaceDetails), targetNodeParent, commonParent);

    this.updateConnectionObject({ ...param, sourceSubConnectionIds, targetSubConnectionIds });
    this.facadeService.drawService.drawArea();
  }

   /*
  * Connection by search
  */
  connectionBySearch(param) {
    const { type, sourceAcId, targetAcId, commonParent, sourceParent, targetParent, clientInterfaceId, serverInterfaceId } = param;
    const interfaceDetails = this.areaUtilityService.getExposeInterfaceDetails(sourceAcId, targetAcId,
      type, clientInterfaceId, serverInterfaceId, SubConnectorCreationMode.MANUAL, SubConnectorCreationMode.MANUAL);
    /*
    * remove existing subConnection
    */
    this.areaUtilityService.removeFromExposeConnectionsParentOrChild(sourceParent,
      { interface: interfaceDetails.clientInterface, interfaceId: interfaceDetails.clientInterfaceId, type: InterfaceCategory.CLIENT },
      commonParent);
    this.areaUtilityService.removeFromExposeConnectionsParentOrChild(targetParent,
      { interface: interfaceDetails.serverInterface, interfaceId: interfaceDetails.serverInterfaceId, type: InterfaceCategory.SERVER },
      commonParent);
    const subConnections = { clientIds: [], serverIds: [] };
    const clientSubConnections = this.areaUtilityService.updateExposedInterfaceUptoTargetArea(sourceParent, sourceAcId,
      { interface: interfaceDetails.clientInterface, interfaceId: interfaceDetails.clientInterfaceId, type: InterfaceCategory.CLIENT },
      sourceParent, commonParent);
    subConnections.clientIds = clientSubConnections.clientIds;
    const serverSubConnections = this.areaUtilityService.updateExposedInterfaceUptoTargetArea(targetParent, targetAcId,
      { interface: interfaceDetails.serverInterface, interfaceId: interfaceDetails.serverInterfaceId, type: InterfaceCategory.SERVER },
      targetParent, commonParent);
    subConnections.serverIds = serverSubConnections.serverIds;
    /*
  * call create connection Object
  */

    this.createConnectionAndAddOrUpdateConnection(param,ConnectorCreationMode.MANUAL,subConnections);
    this.facadeService.drawService.drawArea();
  }

  createOnlineAreaConnection(param): NodeAnchor {
    const { inputAnchor } = param;
    if (inputAnchor) {
      const outputNode = this.facadeService.dataService.getAllNodes().find(node => node.address === inputAnchor.relatedEndPoint.address);
      const serverInterface = this.facadeService.dataService.getServerInterface(outputNode.deviceId, outputNode.id, inputAnchor.interfaceData.type);
      if (!this.facadeService.editorService.isRootEditor()) {
        this.createOnlineConnectionsFromClientArea(inputAnchor, outputNode, serverInterface, param);
      }
      else {
        /*
       * create Online Area connector scenario - server Area interface
       */
        /*
        * If output/server Node is inside Area
        */
        //
        return this.createOnlineConnectionsFromParentEditorWtAnchor(inputAnchor, outputNode, serverInterface, param);
      }
    } else {
      // Multisession scenario - if goonline from inside the area and go to root editor.From another
      // session disconnection online and establish connection.Node anchor will not present first session.
      //So will create the connection object with available acId and interfaceID
      const { targetAcId, targetDeviceId,sourceDeviceId,sourceAcId,type } = param
      const clientInterface = this.facadeService.dataService.getClientInterface(sourceDeviceId,sourceAcId,type);
      const serverInterface = this.facadeService.dataService.getServerInterface(targetDeviceId, targetAcId, type);
      this.createOnlineConnectionsFromParentEditorWoAnchor(clientInterface, serverInterface, param);
    }
    return null;
  }


  /*
  *
  * Ungroup area
  *
  */
  unGroupArea() {
    throw new Error('Method not implemented.');
  }

}

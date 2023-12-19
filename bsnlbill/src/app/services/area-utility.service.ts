/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { accessControl, DeleteSubConnectionByType,
    FillingLineNodeType, InterfaceCategory, Numeric,
    StrategyList, StrategyOperations, SubConnectorCreationMode } from '../enum/enum';
import { Connection, InterfaceDetails,
    SidePanelInterfaceDetails, SidePanelInterfaceListDetails,
    SubConnection,
    SubConnectionIdList } from '../models/connection.interface';
import { PlantArea, PlantAreaService } from '../opcua/opcnodes/area';
import { SubConnector, SubConnectorService } from '../opcua/opcnodes/subConnector';
import { EditorService } from '../opcua/opcua-services/livelink-editor.service';
import { ProjectDataService } from '../shared/services/dataservice/project-data.service';
import { FillingArea, FillingNode } from '../store/filling-line/filling-line.reducer';
import { DrawService } from './draw.service';
import { FillingLineService } from './filling-line-store.service';

import { EntityState } from '@ngrx/entity';
import { TreeNode } from 'primeng/api';
import { AreaHierarchy } from '../models/area.interface';
import { Area, DragDropData, EditorContext, Node } from '../models/models';
import { AreaClientInterface, AreaInterface, ISidePanel } from '../models/targetmodel.interface';
import { OPCNode, OPCNodeService } from '../opcua/opcnodes/opcnode';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { OverlayService } from '../shared/services/overlay.service';
import { ROOT_EDITOR } from '../utility/constant';
import {
    breadcrumbForArea, exposedInterfaceByConnectionList, findConnectionInAndOut, getclientInterfaceDetails, getParent,
    getserverInterfaceDetails, getSubConnectionID, isExposedConnectionPresentInServerInterface, isRootToArea, log, sortEditorHTMLNodesCoordinate
} from '../utility/utility';
import { CommonService } from './common.service';
import interact from 'interactjs';
import { DisableIfUnauthorizedDirective } from '../directives/access-check/access-check.directive';


@Injectable({
    providedIn: 'root'
})

export class AreaUtilityService {

    fillingLineData: EntityState<FillingNode | FillingArea>;

    menuTreeData: TreeNode;
    nestedAreas: TreeNode[];
    selectedItems: TreeNode[];

    private readonly dataService: ProjectDataService;
    private readonly subConnectorService: SubConnectorService;
    private readonly plantAreaService: PlantAreaService;
    private readonly overlayService: OverlayService;
    private readonly opcNodeService: OPCNodeService;
    private readonly commonService: CommonService;
    private readonly fillingLineService: FillingLineService;
    private readonly editorService: EditorService;
    private readonly drawService: DrawService;

    constructor(private readonly facadeService: FacadeService) {
        this.dataService = facadeService.dataService;
        this.subConnectorService = facadeService.subConnectorService;
        this.plantAreaService = facadeService.plantAreaService;
        this.overlayService = facadeService.overlayService;
        this.opcNodeService = facadeService.opcNodeService;
        this.commonService = facadeService.commonService;
        this.drawService = facadeService.drawService;
        this.editorService = facadeService.editorService;
        this.fillingLineService = facadeService.fillingLineService;
    }

    /**
     *
     * @description Removes Sub-connection in DataService, Filling Area Store, Sub-Connection line and Sub-connection Lookup.
     * @param mode
     * @param id
     * @param subConnectors
     *
     *  */
    removeSubConnection(mode: DeleteSubConnectionByType, id: string, subConnectors?: SubConnector[]) {
        switch (mode) {
            /*
            * For area
            */
            case DeleteSubConnectionByType.AREA:
                this.removeSubConnectionByAreaId(id, subConnectors);
                break;
            /*
            * For node
            */
            case DeleteSubConnectionByType.NODE:
                this.removeSubConnectionByNodeId(id, subConnectors);
                break;
            /*
            * For sub connector
            */
            case DeleteSubConnectionByType.SUB_CONNECTOR:
                this.removeSubConnectors(subConnectors);
                break;
            /*
            * For ungroup
            */
            case DeleteSubConnectionByType.UNGROUP:
                this.subConnectorService.removeSubConnectionFromLookupByAreaId(id);
                break;
            /*
            * Default
            */
            default:
                break;
        }
    }
    /*
    *
    *
    * Function is used to remove the sub connectors : client if is input is true ,server if isinput is false
    *
    */
    private removeSubConnectors(subConnectors: SubConnector[]) {
        if (subConnectors && subConnectors.length > 0) {
            subConnectors.forEach(subConnector => {
                const areaId = subConnector.areaId;
                const areaData = this.dataService.getArea(areaId);
                const clientInterfaces = areaData?.clientInterfaceIds;
                const serverInterfaces = areaData?.serverInterfaceIds;
                if (subConnector.isInput) {
                    this.removeSubConnector(subConnector, clientInterfaces, areaId, InterfaceCategory.CLIENT);
                }
                else {
                    this.removeSubConnector(subConnector, serverInterfaces, areaId, InterfaceCategory.SERVER);
                }
            });
        }
    }
    /*
    *
    * Remove the sub connector based on the parameters
    *
    */
    private removeSubConnector(subConnector: SubConnector, sidePanelData: ISidePanel[], areaId: string, interfaceCategory: InterfaceCategory) {
        const sidePanelDataForRemove = sidePanelData.filter(data => data.interfaceId === subConnector.outputAnchor.interfaceData.id);
        this.removeOldExposedInterfaces(sidePanelDataForRemove, areaId, interfaceCategory);
        this.dataService.deleteNodeConnectionsOfSubConnection(
         subConnector.outputAnchor.interfaceData.type,
         subConnector.outputAnchor.interfaceData.id
        );
    }
     /*
    *
    * Remove sub connections for the given area id
    *
    */
    private removeSubConnectionByAreaId(areaId: string, subConnectors?: SubConnector[]) {
        const areaData = { ...this.facadeService.dataService.getArea(areaId) };
        if (areaData && Array.isArray(areaData.nodeIds) && areaData.nodeIds.length > 0) {
            areaData.nodeIds.forEach(nodeId => {
                this.updateAreaClientAndServerInterfaces(nodeId);
            });
        }
        if (Array.isArray(subConnectors) && subConnectors.length > 0) {
            subConnectors.forEach(subConnector => this.subConnectorService.remove(subConnector));
        } else {
            const areaNode: PlantArea = this.editorService.liveLinkEditor.editorNodes.find(opcNode => opcNode.id === areaId) as PlantArea;
            if (areaNode) {
                const subConnectorObjects = areaNode.getAllSubConnectors();
                subConnectorObjects.forEach(subConnector => this.subConnectorService.remove(subConnector));
            }
            this.subConnectorService.removeSubConnectionFromLookupByAreaId(areaId);
        }
    }
    /*
    *
    * Remove sub connections for the given node id
    *
    */
    protected removeSubConnectionByNodeId(nodeId: string, subConnectors?: SubConnector[]) {
        this.updateAreaClientAndServerInterfaces(nodeId);
        if (subConnectors.length > 0) {
            subConnectors.forEach(subConnector => this.subConnectorService.remove(subConnector));
        }
    }

    /* Remove the method and use oth existing method available*/
    /**
     *
    * @param automationComponentId
    * @description Updates client & service InterfaceIds & Interfaces properties in data service and store.
    */
    updateAreaClientAndServerInterfaces(nodeId: string) {
        const areas = this.dataService.getAllAreas();
        if (areas && areas.length > 0) {
            areas.forEach((areaData: PlantArea) => {
                    areaData.clientInterfaceIds = areaData?.clientInterfaceIds?.filter(clientInterface => clientInterface.automationComponentId !== nodeId) || [];
                    areaData.serverInterfaceIds = areaData?.serverInterfaceIds?.filter(serverInterface => serverInterface.automationComponentId !== nodeId) || [];
                const payload = {} as SidePanelInterfaceListDetails;
                payload.clientInterfaceIds = areaData.clientInterfaceIds;
                payload.serverInterfaceIds = areaData.serverInterfaceIds;
                this.dataService.updateArea(areaData.id, areaData);
                payload.clientInterfaces = this.dataService.getClientInterfaceList(areaData);
                payload.serverInterfaces = this.dataService.getServerInterfaceList(areaData);
                this.plantAreaService.updateArea(areaData.id, payload);
            });
        }
    }
     /*
    *
    * Remove the access to reorder area if the user has not logged in with write password
    *
    */
    removeInteractionEvents(disableIfUnauthorizedDirective:DisableIfUnauthorizedDirective){
        if (!disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_REORDER_AREA_NODE)) {
            this.facadeService.editorService.liveLinkEditor.editorNodes.forEach(nodes => {
                const nodeAnchors = nodes.getAllAnchorNodes();
                const node: SVGElement = nodes.element.querySelector('#Device-header');
                interact(node).unset();
                for (const anchor of nodeAnchors) {
                    const anchorInterface = anchor.getAnchorInterfaceElement().node() as SVGElement;
                    interact(anchor.anchorElement).unset();
                    interact(anchorInterface).unset();
                }
            });
        }

    }
    /**
     * @description Returns the child areaId of ungrouped area that is exposing subconnections
     * @param acId
     * @param ungroupAreaId
     */
    getChildExposedAreaId(ungroupAreaId: string, acId: string) {
        let childAreaIdToBeUpdated: string;
        const childAreaList = this.facadeService.dataService.getAllAreas().filter(el => el.parent === ungroupAreaId);
        childAreaList.forEach(area => {
            if (area.clientInterfaceIds && area.clientInterfaceIds.length > 0) {
                const clientInterface = area.clientInterfaceIds.find(el => el.automationComponentId === acId);
                if (clientInterface) {
                    childAreaIdToBeUpdated = area.id;
                }
            }
            if (area.serverInterfaceIds && area.serverInterfaceIds.length > 0) {
                const serverInterface = area.serverInterfaceIds.find(el => el.automationComponentId === acId);
                if (serverInterface) {
                    childAreaIdToBeUpdated = area.id;
                }
            }
        });
        return childAreaIdToBeUpdated;
    }

    /**
     * @description method updates the subconnectionid in Data service and store
     * @param parentAreaId
     * @param subConnection
     */
    updateExposedInterfaceSubConnectionId(parentAreaId: string, subConnection: SubConnection) {
        const area = this.facadeService.dataService.getArea(parentAreaId);
        if (area.clientInterfaceIds && area.clientInterfaceIds.length > 0) {
            const clientExposed = area.clientInterfaceIds.find(el => el.automationComponentId === subConnection.acId);
            if (clientExposed) {
                clientExposed.subConnectionId = subConnection.id;
            }
        }
        if (area.serverInterfaceIds && area.serverInterfaceIds.length > 0) {
            const serverExposed = area.serverInterfaceIds.find(el => el.automationComponentId === subConnection.acId);
            if (serverExposed) {
                serverExposed.subConnectionId = subConnection.id;
            }
        }
        const clientInterface = this.dataService.getClientInterfaceList(area) || [];
        const serverInterface = this.dataService.getServerInterfaceList(area) || [];
        this.plantAreaService.updateArea(
            parentAreaId,
            {
                clientInterfaces: clientInterface,
                clientInterfaceIds: area.clientInterfaceIds,
                serverInterfaces: serverInterface,
                serverInterfaceIds: area.serverInterfaceIds
            }
        );
    }

    /**
     * @description method used to update subConnectionId in client and server interface's data of the parent area after ungrouping an area
     * @param ungroupAreaId
     * @param parentAreaId
     */
    updateSubconnectionIdAfterUngroup(ungroupAreaId: string, parentAreaId: string) {
        try {
            const subConnections = this.facadeService.dataService.getAreaSubConnections(parentAreaId);
            subConnections.forEach(subConnection => {
                if (subConnection.id.includes(ungroupAreaId)) {
                    const childAreaIdToBeUpdated = this.getChildExposedAreaId(ungroupAreaId, subConnection.acId);
                    const splitId = subConnection.id.split('__');
                    const splitData = subConnection.data.split('__');
                    if (childAreaIdToBeUpdated) {
                        splitId[0] = childAreaIdToBeUpdated;
                        splitData[1] = childAreaIdToBeUpdated;
                    } else {
                        splitId[0] = subConnection.acId;
                        splitData[1] = subConnection.acId;
                    }
                    subConnection.id = splitId.join('__');
                    subConnection.data = splitData.join('__');
                    this.updateExposedInterfaceSubConnectionId(parentAreaId, subConnection);
                }
            });
        } catch (error) {
            log(error);
        }
    }

    unGroupAreaHavingNodeID(node: TreeNode, nodeIds: string[], menuTreeData: TreeNode) {
        if (node && node.data && !node.parent) {
            const parent = node.data.parent;
            node.parent = getParent(menuTreeData.children, parent);
            if (parent === ROOT_EDITOR) {
                node.parent = menuTreeData;
            }
        }
        const areaId = node.key;
        const parentArea = this.facadeService.dataService.getArea(areaId).parent;
        node  = this.facadeService.areaUtilityService.updateParentIfMissing([node])[0];
        this.updateSubconnectionIdAfterUngroup(areaId, parentArea);
        const areas = this.dataService.getAllAreas();
        let areaYmaxcoordinate=this.setUngroupAreaCoordinates(node,parentArea);
        /** updating  the child area Parent after UnGroup*/
        node.children.forEach(treeNode => {
            if (treeNode.type === FillingLineNodeType.AREA) {
                this.fillingLineService.updateArea(treeNode.key, { parent: parentArea,y:Number(areaYmaxcoordinate+Numeric.TWOFORTY)});
                const childArea = areas.find(area => area.id === treeNode.key);
                childArea.parent = parentArea;
                childArea.y=Number(areaYmaxcoordinate+Numeric.TWOFORTY);
                areaYmaxcoordinate=Number(areaYmaxcoordinate+Numeric.TWOFORTY);
                this.dataService.updateArea(treeNode.key, childArea);

            }
            else{
                this.fillingLineService.updateNode(treeNode.key, { parent: parentArea,y:Number(areaYmaxcoordinate+Numeric.TWOFORTY)});
                const nodeData = { ...this.dataService.getNodeByID(treeNode.key) };
                nodeData.y=Number(areaYmaxcoordinate+Numeric.TWOFORTY);
                areaYmaxcoordinate=Number(areaYmaxcoordinate+Numeric.TWOFORTY);
                this.dataService.updateNode(nodeData as FillingNode);
            }
        });

        /** updating  the node Id's Parent after UnGroup*/
        nodeIds.forEach(id => {
            this.fillingLineService.updateNode(id, { parent: parentArea });
            this.dataService.updateNodeParent(id, parentArea);
        });
        this.updateParentAreaAndCurrentAreaConnections(node,parentArea);
        this.updateAreaLabels(node,parentArea);
        /**
         * This method will refresh the  editor connections after unGroup
         */
        this.drawService.removeAreaConnectionsFromEditor(node.key);
        /**
         * Deleting the sub connections after updating the connections
         */
        this.dataService.deleteSubConnectionByAreaId(areaId);
        /**
         * Removing node and related ungrouped area
         * */
        const areaNode: PlantArea = this.editorService.liveLinkEditor.editorNodes.find(opcNode => opcNode.id === areaId) as PlantArea;
        if (areaNode) {
            this.drawService.removeNode(areaNode);
        }
        /**
         * Removing ungrouped area after UnGroup
         */
        this.dataService.removeArea(areaId);
        /**
         * Updating the parent area with UnGroup area node list
         * */
        if (parentArea !== ROOT_EDITOR) {
            const areaData = { ...this.dataService.getArea(parentArea) };
            const updatedNodes = Array.from(new Set([...areaData.nodeIds, ...nodeIds]));
            this.plantAreaService.updateArea(parentArea, { nodeIds: updatedNodes });
        }
        this.setBreadCrumAfterAreaDelete(parentArea,node.parent);
    }
     /*
    *
    *Update the area labels
    *
    */
    updateAreaLabels(node: TreeNode,parentArea:string) {
        if (this.editorService.getEditorContext().id !== parentArea) {
            this.fillingLineService.selectDevice(parentArea);
            let label = '';
            if (parentArea !== ROOT_EDITOR) {
                label = node.parent.label;
            }
            this.editorService.selectedAreaData({ id: parentArea, name: label });
        }
    }
     /*
    *
    * When we select an item from tree menu in editor page
    *
    */
    nodeSelect(node){
        if (!node.parent) {
            let parent;
            if(node && node.data && node.data.parent){
                parent = node.data.parent;
            }
            const updatedTree = this.updateParentIfMissing(this.menuTreeData.children);
            if (parent === ROOT_EDITOR) {
                node.parent = updatedTree;
            }
        }
        let selectedAreaId: EditorContext = { id: ROOT_EDITOR, name: '' };
        this.facadeService.commonService.updateNavigationToAnother(true);
        if (node.type !== FillingLineNodeType.NODE) {
            if (node.type === FillingLineNodeType.AREA) {
                selectedAreaId = {
                    id: node.key, name: node.label,
                    parentLabels: breadcrumbForArea(node)
                };
            }
            if (this.facadeService.editorService.getEditorContext()?.id !== selectedAreaId.id) {
                this.facadeService.editorService.selectedAreaData(selectedAreaId);
            }

        }
    }
     /*
    *
    * Ungroup the area which doesn't have the given node id
    *
    */
    unGroupAreaWithOutNodeID(node: TreeNode, menuTreeData: TreeNode) {
        if (node && node.data && !node.parent) {
            const parent = node.data.parent;
            node.parent = getParent(menuTreeData.children, parent);
            if (parent === ROOT_EDITOR) {
                node.parent = menuTreeData;
            }
        }

       const areaId = node.key;
       const parentArea = this.facadeService.dataService.getArea(areaId).parent;
       this.updateSubconnectionIdAfterUngroup(areaId, parentArea);
       let areaYmaxcoordinate=this.setUngroupAreaCoordinates(node,parentArea);
         /**
         * updating the child area Parent after UnGroup
         */
        node.children.forEach(treeNode => {
            if (treeNode.type === FillingLineNodeType.AREA) {
                this.fillingLineService.updateArea(treeNode.key, { parent: parentArea,y:Number(areaYmaxcoordinate+Numeric.TWOFORTY)});
                const areaData = { ...this.dataService.getArea(treeNode.key) };
                areaData.parent = parentArea;
                areaData.y=Number(areaYmaxcoordinate+Numeric.TWOFORTY);
                areaYmaxcoordinate=Number(areaYmaxcoordinate+Numeric.TWOFORTY);
                this.dataService.updateArea(treeNode.key, areaData as FillingArea);
            }
        });
        this.updateParentAreaAndCurrentAreaConnections(node,parentArea);
        this.fillingLineService.deleteArea(node.key);
        this.dataService.deleteArea(node.key);
        this.drawService.removeAreaConnectionsFromEditor(node.key);
        this.setBreadCrumAfterAreaDelete(parentArea,node.parent);
    }
       /*
    *
    * set ungroup area coordinates
    *
    */
    setUngroupAreaCoordinates(node: TreeNode,parentArea:string) {
      let editorAreas = [];
      let editorNodes = [];
        if( this.facadeService.dataService.getProjectData().editor &&  this.facadeService.dataService.getProjectData().editor.areas){
             editorAreas = this.facadeService.dataService.
              getProjectData().editor.areas.filter(editorArea => editorArea.parent === parentArea && editorArea.id !== node.key) || [];
        }
       if( this.facadeService.dataService.getProjectData().editor &&  this.facadeService.dataService.getProjectData().editor.nodes){
            editorNodes = this.facadeService.dataService.
            getProjectData().editor.nodes.filter(editorNode => editorNode.parent === parentArea) || [];
       }
        const nodeYcoordinate = sortEditorHTMLNodesCoordinate(editorNodes);
        let areaYcoordinate = sortEditorHTMLNodesCoordinate(editorAreas);
        areaYcoordinate=areaYcoordinate.concat(nodeYcoordinate);
        if (areaYcoordinate.length) {
            areaYcoordinate.sort((a, b) => a - b);
            return areaYcoordinate[areaYcoordinate.length - Numeric.ONE];
        }
        else {
            return Number(Numeric.NEGATIVE_ONEFORTY);
        }

    }
     /*
    *
    * update parent area and current area connections
    *
    */
    updateParentAreaAndCurrentAreaConnections(node: TreeNode,parentArea:string) {
        /**
         * This will get the parent area connections and update connection properties
         * */
        const connectionsInParentEditor = this.dataService.getAreaConnections(parentArea) || [];
        this.updateConnectionInParentEditor(connectionsInParentEditor,node);

        /**
         * This will get the current area connections and update connection properties
         *  */
        const connectionsInCurrentEditor = this.dataService.getAreaConnections(node.key) || [];
        for (const connection of connectionsInCurrentEditor) {
            connection.areaId = parentArea;
            this.dataService.updateConnection(connection.id, connection);
        }
    }
     /*
    *
    * Update the breadcrumb after deleting the area
    *
    */
    private setBreadCrumAfterAreaDelete(parentAreaKey:string,nodeData: TreeNode) {
        if (parentAreaKey === ROOT_EDITOR) {
            this.editorService.selectedAreaData({ id: parentAreaKey, name: '' });
        }
        else {
            const selectedAreaId = {
                id: nodeData.key, name: nodeData.label,
                parentLabels: breadcrumbForArea(nodeData)
            };
            this.editorService.selectedAreaData(selectedAreaId);
        }
    }
     /*
    *
    * Update the connections in root level after delete
    *
    */
    private updateConnectionInParentEditor(connectionList: Connection[], node) {
        if (connectionList.length) {
            this.removeAndCreateSubconnectionInterface(connectionList);
        }
        else {
            this.updateSubconnectionAfterUngroup(node);
        }

    }
     /*
    *
    * Update sub connection inside the area after ungroup
    *
    */
    updateSubconnectionAfterUngroup(node) {

        let connectionList = this.dataService.getConnectionListByNodeId(node?.id) || [];
        if (node.type === FillingLineNodeType.AREA) {
            connectionList = this.getAllExposedConnections(node.data);
        }

        if (connectionList.length) {
            this.removeAndCreateSubconnectionInterface(connectionList);
        }
    }
     /*
    *
    * Remove and create sub connection interface
    *
    */
    removeAndCreateSubconnectionInterface(connectionList){

        for (const connection of connectionList) {
            const [inNodeId, outNodeId] = connection.acIds.split('__');
            const sourceId = this.dataService.getNodeByID(inNodeId);
            const targetId = this.dataService.getNodeByID(outNodeId);
            const areaHierarchy: AreaHierarchy = this.getCommonParent(sourceId.parent, targetId.parent);
            const { connectionIn, connectionOut } = findConnectionInAndOut(areaHierarchy, inNodeId, outNodeId);
            const sourceNodePrevParent=sourceId.parent;
            const targetNodePrevParent=targetId.parent;

            this.facadeService.strategyManagerService.executeStrategy(StrategyList.NESTED_SIBLINGS_AREA_STRATEGY, StrategyOperations.UNGROUP_AREA,
               { ...areaHierarchy, connection, connectionIn, connectionOut,sourceNodePrevParent,targetNodePrevParent});

        }

    }

    /* Strategy pattern code  */

    getCommonParent(sourceId: string, targetId: string): AreaHierarchy {
        const sourceAreaHierarchy = this.getHierarchyInArray(sourceId);
        const targetAreaHierarchy = this.getHierarchyInArray(targetId);
        /*
        *IF source/target is ROOT,common parent will be root
        */
        if (sourceId === ROOT_EDITOR || targetId === ROOT_EDITOR) {
            return mapAreaHierarchyDetails(sourceAreaHierarchy, targetAreaHierarchy, []);
        }
        const commonParentForConnection = sourceAreaHierarchy.filter(value => targetAreaHierarchy.includes(value));
        return mapAreaHierarchyDetails(sourceAreaHierarchy, targetAreaHierarchy, commonParentForConnection);
    }

    /* Get area hierarchy with area ID in array format */

    private getHierarchyInArray(areaID: string) {
        if (areaID === ROOT_EDITOR) {
            return [ROOT_EDITOR];
        }
        const { areaList } = this.getAreaHierarchy(areaID);
        return [ROOT_EDITOR, ...areaList.map(list => list.id)];
    }
     /*
    *
    * Returns the area hierachy
    *
    */
    getAreaHierarchy(areaID: string): { areaName: string, areaList: Area[] } {
        const areaList = this.facadeService.plantAreaService.getParentOfAreaByAreaId(areaID, []);
         let areaName = '';
          if (areaList.length > 0) {
            /*
            * Resolving the sonar issue for the below line will affect the functionalities when there is a nested areas
            */
            const reversedAreaList = areaList.reverse(); //NOSONAR
             areaName = reversedAreaList.reduce((ac, val, currentIndex) =>
             ac + `${this.symbol(currentIndex)} ${val.name}`, '');
             }
              return { areaName, areaList };
 }
     /*
    *
    * Symbol for showing '>' or ''
    *
    */
    symbol(currentIndex:number){
        let symbol= '';
        if(currentIndex !== 0){
            symbol =  '>';
        }
        return symbol;
    }

    /**
     * Method to map expose connection with connections
     * list in the application during area reordering
     */
    getAllExposedConnections(dragNode: FillingArea | FillingNode) {
        let connectionList = [];
        const areaDetails = this.dataService.getArea(dragNode.id);
        if (areaDetails) {
            const { clientInterfaceIds , serverInterfaceIds } = areaDetails;
            const exposed = [...clientInterfaceIds, ...serverInterfaceIds];
            const exposedAcs = exposed.map(a => a['automationComponentId']);
            const uniqueExposedAcs = new Set(exposedAcs);
            /*
            *map exposed connection with acID to global connections list
            */
            uniqueExposedAcs.forEach(acId => {
                const connection = this.dataService.getConnectionByAcID(acId);
                if (connection.length) {
                    connectionList = [...connectionList, ...connection];
                }
            });
        }

        return connectionList;
    }
     /*
    *
    * Is exposed connection present in client interface
    *
    */
    isExposedConnectionPresentInClientInterface(previousParent:string,inNodeID:string){
        const areaDetails = this.dataService.getArea(previousParent);
        const exposedClientInterfaces = areaDetails?.clientInterfaceIds?.map(clientInterface => clientInterface.automationComponentId);
        return exposedClientInterfaces?.includes(inNodeID);
    }


    /** Method for update the connection in  area interface side panel */
    updateNodeConnectionsToArea(dragNode: FillingArea | FillingNode, previousParent?: string) {
        let connectionList = this.dataService.getConnectionListByNodeId(dragNode?.id) || [];
        if (connectionList.length === 0) {
            connectionList = this.getAllExposedConnections(dragNode);
        }
        if (connectionList.length) {
            for (const connection of connectionList) {
                const [inNodeId, outNodeId] = connection.acIds.split('__');
                const sourceId = this.dataService.getNodeByID(inNodeId);
                const targetId = this.dataService.getNodeByID(outNodeId);
                const targetAreaDetails = this.dataService.getArea(targetId.parent);
                const areaHierarchyDetails: AreaHierarchy = this.getCommonParent(sourceId.parent, targetId.parent);
                const scenario = this.getScenario(areaHierarchyDetails);
                let targetNodePrevParent = previousParent;
                let sourceNodePrevParent = this.dataService.getNodeByID(inNodeId).parent;
                if (dragNode.id === inNodeId || this.isExposedConnectionPresentInClientInterface(previousParent,inNodeId)) {
                    [sourceNodePrevParent, targetNodePrevParent] = [previousParent, this.dataService.getNodeByID(outNodeId).parent];
                }
                /** Scenario: when the previousParent is ROOT , in order to remove exposed server interface from Root*/
                if (previousParent === ROOT_EDITOR && isExposedConnectionPresentInServerInterface(targetAreaDetails, outNodeId)) {
                    targetNodePrevParent = targetId.parent;
                }
                const { connectionIn, connectionOut } = findConnectionInAndOut(areaHierarchyDetails, inNodeId, outNodeId);
                this.facadeService.strategyManagerService.executeStrategy(scenario, StrategyOperations.REORDER_HTML_NODE,
                    {
                        ...areaHierarchyDetails,connection, sourceNodePrevParent, targetNodePrevParent,  connectionIn, connectionOut
                    });
            }
        }
        if (previousParent !== ROOT_EDITOR) {
            this.reorderWithNoConnection({ previousParent, dragNode });
        }
    }
     /*
    *
    * Get scenario
    *
    */
    getScenario(areaHierarchyDetails: AreaHierarchy) {
        let scenario;
        switch (true) {
            case areaHierarchyDetails.sourceAreaHierarchy.toString() === areaHierarchyDetails.targetAreaHierarchy.toString():
                scenario = StrategyList.ROOT_OR_SAME_AREA_STRATEGY;
                break;
            case isRootToArea(areaHierarchyDetails):
            case areaHierarchyDetails.commonParent === ROOT_EDITOR:
                scenario = StrategyList.NESTED_DIFFERENT_PARENT_AREA_STRATEGY;
                break;
            default:
                scenario = StrategyList.NESTED_SIBLINGS_AREA_STRATEGY;
                break;
        }
        return scenario;
    }
     /*
    *
    * Reorder with no connection
    *
    */
    private reorderWithNoConnection(param) {
        const previousArea = this.dataService.getArea(param.previousParent);
        const clientInterfaces = previousArea?.clientInterfaceIds;
        const serverInterfaces = previousArea?.serverInterfaceIds;
        //if connection not available then remove the previous parent exposed subconnection, 
        this.removeExposedConnIfConnectionNotAvailable(clientInterfaces, InterfaceCategory.CLIENT, param.previousParent);
        this.removeExposedConnIfConnectionNotAvailable(serverInterfaces, InterfaceCategory.SERVER, param.previousParent);
        const area = this.dataService.getArea(param.previousParent);
        const clientInterface = this.dataService.getClientInterfaceList(area) || [];
        const serverInterface = this.dataService.getServerInterfaceList(area) || [];
        const dropArea = this.editorService.liveLinkEditor?.editorNodes?.find(node => node.id === area.id) as PlantArea;
        this.plantAreaService.updateArea(area.id,
            {
                clientInterfaces: clientInterface,
                clientInterfaceIds: area.clientInterfaceIds,
                serverInterfaces: serverInterface,
                serverInterfaceIds: area.serverInterfaceIds
            },
            dropArea
        );
        this.facadeService.drawService.drawArea();
    }
    
    /**This method will remove the previous parent exposed subconnection, if connection not available */
    private removeExposedConnIfConnectionNotAvailable(clientOrServerSidePanel:ISidePanel[],
        interfaceCategory:InterfaceCategory,previousParent:string) {
        for (const sidePanel of clientOrServerSidePanel){
            if(sidePanel){
                const connection = this.facadeService.dataService.getConnectionByACIDAndInterfaceID(sidePanel.automationComponentId,sidePanel.interfaceId);
                if(!connection){
                    const serverInterfaceOldExposed = exposedInterfaceByConnectionList(clientOrServerSidePanel, sidePanel.automationComponentId) || [];
                    this.removeOldExposedInterfaces(
                        serverInterfaceOldExposed,
                        previousParent,
                        interfaceCategory
                    );
                }
            }
        }
    }

     /*
    *
    * Remove old exposed interfaces
    *
    */
    private removeOldExposedInterfaces(exposedSidePanel: ISidePanel[], previousParentArea: string, type: InterfaceCategory) {
        for (const interfaceId of exposedSidePanel) {
            let interfaceData: AreaInterface;
            if (type === InterfaceCategory.CLIENT) {
                interfaceData = this.getExposedClientInterfaceData(
                    interfaceId.automationComponentId,
                    interfaceId.interfaceId,
                    interfaceId,
                    interfaceId.interfaceExposedMode
                );
            }
            else {
                interfaceData = this.getExposedServerInterfaceData(
                    interfaceId.automationComponentId,
                    interfaceId.interfaceId,
                    interfaceId,
                    interfaceId.interfaceExposedMode
                );
            }
            this.removeFromExposeConnectionsParentOrChild(previousParentArea,
                { interface: interfaceData, interfaceId: interfaceId, type: type },
                ROOT_EDITOR
            );
        }
    }

    /**
     *
     * @param initialAreaId //AreaId that contains node, starting expose interface removal
     * @param interfaceExposed  //Exposed interface details to remove
     * @param removeExposeUpToAreaId //  end point of expose interface removal ie, end AreaId or commonParent
     * @param connection //Base connection object
     *
     */
    removeFromExposeConnectionsParentOrChild(initialAreaId: string, interfaceExposed: InterfaceDetails, removeExposeUpToAreaId: string) {
        if (initialAreaId !== ROOT_EDITOR) {
            this.removeInterfaceNDeleteSubConnection(initialAreaId, interfaceExposed);
        }

        if (!initialAreaId || initialAreaId === removeExposeUpToAreaId || initialAreaId === ROOT_EDITOR) {
            return;
        }
        const dropNodeArea = this.dataService.getAllAreas().find(area => area.id === initialAreaId) as FillingArea;
        this.removeFromExposeConnectionsParentOrChild(dropNodeArea.parent,
            interfaceExposed,
            removeExposeUpToAreaId
        );
    }
     /*
    *
    * Remove interface from interface grid panels and delete sub conenction
    *
    */
    private removeInterfaceNDeleteSubConnection(areaId: string, interfaceExposed: InterfaceDetails) {
        const exposedSidePanelData = this.dataService.removeInterfaceIdsFromArea(areaId,
            interfaceExposed.interfaceId,
            interfaceExposed.type
        );
        if (exposedSidePanelData && exposedSidePanelData.subConnectionId) {
            this.facadeService.subConnectorService.removeSubConnection(exposedSidePanelData.subConnectionId);
        }
        const area = this.dataService.getArea(areaId);
        const clientInterface = this.dataService.getClientInterfaceList(area) || [];
        const serverInterface = this.dataService.getServerInterfaceList(area) || [];
        const dropArea = this.editorService.liveLinkEditor?.editorNodes?.find(
            node => node.id === areaId
        ) as PlantArea;
        this.plantAreaService.updateArea(
            areaId,
            {
                clientInterfaces: clientInterface,
                clientInterfaceIds: area.clientInterfaceIds,
                serverInterfaces: serverInterface,
                serverInterfaceIds: area.serverInterfaceIds
            },
            dropArea
        );
    }
     /*
    *
    * Update interface exposed mode
    *
    */
    updateInterfaceExposedMode(areaId: string,interfaceType:string,sidePanelData:ISidePanel,existingExposedMode:SubConnectorCreationMode,
        newExposedMode:SubConnectorCreationMode,interfaceOperation:string) {
        if (sidePanelData.interfaceExposedMode === existingExposedMode) {
            const interfaceDetails=this.getExposeInterfaceDetailsOfSpecificType(sidePanelData.automationComponentId,interfaceType,
                sidePanelData.interfaceId,newExposedMode,sidePanelData.isClientInterface);
            this.facadeService.plantAreaService.updateInterfaceDetailsToServiceNStore(areaId, interfaceDetails, interfaceOperation);
        }
    }
     /*
    *
    * Return expose interface details
    *
    */
    getExposeInterfaceDetails(clientNode: string, serverNode: string, interfaceType: string,
        clientInterfaceId: string, serverInterfaceId: string, clientInterfaceExposedMode: SubConnectorCreationMode,
        serverInterfaceExposedMode: SubConnectorCreationMode): SidePanelInterfaceDetails {
        const interfaceDetails: SidePanelInterfaceDetails = {
            clientInterface: {} as AreaClientInterface,
            clientInterfaceId: {} as ISidePanel,
            serverInterface: {} as AreaInterface,
            serverInterfaceId: {} as ISidePanel
        };
        if (clientNode) {
            interfaceDetails.clientInterfaceId = this.getExposedSidePanelData(clientNode, interfaceType, clientInterfaceId, clientInterfaceExposedMode, true);
            interfaceDetails.clientInterface = this.getExposedClientInterfaceData(clientNode, clientInterfaceId, interfaceDetails?.clientInterfaceId, clientInterfaceExposedMode);
        }
        if (serverNode) {
            interfaceDetails.serverInterfaceId = this.getExposedSidePanelData(serverNode, interfaceType, serverInterfaceId, serverInterfaceExposedMode, false);
            interfaceDetails.serverInterface = this.getExposedServerInterfaceData(serverNode, serverInterfaceId, interfaceDetails?.serverInterfaceId, serverInterfaceExposedMode);
        }
        return interfaceDetails;
    }
     /*
    *
    * Get expose interface details of specific type
    *
    */
    getExposeInterfaceDetailsOfSpecificType(acId:string,interfaceType:string,interfaceId:string,
        interfaceExposedMode: SubConnectorCreationMode,isclient:boolean,subConenctionId?:string):InterfaceDetails
    {
        let sidePanelinterfaceDetails:SidePanelInterfaceDetails;
        let interfaceDetails:InterfaceDetails;
        if (isclient) {
            sidePanelinterfaceDetails = this.getExposeInterfaceDetails(acId,
              '', interfaceType, interfaceId,
              '', interfaceExposedMode, SubConnectorCreationMode.MANUAL);
            if(subConenctionId)
            {
            sidePanelinterfaceDetails.clientInterfaceId.subConnectionId=subConenctionId;
            }
            interfaceDetails = getclientInterfaceDetails(sidePanelinterfaceDetails);
          }
          else {
            sidePanelinterfaceDetails = this.getExposeInterfaceDetails('',
              acId, interfaceType, '', interfaceId,SubConnectorCreationMode.MANUAL, interfaceExposedMode);
            if(subConenctionId)
            {
              sidePanelinterfaceDetails.serverInterfaceId.subConnectionId=subConenctionId;
            }
            interfaceDetails = getserverInterfaceDetails(sidePanelinterfaceDetails);
        }
        return interfaceDetails;
    }
     /*
    *
    * Get exposed side panel data
    *
    */
    private getExposedSidePanelData(nodeId: string, interfaceType: string, interfaceId: string, interfaceExposedMode: SubConnectorCreationMode,
        isClientInterface: boolean): ISidePanel {
        const deviceDetails = this.dataService.getNodeByID(nodeId);
        return {
            deviceId: deviceDetails.deviceId,
            automationComponentId: deviceDetails.id,
            interfaceId: interfaceId,
            interfaceExposedMode: interfaceExposedMode,
            subConnectionId: getSubConnectionID(deviceDetails.id, interfaceType, interfaceId),
            isClientInterface: isClientInterface
        };
    }
     /*
    *
    * Get exposed client interface data
    *
    */
    private getExposedClientInterfaceData(NodeId: string, interfaceId: string, exposingInterface: ISidePanel,
        interfaceExposedMode: SubConnectorCreationMode): AreaClientInterface | AreaInterface {
        const deviceDetails = this.dataService.getNodeByID(NodeId);
        return this.dataService.getAreaClientInterfaces(
            deviceDetails.deviceId,deviceDetails.id,interfaceId,
            exposingInterface.subConnectionId,interfaceExposedMode);
    }
       /*
    *
    * Get exposed server interface data
    *
    */
    private getExposedServerInterfaceData(NodeId: string, interfaceId: string, exposingInterface: ISidePanel,
        interfaceExposedMode: SubConnectorCreationMode): AreaClientInterface | AreaInterface {
        const deviceDetails = this.dataService.getNodeByID(NodeId);
        return this.dataService.getAreaServerInterfaces(
            deviceDetails.deviceId,
            deviceDetails.id,
            interfaceId,
            exposingInterface.subConnectionId,
            interfaceExposedMode);
    }

    /**
     * @interfaceDetails // SidePanel and InterfaceDetails of exposing node
     * @exposeFromAreaId //Area which is having node and exposing start from here(This ID will change during recursion)
     * @exposeToAreaId // Expose end here
     * @targetNodeId // Node Id which is going to expose
     * @initialExposeAreaId // Area which is having targetNode
     * @subConnectionIds  //SubConnection Ids for exposed connections
     */
    updateExposedInterfaceUptoTargetArea(exposeFromAreaId: string,
        targetNodeId: string,
        interfaceDetails: InterfaceDetails,
        InitialExposeAreaId: string,
        //common Parent where actually connection will be created
        exposeToAreaId: string,
        subConnectionIds?: SubConnectionIdList): SubConnectionIdList {
        subConnectionIds = subConnectionIds || { clientIds: [], serverIds: [] } as SubConnectionIdList;
        if (exposeFromAreaId === exposeToAreaId) {
            return subConnectionIds;
        }
        this.updateParentInterfaces(
            interfaceDetails,
            exposeFromAreaId,
            exposeToAreaId,
            targetNodeId,
            subConnectionIds,
            InitialExposeAreaId);
        const areaDetails = { ...this.dataService.getAllAreas().find(area => area.id === exposeFromAreaId) };
        return this.updateExposedInterfaceUptoTargetArea(areaDetails.parent,targetNodeId,
            interfaceDetails,InitialExposeAreaId,exposeToAreaId,subConnectionIds);
    }

    /**
     * @interfaceDetails // SidePanel and InterfaceDetails of exposing node
     * @exposeFromAreaId //Area which is having node and exposing start from here(This ID will change during recursion)
     * @exposeToAreaId // Expose end here
     * @targetNodeId // Node Id which is going to expose
     * @initialExposeAreaId // Area which is having targetNode
     */
    private updateParentInterfaces(interfaceDetails: InterfaceDetails,
        exposeFromAreaId: string,
        exposeToAreaId: string,
        targetNodeId: string,
        subConnectionIds: SubConnectionIdList,
        initialExposeAreaId: string) {
        subConnectionIds = subConnectionIds || { clientIds: [], serverIds: [] } as SubConnectionIdList;
        const childArea = this.dataService.getAllAreas().find(area => area.parent === exposeFromAreaId);
        const targetNodeDetails:Node=this.facadeService.dataService.getNodeByID(targetNodeId);
        // creating subConnection id
        let nodeIdForSubConnection = childArea?.id;
        if (initialExposeAreaId === exposeFromAreaId && targetNodeDetails.parent === initialExposeAreaId) {
            //Area which is having targetNode, then subConnection id is the combination of nodeId and InterfaceType
            //Otherwise areaId and InterfaceType
            nodeIdForSubConnection = targetNodeId;
        }
        /**
         * SubConnection Id creation logic goes here
         */
        if (childArea?.parent !== exposeToAreaId) {
            // interfaceDetails, nodeIdForSubConnection, areaKey, subConnectionIds
            this.facadeService.subConnectorService.updateSubConnector(
                interfaceDetails,
                nodeIdForSubConnection,
                exposeFromAreaId,
                subConnectionIds
            );
        }
        this.plantAreaService.updateInterfaceDetailsToServiceNStore(exposeFromAreaId, interfaceDetails);
    }
    /*
    *
    * Updates the nodes in Editor
    *
    */
    updateNodesInEditor(dragNodeKey: string, dropNodeKey: string, interfaceDetails?: ISidePanel) {
        const dragNodeEntity = this.fillingLineData?.entities[dragNodeKey];
        let dropNodeEntity = this.fillingLineData?.entities[dropNodeKey];
        if (!dropNodeEntity) {
            dropNodeEntity = { id: dropNodeKey } as FillingArea | FillingNode;
        }
        const dragOPCNode: OPCNode = this.editorService.liveLinkEditor.editorNodes.find(node => node.id === dragNodeKey) as OPCNode;
        if (dragOPCNode) {
            dragOPCNode.parent = dropNodeEntity.id;
            this.opcNodeService.updateNodeMoveData(dragOPCNode, interfaceDetails);
            this.drawService.assignNodetoArea(dragOPCNode, dropNodeEntity.id);
            this.fillingLineService.updateNode(dragOPCNode.id, { parent: dropNodeEntity.id, x: dragNodeEntity.x, y: dragNodeEntity.y });
        } else {
            this.fillingLineService.updateNode(dragNodeEntity.id, { parent: dropNodeEntity.id });
            this.drawService.updateAreaReassignment(dragNodeEntity as FillingNode, dropNodeEntity.id);
        }
    }

    /*
    *
    * Update area filling line
    *
    */
    updateAreaFillingLine(dragDropNodeDetails: DragDropData, selectedItems: TreeNode[]) {
        let fillingNodeIdList: string[];
        if (dragDropNodeDetails.dropNodeChildNodeIds.length > 0) {
            fillingNodeIdList = [...Object.values(dragDropNodeDetails.dropNodeChildNodeIds)] as unknown as string[];
        }
        else {
            fillingNodeIdList = [];
        }
        if (selectedItems) {
            selectedItems.forEach(dragNode => {
                fillingNodeIdList.push(dragNode?.data?.id);
            });
        } else {
            fillingNodeIdList.push(dragDropNodeDetails.dragNodeId);
        }

        this.plantAreaService.updateArea(dragDropNodeDetails.dropNodeId, { nodeIds: fillingNodeIdList });
    }
    /*
    *
    * update area filling line drag node
    *
    */
    updateAreaFillingLineDragNode(dragDropNodeDetails: DragDropData, selectedItems: TreeNode[], previousParentArea?) {
        const fillingNodeIdDragList = [];
        if (selectedItems && previousParentArea) {
            selectedItems.forEach((dragNode, index) => {
                this.facadeService.plantAreaService.removeNodeIdfromArea(previousParentArea[index], dragNode.key);
            });
        }
        else {
            this.facadeService.plantAreaService.removeNodeIdfromArea(previousParentArea, dragDropNodeDetails.dragNodeId);
        }
    }
    /*
    *
    * Get source target device
    *
    */
    getSourceTargetDevice(areaHierarchy: AreaHierarchy, sourceAcId: string, targetAcId: string, device) {
        let sourceHierarchy = areaHierarchy.sourceAreaHierarchy;
        let targetHierarchy = areaHierarchy.targetAreaHierarchy;
        /* Swapping accordingly based on target/drop-node interface type(client/server) */
        if (device.isClientInterface && sourceAcId !== device.automationComponentId) {
            [sourceHierarchy, targetHierarchy] = [targetHierarchy, sourceHierarchy];
            [sourceAcId, targetAcId] = [targetAcId, sourceAcId];
        } else {
            if (!device.isClientInterface && device.automationComponentId !== targetAcId) {
                [sourceHierarchy, targetHierarchy] = [targetHierarchy, sourceHierarchy];
                [sourceAcId, targetAcId] = [targetAcId, sourceAcId];
            }
        }
        return {sourceHierarchy,targetHierarchy,sourceAcId,targetAcId};
    }

    /*
    *
    * returns the areaname based on area id
    *
    */
    getAreaName(areaId: string, deviceId:string, acId: string) {
        const areaDetails = this.dataService.getArea(areaId);
        if (areaDetails) {
            return this.dataService.getArea(areaId)?.name;
        }
        return this.dataService.getAutomationComponent(deviceId,acId)?.name;
    }
    /*
    *
    * loop through the areas in recursive way
    *
    */
    recurseNestedArea(node) {

        node.forEach(treeNode => {
            if (treeNode.type === FillingLineNodeType.AREA) {
                this.nestedAreas.push(treeNode);
            }
            if (treeNode?.children?.length > 0) {
                this.recurseNestedArea(treeNode.children);
            }
        });
    }
    /*
    *
    * Show a confirmation popup before deleting areas
    *
    */
    deleteAreaConfirmation(nodeData: TreeNode) {
        if (nodeData && nodeData.data && !nodeData.parent) {
            const parent = nodeData.data.parent;
            nodeData.parent = getParent(this.menuTreeData.children, parent);
            if (parent === ROOT_EDITOR) {
                nodeData.parent = this.menuTreeData;
            }
        }
        const areaId = nodeData.key;
        const parentArea = this.facadeService.dataService.getArea(areaId).parent;
        this.nestedAreas = [];
        this.recurseNestedArea(nodeData.children);
        this.nestedAreas.reverse();
        this.nestedAreas.push(nodeData);
        const msg = this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.message.deleteAreas',{value:nodeData.label });
        this.overlayService.confirm({
            message: { content: [msg] },
            header: this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.header'),
            successLabel: this.facadeService.translateService.instant('common.buttons.yes'),
            optionalLabel: this.facadeService.translateService.instant('common.buttons.no'),
            acceptCallBack: () => {
                this.nestedAreas.forEach((areaData: TreeNode) => {
                    this.removeSubConnection(DeleteSubConnectionByType.AREA, areaData.key);
                    this.drawService.deleteArea(areaData.key);
                });

                this.setBreadCrumAfterAreaDelete(parentArea,nodeData.parent);
                this.commonService.changePanelData(null);
            }
        });
    }
    /*
    *
    * show confirmation popup before ungroup
    *
    */
    unGroupAreaConfirmation(node: TreeNode) {
        this.overlayService.confirm({
            message: { content: [this.facadeService.translateService.instant('overlay.confirm.ungroup.message.content',{label :node.label})] },
            header: this.facadeService.translateService.instant('overlay.confirm.ungroup.header'),
            successLabel: this.facadeService.translateService.instant('common.buttons.yes'),
            optionalLabel: this.facadeService.translateService.instant('common.buttons.no'),
            acceptCallBack: () => {
                const { data: { nodeIds = [] } } = node;
                if (nodeIds.length > 0) {
                    this.unGroupAreaHavingNodeID(node, nodeIds,this.menuTreeData);
                }
                else {
                    this.unGroupAreaWithOutNodeID(node, this.menuTreeData);
                }
                this.removeSubConnection(DeleteSubConnectionByType.UNGROUP, node.key);
                this.facadeService.drawService.resizeCanvas();
            }
        });
    }
    /*
    *
    * Reorder area
    *
    */

    reOrderArea(dragDropNodeDetails: DragDropData, selectedNodeItems: TreeNode[]) {
        this.selectedItems = selectedNodeItems;
        if(this.selectedItems !== null && this.selectedItems.length ===1 && this.selectedItems[0].key !== dragDropNodeDetails.dragNodeId){
            this.selectedItems = [];
        }
        const selectedItems: TreeNode[] = (this.selectedItems?.filter(item => item.key !== dragDropNodeDetails.dropNodeId && item.key !== ROOT_EDITOR));
        if (dragDropNodeDetails.dragNodeParentId !== dragDropNodeDetails.dropNodeId && dragDropNodeDetails.dragNodeId !== dragDropNodeDetails.dropNodeId) {
            if (this.selectedItems?.length === 1 && this.selectedItems[0].type === FillingLineNodeType.AREA
                && this.selectedItems[0].key !== dragDropNodeDetails.dragNodeId
            ) {
                this.addSingleAutomationComponentToArea(dragDropNodeDetails);
            } else {
                this.reorderMultipleAreas(selectedItems,dragDropNodeDetails);
            }
        }
        this.facadeService.drawService.resizeCanvas();
    }
    /*
    *
    * Reordering multiple areas
    *
    */
    reorderMultipleAreas(selectedItems,dragDropNodeDetails){
        if (selectedItems && selectedItems.length > 0) {
            const previousParents = [];
            selectedItems.forEach(dragNode => {
                this.updateNodeDetails(dragDropNodeDetails, dragNode, previousParents);
            });
            this.updateAreaFillingLine(dragDropNodeDetails, selectedItems);
            this.updateAreaFillingLineDragNode(dragDropNodeDetails, selectedItems, previousParents);
        }
        else {
            this.addSingleAutomationComponentToArea(dragDropNodeDetails);
        }
    }
    /*
    *
    * update node details
    *
    */
    updateNodeDetails(dragDropNodeDetails: DragDropData, dragNode: TreeNode, previousParents: string[]) {
        let previousParentArea: string;
        dragDropNodeDetails.dragNodeId = dragNode.key;
        if (dragNode.type !== FillingLineNodeType.AREA) {
            previousParentArea = this.dataService.getNodeByID(dragDropNodeDetails.dragNodeId).parent;
            this.updateNodesInEditor(dragDropNodeDetails.dragNodeId, dragDropNodeDetails.dropNodeId);
            previousParents.push(previousParentArea);
        } else {
            previousParentArea = this.dataService.getArea(dragDropNodeDetails.dragNodeId).parent;
            previousParents.push(previousParentArea);
            this.updateAreaInEditor(dragDropNodeDetails.dragNodeId, dragDropNodeDetails.dropNodeId);

        }
        const dragNodeFillingArea = this.fillingLineData?.entities[dragDropNodeDetails.dragNodeId];
        this.updateNodeConnectionsToArea(dragNodeFillingArea, previousParentArea) as unknown as ISidePanel;
    }

    /*
    *
    * add single AC to area
    *
    */
    addSingleAutomationComponentToArea(dragDropNodeDetails: DragDropData) {
        if ((dragDropNodeDetails.dragNodeType === FillingLineNodeType.AREA || dragDropNodeDetails.dragNodeType === FillingLineNodeType.NODE)
            && (dragDropNodeDetails.dropNodeType === FillingLineNodeType.AREA || dragDropNodeDetails.dropNodeType === FillingLineNodeType.HEADER)) {
            const dragNodeFillingArea = this.fillingLineData?.entities[dragDropNodeDetails.dragNodeId];
            let previousParent;
            if (dragDropNodeDetails.dragNodeType === FillingLineNodeType.AREA) {
                previousParent = this.dataService.getArea(dragDropNodeDetails.dragNodeId)?.parent;
                this.updateAreaInEditor(dragDropNodeDetails.dragNodeId, dragDropNodeDetails.dropNodeId);
            } else {
                previousParent = this.dataService.getNodeByID(dragDropNodeDetails.dragNodeId).parent;
                this.updateNodesInEditor(dragDropNodeDetails.dragNodeId, dragDropNodeDetails.dropNodeId);
            }
            this.updateNodeConnectionsToArea(dragNodeFillingArea, previousParent) as unknown as ISidePanel;
            this.updateAreaFillingLine(dragDropNodeDetails, null);
            this.updateAreaFillingLineDragNode(dragDropNodeDetails, null, previousParent);
        }
    }
    /**
     * dragNode - selected and dragged node
     * dropNode - area to be dropped/target
     */
    updateAreaInEditor(dragNodeKey:string, dropNodeKey:string) {
        const dragOPCNode: OPCNode = this.editorService.liveLinkEditor.editorNodes.find(node => node.id === dragNodeKey) as OPCNode;
        const dragNodeEntity = this.fillingLineData?.entities[dragNodeKey];
        const areas = this.dataService.getAllAreas();
        if (dragOPCNode) {
            dragOPCNode.parent = dropNodeKey;
            const dragNodeArea = areas.find(area => area.id === dragNodeKey);
            dragNodeArea.parent = dropNodeKey;
            this.dataService.updateArea(dragOPCNode.id, dragNodeArea);
            this.fillingLineService.updateArea(dragOPCNode.id, { parent: dropNodeKey, x: dragNodeEntity.x, y: dragNodeEntity.y });
            this.updateNodesInEditor(dragNodeKey, dropNodeKey);
        } else {
            // if editor is not inside the nested area.
            // dragOPCNode will be undefined.
            this.fillingLineService.updateNode(dragNodeKey, { parent: dropNodeKey });
            const dragNodeArea = areas.find(area => area.id === dragNodeKey);
            dragNodeArea.parent = dropNodeKey;
            this.dataService.updateArea(dragNodeKey, dragNodeArea);
            this.drawService.updateAreaReassignment(dragNodeEntity as FillingNode, dropNodeKey);
        }

    }
    /*
    *
    * validate common parent with current editor
    *
    */
    validateCommonParentWithCurrentEditor(areaId: string): string {
        const currentEditor = this.facadeService.editorService.getEditorContext().id;
        const parentArea = this.facadeService.dataService.getArea(areaId)?.parent;
        if (parentArea) {
          if (parentArea === currentEditor) {
            return parentArea;
          } else {
            return this.validateCommonParentWithCurrentEditor(parentArea);
          }
        }
        return '';
    }
    /*
    *
    * update parent of area if the data is missing
    *
    */
    updateParentIfMissing(treeData){
        for (const element of treeData) {
            if(!element?.parent && element.type === FillingLineNodeType.AREA){
                const parent  = getParent(this.facadeService.areaUtilityService.menuTreeData.children,  element.data.parent) || 'ROOT';
                element.parent = parent;

                if(element.children.length){
                    this.updateParentIfMissing(element.children);
                }
                if(element.parent === ROOT_EDITOR){
                    element.parent =  this.facadeService.areaUtilityService.menuTreeData;
                }
                if(!element.parent.parent){
                  this.updateParentIfMissing([element.parent]);
              }
            }
        }
        return treeData;
    }
}

   /*
    *
    * map hierarchy details
    *
    */
const mapAreaHierarchyDetails = (sourceAreaHierarchy: string[], targetAreaHierarchy: string[], commonParentAreaIds: string[]): AreaHierarchy => {
    let commonParent = ROOT_EDITOR;
    if (commonParentAreaIds.length) {
        commonParent = commonParentAreaIds[commonParentAreaIds.length - 1];
    }
    return {
        commonParent,sourceAreaHierarchy,targetAreaHierarchy};
};





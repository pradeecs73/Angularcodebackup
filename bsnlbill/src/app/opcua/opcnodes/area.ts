/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FacadeService } from '../../livelink-editor/services/facade.service';

import { DragDropAttribute, FillingLineNodeType, InterfaceCategory, NodeAttributes } from '../../enum/enum';
import { InterfaceDetails } from '../../models/connection.interface';
import { Area, AreaInterfacePayload, Node } from '../../models/models';
import { PanelDataType } from '../../models/monitor.interface';
import { AreaClientInterface, AreaInterface, ISidePanel } from '../../models/targetmodel.interface';
import { FillingArea } from '../../store/filling-line/filling-line.reducer';
import { ROOT_EDITOR } from '../../utility/constant';
import {select,Selection} from '../../../app/vendors/d3.module';
import { HTMLNode, HTMLNodeService } from './htmlNode';
import { NodeAnchor } from './node-anchor';


export class PlantArea extends HTMLNode implements FillingArea {
  /*
  *
  * Variables for the plant area are declared here
  */
  type: FillingLineNodeType.AREA = FillingLineNodeType.AREA;
  nodeIds: Array<string>;
  connectionIds: string[];
  clientInterfaceIds: ISidePanel[];
  serverInterfaceIds: ISidePanel[];
  nodes: Node[];
  key?:string;
  repositionRequired = false;

  clientInterfaces: Array<AreaClientInterface>;
  serverInterfaces: Array<AreaInterface>;

  constructor(areaNode, fillingAreaData: FillingArea, protected readonly facadeService: FacadeService) {
    super(facadeService);
    this.element = areaNode.node();
    this.node = areaNode;
    this.updateFillingLineData(fillingAreaData);
    this.element.setAttribute('data-drag', `${this.id}:${this.dragType}`);
    this.element.classList.add(DragDropAttribute.CAN_DROP_NODES);
  }
 /*
  *
  * Function to update filling line data
  */
  updateFillingLineData(fillingAreaData: FillingArea | Partial<FillingArea>) {
    const data = { ...this, ...fillingAreaData };
    this.id = data.id;
    this.name = data.name;
    this.serverInterfaces = data.serverInterfaces;
    this.clientInterfaces = data.clientInterfaces;
    this.clientInterfaceIds=data.clientInterfaceIds || [];
    this.serverInterfaceIds=data.serverInterfaceIds || [];
    this.x = data.x;
    this.y = data.y;
    this.selected = data.selected;
    this.repositionRequired = fillingAreaData.repositionRequired;
  }
}

@Injectable({
  /*
  * Plant area service is injected at root level
  */
  providedIn: 'root'
})
export class PlantAreaService extends HTMLNodeService {
  selectedAreaInEditor:TreeNode;
  constructor(
    protected readonly facadeService: FacadeService
    ) {
    super(facadeService);
  }
 /*
  *
  * Function to create area
  */
  createArea(areaElement: Selection<SVGGElement, unknown, null, undefined>, areObj: FillingArea) {
    const area = new PlantArea(areaElement, areObj,this.facadeService);
    if (area.selected === true) {
      this.facadeService.editorService.selectedNode = area;
    }
    /*Client Interfaces
    */
    area.inputs = this.addAnchors(area, true);
    /*Server Interfaces
    */
    area.outputs = this.addAnchors(area, false);
    area.parent = areObj.parent;
    this.facadeService.editorService.addHTMLNode(area);
    //Removed 'area.repositionRequired check' fix overlap issue while creating the area no side effects found with other opearations
    this.updateAreaElement(area);
    this.assignInterfaceClickEvent(area);
    this.updateNodeAnchors();
  }

  updateNodeAnchors() {
    this.facadeService.editorService.liveLinkEditor.editorNodes.forEach(node => {
      if (node) {
        node.updateAnchors();
      }
    });
  }
  /*
  *
  * Function to update area
  */
  updateArea(areaId: string, fillingLineData: FillingArea | Partial<FillingArea>, areaNode?: PlantArea) {
    if (areaNode) {
      this.updateFillingLineData(areaNode, fillingLineData);
    }
    this.facadeService.fillingLineService.updateArea(areaId, fillingLineData);
    this.facadeService.dataService.updateArea(areaId, fillingLineData);
  }
  /*
  *
  * Function to update filling line data
  */
  updateFillingLineData(area:PlantArea,fillingLineData: FillingArea| Partial<FillingArea>)
  {
    area.updateFillingLineData(fillingLineData);
    this.facadeService.editorService.updateHTMLNode(area);
  }
  /*
  *
  * Function to update area element
  */
  updateAreaElement(area: PlantArea) {
    super.updateAreaElement(area as HTMLNode);
    area.updateFillingLineData(area);
    this.facadeService.editorService.updateHTMLNode(area);
    this.facadeService.fillingLineService.updateArea(area.id, { element: area.element });
  }
  /*
  *
  * Function to update the node position data when node is moved
  */
  updateNodeMoveData(area: PlantArea) {
    super.updateNodeMoveData(area);
    area.updateFillingLineData(area);
    this.facadeService.fillingLineService.updateArea(area.id, { x: area.x, y: area.y, repositionRequired: false });
    this.facadeService.dataService.updateArea(area.id,area);
  }
  /*
  *
  * Function to update area interface
  */
  updateAreaInterfaces(area: PlantArea) {
    area.inputs = this.addAnchors(area, true);
    area.outputs = this.addAnchors(area, false);
    this.facadeService.editorService.updateHTMLNode(area);
     if(area)
     {
       area.updateAnchors();
     }
    this.updateAreaElement(area);
    this.assignInterfaceClickEvent(area);
  }
  /*
  *
  * Function to recurse tree data
  */
  recurseTreeData(node, areaId) {
    node.forEach(treeNode => {
      if (treeNode.key === areaId) {
        this.selectedAreaInEditor=treeNode;
      }

      if (treeNode && treeNode.children && treeNode.children.length > 0) {
        this.recurseTreeData(treeNode.children, areaId);
      }

    });
  }
  /*
  *
  * Function to update bread crumb data
  */
  updateBreadCrumData(nodeData:TreeNode) {
    if (nodeData.key === ROOT_EDITOR) {
      this.facadeService.editorService.selectedAreaData({ id: nodeData.key, name: '' });
    }
    else {
       const updatedNodeDataWithParent = this.facadeService.areaUtilityService.updateParentIfMissing([nodeData])[0];
       const selectedAreaId = { id: updatedNodeDataWithParent.key,
        name: updatedNodeDataWithParent.label,
        parentLabels:this.breadcrumbForArea(updatedNodeDataWithParent)};
        this.facadeService.editorService.selectedAreaData(selectedAreaId);
    }
  }
  /*
  *Function to update bread crumb when we go inside an area
  */
  breadcrumbForArea(node:TreeNode) {
    return [{ ...node }, ...(this.getParentLabel(node))];
  }
  /*
  *
  * Function returns the parent of the node
  */
  private getParentLabel(node: TreeNode) {
    if (node.parent) {
      return this.breadcrumbForArea(node.parent);
    }
    return [];
  }

  /*
  *
  * Function is executed when html node is clicked
  */
  protected onClickHtmlNode(node: HTMLNode) {
    super.onClickHtmlNode(node);
    const nodeHeader = select(node.element).select(`#${NodeAttributes.NODEHEADER}`);
        nodeHeader.on('dblclick', () => {
            this.selectNode(node);
            this.facadeService.editorService.selectedNode = node;
            const selectedArea = { id: node.id, name: node.name };
            this.facadeService.editorService.selectedAreaData(selectedArea);
            this.recurseTreeData(this.facadeService.editorService.menuTreeData.children,node.id);
            this.updateBreadCrumData(this.selectedAreaInEditor);
            this.facadeService.commonService.changePanelData(null);
        });
  }
  /*
  *
  * Function assigns click event for interfaces
  */
  assignInterfaceClickEvent(node) {
    if(node.inputs || node.outputs){
      node.inputs.forEach((anchor: NodeAnchor) => {
        this.onSubNodeClick(node, anchor.interfaceData as AreaClientInterface);
        return anchor;
      });
      node.outputs.forEach((anchor: NodeAnchor) => {
        this.onSubNodeClick(node, anchor.interfaceData as AreaClientInterface);
        return anchor;
      });
    }
  }
  /*
  *
  * Function assigns click event when node element is clicked
  */
  onSubNodeClick(node, subNodeData: AreaClientInterface) {
    const subNode = select(node.element).select('#box-' + subNodeData.id);
    subNode.on('click', () => {
      let interfaceType = InterfaceCategory.SERVER_INTERFACE;
      if (subNodeData.connectionEndPointDetails) {
        interfaceType = InterfaceCategory.CLIENT_INTERFACE;
      }
      const devicestate= this.facadeService.dataService.getDeviceState(subNodeData.deviceId);
      const interfaceProperties: PanelDataType =
       this.facadeService.dataService.mapPanelDataForInterfaceMonitoring(
        subNodeData,
        interfaceType,
        devicestate,
        node.type
       );
      this.facadeService.commonService.changePanelData(interfaceProperties);
      this.facadeService.editorService.emptySelectedConnection();
    });
  }
  /*
  *
  * Function updates the area interface data
  */
  updateAreaInterfaceData(sidePanelData: ISidePanel) {
    if (sidePanelData) {
        const areaId = this.facadeService.editorService.getEditorContext().id;
        const areaData = { ...this.facadeService.dataService.getArea(areaId) };
        if (areaData) {
            /**Assign Proper Type */
            let payload:AreaInterfacePayload = {};
            if (sidePanelData.isClientInterface) {
                const existingData = areaData.clientInterfaceIds?.filter(ci => ci.interfaceId !== sidePanelData.interfaceId) || [];
                payload = { clientInterfaceIds: [...existingData, sidePanelData] };
                areaData.clientInterfaceIds = payload.clientInterfaceIds;
                payload.clientInterfaces = this.facadeService.dataService.getClientInterfaceList(areaData);
            } else {
                const existingData = areaData.serverInterfaceIds?.filter(si => si.interfaceId !== sidePanelData.interfaceId) || [];
                payload = { serverInterfaceIds: [...existingData, sidePanelData] };
                areaData.serverInterfaceIds = payload.serverInterfaceIds;
                payload.serverInterfaces = this.facadeService.dataService.getServerInterfaceList(areaData);
            }
            this.updateArea(areaId, payload);
        }
    }
  }
  /*
  *
  * Function updates interface details to service and store
  */
  updateInterfaceDetailsToServiceNStore(exposeFromAreaId: string, interfaceDetails: InterfaceDetails, mode = 'add') {
    this.facadeService.dataService.updateInterfaceIds(exposeFromAreaId, interfaceDetails, mode);
    const latestArea = { ...this.facadeService.dataService.getArea(exposeFromAreaId) };
    const clientInterface = this.facadeService.dataService.getClientInterfaceList(latestArea) || [];
    const serverInterface = this.facadeService.dataService.getServerInterfaceList(latestArea) || [];
    const dropParentArea = this.facadeService.editorService.liveLinkEditor.editorNodes.find(node => node.id === exposeFromAreaId) as PlantArea;
    this.updateArea(exposeFromAreaId, {
        clientInterfaces: clientInterface,
        clientInterfaceIds: latestArea.clientInterfaceIds || [],
        serverInterfaces: serverInterface,
        serverInterfaceIds: latestArea.serverInterfaceIds || []
    } as Partial<FillingArea>,
        dropParentArea);
   }
  /*
  *
  * Function updates node ids in area data
  */
  updateNodeIdsInAreaData(nodeId: string) {
    if (this.facadeService.editorService.getEditorContext().id === ROOT_EDITOR) {
        return;
    }
    else {
        const areaData = { ...this.facadeService.dataService.getArea(this.facadeService.editorService.getEditorContext().id) };
        const filteredNodeIds = areaData.nodeIds.filter(id => id !== nodeId);
        this.updateArea(areaData.id, { nodeIds: filteredNodeIds });
    }
  }
  /*
  *
  * Function remove  the node id from area
  */
  removeNodeIdfromArea(areaId: string, nodeId: string) {
    const areaData = { ...this.facadeService.dataService.getArea(areaId) };
    if (areaData) {
        areaData.nodeIds = areaData.nodeIds?.filter(id => id !== nodeId) || [];
        this.updateArea(areaId, { nodeIds: areaData.nodeIds });
    }
  }
  /*
  *
  * Function returns the parent area of the area using id
  */
  getParentOfAreaByAreaId(areaId: string, areaDetails: Area[]): Area[] {
    const areaData = { ...this.facadeService.dataService.getArea(areaId) };
    if (areaData) {
        areaDetails = [...areaDetails, areaData];
    }
    if (areaData && areaData.parent !== ROOT_EDITOR) {
        return this.getParentOfAreaByAreaId(areaData.parent, areaDetails);
    }
    return areaDetails;
  }
  /*
  *
  * Function removes all the connections from the editor
  */
  removeAllAreaConnectionsFromEditor(area: PlantArea) {
    area?.inputs?.forEach(
      anchor => {
        this.facadeService.nodeAnchorService.removeAllConnectionsFromEditor(anchor);
    });
    area?.outputs?.forEach(
      anchor => {
        this.facadeService.nodeAnchorService.removeAllConnectionsFromEditor(anchor);
    });
  }
}


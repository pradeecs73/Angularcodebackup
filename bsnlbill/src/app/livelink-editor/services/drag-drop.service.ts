/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injectable } from '@angular/core';
import interact from 'interactjs';
import { ROOT_EDITOR } from '../../../app/utility/constant';
import { AnchorAttribute, CursorAttributes, DragDropAttribute, DragDropClasses, FillingLineNodeType, Numeric } from '../../enum/enum';
import { DragDropData, NodeIdsToRemove } from '../../models/models';
import { ISidePanel, SelectedAutomationComponent } from '../../models/targetmodel.interface';
import { PlantAreaService } from '../../opcua/opcnodes/area';
import { HTMLNode } from '../../opcua/opcnodes/htmlNode';
import { ProjectDataService } from '../../shared/services/dataservice/project-data.service';
import { FillingArea } from '../../store/filling-line/filling-line.reducer';
import { log, validateDragDropAccess } from '../../utility/utility';
import { OPCNode } from './../../opcua/opcnodes/opcnode';
import { EditorService } from '../../opcua/opcua-services/livelink-editor.service';
import { AreaUtilityService } from './../../services/area-utility.service';
import { CommonService } from './../../services/common.service';
import { FillingLineService } from './../../services/filling-line-store.service';
import { FacadeService } from './facade.service';


@Injectable({
  providedIn : 'root'
})
export class DragDropService {

  selectedData: SelectedAutomationComponent;
  position = { x: 0, y: 0 };

  private readonly areaUtilityService: AreaUtilityService;

  constructor(private readonly common: CommonService,
    private readonly fillingLineService: FillingLineService,
    private readonly editorService: EditorService,
    private readonly dataService: ProjectDataService,
    private readonly plantAreaService: PlantAreaService,
    private readonly facadeService: FacadeService) {
      this.areaUtilityService = facadeService.areaUtilityService;
    }


  /*
  *
  * Drag event from the left side panel
  */
  drag = () => {
    interact(DragDropAttribute.TREEROOT).draggable({
      //autoScroll: true,
      listeners: {
        start(event) {
           /*
          *indicate no drop allowed
          */
          event.target.classList.add(CursorAttributes.NODROP);
        },
        move: event => this.onMovingTheNode(event),
        /* when the interaction end
        */
        end : event =>this.interactionEnd(event, this)
      }
    });
    interact(DragDropAttribute.TREEROOT)
      .draggable({ manualStart: true })
      .on('move', event => {
        if (validateDragDropAccess(this.facadeService.applicationStateService.getStatus(), this.facadeService.dataService.accessType)) {
          this.dragNodeToEditor(event);
        }
      });
  }
/*
  *
  * Drag from left side panel
  */
  dragFromTreeMenu() {
    interact(DragDropAttribute.TREE_NODE_CONTENT).draggable({
      //autoScroll: true,
      listeners: {
        move: event => this.onMovingTheNode(event),
        /*
        * When the interaction end
        */
        end : event=> this.interactionEnd(event, this)
      }
    });
    interact(DragDropAttribute.TREE_NODE_CONTENT)
      .draggable({ manualStart: true })
      .on('move', event => {
        if (validateDragDropAccess(this.facadeService.applicationStateService.getStatus(), this.facadeService.dataService.accessType)) {
          this.dragNodeToEditor(event);
        }
      });
  }

  onMovingTheNode(event){
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    /*
    *translate the element
    */
    target.style.webkitTransform = target.style.transform = `translate(${x}px,${y}px)`;
    /*
    *update the posiion attributes
    */
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
  /*
  * When the interaction end
  */
  interactionEnd(event, self) {
    const target = event.target;
    target.remove();
    event.target.classList.remove(CursorAttributes.DRAGMOVE);
    /*
    * To reset the position
    */
    self.position.x = 0;
    self.position.y = 0;
  }
 /*
  * Drop to editor page
  */
  drop() {

    interact('#myCanvas').dropzone({
      /*
      *only accept elements matching this CSS selector
      */
      accept: `${DragDropAttribute.TREEROOT},${DragDropAttribute.TREE_NODE_CONTENT}`,
      /*
      *Require a 75% element overlap for a drop to be possible
      */
      overlap: 0.75,
      /*
      *listen for drop related events:
      */
      ondropactivate(_event) {
        /*
        *add active dropzone feedback
        */
      },

      ondragenter(event) {
        const draggableElement = event.relatedTarget;
        const dropzoneElement = event.target;
        log('drop', dropzoneElement);
        /*
        *feedback the possibility of a drop
        */
        dropzoneElement.classList.add(DragDropAttribute.DROPTARGET);
        draggableElement.classList.add('can-drop');
        /*draggableElement.textContent = 'Dragged in'
        *
        */
      },

      ondragleave(event) {
        /*
        *remove the drop feedback style
        */
        event.target.classList.remove(DragDropAttribute.DROPTARGET);
        event.relatedTarget.classList.remove('can-drop');
        /*
        *event.relatedTarget.textContent = 'Dragged out'
        */
      },

      ondrop: event => {
        if (validateDragDropAccess(this.facadeService.applicationStateService.getStatus(), this.facadeService.dataService.accessType)) {

        if (event.relatedTarget.classList.contains('p-treenode-content')){
          const editor = this.facadeService.editorService.getEditorContext();
          this.reOrderAreaNodeOnDrop(event, editor.id);
          return;
        }
        /*
        * this.common.isOnline -> check should be handled from online.app.state.ts.
        *The check has been introduced as a temporary solution since the existing code was not working.
        */
        if (!this.selectedData || this.common.isOnline) {
          return;
        }
        const offSetX = Numeric.TWONINETY;
        const offSetY = Numeric.ONEFOURTY;
        let x = (event.dragEvent.clientX - offSetX) / this.facadeService.zoomOperationsService.currentZoomScaleFactor;
        let y = (event.dragEvent.clientY - offSetY) / this.facadeService.zoomOperationsService.currentZoomScaleFactor;
        if(y < Numeric.TWENTY){
          y = Numeric.TWENTY;
       }
        this.facadeService.zoomOperationsService.currentZoomScaleFactor = Number(this.facadeService.zoomOperationsService.currentZoomScaleFactor);
        x = (x + this.facadeService.commonService.scrollLeft) - this.facadeService.commonService.mouseObject.left;
        y = (y + this.facadeService.commonService.scrollTop) - (this.facadeService.commonService.mouseObject.top);
        const nodeData = { ...this.selectedData };
        this.fillingLineService.createFillingNodeData(x, y, nodeData.automationComponent, this.editorService.getEditorContext().id, nodeData.adapterType);
        this.onDropToCanvas(nodeData);
      }
      },
      ondropdeactivate(event) {
        /*
        *remove active dropzone feedback
        */
        event.target.classList.remove(DragDropAttribute.DROPTARGET);
      }
    });
  }
  /*
  *
  * When its dropped to canvas
  */
  onDropToCanvas(nodeData){
    if (!this.facadeService.editorService.isRootEditor()) {
      const areaData = {...this.facadeService.dataService.getArea(this.facadeService.editorService.getEditorContext().id)};
      let fillingNodeIdList = areaData?.nodeIds || [];
      if (!fillingNodeIdList) {
        fillingNodeIdList = [];
      }
      const index = fillingNodeIdList.indexOf(nodeData.automationComponent.id);
      if (index !== -1) {
        fillingNodeIdList = [...fillingNodeIdList, nodeData.automationComponent.id];
        this.plantAreaService.updateArea(this.facadeService.editorService.getEditorContext().id, { nodeIds: Array.from(new Set(fillingNodeIdList)) });
      }
    }
    let htmlNode :HTMLNode;
    const nodes = this.facadeService.editorService.liveLinkEditor.editorNodes as unknown as OPCNode[];
    for (const value of nodes) {
      if (value.deviceId === nodeData.automationComponent.deviceId) {
        htmlNode = value;
      }
    }
    this.facadeService.htmlNodeService.updateNodeMoveData(htmlNode);
    this.facadeService.drawService.resizeCanvas();
  }
  /*
  * When the node is dragged to editor
  *
  */
  dragNodeToEditor(event) {
    const interaction = event.interaction;
    event.target.style.cursor = CursorAttributes.MOVE;
    /*
    * if the pointer was moved while being held down
    *and an interaction hasn't started yet
    */
    if (interaction.pointerIsDown && !interaction.interacting()) {
      const target = event.currentTarget;

      /*
      *create a clone of the currentTarget element
      */
      let clone = event.currentTarget.cloneNode(true);
      const targetBounding = target.getBoundingClientRect();

      /*
      *add dragging class
      */
      clone.classList.add(CursorAttributes.Dragging);
      clone.classList.remove(CursorAttributes.Dropped);

      /*
      *translate the element
      */
      clone.style.transform = 'translate(0px, 0px)';
      clone.style.position = 'absolute';

      clone.style.top = `${targetBounding.top + window.scrollY}px`;
      clone.style.left = `${targetBounding.left + window.scrollX}px`;

      /*
      *update the posiion attributes
      */
      clone.setAttribute('data-x', 0);
      clone.setAttribute('data-y', 0);
      if (event.currentTarget.classList.contains(DragDropClasses.PTREE_NODE_CONTENT)) {
        const dragEventTarget = [...event.currentTarget.children];
        const filteredElem = dragEventTarget?.filter(item => item.classList.contains(DragDropClasses.PTREE_NODE_LABEL));
        const nodeLabel = target.ariaLabel;
        const dragNodeId = filteredElem[0]?.querySelector(`.${DragDropClasses.HIDE_ID}`)?.innerText;
        clone = document.createElement('div');
        clone.style.cursor = CursorAttributes.MOVE;
        const spanEl = document.createElement('span');
        spanEl.innerHTML = nodeLabel;
        spanEl.ariaLabel = dragNodeId;
        spanEl.classList.add(DragDropClasses.NODE_ID);
        clone.classList.add(CursorAttributes.Dragging);
        clone.classList.remove(CursorAttributes.Dropped);
        clone.classList.add(DragDropClasses.PTREE_NODE_CONTENT);
        clone.classList.add(CursorAttributes.DRAGMOVE);
        const mousePoint = this.common.setMousePosition(event);
        clone.style.top = `${mousePoint.y+window.scrollY}px`;
        clone.style.left = `${mousePoint.x+window.scrollX}px`;
        clone.appendChild(spanEl);
        clone.style.transform = 'translate(0px, 0px)';
        clone.style.position = 'absolute';
      }

      /*
      *insert the clone to the page
      */
      document.body.appendChild(clone);

      /*
      *start a drag interaction targeting the clone
      */
      interaction.start({ name: 'drag' }, event.interactable, clone);
    }
  }
  /*
  *
  * When the node is dropped to left side panel
  */
  dropToFillingLine() {
    interact(`.${DragDropAttribute.CAN_DROP_NODES}`).dropzone({
      // only accept elements matching this CSS selector
      // only accept elements matching this CSS selector
      accept: `div.drag-dragging.editor-nodes,${DragDropAttribute.TREE_NODE_CONTENT}`,
      //accept: DragDropAttribute.DROPTARGET,
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.25,
      // listen for drop related events:
      ondropactivate(_event) {
        // add active dropzone feedback
      },

      ondragenter(event) {
        const dropzoneElement = event.target;
        // feedback the possibility of a drop
        dropzoneElement.classList.add(DragDropAttribute.CAN_DROP_HIGHLIGHT);
        // draggableElement.textContent = 'Dragged in'

      },

      ondragleave(event) {
        // remove the drop feedback style
        event.target.classList.remove(DragDropAttribute.CAN_DROP_HIGHLIGHT);
        // event.relatedTarget.textContent = 'Dragged out'
      },
      ondrop: event => {
        if (validateDragDropAccess(this.facadeService.applicationStateService.getStatus(), this.facadeService.dataService.accessType)) {

        this.editorService.isDropped(true);
        const fillingNodeIdList = [];
        const nodes = [... this.editorService.liveLinkEditor.editorNodes];
        const droppableAreaId = this.getDroppableAreaId(event);
        if (!droppableAreaId) {
          return;
        }
        const nodeIdsToRemove = [];
        const userSelectedNodes = nodes?.filter(node => node.element.classList.contains(DragDropAttribute.DRAGG_SELECTED));
        if (event.dragEvent.currentTarget.classList.contains(DragDropClasses.PTREE_NODE_CONTENT)) {
          /** LHS menu */
          this.reOrderAreaNodeOnDrop(event, droppableAreaId);
        } else {
          /** Drag selection flow */
          this.onDropToLeftSidePanel(userSelectedNodes,droppableAreaId,nodeIdsToRemove,fillingNodeIdList,event);
        }
      }
      },
      ondropdeactivate(event) {
        // remove active dropzone feedback
        event.target.classList.remove(DragDropAttribute.DROPTARGET);
        event.target.classList.remove(DragDropAttribute.CAN_DROP_HIGHLIGHT);
      }
    });
  }
/*
  *
  * When the node is dropped to left side panel
  */
  onDropToLeftSidePanel(userSelectedNodes:Array<HTMLNode>,droppableAreaId:string,nodeIdsToRemove:Array<NodeIdsToRemove>,fillingNodeIdList:Array<string>,event){
    for (const item of userSelectedNodes) {
      if (item.id !== droppableAreaId
        && this.validateDropOnMultipleNodeSelection(item.id, droppableAreaId)
        && droppableAreaId !== item.parent) {

        nodeIdsToRemove.push({
          nodeId: item.id,
          removeFrom: item.parent
        });

        const previousParent = this.facadeService.dataService.getNodeByID(item.id)?.parent || this.facadeService.dataService.getArea(item.id).parent;
        //update the Node or Area in editor service
        this.updateInEditor(item, droppableAreaId);
        //Keep connection while reorder
        this.areaUtilityService.updateNodeConnectionsToArea((item as OPCNode), previousParent) as unknown as ISidePanel;
        fillingNodeIdList.push(item.id);

        const areas = this.facadeService.dataService.getAllAreas();
        const selectedArea = areas.filter(areaItem => areaItem.id === droppableAreaId);

        fillingNodeIdList = [...fillingNodeIdList, ...selectedArea[0]?.nodeIds || []];

        event.target.classList.remove(CursorAttributes.NODROP);
      }
    }
    this.updateAreaDetails(fillingNodeIdList, droppableAreaId, nodeIdsToRemove);
  }
/*
  *
  * Rearrange the area when the node is dropped
  */
  reOrderAreaNodeOnDrop(event, dropAreaId: string) {
    const dragNodeEL = event.dragEvent.currentTarget.children[0];
    const dragNodeId = dragNodeEL?.ariaLabel;
    const reOrderNodeDetails: DragDropData = {
      dragNodeId,
      dropNodeId: dropAreaId,
      dragNodeParentId: this.facadeService.areaUtilityService.fillingLineData?.entities[dragNodeId].parent || '',
      dragNodeType: this.facadeService.areaUtilityService.fillingLineData?.entities[dragNodeId].type || '',
      dropNodeType: '',
      dropNodeChildNodeIds: []
    };
    if (dropAreaId === ROOT_EDITOR) {
      reOrderNodeDetails.dropNodeType = FillingLineNodeType.HEADER;
    }
    const dropNodeEntity = this.facadeService.areaUtilityService.fillingLineData?.entities[dropAreaId] as FillingArea;
    if (dropNodeEntity) {
      reOrderNodeDetails.dropNodeChildNodeIds = dropNodeEntity.nodeIds || [];
      reOrderNodeDetails.dropNodeType = dropNodeEntity.type;
    }
    const selectedTreeItems = this.facadeService.commonService.selectedMenuTreeItem.getValue();
    if (dragNodeId !== dropAreaId
      && reOrderNodeDetails.dropNodeType !== FillingLineNodeType.NODE
      && this.validateDropOnMultipleNodeSelection(dragNodeId, dropAreaId)
      && dropAreaId !== reOrderNodeDetails.dragNodeParentId) {
      this.facadeService.areaUtilityService.reOrderArea(reOrderNodeDetails, selectedTreeItems);
    }
  }
  /*
  *
  * Get the area id when the node is dropped
  */
  getDroppableAreaId(event) {
    const childElements = [...event?.target?.children];

    const filteredElem = childElements.filter(item => item.classList.contains('p-treenode-label'));
    let droppableAreaId = filteredElem[0]?.querySelector('.hide-id')?.innerText;
          droppableAreaId = this.extractAreaID(event, droppableAreaId);
          return droppableAreaId;
  }
  /*
  *
  * Update the area details
  */
  updateAreaDetails(fillingNodeIdList:string[],droppableAreaId:string,nodeIdsToRemove:{nodeId:string,removeFrom:string}[]) {
    if (fillingNodeIdList.length > 0) {
      const uniqueNodeIds = Array.from(new Set(fillingNodeIdList));
      this.facadeService.plantAreaService.updateArea(droppableAreaId, { nodeIds: uniqueNodeIds });
      nodeIdsToRemove.forEach(item => {
        this.facadeService.plantAreaService.removeNodeIdfromArea(item.removeFrom, item.nodeId);
      });
    }
  }
  /*
  *
  * Returns the area id
  */
  extractAreaID(event,droppableAreaId:string):string{
    if (event.target.classList.contains('device-node') && event.target.nodeName === 'g') {
      const nodeData = event.target.dataset?.drag?.split(':');
      droppableAreaId = nodeData[0];
    }
    return droppableAreaId;
  }

  /*
  *
  * Validates the drop(checks if the nodes are dropped to root or to same area) when multiple nodes are dropped
  */
  validateDropOnMultipleNodeSelection(dragNodeId, dropNodeId) {
    if (dropNodeId === ROOT_EDITOR) {
      return true;
    }
    const dropArea = {...this.dataService.getArea(dropNodeId)};
    if (dropArea.parent !== dragNodeId) {
      return this.validateDropOnMultipleNodeSelection(dragNodeId, dropArea.parent);
    } else {
      return false;
    }
  }
  /*
  *
  * Drop interface
  */
  dropInterface() {
    const self = this; //NOSONAR

    interact('#interface-side-panel').dropzone({
      // only accept elements matching this CSS selector
      accept: '.draggable-interface',
      // Require a 75% element overlap for a drop to be possible
      //overlap: 0.75,
      // listen for drop related events:
      ondragenter(event) {
        const { target: dropzoneElement } = event;
        const interfaceType = dropzoneElement.getAttribute('interfaceType');
        self.common.interFaceSidePanelArea = true;
        self.common.interFaceSidePanelType = interfaceType;
      },

      ondragleave(_event) {
        self.common.interFaceSidePanelArea = false;
        self.common.interFaceSidePanelType = '';
      },

      ondrop(event) {
        const { target: dropzoneElement, relatedTarget: draggedElement } = event;
        const interfaceType = dropzoneElement.getAttribute('interfaceType');
        // Validating interfaces with panels. i,e. Should drop interface with panels of same type.
        if (!draggedElement.ariaLabel.startsWith(interfaceType) || self.editorService.isRootEditor()) {
          return;
        }
        const sidePanelData: ISidePanel = JSON.parse(draggedElement.getAttribute('sidePanelData'));
        self.plantAreaService.updateAreaInterfaceData(sidePanelData);
      },

      ondropdeactivate(event) {
        event.relatedTarget.classList.remove(AnchorAttribute.MATCHINGINTERFACE);
        event.relatedTarget.classList.add('haveconnection');
      }
    });
  }
  /*
  *
  * Updates in editor
  */
  private updateInEditor(item:HTMLNode,droppableAreaId:string){
    if(item.type === FillingLineNodeType.AREA){
      this.facadeService.areaUtilityService.updateAreaInEditor((item as OPCNode).id, droppableAreaId);
    }else{
      this.facadeService.areaUtilityService.updateNodesInEditor((item as OPCNode).id, droppableAreaId);
    }
  }
}

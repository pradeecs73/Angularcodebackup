/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injectable } from '@angular/core';
import interact from 'interactjs';
import { ConnectorType, CursorAttributes, DragDropAttribute, dragProperties, DragType, FillingLineNodeType, NodeAttributes, Numeric } from '../../enum/enum';
import { MoveData } from '../../models/models';
import { ClientInterface, OpcInterface } from '../../models/targetmodel.interface';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { FillingArea, FillingNode } from '../../store/filling-line/filling-line.reducer';
import { ROOT_EDITOR } from '../../utility/constant';
import { select,Selection,BaseType} from '../../../app/vendors/d3.module';
import { PlantArea } from './area';
import { BaseConnector } from './baseConnector';
import { NodeAnchor } from './node-anchor';
import { OPCNode } from './opcnode';
import { SubConnector } from './subConnector';
import { isNullOrUnDefined } from './../../utility/utility';

export abstract class HTMLNode {
    /* Variables are declared here */
    id: string;
    name: string;
    element: SVGGElement;
    node: Selection<SVGGElement, unknown, null, undefined>;
    type: FillingLineNodeType;
    x: number;
    y: number;
    selected: boolean;

    inputs: Array<NodeAnchor>;
    outputs: Array<NodeAnchor>;

    parent: string = ROOT_EDITOR;
    dragType: DragType = DragType.NODE;

    clientInterfaces: Array<ClientInterface>;
    serverInterfaces: Array<OpcInterface>;
    restrictIsValid:boolean;

    constructor(protected readonly facadeService: FacadeService) {
    }

    abstract updateFillingLineData(fillingNodeData: FillingNode | FillingArea | Partial<FillingNode | FillingArea>);
    /*
    *
    * Updates the anchors based on input or output type
    */
    updateAnchors() {
        if (this.inputs) {
            for (const input of this.inputs) {
                input.update();
            }
        }
        if (this.outputs) {
            for (const output of this.outputs) {
                output.update();
            }
        }
    }
    /*
    * Returns the coordinates and position of two AC/Areas
    *
    */
    getBoundingBox(elem1: BaseType, elem2: BaseType) {
        elem1 = select(elem1).select(NodeAttributes.PARENTRECT).node();
        // moving one
        elem2 = select(elem2).select(NodeAttributes.PARENTRECT).node();
        let e1, e2;
        if (elem1) {
            /*
            *BOUNDING BOX OF THE FIRST OBJECT
            */
            e1 = (elem1 as HTMLElement).getBoundingClientRect();
        }
        if (elem2) {
            /*
            *BOUNDING BOX OF THE SECOND OBJECT
            */
            e2 = (elem2 as HTMLElement).getBoundingClientRect();
        }
        return { e1, e2 };
    }
    /*
    *
    * Function to check if the AC are colliding or not
    */
    testCollision(elem1: BaseType, elem2: BaseType) {
        let collisionDistance:number;
        if(this.facadeService.zoomOperationsService.selectedZoomPercent === Numeric.TWENTYFIVE){
            collisionDistance=Numeric.SIX;
        }
        else if(this.facadeService.zoomOperationsService.selectedZoomPercent === Numeric.FIFTY){
            collisionDistance=Numeric.EIGHT;
        }
        else{
            collisionDistance=Numeric.FIFTEEN;
        }

        const { e1, e2 } = this.getBoundingBox(elem1, elem2);
        if (e1 && e2) {
            /*
            *CHECK IF THE TWO BOUNDING BOXES OVERLAP
            */
            return !((e2.left) > (e1.right + collisionDistance) ||
                (e2.right + collisionDistance) < e1.left ||
                e2.top > (e1.bottom + collisionDistance) ||
                (e2.bottom + collisionDistance) < e1.top);
        }
        else {
            return false;
        }

    }
    /*
    * Function returns the value by which the AC/Area should be moved if they are collapsing
    *
    */
    getProximity(elem1: BaseType, elem2: BaseType) {
        const move: MoveData = { top: undefined, left: undefined };
        const { e1, e2 } = this.getBoundingBox(elem1, elem2);
        if (e1 && e2) {
            /*
            * CHECK IF THE TWO BOUNDING BOXES OVERLAlet
            */
            let dtop: number;
            let dleft: number;
            if (e1.top > e2.top) {
                dtop = e1.top - e2.top;
            }
            else {
                dtop = e2.top - e1.top;
            }

            if (e1.left > e2.left) {
                dleft = e1.left - e2.left;
            }
            else {
                dleft = e2.left - e1.left;
            }

            const isMoveBelow = dtop > dleft;
            if (isMoveBelow) {
                move.top = e1.top - e2.top;
            } else {
                move.left = e1.left - e2.left;
            }
        }
        return move;
    }

    //Old implementaion to avoid automation component override
    /*moveNode(move: MoveData) {
        if (move?.left) {
            // mov behind
            if (move.left < 0) {
                this.x += (Numeric.FIVEHUNDERD + move.left);
                select(this.element).attr('transform', `translate(${this.x}, ${this.y})`);
            } else if (move.left > 0) {
                this.x -= (Numeric.FIVEHUNDERD - move.left);
                select(this.element).attr('transform', `translate(${this.x}, ${this.y})`);
            } else {
                return;
            }
        } else {
            return;
        }
    }*/

    /*
    * Checks if the AC/Area are going beyond the width or height of the editor
    *
    */
    restrictionValidation(dx: number, dy: number, zoomScaleFactor: number): boolean {
        this.restrictIsValid=true;
        if (zoomScaleFactor < 1) {
            this.setZoomScalerFacorForLowZoom(dx,dy);
        }
        else if (zoomScaleFactor >= 1) {
            /*
            * max value should be taken dynamically EDITOR_HEIGHT
            */
            this.setZoomScalerFacorForHighZoom(dx,dy);
        }
        else {
            this.restrictIsValid = false;
        }
        return this.restrictIsValid;
    }
    /*
    * Restrict validation for less than 100% zoom
    *
    */
   setZoomScalerFacorForLowZoom(dx: number, dy: number){
        const cond1 = (this.x <= Numeric.FOUR && dx < 0) || (this.y <= Numeric.TWENTYFIVE && dy <= Numeric.ZERO);
            const cond2 = (this.x > Numeric.THREETHOUSAND_FIVETHIRTYEIGHT && dx > 0);
            if (cond1 || cond2) {
                this.restrictIsValid = true;
            }
            else{
                this.restrictIsValid = false;
            }
    }
    /*
    *
    * Restrict validation for more than 100% zoom
    */
    setZoomScalerFacorForHighZoom(dx: number, dy: number){
        const cond1 = (this.x < Numeric.EIGHT && dx < 0) || (this.x > Numeric.ONETHOUSAND_THREEFORTYFOUR && dx > 0);
        const cond2 = (this.y < Numeric.TWENTY && dy <= Numeric.ZERO);
        if (cond1 || cond2) {
            this.restrictIsValid = true;
        }
        else{
            this.restrictIsValid = false;
        }
    }
    /*
    *
    * Function returns all the node connectors
    */
    getAllNodeConnectors(): Array<BaseConnector> {
        const connectors: Array<BaseConnector> = [];
        const anchors: Array<NodeAnchor> = this.getAllAnchorNodes();
        anchors?.forEach(anchor => connectors.push(...anchor?.connectors as BaseConnector[]));
        return connectors;
    }
    /*
    *
    * Function returns all the subconnectors
    */
    getAllSubConnectors(): Array<SubConnector> {
        const subConnectors: Array<SubConnector> = [];
        const anchors: Array<NodeAnchor> = this.getAllAnchorNodes();
        anchors?.forEach(anchor => subConnectors.push(...anchor?.connectors.filter(con => con.type === ConnectorType.SUBCONNECTOR) as SubConnector[]));
        return subConnectors;
    }
    /*
    *
    * Function returns all the anchor nodes
    */
    getAllAnchorNodes(): Array<NodeAnchor> {
        return this.inputs?.concat(this.outputs);
    }
}

@Injectable({
    providedIn: 'root'
})
export class HTMLNodeService {

    movingNode:BaseType;
    nodeOldXValue:number;
    nodeOldYValue:number;

    constructor(
        protected readonly facadeService: FacadeService
    ) { }
    /*
    *
    * Function to add anchors to nodes
    */
    addAnchors(node: HTMLNode, isClient: boolean): Array<NodeAnchor> {
        let interfaces = node.serverInterfaces;
        let anchorList: Array<NodeAnchor>;
        if (isClient === true) {
            interfaces = node.clientInterfaces;
        }
        if (interfaces) {
            anchorList = interfaces.map((inf, index) => {
                const anchorElement = select(node.element).select(`#${inf.id}`);
                return this.facadeService.anchorService.createAnchor(node, anchorElement, isClient, inf, index);
            });
        }
        return anchorList;
    }

    /*
    *
    * Update area element
    */
    updateAreaElement(node: HTMLNode) {
        this.onDragToFillingLine(node);
        // call event handler
        this.onClickHtmlNode(node);
    }
    /*
    * This function is called when the AC or the area is moved inside the editor
    *
    */
    onDrag(node: HTMLNode) {
        const header: SVGElement = node.element.querySelector('#Device-header');
        interact(header).draggable({
            inertia: true,
            listeners: {
                start: () => {
                    this.selectNode(node);
                },
                move: (event: { target: { parentNode: { parentNode: BaseType; } }, dx: number, dy: number }) => {
                    const target = event.target.parentNode.parentNode;
                    if (node.restrictionValidation(event.dx, event.dy, this.facadeService.zoomOperationsService.currentZoomScaleFactor)) {
                        return;
                    }
                    node.x += (event.dx / this.facadeService.zoomOperationsService.currentZoomScaleFactor);
                    node.y += (event.dy / this.facadeService.zoomOperationsService.currentZoomScaleFactor);
                    select(target).attr('transform', `translate(${node.x}, ${node.y})`);
                    node.updateAnchors();
                },
                end: () => {
                    this.updateNodeMoveData(node);
                }
            }
        });
    }
    /*
    * This function is called when the AC or the area is moved inside the editor
    *
    */
    private onDragToFillingLine(node:HTMLNode) {
        const header: SVGElement = node.element.querySelector('#Device-header');
        interact(header).draggable({

            inertia: true,
            listeners: {
                start: () => {
                       this.nodeOldXValue=node.x;
                       this.nodeOldYValue=node.y;
                },
                move: (event: { target: { parentNode: { parentNode: BaseType; } }, dx: number, dy: number, currentTarget }) => {
                    this.handleFillingLineOnMove(event,node);
                },
                end: event => {
                    if(node.y < Numeric.TWENTY)
                    {
                      select(this.movingNode).attr('transform', `translate(${node.x}, ${Numeric.TWENTY})`);
                      node.updateAnchors();
                    }
                    this.handleFillingLineOnEnd(event,node);
                    this.facadeService.drawService.resizeCanvas();
                }
            }
        });
        interact(header)
            .draggable({ manualStart: true })
            .on('move', event => {
                if (event?.currentTarget?.parentElement?.children[0]?.children[0]?.classList.contains('selected')) {
                    this.dragNodeToFillingLine(event);
                } else {
                    const interaction = event.interaction;
                    event.target.style.cursor = CursorAttributes.MOVE;
                    interaction.start({ name: 'drag' }, event.interactable, event.currentTarget);
                }
            });
    }
    /*
    * handle filling line on move
    *
    */
    handleFillingLineOnMove(event: { target: { parentNode: { parentNode: BaseType; } }, dx: number, dy: number, currentTarget },node:HTMLNode){
        const target = event.currentTarget;
        if (event.currentTarget.classList.contains(dragProperties.DRAG_NODES)) {
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            // translate the element
            target.style.webkitTransform = target.style.transform = `translate(${x}px,${y}px)`;
            // update the posiion attributes
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        } else {
            if(!document.querySelector(dragProperties.DRAG_CLASS)){
                const parentNode = event.target.parentNode.parentNode;
                this.movingNode=parentNode;
                if (node.restrictionValidation(event.dx, event.dy, this.facadeService.zoomOperationsService.currentZoomScaleFactor)) {
                    return;
                }
                this.handleNonSelectedNodeMove(event,node);
         }
      }
    }
    /*
    * handle filling line on end
    *
    */
    handleFillingLineOnEnd(event,node:HTMLNode){
        const target = event.target;
        const dragSelection = target?.farthestViewportElement?.parentElement?.querySelector('.drag-selection');
        if (!dragSelection) {
            this.updateNodeMoveData(node);
        }
        if (event.currentTarget.classList.contains(dragProperties.DRAG_NODES)) {
            event.target.classList.remove(CursorAttributes.NODROP);
            target.remove();
        }
    }
    /*
    * handles all non selected nodes move event
    *
    */
    handleNonSelectedNodeMove(event: { target: { parentNode: { parentNode: BaseType; } }, dx: number, dy: number, currentTarget },node){
        const target = event.currentTarget;
        const parentNode = event.target.parentNode.parentNode;
        if (target?.farthestViewportElement?.parentElement?.children?.length === 1) {
            if (this.facadeService.zoomOperationsService.currentZoomScaleFactor < 1) {
                node.x += (event.dx / this.facadeService.zoomOperationsService.currentZoomScaleFactor);
                node.y += (event.dy / this.facadeService.zoomOperationsService.currentZoomScaleFactor);
                select(parentNode).attr('transform', `translate(${node.x}, ${node.y})`);
                node.updateAnchors();
            }
            else {
                node.x += (event.dx / 1);
                node.y += (event.dy / 1);
                select(parentNode).attr('transform', `translate(${node.x}, ${node.y})`);
                node.updateAnchors();
            }
        }
    }
    /*
    * This function is used to create an icon which represent no of devices
    * selected during drag selection
    */
    dragNodeToFillingLine(event) {
        const interaction = event.interaction;
        event.target.style.cursor = CursorAttributes.MOVE;
        /*
        *if the pointer was moved while being held down
        *and an interaction hasn't started yet
        */
        if (interaction.pointerIsDown && !interaction.interacting()
            && event.currentTarget.parentElement.children[0].children[0].classList.contains('selected')) {
            const target = event.currentTarget;
            const draggedElements = target.farthestViewportElement.querySelectorAll('.dragg-selected');
            /*
            *create a clone of the currentTarget element
            */
            const clone = document.createElement('div');
            clone.style.cursor = CursorAttributes.MOVE;

            const countElem = document.createElement('span');
            countElem.textContent = draggedElements.length;
            countElem.classList.add('count-font');
            clone.appendChild(countElem);
            /*
            *add dragging class
            */
            clone.classList.add(CursorAttributes.Dragging);
            clone.classList.remove(CursorAttributes.Dropped);
            clone.classList.add(dragProperties.DRAG_NODES);

            /*
            *translate the element
            */
            clone.style.transform = 'translate(0px, 0px)';
            clone.style.position = 'absolute';
            const mousePoint = this.facadeService.commonService.setMousePosition(event);
            clone.style.top = `${mousePoint.y+window.scrollY}px`;
            clone.style.left = `${mousePoint.x+window.scrollX}px`;

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
    *update node move data
    */
    updateNodeMoveData(node: HTMLNode) {
      if(!isNullOrUnDefined(node)){
        this.checkNodeProximity(node);
        this.facadeService.editorService.updateHTMLNode(node);
        node.updateAnchors();
        /*
        * updates the connection line alignment
        */
        this.facadeService.alignConnectionService.alignConnections();
      }
    }
    /*
    *
    * First checks if the- moving node will collide with any other node and then the node proximity is set for those elements
    */
    checkNodeProximity(testNode: HTMLNode) {
        for (const node of this.facadeService.editorService.liveLinkEditor.editorNodes) {
            const testNodeIneditor=testNode as unknown as OPCNode;
            const editorInNode=node as unknown as OPCNode;
            if(testNodeIneditor && testNodeIneditor.id !== editorInNode.id){
                if (node.testCollision(testNode.element, node.element) && this.movingNode) {
                    testNode.x=this.nodeOldXValue;
                    testNode.y=this.nodeOldYValue;
                    select(this.movingNode).attr('transform', `translate(${this.nodeOldXValue}, ${this.nodeOldYValue})`);
                    testNode.updateAnchors();
                }
            }
        }
    }

    /*
    *
    *highlight the node on click
    */
    protected onClickHtmlNode(node: HTMLNode) {
        const nodeHeader = select(node.element).select(`#${NodeAttributes.NODEHEADER}`);
        nodeHeader.on('click', () => {
            this.selectNode(node);
            this.facadeService.editorService.selectedNode = node;
            this.deselectMultipleNodes(node.element);
        });
    }
    /*
    * Selects the node on click
    *
    */
    selectNode(node: HTMLNode) {
        this.facadeService.editorService.deselectAllNodes();
        (node as OPCNode | PlantArea).updateFillingLineData({ selected: true });
        this.facadeService.editorService.selectedNode = node;
        this.facadeService.fillingLineService.selectDevice(node.id);
    }
    /*
    *
    * Deselect all the nodes in the editor
    */
    deselectMultipleNodes(currentElement) {
        const boxes = currentElement.parentElement.querySelectorAll(NodeAttributes.Device_NODE_CLASS);
        for (const box of boxes) {
              this.clearSelectedRect(box,currentElement);
            }
    }
    /*
    *
    * Used to remove the selected class appended to an AC
    */
    clearSelectedRect(box,currentElement) {
        box.classList.remove(DragDropAttribute.DRAGG_SELECTED);
        const parent1 = currentElement.parentElement.querySelectorAll('#parent-rect');
        for (const elem of parent1) {
          const rect1 = elem?.querySelector('.cls-2');
          if (rect1 && rect1.classList) {
            rect1.classList.remove('selected');
          }
        }
      }
}

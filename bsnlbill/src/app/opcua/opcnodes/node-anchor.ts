/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import interact from 'interactjs';
import {
  AnchorAttribute, Angle, ConnectorArributes,
  ConnectorCreationMode, ConnectorState, ConnectorType,
  CursorAttributes, dragProperties, DragType,
  FillingLineNodeType, intefaceStyle,
  InterfaceAttributes, Numeric, SubConnectorCreationMode
} from '../../enum/enum';
import { LiveLink } from '../../models/models';
import { AreaClientInterface, AreaInterface, ClientInterface, ISidePanel, OpcInterface, RelatedEndPointInterface } from '../../models/targetmodel.interface';
import { ANCHORCIRCLEID } from '../../utility/constant';
import { getConnectionName, getSubConnectionID } from '../../utility/utility';
import { select} from '../../../app/vendors/d3.module';
import { BaseConnector } from './baseConnector';
import { Connector } from './connector';
import { HTMLNode } from './htmlNode';
import { OPCNode } from './opcnode';
import { SubConnector } from './subConnector';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { PlantArea } from './area';


export class NodeAnchor {
  isInput: boolean;
  id: string;
  center: SVGPoint;
  anchorScrim: HTMLElement;
  /**
   * Html Element type is any as its a third party object
   */
  anchorElement: HTMLElement | any; //NOSONAR
  global: SVGPoint;
  connectors: Array<BaseConnector | Connector | SubConnector>;
  dragType: DragType = DragType.PORT;

  parentNode: HTMLNode;
  interfaceData: ClientInterface | AreaClientInterface;
  relatedEndPoint: RelatedEndPointInterface;
  connectionStatus: boolean;
  // use for position of connector
  index: number;
  editor: LiveLink;
  connectionName: string;
  deviceId: string;
  automationComponentId:string;
  interfaceStyle: intefaceStyle = intefaceStyle.DISCONNECTED;

  constructor(node: HTMLNode, anchor, isInput: boolean, interfaceData: ClientInterface | AreaClientInterface, index: number, editor: LiveLink) {
    this.editor = editor;
    this.editor.nextAnchorId++;
    this.id = `port_${this.editor.nextAnchorId}`;
    this.isInput = isInput;
    this.anchorElement = anchor.node();
    this.parentNode = node;
    this.interfaceData = interfaceData;

    this.index = index;
    this.connectors = [];
    if (this.parentNode.type === FillingLineNodeType.NODE) {
      this.deviceId = (node as OPCNode).deviceId;
      this.automationComponentId=(node as OPCNode).id;
      this.connectionName = getConnectionName(this.deviceId, this.parentNode.id,
        this.interfaceData.id);
    }
    else if (node.type === FillingLineNodeType.AREA) {
      this.deviceId = (this.interfaceData as AreaInterface).deviceId;
      this.automationComponentId=(interfaceData as AreaClientInterface).automationComponentId;
      this.connectionName = getConnectionName(this.deviceId, this.parentNode.id,
        this.interfaceData.id);
    }
    else {
      this.parentNode.type = FillingLineNodeType.NA;
      this.deviceId = (interfaceData as AreaClientInterface).deviceId;
    }

    this.anchorScrim = this.anchorElement?.querySelector('.scrim');

    this.anchorScrim?.setAttribute('data-drag', `${this.id}:${this.dragType}`);
    const bbox = this.anchorElement?.getBBox();

    this.global = this.editor.svg.createSVGPoint();
    this.center = this.editor.svg.createSVGPoint();
    if (bbox) {
      this.center.x = bbox.x + bbox.width / Numeric.TWO;
      this.center.y = bbox.y + bbox.height / Numeric.TWO;
    }

    // default setting
    this.connectionStatus = false;
    if (isInput) {
      this.setConnectionVar();
    }
  }
  /** 
   * 
   * Update
   * 
  */
  update() {
    const transform: SVGMatrix = this.anchorElement?.getTransformToElement(this.editor.workspace.node());
    this.global = this.center.matrixTransform(transform);
    // Draws the connection line in editor
    this.setConnectorsLength();
  }
  /**
   * Remove connector
   * @param connector 
   */
  removeConnector(connector: BaseConnector) {
    const connection = this.connectors.find(con => con.id === connector.id);
    if (connection) {
      this.connectors = this.connectors.filter(con => con.id !== connector.id);
    }
  }
  /**
   * Add conenctor
   * @param connector 
   */
  addConnector(connector: BaseConnector) {
    const connection = this.connectors.find(con => con.id === connector.id);
    if (!connection) {
      this.connectors.push(connector);
    }
    const angle = Angle.RIGHT_ANGLE / this.connectors.length;
    this.connectors.forEach((con, i) => {
      con.updateAngle(angle, i);
    });
  }
  /**
   * Set connectoors length
   * @returns 
   */
  setConnectorsLength() {
    if (!this.parentNode.inputs || !this.parentNode.outputs) {
      return;
    }
    if (this.parentNode.inputs && this.parentNode.inputs.length > 0) {
      this.setAnchorsConnectorsLength(this.parentNode.inputs, true);
    }
    if (this.parentNode.outputs && this.parentNode.outputs.length > 0) {
      this.setAnchorsConnectorsLength(this.parentNode.outputs, false);
    }
  }
  /**
   * SEt anchors connectors length
   * @param anchorList 
   * @param isClient 
   */
  setAnchorsConnectorsLength(anchorList: NodeAnchor[], isClient: boolean) {
    const dx = 20;
    let connectors: Array<BaseConnector | Connector | SubConnector> = [];
    anchorList.forEach(anchor => {
      connectors = connectors.concat(anchor.connectors);
    });
    for (let i = 0; i < connectors.length; i++) {
      if (isClient === true) {
        connectors[i].inLength = (i + 1) * dx;
        connectors[i].inLengthReverse = (connectors.length - i) * dx;
      }
      else {
        connectors[i].outLength = (i + 1) * dx;
        connectors[i].outLengthReverse = (connectors.length - i) * dx;
      }
      if (connectors[i].type === ConnectorType.CONNECTOR) {
        (connectors[i] as Connector).updateHandle(this);
      }
      else {
        (connectors[i] as SubConnector).updateHandle(this);
      }

    }
  }
  /**
   * set connection var
   * 
   */
  setConnectionVar() {
    const connectionEndPointDetails = this.interfaceData.connectionEndPointDetails;
    if (connectionEndPointDetails) {
      this.connectionStatus = Boolean(connectionEndPointDetails.status.value);
      if (!this.relatedEndPoint) {
        this.relatedEndPoint = {} as RelatedEndPointInterface;
      }
      if (connectionEndPointDetails.relatedEndpoints && connectionEndPointDetails.relatedEndpoints.value) {
        if (typeof connectionEndPointDetails.relatedEndpoints.value === 'string') {
          this.relatedEndPoint.address = connectionEndPointDetails.relatedEndpoints.value;
        } else {
          this.relatedEndPoint = connectionEndPointDetails.relatedEndpoints.value;
        }
      }
    }
  }
  /**
   * Update anchor connector circle position
   * @param dx 
   * @param dy 
   * @param zoomScaleFactor 
   */
  updateAnchorConectorCirclePosition(dx: number, dy: number, zoomScaleFactor: number) {
    let circle;
    if (this.connectors[0].isInput) {
      circle = this.connectors[0].outputCircle;
    } else {
      circle = this.connectors[0].inputCircle;
    }
    circle.x += (dx / zoomScaleFactor);
    circle.y += (dy / zoomScaleFactor);
    select(circle).attr('cx', circle.x).attr('cy', circle.y);
  }
  /**
   * 
   * Update anchor connector circle position
   */
  updateConnectors() {
    for (const connector of this.connectors) {
      if (connector.inputAnchor && connector.outputAnchor) {
        connector.inputAnchor.update();
        connector.outputAnchor.update();
      }
    }
  }
  /**
   * Get anchor interface element
   * @returns 
   * 
   */
  getAnchorInterfaceElement() {
    return select(`#interface-${this.interfaceData.id}`);
  }
  /**
   * Get anchor inner circle element
   * @param isInput 
   * @returns 
   */
  getAnchorInnerCircleElement(isInput: boolean) {
    let elementId = ANCHORCIRCLEID.SERVER_INNER;
    if (isInput) {
      elementId = ANCHORCIRCLEID.CLIENT_INNER;
    }
    return this.getAnchorCircleElement(elementId);
  }
  /**
   * Get anchor outer circle element
   * @param isInput 
   * @returns 
   */
  getAnchorOuterCircleElement(isInput: boolean) {
    let elementId = ANCHORCIRCLEID.SERVER_OUTER;
    if (isInput) {
      elementId = ANCHORCIRCLEID.CLIENT_OUTER;
    }
    return this.getAnchorCircleElement(elementId);
  }
 /**
  * Get anchor circle element
  * @param elementId 
  * @returns 
  */
  private getAnchorCircleElement(elementId: string) {
    let element;
    if (this.anchorElement && elementId) {
      element = select(this.anchorElement).select(`#${elementId}`);
    }
    return element;
  }
  /**
   * Set anchor element style
   * @param outercls 
   * @param innercls 
   * @param isInput 
   */
  private setAnchorElementStyle(outercls: string, innercls: string, isInput: boolean) {
    this.setAnchorOuterCircleStyle(outercls, isInput);
    this.setAnchorInnerCircleStyle(innercls, isInput);
  }
  /**
   * set anchor outer circle style
   * @param outercls 
   * @param isInput 
   */
  private setAnchorOuterCircleStyle(outercls: string, isInput: boolean) {
    const outerCircle = this.getAnchorOuterCircleElement(isInput);
    outerCircle.attr('class', outercls);
  }
  /**
   * Set anchor inner circle style
   * @param innerrcls 
   * @param isInput 
   */
  private setAnchorInnerCircleStyle(innerrcls: string, isInput: boolean) {
    const innerCircle = this.getAnchorInnerCircleElement(isInput);
    innerCircle.attr('class', innerrcls);
  }
  /**
   * 
   * Set anchor scrim style
   */
  private setAnchorScrimStyle(cls: string) {
    if (this.anchorScrim) {
      select(this.anchorScrim).attr('class', cls);
    }
  }
  /**
   * Add to anchor scrim style
   * @param cls 
   */
  private addToAnchorScrimStyle(cls: string) {
    if (this.anchorScrim) {
      this.anchorScrim.classList.add(cls);
    }
  }
  /**
   * REmove from anchor scrim style
   * @param cls 
   */
  private removeFromAnchorScrimStyle(cls: string) {
    if (this.anchorScrim) {
      this.anchorScrim.classList.remove(cls);
    }
  }
  /**
   * Set anchor scrim success style
   * 
   */
  private setAnchorScrimSuccessStyle() {
    this.setAnchorScrimStyle(AnchorAttribute.SUCCESSSCRIM);
  }
  /**
   * Set anchor scrim failure style
   * 
   */
  private setAnchorScrimFailureStyle() {
    this.setAnchorScrimStyle(AnchorAttribute.FAILSCRIM);
  }
  /**
   * Set anchor scrim no connection style
   * 
   */
  private setAnchorScrimNoConnectionStyle() {
    this.setAnchorScrimStyle(AnchorAttribute.NOCONNECTION);
  }
  /**
   * Reset anchor scrim style
   * 
   */
  private resetAnchorScrimStyle() {
    this.setAnchorScrimStyle(AnchorAttribute.SCRIM);
  }
  /**
   * 
   * Set anchor scrim actual connection style
   */
  private setAnchorScrimActualConenctionStyle() {
    this.setAnchorScrimStyle(AnchorAttribute.ACTUALCONNECTSCRIM);
  }
  /**
   * 
   * Set anchor scrim default selected connection style
   */
  private setAnchorScrimDefaultSelectedConenctionStyle() {
    this.setAnchorScrimStyle(AnchorAttribute.ACTUALSCRIMSELECTED);
  }
  /**
   * Set anchor default style
   * @param isInput 
   * 
   */
  public setAnchorDefaultStyle(isInput: boolean) {

    this.setAnchorScrimActualConenctionStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.OUTERCIRCLEACTUALCON, isInput);
    this.setAnchorInnerCircleStyle(AnchorAttribute.INNER, isInput);
  }

  /**
   * Set online success anchor style
   * @param isInput 
   */
  public setOnlineSuccessAnchorStyle(isInput: boolean) {
    this.setAnchorScrimSuccessStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.OUTERSCRIMONLINESUCCESS, isInput);
    this.setAnchorInnerCircleStyle(ConnectorArributes.INNERCLS, isInput);
  }

  /**
   * Set online error anchor style
   * @param isInput 
   * 
   */
  public setOnlineErrorAnchorStyle(isInput: boolean) {
    this.setAnchorScrimSuccessStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.OUTERSCRIMONLINEERROR, isInput);
    this.setAnchorInnerCircleStyle(ConnectorArributes.INNERCLS, isInput);
  }

  /**
   * Set success anchor style
   * @param isInput 
   * 
   */
  public setSuccessAnchorStyle(isInput: boolean) {
    this.setAnchorScrimSuccessStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.OUTERSCRIMSUCCESS, isInput);
    this.setAnchorInnerCircleStyle(ConnectorArributes.INNERCLS, isInput);
  }

  /**
   * Set failure style
   * @param isInput 
   * 
   */
  public setFailureStyle(isInput: boolean) {
    this.setAnchorScrimFailureStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.OUTERSCRIMFAILURE, isInput);
    this.setAnchorInnerCircleStyle(ConnectorArributes.INNERCLS, isInput);
  }

  /**
   * Set no connection style
   * @param isInput 
   * 
   */
  public setNoConnectionStyle(isInput: boolean) {
    this.setAnchorScrimNoConnectionStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.OUTERNOCONNECTION, isInput);
    this.setAnchorInnerCircleStyle(ConnectorArributes.INNERCLS, isInput);
  }

  /**
   * Set anchor selected style
   * @param isInput 
   * 
   */
  public setAnchorSelectedStyle(isInput: boolean) {
    this.resetAnchorScrimStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.OUTERCIRCLE, isInput);
  }

  /**
   * Set anchor default selected style
   * @param isInput 
   * 
   */
  public setAnchorDefaultSelectedStyle(isInput: boolean) {
    this.setAnchorScrimDefaultSelectedConenctionStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.ACTUALOUTERCIRCLE, isInput);
    this.setAnchorInnerCircleStyle(AnchorAttribute.ACTUALINNERCIRCLE, isInput);
  }

  /**
   * Set anchor online selected style
   * @param isInput 
   * 
   */
  public setAnchorOnlineSelectedStyle(isInput: boolean) {
    this.setAnchorScrimDefaultSelectedConenctionStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.OUTERSCRIMONLINE, isInput);
    this.setAnchorInnerCircleStyle(AnchorAttribute.OUTERSCRIMONLINE, isInput);
  }

  /**
   * Set anchor online error selected style
   * @param isInput 
   */
  public setAnchorOnlineErrorSelectedStyle(isInput: boolean) {
    this.setAnchorScrimDefaultSelectedConenctionStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.OUTERSCRIMONLINEERROR, isInput);
    this.setAnchorInnerCircleStyle(AnchorAttribute.OUTERSCRIMONLINEERROR, isInput);
  }

  /**
   * Set anchor success selected style
   * @param isInput 
   * 
   */
  public setAnchorSuccessSelectedStyle(isInput: boolean) {
    this.setAnchorScrimDefaultSelectedConenctionStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.ACTUALOUTERSCRIMSUCCESS, isInput);
    this.setAnchorInnerCircleStyle(AnchorAttribute.ACTUALOUTERSCRIMSUCCESS, isInput);
  }

  /**
   * Set anchor failure selected style
   * @param isInput 
   * 
   */
  public setAnchorFailureSelectedStyle(isInput: boolean) {
    this.setAnchorScrimDefaultSelectedConenctionStyle();
    this.setAnchorOuterCircleStyle(AnchorAttribute.ACTUALFAILOUTERCIRCLE, isInput);
    this.setAnchorInnerCircleStyle(AnchorAttribute.ACTUALFAILOUTERCIRCLE, isInput);
  }

  /**
   * Set anchor hover style
   * 
   */
  setAnchorHoverStyle() {
    this.addToAnchorScrimStyle(AnchorAttribute.HOVERSCRIM);
  }

  /**
   * 
   * Reset anchor hover style
   */
  resetAnchorHoverStyle() {
    this.removeFromAnchorScrimStyle(AnchorAttribute.HOVERSCRIM);
  }

 /**
  * 
  * Reset output anchor style
  */
  public resetOutPutAnchorStyle() {
    this.resetAnchorScrimStyle();
    this.setAnchorElementStyle(ConnectorArributes.OUTERCLS, ConnectorArributes.INNERCLS, false);
  }

  /**
   * 
   * Reset input anchor style
   */
  public resetInPutAnchorStyle() {
    this.resetAnchorScrimStyle();
    this.setAnchorElementStyle(ConnectorArributes.OUTERCLS, ConnectorArributes.INNERCLS, true);
  }

  /**
   * 
   *  Reset output anchor style inverse
   */
  public resetOutPutAnchorStyleInverse() {
    this.resetAnchorScrimStyle();
    this.setAnchorElementStyle(ConnectorArributes.OUTERCLS, ConnectorArributes.INNERCLS, true);
  }

  /**
   * 
   * Reset input anchor style inverse
   */
  public resetInPutAnchorStyleInverse() {
    this.resetAnchorScrimStyle();
    this.setAnchorElementStyle(ConnectorArributes.OUTERCLS, ConnectorArributes.INNERCLS, false);
  }

  /**
   * 
   * Reset hovered interface
   */
  public resetHoveredInterface() {
    select(this.anchorElement.parentNode.children[0].children[0]).attr('class', InterfaceAttributes.DEFAULT);
  }

  /**
   * 
   * highlight interface
   *
   */
  highLightInterface() {
    this.getAnchorInterfaceElement().attr('class', `${AnchorAttribute.HIGHLIGHTED}`);
  }

  /**
   * 
   * dehighlight interface
   */
  deHighLightInterface() {
    this.getAnchorInterfaceElement().attr('class', '');
    if (this.connectors[0]) {
      this.getAnchorInterfaceElement().attr('class', `${AnchorAttribute.HAVECONNECTION}`);
    }
  }
  /**
   * 
   * set connected interface style
   */
  setConnectedInterfaceStyle() {
    const node = this.getAnchorInterfaceElement()?.node();
    if (node && this.interfaceStyle === intefaceStyle.DISCONNECTED) {
      /**
       *  Node type is any as its from third party
       */
      const { height, width, x, y } = (node as any).getBBox(); //NOSONAR
      let path = '';
      if (!this.isInput) {
        const rx1 = x;
        const ry1 = y;

        const rx2 = x;
        const ry2 = y + height;

        const tx1 = x + width;
        const ty1 = y;

        const tx3 = x + width;
        const ty3 = y + height;

        const tx2 = tx1 + Numeric.FIFTEEN;
        const ty2 = (ty3 - ty1) / Numeric.TWO;
        path = `M${rx1} ${ry1} L${tx1} ${ty1} L${tx2} ${ty2} L ${tx3} ${ty3} L${rx2} ${ry2} z`;
      }
      else {
        const rx1 = x + width;
        const ry1 = y;

        const rx2 = x + width;
        const ry2 = y + height;

        const tx1 = x;
        const ty1 = y;

        const tx3 = x;
        const ty3 = y + height;

        const tx2 = tx1 - Numeric.FIFTEEN;
        const ty2 = (ty3 - ty1) / Numeric.TWO;
        path = `M${tx1} ${ty1} L${rx1} ${ry1} L${rx2} ${ry2} L ${tx3} ${ty3} L${tx2} ${ty2} z`;
      }
      this.interfaceStyle = intefaceStyle.CONNECTED;
      this.getAnchorInterfaceElement().attr('d', path);
    }
  }

  /**
   * 
   * set disconnected interface style
   */
  setDisconnectedInterfaceStyle() {
    const path = `M0 0 L 200 0  L 200 48 L0 48 z`;
    this.interfaceStyle = intefaceStyle.DISCONNECTED;
    this.getAnchorInterfaceElement().attr('d', path);
  }

  /**
   * Set cursor not allowed style
   * @param target 
   * @param anchor 
   * @param isOnline 
   */
  setCursorNotAllowedStyle(target, anchor: NodeAnchor, isOnline: boolean) {
    if (isOnline || !anchor.connectors[0] || anchor.connectors[0].isConnected) {
      this.updateCursorStyle(target, CursorAttributes.NOTALLOWED);
    }
  }

  /**
   * update cursor style
   * @param target 
   * @param style 
   */
  updateCursorStyle(target, style: CursorAttributes) {

    select(target).attr('class', '');
    switch (style) {
      case CursorAttributes.NOTALLOWED:
        select(target).attr('class', `${AnchorAttribute.HAVECONNECTION}`);
        break;
      case CursorAttributes.NORMAL:
        select(target).attr('class', `${AnchorAttribute.HIGHLIGHTED}`);
        break;
      case CursorAttributes.MOVE:
        select(target).attr('class', `${AnchorAttribute.MATCHINGINTERFACE}`);
        break;
      default:
        break;
    }

  }
  /**
   * update target properties
   * @param event 
   * @param targetType 
   * @param currentZoomScaleFactor 
   */
  updateTargetProperties(event, targetType: DragType, currentZoomScaleFactor: number) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.dx / currentZoomScaleFactor);
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.dy / currentZoomScaleFactor);

    if (targetType === DragType.INTERFACE) {
      target.style.webkitTransform = target.style.transform = `translate(${x + Numeric.EIGHTY}px,${y + 0}px)`;
    }
    else if (targetType === DragType.CONNECTIONNODE) {
      target.style.webkitTransform = target.style.transform = `translate(${x}px,${y}px)`;
    }
    else {
      target.style.webkitTransform = target.style.transform = '';
    }

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
}

@Injectable({
  providedIn: 'root'
})
export class NodeAnchorService {
  /**
   * Html Element type is any as its a third party object
   */
  cursorInfo: HTMLElement | any; //NOSONAR

  constructor( private readonly facadeService: FacadeService) { }
  /**
   * Create anchor
   * @param node 
   * @param anchor 
   * @param isClient 
   * @param inf 
   * @param index 
   * @returns 
   */
  createAnchor(node: HTMLNode, anchor, isClient: boolean, inf: ClientInterface | OpcInterface, index: number) {
    const nodeAnchor = new NodeAnchor(node, anchor, isClient, inf, index, this.facadeService.editorService.liveLinkEditor);
    nodeAnchor.update();
    this.drag(nodeAnchor);
    this.bindHoverEvent(nodeAnchor);
    return nodeAnchor;
  }
  /**
   * Bind hover event
   * @param anchor 
   */
  bindHoverEvent(anchor: NodeAnchor) {
    const interfaceElement = document.querySelector(`#box-${anchor.interfaceData.id}`);
    const common = this.facadeService.commonService;
    interfaceElement.addEventListener('mouseleave', () => {
      if (!common.isOnline) {
        anchor.deHighLightInterface();
      }
    });
    interfaceElement.addEventListener('mouseenter', () => {
      if (!common.isOnline) {
        if (!anchor.connectors[0] && this.facadeService.commonService.highlightInterface) {
          anchor.highLightInterface();
        }
      }
    });
  }
  /**
   * Connection on move
   * @param anchor 
   * @param event 
   */
  connectionOnMove(anchor: NodeAnchor, event) {
    if (this.facadeService.commonService.isOnline ||
      (!this.facadeService.commonService.isOnline && anchor.connectors && anchor.connectors.length > 0)) {
      anchor.updateCursorStyle(event.currentTarget, CursorAttributes.NOTALLOWED);
    }
    else {
      anchor.updateCursorStyle(event.currentTarget, CursorAttributes.NORMAL);
      const interaction = event.interaction;
      // if the pointer was moved while being held down
      // and an interaction hasn't started yet
      if (interaction.pointerIsDown && !interaction.interacting()) {
        const target = event.currentTarget;
        // // create a clone of the currentTarget element
        const targetBounding = target.getBoundingClientRect();

        this.cursorInfo = document.createElement('div');
        this.cursorInfo.style.height = '50px';
        this.cursorInfo.style.width = '50px';

        // add dragging class
        this.cursorInfo.classList.add('drag-dragging');
        this.cursorInfo.classList.remove('drag-dropped');
        this.cursorInfo.classList.add('draggable-interface');
        this.cursorInfo.ariaLabel = anchor.interfaceData.id.split('_')[0];
        this.cursorInfo.setAttribute('interfaceData', JSON.stringify(anchor.interfaceData));
        // translate the element
        this.cursorInfo.style.transform = 'translate(0px, 0px)';
        this.cursorInfo.style.position = 'absolute';
        let automationComponentID: string;
        let deviceId: string;
        if (anchor.parentNode.type === FillingLineNodeType.AREA) {
          automationComponentID = (anchor.interfaceData as AreaInterface).automationComponentId;
          deviceId = (anchor.interfaceData as AreaInterface).deviceId
        } else {
          automationComponentID = anchor.parentNode.id
          deviceId = (anchor.parentNode as OPCNode).deviceId
        }
        const payload: ISidePanel = {
          deviceId: deviceId,
          automationComponentId: automationComponentID,
          interfaceId: anchor.interfaceData.id,
          isClientInterface: anchor.interfaceData.isClientInterface,
          adapterType: anchor.parentNode['deviceId']?.adapterType,
          //adapterType: anchor.parentNode['adapterType']
          interfaceExposedMode: SubConnectorCreationMode.MANUAL,
          subConnectionId: getSubConnectionID(anchor?.parentNode?.id, anchor.interfaceData.type, anchor.interfaceData.id)
        }
        this.cursorInfo.setAttribute('sidePanelData', JSON.stringify(payload));
        this.cursorInfo.style.top = `${targetBounding.top + window.scrollY}px`;
        this.cursorInfo.style.left = `${targetBounding.left + window.scrollX}px`;
        // insert the clone to the page
        document.body.appendChild(this.cursorInfo);
        // start a drag interaction targeting the clone
        interaction.start({ name: 'drag' }, event.interactable, this.cursorInfo);
      }
    }
  }
  /**
   * 
   * @param anchor 
   * @returns 
   */
  dragStart(anchor: NodeAnchor) {

    if(document.querySelector(dragProperties.DRAG_CLASS)){
      return;
    }
    if (!this.facadeService.commonService.isOnline) {
      anchor.highLightInterface();
      anchor.setConnectedInterfaceStyle();

      this.facadeService.connectorService.createConnector(anchor, ConnectorCreationMode.MANUAL, this.facadeService.editorService.getEditorContext().id);
      if (anchor.connectors.length === 1) {
        anchor.connectors[0].state = ConnectorState.Default;
      }
    }
  }
  /**
   * 
   * @param anchor 
   * @param event 
   * @param targetType 
   * @returns 
   */
  dragMove(anchor: NodeAnchor, event, targetType: DragType) {
    if(document.querySelector(dragProperties.DRAG_CLASS)){
      return;
    }
    if (!this.facadeService.commonService.isOnline) {
      const target = event.target;
      anchor.setCursorNotAllowedStyle(target, anchor, this.facadeService.commonService.isOnline);
      if (anchor.connectors[0]) {
        anchor.highLightInterface();
      }

      anchor.updateAnchorConectorCirclePosition(event.dx, event.dy, this.facadeService.zoomOperationsService.currentZoomScaleFactor);
      this.updateAnchors(anchor);

      anchor.updateTargetProperties(event, targetType, this.facadeService.zoomOperationsService.currentZoomScaleFactor);
      const isValid = (anchor.connectors[0] as Connector)?.validate();
      if (isValid) {
        anchor.updateCursorStyle(target, CursorAttributes.MOVE);
      }
      else {
        this.updateCursors(anchor, target);
        // remove highlight from anchor if connection is not possible
        if (anchor.connectors[0].highlightedAnchorId) {
          anchor.connectors[0]?.resetHighlightedAnchor(anchor);
        }
      }
    }
  }
  /**
   * 
   * @param anchor 
   */
  updateAnchors(anchor: NodeAnchor) {
    if (anchor.connectors[0].type === ConnectorType.CONNECTOR) {
      (anchor.connectors[0] as Connector).updateHandle(anchor);
    }
    else {
      (anchor.connectors[0] as SubConnector).updateHandle(anchor);
    }

  }
  /**
   * 
   * @param anchor 
   * @param target 
   */
  updateCursors(anchor: NodeAnchor, target) {
    if (this.facadeService.commonService.interFaceSidePanelArea && anchor.connectors[0].isInput && this.facadeService.commonService.interFaceSidePanelType === 'client') {
      anchor.updateCursorStyle(target, CursorAttributes.MOVE);
    }
    else if (this.facadeService.commonService.interFaceSidePanelArea && !anchor.connectors[0].isInput && this.facadeService.commonService.interFaceSidePanelType === 'server') {
      anchor.updateCursorStyle(target, CursorAttributes.MOVE);
    }
    else {
      anchor.updateCursorStyle(target, CursorAttributes.NOTALLOWED);
    }
  }
  /**
   * 
   * @param anchor 
   * @returns 
   */
  dragEnd(anchor: NodeAnchor) {
    if(document.querySelector(dragProperties.DRAG_CLASS)){
      return;
    }
    if (!this.facadeService.commonService.isOnline && anchor.connectors && anchor.connectors.length > 0) {
      anchor.deHighLightInterface();
      if (anchor?.connectors[0].type === ConnectorType.CONNECTOR) {
        this.facadeService.connectorService.connect(anchor.connectors[0] as Connector);
      }

      if (anchor.connectors && anchor.connectors.length > 0) {
        anchor.updateConnectors();
        let dropAnchor: NodeAnchor = anchor?.connectors[0]?.inputAnchor;
        if (anchor.isInput) {
          dropAnchor = anchor.connectors[0]?.outputAnchor;
        }
        dropAnchor?.setConnectedInterfaceStyle();
      }
      if (this.cursorInfo) {
        select(this.cursorInfo).remove();
      }
    }
  }
  /**
   * 
   * @param anchor 
   */
  drag(anchor: NodeAnchor) {

    const anchorInterface = anchor.getAnchorInterfaceElement().node() as HTMLElement;

    interact(anchorInterface)
      .draggable({ manualStart: true })
      .on('move', event => {
        this.connectionOnMove(anchor, event);
      });
    interact(anchorInterface)
      .draggable({
        listeners: {
          start: () => {
            this.dragStart(anchor);
          },
          move: event => {
            this.facadeService.commonService.highlightInterface = false;
            this.dragMove(anchor, event, DragType.INTERFACE);
          },
          end: () => {
            this.facadeService.commonService.highlightInterface = true;
            this.dragEnd(anchor);

          }
        }
      });

    interact(anchor.anchorElement)
      .draggable({ manualStart: true })
      .on('move', event => {
        this.connectionOnMove(anchor, event);
      });

    interact(anchor.anchorElement)
      .draggable({ manualStart: true })
      .on('click', event => {
        // anchor.parentNode.parent !== ROOT_EDITOR
        if (anchor.interfaceStyle === intefaceStyle.DISCONNECTED) {
          this.facadeService.editorService.toggleAnchorSelection(anchor, event, anchor.isInput);
        }
        event.stopImmediatePropagation();
      });

    interact(anchor.anchorElement)
      .draggable({
        listeners: {
          start: () => {
            this.dragStart(anchor);
          },
          move: event => {
            this.facadeService.commonService.highlightInterface = false;
            this.dragMove(anchor, event, DragType.CONNECTIONNODE);
          },
          end: () => {
            this.facadeService.commonService.highlightInterface = true;
            this.dragEnd(anchor);
          }
        }
      });
  }
  /**
   * 
   * @param anchor 
   */
  removeAllConnectionsFromEditor(anchor:NodeAnchor)
  {
    for (const connector of anchor.connectors) {
      if(connector.type === ConnectorType.CONNECTOR)
      {
        this.facadeService.connectorService.removeConnectionFromCurrectEditor(connector as Connector);
      }
    }
  }
  /**
   * 
   * @param anchor 
   * @returns 
   */
  getAreaInterfaceIdDetails=(anchor:NodeAnchor):ISidePanel=>{
    let interfaceDetails:ISidePanel;
    if(anchor.parentNode && anchor.parentNode.type === FillingLineNodeType.AREA){
      const areaId =  anchor.parentNode.id;
      const interfaceId = anchor.interfaceData.id;
      if(anchor.isInput)
      {
        interfaceDetails=this.facadeService.dataService.getClientInterfaceIdDetailsById(areaId,interfaceId);
      }
      else
      {
        interfaceDetails=this.facadeService.dataService.getServerInterfaceIdDetailsById(areaId,interfaceId);
      }
    }
    return interfaceDetails;
  }
  /**
   * 
   * @param nodeAnchor 
   * @returns 
   */
  getAreaInterfaceDetails=(nodeAnchor:NodeAnchor):AreaClientInterface=>{
    let interfaceDetails:AreaClientInterface;
    if(nodeAnchor.parentNode && nodeAnchor.parentNode.type === FillingLineNodeType.AREA){
      if(nodeAnchor.isInput)
      {
        interfaceDetails= (nodeAnchor.parentNode as PlantArea).clientInterfaces.find(inf => inf.id === nodeAnchor.interfaceData.id);
      }
      else
      {
        interfaceDetails=(nodeAnchor.parentNode as PlantArea).serverInterfaces.find(inf => inf.id === nodeAnchor.interfaceData.id);
      }
    }
    return interfaceDetails;
  }
}

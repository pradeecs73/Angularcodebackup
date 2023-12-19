/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injectable } from '@angular/core';
import {
  AnchorAttribute,
  Angle,
  ConnectorArributes,
  ConnectorCreationMode,
  ConnectorState,
  ConnectorStyle,
  ConnectorType,
  DragType,
  SubConnectorCreationMode,
  subConnectorStyleAttributes
} from '../../enum/enum';
import { DetailedStatus } from '../../models/connection.interface';
import { AnchorCircle, ConfiguredConnectionObj, ConnectionPtObj, LiveLink } from '../../models/models';
import { RelatedEndPointInterface } from '../../models/targetmodel.interface';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { ROOT_EDITOR } from '../../utility/constant';
import { getConfiguredConenctionOnj, isInstanceOfConfiguredConnection, isNullOrEmpty, isNullOrUnDefined } from '../../utility/utility';
import {select} from '../../../app/vendors/d3.module';
import { NodeAnchor } from '../opcnodes/node-anchor';
import { Connector } from './connector';
import { SubConnector } from './subConnector';

export abstract class BaseConnector {
  id: string;
  arrowStyeId: string;
  isSelected: boolean;
  element: SVGElement;
  path: SVGGElement;
  pathOutline: SVGGElement;
  inputCircle: AnchorCircle;
  outputCircle: AnchorCircle;
  isInput: boolean;

  inputAnchor: NodeAnchor;
  outputAnchor: NodeAnchor;
  //target circle of connector
  dragElement: SVGGElement;
  //source circle of connector
  staticElement: SVGGElement;
  targetAnchor: NodeAnchor;
  //staticPort: any;
  dragType: DragType = DragType.CONNECTOR;
  isConnected: boolean;
  //isCreatedManually: boolean;

  plotPoints: Array<ConnectionPtObj>;

  angle: number;
  inLength: number;
  outLength: number;

  inLengthReverse: number;
  outLengthReverse: number;

  quadrant: number;
  curve: string;
  detailedStatus: DetailedStatus;

  /* Id of target anchor(input/output) highlighted while creating connection */
  highlightedAnchorId = '';
  editor: LiveLink;
  state: ConnectorState = ConnectorState.Default;
  creationMode: ConnectorCreationMode | SubConnectorCreationMode = ConnectorCreationMode.MANUAL;
  isOperational = false;

  connectorStyle: ConnectorStyle = ConnectorStyle.Default;
  connectionStatus: boolean; /** Diagnose */
  relatedEndPoint: RelatedEndPointInterface; /** Partner */

  type: ConnectorType;
  areaId: string = ROOT_EDITOR;

  interfaceType:string;

  constructor(editor: LiveLink, creationMode: ConnectorCreationMode | SubConnectorCreationMode, editorContext: string, id?: string) {
    this.editor = editor;
    this.editor.nextConnectorId++;
    this.id = id;
    this.isSelected = false;
    //HTML element : cloning from the predefined connector element in the canvas
    this.element = this.editor.connectorElem.cloneNode(true) as SVGElement;
    this.path = this.element.querySelector(`.${ConnectorArributes.CONNECTORPATH}`);
    this.pathOutline = this.element.querySelector(`.${ConnectorArributes.CONNECTORPATHOUTLINE}`);
    this.inputCircle = this.element.querySelector(`.${ConnectorArributes.INPUTHANDLE}`);
    this.outputCircle = this.element.querySelector(`.${ConnectorArributes.OUTPUTHANDLE}`);
    this.relatedEndPoint = { address: '' };
    this.connectionStatus = false;
    this.isConnected = false;
    this.creationMode = creationMode ?? this.creationMode;
    this.areaId = editorContext;
    this.bindHoverEvent();
  }
  /*
  * Arrow style
  */
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
      case ConnectorState.OnlineError:
        select(id).attr('fill', subConnectorStyleAttributes.ONLINEERROR);
        break;
      case ConnectorState.NonExistent:
        select(id).attr('fill', subConnectorStyleAttributes.TRANSPARENT);
        break;
      case ConnectorState.Default:
      default:
        select(id).attr('fill', subConnectorStyleAttributes.DEFAULT);
        break;
    }
  }
  /*
  * update the node anchor position
  */
  updateCirclePosition(anchor: NodeAnchor) {
    if (anchor === this.inputAnchor) {
      select(this.inputCircle)
        .attr('cx', anchor.global.x)
        .attr('cy', anchor.global.y);

      this.inputCircle.x = anchor.global.x;
      this.inputCircle.y = anchor.global.y;
    } else if (anchor === this.outputAnchor) {
      select(this.outputCircle)
        .attr('cx', anchor.global.x)
        .attr('cy', anchor.global.y);

      this.outputCircle.x = anchor.global.x;
      this.outputCircle.y = anchor.global.y;
    } else {
      return;
    }
  }

  /*
  * Draw connections
  */
  init(anchor: NodeAnchor) {
    this.isInput = anchor.isInput;
    /*
    *if connection is drawn from client isInput is true
    */
    if (this.isInput) {
      this.inputAnchor = anchor;
      this.dragElement = this.outputCircle;
      this.staticElement = this.inputCircle;
    } else {
      this.outputAnchor = anchor;
      this.dragElement = this.inputCircle;
      this.staticElement = this.outputCircle;
    }

    /*
    *static anchor is the source anchor
    */
    this.targetAnchor = anchor;

    this.dragElement?.setAttribute('data-drag', `${this.id}:${this.dragType}`);
    this.staticElement?.setAttribute('data-drag', `${this.id}:${DragType.ANCHOR}`);

    select(this.inputCircle)
      .attr('cx', anchor.global?.x)
      .attr('cy', anchor.global?.y);

    select(this.outputCircle)
      .attr('cx', anchor.global?.x)
      .attr('cy', anchor.global?.y);

   if(this.inputCircle){
       this.inputCircle.x = anchor.global?.x;
       this.inputCircle.y = anchor.global?.y;
   }

    if(this.outputCircle){
       this.outputCircle.x = anchor.global?.x;
       this.outputCircle.y = anchor.global?.y;
    }
  }
  /*
  * Events for mouse enter and mouse leave
  */
  bindHoverEvent =() => {
    this.element.addEventListener('mouseleave', () => {
      this.resetHoverStyle();
    });
    this.element.addEventListener('mouseenter', () => {
      this.setHoverStyle();
    });
  }
  /*
  * Update path
  */
  updatePath() {
    this.modifyCurvePts();
    this.buildCurveString();
    this.updateActualPath();
  }

  abstract modifyCurvePts();
  abstract buildCurveString();
  /*
  * update actual path
  */
  updateActualPath() {
    this.path.setAttribute('d', this.curve);
    this.pathOutline.setAttribute('d', this.curve);
  }

  //#region Setting Connection Path and Path Outline Style
  /*
  * set path style
  */
  protected setPathStyle(pathOutlineCls: string, pathCls?: string) {
    if (!pathCls) {
      pathCls = pathOutlineCls;
    }
    if (this.pathOutline && this.path) {
      select(this.pathOutline).attr('class', pathOutlineCls);
      select(this.path).attr('class', pathCls);
    }
  }


  //#endregion
  /*
  * find inclination
  */
  findInclination(): number {
    const x1 = this.outputCircle.x;
    const y1 = this.outputCircle.y;
    const x2 = this.inputCircle.x;
    const y2 = this.inputCircle.y;
    //Find the connector(straight line) inclination
    const angleRad = Math.atan2(y2 - y1, x2 - x1);
    //convert the radian to degree
    return angleRad * (Angle.STRAIGHTLINE_ANGLE / Math.PI);
  }
  /*
  * update angle
  */
  updateAngle(angle: number, i = 1) {
    this.angle = angle * (i + 1);
  }
  /*
  * set hover style
  */
  setHoverStyle() {
    this.addStyleToPath(ConnectorArributes.CONHOVERED, 'd');
    this.setAnchorHoveredStyle();
  }
  /*
  * Set anchor hover style
  */
  setAnchorHoveredStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.inputAnchor.setAnchorHoverStyle();
      this.outputAnchor.setAnchorHoverStyle();
    }
  }
  /*
  * Reset hover style
  */
  resetHoverStyle() {
    this.removeStyleFromPath(ConnectorArributes.CONHOVERED);
    this.resetAnchoHoverStyle();
  }
  /*
  * Reset anchor hover style
  */
  resetAnchoHoverStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.inputAnchor.resetAnchorHoverStyle();
      this.outputAnchor.resetAnchorHoverStyle();
    }
  }
  /*
  * remove style from path
  */
  protected removeStyleFromPath(pathOutlineCls: string, pathCls?: string) {
    if (!pathCls) {
      pathCls = pathOutlineCls;
    }
    if (this.pathOutline && this.path) {
      this.pathOutline.classList.remove(pathOutlineCls);
      this.path.classList.remove(pathCls);
    }
  }
  /*
  * Add style to path
  */
  protected addStyleToPath(pathOutlineCls: string, pathCls?: string) {
    if (!pathCls) {
      pathCls = pathOutlineCls;
    }
    if (this.pathOutline && this.path) {
      this.pathOutline.classList.add(pathOutlineCls);
      this.path.classList.add(pathCls);
    }
  }
  /*
  * Add path style opacity
  */
  protected addPathStyleOpacity(opacity: number) {
    select(this.pathOutline).style('opacity', opacity);
  }
  /*
  * Reset hightlighted anchor
  */
  resetHighlightedAnchor(anchor: NodeAnchor) {
    anchor.deHighLightInterface();
    select(`#interface-${this.highlightedAnchorId}`).attr('class', '');
    this.highlightedAnchorId = '';
  }

  //#region Style Related Functions
  /*
  * set default anchor style
  */
  setDefaultAnchorStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.inputAnchor.setAnchorDefaultStyle(true);
      this.outputAnchor.setAnchorDefaultStyle(false);
    }
  }
  /*
  * Update connector state in online mode based on creation mode
  */
  updateConnectorStateinOnline() {
    switch (this.creationMode) {
      case ConnectorCreationMode.ONLINE:
        this.setConnectionForOnlineMode();
        break;
      case SubConnectorCreationMode.MANUALONLINE:
         this.setConnectionForManualOnline();
        break;
      case SubConnectorCreationMode.MANUALOFFLINE:
        this.setConnectionForManualOffline();
        break;
      case ConnectorCreationMode.MANUAL:
      default:
        this.setConnectionDefaultColor();
        break;
    }
  }
  /*
  * Set connection state for online mode
  */
  setConnectionForOnlineMode(){
    if (this.isOperational) {
      //yellow dotted
      this.state = ConnectorState.Online;
    }
    else if (this.connectionStatus === false && this.relatedEndPoint.address !== '') {
      //red dotted
      this.state = ConnectorState.OnlineError;
    }
    else {
      this.state = ConnectorState.NonExistent;
    }
  }
  /*
  * Set connection state for manual  online mode
  */
  setConnectionForManualOnline(){
    if (this.isOperational) {
      this.state = ConnectorState.Online;
    }
    else if (this.connectionStatus === false && this.relatedEndPoint.address !== '') {
      this.state = ConnectorState.OnlineError;
    }
    else {
      this.state = ConnectorState.Default;
    }
  }
  /*
  * Set connection state for manual offline mode
  */
  setConnectionForManualOffline(){
    this.state=ConnectorState.NonExistent;
  }
  /*
  * Set connection default color
  */
  setConnectionDefaultColor(){
    if (this.isOperational) {
      this.state = ConnectorState.Success;
    }
    if (this.connectionStatus === false && this?.relatedEndPoint?.address !== '') {
      this.state = ConnectorState.Error;
    }
    if (this.connectionStatus === false && this?.relatedEndPoint?.address === '') {
      this.state = ConnectorState.Default;
    }
    // else{
    //   this.state=ConnectorState.NonExistent;
    // }
  }
  /*
  * Set connector default selected style
  */
  setConnectorDefaultSelectedStyle() {
    this.addStyleToPath(ConnectorArributes.CONNECTORPATHOUTLINESELECTED, ConnectorArributes.CONNPATHSELECTED);
    if (this.outputAnchor && this.inputAnchor) {

      this.inputAnchor.setAnchorDefaultSelectedStyle(true);
      this.outputAnchor.setAnchorDefaultSelectedStyle(false);
    }
  }

  /*
  * Update connection end point status
  */
  updateConnectionEndPointStatus(connectionStatus: boolean, relatedEndPoint?: RelatedEndPointInterface, detailedStatus?: DetailedStatus) {
    if (!isNullOrUnDefined(connectionStatus)) {
      this.updateConnectionStatus(connectionStatus);
    }
    if (!isNullOrUnDefined(relatedEndPoint) && (typeof relatedEndPoint.address !== 'undefined')) {
      this.updateRelatedEndpoint(relatedEndPoint);
    }
    if (!isNullOrUnDefined(detailedStatus)) {
      this.updateDetailedStatus(detailedStatus);
    }
    this.isOperational = this.connectionStatus && this.connectionStatus === true
      && this.relatedEndPoint && !isNullOrEmpty(this.relatedEndPoint.address);
  }
  /*
  * Set online data
  */
  setOnlineData()//conenctionEndPointDetails:ConenctionEndPointDetails)
  {
    this.updateConnectorStateinOnline();
    this.setOnlineStyle();
  }
  /*
  * update detailed status
  */
  protected updateDetailedStatus(detailedStatus: DetailedStatus) {
    this.detailedStatus = detailedStatus;
  }
  /*
  * update connection status
  */
  protected updateConnectionStatus(connectionStatus: boolean) {
    this.connectionStatus = connectionStatus;
    if (this.inputAnchor) {
      this.inputAnchor.connectionStatus = connectionStatus;
    }
  }
  /*
  * update related end point
  */
  protected updateRelatedEndpoint(relatedEndPoint: RelatedEndPointInterface) {
    this.relatedEndPoint = relatedEndPoint;
    if (this.inputAnchor) {
      this.inputAnchor.relatedEndPoint = relatedEndPoint;
    }
  }

  /*
  * Set unselected style
  */
  setUnSelectedStyle() {
    if (!this.isSelected) {
      switch (this.state) {
        case ConnectorState.Error:
          this.connectorStyle = ConnectorStyle.Error;
          this.removeStyleFromPath(ConnectorArributes.CONPATHOUTLINEFAILSELECTED, ConnectorArributes.CONNPATHSELECTED);
          this.setAnchorFailureStyle();
          break;
        case ConnectorState.Success:
          this.connectorStyle = ConnectorStyle.Success;
          this.removeStyleFromPath(ConnectorArributes.CONPATHOUTLINESUCCESSSELECTED, ConnectorArributes.CONNPATHSELECTED);
          this.setAnchorSuccessStyle();
          break;
        case ConnectorState.Online:
          this.connectorStyle = ConnectorStyle.Online;
          this.removeStyleFromPath(ConnectorArributes.CONPATHOUTLINEONLINESELECTED, ConnectorArributes.CONNPATHSELECTED);
          this.addStyleToPath(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHONLINE);
          this.setAnchorOnlineStyle();
          break;
        // case ConnectorState.OnlineError :
        //     this.setAnchorOnlineFailureStyle();
        //     break;
        case ConnectorState.OnlineError:
          this.connectorStyle = ConnectorStyle.OnlineError;
          this.removeStyleFromPath(ConnectorArributes.CONPATHOUTLINEONLINEERRORSELECTED, ConnectorArributes.CONNPATHSELECTED);
          this.addStyleToPath(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHONLINEERROR);
          this.setAnchorOnlineErrorStyle();
          break;
        case ConnectorState.Proposed:
          this.connectorStyle = ConnectorStyle.SingleProposed;
          this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINESELECTED, ConnectorArributes.CONNPATHSELECTED);
          this.setAnchorProposedConenctionStyle();
          break;
        case ConnectorState.Default:
        default:
          this.connectorStyle = ConnectorStyle.Default;
          this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINESELECTED, ConnectorArributes.CONNPATHSELECTED);
          this.setDefaultAnchorStyle();
          break;
      }
    }
  }
  /*
  * Set default style
  */
  setDefaultStyle() {
    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINESELECTED, ConnectorArributes.CONNPATHSELECTED);
    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE_NO_CONNECTION, ConnectorArributes.CONNECTORPATH_NO_CONNECTION);

    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHSUCCESS);
    this.removeStyleFromPath(ConnectorArributes.CONPATHOUTLINESUCCESSSELECTED, ConnectorArributes.CONNPATHSELECTED);

    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTORPATHFAIL);
    this.removeStyleFromPath(ConnectorArributes.CONPATHOUTLINEFAILSELECTED, ConnectorArributes.CONNPATHSELECTED);

    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE_PROPOSED, ConnectorArributes.CONNECTORPATH_PROPOSED);
    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE_SELECTPROPOSED, ConnectorArributes.CONNPATHSELECTED);

    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHONLINE);
    this.removeStyleFromPath(ConnectorArributes.CONPATHOUTLINEONLINESELECTED, ConnectorArributes.CONNPATHSELECTED);

    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHONLINEERROR);
    this.removeStyleFromPath(ConnectorArributes.CONPATHOUTLINEONLINEERRORSELECTED, ConnectorArributes.CONNPATHSELECTED);

    this.addStyleToPath(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTORPATH);
    this.setDefaultAnchorStyle();
  }
  /*
  * Set success style
  */
  setSuccessStyle() {
    this.setPathStyle(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHSUCCESS);
    this.setAnchorSuccessStyle();
  }
  /*
  * set anchor success style
  */
  setAnchorSuccessStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setSuccessAnchorStyle(false);
      this.inputAnchor.setSuccessAnchorStyle(true);
    }
  }
  /*
  * Set failure style
  */
  setFailureStyle() {
    this.setPathStyle(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTORPATHFAIL);
    this.setAnchorFailureStyle();
  }
  /*
  * Set anchor failure style
  */
  setAnchorFailureStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setFailureStyle(false);
      this.inputAnchor.setFailureStyle(true);
    }
  }
  /*
  * Set online style
  */
  setOnlineStyle() {
    this.setUnSelectedStyle();
    switch (this.state) {
      case ConnectorState.Error:
        this.connectorStyle = ConnectorStyle.Error;
        this.setFailureStyle();
        break;
      case ConnectorState.Success:
        this.connectorStyle = ConnectorStyle.Success;
        this.setSuccessStyle();
        break;
      case ConnectorState.Online:
        this.connectorStyle = ConnectorStyle.Online;
        this.setOnlineConStyle();
        break;
      case ConnectorState.OnlineError:
        this.connectorStyle = ConnectorStyle.OnlineError;
        this.setOnlineConErrorStyle();
        break;
      case ConnectorState.NonExistent:
        this.connectorStyle = ConnectorStyle.NonExistant;
        this.setTransparentStyle();
        break;
      case ConnectorState.Default:
      default:
        this.connectorStyle = ConnectorStyle.Default;
        this.setDefaultStyle();
        break;
    }
  }

  // setUnSelectedStyle() {
  //   if (!this.isSelected) {
  //     this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINESELECTED, ConnectorArributes.CONNPATHSELECTED);
  //     this.setDefaultAnchorStyle();
  //   }
  // }
  /*
  * Set transparent style
  */
  setTransparentStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.setPathStyle(ConnectorArributes.CONNECTORPATHOUTLINE_NO_CONNECTION, ConnectorArributes.CONNECTORPATH_NO_CONNECTION);
      this.outputAnchor.setNoConnectionStyle(false);
      this.inputAnchor.setNoConnectionStyle(true);
    }
  }
  /*
  * Set online connection style
  */
  setOnlineConStyle() {
    this.setPathStyle(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHONLINE);
    this.setAnchorOnlineStyle();
  }
  /*
  * Set anchor online style
  */
  setAnchorOnlineStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setOnlineSuccessAnchorStyle(false);
      this.inputAnchor.setOnlineSuccessAnchorStyle(true);
    }
  }
  /*
  * Set online connection error style
  */
  setOnlineConErrorStyle() {
    this.setPathStyle(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHONLINEERROR);
    this.setAnchorOnlineErrorStyle();
  }
  /*
  * Set anchor online error style
  */
  setAnchorOnlineErrorStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setOnlineErrorAnchorStyle(false);
      this.inputAnchor.setOnlineErrorAnchorStyle(true);
    }
  }

  /*
  * Set selected style
  */
  setSelectedStyle() {
    switch (this.state) {
      case ConnectorState.Error:
        this.connectorStyle = ConnectorStyle.ErrorSelect;
        this.setConnectorFailSelectedStyle();
        break;
      case ConnectorState.Success:
        this.connectorStyle = ConnectorStyle.SuccessSelect;
        this.setConnectorSuccessSelectedStyle();
        break;
      case ConnectorState.Online:
        this.connectorStyle = ConnectorStyle.OnlineSelect;
        this.setConnectorOnlineSelectedStyle();//??
        break;
      case ConnectorState.OnlineError:
        this.connectorStyle = ConnectorStyle.OnlineError;
        this.setConnectorOnlineErrorSelectedStyle();
        break;
      case ConnectorState.Proposed:
        this.connectorStyle = ConnectorStyle.SelectSingleProposed;
        this.setSelectedProposedConnectorStyle();
        break;
      case ConnectorState.NonExistent:
        break;
      case ConnectorState.Default:
      default:
        this.connectorStyle = ConnectorStyle.Select;
        this.setConnectorDefaultSelectedStyle();
        break;
    }
  }

  /*
  * Set conenctor success selected style
  */
  setConnectorSuccessSelectedStyle() {
    this.addStyleToPath(ConnectorArributes.CONPATHOUTLINESUCCESSSELECTED, ConnectorArributes.CONNPATHSELECTED);
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setAnchorSuccessSelectedStyle(false);
      this.inputAnchor.setAnchorSuccessSelectedStyle(true);
    }
  }
  /*
  * Set connector fail selected style
  */
  setConnectorFailSelectedStyle() {
    this.addStyleToPath(ConnectorArributes.CONPATHOUTLINEFAILSELECTED, ConnectorArributes.CONNPATHSELECTED);
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setAnchorFailureSelectedStyle(false);
      this.inputAnchor.setAnchorFailureSelectedStyle(true);
    }
  }
  /*
  * Set connector online selected style
  */
  setConnectorOnlineSelectedStyle() {
    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHONLINE);
    this.addStyleToPath(ConnectorArributes.CONPATHOUTLINEONLINESELECTED, ConnectorArributes.CONNPATHSELECTED);
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setAnchorOnlineSelectedStyle(false);
      this.inputAnchor.setAnchorOnlineSelectedStyle(true);
    }
  }
  /*
  * Set connector online error selected style
  */
  setConnectorOnlineErrorSelectedStyle() {
    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHONLINEERROR);
    this.addStyleToPath(ConnectorArributes.CONPATHOUTLINEONLINEERRORSELECTED, ConnectorArributes.CONNPATHSELECTED);
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setAnchorOnlineErrorSelectedStyle(false);
      this.inputAnchor.setAnchorOnlineErrorSelectedStyle(true);
    }
  }
  /*
  * Remove anchor conenctor
  */
  removeAnchorConnectors() {
    if (this.inputAnchor) {
      this.inputAnchor.removeConnector(this);
      this.inputAnchor.setDisconnectedInterfaceStyle();
    }
    if (this.outputAnchor) {
      this.outputAnchor.removeConnector(this);
      this.outputAnchor.setDisconnectedInterfaceStyle();
    }
  }
  /*
  * reset
  */
  reset() {
    this.isSelected = false;
    this.isConnected = false;
    this.path.removeAttribute('d');
    this.pathOutline.removeAttribute('d');
    this.dragElement.removeAttribute('data-drag');
    this.staticElement.removeAttribute('data-drag');
    select(this.dragElement)
      .attr('cx', 0)
      .attr('cy', 0);
    select(this.staticElement)
      .attr('cx', 0)
      .attr('cy', 0);
  }
  /*
  * reset anchor style
  */
  resetAnchorsStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.inputAnchor.resetInPutAnchorStyle();
      this.outputAnchor.resetOutPutAnchorStyle();
    }
  }
  /*
  * Set anchor proposed connection style
  */
  setAnchorProposedConenctionStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.resetOutPutAnchorStyle();
      this.inputAnchor.resetInPutAnchorStyle();
    }
  }

  //#region Proposed Connections Style

  //solid gray to dark blue on click
  setSelectedProposedConnectorStyle() {
    this.addStyleToPath(ConnectorArributes.CONNECTORPATHSELECTPROPOSEDROWSELECT);
    if (this.outputAnchor && this.inputAnchor) {
      select(this.outputAnchor.anchorScrim).attr('class', 'scrim');
      select(this.inputAnchor.anchorScrim).attr('class', 'scrim');
      select(this.outputAnchor.anchorElement).select('#outer').attr('class', AnchorAttribute.OUTERCIRCLE);
      select(this.inputAnchor.anchorElement).select('#outer-2').attr('class', AnchorAttribute.OUTERCIRCLE);
    }
  }
  //#endregion
  /*
  * Reset end point details
  */
  resetEndPointDetails(resetPartner = true) {
    let relatedEndPoint;
    if (resetPartner === true) {
      relatedEndPoint = { ...this.relatedEndPoint };
      relatedEndPoint.address = '';
      relatedEndPoint.automationComponent = '';
      relatedEndPoint.functionalEntity = '';
    }
    this.updateConnectionEndPointStatus(false, relatedEndPoint);
  }
}

@Injectable({
  providedIn: 'root'
})
export abstract class BaseConnectorService {

  constructor(
    protected readonly facadeService: FacadeService
  ) { }

  abstract connect(connector: BaseConnector);
    /*
  * Bind click event
  */
  bindClickEvent(connector: BaseConnector) {
    this.selectOnClick(connector.path,connector);
    this.selectOnClick(connector.pathOutline,connector);
  }
  /*
  * Select on click
  */
  selectOnClick(connectorPath,connector :BaseConnector ){
    select(connectorPath
      ).on('click', event => {
      if(event.ctrlKey){
        this.facadeService.editorService.setIsMultiSelected(true);
      }
      this.selectConnector(connector);
    });
  }
  /*
  * remove
  */
  remove(connector: BaseConnector) {
    connector?.removeAnchorConnectors();
    connector?.reset();
    connector?.resetAnchorsStyle();
  }
  /*
  * Place handle
  */
  placeHandle(hitAnchor: NodeAnchor, connector: BaseConnector) {
    if (connector.isInput) {
      connector.outputAnchor = hitAnchor;
    } else {
      connector.inputAnchor = hitAnchor;
    }
    /*
    *remove highlight interface once anchor is placed
    */
    connector.resetHighlightedAnchor(hitAnchor);
    connector.setDefaultAnchorStyle();
    this.refreshConList();
    this.facadeService.commonService.expandAccordion = false;

    connector.dragElement.setAttribute('data-drag', `${hitAnchor.id}:${hitAnchor.dragType}`);

    hitAnchor.addConnector(connector);
    hitAnchor.update();

    connector.isConnected = true;
  }
  /*
  * Refresh connection list
  */
  refreshConList() {
    const actualConnectionList: Array<ConfiguredConnectionObj> = [];
    const connectorLookup = this.facadeService.editorService.liveLinkEditor.connectorLookup;
    for (const key in connectorLookup) {
      if (connectorLookup.hasOwnProperty(key)) {
        const con: Connector = connectorLookup[key];
        if (con.inputAnchor && con.outputAnchor) {
          const actualObj: ConfiguredConnectionObj = getConfiguredConenctionOnj(con);
          actualConnectionList.push(actualObj);
        }
      }
    }
    this.facadeService.commonService.globalConnectionList = actualConnectionList;
    this.facadeService.commonService.manualConnectionList = this.facadeService.commonService.globalConnectionList.filter((item: ConfiguredConnectionObj) =>
      item.connector.state === ConnectorState.Proposed || item.state === ConnectorState.Proposed);
  }
  /*
  * Select connector
  */
  selectConnector(connector: BaseConnector) {
    if (!this.facadeService.editorService.isConnectionMultiSelect || this.facadeService.commonService.isOnline) {
      this.facadeService.editorService.deselectAllNodes();
      if (this.facadeService.commonService.isActualConnectionMode) {
        this.facadeService.editorService.deselectAllConnectors();
        this.facadeService.editorService.resetMultiSelectedSubConnection();
      }
    } else {
      /* For connector
      */
      if (connector.type === ConnectorType.CONNECTOR) {
        this.facadeService.editorService.addOrUpdateMultiSelectConnector(connector as Connector);
      }
    }
    /* for subconnector
    */
    if (connector.type === ConnectorType.SUBCONNECTOR) {
      this.facadeService.editorService.addOrUpdateMultiSelectSubConnector(connector as SubConnector);
      if (connector.targetAnchor.interfaceData.isClientInterface) {
        this.facadeService.editorService.setSubConnectionViewType('client');
      }
      else {
        this.facadeService.editorService.setSubConnectionViewType('server');
      }
    }
    /*
    *select current connectors
    */
    connector.isSelected = !connector.isSelected;
    if (connector.isSelected) {
      this.resetConnectionList();/* table selection */
      this.setSelectedStyle(connector);
    } else {
      connector.setUnSelectedStyle();
    }
  }
  /*
  * Set selected style
  */
  setSelectedStyle(connector: BaseConnector) {
    connector.setSelectedStyle();
    this.updateConnectortoCommon(connector);
  }
  /*
  * update connector to common
  */
  updateConnectortoCommon(connector: BaseConnector) {
    this.facadeService.editorService.selectedConnection = connector;
    this.facadeService.editorService.setSelectedConnection(connector);
  }
  /*
  * reset connection list
  */
  resetConnectionList() {
    this.facadeService.commonService.globalConnectionList.forEach(item => {
      if (isInstanceOfConfiguredConnection(item) && this.facadeService.commonService.isActualConnectionMode) {
        item.isActualConRowSelected = false;
      } else {
        item.isRowSelected = false;
      }
    });
  }
}

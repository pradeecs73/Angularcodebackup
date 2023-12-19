/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { select } from '../../../app/vendors/d3.module';
import {
  AnchorAttribute, ConnectorArributes, ConnectorCreationMode, ConnectorState,
  ConnectorStyle, Quadrant, Angle, Numeric, ConnectorType, FillingLineNodeType, DeviceState
} from '../../enum/enum';
import { getConnectData, getConnectionDetails, getConnectionID, getConnectionObject, getRelatedEndPointData } from '../../utility/utility';
import { NodeAnchor } from '../opcnodes/node-anchor';
import { Injectable } from '@angular/core';
import { LiveLink } from '../../models/models';
import { DEFAULT_CONNECTION_LENGTH } from '../../utility/constant';
import { AreaClientInterface, AreaInterface, RelatedEndPointInterface } from '../../models/targetmodel.interface';
import { BaseConnector, BaseConnectorService } from './baseConnector';
import { Connection, ConnectionData, ConnectionDetails, ConnectorPoints, SubConnection, SubConnectionIdList } from '../../models/connection.interface';
import { FacadeService } from '../../livelink-editor/services/facade.service';

export class Connector extends BaseConnector {

  connectorStyle: ConnectorStyle = ConnectorStyle.Default;
  type: ConnectorType = ConnectorType.CONNECTOR;
  hasSubConnections = false;
  subConnectors: SubConnectionIdList;
  creationMode: ConnectorCreationMode = ConnectorCreationMode.MANUAL;

  inputDeviceId: string;
  outputDeviceId: string;
  constructor(editor: LiveLink, creationMode: ConnectorCreationMode, editorContext: string, id?: string, subConnectors?: { clientIds: string[], serverIds: string[] }) {
    super(editor, creationMode, editorContext, id);
    this.creationMode = creationMode;
    this.subConnectors = subConnectors || { clientIds: [], serverIds: [] };
    if (this.subConnectors && (this.subConnectors.clientIds?.length > 0 || this.subConnectors.serverIds?.length > 0)) {
      this.hasSubConnections = true;
    }
  }

  /*
  * Update handle
  *
  */
  updateHandle(anchor: NodeAnchor) {
    this.updateCirclePosition(anchor);
    this.updatePath();
  }
  /*
  * Update server sub connector id
  *
  */
  updateServerSubConnectorId(subConnectionId: string) {
    this.subConnectors.serverIds[0] = subConnectionId;
    this.hasSubConnections = true;
  }
  /*
  *
  * Set connection id
  */
  setConnectionId() {
    const inputACId = this.inputAnchor?.parentNode?.id;
    const outputACId = this.outputAnchor?.parentNode?.id;
    this.id = getConnectionID(inputACId, outputACId, this.inputAnchor?.interfaceData?.type);
  }
  /*
  *
  * Set device id
  */
  setDeviceId() {
    if (this.inputAnchor) {
      this.inputDeviceId = this.inputAnchor.deviceId;
      if (this.inputAnchor.parentNode.type === FillingLineNodeType.AREA) {
        this.inputDeviceId = (this.inputAnchor.interfaceData as AreaInterface).deviceId;
      }
    }
    if (this.outputAnchor) {
      this.outputDeviceId = this.outputAnchor.deviceId;
      if (this.outputAnchor.parentNode.type === FillingLineNodeType.AREA) {
        this.outputDeviceId = (this.outputAnchor.interfaceData as AreaInterface).deviceId;
      }
    }
  }
  /*
  *
  * highligh source interface
  */
  highlightSourceInterface() {
    this.targetAnchor.highLightInterface();
  }
  /*
  * Dehighlight source interface
  *
  */
  dehighlightSourceInterface() {
    this.targetAnchor.deHighLightInterface();
  }
  /*
  * Validate
  *
  */
  validate(): boolean {
    //Target Anchor
    const sourceAnchor = this.getSourceAnchor();
    if (sourceAnchor) {
      const isValid = this.isValidConnection(sourceAnchor);
      if (isValid) {
        //Target Anchor
        sourceAnchor.highLightInterface();
        //sourceAnchor.setConnectedInterfaceStyle();
        //source Anchor
        //this.targetAnchor.highLightInterface();
      }
      // else{
      //   this.targetAnchor.deHighLightInterface();
      // }
      if (!isValid) {
        sourceAnchor.deHighLightInterface();
      }

      return isValid;
    } else {
      return false;
    }
  }
  /*
  * Function checks if connection valid
  *
  */
  isValidConnection(sourceAnchor: NodeAnchor): boolean {
    let isValid = false;
    if (sourceAnchor && (sourceAnchor.interfaceData.type === this.targetAnchor.interfaceData.type)) {
      isValid = true;
      if (sourceAnchor.connectors?.length) {
        isValid = !sourceAnchor.connectors[0].isConnected && isValid;
      }
    }
    return isValid;
  }

  /**
   * checks in the connector-lookup if InterfaceId is matching with the existing connection with
   * same InterfaceId and type
   * @param sourceAnchor
   * @param connectionsList
   * @returns true if the anchor is already connected
   */
  isAnchorAlreadyConnected(sourceAnchor: NodeAnchor, connectionsList: Array<Connection>): boolean {
    if (sourceAnchor && this.targetAnchor && connectionsList && connectionsList.length) {
      const sourceInterfaceId = sourceAnchor.interfaceData.id;
      const targetInterfaceId = this.targetAnchor.interfaceData.id;
      return connectionsList.some(connector => {
        const connectionDetails: ConnectionDetails = getConnectionDetails(connector);
        return (
          connectionDetails.interfaceType === sourceAnchor.interfaceData.type &&
          connectionDetails.interfaceType === this.targetAnchor.interfaceData.type &&
          (connector.in.includes(sourceInterfaceId) || connector.out.includes(targetInterfaceId))
        );
      });
    }
    return false;
  }

  /**
   * This method checks if both source and target anchor are from same device
   * @param sourceAnchor
   * @returns true if both anchors are from same device
   */
  isBothAnchorOfSameDevice(sourceAnchor: NodeAnchor): boolean {
    if (sourceAnchor && this.targetAnchor) {
      const sourceAnchorDeviceId = sourceAnchor.deviceId;
      const targetAnchorDeviceId = this.targetAnchor.deviceId;
      return sourceAnchorDeviceId === targetAnchorDeviceId;
    }
    return false;
  }

  //#region Collision Check Implementation
/*
  * REturns source anchor
  *
  */
  getSourceAnchor(): NodeAnchor {
    let sourceAnchor: NodeAnchor;
    const nodes = this.editor.editorNodes.filter(node => this.testCircleNodeCollision(this.dragElement, node.element));
    for (const node of nodes) {
      const anchorList = this.getNodeAnchors(node);
      sourceAnchor = anchorList.find(anchor => this.testAnchorCollision(this.dragElement, anchor, this.targetAnchor.isInput));
      if (sourceAnchor && sourceAnchor.interfaceData.type === this.targetAnchor.interfaceData.type) {
        this.highlightedAnchorId = sourceAnchor.anchorElement.id;
      }
    }
    return sourceAnchor;
  }
  /*
  * Test circle node collission
  *
  */
  private testCircleNodeCollision(elem1: SVGGElement, elem2: SVGGElement) {
    // BOUNDING BOX OF THE FIRST OBJECT
    const e1: DOMRect = elem1.getBoundingClientRect();
    // BOUNDING BOX OF THE SECOND OBJECT
    const e2: DOMRect = elem2.getBoundingClientRect();
    // CHECK IF THE TWO BOUNDING BOXES OVERLAP
    return !(e2.left > e1.right ||
      e2.right < e1.left ||
      e2.top > e1.bottom ||
      e2.bottom < e1.top);
  }

  //checks if anchor is close to client/server interfaces
  private testAnchorCollision(dragElement: SVGGElement, sourceAnchor: NodeAnchor, isInput: boolean): boolean {
    // BOUNDING BOX OF THE FIRST OBJECT
    const e1: DOMRect = dragElement.getBoundingClientRect();
    // BOUNDING BOX OF THE SECOND OBJECT
    const e2: DOMRect = sourceAnchor.anchorElement.getBoundingClientRect();

    const anchorWidth = (sourceAnchor.getAnchorInterfaceElement().node() as SVGGElement).getBoundingClientRect().width;
    const anchorHeight = (sourceAnchor.getAnchorInterfaceElement().node() as SVGGElement).getBoundingClientRect().height / Numeric.TWO;

    //client to server connection
    if (isInput) {
      return this.clientToServerCollision(e2, e1, anchorWidth, anchorHeight);
    } else {
      //server to client connection
      return this.serverToClientCollision(e2, e1, anchorWidth, anchorHeight);
    }
  }
  /*
  * Serve to client collision
  *
  */
  private serverToClientCollision(e2, e1, anchorWidth: number, anchorHeight: number): boolean {
    const e1TopUpdated = e1.top - anchorHeight;
    const e1BottomUpdated = e1.top + anchorHeight;
    const e1LeftUpdated = e1.left - anchorWidth;

    return !(e2.left > e1.right ||
      e2.right < e1LeftUpdated ||
      e2.top > e1BottomUpdated ||
      e2.bottom < e1TopUpdated);
  }
  /*
  * Client to server collission
  *
  */
  private clientToServerCollision(e2, e1, anchorWidth: number, anchorHeight: number): boolean {
    const e2LeftUpdated = e2.left - anchorWidth;
    const e2TopUpdated = e2.top - anchorHeight;
    const e2BottomUpdated = e2.bottom + anchorHeight;

    return !(e2LeftUpdated > e1.right ||
      e2.right < e1.left ||
      e2TopUpdated > e1.bottom ||
      e2BottomUpdated < e1.top);
  }
  /*
  * Get node anchors
  *
  */
  private getNodeAnchors(node): Array<NodeAnchor> {
    let anchors = node.outputs;
    if (this.isInput === false) {
      anchors = node.inputs;
    }
    return anchors;
  }

  //#endregion

  // getConnectionObject(from?): Connection {
  //   let conObj: Connection = null;
  //   if (this.inputAnchor && this.outputAnchor) {
  //     conObj = getConnectionObject(this, from);
  //   }
  //   return conObj;
  // }
  /*
  * Get parent by node Id
  *
  */
  getParentNodeId() {
    return this.inputAnchor.parentNode.id;
  }
  /*
  * Get parent node input id
  *
  */
  getParentNodeIInputId() {
    return this.inputAnchor.parentNode.id;
  }


  //#region Style Related Functions
  /*
  *
  * Set default anchor style interface
  */
  setDefaultAnchorStyleInterface() {
    if (this.outputAnchor && this.inputAnchor) {
      this.inputAnchor.setAnchorDefaultStyle(false);
      this.outputAnchor.setAnchorDefaultStyle(true);
    }
  }
  /*
  *
  * Set success style
  */
  setSuccessStyle() {
    this.setPathStyle(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHSUCCESS);
    this.setAnchorSuccessStyle();
  }
  /*
  * Set anchor failure style
  *
  */
  setAnchorFailureStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setFailureStyle(false);
      this.inputAnchor.setFailureStyle(true);
    }
  }
  /*
  * set failure style
  *
  */
  setFailureStyle() {
    this.setPathStyle(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTORPATHFAIL);
    this.setAnchorFailureStyle();
  }
  /*
  *
  * set anchor success style
  */
  setAnchorSuccessStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setSuccessAnchorStyle(false);
      this.inputAnchor.setSuccessAnchorStyle(true);
    }
  }
  /*
  * set online connector style
  *
  */
  setOnlineConStyle() {
    this.setPathStyle(ConnectorArributes.CONNECTORPATHOUTLINE, ConnectorArributes.CONNECTPATHONLINE);
    this.setAnchorOnlineStyle();
  }
  /*
  * set anchor online style
  *
  */
  setAnchorOnlineStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.setOnlineSuccessAnchorStyle(false);
      this.inputAnchor.setOnlineSuccessAnchorStyle(true);
    }
  }

  //No Connection


  /*
  * set selected anchors style
  *
  */
  //row Select
  setSelectedAnchorsStyle() {
    if (this.outputAnchor && this.inputAnchor) {
      this.inputAnchor.setAnchorSelectedStyle(true);
      this.outputAnchor.setAnchorSelectedStyle(false);
    }
  }
  /*
  *
  * Set proposed connector select style
  */
  //dotted gray to dark blue on click
  setProposedConnectorSelectStyle() {
    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHOUTLINE_PROPOSED, ConnectorArributes.CONNECTORPATH_PROPOSED);
    this.addStyleToPath(ConnectorArributes.CONNECTORPATHROWSELECT);
    if (this.outputAnchor && this.inputAnchor) {
      select(this.outputAnchor.anchorScrim).attr('class', 'scrim');
      select(this.inputAnchor.anchorScrim).attr('class', 'scrim');
      select(this.outputAnchor.anchorElement).select('#outer').attr('class', AnchorAttribute.OUTERCIRCLE);
      select(this.inputAnchor.anchorElement).select('#outer-2').attr('class', AnchorAttribute.OUTERCIRCLE);
    }
  }
  /*
  *
  * Default selected proposed connection style
  */
  defaultSelectedProposedConnectionStyle() {
    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHSELECTPROPOSEDROWSELECT);
    this.addStyleToPath(ConnectorArributes.CONNECTORPATHOUTLINE_SELECTPROPOSED);
    if (this.outputAnchor && this.inputAnchor) {
      this.outputAnchor.resetOutPutAnchorStyle();
      this.inputAnchor.resetInPutAnchorStyle();
    }
  }
  /*
  * Set unselected proposed connection style
  *
  */
  setUnselectedProposedConnectionStyle() {
    this.removeStyleFromPath(ConnectorArributes.CONNECTORPATHROWSELECT);
    this.addStyleToPath(ConnectorArributes.CONNECTORPATHOUTLINE_PROPOSED, ConnectorArributes.CONNECTORPATH_PROPOSED);
    this.setAnchorProposedConenctionStyle();
  }



  //#endregion

  //#endregion *************************Style Related Functions *******************/

  //#region Connector Path and Curve Related Functions
  /*
  *
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
  *
  * Build curvestring
  */
  buildCurveString() {

    switch (this.quadrant) {
      case Quadrant.FIRST: {
        const [pt1, pt2, pt3, pt4, pt5] = this.plotPoints;
        const ly = pt2.y - pt3.y;
        this.curve = `M${pt1.x},${pt1.y} L${pt2.x},${pt2.y} l0,${-ly} L${pt3.x},${pt3.y} L${pt4.x},${pt4.y} L${pt5.x},${pt5.y}`;
        break;
      }
      case Quadrant.SECOND: {
        const [pt1, pt2, pt3, pt4] = this.plotPoints;
        const ly = -(pt2.y - pt3.y);
        this.curve = `M${pt1.x},${pt1.y} L${pt2.x},${pt2.y} l0,${ly} L${pt2.x},${pt3.y} L${pt4.x},${pt4.y}`;
        break;
      }
      case Quadrant.THIRD: {
        const [pt1, pt2, pt3, pt4] = this.plotPoints;
        const ly = pt3.y - pt2.y;
        this.curve = `M${pt1.x},${pt1.y} L${pt2.x},${pt2.y} l0,${ly} L${pt2.x},${pt3.y} L${pt4.x},${pt4.y}`;
        break;
      }
      case Quadrant.FOURTH: {
        const [pt1, pt2, pt3, pt4, pt5] = this.plotPoints;
        const ly = pt3.y - pt2.y;
        this.curve = `M${pt1.x},${pt1.y} L${pt2.x},${pt2.y} l0,${ly} L${pt3.x},${pt3.y}  L${pt4.x},${pt4.y} L${pt5.x},${pt5.y}`;
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
      case Quadrant.SECOND:
        this.setSecondQuadrantPt();
        break;
      case Quadrant.THIRD:
        this.setThirdQuadrantPt();
        break;
      case Quadrant.FOURTH:
        this.setFourthQuadrantPt();
        break;
      case Quadrant.FIRST:
        this.setFirstQuadrantPt();
        break;
      default:
        return;
    }
  }
  /*
  * set quadrant value
  *
  */
  private setQuardantValue() {
    const inclinedAngle = this.findInclination();
    if (inclinedAngle >= 0 && inclinedAngle < Angle.RIGHT_ANGLE) {
      this.quadrant = 3;
    }
    // -ve amd 2nd Quadrant
    else if (inclinedAngle < 0 && inclinedAngle > -Angle.RIGHT_ANGLE) {
      this.quadrant = 2;
    }
    // 1st Quadrant
    else if (inclinedAngle < -Angle.RIGHT_ANGLE && inclinedAngle > -Angle.STRAIGHTLINE_ANGLE) {
      this.quadrant = 1;
    }
    // 4th Quadrant
    else /*if (inclinedAngle > Angle.RIGHT_ANGLE && inclinedAngle < Angle.STRAIGHTLINE_Angle)*/ {
      this.quadrant = 4;
    }
  }
  /*
  * Set first quadrant point
  *
  */
  private setFirstQuadrantPt() {
    const inclinedAngle = (Angle.RIGHT_ANGLE + this.angle * (Math.PI / Angle.STRAIGHTLINE_ANGLE));
    const pt1 = {
      x: this.outputCircle.x,
      y: this.outputCircle.y
    };
    const pt5 = {
      x: this.inputCircle.x,
      y: this.inputCircle.y
    };
    let pt2 = {
      x: this.outputCircle.x + this.outLength,
      y: this.outputCircle.y + this.outLength * Math.sin(inclinedAngle)
    };
    let pt4 = {
      x: this.inputCircle.x - this.inLength,
      y: this.inputCircle.y - (this.inLength * Math.sin(-inclinedAngle))
    };
    let index = this.targetAnchor.index;
    if (this.inputAnchor) {
      index = this.inputAnchor.index;
    }
    const ly2 = Numeric.ONETEN + ((index) * Numeric.THIRTY) + this.inLength;
    let pt3 = {
      x: pt4.x,
      y: this.inputCircle.y - ly2
    };
    if (this.inputAnchor && this.inputAnchor.connectors.length === 1) {
      pt4 = {
        x: this.inputCircle.x - this.inLength,
        y: this.inputCircle.y
      };
    }
    if (this.targetAnchor.connectors.length === 1) {
      pt2 = {
        x: this.outputCircle.x + this.outLength,
        y: this.outputCircle.y
      };
      pt3 = {
        x: pt4.x,
        y: this.inputCircle.y - ly2
      };
    }
    this.plotPoints = [pt1, pt2, pt3, pt4, pt5];
  }
  /*
  * set second quadrant point
  *
  */
  private setSecondQuadrantPt() {
    const inclinedAngle = -(this.angle * (Math.PI / Angle.STRAIGHTLINE_ANGLE));
    this.setQuadrantPt(inclinedAngle);
  }
  /*
  *
  * set third quadrant point
  */
  private setThirdQuadrantPt() {
    const inclinedAngle = this.angle * (Math.PI / Angle.STRAIGHTLINE_ANGLE);
    this.setQuadrantPt(inclinedAngle);
  }
  /*
  * set quadrant point
  *
  */
  private setQuadrantPt(inclinedAngle){
    const pt1 = {
      x: this.outputCircle.x,
      y: this.outputCircle.y
    };
    let pt2 = {
      x: this.outputCircle.x + this.outLength,
      y: this.outputCircle.y + this.outLength * Math.sin(inclinedAngle)
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
        x: this.inputCircle.x - this.inLength,
        y: this.inputCircle.y
      };
    }

    if (this.targetAnchor.connectors.length === 1) {
      pt2 = {
        x: this.outputCircle.x + this.outLength,
        y: this.outputCircle.y
      };
    }
    this.plotPoints = [pt1, pt2, pt3, pt4];
  }
  /*
  * set fourth quadrant point
  *
  */
  private setFourthQuadrantPt() {
    const inclinedAngle = Angle.RIGHT_ANGLE + this.angle * (Math.PI / Angle.STRAIGHTLINE_ANGLE);
    const pt1 = {
      x: this.outputCircle.x,
      y: this.outputCircle.y
    };

    const pt5 = {
      x: this.inputCircle.x,
      y: this.inputCircle.y
    };

    let pt2 = {
      x: this.outputCircle.x + (this.outLengthReverse || this.outLength),
      y: this.outputCircle.y + (this.outLengthReverse || this.outLength) * Math.sin(-inclinedAngle)
    };

    let  pt4 = {
      x: this.inputCircle.x - (this.inLengthReverse || this.inLength),
      y: this.inputCircle.y - ((this.inLengthReverse || this.inLength) * Math.sin(inclinedAngle))
    };
    // should go reverse index
    const ly2 = Numeric.ONETWENTY - (this.targetAnchor.index * Numeric.THIRTY) + (this.inLengthReverse || this.inLength);
    let pt3 = {
      x: pt4.x,
      y: pt4.y + ly2
    };
    pt4 = this.updateInputAnchorPointQ4();
    const res=this.updateTargetAnchorPointQ4(pt2, pt3, pt4);
    if(res && pt2 && pt3)
    {
      pt2=res.pt2;
      pt3=res.pt3;
    }
    this.plotPoints = [pt1, pt2, pt3, pt4, pt5];
  }
  /*
  *
  * update input output anchor point
  */
  private updateInputAnchorPointQ4() {
    let result;
    if (this.inputAnchor && this.inputAnchor.connectors.length === 1) {
      result = {
        x: this.inputCircle.x - (this.inLengthReverse || this.inLength),
        y: this.inputCircle.y
      };
    }
    return result;
  }
  /*
  * update target anchor point
  *
  */
  private updateTargetAnchorPointQ4(pt2: ConnectorPoints, pt3: ConnectorPoints, pt4: ConnectorPoints) {
    if (this.targetAnchor.connectors.length === 1) {
      const ly1 = pt3.y - pt2.y;
      const pt2Res = {
        x: this.outputCircle.x + (this.outLengthReverse || this.outLength),
        y: this.outputCircle.y
      };

      const pt3Res = {
        x: pt4.x,
        y: pt2.y + ly1
      };
      return {pt2 : pt2Res , pt3: pt3Res};
    }
    return null;
  }

  //#endregion
}

@Injectable({
  providedIn: 'root'
})
export class ConnectorService extends BaseConnectorService {

  constructor(protected readonly facadeService: FacadeService
  ) {
    super(facadeService);
  }
  /*
  * Create connector
  *
  */
  createConnector(sourceAnchor: NodeAnchor, creationMode: ConnectorCreationMode, editorContext: string, targetAnchor?: NodeAnchor, id?: string,
    subConnectors?: { clientIds: string[], serverIds: string[] }) {
    //,isSourceDevieavailable?:boolean,isTargetDeviceAvailable?:boolean) {  // this called when you click on anchor and drag
    //check has been introduced to prevent extra conenction line coming in online mode sporadically
    //in this case input/output anchor is not present in the editor
    const inputAnchorIndex = this.facadeService.editorService.liveLinkEditor.editorNodes.findIndex(node => node.id === sourceAnchor?.parentNode?.id);
    let outputAnchorIndex;
    if (targetAnchor) {
      outputAnchorIndex = this.facadeService.editorService.liveLinkEditor.editorNodes.findIndex(node => node.id === targetAnchor.parentNode?.id);
    }
    else {
      outputAnchorIndex = 0;
    }
    let connector: Connector;
    if (inputAnchorIndex > -1 && outputAnchorIndex > -1) {
      connector = new Connector(this.facadeService.editorService.liveLinkEditor, creationMode, editorContext, id, subConnectors);
      sourceAnchor.connectors[0] = connector;
      sourceAnchor.addConnector(connector);
      this.bindClickEvent(connector);
      connector.init(sourceAnchor);
      if (targetAnchor) {
        targetAnchor.connectors[0] = connector;
        connector.init(targetAnchor);
        targetAnchor.addConnector(connector);
        connector.setDeviceId();
      }
      this.facadeService.editorService.addtoLinkGroup(connector?.element);
      if (connector.id) {
        this.facadeService.editorService.addOrUpdateToConenctorLookup(connector);
      }
      this.facadeService.editorService.updateHTMLNode(sourceAnchor?.parentNode);
    }
    return connector;
  }
  /*
  * bind cllick event
  *
  */
  bindClickEvent(connector: Connector) {
    super.bindClickEvent(connector);

    connector.path.addEventListener('click', () => {
      this.facadeService.editorService.contextMenuClick = false;
    });

    connector.pathOutline.addEventListener('click', () => {
      this.facadeService.editorService.contextMenuClick = false;
    });

    connector.path.addEventListener('contextmenu', event => {
      this.contextMenuHandler(event, connector);
    });

    connector.pathOutline.addEventListener('contextmenu', event => {
      this.contextMenuHandler(event, connector);
    });
  }
  /*
  * Context menu handler
  *
  */
  contextMenuHandler(event, connector) {
    this.selectConnector(connector);
    this.facadeService.commonService.pageX = event.pageX;
    this.facadeService.commonService.pageY = event.pageY;
    this.facadeService.editorService.contextMenuClick = true;
    this.addWindowListener();
  }
  /*
  * add window listener
  *
  */
  addWindowListener() {
    window.addEventListener('contextmenu', event => {
      if ((event.currentTarget as Window).origin === window.location.origin) {
        if (this.facadeService.editorService.selectedConnection && this.facadeService.editorService.contextMenuClick) {
          event.preventDefault();
        }
      }
    });
  }
  /*
  * connect
  *
  */
  connect(connector: Connector) {
    const sourceAnchor: NodeAnchor = connector?.getSourceAnchor();
    //sourceAnchor signifies Anchor connected to ClientInterface
    const connectionsList:Array<Connection> = this.facadeService.dataService.getAllConnections();
    const isAlreadyConnected = connector.isAnchorAlreadyConnected(sourceAnchor,connectionsList);
    const isBothFromSameDevice = connector.isBothAnchorOfSameDevice(sourceAnchor);
    if (connector?.isValidConnection(sourceAnchor) && !isAlreadyConnected && !isBothFromSameDevice) {
      this.placeHandle(sourceAnchor, connector);
      if (!connector.id) {
        connector.setConnectionId();
      }
      connector.setDeviceId();
      this.updateAreaConnectorData(connector);
      this.updateConnector(connector);
    } else {
      if (!connector?.isConnected) {
        this.remove(connector);
      }
    }
  }
  /*
  * update connector
  *
  */
  updateConnector(connector: Connector) {
    this.facadeService.editorService.addOrUpdateToConenctorLookup(connector);
    this.facadeService.dataService.addOrUpdateConnection(getConnectionObject(connector, this.facadeService.dataService));
  }
  /*
  *
  * update area connector data
  */
  updateAreaConnectorData(connector: Connector) {
    /* pass Adapter type from inside area*/
    if (connector.inputAnchor?.parentNode.type === FillingLineNodeType.AREA) {
      this.updateSubConnectorData(connector, connector.inputAnchor, connector?.inputAnchor?.parentNode.id, true);
    }
    if (connector.outputAnchor?.parentNode.type === FillingLineNodeType.AREA) {
      this.updateSubConnectorData(connector, connector.outputAnchor, connector?.outputAnchor?.parentNode.id, false);
    }
    return connector;
  }
  /*
  * update sub connector data
  *
  */
  updateSubConnectorData(connector: Connector, nodeAnchor: NodeAnchor, _areaId: string, isClient: boolean) {
    if (!connector.subConnectors) {
      connector.subConnectors = { clientIds: [], serverIds: [] };
    }
    const connection = this.facadeService.dataService.getConnection(connector.id);
    if (connection) {
      connector.subConnectors.clientIds = connection?.subConnections?.clientIds;
      connector.subConnectors.serverIds = connection?.subConnections?.serverIds;
    }
    else {
      const interfaceDetails: AreaClientInterface = this.facadeService.nodeAnchorService.getAreaInterfaceDetails(nodeAnchor);
      this.updateSubConnectionsData(interfaceDetails,nodeAnchor,isClient,connector);
    }
  }
  /*
  * update sub connections data
  *
  */
  updateSubConnectionsData(interfaceDetails:AreaClientInterface,nodeAnchor:NodeAnchor,isClient:boolean,connector:Connector){
    if (interfaceDetails) {
      nodeAnchor.deviceId = interfaceDetails.deviceId;
      connector.hasSubConnections = true;
      const subConnections: Array<SubConnection> = this.getSubConnectionsForUpdation(interfaceDetails, isClient);
      if (subConnections && subConnections.length > 0) {
        this.updateSubConenctorsID(connector.subConnectors, subConnections, isClient);
        subConnections.forEach(subConnection => {
        this.updateSubConnectionData(subConnection,connector);
        });
      }
    }
  }
  /*
  * update sub connection data
  *
  */
  updateSubConnectionData(subConnection:SubConnection,connector:Connector){
    if (subConnection) {
      subConnection.connectionId = connector.id;
      const subConnector = this.facadeService.editorService.getExistingSubConnectorById(subConnection.id);
      if (subConnector) {
        subConnector.connectionId = connector.id;
        this.facadeService.editorService.addOrUpdateToSubConnectorLookup(subConnector);
      }
      this.facadeService.dataService.updateSubConnection(subConnection);
    }
  }
  /*
  * get sub connections for updation
  *
  */
  private getSubConnectionsForUpdation(interfaceDetails: AreaClientInterface, isClient: boolean) {
    let subConnections: Array<SubConnection> = [];
    if (interfaceDetails) {
      if (!interfaceDetails.subConnectionId.includes(interfaceDetails.automationComponentId)
        && interfaceDetails.subConnectionId.includes('area_')) {
        subConnections = this.facadeService.dataService.getAllSubConnections()?.filter(subcon => subcon.id?.includes(interfaceDetails.type)
          && subcon.acId === interfaceDetails.automationComponentId && subcon.isclient === isClient);
      }
      else {
        const subCon = this.facadeService.dataService.getSubConnection(interfaceDetails.subConnectionId);
        if (subCon) {
          subConnections[0] = subCon;
        }
      }
    }
    return subConnections;
  }
  /*
  * update sub connectors id
  *
  */
  private updateSubConenctorsID(subConnectors: SubConnectionIdList, subConnections: SubConnection[], isClient: boolean) {
    if (isClient) {
      subConnectors.clientIds = subConnections.map(con => con.id);//.filter(subCon=>subCon.isClient===true);//[...connector.subConnectors.clientIds,subConnection.id];
    }
    else {
      subConnectors.serverIds = subConnections.map(con => con.id);//.filter(subCon=>subCon.isClient===false);
    }
  }
  /*
  * update sub connection
  *
  */
  updateSubConnection(connection: Connection, sourceSubConnectionIds: SubConnectionIdList, targetSubConnectionIds: SubConnectionIdList) {
    const subConnections = { clientIds: [], serverIds: [] };
    subConnections.clientIds = sourceSubConnectionIds?.clientIds?.concat(targetSubConnectionIds?.clientIds) || [];
    subConnections.serverIds = sourceSubConnectionIds?.serverIds?.concat(targetSubConnectionIds?.serverIds) || [];
    this.facadeService.subConnectorService.updateSubConnectionsWithConnectionId(connection.id, subConnections);
    connection.subConnections = subConnections;
    this.facadeService.dataService.updateConnection(connection.id, connection);
  }
  /*
  *
  * remove conenction from current editor
  */
  removeConnectionFromCurrectEditor(connector: Connector) {
    super.remove(connector);
    this.facadeService.editorService.removeFromConnectorLookup(connector?.id);
  }
  /*
  *
  * remove
  */
  remove(connector: Connector) {
    this.removeConnectionFromCurrectEditor(connector);
    this.facadeService.editorService.removeFromLinkGroup(connector?.element);
    this.facadeService.editorService.addToConnectorPool(connector);
    this.facadeService.dataService.deleteConnection(getConnectionObject(connector, this.facadeService.dataService));
    if (connector.hasSubConnections) {
      const connectorIds = connector?.subConnectors?.serverIds.concat(connector?.subConnectors?.clientIds)
      connectorIds?.forEach(id => {
        const subConnection = this.facadeService.dataService.getSubConnection(id);
        
        if (subConnection) {
          subConnection.connectionId = '';
          this.facadeService.dataService.addOrUpdateSubConnection(subConnection);
        }
        const subConnector = this.facadeService.editorService.getExistingSubConnectorById(id);
        if (subConnector) {
          subConnector.connectionId = '';
          this.facadeService.editorService.addOrUpdateToSubConnectorLookup(subConnector);
        }
      });
    }
  }
  /*
  *
  * set selected style
  */
  setSelectedStyle(connector: Connector) {
    if (connector.state === ConnectorState.Proposed) {
      this.updateRowForSelectedProposecConnector();
    }
    else {
      this.updateConnectortoCommon(connector);
    }
    connector.setSelectedStyle();
  }
  /*
  * update connector to common
  *
  */
  updateConnectortoCommon(connector: Connector) {
    this.facadeService.editorService.selectedConnection = connector;
    this.facadeService.editorService.setSelectedConnection(connector);
  }
  /*
  *
  * update row for selected propose connector
  */
  updateRowForSelectedProposecConnector() {
    this.facadeService.commonService.globalConnectionList.forEach(obj => {
      if (obj.connector.path.classList.contains(ConnectorArributes.CONNECTORPATHSELECTPROPOSEDROWSELECT)
        || obj.connector.path.classList.contains(ConnectorArributes.CONNECTORPATHROWSELECT)) {
        obj.isRowSelected = true;
        this.facadeService.editorService.selectedConnection = obj.connector;
      }
    });
  }
  /*
  * Delete all proposed con
  *
  */
  deSelectAllProposedCon() {
    this.facadeService.commonService.globalConnectionList.forEach(proposedCon => {
      const connector: Connector = proposedCon.connector;
      if (!this.facadeService.commonService.isActualConnectionMode) {
        if (connector.isSelected) {
          connector.defaultSelectedProposedConnectionStyle();
        } else {
          connector.setUnselectedProposedConnectionStyle();
        }
        proposedCon.isRowSelected = false;
        proposedCon.connector.isSelected = false;

      }
    });
  }
  /*
  *
  * is connected devices available
  */
  isConnectedDevicesAvailable(connector: Connector): boolean {
    if (connector && connector.inputDeviceId && connector.outputDeviceId) {
      const inputDevicestate = this.facadeService.dataService.getDeviceState(connector.inputDeviceId);
      const outputDevicestate = this.facadeService.dataService.getDeviceState(connector.outputDeviceId);
      return inputDevicestate !== DeviceState.UNAVAILABLE && outputDevicestate !== DeviceState.UNAVAILABLE;
    }
    return false;
  }

  /**
   *
   * @param connector
   * @param status of the connector
   * update the connector status by connector details
   */
      updateConnectorUnavailableData(connector: BaseConnector,status:boolean) {
        if (connector.inputAnchor && connector.outputAnchor) {
          const connectData: ConnectionData = getConnectData(connector.inputAnchor, this.facadeService.dataService, connector.outputAnchor);
          const address = this.facadeService.dataService.getDevice(connectData.serverDeviceId)?.address;
          const relatedEndPoint: RelatedEndPointInterface = getRelatedEndPointData(address, connectData.automationComponent, connectData.interfaceName);
          connector.updateConnectionEndPointStatus(status, relatedEndPoint);
          this.facadeService.dataService.resetConnectionEndPointDetails(connectData.deviceId, status, true, relatedEndPoint.address);
          this.facadeService.applicationStateService.updateConnectorStatus(connector);
          this.facadeService.applicationStateService.styleConnection(connector);
        }
      }

}

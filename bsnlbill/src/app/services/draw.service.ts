/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { EntityState } from '@ngrx/entity';
import { Observable, Subscription } from 'rxjs';
import { HTMLNodeConnector } from '../models/models';
import { PlantArea } from '../opcua/opcnodes/area';
import { BaseConnector } from '../opcua/opcnodes/baseConnector';
import { select, Selection,scaleLinear, ScaleLinear} from '../../app/vendors/d3.module';
import { buildArea, buildNode, nodeStyles } from '../utility/svgutil';
import { Connector } from '../opcua/opcnodes/connector';
import { NodeAnchor } from '../opcua/opcnodes/node-anchor';
import { OPCNode } from '../opcua/opcnodes/opcnode';
import { FillingArea, FillingLineState, FillingNode } from '../store/filling-line/filling-line.reducer';
import { ConnectorArributes, EditorAttributes, WorkspaceAttributes, NodeAttributes,
  DeviceDetailFillXYValues, ConnectorCreationMode, Numeric, FillingLineNodeType, ConnectorType,
  SubConnectorCreationMode, StrategyOperations, NotificationType, HTTPStatus, InterfaceCategory, DragDropAttribute, DragType
} from '../enum/enum';
import { getRelatedEndPointData, isConnectionListClickEvent, isNullOrUnDefined, log, getConnectionDetails,
  sortEditorHTMLNodesCoordinate,isEmpty, findConnectionInAndOut, getSubConnectionDetails
} from '../utility/utility';
import { Connection, ConnectionDetails, InterfaceDetails, SubConnection } from '../models/connection.interface';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { ROOT_EDITOR, VIEWAREA_HEIGHT, VIEWAREA_WIDTH } from '../utility/constant';
import { RelatedEndPointInterface, AreaClientInterface, ISidePanel,OpcInterface } from '../models/targetmodel.interface';
import { AreaHierarchy } from '../models/area.interface';
import { HTMLNode } from '../opcua/opcnodes/htmlNode';
import { SubConnector } from '../opcua/opcnodes/subConnector';

export let connect;
@Injectable({
  providedIn: 'root'
})
export class DrawService {

  fillingLine: Observable<FillingLineState> = this.facadeService.fillingLineService.getFillingLine();
  selectedAreaDataSubscription: Subscription;
  editorNodeMap: Map<string, boolean>;
  x: ScaleLinear<number, number, number>;
  y: ScaleLinear<number, number, number>;
  x0: number[];
  y0: number[];
  zoomFactor: number;
  mainComponentElementRef : Element;

  constructor(private readonly facadeService: FacadeService) {
    // the variable is used make sure there are no duplicate devices loaded in editor
    this.editorNodeMap = new Map<string, boolean>();
  }

  //#region Draw SVG

  /*
  *
  * Draw base canvas
  *
  */
  drawBaseCanvas(myCanvas) {
    const canvas: Selection<any,unknown, null, undefined> = select(myCanvas); //NOSONAR
    canvas.html(null);
    this.cleanTheEditor();
    const height = myCanvas.offsetHeight;
    const width = myCanvas.offsetWidth;

    this.bindResizeEvent(canvas, height, width);

    //zooming con cons
    this.x0 = [0, VIEWAREA_WIDTH];
    this.y0 = [0, VIEWAREA_HEIGHT];
    this.x = scaleLinear().domain([0, width]).range(this.x0);
    this.y = scaleLinear().domain([height, 0]).range(this.y0);
    //'elemWidth' has been commented as a Fix of RQ : 392 : Scroll Bar Misplaced
    // let elemHeight = 741;
    // if (screen.width <= 1536) {
    //   elemHeight = 577;
    // }

    // make editor scrollable
    const svg = this.drawsvg(canvas);
    const root = this.drawRoot(svg);
    const workspace = this.drawWorkspace(root);
    const connectionLinkGroup = workspace.append('g').attr('class', 'link-group');
    // Connection link
    const connector = this.drawInitialConnector(connectionLinkGroup);

    const nodeGroup = workspace.append('g');

    this.facadeService.editorService.updateHTMLNodes(svg.node(),
      workspace,
      nodeGroup,
      connectionLinkGroup.node(),
      connector.node(),
    );
  }
  /*
  *
  * Draw
  *
  */
  draw(myCanvas) {
    this.drawBaseCanvas(myCanvas);
    this.subscribeToFillingStore();
  }

  drawsvg(canvas: Selection<any,unknown, null, undefined>) { //NOSONAR
    const svg = canvas.append('svg')
      .attr('width', EditorAttributes.WIDTH)
      .attr('height',EditorAttributes.HEIGHT)
      .attr('id', EditorAttributes.SVG_ID);

    // append node styles;
    svg.append('defs').append('style').html(nodeStyles());
    svg.append('filter')
      .attr('id', 'AI_GaussianBlur_4')
      .attr('name', 'AI_GaussianBlur_4')
      .append('feGaussianBlur')
      .attr('stdDeviation', Numeric.FOUR);
    return svg;
  }
  setCanvas(nativeElement){
    this.mainComponentElementRef = nativeElement.querySelector('#myCanvasSvg');
  }

  resizeCanvas(){
    if (this.mainComponentElementRef) {
          this.mainComponentElementRef.setAttribute('height', this.getHeightValue());
      }
  }
  getHeightValue(){
    let nodeVal = Numeric.ZERO,
    areaVal= Numeric.ZERO,
    maxval,res= Number(this.mainComponentElementRef.getAttribute('height').split('%')[0]) || Numeric.ONEFIFTY;
    if(this.facadeService.dataService.getProjectData()
    && this.facadeService.dataService.getProjectData().editor.hasOwnProperty('nodes')
    && this.facadeService.dataService.getProjectData().editor.nodes.length >0){
      nodeVal = Math.round(Math.max(...this.facadeService.dataService.getProjectData().editor.nodes.map(o => o.y), Numeric.ZERO));
    }
    if(this.facadeService.dataService.getProjectData()
    && this.facadeService.dataService.getProjectData().editor.hasOwnProperty('areas')
    && this.facadeService.dataService.getProjectData().editor.areas.length >0){
      areaVal = Math.round(Math.max(...this.facadeService.dataService.getProjectData().editor.areas.map(o => o.y), Numeric.ZERO));
    }
    if(nodeVal< areaVal){
      maxval = areaVal;
    }else{
      maxval = nodeVal;
    }
    res = maxval/Numeric.FOUR;
    if(res< Numeric.ONEFIFTY){
      res = Numeric.ONEFIFTY;
    }
    return res + '%';
  }


  private drawsvgForDevice(canvas) {
    const svg = canvas.append('svg')
      .attr('width', WorkspaceAttributes.WIDTH)
      .attr('height', WorkspaceAttributes.HEIGHT);
    svg.append('defs').append('style').html(nodeStyles());
    return svg;
  }
  /*
  *
  * Draw device node
  *
  */
  drawDeviceNode(detailsChildDiv, automationComponent) {
    const fillingNode: FillingNode = this.facadeService.fillingLineService.getFillingNodeData(
      DeviceDetailFillXYValues.X, DeviceDetailFillXYValues.Y, automationComponent, ROOT_EDITOR);
    const canvas = select(detailsChildDiv);
    const svg = this.drawsvgForDevice(canvas);
    const deviceNode = svg.append('g')
      .attr('class', NodeAttributes.DEVICENODE)
      .attr('transform', `translate(${fillingNode.x}, ${fillingNode.y})`);
    const node = buildNode(fillingNode);
    deviceNode.html(node);
  }
  /*
  *
  * Draw root
  *
  */
  drawRoot(svg: Selection<SVGSVGElement, unknown, null, undefined>) {
    const root = svg.append('g').attr('class', 'root');
    // background
    root.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('data-x', 0)
      .attr('data-y', 0)
      .attr('width', EditorAttributes.WIDTH)
      .attr('height', EditorAttributes.HEIGHT)
      .attr('fill', EditorAttributes.BACKGROUNDCOLOUR)
      .attr('class', 'bg-rect');
    return root;
  }
  /*
  *
  * Draw workspace
  *
  */
  drawWorkspace(root: Selection<SVGGElement, unknown, null, undefined>) {
    const workspace = root.append('g').attr('class', 'plant-view-workspace');
    workspace.append('g')
      .attr('class', 'grid')
      .append('rect')
      .attr('class', 'restrict')
      .attr('width', WorkspaceAttributes.WIDTH)
      .attr('height', WorkspaceAttributes.HEIGHT)
      .attr('fill', 'url(#grid');
    return workspace;
  }
  /*
  *
  * Draw initial connector
  *
  */
  drawInitialConnector(connectionLinkGroup: Selection<SVGGElement, unknown, null, undefined>) {
    const connector = connectionLinkGroup.append('g').attr('class', 'connector');
    connector.append('path').attr('class', ConnectorArributes.CONNECTORPATHOUTLINE);
    connector.append('path').attr('class', ConnectorArributes.CONNECTORPATH);
    connector.append('circle')
      // circle at the beginning
      .attr('class', `${ConnectorArributes.CONNECTORHANDLE} ${ConnectorArributes.INPUTHANDLE}`)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', Numeric.FOUR);
    connector.append('circle')
      // circle at the end
      .attr('class', `${ConnectorArributes.CONNECTORHANDLE} ${ConnectorArributes.OUTPUTHANDLE}`)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', Numeric.FOUR);
    return connector;
  }
  /*
  *
  * Bind resize event
  *
  */
  bindResizeEvent(canvas, height: number, width: number) {
    const aspect = width / height;
    select(window)
      .on('resize', () => {
        const targetWidth = (canvas.node() as HTMLElement).getBoundingClientRect().width;
        canvas.attr('width', targetWidth);
        canvas.attr('height', targetWidth / aspect);
      });
  }
  /*
  *
  * Clean the editor
  *
  */
  cleanTheEditor() {
    this.facadeService.editorService.resetEditor();
    this.editorNodeMap.clear();
  }


//#endregion

  //#region Filling Store
  private subscribeToFillingStore() {
      this.fillingLine.subscribe(entities => {
        this.facadeService.editorService.updateEntities(entities);
        this.drawNodes(entities, this.facadeService.editorService.getEditorContext().id);
        this.loadConnections();
        this.clearPreviousSubConnections();
        if (event && !isConnectionListClickEvent(event)) { //NOSONAR
          this.resetEditorStyles();
        }
        this.facadeService.alignConnectionService.alignConnections();
      });
  }
  //#endregion

  //#region Editor Style

  resetEditorStyles() {
    this.facadeService.editorService.selectedConnection = null;
    this.facadeService.editorService.selectedNode = null;
  }
  /*
  *
  * Apply style to editor
  *
  */
  applyStyleToEditor() {
    this.styleNodesInEditor();
    this.styleConnectorsInEditor();
    this.styleSubConnectorsInEditor();
  }

  //#endregion

  //#region Node Related Draw functionality

  private checkIfNodeAlreadyExist(id: string): boolean {
    return this.editorNodeMap.has(id);
  }

  /**
 * Updates the unavailable devices information to the Editor by appropriate styling
 * @param updateStatus : If true: Updates the unavailable devices to failure styling in the editor- Gets executed during "Go-Online"
 * @param updateStatus : If false: Updates the unavailable devices to default styling in the editor- Gets executed during "Go-Offline"
 */
  private styleNodesInEditor(): void {
    const nodes = this.facadeService.editorService.liveLinkEditor.editorNodes;
    for (const node of nodes) {
      if (node.type === FillingLineNodeType.NODE) {
        this.facadeService.applicationStateService.styleEditorNode(node as OPCNode);
      }
    }
  }
  /*
  *
  * Fetch html node
  *
  */
  private fetchHTMLNode(nodeId: string): HTMLNode {
    const htmlNodes = this.facadeService.editorService.liveLinkEditor.editorNodes
    .filter(item => item.parent === this.facadeService.editorService.getEditorContext().id);
    let node: HTMLNode = null;
    node = htmlNodes.find(htmlNode => htmlNode.id === nodeId);
    return node;
  }
  /*
  *
  * Draw nodes
  *
  */
  private drawNodes(entityObj: EntityState<FillingNode | FillingArea>, parent: string) {
    if (!isNullOrUnDefined(entityObj)) {
      const nodes = entityObj.entities;
      for (const key of entityObj.ids) {
        const deviceNode = nodes[key];
        if (deviceNode && deviceNode.parent === parent) {
          // This is to check if node is already there in editor then prevent from redrawing again
          this.checkNodeExists(key,deviceNode,parent);
          this.drawOrApplyStyleNode(key, deviceNode, parent);
        }
      }
    }
  }
  /*
  *
  * Check if node exists
  *
  */
  checkNodeExists(key,deviceNode:FillingArea|FillingNode,parent:string){
    if (!this.checkIfNodeAlreadyExist(key.toString())) {
      this.drawEditorNode(deviceNode, parent);
    } else {
      if( this.facadeService.zoomOperationsService.zoomPercentChange){
         const htmlNode=deviceNode.element;
         htmlNode?.setAttribute('transform', `translate(${deviceNode.x}, ${deviceNode.y})`);
      }
       /** this class is to identify area node for drag and drop to area.  */
       if (deviceNode.type === FillingLineNodeType.AREA
        && deviceNode.element
        && !deviceNode.element.classList.contains(DragDropAttribute.CAN_DROP_NODES)) {
        deviceNode.element.classList.add(DragDropAttribute.CAN_DROP_NODES);
        deviceNode.element.setAttribute('data-drag', `${deviceNode.id}:${DragType.NODE}`);
      }
      this.applyStyleToNode(deviceNode);
    }
  }
  /*
  *
  * Draw or apply style node
  *
  */
  private drawOrApplyStyleNode(key: number | string, deviceNode: FillingArea | FillingNode, parent: string) {
    if (!this.checkIfNodeAlreadyExist(key.toString())) {
      this.drawEditorNode(deviceNode, parent);
    } else {
      this.applyStyleToNode(deviceNode);
    }
  }
  /*
  *
  * Draw editor node
  *
  */
  private drawEditorNode(editorObj: FillingNode | FillingArea, parent: string) {
    this.editorNodeMap.set(editorObj.id, true);
    let node;
    const htmlNode = this.facadeService.editorService.liveLinkEditor.nodeGroup.append('g')
      .attr('class', NodeAttributes.DEVICENODE)
      .attr('transform', `translate(${editorObj.x}, ${editorObj.y})`);
    if (editorObj.type === FillingLineNodeType.NODE) {
      node = buildNode(editorObj);
      htmlNode.html(node);
      try {
        this.facadeService.opcNodeService.createOPCNode(htmlNode, editorObj);
      }
      catch (err) {
        log('Exception: Unable to Update the HTML nodes');
        log(err);
      }
      this.facadeService.dataService.addNode(editorObj, parent);
      this.facadeService.commonService.noOfNodesInEditor++;
    }
    else {
      node = buildArea(editorObj);
      htmlNode.html(node);
      try {
        this.facadeService.plantAreaService.createArea(htmlNode, editorObj);
      }
      catch (err) {
        log('Exception: Unable to Update the HTML Areas');
        log(err);
      }
      this.facadeService.dataService.addArea(editorObj);
      this.facadeService.commonService.noOfNodesInEditor++;
    }
    if (this.facadeService.commonService.editorHasNoDevice) {
      this.facadeService.commonService.editorHasNoDevice = false;
    }
  }
  /*
  *
  * Remove node from editor
  *
  */
  private removeNodeFromEditor(htmlNode: OPCNode | PlantArea) {
    this.facadeService.editorService.removeNode(htmlNode.id);
    this.editorNodeMap.delete(htmlNode.id);
    htmlNode.element.remove();
    htmlNode.node.html(null);
  }
  /*
  *
  * Remove node
  *
  */
  removeNode(opcNode: OPCNode | PlantArea) {
    this.removeNodeFromEditor(opcNode);
    this.facadeService.dataService.deleteNode(opcNode.id, ROOT_EDITOR);
    this.facadeService.fillingLineService.deleteNode(opcNode.id);
  }


  // apply styles to node box
  private applyStyleToNode(nodeObj: FillingNode | FillingArea) {
    if (nodeObj.element) {
      this.styleUnselectedNodes(nodeObj.element);
      if (nodeObj.selected) {
        this.styleSelectedNode(nodeObj.element);
      }
    }
  }

  // apply selected styles to node box
  private styleSelectedNode(element: SVGGElement) {
    const parent1 = element?.querySelector('#parent-rect');
    const rect1 = parent1?.querySelector('.cls-2');
    if (rect1) {
      rect1.classList.remove('cls-2');
      rect1.classList.add('cls-2-selected');
    }
  }

  // apply unselected styles to node box
  private styleUnselectedNodes(element: SVGGElement) {
    const p1UnselectedNode = element.querySelector('#parent-rect');
    const rect1UnselectedNode = p1UnselectedNode?.querySelector('.cls-2-selected');
    if (rect1UnselectedNode) {
      rect1UnselectedNode.classList.remove('cls-2-selected');
      rect1UnselectedNode.classList.add('cls-2');
    }
  }

  //#endregion

  //#region Connection Related Draw Functionality

  /*
  *
  * load connections
  *
  */
  loadConnections() {
    const connections = this.facadeService.dataService.getAreaConnections(this.facadeService.editorService.getEditorContext()?.id);
    if (!connections || connections === null || connections.length === 0) {
      return;
    }
    for (const con of connections) {
      if (!this.facadeService.editorService.doesConnectionExist(con)) {
        this.drawConnector(con);
      }
    }
  }
  /*
  *
  * Draw connector
  *
  */
  drawConnector(connection: Connection): Connector {
    let connector;
    const connectionDetails: ConnectionDetails = getConnectionDetails(connection);
    if (connectionDetails && connectionDetails.clientACId && connectionDetails.serverACId && connectionDetails.interfaceType) {
      const fromNode: HTMLNode = this.fetchHTMLNode(connectionDetails.clientHTMLNodeId);
      const fromAnchor = fromNode?.inputs?.filter(clientInf => clientInf.interfaceData.type === connectionDetails.interfaceType)[0];
      const toNode: HTMLNode = this.fetchHTMLNode(connectionDetails.serverHTMLNodeId);
      const toAnchor = toNode?.outputs?.filter(serverInf => serverInf.interfaceData.type === connectionDetails.interfaceType)[0];
      if (fromAnchor && toAnchor) {
        connector = this.createConnector(fromAnchor, toAnchor, connection.creationMode, this.facadeService.editorService.getEditorContext().id,
          connection.id, connection.subConnections);
      }
    }
    return connector;
  }
  /*
  *
  * Create connector
  *
  */
  createConnector(fromAnchor: NodeAnchor, toAnchor: NodeAnchor, creationMode: ConnectorCreationMode, editorContext: string, id?: string,
    subConnectors?: { clientIds: string[], serverIds: string[] }): Connector {
    let connector: Connector;
    const existingConnector = this.facadeService.editorService.getExistingConnection(toAnchor, fromAnchor);
    if (!existingConnector) {
      connector = this.facadeService.connectorService.createConnector(toAnchor, creationMode, editorContext, fromAnchor, id, subConnectors);
      if (connector) {
        if (!id) {
          connector.setConnectionId();
        }
        toAnchor.update();
        fromAnchor.update();
        this.facadeService.connectorService.updateAreaConnectorData(connector);
        this.facadeService.connectorService.updateConnector(connector);
        toAnchor.setConnectedInterfaceStyle();
        fromAnchor.setConnectedInterfaceStyle();
        let status = connector.connectionStatus;
        let relatedendpoint = connector?.inputAnchor?.relatedEndPoint;
        const endPointDetails = this.facadeService.dataService.getConnectionEndPointData(null, connector.id);
        if (endPointDetails) {
          status = endPointDetails.status?.value;
          relatedendpoint = getRelatedEndPointData(endPointDetails.relatedEndpoints?.value, '', '');
        }
        this.updateAndStyleConnector(connector, status, relatedendpoint);
      }
    }
    else {
      connector = existingConnector;
    }
    return connector;
  }
  /*
  *
  * Update and style connector
  *
  */
  updateAndStyleConnector(connector: BaseConnector, connectionStatus: boolean, relatedEndPoint: RelatedEndPointInterface) {
    if (connector) {
      connector.updateConnectionEndPointStatus(connectionStatus, relatedEndPoint);
      this.styleConnectorInEditor(connector);
    }
  }
  /*
  *
  * Create online connection
  *
  */
  createOnlineConnection(relatedEndPoint: RelatedEndPointInterface, inputAnchor: NodeAnchor):BaseConnector {
    let connector;
    if (inputAnchor && !isNullOrUnDefined(relatedEndPoint.address)) {
      let outputAnchor: NodeAnchor;
      const device = this.facadeService.dataService.getDeviceByAddress(relatedEndPoint.address);
      const acNodes: Array<OPCNode> = this.facadeService.editorService.liveLinkEditor.editorNodes.filter(node => node.type === FillingLineNodeType.NODE
        && (node as OPCNode).deviceId === device?.uid) as Array<OPCNode>;

      //create Online Area Connection scenario
      if (!acNodes || acNodes.length === 0) {
        connector = this.createOnlineConnectionsNoAC(inputAnchor,relatedEndPoint,outputAnchor);
      }
      else {
        connector = this.createOnlineConnectionWithAC(acNodes,relatedEndPoint,inputAnchor,outputAnchor);
      }
    }
    return connector;
  }
  /*
  *
  * Create online connection output data
  *
  */
  createOnlineConnectionOutputData(outputAnchor:NodeAnchor,inputAnchor:NodeAnchor) :BaseConnector{
    let connector: BaseConnector;
    if (outputAnchor) {// && inputAnchor.parentNode.id !== outputAnchor.parentNode.id
      connector = this.createConnector(outputAnchor, inputAnchor, ConnectorCreationMode.ONLINE, this.facadeService.editorService.getEditorContext().id);
      this.pushNotificationForOnlineConnection(inputAnchor, outputAnchor);
    }
    return connector;
  }
  /*
  *
  * Create online connection no ac
  *
  */
  createOnlineConnectionsNoAC(inputAnchor: NodeAnchor,relatedEndPoint: RelatedEndPointInterface,outputAnchor: NodeAnchor){
    const inputNode = this.facadeService.dataService.getAllNodes().find(node => node.id === inputAnchor.automationComponentId);
    const outputNode = this.facadeService.dataService.getAllNodes().find(node => node.address === relatedEndPoint.address);
    if (outputNode) {
      const areaHierarchyDetails: AreaHierarchy = this.facadeService.areaUtilityService.getCommonParent(inputNode.parent, outputNode.parent);

      const adapterType=this.facadeService.dataService.getAdapterType(inputAnchor.deviceId);
      const isConnectiontobeDrawn=this.facadeService.getMonitorService(adapterType).handleConnectionMonitoringForOuterArea(areaHierarchyDetails,inputAnchor);
      if(!isConnectiontobeDrawn)
      {
        return null;
      }
      outputAnchor = this.checkConnectionInIsEqualConnectionout(areaHierarchyDetails,inputNode,outputNode,outputAnchor,inputAnchor);
    }
    return this.createOnlineConnectionOutputData(outputAnchor,inputAnchor);
  }
  /*
  *
  * check connection in is equal to connection out
  *
  */
  checkConnectionInIsEqualConnectionout(areaHierarchyDetails: AreaHierarchy,inputNode,outputNode,outputAnchor: NodeAnchor,inputAnchor: NodeAnchor){
    const { connectionIn, connectionOut } = findConnectionInAndOut(areaHierarchyDetails, inputNode.id, outputNode.id);
      if(connectionIn !== connectionOut)
      {
        const scenario = this.facadeService.areaUtilityService.getScenario(areaHierarchyDetails);
        const parentNode = inputAnchor.parentNode.id;
        outputAnchor = this.facadeService.strategyManagerService.executeStrategy(scenario, StrategyOperations.CREATEONLINE_AREA_CONNECTION,
        { ...areaHierarchyDetails, inputAnchor, connectionIn, connectionOut, parentNode});
      }
      return outputAnchor;
  }
  /*
  *
  * create online connection with ac
  *
  */
  createOnlineConnectionWithAC(acNodes:Array<OPCNode>,relatedEndPoint: RelatedEndPointInterface,inputAnchor: NodeAnchor,_outputAnchor: NodeAnchor){
    //create Online Node Connection scenario
    let outputNode = acNodes[0];
    if (acNodes.length > 1) {
      outputNode = acNodes?.find(node => node.name === relatedEndPoint?.automationComponent);
    }
    const outputAnchor = outputNode?.outputs.find(serverInf => serverInf.interfaceData.type === inputAnchor.interfaceData.type
      || serverInf.interfaceData.name === relatedEndPoint.functionalEntity);
    return this.createOnlineConnectionOutputData(outputAnchor,inputAnchor);
  }
  /*
  *
  * Get device name from anchor
  *
  */
  getDeviceNameFromAnchor = anchorDetails => {
    if ((anchorDetails.parentNode as OPCNode || PlantArea)['type'] === 'area') {
      return this.facadeService.dataService.getArea(anchorDetails.parentNode.id).name;
    }
    else {
      return (anchorDetails.parentNode as OPCNode).deviceName;
    }
  };
  /*
  *
  * Push notification for online connection
  *
  */
  pushNotificationForOnlineConnection(inputAnchor, outputAnchor) {
    const serverDeviceName = this.getDeviceNameFromAnchor(outputAnchor);
    const clientDeviceName = this.getDeviceNameFromAnchor(inputAnchor);
    const serverInterfaceName = outputAnchor.interfaceData.name;
    const clientInterfaceName = inputAnchor.interfaceData.name;
    const message =  { key : 'notification.info.connectionOnlineNotInProject',
    params: {
      serverDeviceName:serverDeviceName,
      serverInterfaceName:serverInterfaceName,
      clientDeviceName:clientDeviceName,
      clientInterfaceName:clientInterfaceName
  }};
    this.facadeService.notificationService.pushNotificationToPopup({content : message.key,params:message.params},NotificationType.INFO,HTTPStatus.SUCCESS);
  }
  /*
  *
  * Delete node connectors
  *
  */
  deleteNodeConnectors(node: OPCNode | PlantArea) {
    if (node) {
      const connectors: Array<BaseConnector> = node.getAllNodeConnectors();
      for (const connector of connectors) {
        if (connector && connector.type === ConnectorType.CONNECTOR) {
          this.facadeService.connectionService.deleteOfflineConnection(connector as Connector);
        }
      }
    }
  }
  /*
  *
  * Reset editor connection offline
  *
  */
  resetEditorConnectionOffline() {
    if (this.facadeService.commonService.isActualConnectionMode && !this.facadeService.editorService.isConnectionMultiSelect) {
      this.facadeService.editorService.deselectAllConnectors();
      this.facadeService.editorService.resetMultiSelectedSubConnection();
      this.facadeService.connectorService.resetConnectionList();
    }
  }
  /*
  *
  * Reset editor connection online
  *
  */
  resetEditorConnectionOnline() {
    this.facadeService.connectorService.deSelectAllProposedCon();
  }
  /*
  *
  * Clear previous sub connections
  *
  */
  clearPreviousSubConnections() {
    if (this.facadeService.editorService.isRootEditor()) {
      this.facadeService.editorService.liveLinkEditor.subConnectorLookup = {} as HTMLNodeConnector;
    }
  }
  /*
  *
  * Remove area connections from editor
  *
  */
  removeAreaConnectionsFromEditor(areaId: string) {
    const areaNode: PlantArea = this.facadeService.editorService.liveLinkEditor.editorNodes.find(opcNode => opcNode.id === areaId) as PlantArea;
    if (areaNode) {
      this.removeHTMLNodeConnectorsFromEditor(areaNode);
    }
  }
  /*
  *
  * Remove html node connectors from editor
  *
  */
  removeHTMLNodeConnectorsFromEditor(node: OPCNode | PlantArea) {
    const connectors: Array<BaseConnector> = node.getAllNodeConnectors();
    for (const connector of connectors) {
      this.facadeService.connectorService.removeConnectionFromCurrectEditor(connector as Connector);
    }
  }
  /*
  *
  * remove online connections
  *
  */
  removeOnlineConnections() {
    const connections = this.facadeService.dataService.getAllConnections() || [];
    for (const connection of connections) {
      let connector: Connector;
      if (this.facadeService.editorService.liveLinkEditor.connectorLookup.hasOwnProperty(connection.id)) {
        connector = this.facadeService.editorService.liveLinkEditor.connectorLookup[connection.id];
        connector?.resetEndPointDetails();
      }
      if (connection.creationMode === ConnectorCreationMode.ONLINE) {
        this.facadeService.dataService.deleteConnection(connection);
        this.facadeService.editorService.removeFromConnectorPool(connection.id);
        if (connector) {
          this.facadeService.connectorService.remove(connector);
        }
      }
    }
  }

  //Remove all subconnection if not available in connection object
  removeOnlineSubConnections(){
    const subConnections = this.facadeService.dataService.getAllSubConnections() || [];
    for (const subConnection of subConnections) {
      this.removeSubConnectionIfCreationModeOnline(subConnection);
      this.removeSubConnectionIfManual(subConnection);
    }
  }

  /**
   * @description Removes subConnection
   *  if creationMode is MANUAL-ONLINE or MANUAL-OFFLINE
   *
   * @param subConnection
   */
  private removeSubConnectionIfManual(subConnection: SubConnection) {
    if (subConnection.creationMode === SubConnectorCreationMode.MANUALONLINE
      || subConnection.creationMode === SubConnectorCreationMode.MANUALOFFLINE) {
      this.removeOnlineSubConnectionsForManualSubCreation(subConnection);
    }
  }

  /**
   *  @description Removes subConnection
   *  if creationMode is ONLINE
   * @param subConnection
   */
  private removeSubConnectionIfCreationModeOnline(subConnection: SubConnection) {
    if (subConnection.creationMode === SubConnectorCreationMode.ONLINE) {
      this.removeOnlineExposedInterfacesAndSubConnections(subConnection);
    }
  }

  /*
  *
  * Remove online sub connections for manual sub creation
  *
  */
  removeOnlineSubConnectionsForManualSubCreation(subConnection:SubConnection){
    const existingCreationMode=subConnection.creationMode;
    subConnection.creationMode = SubConnectorCreationMode.MANUAL;
    if(existingCreationMode === SubConnectorCreationMode.MANUALONLINE)
    {
      this.facadeService.dataService.updateAreaInterfaceExposedMode(subConnection.areaId, subConnection.id, subConnection.isclient, SubConnectorCreationMode.MANUAL);
    }
    else
    {
      const subConenctionDetail=getSubConnectionDetails(subConnection);
      const interfaceDetails=this.facadeService.areaUtilityService.getExposeInterfaceDetailsOfSpecificType(subConnection.acId,subConenctionDetail.interfaceType,
        subConenctionDetail.interfaceId,SubConnectorCreationMode.MANUAL,subConnection.isclient,subConnection.id);
      const areaData = this.facadeService.editorService.liveLinkEditor.editorNodes.find(node => node.id === subConnection.areaId) as PlantArea;
      if(areaData)
      {
        this.updateAndRedrawAreaNode(areaData, interfaceDetails);
      }
      else
      {
        this.facadeService.plantAreaService.updateInterfaceDetailsToServiceNStore(subConnection.areaId, interfaceDetails);
      }
    }
    const subConnector = this.facadeService.editorService.getExistingSubConnectorById(subConnection.id);
    if (subConnector) {
      subConnector.creationMode = SubConnectorCreationMode.MANUAL;
      this.facadeService.editorService.addOrUpdateToSubConnectorLookup(subConnector);
    }
    this.facadeService.dataService.updateSubConnection(subConnection);
  }
  /*
  *
  * Remove online exposed interfaces and sub connections
  *
  */
  removeOnlineExposedInterfacesAndSubConnections(subConnection:SubConnection) {
    let plantArea: PlantArea;
    const area = { ...this.facadeService.dataService.getArea(subConnection.areaId) };
    const index = this.facadeService.editorService.liveLinkEditor.editorNodes.findIndex(node => node.id === subConnection.areaId);
    if (index > -1) {
        plantArea = this.facadeService.editorService.liveLinkEditor.editorNodes[index] as PlantArea;
    }
    const [,interfaceType]=subConnection.id.split('__');
    let interfaceList: Array<ISidePanel>;
    if(subConnection.isclient)
    {
      interfaceList = area.clientInterfaceIds.filter(inf => inf.subConnectionId === subConnection.id);
    }
    else
    {
      interfaceList = area.serverInterfaceIds.filter(inf => inf.subConnectionId === subConnection.id);
    }
    interfaceList.forEach(sidePanelData => {
        if (sidePanelData && sidePanelData.subConnectionId &&
            sidePanelData.interfaceExposedMode !== SubConnectorCreationMode.MANUAL) {
            const subConenction = { ...this.facadeService.dataService.getSubConnection(sidePanelData.subConnectionId) };
            const subConnector = this.facadeService.editorService.getExistingSubConnectorById(subConenction.id);
            if (sidePanelData.interfaceExposedMode === SubConnectorCreationMode.ONLINE) {
                let interfaceData: OpcInterface;
                let type: InterfaceCategory;
                if (sidePanelData.isClientInterface) {
                    type = InterfaceCategory.CLIENT;
                    interfaceData = this.facadeService.dataService.getClientInterface(sidePanelData.deviceId, sidePanelData.automationComponentId, interfaceType);
                }
                else {
                    type = InterfaceCategory.SERVER;
                    interfaceData = this.facadeService.dataService.getServerInterface(sidePanelData.deviceId, sidePanelData.automationComponentId, interfaceType);
                }
                const areaInterface = { ...interfaceData, ...sidePanelData } as AreaClientInterface;
                const interfaceDetails = {
                    interface: areaInterface,
                    interfaceId: sidePanelData,
                    type: type
                }
                this.interfaceListForPlantArea(plantArea,interfaceDetails,subConnection);
                //remove associated subconnection with the interface
               this.removeSubconnectionInterface(subConnector,subConenction);
            }
            else {
               this.removeSubConnectionForOfflineMode(subConenction,subConnector);
            }
        }
    });
  }
  /*
  *
  * Interface list for plant area
  *
  */
  interfaceListForPlantArea(plantArea: PlantArea, interfaceDetails:InterfaceDetails, subConnection:SubConnection) {
    if (plantArea) {
      this.updateAndRedrawAreaNode(plantArea, interfaceDetails, 'remove');
    }
    else {
      this.facadeService.plantAreaService.updateInterfaceDetailsToServiceNStore(subConnection.areaId, interfaceDetails, 'remove');
    }
  }
  /*
  *
  * Remove sub connection interface
  *
  */
  removeSubconnectionInterface(subConnector:SubConnector,subConenction:SubConnection){
    if (subConnector) {
      this.facadeService.subConnectorService.remove(subConnector);
  }
  else {
      this.facadeService.subConnectorService.removeSubConnection(subConenction.id);
  }
  }
  /*
  *
  * Remove sub connection for offline mode
  *
  */
  removeSubConnectionForOfflineMode(subConenction:SubConnection,subConnector:SubConnector){
    if (!isEmpty(subConenction)) {
      //update associated subconnection with the interface
      subConenction.connectionId = '';
      this.facadeService.dataService.updateSubConnection(subConenction);
      if (subConnector) {
          subConnector.connectionId = '';
          this.facadeService.editorService.addOrUpdateToSubConnectorLookup(subConnector);
      }
  }
  }

  /**
 * Updates the unavailable device connectors to the Editor by appropriate styling
 */
  private styleConnectorsInEditor(): void {
    const connectors: HTMLNodeConnector = this.facadeService.editorService.liveLinkEditor.connectorLookup;
    for (const key in connectors) {
      if (connectors.hasOwnProperty(key)) {
        const connector = connectors[key] as BaseConnector;
        this.styleConnectorInEditor(connector);
      }
    }
  }
  /*
  *
  * style connector in editor
  *
  */
  styleConnectorInEditor(connector: BaseConnector): void {
    if (connector) {
      this.facadeService.applicationStateService.updateConnectorStatus(connector);
      this.facadeService.applicationStateService.styleConnection(connector);
    }
  }
  /*
  *
  * style sub connectors in editor
  *
  */
  private styleSubConnectorsInEditor(): void {
    if (!this.facadeService.editorService.isRootEditor()) {
      const subConnectors: HTMLNodeConnector = this.facadeService.editorService.liveLinkEditor.subConnectorLookup;
      for (const key in subConnectors) {
        if (subConnectors.hasOwnProperty(key)) {
          const subConnector = subConnectors[key] as BaseConnector;
          this.styleConnectorInEditor(subConnector);
        }
      }
    }
  }

  //#endregion

  //#region Area Related draw functionalty

  createArea(parentAreaID: string) {
    let editorMaximumYCoordinate;
    const editorNodes = this.facadeService.dataService.getProjectData()?.editor?.nodes?.filter(editorNode => editorNode.parent === parentAreaID) || [];
    const editorAreas = this.facadeService.dataService.getProjectData()?.editor?.areas?.filter(editorArea => editorArea.parent === parentAreaID) || [];
    let editorYCoordinate: number[] = sortEditorHTMLNodesCoordinate(editorNodes);
    editorYCoordinate =editorYCoordinate.concat(sortEditorHTMLNodesCoordinate(editorAreas));
    editorYCoordinate.sort((a, b) => a - b);
    if (editorYCoordinate.length) {
      editorMaximumYCoordinate = editorYCoordinate[editorYCoordinate.length - Numeric.ONE] + Numeric.TWOFORTY;
    }
    else {
      editorMaximumYCoordinate = Numeric.ONEHUNDRED;
    }
    this.facadeService.fillingLineService.createFillingAreaData(parentAreaID, this.facadeService.editorService.NextAreaNumber, editorMaximumYCoordinate);
    this.facadeService.editorService.setNextAreaNumber(this.facadeService.editorService.NextAreaNumber + 1);
  }
  /*
  *
  * Draw area
  *
  */
  drawArea() {
    const id = this.facadeService.editorService.getEditorContext()?.id;
    const dropOPCNode = this.facadeService.editorService.liveLinkEditor?.editorNodes?.filter(
      node => node.parent === id && node.type === FillingLineNodeType.NODE
    );
    const dropOPCArea = this.facadeService.editorService.liveLinkEditor?.editorNodes?.filter(
      node => node.parent === id && node.type === FillingLineNodeType.AREA
    ) as PlantArea[];
    dropOPCArea?.forEach(item => {
      this.drawAreaInterface(item);
    });
    dropOPCNode?.forEach(item => {
      this.facadeService.fillingLineService.updateNode(item.id, {});
    });
  }
  /*
  *
  * update and redraw area node
  *
  */
  updateAndRedrawAreaNode(area: PlantArea,interfaceDetails: InterfaceDetails, mode = 'add')
  {
    this.facadeService.plantAreaService.updateInterfaceDetailsToServiceNStore(area.id, interfaceDetails, mode);
    this.redrawAreaNode(area);
  }
  /*
  *
  * re draw area node
  *
  */
  redrawAreaNode(area: PlantArea) {
    const connections = this.facadeService.dataService.getAreaAllConnections(area.id);
    if (connections && connections.length > 0) {
      for (const connection of connections) {
        this.drawAreaInterface(area);
        this.drawConnector(connection);
      }
    }
    else {
      this.drawAreaInterface(area);
    }
  }
  /*
  *
  * Draw area interface
  *
  */
  drawAreaInterface(nodeObj: PlantArea) {
    const area = this.facadeService.editorService.liveLinkEditor.editorNodes.find(item => item.id === nodeObj.id);
    this.refreshHTMLSVG(nodeObj);
    this.facadeService.plantAreaService.removeAllAreaConnectionsFromEditor(area as PlantArea);
    this.facadeService.plantAreaService.updateAreaInterfaces(area as PlantArea);
  }
  /*
  *
  * refresh html svg
  *
  */
  refreshHTMLSVG(nodeObj: OPCNode | PlantArea)
  {
    const htmlNodeElement = this.facadeService.editorService.liveLinkEditor.editorNodes.find(item => item.id === nodeObj.id);
    const htmlNode = this.facadeService.editorService.liveLinkEditor.nodeGroup.append('g')
                    .attr('class', NodeAttributes.DEVICENODE)
                    .attr('transform', `translate(${nodeObj.x}, ${nodeObj.y})`);
    let node;
    if (nodeObj.type === FillingLineNodeType.AREA) {
      node = buildArea(nodeObj);
    }
    else
    {
      node = buildNode(nodeObj);
    }
    htmlNodeElement.element.remove();
    htmlNode.html(null);
    htmlNode.html(node);
    htmlNodeElement.node = htmlNode;
    htmlNodeElement.element = htmlNode.node();
  }
  /*
  *
  * assign node to area
  *
  */
  assignNodetoArea(opcNode: OPCNode, areaId: string) {
    this.removeNodeFromEditor(opcNode);
    this.removeHTMLNodeConnectorsFromEditor(opcNode);
    this.facadeService.dataService.deleteNode(opcNode.id, this.facadeService.editorService.getEditorContext().id);
    this.facadeService.dataService.addNode(opcNode, areaId);
  }
  /*
  *
  * update area reassignemnt
  *
  */
  updateAreaReassignment(node: FillingNode, newParent: string) {
    this.facadeService.dataService.deleteNode(node.id, node.parent);
    this.facadeService.dataService.addNode(node, newParent);
  }
  /*
  *
  * delete area data
  *
  */
  deleteAreaData(areaId: string, area?: PlantArea) {
    if (area) {
      this.removeNodeFromEditor(area);
    }
    this.facadeService.dataService.deleteArea(areaId);
    this.facadeService.fillingLineService.deleteArea(areaId);
  }
  /*
  *
  * delete area
  *
  */
  deleteArea(areaId: string) {
    const areaData = { ...this.facadeService.dataService.getArea(areaId) };
    if (!areaData) {
      return;
    }
    if (areaData.nodeIds) {
      areaData.nodeIds?.forEach(nodeId => {
        const opcNodeObj = this.facadeService.editorService.liveLinkEditor.editorNodes.find(opcNode => opcNode.id === nodeId) as OPCNode | PlantArea;
        if (opcNodeObj) {
          this.removeNode(opcNodeObj);
          this.deleteNodeConnectors(opcNodeObj);
        }
      });
    }
    const areaNode = this.facadeService.editorService.liveLinkEditor.editorNodes.find(node => node.id === areaId) as PlantArea;
    this.deleteAreaData(areaId, areaNode);
    this.deleteNodeConnectors(areaNode);
    areaData?.nodeIds?.forEach(nodeId => {
      const opcNodeObject = this.facadeService.dataService.getProjectData().editor.nodes?.find(node => node.id === nodeId);
      if (opcNodeObject) {
        const device = this.facadeService.dataService.getDevices().find(projectDevice => projectDevice.uid === opcNodeObject.deviceId);
        this.facadeService.editorService.removeConnectionFromConnectorLookup(device);
      }
      this.facadeService.dataService.deleteNode(nodeId, this.facadeService.editorService.getEditorContext().id);
      this.facadeService.fillingLineService.deleteNode(nodeId);
      this.facadeService.dataService.deleteNodeConnections(nodeId);
    });
    this.facadeService.editorService.selectedNode = null;
    this.facadeService.drawService.resizeCanvas();
  }

  //#endregion
}
// end class



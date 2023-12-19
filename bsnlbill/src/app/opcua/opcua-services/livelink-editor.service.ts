/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { EntityState } from '@ngrx/entity';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectedContextAnchor } from '../../models/connection.interface';
import { FacadeService } from '../../livelink-editor/services/facade.service';

import { ConnectorType, EstablishConnectionMenus, FillingLineNodeType, interfaceGridViewType } from '../../enum/enum';
import { EditorContext, HTMLNodeConnector, LiveLink } from '../../models/models';
import { AreaInterface, Device, IScroll, RelatedEndPointInterface } from '../../models/targetmodel.interface';
import { FillingArea, FillingNode } from '../../store/filling-line/filling-line.reducer';
import { editor, ROOT_EDITOR } from '../../utility/constant';
import { isEmpty, isNullOrEmpty } from '../../utility/utility';
import  {Selection}  from '../../vendors/d3.module';
import { BaseConnector } from '../opcnodes/baseConnector';
import { Connector } from '../opcnodes/connector';
import { HTMLNode } from '../opcnodes/htmlNode';
import { NodeAnchor } from '../opcnodes/node-anchor';
import { OPCNode } from '../opcnodes/opcnode';
import { SubConnector } from '../opcnodes/subConnector';


/**
 * The Service needs to be Singleton in nature
 */
@Injectable({
  providedIn: 'root'
})
export class EditorService {

  liveLinkEditor: LiveLink;
  menuTreeData: TreeNode;

  public isConnectionMultiSelect: boolean;
  multiSelectedConnectorMap = new Map<string, Connector>();
  multiSubConnectionSelectedMAp = new Map<string, SubConnector>();

  private readonly editorContextSelected = new BehaviorSubject<EditorContext>({ id: ROOT_EDITOR, name: '' });
  editorContext = this.editorContextSelected.asObservable();

  private readonly isRootEditorSelected = new BehaviorSubject<boolean>(true);

  //floaty device delete
  selectedNode: HTMLNode;

  // floaty delete
  selectedConnection: BaseConnector;

  private readonly selectedConnection$ = new BehaviorSubject<BaseConnector>(null);
  selectedConnectionObs = this.selectedConnection$.asObservable();

  private readonly _connectionMonitor$ = new BehaviorSubject<Connector>(null);
  connectionMonitor$ = this._connectionMonitor$.asObservable();

  private readonly _isDroppedNodes$ = new BehaviorSubject<boolean>(null);
  isDroppedNodes$ = this._isDroppedNodes$.asObservable();

  private readonly _scrollTopValue$ = new BehaviorSubject<IScroll>({ top: 0, left: 0 });
  scrollTopCanvasValue = this._scrollTopValue$.asObservable();

  contextMenuClick: boolean;

  NextAreaNumber = 1;

  clientInterfaceGridViewType = interfaceGridViewType.NA;
  serverInterfaceGridViewType = interfaceGridViewType.NA;

  private readonly _devicePropertyPanelViewChange$ = new BehaviorSubject<interfaceGridViewType>(interfaceGridViewType.EXPANDED);
  devicePropertyPanelViewChange = this._devicePropertyPanelViewChange$.asObservable();

  private readonly _deviceTreePanelViewChange$ = new BehaviorSubject<interfaceGridViewType>(null);
  deviceTreePanelViewChange = this._deviceTreePanelViewChange$.asObservable();

  private readonly _sidePanelViewChange$ = new BehaviorSubject<interfaceGridViewType>(null);
  sidePanelViewChange = this._sidePanelViewChange$.asObservable();

  private readonly _subConnectionViewType$ = new BehaviorSubject<string>(null);
  subConnectionViewType = this._subConnectionViewType$.asObservable();

  private readonly _selectedAnchorDetails$ = new BehaviorSubject<SelectedContextAnchor>({
    anchorDetails: null,
    isSelected: false,
    event: null,
    isClient: false
  });
  selectedAnchorDetails$ = this._selectedAnchorDetails$.asObservable();
  establishConnectionType : string;
  constructor(private readonly facadeService: FacadeService
  ) {
    this.liveLinkEditor = editor;
  }
  /*
  * Update html nodes
  *
  */
  updateHTMLNodes(svg: SVGSVGElement, workspace: Selection<SVGGElement, unknown, null, undefined>, nodeGroup: Selection<SVGGElement, unknown, null, undefined>,
    connectionLinkGroup: SVGGElement, connector: SVGGElement) {
    this.liveLinkEditor.svg = svg;
    this.liveLinkEditor.workspace = workspace;
    this.liveLinkEditor.nodeGroup = nodeGroup;
    this.liveLinkEditor.connectorElem = connector;
    this.liveLinkEditor.linkGroup = connectionLinkGroup;
  }
   /*
  * Remove node
  *
  */
  removeNode(id: string) {
    const index = this.liveLinkEditor.editorNodes.findIndex(node => node.id === id);
    if (index > -1) {
      this.liveLinkEditor.editorNodes.splice(index, 1);
    }
  }
   /*
  *
  * Updat entities
  */
  updateEntities(entities: EntityState<FillingNode | FillingArea>) {
    if (entities) {
      this.liveLinkEditor.entities = entities;
    }
  }
   /*
  *
  * Add html node
  */
  addHTMLNode(node: HTMLNode) {
    if (node && !this.isNodeAlreadyAdded(node.id)) {
      this.liveLinkEditor.editorNodes.push(node);
    }
  }
   /*
  *
  * Get opc node
  */
  getOPCNode(nodeId: string): OPCNode {
    let editorNodes;
    if (this.liveLinkEditor.editorNodes) {
      editorNodes = this.liveLinkEditor.editorNodes.find(node => node.id === nodeId && node.type === FillingLineNodeType.NODE) as OPCNode;
    }
    return editorNodes;
  }
   /*
  *
  * Get opc area
  */
  getOPCArea(areaId:string) {
    if (this.liveLinkEditor.editorNodes) {
      return this.liveLinkEditor.editorNodes.find(node => node.id === areaId) ;
    }
    return null;
  }
   /*
  *
  * update html node
  */
  updateHTMLNode(node: HTMLNode) {
    if (node) {
      const index = this.liveLinkEditor.editorNodes.findIndex(item => item.id === node.id);
      if (index > -1) {
        this.liveLinkEditor.editorNodes[index] = node;
      }
    }
  }

 
   /*
  * is node already added
  *
  */
  isNodeAlreadyAdded(id: string) {
    let returnVal = false;
    if (!isNullOrEmpty(id)) {
      const node = this.liveLinkEditor.editorNodes.find(item => item.id === id);
      if (node) {
        returnVal = true;
      }
    }
    return returnVal;
  }
   /*
  *
  * Add or update to connector lookup
  */
  addOrUpdateToConenctorLookup(connector: Connector) {
    if (connector) {
      this.liveLinkEditor.connectorLookup[connector.id] = connector;
    }
  }
   /*
  *
  * Add or update to sub connector lookup
  */
  addOrUpdateToSubConnectorLookup(subConnector: SubConnector) {
    if (subConnector) {
      this.liveLinkEditor.subConnectorLookup[subConnector.id] = subConnector;
    }
  }
   /*
  *
  * Checks if connection exists
  */
  doesConnectionExist(conn){
    const keys = Object.keys(this.liveLinkEditor.connectorLookup).find(key => key === conn.id);
    if (keys) {
      return true;
    }
    return false;
  }
   /*
  *
  * Returns existing connection
  */
  getExistingConnection(toAnchor: NodeAnchor, fromAnchor: NodeAnchor) {
    let conenctor: Connector;
    if (toAnchor && fromAnchor) {
      Object.keys(this.liveLinkEditor.connectorLookup).forEach(connectorId => {
        const connector: Connector = this.liveLinkEditor.connectorLookup[connectorId];
        if ((connector.inputAnchor.id === toAnchor.id && connector.outputAnchor.id === fromAnchor.id) ||
          (connector.outputAnchor.id === toAnchor.id && connector.inputAnchor.id === fromAnchor.id)) {
          conenctor = connector;
        }
      });
    }
    return conenctor;
  }
   /*
  *
  * Get existing connector by id
  */
  getExistingConnectorById(connectorId: string): Connector {
    return this.liveLinkEditor.connectorLookup[connectorId];
  }
   /*
  * Get existing sub connector by id
  *
  */
  getExistingSubConnectorById(connectorId: string): SubConnector {
    return this.liveLinkEditor.subConnectorLookup[connectorId];
  }
   /*
  * REmove from connector lookup
  *
  */
  removeFromConnectorLookup(id: string) {
    if (!isNullOrEmpty(id)) {
      delete this.liveLinkEditor.connectorLookup[id];
    }
  }
   /*
  * Remove from sub connector lookup
  *
  */
  removeFromSubConnectorLookup(id: string) {
    if (!isNullOrEmpty(id)) {
      delete this.liveLinkEditor.subConnectorLookup[id];
    }
  }
   /*
  *
  * Add to connector pool
  */
  addToConnectorPool(connector: Connector) {
    if (connector) {
      if(this.liveLinkEditor && this.liveLinkEditor.connectorPool){
          this.liveLinkEditor.connectorPool.push(connector);
      }
    }

  }
   /*
  *
  * Remove from connector pool
  */
  removeFromConnectorPool(id: string) {
    const index = this.liveLinkEditor.connectorPool.findIndex(res => res.id === id);
    this.liveLinkEditor.connectorPool.splice(index,1);
  }

   /*
  * Add to link group
  *
  */
  addtoLinkGroup(item: SVGElement) {
    if (!this.liveLinkEditor?.linkGroup.contains(item)) {
      this.liveLinkEditor?.linkGroup?.append(item);
    }
  }
   /*
  * Remove from link group
  *
  */
  removeFromLinkGroup(item: SVGElement) {
    if (this.liveLinkEditor?.linkGroup?.children?.length > 1 && this.liveLinkEditor?.linkGroup.contains(item)) {
      this.liveLinkEditor?.linkGroup?.removeChild(item);
    }
  }
   /*
  * Reset editor
  *
  */
  resetEditor() {
    this.liveLinkEditor.svg = null;
    this.liveLinkEditor.workspace = null;
    this.liveLinkEditor.linkGroup = null;
    this.liveLinkEditor.connectorElem = null;
    // refers to OpcNoe;
    this.liveLinkEditor.editorNodes = [];
    this.liveLinkEditor.connectorLookup = {} as HTMLNodeConnector;
    this.liveLinkEditor.entities = null;
  }
   /*
  *
  * Deselect all nodes
  */
  deselectAllNodes() {
    const deselectedDevices = [];
    if(this.liveLinkEditor && this.liveLinkEditor.entities && this.liveLinkEditor.entities.entities){
      const nodes = this.liveLinkEditor.entities.entities;
      if (nodes) {
        for (const key of this.liveLinkEditor.entities.ids) {
          const node = nodes[key];
          const changeNodeData = this.facadeService.fillingLineService.getUpdatedNodeData(node.id, { selected: false });
          deselectedDevices.push(changeNodeData);
        }
      }
    }
    this.facadeService.fillingLineService.deselectDevices(deselectedDevices);
  }
   /*
  * Deselect all connectors
  *
  */
  deselectAllConnectors() {
    if (this.liveLinkEditor.connectorLookup) {
      for (const key in this.liveLinkEditor.connectorLookup) {
        if (key && this.liveLinkEditor.connectorLookup.hasOwnProperty(key)) {
          const con: Connector = this.liveLinkEditor.connectorLookup[key];
          con.isSelected = false;
          con.setUnSelectedStyle();
        }
      }
    }
  }
   /*
  * Deslect all sub connectors
  *
  */
  deselectAllSubConnectors() {
    if (this.liveLinkEditor.subConnectorLookup) {
      for (const key in this.liveLinkEditor.subConnectorLookup) {
        if (key && this.liveLinkEditor.subConnectorLookup.hasOwnProperty(key)) {
          const con: Connector = this.liveLinkEditor.subConnectorLookup[key];
          con.isSelected = false;
          con.setUnSelectedStyle();
        }
      }
    }
  }
   /*
  * Add or update multiple select connector
  *
  */
  addOrUpdateMultiSelectConnector(connector: Connector) {
    if (this.multiSelectedConnectorMap.has(connector.id)) {
      this.multiSelectedConnectorMap.delete(connector.id);
    }
    else {
      this.multiSelectedConnectorMap.set(connector.id, connector);
    }
  }
   /*
  * Add or update multi select sub connector
  *
  */
  addOrUpdateMultiSelectSubConnector(subconnector: SubConnector) {
    if (this.multiSubConnectionSelectedMAp.has(subconnector.id)) {
      this.multiSubConnectionSelectedMAp.delete(subconnector.id);
    }
    else {
      this.multiSubConnectionSelectedMAp.set(subconnector.id, subconnector);
    }
  }
   /*
  * Reset multi selected connection
  *
  */
  resetMultiSelectedConnection() {
    this.facadeService.editorService.deselectAllConnectors();
    this.multiSelectedConnectorMap.clear();
    if(this.establishConnectionType !== EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION){
      this.facadeService.editorService.setIsMultiSelected(false);
    }
  }
   /*
  *
  * Reset multi selected sub connection
  */
  resetMultiSelectedSubConnection(){
    this.facadeService.editorService.deselectAllSubConnectors();
    this.multiSubConnectionSelectedMAp.clear();
  }
   /*
  * Remove connection from selected connection
  *
  */
  removeConnectionFromSelectedConnection(selectedConnection) {
    this.multiSelectedConnectorMap.delete(selectedConnection.id);
  }
   /*
  *
  * Selected area data
  */
  selectedAreaData(area: EditorContext) {
    if (area.id === ROOT_EDITOR) {
      this.isRootEditorSelected.next(true);
    }
    else {
      this.isRootEditorSelected.next(false);
    }
    this.editorContextSelected.next(area);
  }
   /*
  * is dropped
  *
  */
  isDropped(value: boolean) {
    this._isDroppedNodes$.next(value);
  }
   /*
  *
  *Set is multi selected
  */
  public setIsMultiSelected(value: boolean) {
    this.isConnectionMultiSelect = value;
  }
   /*
  * Set selected connection
  *
  */
  setSelectedConnection(selectedConnection: BaseConnector) {
    this.selectedConnection$.next(selectedConnection);
    this.selectedConnection = selectedConnection;
  }
   /*
  *
  * Empty selected connection
  */
  emptySelectedConnection() {
    this.setSelectedConnection(null);
    this.selectedConnection = null;
    this.deselectAllConnectors();
    this.resetMultiSelectedSubConnection();
  }
   /*
  * Update connection monitor
  *
  */
  updateConnectionMonitor(key: string, value: RelatedEndPointInterface, connector: Connector) {
    if (connector && connector.type === ConnectorType.CONNECTOR) {
      connector[key] = value;
      this._connectionMonitor$.next(connector);
    }
  }
   /*
  * Check if its a root editor
  *
  */
  isRootEditor() {
    return this.isRootEditorSelected.getValue();
  }
   /*
  *
  *  REturns editor context
  */
  getEditorContext() {
    return this.editorContextSelected.getValue();
  }
   /*
  * Set's next area number to be created
  *
  */
  setNextAreaNumber(number: number) {
    this.NextAreaNumber = number;
  }
   /*
  * Set scroll to canvas value
  *
  */
  setScrollTopCanvasValue(value: IScroll) {
    this._scrollTopValue$.next(value);
  }
   /*
  * Set device property panel data
  *
  */
  setDevicePropertyPanelData(mode) {
    this._devicePropertyPanelViewChange$.next(mode);
  }
   /*
  * Set device tree panel data
  *
  */
  setDeviceTreePanelData(mode) {
    this._deviceTreePanelViewChange$.next(mode);
  }
   /*
  * Set side panel data
  *
  */
  setSidePanelData(mode) {
    this._sidePanelViewChange$.next(mode);
  }
   /*
  *
  * Set sub connection view type
  */
  setSubConnectionViewType(mode) {
    this._subConnectionViewType$.next(mode);
  }
   /*
  *
  * Toggle anchor selection
  */
  toggleAnchorSelection(anchorDetails, event, isClient, hide?) {
    this._selectedAnchorDetails$.next({
      isSelected: !this._selectedAnchorDetails$['_value']?.isSelected || hide,
      anchorDetails,
      event,
      isClient
    });
  }

   /*
  * Get separartor for hierarcy
  *
  */
  getSeparatorForHierarchy(index){
    if(index){
      return '>';
    }
    return '';
  }
   /*
  * Get area bread crum list
  *
  */
  getAreaBreadCrumList(areaList) {
    if(areaList.parentLabels){
      areaList.parentLabels = areaList.parentLabels.filter(item => Boolean(item.label));
      const parentLabels = [...areaList.parentLabels].reverse();
      return parentLabels.reduce(
        (ac, val, currentIndex) =>
          (ac + `${this.getSeparatorForHierarchy(currentIndex)} ${val.label}`),
        ''
      );
    }
      return `${this.menuTreeData.label}`;
  }
   /*
  *
  * Get current area hierarcy
  */
  getCurrentAreaHierarchy() {
    return this.editorContext.pipe(
      map(areaList => this.getAreaBreadCrumList(areaList))
    );
  }
   /*
  *
  * Get area with device interface
  */
  getAreaWithDeviceInterfaces(deviceId: string, isClientInterface:boolean) {
    const nodes: Array<HTMLNode> = [];
    let interfaceType = '';
    if (isClientInterface === false) {
      interfaceType = 'serverInterface';
    }
    else {
      interfaceType = 'clientInterface';
    }
    this.liveLinkEditor.editorNodes.forEach(node => {
      let interfaces;
      if (interfaceType === 'clientInterface') {
        interfaces = node.clientInterfaces;
      }
      else if (interfaceType === 'serverInterface') {
        interfaces = node.serverInterfaces;
      }
      else {
        interfaces = node.serverInterfaces.concat(node.clientInterfaces);
      }
      if (node && node.type === FillingLineNodeType.AREA && interfaces) {
        interfaces.forEach(inf => {
          const connectionDeviceId = (inf as AreaInterface)?.deviceId;
          if (connectionDeviceId === deviceId) {
            nodes.push(node);
          }
        })
      }
    });
    return nodes;
  }
   /*
  * REmove connection from connector lookup
  *
  */
  removeConnectionFromConnectorLookup(device: Device) {
    const connectors = this.liveLinkEditor.connectorLookup;
    for (const key in connectors) {
      if (connectors.hasOwnProperty(key)) {
        const connector: Connector = connectors[key];
        if ((connector.inputAnchor.parentNode as OPCNode).deviceId === device.uid
          || (connector.outputAnchor.parentNode as OPCNode).deviceId === device.uid) {
          this.removeFromConnectorLookup(connector.id);
        }
      }
    }
  }
   /*
  * Get base connector
  *
  */
  getBaseConnector(connectorId: string, connectorType: ConnectorType): BaseConnector {
    let connector: BaseConnector;
    if (!isEmpty(connectorId)) {
      if (connectorType === ConnectorType.CONNECTOR && this.liveLinkEditor.connectorLookup[connectorId]) {
        connector = this.liveLinkEditor.connectorLookup[connectorId];
      }
      else {
        const connectorObjIndex = Object.keys(this.liveLinkEditor.subConnectorLookup).indexOf(connectorId);
        if(connectorObjIndex > -1){
           connector = this.liveLinkEditor.subConnectorLookup[Object.keys(this.liveLinkEditor.subConnectorLookup)[connectorObjIndex]];
        }
      }
    }
    return connector;
  }
}



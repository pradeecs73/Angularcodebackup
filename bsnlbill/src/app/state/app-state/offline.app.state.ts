/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ConnectorState, ConnectorType, ProjectState } from '../../enum/enum';
import { DragDropData } from '../../models/models';
import { PanelDataType } from '../../models/monitor.interface';
import { BaseConnector } from '../../opcua/opcnodes/baseConnector';
import { Connector } from '../../opcua/opcnodes/connector';
import { OPCNode } from '../../opcua/opcnodes/opcnode';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { AbstractState } from '../state';
import { ApplicationState } from './application.state';
import { Online } from './online.app.state';


export class Offline extends ApplicationState {
  //protected connectionService = ServiceInjector.get(ConnectionService);


  constructor(
    protected facadeService: FacadeService,
    protected router: Router
  ) {
    super(facadeService);
  }
  /* Change the status from online -> offline and offline -> online
  */
  public changeStatus(context: AbstractState) {
    context.state = new Online(
      this.facadeService,
      this.router
    );
  }
   /*Returns offline status
  */
  public status() {
    return ProjectState.OFFLINE;
  }
   /* Establish connection offline state
  */
  establishConnection() {
    this.facadeService.connectionService.establishConnection();
  }
   /* Save project
  */
  saveProject() {
    this.facadeService.saveService.saveProject();
  }
   /* Drop node
  */
  dropNode() {
    this.facadeService.dragdropService.drop();
  }
   /* drop interface
  */
  dropInterface() {
    this.facadeService.dragdropService.dropInterface();
  }
   /*drag node
  */
  dragNode() {
    this.facadeService.dragdropService.drag();
  }
   /* drag node to tree
  */
  dropNodeToTree() {
    this.facadeService.dragdropService.dropToFillingLine();
  }
   /* drag from tree menu
  */
  dragFromTreeMenu() {
    this.facadeService.dragdropService.dragFromTreeMenu();
  }
   /* menu change
  */
  menuChange(event) {
    this.facadeService.menuService.selectMenu(event);
  }
   /* delete connection
  */
  deleteConnection(connector: Connector) {
    this.facadeService.connectionService.deleteOfflineConnection(connector);
  }
   /* delete connection in online and project
  */
  deleteConnectionInonlineAndProject(_connector: Connector) {
    return;
  }
   /* delete editor node
  */
  deleteEditorNode(node: OPCNode) {
    this.facadeService.drawService.removeNode(node);
    this.deleteNodeConnectors(node);
  }
   /* show delete connection option
  */
  showDeleteConnectionOption() {
    return true;
  }
   /*show delete ac option
  */
  showDeleteACOption() {
    return true;
  }
  /* update connector state
  */
  updateConnectorState(connector: Connector) {
    connector.state = ConnectorState.Default;
  }
   /* style node
  */
  styleNode(node: OPCNode) {
    node.applyOfflineStyle();
  }
   /* style connector
  */
  styleConnector(connector: Connector) {
    connector.setDefaultStyle();
  }
   /* create area
  */
  createArea(parentAreaID: string) {
    this.facadeService.drawService.createArea(parentAreaID);
  }
   /*delete area
  */
  deleteArea(nodeData: TreeNode) {
    this.facadeService.areaUtilityService.deleteAreaConfirmation(nodeData);
  }
   /* ungroup area
  */
  unGroupArea(node: TreeNode) {
    this.facadeService.areaUtilityService.unGroupAreaConfirmation(node);
  }
   /* reorder area
  */
  reOrderArea(event: { dragNode: TreeNode, dropNode: TreeNode, index: number, originalEvent, accept }, selectedItems: TreeNode[]) {
    this.facadeService.areaUtilityService.reOrderArea(event as unknown as DragDropData, selectedItems);
  }
   /* navigate route
  */
  navigateRoute() {
    return true;
  }
   /*show connection delete option
  */
  showConnectionDeleteOption() {
    let showIcon = false;
    if (this.facadeService.editorService.selectedConnection) {
      showIcon = this.showDeleteConnectionOption();
    }
    if(this.facadeService.editorService.multiSelectedConnectorMap.size > 0 ||
      this.facadeService.editorService.multiSubConnectionSelectedMAp.size > 0){
        showIcon = this.showDeleteConnectionOption();
      }
    return showIcon;
  }
   /* show device unavailable
  */
  showDeviceUnavailable(_panelData: PanelDataType) {
    return false;
  }
   /* draw canvas
  */
  drawCanvas(myCanvas) {
    this.facadeService.drawService.draw(myCanvas);
    this.facadeService.drawService.resetEditorConnectionOffline();

    this.facadeService.zoomOperationsService.drawCanvasForOnlineAndOffline();
  }
   /* is online returns false
  */
  isOnline() {
    return false;
  }
   /* delete node connectors
  */
  private deleteNodeConnectors(node: OPCNode) {
    const connectors: Array<BaseConnector> = node.getAllNodeConnectors();
    for (const connector of connectors) {
      if (connector && connector.type === ConnectorType.CONNECTOR) {
        this.facadeService.connectionService.deleteOfflineConnection(connector as Connector);
      }
    }
  }
}

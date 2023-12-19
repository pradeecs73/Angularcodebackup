/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Router } from '@angular/router';
import interact from 'interactjs';
import { TreeNode } from 'primeng/api';
import { ConnectorState, DeviceState, DragDropAttribute, ProjectState } from '../../enum/enum';
import { PanelDataType } from '../../models/monitor.interface';
import { BaseConnector } from '../../opcua/opcnodes/baseConnector';
import { Connector } from '../../opcua/opcnodes/connector';
import { OPCNode } from '../../opcua/opcnodes/opcnode';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { AbstractState } from '../state';
import { ApplicationState } from './application.state';
import { Offline } from './offline.app.state';

export class Online extends ApplicationState {

    constructor(
        protected facadeService: FacadeService,
        protected router: Router
        ) {
        super(facadeService);
    }
    /* Change the status from online -> offline and offline -> online
  */
    public changeStatus(context: AbstractState) {
        context.state = new Offline(this.facadeService,this.router);
    }
    /*Returns online status
    */
    public status() {
        return ProjectState.ONLINE;
    }
    /* Establish connection online state
  */
    establishConnection()
    {
        return;
    }
    /* Save project
    */
    saveProject() {
        return;
    }
    /* Show delete connection option
    */
    showDeleteConnectionOption(connector: Connector) {
        if (connector) {
            return connector.state === ConnectorState.Online || connector.state === ConnectorState.Success;
        }
        return true;
    }
    /* show delete ac option
    */
    showDeleteACOption()
    {
        return false;
    }
    /* Drop node
    */
    dropNode()
    {
        interact('#myCanvas').dropzone({
            ondrop(_event) {
                return;
            }
        });
    }
    /* drop node to tree
    */
    dropNodeToTree() {
        interact('.p-treenode-droppoint').dropzone({
            ondrop(_event) {
                return;
            }
        });
    }

    /* drag node
    */
    dragNode() {
        interact(DragDropAttribute.TREEROOT)
        .draggable({ manualStart: true })
        .on('move', event => {
            event.target.style.cursor = 'no-drop';
        });
    }
    /* drop interface
    */
    dropInterface() {
        interact('#interface-side-panel').dropzone({
            ondrop(_event) {
                return;
            }
        });
    }
    /* drag from tree menu
    */
    dragFromTreeMenu() {
        interact(DragDropAttribute.TREE_NODE_CONTENT)
            .draggable({ manualStart: true })
            .on('move', event => {
                event.target.style.cursor = 'no-drop';
            });
    }
    /* delete connection
    */
    deleteConnection(connector:Connector) {
        this.facadeService.connectionService.deleteConnectionFromServer(connector);
    }
    /* delete connection in online and project
    */
    deleteConnectionInonlineAndProject(connector: Connector) {
        this.facadeService.connectionService.deleteConnectionFromServer(connector);
        this.facadeService.connectionService.deleteOfflineConnection(connector);
      }
    /* menu change
    */
    menuChange(event) {
        this.facadeService.menuService.selectMenu(event);
    }
    /* delete editor node
    */
    deleteEditorNode(_node: OPCNode) {
        return;
    }
    /* update connector state
    */
    updateConnectorState(connector: BaseConnector) {
        connector.updateConnectorStateinOnline();
    }
    /* style node
    */
    styleNode(node: OPCNode) {
        node.applyOnlineStyle();
    }
    /* style connector
    */
    styleConnector(connector: Connector) {
        connector.setOnlineStyle();
    }
    /* create area
    */
    createArea(_parentAreaID:string)
    {
      return false;
    }
    /* delete area
    */
    deleteArea(_nodeData:TreeNode)
    {
       return false;
    }
    /* ungroup area
    */
    unGroupArea(_node: TreeNode)
    {
       return false;
    }
    /* reorder area
    */
    reOrderArea(_event: { dragNode: TreeNode, dropNode: TreeNode, index: number, originalEvent, accept }, _selectedItems:TreeNode[])
    {
       return false;
    }
    /* navigate route
    */
    navigateRoute(){
        this.router.navigate(['editor']);
        return false;
    }
    /* show connection delete option
    */
    showConnectionDeleteOption(){
        return false;
    }
    /* show device unavailable
    */
    showDeviceUnavailable(panelData:PanelDataType){
        return panelData && panelData?.deviceState !== DeviceState.AVAILABLE;
    }
    /* draw canvas
    */
    drawCanvas(myCanvas){
        this.facadeService.drawService.draw(myCanvas);
        this.facadeService.drawService.resetEditorConnectionOnline();
        this.facadeService.zoomOperationsService.drawCanvasForOnlineAndOffline();
    }
    /* isOnline returns true
    */
    isOnline(){
        return true;
    }

}


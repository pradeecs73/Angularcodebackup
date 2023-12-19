/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { ProjectState } from '../enum/enum';
import { PanelDataType } from '../models/monitor.interface';
import { BaseConnector } from '../opcua/opcnodes/baseConnector';
import { Connector } from '../opcua/opcnodes/connector';
import { HTMLNode } from '../opcua/opcnodes/htmlNode';
import { OPCNode } from '../opcua/opcnodes/opcnode';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { Application } from '../state/app-state/application';

@Injectable({
    providedIn: 'root'
  })
  export class ApplicationStateService {
    private readonly application:Application;
    constructor(
      private readonly facadeService: FacadeService,
      protected router: Router
      )
    {
        this.application= new Application(this.facadeService,this.router);
    }
    /*
    * Change application status to offline/online
    */
    changeApplicationStatus()
    {
        this.application.changeStatus();
    }
    /*
    * returns the current status of application offline/online
    */
    public getStatus():ProjectState {
      return this.application.state.status();
    }
    /*
    * Establish connection : offline state
    */
    establishConenction()
    {
      this.application.state.establishConnection();
    }
    /*
    * Save project :offline state
    */
    saveProject()
    {
      this.application.state.saveProject();
    }
    /*
    * Select menu : offline state
    */
    selectMenu(event)
    {
      this.application.state.menuChange(event);
    }
    /*
    * Delete connection : offline state
    */
    deleteConnection(connector:Connector)
    {
      this.application.state.deleteConnection(connector);
    }
    /*
    * Drop node : offline state
    */
    dropNode()
    {
      this.application.state.dropNode();
    }
    /*
    * Drop interface : offline state
    */
    dropInterface() {
      this.application.state.dropInterface();
    }
    /*
    * Delete connection in online and project : Online
    */
    deleteConnectionInonlineAndProject(connector:BaseConnector)
    {
      this.application.state.deleteConnectionInonlineAndProject(connector);
    }
    /*
    * Drop node to tree : offline
    */
    dropNodeToTree() {
      this.application.state.dropNodeToTree();
    }
    /*
    * Drag node from tree : offline
    */
    dragFromTreeMenu() {
      this.application.state.dragFromTreeMenu();
    }
    /*
    * Delete node : offline
    */
    deleteNode(node:HTMLNode)
    {
      this.application.state.deleteEditorNode(node);
    }
    /*
    *drag node : offline
    */
    dragNode()
    {
      this.application.state.dragNode();
    }
    /*
    * Show delete connection icon : offline
    */
    showDeleteConnectionIcon(connector:BaseConnector)
    {
      return this.application.state.showDeleteConnectionOption(connector);
    }
    /*
    * show delete AC icon : offline
    */
    showDeleteACIcon()
    {
      return this.application.state.showDeleteACOption();
    }

    /*
    * update connector status : offline
    */
    updateConnectorStatus(connector:BaseConnector)
    {
      this.application.state.updateConnectorState(connector);
    }
    /*
    * style editor node : offline and online
    */
    styleEditorNode(node:OPCNode)
    {
      this.application.state.styleNode(node);
    }
    /*
    * style online connection: offline and online
    */
    styleConnection(connector:BaseConnector)
    {
      this.application.state.styleConnector(connector);
    }
    /*
    * Create ARea : offline
    */
   createArea(parentAreaID) {
      this.application.state.createArea(parentAreaID);
    }
    /*
    * Delete ARea : offline
    */
    deleteArea(nodeData:TreeNode) {
      this.application.state.deleteArea(nodeData);
    }
    /*
    * Ungroup ARea : offline
    */
    unGroupArea(node: TreeNode) {
      this.application.state.unGroupArea(node);
    }
    /*
    * Reorder ARea : offline
    */
    reOrderArea(event: { dragNode: TreeNode, dropNode: TreeNode, index: number, originalEvent, accept },selectedItems:TreeNode[]) {
      this.application.state.reOrderArea(event,selectedItems);
    }
    /*
    * Navigate Route : offline
    */
    navigateRoute(){
     return this.application.state.navigateRoute();
    }
    /*
    * show delete connection option : offline
    */
    showConnectionDeleteOption(){
      return this.application.state.showConnectionDeleteOption();
    }
    /*
    * show device unavailable : online
    */
    showDeviceUnavailable(panelData:PanelDataType){
      return this.application.state.showDeviceUnavailable(panelData);
    }
    /*
    * draw canvas : online and offline
    */
    drawCanvas(myCanvas){
      this.application.state.drawCanvas(myCanvas);
    }
    /*
    * Check if project is online
    */
    isOnline(){
     return  this.application.state.isOnline();
    }

  }


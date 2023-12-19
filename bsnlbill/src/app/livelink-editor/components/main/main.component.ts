/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import {
  AfterViewInit,
  Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import { select, Selection } from 'd3';
import { MenuItem, TreeNode } from 'primeng/api';
import { ToggleButton } from 'primeng/togglebutton';
import { Observable, Subscription } from 'rxjs';

import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import {
  accessControl, AdapterMethods,
  ConnectorCreationMode,
  ConnectorState,
  ConnectorType,
  DeleteContextMenu,
  DeleteSubConnectionByType,
  DeviceAuthentication,
  DeviceAuthenticationStatus,
  DragDropAttribute,
  dragProperties,
  EstablishConnectionMenus,
  EstablishConnectionMenusId,
  FillingLineNodeType, HTTPStatus, NodeAttributes, NotificationType, numConstants,
  Numeric,
  ProjectState,
  SubConnectorCreationMode
} from '../../../enum/enum';
import { Connection, SelectedContextAnchor } from '../../../models/connection.interface';
import { AuthenticateDevice, EditorContext, ProjectProtection } from '../../../models/models';
import { DataAdapterManagers } from '../../../opcua/adapter/adapter-manager';
import { MonitorAdapter } from '../../../opcua/adapter/base-adapter/monitor-adapter';
import { PlantArea } from '../../../opcua/opcnodes/area';
import { BaseConnector } from '../../../opcua/opcnodes/baseConnector';
import { Connector } from '../../../opcua/opcnodes/connector';
import { HTMLNode } from '../../../opcua/opcnodes/htmlNode';
import { OPCNode } from '../../../opcua/opcnodes/opcnode';
import { SubConnector } from '../../../opcua/opcnodes/subConnector';
import { AreaUtilityService } from '../../../services/area-utility.service';
import { ROOT_EDITOR } from '../../../utility/constant';
import { connectorStyles, nodeStyles } from '../../../utility/svgutil';
import { isEmpty } from '../../../utility/utility';
import { FacadeService } from '../../services/facade.service';
import { EstablishConnectionMenuOptions } from './../../../models/connection.interface';



const mouse = {
  x: 0,
  y: 0,
  startX: 0,
  startY: 0
};

let element;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    "(window:click)": "onClickOutside()"
  }
})

export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  onlineConnectionConnector: Connector;
  connectionState: string;
  connectionAvailable = true;
  public items: MenuItem[];
  zoomPercent: number;
  private canvas;
  scaleXY: string;
  establishConnectionMenus: EstablishConnectionMenuOptions[];
  establishConnectionSelectionType: string;
  establishConnectionlabel: string;
  yesButtonString = 'common.buttons.yes';
  noButtonString = 'common.buttons.no';

  public monitor: MonitorAdapter;

  toggleButtonOffLabel = this.facadeService.translateService.instant('editor.menuOptions.proposeConnections'); //exit
  toggleButtonOnLabel = this.facadeService.translateService.instant('editor.menuOptions.proposeConnections');
  showDeleteIcon$: Observable<boolean>;
  @ViewChild('toggleBtn') toggleBtn: ToggleButton;
  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;

  editorDataSubscription: Subscription;
  rootEditorDataSubscription: Subscription;
  myCanvas: Element;
  showSidePanels = false;
  multipleSelectedNodes: Array<HTMLNode> = [];
  connectionSearchContextMenu$: Observable<unknown>;
  nestedAreas = [];
  selectedAreaInEditor: TreeNode;
  showEstablishConnectionOptionValue = false;
  anchorDetails: SelectedContextAnchor;
  showDeviceLoginModel = false;
  deviceAuthenticationFailed: string;
  languageChangeSubscription: Subscription;
  headerString = 'overlay.confirm.deleteConfirmation.header';
  private readonly areaUtilityService: AreaUtilityService;
  defaultCollapsedView = false;
  sidePanelData = {
    left: 'collapsed',
    right: 'collapsed'
  };
  showProjectProtectionModal$: Observable<boolean>;
  isCurrentProjectProtected: boolean;



  constructor(
    private readonly injector: Injector,
    public readonly elem: ElementRef,
    public readonly facadeService: FacadeService
  ) {
    this.areaUtilityService = facadeService.areaUtilityService;
    this.zoomPercent = 1;
  }
  /*
  *
  * returns the access control of the project(read/write)
  *
  */
  get accessControl() {
    return accessControl;
  }
  /*
  *
  * Disable online buttons if there are no areas/nodes in editor page
  *
  */
  get disableOnlineButton(){
    let disable = true;
    if(this.facadeService.dataService.getProjectData().editor !== null){
        if(this.facadeService.dataService.getProjectData().editor.hasOwnProperty('nodes') &&
        this.facadeService.dataService.getProjectData().editor.nodes.length > 0){
          disable = false;
        }
    }
    return disable;
  }
  /*
  *
  * Life cycle hook is when the page is initialized
  *
  */
  ngOnInit() {
    this.facadeService.applicationStateService.dropNode();
    const device = this.facadeService.dataService.getDevices();
    if (device && device.length > 0) {
      this.monitor = this.injector.get(DataAdapterManagers.getadapter(device[0].adapterType, AdapterMethods.MONITOR));
    }
    this.initEstablishConnectMenu();
    this.facadeService.editorService.selectedAreaData({ id: ROOT_EDITOR, name: '' });
    this.myCanvas = this.elem.nativeElement.querySelector('#myCanvas');
    this.editorDataSubscription = this.facadeService.editorService.editorContext
      .subscribe(context => this.loadEditorData.bind(this)(context, this.myCanvas));
    this.myCanvas.addEventListener('scroll', event => {
      this.facadeService.commonService.scrollLeft = (event.target as Element).scrollLeft;
      this.facadeService.commonService.scrollTop = (event.target as Element).scrollTop;
      this.facadeService.editorService.setScrollTopCanvasValue({
        top: this.facadeService.commonService.scrollTop, left: this.facadeService.commonService.scrollLeft
      });
      if (this.facadeService.editorService.contextMenuClick) {
        this.facadeService.editorService.contextMenuClick = false;
        this.facadeService.editorService.deselectAllConnectors();
        this.facadeService.editorService.resetMultiSelectedSubConnection();
      }
      this.facadeService.editorService.toggleAnchorSelection(null, false, false);
      const reziseObservableValue = {
        zoomPercent: this.zoomPercent,
        zoomChangeValue: !this.facadeService.zoomOperationsService.zoomChangeValue
      };
      this.facadeService.zoomOperationsService.setSubconnectionAllignment(reziseObservableValue);
    }, { passive: true });
    this.connectionSearchContextMenu$ = this.facadeService.editorService.selectedAnchorDetails$;
    this.scaleXY = `scale(' +${this.zoomPercent}+ ')`;
    this.facadeService.editorService.selectedAnchorDetails$.subscribe(anchorDetails => this.anchorDetails = anchorDetails);
    this.showAuthenticationPopup();
    this.showProjectProtectionModal$ = this.facadeService.commonService.projectProtectionModal;
    this.isCurrentProjectProtected = this.facadeService.dataService.isCurrentProjectProtected();
    this.facadeService.drawService.resizeCanvas();
  }

  /*
  *
  * This life cycle hook is called when the component's view is initialized
  *
  */
  ngAfterViewInit() {
    if (this.disableIfUnauthorizedDirective) {
      this.facadeService.areaUtilityService.removeInteractionEvents(this.disableIfUnauthorizedDirective);
    }

    if (this.facadeService.dataService.getProjectData().zoomSettings) {
      this.zoomPercent = this.facadeService.zoomOperationsService.setZoomPercent();
    }
    this.facadeService.drawService.setCanvas(this.elem.nativeElement);
  }
  /*
  *
  * Loads the editor data connections nodes etc
  *
  */
  loadEditorData(selectedEditor: EditorContext, myCanvas) {
    if (this.facadeService.editorService.isRootEditor()) {
      this.items = [
        { label: this.facadeService.dataService.getProjectName() },
        { label: this.facadeService.translateService.instant('editor.titles.connectionEditor') }
      ];
      this.showSidePanels = false;
    }
    else {
      if (selectedEditor?.parentLabels) {
        let labelHierarchy: { label: string }[] = [...selectedEditor?.parentLabels];
        labelHierarchy = labelHierarchy.filter(item => Boolean(item.label)
        && item.hasOwnProperty('label')
        && item.label !== this.facadeService.dataService.getProjectName());
        const reverseArray = [...labelHierarchy].reverse();
        const root = this.facadeService.commonService.treeMenu[0];
        this.items = [root,...reverseArray, { label: this.facadeService.translateService.instant('editor.titles.connectionEditor') }];
      }
      this.showSidePanels = true;
    }
    for (let i = 0; i < this.items.length - 1; i++) {
      delete this.items[i].icon;
      this.items[i]['command'] = event => {
        this.navigateToArea(this.items[i], event);
      };
    }
    this.facadeService.applicationStateService.drawCanvas(myCanvas);
    this.facadeService.editorService.toggleAnchorSelection(null, false, false);
    if (this.facadeService.applicationStateService.getStatus() === ProjectState.ONLINE) {
      this.monitor.goOnline();
      this.facadeService.commonService.changePanelData(null);
      this.facadeService.dataService.updateConnectionBasedOnDeviceStatus();
    }
  }
  /*
  *
  * When we navigate from one area to another using breadcrumb
  *
  */
  navigateToArea(node: MenuItem, event) {
    event.originalEvent.stopImmediatePropagation();
    this.facadeService.commonService.selectedMenuTree([node]);
    this.facadeService.areaUtilityService.nodeSelect(node);
  }
  /*
  *
  * show delete connection button when delete button is selected
  *
  */
  get showDeleteConnectionButton() {
    return this.facadeService.applicationStateService.showConnectionDeleteOption();
  }
  /*
  *
  * show delete context menu when a node or connection is selected
  *
  */
  showDeleteContextMenu() {
    if ( this.checkSelectedConnectionType()
    && this.facadeService.applicationStateService.isOnline()
    && this.facadeService.editorService.contextMenuClick
    && this.checkSelectedConnectionState()) {
      const contextMenu = this.elem.nativeElement.querySelector(DeleteContextMenu.CONTEXTMENU_ID);
      if (contextMenu) {
        this.onlineConnectionConnector = this.facadeService.editorService.selectedConnection as Connector;
        this.connectionState = this.facadeService.editorService.selectedConnection.state;
        this.connectionAvailable = this.facadeService.connectorService.isConnectedDevicesAvailable(this.facadeService.editorService.selectedConnection as Connector);
        const html = document.getElementsByTagName('html')[0];
        contextMenu.style.left = `${this.facadeService.commonService.pageX - html.scrollLeft + window.scrollX}px`;
        contextMenu.style.top = `${this.facadeService.commonService.pageY - html.scrollTop + Numeric.TEN + window.scrollY}px`;
      }
      return true;
    }
    else {
      return false;
    }
  }
  /*
  *
  *  Check if the selected connection is a connector
  *
  */
  checkSelectedConnectionType(){
    return (this.facadeService.editorService.selectedConnection
      && this.facadeService.editorService.selectedConnection.type === ConnectorType.CONNECTOR);
  }
  /*
  *
  * check for the selected connection state
  *
  */
  checkSelectedConnectionState(){
    return (this.facadeService.editorService.selectedConnection.state === ConnectorState.Success ||
    this.facadeService.editorService.selectedConnection.state === ConnectorState.Online);
  }
  /*
  *
  * returns the access control of the project(read/write)
  *
  */
  adjustContextPosition() {
    const contextMenu = this.elem.nativeElement.querySelector('#node-connection-search-menu');
    const nodeDetails = this.anchorDetails;

    if (contextMenu && nodeDetails.event.pageX && nodeDetails.isSelected) {
      const html = document.getElementsByTagName('html')[0];
      const { isClient, event: { pageX, pageY } } = nodeDetails;
      const clientWidth = document.getElementById('node-connection-search-menu')?.clientWidth || 0;
      if (contextMenu.style) {
        contextMenu.style.left = `${pageX - html.scrollLeft + window.scrollX}px`;
        if (isClient) {
          contextMenu.style.left = `${pageX - clientWidth - html.scrollLeft + window.scrollX}px`;
        }
        contextMenu.style.top = `${pageY - html.scrollTop + Numeric.TEN + window.scrollY}px`;
      }

    }
    return nodeDetails?.isSelected && nodeDetails?.event;
  }
  /*
  *
  * Trigger context position calc
  *
  */
  triggerContextPositionCalc() {
    const contextMenu = this.elem.nativeElement.querySelector('#node-connection-search-menu');
    this.adjustContextPosition();
    return contextMenu?.style && this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_CONNECTION_OFFLINE);
  }
   /*
  *
  * Delete  connection online if project has access
  *
  */
  deleteConnectionOnline(deleteConnectionType: string) {
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_CONNECTION_DELETE_ONLINE)) {
      return;
    }
    const serverDeviceName = this.getConnectionAnchorType(this.onlineConnectionConnector.outputAnchor);
    const clientDeviceName = this.getConnectionAnchorType(this.onlineConnectionConnector.inputAnchor);
    const serverInterfaceName = this.onlineConnectionConnector.outputAnchor.interfaceData.name;
    const clientInterfaceName = this.onlineConnectionConnector.inputAnchor.interfaceData.name;

    if (deleteConnectionType === DeleteContextMenu.DELETE_CONNECTION_ONLINE) {
      this.facadeService.overlayService.confirm({
        message: {
          content: [
            this.facadeService.translateService.instant('overlay.confirm.deleteOnlineConnectionAndProject.message.content',
              {
                serverDeviceName: serverDeviceName,
                serverInterfaceName: serverInterfaceName,
                clientDeviceName: clientDeviceName,
                clientInterfaceName: clientInterfaceName
              })]
        },
        header: this.facadeService.translateService.instant('overlay.confirm.deleteOnlineConnectionAndProject.header'),
        successLabel: this.facadeService.translateService.instant(this.yesButtonString),
        optionalLabel: this.facadeService.translateService.instant(this.noButtonString),
        acceptCallBack: () => {
          this.facadeService.applicationStateService.deleteConnection(this.onlineConnectionConnector);
          this.facadeService.editorService.selectedConnection = null;
        }
      });
    }
    else {
      this.facadeService.overlayService.confirm({
        message: {
          content: [this.facadeService.translateService.instant('overlay.confirm.deleteOnlineConnectionAndProject.message.content',
            {
              serverDeviceName: serverDeviceName,
              serverInterfaceName: serverInterfaceName,
              clientDeviceName: clientDeviceName,
              clientInterfaceName: clientInterfaceName
            })]
        },
        header: this.facadeService.translateService.instant('overlay.confirm.deleteOnlineConnectionAndProject.header'),
        successLabel: this.facadeService.translateService.instant(this.yesButtonString),
        optionalLabel: this.facadeService.translateService.instant(this.noButtonString),
        acceptCallBack: () => {
          this.facadeService.applicationStateService.deleteConnectionInonlineAndProject(this.onlineConnectionConnector);
          this.facadeService.editorService.selectedConnection = null;
        }
      });
    }
  }
   /*
  *
  * Get Connection anchor type
  *
  */
  getConnectionAnchorType = anchorDetails => {
    if ((anchorDetails.parentNode as OPCNode || PlantArea)['type'] === 'area') {
      return this.facadeService.dataService.getArea(anchorDetails.parentNode.id).name;
    }
    else {
      return (anchorDetails.parentNode as OPCNode).deviceName;
    }

  };
   /*
  *
  * Add the removed connection back to project
  *
  */
  addConnectionToProject() {
    if (this.facadeService.editorService.selectedConnection && this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_CONNECTION_OFFLINE)) {
      const connection = { ...this.facadeService.dataService.getConnection(this.facadeService.editorService.selectedConnection.id) };
      if (!isEmpty(connection)) {
        connection.creationMode = ConnectorCreationMode.MANUAL;
        this.facadeService.dataService.updateConnection(this.facadeService.editorService.selectedConnection.id, connection);
        this.addSubConnectionToProject(connection);
      }
    }
  }
  /*
 *
 * Add subConnection to project
 *
 */
  addSubConnectionToProject(connection: Connection) {
    const subConenctions = this.facadeService.dataService.getAllAssociatedSubConnections(connection.id);
    if (subConenctions && subConenctions.length > 0) {
      subConenctions.forEach(con => {
        con.creationMode = SubConnectorCreationMode.MANUAL;
        this.facadeService.dataService.updateSubConnection(con);
        const subConnector = this.facadeService.editorService.getExistingSubConnectorById(con.id);
        if (subConnector) {
          subConnector.creationMode = SubConnectorCreationMode.MANUAL;
          this.facadeService.editorService.addOrUpdateToSubConnectorLookup(subConnector);
        }
        this.facadeService.dataService.updateAreaInterfaceExposedMode(con.areaId, con.id, con.isclient, SubConnectorCreationMode.MANUAL);
      });
    }

    this.facadeService.editorService.selectedConnection.creationMode = ConnectorCreationMode.MANUAL;
    this.facadeService.editorService.addOrUpdateToConenctorLookup(this.facadeService.editorService.selectedConnection as Connector);

    this.facadeService.applicationStateService.updateConnectorStatus(this.facadeService.editorService.selectedConnection as Connector);
    this.facadeService.applicationStateService.styleConnection(this.facadeService.editorService.selectedConnection as Connector);
  }
   /*
  *
  * Show delete AC button
  *
  */
  get showDeleteACButton() {
    let showIcon = false;
    const nodes = [... this.facadeService.editorService.liveLinkEditor.editorNodes];
    const filteredElem = nodes.filter(item => item?.element?.classList.contains(DragDropAttribute.DRAGG_SELECTED));
    this.multipleSelectedNodes = filteredElem;
    if (this.facadeService.editorService.selectedNode || this.multipleSelectedNodes.length) {
      showIcon = this.facadeService.applicationStateService.showDeleteACIcon();
    }
    return showIcon;
  }

   /*
  *
  * Function is used to establish connection
  *
  */
  establishCon() {
    // delete all the online connections from server and ui
    if (this.disableEstablishConnectionBtn || !this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_ESTABLISH_CONNECTION)) {
      return;
    }
    this.facadeService.applicationStateService.establishConenction();
  }
  /*
 *
 *Checks if connectorLook up is empty
 *
 */
  isConnectionEmpty(): boolean {
    return isEmpty(this.facadeService.editorService.liveLinkEditor.connectorLookup);
  }
   /*
  *
  *Function to go online
  *
  */
  goOnline() {
    //Moving these lines after the callback in the monitor adapter will cause issues in online mode (ex: issue no 685579).
    this.facadeService.applicationStateService.changeApplicationStatus();
    //variable is used to toggle properties value display
    this.facadeService.commonService.isOnline = true;
    this.monitor.goOnline();
    this.facadeService.commonService.disableHomeAndDeviceIcons(true);
    this.facadeService.editorService.setSelectedConnection(null);
    this.facadeService.editorService.resetMultiSelectedConnection();

  }
  //testing
   /*
  *
  * Function to go offline
  *
  */
  goOffline() {
    this.monitor.offlineState();
    this.monitor.goOffline();
    this.facadeService.commonService.changePanelData(null);
    /** Resets Connection property accordion state */
    this.resetConnectionPropertyState();
  }
   /*
  *
  * returns the access control of the project(read/write)
  *
  */
  resetConnectionPropertyState() {
    this.facadeService.commonService.connectionPropertyState = [];
    this.facadeService.commonService.connectionPropertyAccordion.clientIndex = [];
    this.facadeService.commonService.connectionPropertyAccordion.serverIndex = [];
  }
   /*
  *
  * Zoom in
  *
  */
  zoomIn() {
    if (this.zoomPercent >= Numeric.ONEPOINTSEVENFIVE) {
      return;
    }
    this.zoomPercent += Numeric.POINTTWENTYFIVE;
    this.facadeService.zoomOperationsService.setZoomIn(this.zoomPercent);
    this.scaleXY = `scale(' +${this.zoomPercent}+ ')`;
  }
   /*
  *
  * zoom out
  *
  */
  zoomOut() {
    if (this.zoomPercent <= Numeric.POINTTWENTYFIVE || this.zoomPercent >= Numeric.TWO) {
      return;
    }
    this.zoomPercent -= Numeric.POINTTWENTYFIVE;
    this.facadeService.zoomOperationsService.setZoomOut(this.zoomPercent);
    this.scaleXY = `scale(' +${this.zoomPercent}+ ')`;
  }
   /*
  *
  * Reset zoom to 100%
  *
  */
  resetZoom() {
    this.zoomPercent = 1;
    this.facadeService.zoomOperationsService.changeZoomPercent(this.zoomPercent);
  }

  /*
 *
 * when the zoom percent is changed
 *
 */
  onChangePercentage() {
    const canvasElement = this.elem.nativeElement.querySelector('#myCanvas');
    canvasElement.scrollTop = 0;
    canvasElement.scrollLeft = 0;
    this.zoomPercent = this.facadeService.zoomOperationsService.setZoomPercent();
    this.facadeService.zoomOperationsService.adjustNodesInEditorForSelectedZoom(this.zoomPercent);

  }


 /*
  *
  * select area for zoom
  *
  */
  selectZoom() {
    return;
  }

  /*
   *
   * propose connection : currently not in use
   *
   */
  proposeCon(_e) {
    return;
  }

  /*
   *
   * upload connections to offline
   *
   */
  uploadConnectionsToOffline() {
    return;
  }
  /*
 *
 *Delete connection : single delete and multi deletE using ctrl key
 *
 */
  deleteConnection() {
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_CONNECTION_DELETE_OFFLINE)) {
      return;
    }
    let obj: BaseConnector, msg;
    if (this.facadeService.editorService.selectedConnection) {
      obj = this.facadeService.editorService.selectedConnection;
    }
    if (this.facadeService.editorService.multiSelectedConnectorMap.size > 1) {
      msg = this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.message.deleteMultipleConnection');
    } else {
      msg = this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.message.deleteConnection');
    }
    this.facadeService.overlayService.confirm({
      message: { content: [msg] },
      header: this.facadeService.translateService.instant(this.headerString),
      successLabel: this.facadeService.translateService.instant(this.yesButtonString),
      optionalLabel: this.facadeService.translateService.instant(this.noButtonString),
      acceptCallBack: () => {
        if (this.facadeService.editorService.isConnectionMultiSelect) {
          this.facadeService.editorService.multiSelectedConnectorMap.forEach((connection: Connector) => {
            this.deleteConnections(connection);
          });
          this.facadeService.editorService.multiSubConnectionSelectedMAp.forEach((connection: SubConnector) => {
            this.deleteConnections(connection);
          });
        } else {
          this.deleteConnections(obj);
        }
      }
    });
  }
   /*
  *
  * delete connections
  *
  */
  deleteConnections(obj: BaseConnector) {
    if (obj.type === ConnectorType.CONNECTOR) {
      this.facadeService.applicationStateService.deleteConnection(obj as Connector);
    }
    else {
      this.areaUtilityService.removeSubConnection(DeleteSubConnectionByType.SUB_CONNECTOR, '', [obj as unknown as SubConnector]);
    }

    this.facadeService.editorService.removeConnectionFromSelectedConnection(obj);
    this.facadeService.editorService.selectedConnection = null;
  }

  /*
 *
 * Delete editor node
 *
 */
  deleteEditorNode() {
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_DELETE_AREA_NODE)) {
      return;
    }
    if (this.multipleSelectedNodes.length) {
      this.removeMultipleNodeorAreaFromEditor();
      this.facadeService.drawService.resizeCanvas();
    }
    else {
      if (this.facadeService.editorService.selectedNode && this.facadeService.editorService.selectedNode.type === FillingLineNodeType.NODE) {
        this.popUpNodeDeleteConfirmationDialog(this.facadeService.editorService.selectedNode as OPCNode);
      }
      else {
        this.deleteAreaFromEditor(this.facadeService.editorService.selectedNode as PlantArea);
        this.facadeService.drawService.resizeCanvas();
      }
    }
  }
   /*
  *
  * Remove multiple node or area from editor
  *
  */
  removeMultipleNodeorAreaFromEditor() {
    this.facadeService.overlayService.confirm({
      message: { content: [this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.message.deleteSelectedComponents')] },
      header: this.facadeService.translateService.instant(this.headerString),
      successLabel: this.facadeService.translateService.instant(this.yesButtonString),
      optionalLabel: this.facadeService.translateService.instant(this.noButtonString),
      acceptCallBack: () => {
        this.multipleSelectedNodes.forEach(selectedNode => {
          if (selectedNode && selectedNode.type === FillingLineNodeType.NODE) {
            const connectors: Array<SubConnector> = [...selectedNode.getAllSubConnectors()];
            this.facadeService.applicationStateService.deleteNode(selectedNode);
            this.facadeService.editorService.selectedNode = null;
            this.facadeService.plantAreaService.updateNodeIdsInAreaData(selectedNode.id);
            this.facadeService.dataService.deleteNodeConnections(selectedNode.id);
            this.areaUtilityService.removeSubConnection(DeleteSubConnectionByType.NODE, selectedNode.id, connectors);
            this.removePropertyPanelData();
          }
          else {
            this.deleteArea(selectedNode as PlantArea);
          }
        });
      }
    });
  }
   /*
  *
  * Delete area from editor
  *
  */
  deleteAreaFromEditor(nodeData: PlantArea) {
    this.facadeService.overlayService.confirm({
      message: { content: [this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.message.deleteArea', { nodeDataName: nodeData.name })] },
      header: this.facadeService.translateService.instant(this.headerString),
      successLabel: this.facadeService.translateService.instant(this.yesButtonString),
      optionalLabel: this.facadeService.translateService.instant(this.noButtonString),
      acceptCallBack: () => {
        this.deleteArea(nodeData);
      }
    });
  }
   /*
  *
  * loop through nodes in recursive way
  *
  */
  recurseTreeData(node: TreeNode[], areaId: string) {
    node.forEach(treeNode => {
      if (treeNode.key === areaId) {
        this.selectedAreaInEditor = treeNode;
      }
      if (treeNode?.children?.length > 0) {
        this.recurseTreeData(treeNode.children, areaId);
      }
    });
  }
   /*
  *
  * loop through areas in recursive way
  *
  */
  recurseNestedArea(node) {
    node.forEach(treeNode => {
      if (treeNode.type === 'area') {
        this.nestedAreas.push(treeNode);
      }
      if (treeNode?.children?.length > 0) {
        this.recurseNestedArea(treeNode.children);
      }
    });
  }
   /*
  *
  * Function is used to delete area
  *
  */
  deleteArea(nodeData: PlantArea) {
    this.nestedAreas = [];
    this.recurseTreeData(this.areaUtilityService?.menuTreeData?.children, nodeData.id);
    this.recurseNestedArea(this.selectedAreaInEditor.children);
    this.nestedAreas.reverse();
    this.nestedAreas.push(nodeData);
    this.nestedAreas.forEach((areaData: PlantArea) => {
      const areaId: string = areaData.key || areaData.id;
      this.areaUtilityService.removeSubConnection(DeleteSubConnectionByType.AREA, areaId);
      this.facadeService.drawService.deleteArea(areaId);
    });
    this.removePropertyPanelData();
    this.facadeService.drawService.resizeCanvas();
  }
  /*
 *
 * Function is used to remove property panel data
 *
 */
  removePropertyPanelData() {
    this.facadeService.commonService.changePanelData(null);
    /*  this.common.monitorPanelData.pipe(filter(Boolean)).subscribe((data:PanelDataType) => {
       if(opcNode.deviceId === data.deviceId) {
       }
     }) */
  }

   /*
  *
  * Confirmation popup for node deletion
  *
  */
  private popUpNodeDeleteConfirmationDialog(opcNode: OPCNode) {
    let acName = '';
    if (opcNode?.name) {
      acName = opcNode.name;
    }
    this.facadeService.overlayService.confirm({
      message: { content: [this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.message.deleteAC', { acName: acName })] },
      header: this.facadeService.translateService.instant(this.headerString),
      successLabel: this.facadeService.translateService.instant(this.headerString),
      optionalLabel: this.facadeService.translateService.instant(this.noButtonString),
      acceptCallBack: () => {
        this.facadeService.applicationStateService.deleteNode(opcNode);
        this.facadeService.plantAreaService.updateNodeIdsInAreaData(opcNode.id);
        this.facadeService.dataService.deleteNodeConnections(opcNode.id);
        const subConnectors: Array<SubConnector> = [...opcNode.getAllSubConnectors()];
        this.areaUtilityService.removeSubConnection(DeleteSubConnectionByType.NODE, opcNode.id, subConnectors);
        this.removePropertyPanelData();
        this.facadeService.editorService.selectedNode = null;
        this.facadeService.drawService.resizeCanvas();
      }
    });
  }
  /*
 *
 * align connections so that they don't overlap
 *
 */
  alignConnection() {
    // return;
    this.facadeService.alignConnectionService.alignConnections();
  }
   /*
  *
  * Function to show establish connection menu
  *
  */
  initEstablishConnectMenu(): void {
    this.establishConnectionMenus = [
      {
        id: EstablishConnectionMenusId.ESTABLISH_ALL_CONNECTIONS,
        label: EstablishConnectionMenus.ESTABLISH_ALL_CONNECTIONS
      },
      {
        id: EstablishConnectionMenusId.ESTABLISH_SELECTED_CONNECTION,
        label: EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION
      }
    ];
    this.establishConnectionlabel = EstablishConnectionMenusId.ESTABLISH_ALL_CONNECTIONS;
    this.establishConnectionSelectionType =
      EstablishConnectionMenus.ESTABLISH_ALL_CONNECTIONS;
  }
   /*
  *
  * show options for establish connection
  *
  */
  showEstablishConnectionOption(event) {
    event.stopPropagation();
    this.showEstablishConnectionOptionValue = !this.showEstablishConnectionOptionValue;
  }
   /*
  *
  * when we click outside close the establish connection options
  *
  */
  onClickOutside() {
    this.showEstablishConnectionOptionValue = false;
  }
   /*
  *
  * update connection selection
  *
  */
  updateConnectionSelection(establishOption: EstablishConnectionMenuOptions) {
    this.facadeService.editorService.resetMultiSelectedConnection();
    this.establishConnectionlabel = establishOption.id;
    this.establishConnectionSelectionType = establishOption.label;
    this.facadeService.editorService.establishConnectionType = establishOption.label;
    this.facadeService.editorService.setIsMultiSelected(establishOption.label === EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION);
    this.showEstablishConnectionOptionValue = false;
  }
   /*
  *
  * disable establish connection if no connection is selected
  *
  */
  get disableEstablishConnectionBtn() {
    return this.disableEstablishConnection() || (this.facadeService.editorService.multiSelectedConnectorMap.size === 0 && this.isMultiSelectConnector);
  }
   /*
  *
  * Disable establish connection if there are no devices
  *
  */
  disableEstablishConnection(): boolean {
    return (
      this.facadeService.applicationStateService.isOnline() ||
      this.facadeService.commonService.editorHasNoDevice ||
      this.facadeService.commonService.noOfNodesInEditor < Numeric.TWO ||
      this.isConnectionEmpty()
    );
  }
   /*
  *
  * Enable multi selector if establish selected connection is chosen
  *
  */
  get isMultiSelectConnector(): boolean {
    return this.establishConnectionSelectionType === EstablishConnectionMenus.ESTABLISH_SELECTED_CONNECTION;
  }
   /*
  *
  * when the side panels are closed
  *
  */
  removeElementWidth(value) {
    this.sidePanelData[value.position] = value.mode;
    this.facadeService.resizeService.resizeDeviceWidth(value, this.elem, 'sidePanel');
    if (value.position === 'left' && !value.init) {
      this.facadeService.editorService.setSidePanelData(value.mode);
    }
  }
   /*
  *
  * this life cycle hook is called when the component is destroyed
  *
  */
  ngOnDestroy(): void {
    this.editorDataSubscription.unsubscribe();
  }

   /*
  *
  * when we click the mouse inside the editor
  *
  */
  mouseDown(e) {
    if (e.detail === 1 && e.target.classList.contains('bg-rect') && e.currentTarget.id === 'myCanvas' && !this.facadeService.applicationStateService.isOnline()) {
      this.canvas = this.elem.nativeElement.querySelector(DeleteContextMenu.CANVAS_ID);
      const dragSelection = this.elem.nativeElement.querySelectorAll(dragProperties.DRAG_CLASS);
      if (dragSelection) {
        for (const rect of dragSelection) {
          this.canvas.removeChild(rect);
        }
      }

      mouse.startX = e.clientX;
      mouse.startY = e.clientY;
      element = document.createElement('div');
      element.className = 'drag-selection';
      element.style.position = 'absolute';
      element.style.left = `${(e.offsetX)}px`;
      element.style.top = `${(e.offsetY)}px`;
      this.canvas.appendChild(element);
      this.onClickOfSVGWhiteSpace();
    }
  }

  private onClickOfSVGWhiteSpace() {
    if (this.isMultiSelectConnector) {
      // reset selected connection
      this.facadeService.editorService.setSelectedConnection(null);
      this.facadeService.editorService.selectedConnection = null;
      // reset multi selection connection on click outside
      this.facadeService.editorService.resetMultiSelectedConnection();
      this.facadeService.editorService.resetMultiSelectedSubConnection();
    }
    // search pop over
    this.facadeService.editorService.toggleAnchorSelection(null, false, false);
  }

   /*
  *
  * Event is triggered when mouse is moved inside the editor
  *
  */
  mouseMove(e) {
    const elementHorizontal =Math.abs(e.clientX-mouse.startX);
    const elementVertical =Math.abs(e.clientY-mouse.startY);

    if (element) {
      if((e.clientX-mouse.startX) < 0 && (e.layerX > numConstants.NUM_10) && ((e.clientX-e.layerX) < e.screenX)){
        element.style.left = `${Math.abs(e.offsetX)}px`;
      }
      if((e.clientY-mouse.startY) < 0 && (e.layerY > numConstants.NUM_10) && ((e.clientY-e.layerY) < e.screenY)){
        element.style.top = `${Math.abs(e.offsetY)}px`;
      }

      element.style.width = elementHorizontal + 'px';
      element.style.height = elementVertical + 'px';
    }
  }
   /*
  *
  * when the mouse is clicked and released
  *
  */
  mouseUp(_e) {
    element = null;
    const rect = this.elem.nativeElement.querySelector(dragProperties.DRAG_CLASS);
    const boxes = this.elem.nativeElement.querySelectorAll(NodeAttributes.Device_NODE_CLASS);
    if (rect && !this.facadeService.applicationStateService.isOnline()) {
      const inBounds = [];
      for (const box of boxes) {
        if (!box?.classList?.contains(DragDropAttribute.DRAGG_SELECTED) && this.isInBounds(rect, box)) {
          inBounds.push(box);
        } else {
          this.clearSelectedRect(box);
        }
      }
      if (inBounds.length >= 1 && rect.clientWidth > numConstants.NUM_100 && rect.clientHeight > numConstants.NUM_100) {
        for (const box of inBounds) {
          box.classList.add(DragDropAttribute.DRAGG_SELECTED);
          this.facadeService.editorService.selectedNode = null;
          this.facadeService.editorService.deselectAllNodes();
          const parent1 = box.querySelector('#parent-rect');
          const rect1 = parent1?.querySelector('.cls-2');
          rect1?.classList.add('selected');
        }
      }
      this.canvas?.removeChild(this.elem.nativeElement.querySelector(dragProperties.DRAG_CLASS));
    }
  }
   /*
  *
  * Show the device authentication modal when the device authentication is expired during establish connection and go online
  *
  */
  authenticationSuccessful(evt) {
    this.showDeviceLoginModel = false;
    if (this.facadeService.commonService.deviceAuthenticationFailedList.length > 0 &&
      this.facadeService.commonService.deviceAuthenticationFailedList.some(el => el.status === DeviceAuthenticationStatus.PENDING)) {
      const index = this.facadeService.commonService.deviceAuthenticationFailedList.findIndex(el => el.deviceId === evt.uid);
      this.facadeService.commonService.deviceAuthenticationFailedList[index].status = DeviceAuthenticationStatus.AUTHENTICATED;
      const i = this.facadeService.commonService.deviceAuthenticationFailedList.findIndex(el => el.status === DeviceAuthenticationStatus.PENDING);
      this.facadeService.commonService.showAuthenticationPopupState({
        device: this.facadeService.commonService.deviceAuthenticationFailedList[i],
        title: this.deviceAuthenticationFailed,
        multipleDevices: true
      });
    } else {
      if (this.deviceAuthenticationFailed === DeviceAuthentication.ESTABLISH_CONNECTION) {
        this.establishCon();
      } else {
        this.goOnline();
      }
      this.facadeService.notificationService.pushNotificationToPopup(
        { content: 'notification.info.deviceAuthenticationSuccessfull', params: {} },
        NotificationType.INFO, HTTPStatus.SUCCESS);
      this.facadeService.applicationStateService.saveProject();
    }
  }
   /*
  *
  * Export svg
  *
  */
  export() {
    this.facadeService.commonService.exportSnapShots('collapsed');
    const myCanvas = this.elem.nativeElement.querySelector('#myCanvasSvg');
    const canvas: Selection<any, unknown, null, undefined> = select(myCanvas); //NOSONAR
    canvas.select('defs').select('style').html(connectorStyles() + nodeStyles());
    let svgData = canvas.node();
    svgData = svgData.outerHTML;
    if (!svgData.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      svgData = svgData.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!svgData.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      svgData = svgData.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
   this.facadeService.commonService.exportSnapShots('full');
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'LiveLinkPreview.svg';
    downloadLink.click();
  }
  /*
 *
 * to deselect the rectangle selected using drag select
 *
 */
  clearSelectedRect(box) {
    this.facadeService.editorService.deselectAllConnectors();
    this.facadeService.editorService.resetMultiSelectedSubConnection();
    this.facadeService.editorService.deselectAllNodes();
    box.classList.remove(DragDropAttribute.DRAGG_SELECTED);
    const parent1 = this.elem.nativeElement.querySelectorAll('#parent-rect');
    for (const elem of parent1) {
      const rect1 = elem?.querySelector('.cls-2');
      if (rect1 && rect1.classList) {
        rect1.classList.remove('selected');
      }
    }
  }
   /*
  *
  * Check if the objects are within the rectangle
  *
  */
  isInBounds(obj1, obj2) {
    const a = obj1.getBoundingClientRect();
    const b = obj2.getBoundingClientRect();
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
   /*
  *
  * zoom for grid
  *
  */
  get transformStyle(): string {
    let increase = 1 - this.zoomPercent;
    if (this.zoomPercent === 1 || (this.zoomPercent) > 1) {
      increase = 1;
    }
    if ((this.zoomPercent) < 1) {
      increase = this.zoomPercent;
    }
    let translate = 0;
    const { translate: _translate, maxGridLength: _maxGridLength } = this.fixHeight(this.zoomPercent);
    translate = _translate;

    return `scale(${increase}) translate(${translate}%,${translate}%)`;
  }

   /*
  *
  * zoom
  *
  */
  fixHeight(zoomPercentage) {
    let translate = Numeric.ZERO;
    let maxGridLength = numConstants.NUM_20;
    switch (zoomPercentage) {
      case Numeric.ONE:
        this.setSidePanelWidth('16vw');
        break;
      case Numeric.POINTSEVENTFIVE:
        this.setSidePanelWidth('12vw');
        translate = -Numeric.SEVENTEEN;
        break;
      case Numeric.POINTFIFTY:
        this.setSidePanelWidth('8vw');
        maxGridLength = numConstants.NUM_20;
        translate = -Numeric.FIFTY;
        break;
      case Numeric.POINTTWENTYFIVE:
        this.setSidePanelWidth('4vw');
        maxGridLength = numConstants.NUM_20;
        translate = -Numeric.ONEFIFTY;
        break;
      default:
        this.setSidePanelWidth('16vw');
        break;
    }

    return { translate, maxGridLength };
  }
   /*
  *
  * set side panel width
  *
  */
  setSidePanelWidth(sidePanelWidth) {
    const deviceLeftSide = this.elem.nativeElement.querySelector('#device__left__side');
    const deviceRightSide = this.elem.nativeElement.querySelector('#device__right__side');

    /* Setting left side panel width */
    if (this.sidePanelData['left'] !== 'collapsed') {
      if (sidePanelWidth !== '16vw') {
        deviceLeftSide.style.width = sidePanelWidth;
      }
      deviceLeftSide.style.minWidth = sidePanelWidth;
    }

    /* Setting right side panel width */
    if (this.sidePanelData['right'] !== 'collapsed') {
      if (sidePanelWidth !== '16vw') {
        deviceRightSide.style.width = sidePanelWidth;
      }
      deviceRightSide.style.minWidth = sidePanelWidth;
    }

  }
   /*
  *
  * when we click on skip device in authentication popup
  *
  */
  skipDevice(evt) {
    const index = this.facadeService.commonService.deviceAuthenticationFailedList.findIndex(el => el.deviceId === evt.device.deviceId);
    this.facadeService.commonService.deviceAuthenticationFailedList[index].status = DeviceAuthenticationStatus.SKIPPED;
    const i = this.facadeService.commonService.deviceAuthenticationFailedList.findIndex(el => el.status === DeviceAuthenticationStatus.PENDING);
    this.facadeService.commonService.showAuthenticationPopupState({
      device: this.facadeService.commonService.deviceAuthenticationFailedList[i],
      title: this.deviceAuthenticationFailed,
      multipleDevices: true,
      index: i,
    });
  }
   /*
  *
  * when we click on cancel button during device authentication
  *
  */
  onCancel() {
    this.facadeService.commonService.deviceAuthenticationFailedList = [];
  }
   /*
  *
  * function is used to show authentication popup for device authentication
  *
  */
  showAuthenticationPopup() {
    this.facadeService.commonService.showAuthenticationPopupData.subscribe((res: AuthenticateDevice) => {
      this.showDeviceLoginModel = true;
      this.deviceAuthenticationFailed = res.title;
      const authenticatedCount = this.facadeService.commonService.deviceAuthenticationFailedList.filter(el => el.status === DeviceAuthenticationStatus.AUTHENTICATED);
      const index = this.facadeService.commonService.deviceAuthenticationFailedList.findIndex(el => el.deviceId === res.device.deviceId);
      let details;
      if (res.multipleDevices) {
        details = {
          noOfProtectedDevices: this.facadeService.commonService.deviceAuthenticationFailedList.length,
          index: (index + 1),
          authenticatedCount: authenticatedCount.length
        };
      } else {
        details = {
          noOfProtectedDevices: 0,
          index: 0,
          authenticatedCount: 0
        };
      }
      const data = {
        device: res.device,
        noOfProtectedDevices: details.noOfProtectedDevices,
        index: details.index,
        authenticatedCount: details.authenticatedCount,
        multipleDevices: res.multipleDevices,
        title: res.title
      };
      if (this.facadeService.commonService.deviceAuthenticationFailedList[this.facadeService.commonService.deviceAuthenticationFailedList.length - 1] === res.device) {
        this.facadeService.commonService.deviceAuthenticationFailedList = [];
      }
      this.facadeService.deviceService.setDeviceDetails(data);
    });

  }
   /*
  *
  * when the project is protected
  *
  */
  onSubmitProjectProtection(formData: Array<ProjectProtection>){
    this.facadeService.deviceService.onSubmitProjectProtection(formData);
  }
   /*
  *
  * Close the project protection popup
  *
  */
  hideProjectProtectionModal(){
    this.facadeService.commonService.setShowProjectProtectionModel(false);
    this.showDeviceLoginModel = false;

  }

}

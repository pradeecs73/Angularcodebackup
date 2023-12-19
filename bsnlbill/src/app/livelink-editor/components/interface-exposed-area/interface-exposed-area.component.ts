/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input, OnInit, Output, ViewChild, ViewEncapsulation
} from '@angular/core';
import { select, Selection } from 'd3';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Connection, SubConnection } from '../../../models/connection.interface';
import { Area,SubConnectionZoomData} from '../../../models/models';
import { getConnectionName } from '../../../utility/utility';

import {
  accessControl,
  ConnectorCreationMode,
  ConnectorState,
  ConnectorType, Interface, InterfaceCategory, interfaceGridViewType, numConstants, Numeric,
  ObjectType,
  SubConnectorCreationMode,
  SvgValues
} from '../../../enum/enum';
import {
  AreaClientInterface,
  AreaInterface,
  ClientInterface, IScroll,
  ISidePanel, RelatedEndPointInterface,
  SvgPoints
} from '../../../models/targetmodel.interface';
import { NodeAnchor } from '../../../opcua/opcnodes/node-anchor';
import { SubConnector } from '../../../opcua/opcnodes/subConnector';
import { FillingArea, FillingLineState } from '../../../store/filling-line/filling-line.reducer';
import { buildClientInterfacePanel, buildServerInterfacePanel } from '../../../utility/svgutil';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import { FacadeService } from '../../services/facade.service';
import { EllipsisPipe } from '../../../shared/pipes/ellipsis.pipe';
import { BuildInterfaceNode } from '../../../models/payload.interface';
@Component({
  selector: 'app-interface-exposed-area',
  templateUrl: './interface-exposed-area.component.html',
  styleUrls: ['./interface-exposed-area.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers : [EllipsisPipe]
})
export class InterfaceExposedAreaComponent implements OnInit,AfterViewInit {
  /**
   *
   * Variables for the components are declared here
   */
  @Input('label') headerLabel;
  @Output() removeElementWidth = new EventEmitter();
  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;

  public collapsedViewType = interfaceGridViewType.COLLAPSED;
  public expandedViewType = interfaceGridViewType.EXPANDED;
  viewType = interfaceGridViewType.COLLAPSED;
  interfaceLabel = this.facadeService.translateService.instant('editor.messages.addDragInterface');
  interfaceArray = [];
  maxGridLength = numConstants.NUM_40;
  from = '';
  areaSubscription: Subscription;
  removeWidthSubscription : Subscription;
  areaData: FillingArea;
  fillingLineStore: FillingLineState;
  areaId: string;
  nodeAnchors: Array<NodeAnchor> = [];
  updatedInterfaceData: Array<AreaClientInterface> | Array<AreaInterface> = [];
  isDevicePropertyPanelCollapsed = false;
  isDeviceTreePanelCollapsed = false;
  clientInterfacePanelCollapsed = true;
  previousScrolledValue = { left: 0, top: 0 };
  cols: { field: string; header: string; }[];
  zoomPercentChange:number;
  headerKey: string;

  svgPointMap = new Map();

  constructor(
    private readonly facadeService: FacadeService,
    private readonly elementRef: ElementRef,
    private readonly ellipsisPipe : EllipsisPipe
  ) {
    this.initializeSvgPointMap();
  }

  /**
   *
   * Returns the access control for the project (read/write)
   */
  get accessControl() {
    return accessControl
  }
  /**
   *
   * This life cycle hook is called when the page initializes
   */
  ngOnInit(): void {
    if(this.headerLabel === InterfaceCategory.CLIENT_INTERFACE ){
        this.headerKey = 'editor.titles.clientInterface';
    }else{
        this.headerKey = 'editor.titles.serverInterface';
    }
    this.interfaceArray = Array.from({ length: this.maxGridLength });
    this.setSidePanelViewType(this.headerLabel);
    this.setDefaultGridMessage();
    this.facadeService.applicationStateService.dropInterface();
    this.subscribeToExposeConnection();
    this.allignSubConnectionOnzoom();

    this.removeWidth(interfaceGridViewType.COLLAPSED, true);
    this.getScrolledValues();

    this.subscribeToDevicePropertyPanelChange();
    this.subscribeToDeviceTreePanelChange();
    this.collapseGridPanels();
    if (this.from === InterfaceCategory.SERVER) {
      this.subscribeToClientSidePanelChange();
    }

    this.cols = [
      { field: 'name', header: 'Code' }
    ];

    window.addEventListener('resize', () => {
        const reziseObservableValue={zoomPercent:this.zoomPercentChange,
          zoomChangeValue:!this.facadeService.zoomOperationsService.zoomChangeValue};

        this.facadeService.zoomOperationsService.setSubconnectionAllignment(reziseObservableValue);
    });
    this.resetPanelExposureOnNavigation();

  }
  /**
   *
   * When the grid panels are collapsed or expanded remove width function is called
   */
  collapseGridPanels(){
    this.removeWidthSubscription = this.facadeService.commonService.exportSnapShot$.subscribe((res:interfaceGridViewType)=>{
      if(this.headerLabel === InterfaceCategory.CLIENT_INTERFACE){
        this.from = Interface.client;
      }else{
        this.from = Interface.server;
      }
      this.removeWidth(res);
    });
  }
  /**
   *
   * Align all the subConnections when we change the zoom factor
   */

  allignSubConnectionOnzoom() {
    if(!this.facadeService.editorService.isRootEditor()){
      this.facadeService.zoomOperationsService.subConnectionZoomChangeObs.subscribe((zoom:SubConnectionZoomData) => {
          this.zoomPercentChange=zoom.zoomPercent;
       if (this.from === InterfaceCategory.CLIENT){
           this.addInterfaceToList(this.areaData?.clientInterfaces);
        }
        if (this.from === InterfaceCategory.SERVER){
            this.addInterfaceToList(this.areaData?.serverInterfaces);
         }

      });
    }
  }
  /**
   *
   * Reset the panel exposure(collapsed/expanded) when navigated to different page
   */
  resetPanelExposureOnNavigation(){
    this.facadeService.commonService.updateNavigation$.pipe(filter(Boolean)).subscribe(()=>this.resetPanelExposureData());
  }
  /**
    *
    * Subscribe to to expose connection
    *
    */
  subscribeToExposeConnection() {
    this.areaSubscription = combineLatest([
      this.facadeService.fillingLineService.getFillingLine(), this.facadeService.editorService.editorContext
    ])
      .pipe(
        filter(
          ([fillingLineData, editorContext]) =>
            !this.facadeService.editorService.isRootEditor() && Boolean(fillingLineData && editorContext)
        ),
        distinctUntilChanged((a, b) => {
          return (
            b[1] === a[1] &&
            JSON.stringify(a[0].entities) === JSON.stringify(b[0].entities)
          );
        })
      )
      .subscribe(([fillingLineStore, { id: areaId }]) => {
        this.areaId = areaId;
        this.fillingLineStore = fillingLineStore;
        this.areaData = fillingLineStore.entities[areaId] as FillingArea;
        if (this.from === InterfaceCategory.CLIENT && (this.checkAlreadyAdded(this.areaData?.clientInterfaces)?.length ||
          this.removedInterface(this.areaData?.clientInterfaces))) {
          this.addInterfaceToList(this.areaData?.clientInterfaces);
        }
        if (this.from === InterfaceCategory.SERVER && (this.checkAlreadyAdded(this.areaData?.serverInterfaces)?.length ||
          this.removedInterface(this.areaData?.serverInterfaces))) {
          this.addInterfaceToList(this.areaData?.serverInterfaces);
        }
      });
  }
  /**
    *This life cycle hook is called when the component's view is initialized
    *
    */
  ngAfterViewInit(): void {
    const sidePanel: HTMLElement = this.elementRef.nativeElement.querySelector('#interface-side-panel');
    sidePanel.setAttribute('interfaceType', this.from);
    if (this.disableIfUnauthorizedDirective) {
      this.facadeService.areaUtilityService.removeInteractionEvents(this.disableIfUnauthorizedDirective)
    }
  }
  /**
    *
    * Subscribe to device property panel change
    *
    */
  subscribeToDevicePropertyPanelChange() {
    this.facadeService.editorService.devicePropertyPanelViewChange
      .pipe(
        filter(Boolean),
        distinctUntilChanged((prev, curr) => prev === curr)
      )
      .subscribe((changedPanelData: interfaceGridViewType) => {
        this.isDevicePropertyPanelCollapsed = false;
        if (changedPanelData === interfaceGridViewType.COLLAPSED) {
          this.isDevicePropertyPanelCollapsed = true;
        }
        this.updateAnchorConnection(changedPanelData);
      });
  }
  /**
    *
    * subscribe to device tree panel change
    *
    */
  subscribeToDeviceTreePanelChange() {
    this.facadeService.editorService.deviceTreePanelViewChange
      .pipe(
        filter(Boolean),
        distinctUntilChanged((prev, curr) => prev === curr)
      )
      .subscribe((changedPanelData: interfaceGridViewType) => {
        if (changedPanelData) {
          this.isDeviceTreePanelCollapsed = false;
          let dRow = document.querySelector('.d-row')?.clientWidth;
          if (changedPanelData === interfaceGridViewType.COLLAPSED) {
            this.isDeviceTreePanelCollapsed = true;
            dRow = dRow + Numeric.TWOFIFTY;
          } else {
            dRow = dRow - Numeric.TWOFIFTY;
          }
          this.updateAnchorConnection(changedPanelData, dRow);
        }
      });
  }
  /**
    *
    * subscribe to client side panel change
    *
    */
  subscribeToClientSidePanelChange() {
    this.facadeService.editorService.sidePanelViewChange
      .pipe(
        filter(Boolean),
        distinctUntilChanged((prev, curr) =>
          prev === curr && !(prev ===  interfaceGridViewType.EXPANDED && this.clientInterfacePanelCollapsed)
        )
      )
      .subscribe((changedPanelData: interfaceGridViewType) => {
        if (changedPanelData) {
          this.clientInterfacePanelCollapsed = true;

          if (changedPanelData === interfaceGridViewType.EXPANDED) {
            this.clientInterfacePanelCollapsed = false;
          }

          this.updateAnchorConnection(changedPanelData);
        }
      });
  }
  /**
    *
    * Check if the interface is already added
    *
    */
  checkAlreadyAdded(interfaces) {
    return interfaces?.filter(function (_interface) {
      return !this.has(_interface);
    },
      new Set(this.updatedInterfaceData));
  }
  /**
    *
    * Remove the interface when a device is deleted
    *
    */
  removedInterface(interfaces) {
    return this.updatedInterfaceData?.length > interfaces?.length;
  }
  /**
    *
    *When the page is called with grid panels open
    *
    */
  getScrolledValues() {
    this.facadeService.editorService.scrollTopCanvasValue.subscribe((scrolledValue: IScroll) => {
      if (scrolledValue) {
        this.adjustSvgPoints(scrolledValue);
      }
    });
  }
  /**
    *
    *adjust svg points
    *
    */
  adjustSvgPoints(scrolledValue: IScroll) {
    this.nodeAnchors.forEach((anchor, i) => {
      let svgPointValues = this.getSvgPoints(anchor, null, i);
      svgPointValues = { ...svgPointValues };
      svgPointValues.y = svgPointValues.y + (scrolledValue.top - this.previousScrolledValue.top);
      if (this.from === InterfaceCategory.SERVER) {
        svgPointValues.x = svgPointValues.x + (scrolledValue.left - this.previousScrolledValue.left);
      }
      (anchor?.connectors[0] as SubConnector)?.updateHandle(anchor, this.viewType, svgPointValues);
      anchor.updateConnectors();
    });
    this.previousScrolledValue = scrolledValue;
  }
  /**
    *
    * When the connection is exposed add the interface to list
    *
    */
  addInterfaceToList(interfaceData: Array<AreaClientInterface> | Array<AreaInterface>) {
    let lastIndex;
    /* IF the interface data is not there show default value */
    if (interfaceData?.length === 0) {
      this.interfaceLabel = this.facadeService.translateService.instant('editor.messages.addDragInterface');
      this.resetInterfacePanel();
      this.updatedInterfaceData = interfaceData;
      return;
    }
      this.resetInterfacePanel();
      this.updatedInterfaceData = interfaceData;
      const interfacePanel: HTMLElement = this.elementRef.nativeElement.querySelector('#p-custom-table');
      for (let i = 0; i < this.updatedInterfaceData?.length; i++) {
        /* if the interface data is not added before  */
        if (typeof this.interfaceArray[i] !== ObjectType.OBJECT) {
          this.interfaceArray[i] = { ... this.updatedInterfaceData[i] };
          setTimeout(() => {
            const htmlElement = interfacePanel.children[0]?.children[0]?.children[0] as HTMLElement;
            if (this.updatedInterfaceData?.length === 0) {
              this.resetInterfacePanel();
            }
            if (htmlElement && this.updatedInterfaceData?.length > 0 && this.updatedInterfaceData[i]) {
              const subConnectionData = this.facadeService.dataService.getSubConnection(interfaceData[i]?.subConnectionId);
              const tdList = (htmlElement).querySelectorAll('td');
              const spanElement = tdList[i].querySelector('#anchorID') as unknown as HTMLElement;
              this.buildInterfaceNode(this.updatedInterfaceData[i], spanElement, i, subConnectionData);
            }
          }, Numeric.TWOHUNDERD);
        }
        lastIndex = i;
      }
      this.interfaceArray[lastIndex + 1] = this.interfaceLabel;
  }

  /**
    *
    * Reset the interface panel
    *
    */
  resetInterfacePanel() {
    this.interfaceArray = Array.from({ length: this.maxGridLength });
    this.interfaceArray[0] = this.interfaceLabel;
  }

  /**
    *
    *Function to get the device name
    *
    */
  getDeviceName(interfaceData: AreaClientInterface, key: string): string {
    let deviceName = '';
    if(this.areaData){
      if (this.areaData.nodeIds && this.areaData.nodeIds.length) {
        deviceName=this.getDeviceNameHavingNodeId(interfaceData);
      } else {
        deviceName=this.getDeviceNameWithOutNodeId(interfaceData,key);
       }
    }
   return deviceName;
}
  /**
    *
    *Return the device name which has node id
    *
    */
  getDeviceNameHavingNodeId(interfaceData: AreaClientInterface){
    let deviceName = '';
    for (const node of this.areaData?.nodeIds) {
      const entity = this.fillingLineStore.entities[node];
      if ((this.from === InterfaceCategory.CLIENT && entity?.clientInterfaces.some(data => data.id === interfaceData.id)) ||
        (this.from === InterfaceCategory.SERVER && entity?.serverInterfaces.some(data => data.id === interfaceData.id))) {
        deviceName = entity.name;
        break;
      }
    }
    return deviceName;
  }
  /**
    *
    *Return the device name without node id
    *
    */
  getDeviceNameWithOutNodeId(interfaceData: AreaClientInterface, key: string){
    let deviceName = '';
    const childAreas = this.facadeService.dataService.getAreaByParent(this.areaData.id) || [];
    for(const area of childAreas) {
      if ((key === InterfaceCategory.CLIENT_INTERFACE_ID && this.getAreaName(area?.clientInterfaceIds, interfaceData)) ||
          (key === InterfaceCategory.SERVER_INTERFACE_ID && this.getAreaName(area?.serverInterfaceIds, interfaceData))) {
              deviceName = area.name;
               break;
      }

    }
    return deviceName;
  }
  /**
    *
    *Returns the area name
    *
    */
  getAreaName(interfaceIds: ISidePanel[], interfaceData: AreaClientInterface) {
    return interfaceIds?.find(_interface =>
      _interface.automationComponentId === interfaceData.automationComponentId &&
      _interface.interfaceId === interfaceData.id);
  }
  /**
    *
    *Returns the sub connection by using the id
    *
    */
  getSubConnection(interfaceData: AreaClientInterface): SubConnection {
    const automationComp = this.facadeService.dataService.getAutomationComponent(interfaceData.deviceId, interfaceData.automationComponentId);
    const subConnectionData = getConnectionName(interfaceData.deviceId, automationComp?.name, interfaceData.name);
    return this.facadeService.dataService.getSubConnectionByData(this.areaId, subConnectionData);
  }

  /**
    *
    * Build the interface grid panels
    *
    */
  buildInterfaceNode(interfaceData: AreaClientInterface, htmlElement:HTMLElement, index:number, subConnection: SubConnection) {
    let subConnectionId: string = interfaceData.subConnectionId;
    if (!interfaceData.subConnectionId && subConnection && subConnection.id) {
      subConnectionId = subConnection.id;
    }

    let svg = '';
    let isClient = false;
    ({ isClient, svg } = this.buildSVGForSidePanel(this.from, interfaceData));
    /**
     * Type 'any' : because its a part of third party library
     */
    const divElement: Selection<any, unknown, null, undefined> = select(htmlElement); //NOSONAR
    divElement.empty();
    divElement.html(svg);

    let nodeAnchor: NodeAnchor = this.createNodeAnchor(divElement, interfaceData, isClient, index, htmlElement);

    const interfaceDetails: ISidePanel = this.getInterfaceIds(interfaceData);

    if(interfaceDetails)
    {
      const connectionDetails = this.updateSubConnectionDetails(subConnectionId, nodeAnchor, subConnection, interfaceDetails);
      nodeAnchor = connectionDetails.nodeAnchor;
      const { clonedNodeAnchor, subConnector } = connectionDetails;
      if (subConnector && nodeAnchor?.connectors && nodeAnchor.connectors.length > 0) {
        nodeAnchor = this.setDefaultGridStyle(nodeAnchor);
        this.facadeService.subConnectorService.connect(subConnector, this.areaId);
        const payload:BuildInterfaceNode = {
          nodeAnchor, subConnector, interfaceDetails, interfaceData, clonedNodeAnchor, subConnection, index
        };
        this.drawSubConnectionToSidePanels(payload);
      }
   }

  }
  /**
    *
    * Function is used to draw sub connections to the side panels
    *
    */
  drawSubConnectionToSidePanels(payload:BuildInterfaceNode)  {
    const {
      nodeAnchor, subConnector, interfaceDetails, interfaceData, clonedNodeAnchor, subConnection, index
    } = payload;
    if (nodeAnchor.connectors && nodeAnchor.connectors.length > 0) {
      const connectionData = this.facadeService.dataService.getConnection(subConnector?.connectionId);
      this.updateCreationMode(subConnector, interfaceDetails.interfaceExposedMode, connectionData);
      this.updateSubConnectorConnectionEndPointStatus(subConnector, nodeAnchor, connectionData);
      this.facadeService.applicationStateService.updateConnectorStatus(subConnector);
      this.updateAreaWithSubConnection(interfaceData, interfaceDetails, subConnector.id);
      if (clonedNodeAnchor && this.viewType === interfaceGridViewType.EXPANDED) {
        subConnection.x = clonedNodeAnchor.global.x;
        subConnection.y = clonedNodeAnchor.global.y;
      }
      const svgGlobalPoints: SvgPoints = this.getSvgPoints(nodeAnchor, subConnection, index);
      this.facadeService.subConnectorService.updateHandle(subConnector, nodeAnchor, svgGlobalPoints);
      this.facadeService.applicationStateService.styleConnection(subConnector);
      this.updateNodeAnchorList(nodeAnchor);
      nodeAnchor.updateConnectors();
    }
  }
  /**
    *
    * Create node anchor
    *
    */
  createNodeAnchor(divElement, interfaceData: AreaClientInterface, isClient: boolean, index, htmlElement) {
    const anchorElement = select(divElement.node()).select(`#${interfaceData.id}`);
    const nodeAnchor = new NodeAnchor(htmlElement, anchorElement, isClient, interfaceData, index, this.facadeService.editorService.liveLinkEditor);
    nodeAnchor.update();
    return nodeAnchor;
  }
  /**
    *
    *Update sub connection details
    *
    */
  updateSubConnectionDetails(subConnectorId: string, nodeAnchor:NodeAnchor, subConnection: SubConnection, interfaceDetails: ISidePanel) {
    let clonedNodeAnchor;
    let subConnector: SubConnector;
    if (!subConnectorId || !this.facadeService.editorService.liveLinkEditor.subConnectorLookup[subConnectorId]) {
      subConnector = this.facadeService.subConnectorService.createSubConnector(nodeAnchor,
        interfaceDetails?.interfaceExposedMode,
        this.facadeService.editorService.getEditorContext().id, subConnectorId);
      subConnector.connectionId = subConnection?.connectionId;
    }
    else {
      subConnector = this.facadeService.editorService.liveLinkEditor.subConnectorLookup[subConnectorId];
      clonedNodeAnchor = { ...nodeAnchor } as NodeAnchor;
      nodeAnchor = this.updateNodeAnchor(this.from, subConnector, nodeAnchor, clonedNodeAnchor);
    }
    return { subConnector, clonedNodeAnchor, nodeAnchor };
  }
  /**
    *
    * Update node anchor list
    *
    */
  updateNodeAnchorList(nodeAnchor: NodeAnchor) {
    if (this.nodeAnchors.length === 0) {
      this.nodeAnchors.push(nodeAnchor);
    } else {
      const anchorIndex = this.nodeAnchors.findIndex(anchor => anchor.anchorElement.id === nodeAnchor.anchorElement.id);
      if (anchorIndex === -1) {
        this.nodeAnchors.push(nodeAnchor);
      } else {
        this.nodeAnchors[anchorIndex] = nodeAnchor;
      }
    }
  }


  /**
    *
    *Update the sub connector's connection end point state
    *
    */
  updateSubConnectorConnectionEndPointStatus(subConnector: SubConnector, nodeAnchor: NodeAnchor, connectionData: Connection) {
    if (connectionData) {
      const connectionEndPointDetails = this.facadeService.dataService.getConnectionEndPointData(connectionData);
      const relatedEndPoint: RelatedEndPointInterface = {} as RelatedEndPointInterface;
      relatedEndPoint.address = connectionEndPointDetails?.relatedEndpoints?.value;
      subConnector.updateConnectionEndPointStatus(connectionEndPointDetails?.status.value, relatedEndPoint);
    }
    else {
      subConnector.updateConnectionEndPointStatus(nodeAnchor.connectionStatus, nodeAnchor.relatedEndPoint);
    }
  }
  /**
    *
    *Updates the creation mode
    *
    */
  updateCreationMode(subConnector: SubConnector, interfaceExposedMode: SubConnectorCreationMode, connectionData: Connection) {
    if (connectionData) {
      if (connectionData.creationMode === ConnectorCreationMode.ONLINE
        && interfaceExposedMode !== SubConnectorCreationMode.ONLINE) {
        subConnector.creationMode = SubConnectorCreationMode.MANUALONLINE;
      }
      if (connectionData.creationMode === ConnectorCreationMode.MANUAL) {
        subConnector.creationMode = SubConnectorCreationMode.MANUAL;
      }
    }
    else {
      if (subConnector.connectionId && interfaceExposedMode === SubConnectorCreationMode.ONLINE) {
        subConnector.creationMode = SubConnectorCreationMode.ONLINE;
      }
    }
  }
  /**
    *
    * When the panels are expanded or collapsed
    *
    */
  removeWidth(mode: interfaceGridViewType, init = false) {
    this.viewType = mode;
    let position = 'left';
    if (this.from === InterfaceCategory.SERVER) {
      position = 'right';
      this.facadeService.editorService.serverInterfaceGridViewType = this.viewType;
    }
    else {
      this.facadeService.editorService.clientInterfaceGridViewType = this.viewType;
    }
    const emitObj = { init, mode: mode, position: position };
    this.removeElementWidth.emit(emitObj);
    const reziseObservableValue={zoomPercent:this.zoomPercentChange,
      zoomChangeValue:!this.facadeService.zoomOperationsService.zoomChangeValue};
    this.facadeService.zoomOperationsService.setSubconnectionAllignment(reziseObservableValue);
    this.updateAnchorConnection(mode);

  }
  /**
    *
    *update anchor connection
    *
    */
  updateAnchorConnection(mode: interfaceGridViewType, drow?: number) {
    const dRow = drow || document.querySelector('.d-row').clientWidth;
    const parentWidth = this.elementRef.nativeElement?.parentNode?.parentNode?.clientWidth;
    this.nodeAnchors.forEach((anchor, i) => {
      if (parentWidth !== undefined && anchor.connectors[0]?.type === ConnectorType.SUBCONNECTOR) {
        let svgPointValues = this.getSvgPoints(anchor, null, i);
        svgPointValues = { ...svgPointValues };
        let reduceConnectionWidth = Numeric.TWOEIGHTY;
        if (this.isDevicePropertyPanelCollapsed && mode === interfaceGridViewType.EXPANDED) {
          reduceConnectionWidth = -(Numeric.ONEFIFTY);
        }
        if (this.from === InterfaceCategory.SERVER) {
          const width = parentWidth - svgPointValues.x - reduceConnectionWidth + this.previousScrolledValue.left;
          svgPointValues.x = Number(svgPointValues.x) + Number(width);
          if (svgPointValues.x > parentWidth) {
            svgPointValues.x -= Math.abs(width);
          }
          if (parentWidth > svgPointValues.x && this.previousScrolledValue.left > 0) {
            svgPointValues.x += Math.abs(reduceConnectionWidth);
          }
          svgPointValues.x = this.adjustServerSubConnection(svgPointValues.x, dRow);
        }

        (anchor?.connectors[0] as SubConnector)?.updateHandle(anchor, this.viewType, svgPointValues);
        anchor.updateConnectors();
      }
    });
  }
  /**
    *
    * Initialize svg point map
    *
    */
  initializeSvgPointMap(){
    this.svgPointMap.set(Numeric.ZERO,SvgValues.TWO);
    this.svgPointMap.set(Numeric.ONE,SvgValues.FIVE);
    this.svgPointMap.set(Numeric.TWO,SvgValues.TWOFOUR);
    this.svgPointMap.set(Numeric.THREE,SvgValues.THREEFIVE);
    this.svgPointMap.set(Numeric.FOUR,SvgValues.TWOONE);
    this.svgPointMap.set(Numeric.FIVE,SvgValues.FOUR);
    this.svgPointMap.set(Numeric.SIX,SvgValues.TWOSEVEN);
    this.svgPointMap.set(Numeric.SEVEN,SvgValues.THREENINE);
  }
  /**
    *
    *Function is used to adjust server sub connection
    *
    */
  adjustServerSubConnection(svgPointXValue, dRow) {
    let _svgPointXValue = svgPointXValue;
    const svgValueArray=[];
    const case0=this.getSvgPointXvalueCases(this.isDeviceTreePanelCollapsed,this.clientInterfacePanelCollapsed,this.isDevicePropertyPanelCollapsed);
    const case1=this.getSvgPointXvalueCases(!this.isDeviceTreePanelCollapsed,!this.clientInterfacePanelCollapsed,!this.isDevicePropertyPanelCollapsed);
    const case2=this.getSvgPointXvalueCases(this.isDeviceTreePanelCollapsed,this.clientInterfacePanelCollapsed,!this.isDevicePropertyPanelCollapsed);
    const case3=this.getSvgPointXvalueCases(this.isDeviceTreePanelCollapsed,!this.clientInterfacePanelCollapsed,this.isDevicePropertyPanelCollapsed);
    const case4=this.getSvgPointXvalueCases(!this.isDeviceTreePanelCollapsed,this.clientInterfacePanelCollapsed,this.isDevicePropertyPanelCollapsed);
    const case5=this.getSvgPointXvalueCases(!this.isDeviceTreePanelCollapsed,!this.clientInterfacePanelCollapsed,this.isDevicePropertyPanelCollapsed);
    const case6=this.getSvgPointXvalueCases(!this.isDeviceTreePanelCollapsed,this.clientInterfacePanelCollapsed,!this.isDevicePropertyPanelCollapsed);
    const case7=this.getSvgPointXvalueCases(this.isDeviceTreePanelCollapsed,!this.clientInterfacePanelCollapsed,!this.isDevicePropertyPanelCollapsed);

    svgValueArray.push(case0);
    svgValueArray.push(case1);
    svgValueArray.push(case2);
    svgValueArray.push(case3);
    svgValueArray.push(case4);
    svgValueArray.push(case5);
    svgValueArray.push(case6);
    svgValueArray.push(case7);

    const currentSvgCaseIndex=svgValueArray.indexOf(true);
    const svgPonintValueFromMap=this.svgPointMap.get(currentSvgCaseIndex)
    _svgPointXValue = dRow - (dRow * svgPonintValueFromMap);
    return _svgPointXValue;
  }
  /**
    *
    * get svg point
    *
    */
  getSvgPointXvalueCases(collapsedPanelValue1:boolean,collapsedPanelValue2:boolean,collapsedPanelValue3:boolean){
        return (collapsedPanelValue1 && collapsedPanelValue2 && collapsedPanelValue3);
  }
  /**
    *
    *Returns the svg points
    *
    */
  getSvgPoints(nodeAnchor: NodeAnchor, subConnection?: SubConnection, index?) {
    let svgGlobal;
    if (subConnection && (subConnection.x !== 0) && subConnection.x && subConnection.y) {
      svgGlobal = { x: subConnection.x, y: subConnection.y };
    }
    else {
      if (nodeAnchor.connectors && (nodeAnchor.connectors[0] as SubConnector)?.svgGlobal) {
        svgGlobal = (nodeAnchor.connectors[0] as SubConnector)?.svgGlobal;
      }
      else {
        if (this.viewType === interfaceGridViewType.COLLAPSED) {
          svgGlobal = this.getSvgPointsForSidePanelCollapsed(nodeAnchor, index);
        } else {
          svgGlobal = { x: nodeAnchor.global.x, y: nodeAnchor.global.y };
        }
      }
    }
    return svgGlobal;
  }
  /**
    *
    *Returns the svg points when the side panels are collapsed
    *
    */
  getSvgPointsForSidePanelCollapsed(nodeAnchor: NodeAnchor, index:number) {
    let svgGlobal;
    const areaData = { ...this.facadeService.dataService.getArea(this.areaId) };
    if (this.from === InterfaceCategory.CLIENT && areaData?.clientInterfaceIds?.length) {
      svgGlobal = {
        x: nodeAnchor.global.x + Numeric.THREESEVENTYTHREE, y: Numeric.FIFTYNINE + (index * Numeric.THIRTY)
      };
    }
    if (this.from === InterfaceCategory.SERVER && areaData?.serverInterfaceIds?.length) {
      const parentWidth = this.elementRef.nativeElement?.parentNode?.parentNode?.clientWidth;
      svgGlobal = { x: parentWidth, y: Numeric.FIFTYNINE + (index * Numeric.THIRTY) };
    }
    return svgGlobal;
  }
  /**
    *
    *Updates area with sub connection
    *
    */

  updateAreaWithSubConnection(_interfaceData: AreaClientInterface, interfaceDetails: ISidePanel, subConnectionId: string) {
    const areaData = { ...this.areaData };
    const areaFromService = { ...this.facadeService.dataService.getArea(this.areaId) } as Area;

    let interfaceIds: Array<ISidePanel> = [];

    if (this.from === InterfaceCategory.CLIENT) {
      interfaceIds = areaFromService?.clientInterfaceIds;
    }
    else {
      interfaceIds = areaFromService?.serverInterfaceIds;
    }

    const mappedInterfaceIds = interfaceIds.map(sIds => {
      if (sIds.interfaceId === interfaceDetails.interfaceId) {
        return {
          ...sIds,
          subConnectionId: subConnectionId
        };
      }
      return sIds;
    });

    const updatedAreaDetails = this.updateInterfaceIds(areaFromService, mappedInterfaceIds, this.from);
    this.facadeService.dataService.updateArea(this.areaData.id, updatedAreaDetails);
    this.areaData = areaData;
  }
  /**
    *
    *Generates the device name
    *
    */
  generateDeviceName(interfaceData, from) {
    let deviceName;
    if (from === InterfaceCategory.CLIENT) {
      deviceName = this.getDeviceName(interfaceData, InterfaceCategory.CLIENT_INTERFACE_ID);
    } else {
      deviceName = this.getDeviceName(interfaceData, InterfaceCategory.SERVER_INTERFACE_ID);
    }
    return deviceName;
  }
  /**
    *
    *This life cycle hook is called when the component is destroyed
    *
    */
  ngOnDestroy(): void {
    this.areaSubscription.unsubscribe();
    this.removeWidthSubscription.unsubscribe();
  }
  /**
    *
    *Update interface ids
    *
    */
  private updateInterfaceIds(areaDetails: Area, mappedInterfaceIds: ISidePanel[], from: string) {
    if (from === InterfaceCategory.CLIENT) {
      areaDetails.clientInterfaceIds = mappedInterfaceIds;
    }
    else {

      areaDetails.serverInterfaceIds = mappedInterfaceIds;
    }
    return areaDetails;
  }


  /**
    *
    *Get interface ids
    *
    */
  private getInterfaceIds(interfaceData: ClientInterface) {
    const areaData = { ...this.facadeService.dataService.getArea(this.areaId) };
    if (this.from === InterfaceCategory.CLIENT) {
      return areaData?.clientInterfaceIds?.find(client => client.interfaceId === interfaceData.id);
    }
    return areaData?.serverInterfaceIds?.find(server => server.interfaceId === interfaceData.id);
  }

  /**
    *
    *Set side panel view type
    *
    */
  private setSidePanelViewType(headerLabel) {
    this.from = InterfaceCategory.SERVER;
    if (headerLabel === InterfaceCategory.CLIENT_INTERFACE) {
      this.facadeService.editorService.clientInterfaceGridViewType = this.viewType;
      this.from = InterfaceCategory.CLIENT;
    }
  }
  /**
    *
    *Set default grid message
    *
    */
  private setDefaultGridMessage() {
    this.interfaceArray[0] = this.interfaceLabel;
  }

  /**
    *
    *Build svg for side panels
    *
    */
  private buildSVGForSidePanel(from, interfaceData) {
    let svg = '';
    let isClient = false;
    if (from === InterfaceCategory.CLIENT) {
      const deviceName = this.getDeviceName(interfaceData, InterfaceCategory.CLIENT_INTERFACE_ID);
      svg = buildClientInterfacePanel(interfaceData, deviceName);
      isClient = true;
    } else {
      const deviceName = this.getDeviceName(interfaceData, InterfaceCategory.SERVER_INTERFACE_ID);
      svg = buildServerInterfacePanel(interfaceData, deviceName);
    }
    return { isClient, svg };
  }
  /**
    *
    *Update anchor
    *
    */
  private updateNodeAnchor(from, subConnector, nodeAnchor, clonedNode) {
    if (from === InterfaceCategory.CLIENT) {
      subConnector.inputAnchor.anchorElement = clonedNode.anchorElement;
      subConnector.inputAnchor.anchorScrim = clonedNode.anchorScrim;
      nodeAnchor = subConnector.inputAnchor;
      nodeAnchor.update();
    } else {
      subConnector.outputAnchor.anchorElement = clonedNode.anchorElement;
      subConnector.outputAnchor.anchorScrim = clonedNode.anchorScrim;
      nodeAnchor = subConnector.outputAnchor;
      nodeAnchor.update();
    }
    return nodeAnchor;
  }

  /**
    *
    *set default grid style
    *
    */
  private setDefaultGridStyle(nodeAnchor) {
    if (nodeAnchor.connectors.length === 1) {
      nodeAnchor.connectors[0].state = ConnectorState.Default;
      nodeAnchor.connectors[0].isConnected = false;
    }
    return nodeAnchor;
  }
/**
 * Reset Device Tree Panel (Left side) and
 * Client Interface Panel each time during
 * navigation to new area/Root
 */
  private resetPanelExposureData(){
    this.isDeviceTreePanelCollapsed = false;
  }
}

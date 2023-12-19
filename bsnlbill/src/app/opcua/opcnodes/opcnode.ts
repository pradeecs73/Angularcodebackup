/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { select,Selection} from '../../../app/vendors/d3.module';
import { FillingNode } from '../../store/filling-line/filling-line.reducer';
import { PanelDataType, PropertiesType } from '../../models/monitor.interface';
import { DeviceState, InterfaceCategory, FillingLineNodeType, AddressModelType } from '../../enum/enum';
import { ClientInterface } from '../../models/targetmodel.interface';
import { NodeAnchor } from './node-anchor';
import { HTMLNode, HTMLNodeService } from './htmlNode';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { opcNodeClasses } from '../../utility/constant';

//Automation component
export class OPCNode extends HTMLNode implements FillingNode {

  deviceId: string;

  deviceType: string;
  deviceName: string;
  address: string;
  state: DeviceState;
  adapterType: AddressModelType;
  type: FillingLineNodeType.NODE = FillingLineNodeType.NODE;

  constructor(deviceNode, fillingNodeData: FillingNode,protected readonly facadeService: FacadeService) {
    super(facadeService);
    this.element = deviceNode.node();
    this.node = deviceNode;
    this.updateFillingLineData(fillingNodeData);
    this.element.setAttribute('data-drag', `${this.id}:${this.dragType}`);
  }
  /*
  *
  * Update filling line data
  */
  updateFillingLineData(fillingNodeData: FillingNode | Partial<FillingNode>) {
    const data = { ...this, ...fillingNodeData };
    this.id = data.id;
    this.name = data.name;
    this.state = data.state;
    this.deviceName = data.deviceName;
    this.address = data.address;
    this.deviceId = data.deviceId;

    this.serverInterfaces = data.serverInterfaces;
    this.clientInterfaces = data.clientInterfaces;
    this.x = data.x;
    this.y = data.y;
    this.selected = data.selected;
    this.adapterType = data.adapterType;
    this.parent = data.parent;
  }
  /*
  *
  * Get panel data
  */
  getPanelData(data: ClientInterface, interfaceType: InterfaceCategory, deviceState: string,nodeType:FillingLineNodeType): PanelDataType {
    return {
      id: data.id,
      //nodeId : data.nodeId,
      name: data.name,
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      automationComponent: this.name,
      interfaceType: interfaceType,
      adapterType: this.adapterType,
      deviceState: deviceState,
      properties: data.properties as Array<PropertiesType>,
      type:nodeType
    };
  }
  /*
  *
  * Applies online style if the device is available or unavailable
  */
  public applyOnlineStyle() {
    if (this.state === DeviceState.AVAILABLE) {
      this.styleAvailableNode();
    }
    else {
      this.styleUnavailableNode();
    }
  }
  /*
  *
  *Applies offline style for AC
  */
  public applyOfflineStyle() {
    this.styleOfflineNode();
  }
  /*
  *
  * Style for offline node
  */
  styleOfflineNode() {
    if (this.element) {
      const parent1 = this.element.querySelector(opcNodeClasses.parentRectange);
      const deviceHeader = this.element.querySelector(opcNodeClasses.deviceHeader);
      this.styleOfflineNodeForParent(parent1);
      this.styleOfflineNodeForHeader(deviceHeader);
    }
  }
  /*
  *
  * Offline styling for the AC (other than header)
  */
  styleOfflineNodeForParent(parent1){
    if (parent1) {
      const rect1 = parent1.querySelector(opcNodeClasses.onlineClass) ||
      parent1.querySelector(opcNodeClasses.selectedClass) || parent1.querySelector(opcNodeClasses.classUnavailable);
      if (rect1 && rect1.classList) {
        rect1.classList.remove(opcNodeClasses.classSelected);
        rect1.classList.remove(opcNodeClasses.classOnline);
        rect1.classList.remove(opcNodeClasses.unavailableClass);
        rect1.classList.add('cls-2');
      }
    }
  }
  /*
  *
  * offline node styling for header
  */
  styleOfflineNodeForHeader(deviceHeader){
    if (deviceHeader) {
      const header = deviceHeader.querySelector(opcNodeClasses.headerBox);
      if (header && header.classList) {
        header.classList.remove(opcNodeClasses.nodeHeaderOnline);
        header.classList.remove(opcNodeClasses.nodeHeaderUnavailable);
        header.classList.add(opcNodeClasses.nodeHeaderOffline);
      }
      this.headerClassUpdate(deviceHeader, '.head-text');
      this.headerClassUpdate(deviceHeader, '.head-icon');
      this.headerClassUpdate(deviceHeader, '.head-sub-text');
      this.headerClassUpdate(deviceHeader, '.head-eclipses');

      this.hideClassUpdate(deviceHeader, opcNodeClasses.headStateIconAvailable);
      this.hideClassUpdate(deviceHeader, opcNodeClasses.headStateIconUnavailable);
    }

  }
  /*
  *
  * header class update
  */
  private headerClassUpdate(deviceHeader:Element,className:string){
    const headerTextIcon = deviceHeader.querySelector(className);
    if (headerTextIcon && headerTextIcon.classList) {
      headerTextIcon.classList.remove(opcNodeClasses.headOnline);
      headerTextIcon.classList.add(opcNodeClasses.headOffline);
    }
  }
  /*
  *
  * hide class update
  */
  private hideClassUpdate(deviceHeader: Element, className: string) {
    const deviceStateIcon = deviceHeader.querySelector(className);
    if (deviceStateIcon && deviceStateIcon.classList) {
      deviceStateIcon.classList.add('hide');
    }
  }

  /*
  *
  * Style for available node
  */
  styleAvailableNode() {
    if (this.element) {
      const parent1 = this.element.querySelector(opcNodeClasses.parentRectange);
      const deviceHeader = this.element.querySelector(opcNodeClasses.deviceHeader);
      if (parent1) {
        const rect1 = parent1.querySelector('.cls-2') || parent1.querySelector(opcNodeClasses.selectedClass) || parent1.querySelector(opcNodeClasses.classUnavailable);
        this.styleAvailableNodeRect(rect1);
        this.styleAvailableNodeHeader(deviceHeader);
        
      }
    }
  }
  /*
  *
  * style for available nodes
  */
  styleAvailableNodeRect(rect1){
    if (rect1 && rect1.classList) {
      rect1.classList.remove(opcNodeClasses.classSelected);
      rect1.classList.remove('cls-2');
      rect1.classList.remove(opcNodeClasses.unavailableClass);
      rect1.classList.add(opcNodeClasses.classOnline);
    }
  }
  /*
  *
  * style for available header
  */
  styleAvailableNodeHeader(deviceHeader){
    if (deviceHeader) {
      const header = deviceHeader.querySelector(opcNodeClasses.headerBox);
      if (header && header.classList) {
        header.classList.remove(opcNodeClasses.nodeHeaderOffline);
        header.classList.remove(opcNodeClasses.nodeHeaderUnavailable);
        header.classList.add(opcNodeClasses.nodeHeaderOnline);
      }

      this.styleOnlineNodeHeaderColor();
      this.removeDeviceStateUnavailableIcon(deviceHeader,opcNodeClasses.headStateIconAvailable);
      this.addDeviceStateUnavailableIcon(deviceHeader,opcNodeClasses.headStateIconUnavailable);
    }
  }
  /*
  *
  * style for unavailable node
  */
  styleUnavailableNode() {
    if (this.element) {
      const parent1 = this.element.querySelector(opcNodeClasses.parentRectange);
      const deviceHeader = this.element.querySelector(opcNodeClasses.deviceHeader);
      if (parent1) {
        const rect1 = parent1.querySelector('.cls-2') || parent1.querySelector(opcNodeClasses.selectedClass) || parent1.querySelector(opcNodeClasses.onlineClass);
        if (rect1 && rect1.classList) {
          rect1.classList.remove(opcNodeClasses.classSelected);
          rect1.classList.remove('cls-2');
          rect1.classList.remove(opcNodeClasses.classOnline);
          rect1.classList.add(opcNodeClasses.unavailableClass);
        }

        if (deviceHeader) {
          this.updateHeaderBoxClass(deviceHeader,opcNodeClasses.nodeHeaderUnavailable);
          this.styleOnlineNodeHeaderColor();
          this.removeDeviceStateUnavailableIcon(deviceHeader,opcNodeClasses.headStateIconUnavailable);
          this.addDeviceStateUnavailableIcon(deviceHeader,opcNodeClasses.headStateIconAvailable);

        }
      }
    }
  }
  /*
  *
  * style for unavailable header
  */
  private updateHeaderBoxClass(deviceHeader: Element,className:string) {
    const header = deviceHeader.querySelector(opcNodeClasses.headerBox);
    if (header && header.classList) {
      header.classList.remove(opcNodeClasses.nodeHeaderOffline);
      header.classList.remove(opcNodeClasses.nodeHeaderOnline);
      header.classList.add(className);
    }
  }
  /*
  *
  * Removes the icon
  */
  private removeDeviceStateUnavailableIcon(deviceHeader: Element,className:string) {
    const deviceStateUnavailableIcon = deviceHeader.querySelector(className);
    if (deviceStateUnavailableIcon && deviceStateUnavailableIcon.classList) {
      deviceStateUnavailableIcon.classList.remove('hide');
    }
  }
  /*
  *
  * add icon
  */
  private addDeviceStateUnavailableIcon(deviceHeader:Element,className:string) {
    const deviceStateAvailableIcon = deviceHeader.querySelector(className);
    if (deviceStateAvailableIcon && deviceStateAvailableIcon.classList) {
      deviceStateAvailableIcon.classList.add('hide');
    }
  }
  /*
  *
  * style the online node header
  */
  styleOnlineNodeHeaderColor() {
    const deviceHeader = this.element.querySelector(opcNodeClasses.deviceHeader);
    const headerText = deviceHeader.querySelector('.head-text');
    if (headerText && headerText.classList) {
      headerText.classList.remove(opcNodeClasses.headOffline);
      headerText.classList.add(opcNodeClasses.headOnline);
    }
    const headerIcon = deviceHeader.querySelector('.head-icon');
    if (headerIcon && headerIcon.classList) {
      headerIcon.classList.remove(opcNodeClasses.headOffline);
      headerIcon.classList.add(opcNodeClasses.headOnline);
    }
    const headerSubText = deviceHeader.querySelector('.head-sub-text');
    if (headerSubText && headerSubText.classList) {
      headerSubText.classList.remove(opcNodeClasses.headOffline);
      headerSubText.classList.add(opcNodeClasses.headOnline);
    }
    const headerEllipses = deviceHeader.querySelector('.head-eclipses');
    if (headerEllipses && headerEllipses.classList) {
      headerEllipses.classList.remove(opcNodeClasses.headOffline);
      headerEllipses.classList.add(opcNodeClasses.headOnline);
    }
  }
  /*
  *
  * returns all the anchors nodes
  */
  getAllAnchorNodes(): Array<NodeAnchor> {
    return this.inputs?.concat(this.outputs);
  }
}

@Injectable({
  providedIn: 'root'
})
export class OPCNodeService extends HTMLNodeService {
  constructor(
    protected readonly facadeService: FacadeService) {
    super(facadeService);
  }
  /*
  *
  * create opc node
  */
  createOPCNode(deviceNode: Selection<SVGGElement, unknown, null, undefined>, nodeObj: FillingNode) {
    const node = new OPCNode(deviceNode, nodeObj,this.facadeService);
    if (node.selected === true) {
      this.facadeService.editorService.selectedNode = node;
    }
    //Client Interfaces
    node.inputs = this.addAnchors(node, true);
    node.outputs = this.addAnchors(node, false);
    this.assignInterfaceClickEvent(node);
    this.facadeService.editorService.addHTMLNode(node);
    this.updateAreaElement(node);
  }
  /*
  *
  * When the interface is clicked inside AC
  */
  assignInterfaceClickEvent(node: OPCNode) {
    node.inputs.forEach((anchor: NodeAnchor) => {
      this.onSubNodeClick(node, anchor.interfaceData);
      return anchor;
    });
    node.outputs.forEach((anchor: NodeAnchor) => {
      this.onSubNodeClick(node, anchor.interfaceData);
      return anchor;
    });
  }
  /*
  *
  * Update area element
  */
  updateAreaElement(node: OPCNode) {
    super.updateAreaElement(node as HTMLNode);
    this.facadeService.fillingLineService.updateNode(node.id, { element: node.element });
  }
  /*
  *
  * Update state
  */
  updateState(node: OPCNode, state: DeviceState) {
    node.updateFillingLineData({ state: state });
    this.facadeService.fillingLineService.updateNode(node.id, { state: state });
  }
  /*
  *
  * Update node move data
  */
  updateNodeMoveData(node: OPCNode, _interfaceDetails?) {
    super.updateNodeMoveData(node);
    this.facadeService.fillingLineService.updateNode(node.id, { x: node.x, y: node.y });
    this.facadeService.dataService.updateNode(node);
  }
  /*
  *
  * when the subconnection node is clicked
  */
  onSubNodeClick(node: OPCNode, subNodeData: ClientInterface) {
    // log(subNodeData)
    const subNode = select(node.element).select('#box-' + subNodeData.id);
    subNode.on('click', () => {
      let interfaceType = InterfaceCategory.SERVER_INTERFACE;
      if (subNodeData.connectionEndPointDetails) {
        interfaceType = InterfaceCategory.CLIENT_INTERFACE;
      }
      const devicestate= this.facadeService.dataService.getDeviceState(node.deviceId);
      const interfaceProperties: PanelDataType = node.getPanelData(
       subNodeData,
       interfaceType,
       devicestate,
       FillingLineNodeType.NODE
      );
      this.facadeService.commonService.changePanelData(interfaceProperties);
      this.facadeService.editorService.emptySelectedConnection();
    });
  }
}


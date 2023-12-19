/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../../../models/targetmodel.interface';
import { DeviceTreeState } from '../../../store/device-tree/device-tree.reducer';
import { isNullOrEmpty, isNullOrUnDefined, log } from '../../../utility/utility';
import { Numeric } from '../../../enum/enum';
import { Area, Node } from '../../../models/models';
import { FacadeService } from '../../services/facade.service';

@Component({
  selector: 'app-device-tree-right-sidebar',
  templateUrl: './device-tree.component.html',
  styleUrls: ['./device-tree.component.scss']
})
export class DeviceRightbarComponent implements OnInit {

  deviceTree: Observable<DeviceTreeState>;
  key: string;
  opcAddress: string;
  openAddDeviceDialog: boolean;
  devices: Device[];
  overlayContent: string;
  overlaySpinnerMessage: string;

  constructor(
    private readonly facadeService: FacadeService) {
    this.openAddDeviceDialog = false;
  }


  ngOnInit() {
    this.key = 'children';
    this.deviceTree = this.facadeService.deviceStoreService.getDeviceTree();
    this.subscribeToDeviceTree();
  }


  /**
   * 
   * Toggles the expansion state of the device
   * @param deviceName : Name of the device to which expansion/ collapse get performed
   */
  public toggleExpandState(deviceName: string): void {
    if (!isNullOrUnDefined(document)) {
      //remove DOM manipulation
      const collapsableElements = document.getElementsByClassName('collapsible');
      Array.from(collapsableElements).forEach(item => {
        if (this.isDeviceMatched(item, deviceName)) {
          this.toggleElement(item);
        }
      });
    }
  }

  /**
   * 
   * Verifies whether the device is eligible for expand to show its automation components
   * @param deviceName : Name of the device to which expansion/ collapse get performed
   * @returns : true: If the device is collapsed and eligible for expansion
   * @returns : false: If the device is already expanded
   */
  public isEligibleToExpand(deviceName: string): boolean {
    let result = false;

    if (!isNullOrUnDefined(document)) {
      //remove DOM manipulation
      const collapsableElements = document.getElementsByClassName('collapsible');
      Array.from(collapsableElements).forEach(element => {
        if (this.isDeviceMatched(element, deviceName) && this.isCollapsed(element)) {
          result = true;
        }
      });
    }
    return result;
  }

  /**
   * 
   * Toggles the node value of an element
   * @param element : HTML element on which the toggle operation gets performed
   */
  private toggleElement(element: Element): void {

    if (!isNullOrUnDefined(element) && !isNullOrUnDefined(element.childNodes) && element.childNodes.length > 0 && !isNullOrEmpty(element.childNodes[0].nodeValue)) {
      const elementDevice = element.childNodes[0].nodeValue.trim();

      if (elementDevice === '-') {
        element.childNodes[0].nodeValue = '+ ';
      }
      else if (elementDevice === '+') {
        element.childNodes[0].nodeValue = '- ';
      }
      else {
        log('Device element found could not be toggled');
      }
    }
  }

  /**
   * Verify whether the device element matches with the device name
   * @param element : Device element
   * @param deviceName : Name of the device
   * @returns : true: If device element matches with the device name
   * @returns : false: If the device element does not match with the device element
   */
  private isDeviceMatched(element: Element, deviceName: string): boolean {
    let result = false;

    if (!isNullOrUnDefined(element) && !isNullOrUnDefined(element.childNodes)
      && element.childNodes.length > Numeric.TWO && !isNullOrEmpty(element.childNodes[Numeric.TWO].nodeValue)) {
      const elementDevice = element.childNodes[Numeric.THREE].textContent.trim();
      if (elementDevice === deviceName) {
        result = true;
      }
    }
    return result;
  }

  /**
   * Verifies whether the selected element is collapsed or not
   * @param element : element to which the collapsed state has to be verified
   * @returns : true: If the element is collapsed
   * @returns : false: If the element is not collapsed
   */
  private isCollapsed(element: Element): boolean {
    let result = false;

    if (!isNullOrUnDefined(element) && !isNullOrUnDefined(element.childNodes) && element.childNodes.length > 0 && !isNullOrEmpty(element.childNodes[0].nodeValue)) {
      const elementDevice = element.childNodes[0].nodeValue.trim();
      if (elementDevice === '-') {
        result = true;
      }
    }
    return result;
  }
  /*
  *
  * Subscribe to device tree changes
  */ 
  private subscribeToDeviceTree() {
    this.deviceTree.subscribe(data => {
      if (data.deviceGroup) {
        /*
        *
        * loader should only stop if its a new project and the data.deviceGroup.devices is empty
        * 
        */
        if (!this.facadeService.commonService.isExistingProjectLoading) {
          this.facadeService.overlayService.changeOverlayState(false);
        }
        /**
         * deviceGroup.devices may come as undefined or null when user have saved a blank project from the project view withour any device list
         */
        if (data.deviceGroup.devices && data.deviceGroup.devices != null) {
          this.devices = data.deviceGroup.devices;
          this.facadeService.saveService.devices = this.devices;
          this.loadFillingLineStore(this.devices);
          this.facadeService.overlayService.changeOverlayState(false);
        }
      }
      else {
        return;
      }
    });
  }

 /**
  * load filling line store
  * 
  * 
  */
  loadFillingLineStore(devices: Array<Device>) {
    const nodes = this.facadeService.dataService.getAllNodes();
    this.loadFillingNode(devices, nodes);
    this.loadFillingArea();
  }
/**
  * load filling line node
  * 
  */
  loadFillingNode(devices: Array<Device>, nodes: Array<Node>) {
    if (nodes) {
      const nodeList = [];
      for (const node of nodes) {
        const deviceData = devices.find(d => d.uid === node.deviceId);
        const acData = deviceData?.automationComponents.find(d => d.deviceId === node.deviceId && d.id === node.id);

        if (deviceData && acData) {
          const fillingNode = this.facadeService.fillingLineService.getFillingNodeData(node.x, node.y, acData, node.parent, deviceData.adapterType);
          nodeList.push(fillingNode);
        }
      }
      this.facadeService.fillingLineService.createNodeList(nodeList);
    }
  }
  /**
  * Calculate the area number when a new area is created
  *
  */
  calculateAreaNumber(areas: Area[]) {
    return areas.reduce((grater, area) => {
      const areaNum = Number(area.name.split(' ')[1]);
      if(grater < areaNum ) {
        grater = areaNum;
      }
      return grater;
    }, 0);
  }
  /**
  *load filling area
  */
  loadFillingArea() {
    const areas = this.facadeService.dataService.getAllAreas();
    if (areas) {
      const areaList = [];
      const areaNumber = this.calculateAreaNumber(areas);
      this.facadeService.editorService.setNextAreaNumber(areaNumber + 1);
      for (const area of areas) {
        const fillingArea = this.facadeService.fillingLineService.getFillingAreaData(area, area.parent);
        areaList.push(fillingArea);
      }
      this.facadeService.fillingLineService.createAreaList(areaList);
    }
    else {
      this.facadeService.editorService.setNextAreaNumber(1);
    }
  }

}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { distinctUntilChanged } from 'rxjs/operators';
import { AdapterMethods, MONITORTYPE, numConstants, PropertyPanelType } from '../../../enum/enum';
import {
  AttributeData,
  MonitorNode,
  MonitorObservable,
  MonitorPayload,
  PanelDataType,
  PropertiesType,
  PropertyPanelTableColumn
} from '../../../models/monitor.interface';
import { Device } from '../../../models/targetmodel.interface';
import { DataAdapterManagers } from '../../../opcua/adapter/adapter-manager';
import { BrowseAdapter } from '../../../opcua/adapter/base-adapter/browse-adapter';
import { MonitorAdapter } from '../../../opcua/adapter/base-adapter/monitor-adapter';
import { getDeviceInterfaceName, getTagEventName } from '../../../utility/utility';
import { FacadeService } from '../../services/facade.service';


@Component({
  selector: 'app-node-properties-panel',
  templateUrl: './node-properties-panel.component.html',
  styleUrls: ['./node-properties-panel.component.scss']
})
export class NodePropertiesPanelComponent implements OnInit, OnDestroy {
 /**
   *
   *  Variables are declared here
   */
  innerHeightInterface = numConstants.NUM_300;
  panelData: PanelDataType;
  attributeData: Map<string, AttributeData>;
  deviceId: string;
  automationComponent: string;
  interfaceId: string;
  interfaceName: string;
  cols: PropertyPanelTableColumn[] = [];
  treeData = [];
  private browseService: BrowseAdapter;
  private monitor: MonitorAdapter;
  private readonly subscriptions = new Subscription();
  public propertyPanelType = PropertyPanelType.INTERFACE;
  dataTypeMap = new Map();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    public readonly injector: Injector,
    public facadeService: FacadeService
  ) {
  }

  /**
   *
   * Getter method to check if the device is unavailable
   * @readonly
   * @type {boolean}
   * @memberof NodePropertiesPanelComponent
   */
  get showDeviceUnavailable(): boolean {
    return this.facadeService.applicationStateService.showDeviceUnavailable(this.panelData);
  }

  ngOnInit() {
    this.initializeDataTypesMap();
    /**
      *
      * Columns for table
      */
    this.cols = [
      { field: 'name', header: this.facadeService.translateService.instant('devices.titles.property') },
      { field: 'type', header: this.facadeService.translateService.instant('devices.titles.dataType') },
      { field: 'value', header: this.facadeService.translateService.instant('devices.titles.value') }
    ];
    this.subscriptions.add(
      this.facadeService.commonService.monitorPanelData.pipe(

        distinctUntilChanged((a, b) =>  JSON.stringify(a) === JSON.stringify(b))
      ).subscribe((data: PanelDataType) => {
        /* If monitorPanelData is present then create the treeData for the
            Accordion */
        if (data) {
          this.browseService = this.injector.get(DataAdapterManagers.getadapter(data.adapterType, AdapterMethods.BROWSE));
          this.monitor = this.injector.get(DataAdapterManagers.getadapter(data.adapterType, AdapterMethods.MONITOR));
          this.panelData = { ...data };
          this.interfaceId = this.panelData.id;
          this.deviceId = this.panelData.deviceId.split('_')[0];
          this.automationComponent = data.automationComponent;
          this.interfaceName = data.name;
          // get interface information
          this.attributeData = new Map<string, AttributeData>();
          this.treeData = this.panelData.properties;
          this.setAttributeData(this.createCopy(this.panelData.properties));
          //register params for monitoring
          //this.registerTagsForMonitoring(data);
          this.registerTagsForMonitoring();
          this.deviceStateChange();
          this.treeData = this.browseService.createPanelTreeData(this.treeData);
          this.treeData.forEach(tree => {
            const rootParentName = tree.name;
            tree.children = this.setRootParentProp(tree.children, rootParentName);
          });
          this.facadeService.commonService.updatePropertyState(this.treeData, this.propertyPanelType);
          this.cdr.markForCheck();
        } else {
          /*
          *When it is deselected ,clear the tree data and panelData
          *Can make the UI ,No Interface selected
          */
          this.treeData = null;
          this.panelData = null;
        }
      }));
  }

  /**
   * Format the monitor panel data based on the type for
   * tag monitoring
   * @param treeData
   * @returns updated tree data
   */
  formatDataBasedOnDataTypes(treeData) {
    if (treeData) {
      treeData.forEach(element => {
        if (element && element.children) {
          element.children.map(monitorData => {
            this.callCorrespondingDataTypeFormatter(monitorData);
          });
        }
      });

      return treeData;
    }
    return treeData;
  }

  /**
   * Formats the monitor data based on data type
   * @param monitorData
   * @returns
   */
  callCorrespondingDataTypeFormatter(monitorData) {
    if (monitorData && this.dataTypeMap.has(monitorData.type)) {
      const formattingMethod = this.dataTypeMap.get(monitorData.type);
      monitorData.value = this[formattingMethod](monitorData.value);
    }
    return monitorData;
  }

  /**
   * Initialize the data types for formatting ,
   * set is used to remove the complexity due to switch case
   */
  initializeDataTypesMap() {
    this.dataTypeMap.set('Int64', 'convertMonitorInt64ToString');
    this.dataTypeMap.set('UInt64', 'convertMonitorInt64ToString');
  }

  /**
   * format by taking the array and takes the first index
   * @param stringToBeFormatted
   * @returns
   */
  convertMonitorInt64ToString(stringToBeFormatted: number[]) {
    if (stringToBeFormatted && Array.isArray(stringToBeFormatted)) {
      return stringToBeFormatted[1];
    }
    return stringToBeFormatted;
  }

  /**
   * Translate the client interface and server interface based on language
   * @param interfaceType
   * @returns
   */
  translateName(interfaceType: string) {
    if (interfaceType === 'Client Interface') {
      return this.facadeService.translateService.instant('editor.titles.clientInterface');
    } else {
      return this.facadeService.translateService.instant('editor.titles.serverInterface');
    }
  }

  /**
   * setting 1st level parent property for identification of hierarchy
   * @param treeData
   * @param rootParent
   * @returns
   */
  setRootParentProp(treeData, rootParent: string) {
    return treeData.map(item => {
      item.rootParent = rootParent;
      if (item && item.hasOwnProperty('children')) {
        item.children = this.setRootParentProp(item['children'], rootParent);
      }
      return item;
    });
  }

  /**
   *Listen to device state changes
  */
  deviceStateChange() {
    this.subscriptions.add(this.facadeService.commonService.deviceStateData.subscribe((data: Device) => {
      if (data.uid === this.panelData?.deviceId) {
        this.facadeService.commonService.changePanelData(this.panelData);
        this.panelData.deviceState = data.state;
      }
    }));
  }
  /**
   * To create a copy of node
   * @param data monitoring property type
   * @returns
   */
  createCopy(data: Array<PropertiesType>): Array<PropertiesType> {
    return data.map(d => {
      let children = null;
      if (d.children) {
        children = d.children;
      }
      return {
        name: d.name,
        //nodeId: d.nodeId,
        value: d.value,
        type: d.type,
        children: children
      };
    });
  }

  /**
    *
    * Register tags for monitoring
    */
  registerTagsForMonitoring() {
    const monitorItem: MonitorPayload = this.getMonitorItem();
    if (this.facadeService.commonService.isOnline) {
      this.setAllTagsChangeListeners();
      const isTagValueExists = this.doesMonitorMapContainsTagValue();
      if (!isTagValueExists) {
        this.subscriptions.add(this.monitor.monitorTags(monitorItem).subscribe(_data => true));
      }
    }
  }
  /**
    *
    * get tag event map
    */
  private getTagEventMap(): Map<string, MonitorObservable> {
    return this.monitor.tagMonitorObseravablesMap.get(getDeviceInterfaceName(this.deviceId, this.automationComponent, this.interfaceId));
  }
  /**
    *
    * set tag value based on tag event map value
    */
  private setTagValueBasedOnTagEventMapValue(event: string, tagEventMap: Map<string, MonitorObservable>) {
    this.setTagValue(event, tagEventMap.get(event).value);
    tagEventMap.get(event).event.subscribe(value => this.setTagValue(event, value));
  }
  /**
   * checks if monitor map contains tag value
   * @returns true if tag value exists
   */
  doesMonitorMapContainsTagValue(): boolean {
    let isTagValueExists = false;
    const tagEventMap = this.getTagEventMap();
    if (tagEventMap) {
      for (const event of tagEventMap?.keys()) {
        if (tagEventMap.get(event).value) {
          this.setTagValueBasedOnTagEventMapValue(event, tagEventMap);
          isTagValueExists = true;
        } else {
          isTagValueExists = false;
          break;
        }
      }
    }
    return isTagValueExists;
  }


  /**
   * Fetches Tag monitor map per device Id and Interface name from Monitor Service
   */
  public getMonitorItem(): MonitorPayload {
    let tagMonitorItem: MonitorPayload = this.monitor.getTagMonitorItems(this.deviceId, this.automationComponent, this.interfaceId);
    if (!tagMonitorItem) {
      const nodeList: Array<MonitorNode> = this.getMonitorNodeList(this.treeData);
      /*Sets Tag monitor map*/
      this.monitor.setTagMonitorItems(this.deviceId, this.automationComponent, this.interfaceId, this.interfaceName, nodeList, MONITORTYPE.TAG);
      tagMonitorItem = this.monitor.getTagMonitorItems(this.deviceId, this.automationComponent, this.interfaceId);
    }
    return tagMonitorItem;
  }

  /**
   * Creates Monitor Param(node) List,sets tag event observable and its listener in Monitor Service
   * @param attributeList
   */
  private getMonitorNodeList(attributeList): Array<MonitorNode> {
    const monitorNodeList: Array<MonitorNode> = [];
    attributeList.forEach(item => {
      const eventName = item.eventName;
      monitorNodeList.push({ eventName: eventName, propertyName: item.name });
      /* Sets monitor tag observable for a node in Monitor Service Map*/
      this.monitor.setTagObservable(this.deviceId, this.automationComponent, this.interfaceId, eventName);
      /* Add listeners on the tag Event Socket IO call of node From Server*/
      this.monitor.setTagChangeListener(this.deviceId, this.automationComponent, this.interfaceId, eventName);
    });
    return monitorNodeList;
  }

  /**
   * Set Attribute Data
   * @param eventName Tag Event Name
   * @param value Value
   */
  setTagValue(eventName: string, value: number | string | unknown) {
    if (this.treeData) {
      this.treeData = this.monitor.setTagValueFromMonitor(eventName, value, this.treeData);
      this.treeData = this.formatDataBasedOnDataTypes(this.treeData);
      this.treeData.forEach(item => {
        item.children = this.browseService.createPanelTreeData(item.children);
      }
      );
      this.cdr.markForCheck();
    }
  }


  /**
   * set change listeners for all the tags
   */
  setAllTagsChangeListeners() {
    const tagEventMap = this.getTagEventMap();
    for (const event of tagEventMap?.keys()) {
      this.setTagValueBasedOnTagEventMapValue(event, tagEventMap);
    }
  }

  /**
   *  Add a new property eventName,which can be used as a unique key for
   * monitoring of the selected interface
   * @param treeData
   * @returns
   */
  setEventData(treeData) {
    return treeData.map(item => {
      item = JSON.parse(JSON.stringify(item));
      const eventName = getTagEventName(this.deviceId, this.automationComponent, this.panelData.id, item.name);
      item['eventName'] = eventName;
      if (item && item.hasOwnProperty('children')) {
        item.children = this.setEventData(item['children']);
      }
      return item;
    });
  }

  /**
   * form a new array attributeData after every subscribe
   * @param properties
   */
  setAttributeData(properties: Array<PropertiesType>) {
    this.treeData = this.setEventData(properties);
  }

  /**
   * Unsubscribe from subscription
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}




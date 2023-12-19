/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */
import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';

import { InterfaceCategory, PanelProperties, PropertyPanelType } from '../../../enum/enum';
import { PropertyPanelTableColumn, TreeData } from '../../../models/monitor.interface';
import { CONNECTIONLISTROWID } from '../../../utility/constant';
import { FacadeService } from '../../services/facade.service';

@Component({
 selector: 'app-properties-panel',
 templateUrl: './properties-panel.component.html',
 styleUrls: ['./properties-panel.component.scss']
})
export class PropertiesPanelComponent implements OnInit {
    /*
  *
  *  Variables are declared here
  */
 @Input()
 treeData: TreeData[] = [];
 readonly CONNECTIONLISTROWID = CONNECTIONLISTROWID;
 @Input()
 showDeviceUnavailable: boolean;
 @Input()
 cols: PropertyPanelTableColumn[];
 @Input()
 innerHeightInterface: number;
 @Input() panelType: string;
 innerWidth: number;
 innerHeight: number;
 @Input() accordionIndex = [];

 constructor(private readonly common: CommonService,private readonly facadeService: FacadeService) {}

/*
  *
  * life cycle hook when the component initializes
  */
 ngOnInit() {
  this.setInnerWidthHeightParameters();
 }
/*
  *
  * expand and collapse accordion
  *
  */
   expandAndCollapseAccordion(event, expanded: boolean) {
      switch (this.panelType) {
         case PropertyPanelType.CONNECTION:
            const eventName = this.treeData[0].name.trim();
            const isClient = eventName.toLowerCase().startsWith(InterfaceCategory.CLIENT);
            let indexType: 'clientIndex' | 'serverIndex' = 'serverIndex';
            if (isClient) {
               indexType = 'clientIndex';
            }
            if (expanded) {
               this.common.connectionPropertyAccordion[indexType].push(event.index);
            } else {
               this.common.connectionPropertyAccordion[indexType] = this.common.connectionPropertyAccordion[indexType].filter(el => el !== event.index);
            }
            this.accordionIndex = this.common.connectionPropertyAccordion[indexType];
            break;
         case PropertyPanelType.INTERFACE:
            if (expanded) {
               this.common.interfacePropertyAccordion.push(event.index);
            } else {
               this.common.interfacePropertyAccordion = this.common.interfacePropertyAccordion.filter(el => el !== event.index);
            }
            this.accordionIndex = this.common.interfacePropertyAccordion;
            break;
         default:
            break;
      }
   }
   /*
  *
  * update property panel state
  *
  */
   updatePropertyPanelState(node, parentName) {
      let panelState = this.getPanelState();
      if (panelState.length > 0) {
         const index = panelState.findIndex(el => el.name === node.name && el.parent === parentName);
         if (index === -1) {
            panelState.push({
               name: node.name,
               isExpanded: node.expanded,
               parent: parentName
            });
         } else {
            panelState[index].isExpanded = node.expanded;
         }
      } else {
         panelState = [{
            name: node.name,
            isExpanded: node.expanded,
            parent: parentName
         }];
      }
      this.setPanelState(panelState);
   }
   /*
  *
  * when the node collapse
  */
   onNodeCollapse(e, parentName) {
      this.updatePropertyPanelState(e.node, parentName);

   }
   /*
  *
  * when node expanded
  */
   onNodeExpand(e, parentName) {
      this.updatePropertyPanelState(e.node, parentName);
   }
   /*
  *
  * Get panel state
  */
   getPanelState() {
      let state = [];
      if (this.panelType === PropertyPanelType.CONNECTION) {
         state = this.common.connectionPropertyState;
      }
      if (this.panelType === PropertyPanelType.INTERFACE) {
         state = this.common.interfacePropertyState;
      }
      return state;
   }
   /*
  *
  * set panel state
  */
   setPanelState(state) {
      if (this.panelType === PropertyPanelType.CONNECTION) {
         this.common.connectionPropertyState = state;
      }
      if (this.panelType === PropertyPanelType.INTERFACE) {
         this.common.interfacePropertyState = state;
      }
   }
/*
  *
  * Set inner width height parameters
  */
 setInnerWidthHeightParameters() {
  this.innerWidth = window.innerWidth;
  if (this.innerHeightInterface) {
   this.innerHeight = this.innerHeightInterface;
  } else {
   this.innerHeight = window.innerHeight * PanelProperties.PANEL_INNER_HEIGHT;
  }
 }
}

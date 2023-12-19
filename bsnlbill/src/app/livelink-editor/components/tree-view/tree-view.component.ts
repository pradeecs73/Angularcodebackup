/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import interact from 'interactjs';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import { accessControl, DragDropAttribute, Numeric } from '../../../enum/enum';
import { AutomationComponent } from '../../../models/targetmodel.interface';
import { FacadeService } from '../../services/facade.service';

@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements AfterViewInit {
  /*
  * Editor page :Tree structure in left side panel
  *
  */
  @Input('data') automationComponent: AutomationComponent;
  @Input('key') key: string;
  @Input('isRoot') isRoot: string;
  @Input() adapterType: string;
  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;

  @Output() mousedown = new EventEmitter();
  isShow = false;
  showCInf = false;
  showSInf = false;
  currentLevel: number;
  constructor(private readonly facadeService: FacadeService) { }
  /*
  * This life cycle hook is called once the component's view is initialized
  *
  */
  ngAfterViewInit(): void {
    if (this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_REORDER_AREA_NODE)) {
      this.facadeService.applicationStateService.dragNode();
    } else {
       /*
      *  To remove an Interactable ,should remove all event listeners and make interact.js forget completely about the target
      *
      */
      interact(DragDropAttribute.TREEROOT).unset();
    }
  }
  /*
  * Get the access control read or write access for the user 
  */
  get accessControl() {
    return accessControl; 
}


  setInputOutput(node, leafs) {
    const mid = Math.floor(leafs.length / Numeric.TWO);
    /*
     * slice includes inbound excludes outbound
    */
    node.input = leafs.slice(0, mid + 1);
    node.output = leafs.slice(mid + 1, leafs.length + 1);
  }
 /*
     * Set the objects for menuitems in the left side panel
    */
  assignObject($event, data:AutomationComponent) {
    $event.cancelBubble = true;
    $event.stopPropagation();
    if (this.isRoot === 'true') {
      this.facadeService.dragdropService.selectedData = { adapterType:this.adapterType, automationComponent: data };
    } else {
      return ;
    }
    this.mousedown.next(data);
  }
  /*
     *end class
    */
}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import {
  AfterViewInit, Component, EventEmitter, HostListener, OnDestroy,
  OnInit, Output, ViewEncapsulation
} from '@angular/core';
import { EntityState } from '@ngrx/entity';
import { TreeDragDropService, TreeNode } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { FillingLineNodeType, NodeAttributes, numConstants, TreePanel } from '../../../enum/enum';
import { AreaUtilityService } from '../../../services/area-utility.service';
import { validateRegex } from '../../../shared/services/validators.service';
import { FillingArea, FillingLineState, FillingNode } from '../../../store/filling-line/filling-line.reducer';
import { ROOT_EDITOR } from '../../../utility/constant';
import { log } from '../../../utility/utility';
import { FacadeService } from '../../services/facade.service';


@Component({
  selector: 'app-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.scss'],
  providers: [TreeDragDropService],
  encapsulation: ViewEncapsulation.None,
})
export class MenuViewComponent implements OnInit, OnDestroy, AfterViewInit {

  items: TreeNode[];
  viewType = 'full';
  fillingLine: Observable<FillingLineState>;
  fillingLineSubscription: Subscription;
  entities: EntityState<FillingNode | FillingArea>;
  @Output() removeElementWidth = new EventEmitter();
  selectedAreaId = { id: ROOT_EDITOR, name: '' };
  selectedItems: TreeNode[];
  nestedAreas:TreeNode[];
  editorYCoordinate=[];

  private readonly areaUtilityService: AreaUtilityService;

  constructor(
    private readonly facadeService: FacadeService ) {
      this.areaUtilityService = facadeService.areaUtilityService;
  }

  ngOnInit() {
    /*
    *
    * Sets the tree structue in left side panel of editor page
    */
    this.items = [{
      label: this.facadeService.dataService.getProjectName(),
      icon: 'fas fa-cube',
      expanded: true,
      type: FillingLineNodeType.HEADER,
      children: [],
      droppable: true,
      key: ROOT_EDITOR
    }];
    this.fillingLine = this.facadeService.fillingLineService.getFillingLine();

    this.fillingLineSubscription = this.fillingLine.subscribe(deviceEntities => {
      this.entities = deviceEntities;
      this.areaUtilityService.fillingLineData = deviceEntities;
    });
  }
  /*
  *
  * Initiates droping to left side panel
  * Initiates dragging from left  side panel
  */
  ngAfterViewInit(): void {
    this.facadeService.applicationStateService.dropNodeToTree();
    this.facadeService.applicationStateService.dragFromTreeMenu();
  }
  /*
  *
  * When the left side panel is collapsed/expanded
  */
  removeWidth(mode) {
    this.viewType = mode;
    const emitObj = { mode: mode, position: 'left' };
    this.removeElementWidth.emit(emitObj);
  }

  /*
  *
  *stop events trigger from menu view
  */

  stopEventsTriggerFromMenuView(event): void {
    if (event.target.classList.contains(TreePanel.MENU_VIEW_FULL)) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  /*
  *
  * unsubscribe from filling line
  */
  ngOnDestroy(): void {
    this.fillingLineSubscription.unsubscribe();
  }
  /*
  *
  * Prevents the default action
  */
  preventDefault(event) {
    if (event.detail === numConstants.NUM_2) {
      event.stopPropagation();
      event.target.classList.add('outline');
    }
  }
  /*
  *
  *  updates the area
  */
  updateAreaName(event) {
    event.target.classList.remove('outline');
    this.facadeService.plantAreaService.updateArea(event.areaId,{ name: event.target.value });
  }
  /*
  *
  * click handler
  */
  clickHandler(selectedNodeId: string) {
    this.facadeService.editorService.deselectAllNodes();
    this.facadeService.fillingLineService.selectDevice(selectedNodeId);
  }
  /*
  *
  * click inside
  */
  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  @HostListener('document:click', ['$event']) clickedOutside(event) {
    const target = event.target || event.srcElement || event.currentTarget;
    const isSVG = new RegExp(/^(circle|clipPath|defs|ellipse|g|line|linearGradient|mask|path|pattern|polygon|polyline|radialGradient|rect|stop|svg|text|tspan)$/g);
    const isTargetSVG = validateRegex(isSVG, target.nodeName);

    if (!isTargetSVG) {
      this.facadeService.editorService.deselectAllNodes();
      return;
    }
    this.handleClickoutside(target);

  }

  handleClickoutside(target){
    if (target.className === NodeAttributes.DEVICENODE) {
      log('This is the actual target', target);
    } else {
      const parentsArray = this.searchParentSVGElement(target, undefined);
      if (!parentsArray) {
        this.facadeService.editorService.deselectAllNodes();
        return;
      }
      for (const item of parentsArray) {
        if (item.classList.value === NodeAttributes.DEVICENODE) {
          log('FOUND THE TARGET');
        } else if (item.classList.value === 'root') {
          this.facadeService.editorService.deselectAllNodes();
          // de-select connection line
          this.facadeService.editorService.deselectAllConnectors();
          this.facadeService.editorService.resetMultiSelectedSubConnection();
          // reset panel data
          this.facadeService.commonService.changePanelData(null);
          // reset selected connection
          this.facadeService.editorService.setSelectedConnection(null);
          this.facadeService.editorService.selectedConnection = null;
          // reset multi selection connection on click outside
          this.facadeService.editorService.resetMultiSelectedConnection();
        }
        else {
          return;
        }
      }
    }
  }
  /*
  *
  * search parent svg element
  */
  searchParentSVGElement(element, parentArray) {
    if (parentArray === undefined) {
      parentArray = [];
    } else {
      parentArray.push(element);
    }

    if (element && element.tagName !== 'g' && (element?.className?.baseval !== NodeAttributes.DEVICENODE
      || element?.className?.baseval === undefined)) {
      return this.searchParentSVGElement(element?.parentNode, parentArray);
    }
    return parentArray;

  }
  /*
  *
  *  When save project option is clicked
  */
  saveProject() {
    this.facadeService.applicationStateService.saveProject();
  }

  /*
  *
  * loops through the areas in recursive way
  */
  recurseNestedArea(node){
    node.forEach(treeNode => {
      if (treeNode.type === FillingLineNodeType.AREA) {
        this.nestedAreas.push(treeNode);
      }
      if(treeNode?.children?.length > 0 ){
        this.recurseNestedArea(treeNode.children);
      }
    });
  }

}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef, Component, ElementRef,
    EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { EntityState } from '@ngrx/entity';

import { TreeDragDropService, TreeNode } from 'primeng/api';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { accessControl, DragDropAttribute, FillingLineNodeType, numConstants, Numeric, TreePanel } from '../../../enum/enum';
import { UpdateAreaInterface } from '../../../models/targetmodel.interface';
import { AreaUtilityService } from '../../../services/area-utility.service';
import { FillingArea, FillingNode } from '../../../store/filling-line/filling-line.reducer';
import { ROOT_EDITOR } from '../../../utility/constant';
import { FacadeService } from '../../services/facade.service';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';

@Component({
    selector: 'app-tree-menu',
    templateUrl: './tree-menu.component.html',
    styleUrls: ['./tree-menu.component.scss'],
    providers: [TreeDragDropService],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TreeMenuComponent implements OnChanges, OnDestroy {
    /*
    * Variables are declared here
    *
    */
    items: TreeNode[];
    selectedItems: TreeNode[] = [];
    scrollHeight: string = (window.innerHeight - Numeric.NINETY).toString() + 'px';
    defaultRootHighlight = true;
    resizeWindowObservable$: Observable<Event>;
    resizeWindowSubscription$: Subscription;

    @Input() deviceEntities: EntityState<FillingNode | FillingArea>;
    @Output() onDrop = new EventEmitter();
    @Output() nodeSelected = new EventEmitter<TreeNode[]>();
    @Output() renameArea = new EventEmitter<UpdateAreaInterface>();
    @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;
    /*
    * Returns the root editor
    */
    public get root() {
        return ROOT_EDITOR;
      }
    private readonly areaUtitlityService: AreaUtilityService;


    constructor(
        private readonly cdr: ChangeDetectorRef,
        public readonly elementRef: ElementRef,
        public readonly facadeService: FacadeService
    ) {
        this.areaUtitlityService = facadeService.areaUtilityService;
        this.setSelectedItem();
    }

    /**
     *  To fetch the access details for the project
     */
    get accessControl() {
        return accessControl;
    }
    /*
    * disable show tooltip in online mode
    */
    showToolTip() {
        if(!this.facadeService.applicationStateService.isOnline()) {
          return this.facadeService.translateService.instant('home.titles.saveProject');
        }
        return '';
    }
    /*
    * Highlights the item in the tree when its selected
    */
    setSelectedItem(){
        this.facadeService.commonService.selectedMenuTreeItemObs.subscribe(res => {
            this.selectedItems = res;
        });
    }
   /*
  *
  * This lifecycle hook is called when there are changes deviceEntities
  *
  */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.deviceEntities && changes.deviceEntities?.currentValue) {
            const deviceEntities = changes.deviceEntities;
            if (JSON.stringify(deviceEntities?.currentValue?.entities)
                !== JSON.stringify(deviceEntities?.previousValue?.entities)) {
                this.setInitialMenuItem();
                this.buildFillingLineData(this.deviceEntities, this.items[0]);
            }
        }
    }
    /*
    * This lifecycle hook when the page initializes
    */
    ngOnInit() {
        this.resizeWindowObservable$ = fromEvent(window, 'resize');
        this.resizeWindowSubscription$ = this.resizeWindowObservable$.subscribe(evt => {
            this.scrollHeight = (evt.target['innerHeight'] - Numeric.NINETY).toString() + 'px';
            this.cdr.markForCheck();
        });
        this.setInitialMenuItem();
        this.buildFillingLineData(this.deviceEntities, this.items[0]);
    }
    /*
    * This lifecycle hook when the page is destroyed
    */
    ngOnDestroy() {
        this.resizeWindowSubscription$.unsubscribe();
    }
    /*
    * Function to initialize the items in left side panel
    */
    setInitialMenuItem() {
        this.items = [{
            label: this.facadeService.dataService.getProjectName(),
            icon: 'fas fa-cube',
            expanded: true,
            type: FillingLineNodeType.HEADER,
            partialSelected: false,
            children: [],
            droppable: true,
            key: ROOT_EDITOR
        }];
        this.activeClassForHeader();
    }

    /**
     * @description This method adds children in root level of left side menu
     * @param ids 
     * @param deviceEntities 
     * @param tree 
     */
    generateMenuItemRootLevel(ids: Array<string | number>, deviceEntities: EntityState<FillingNode | FillingArea>, tree: Array<TreeNode>) {
        const rootLevelNodes = ids.filter(id => deviceEntities.entities[id].parent === ROOT_EDITOR);
        if (rootLevelNodes.length > 0) {
            rootLevelNodes.forEach(id => {
                const nodeSet = this.getNodeSet(deviceEntities.entities[id]) as TreeNode;
                this.addChildren(tree, nodeSet);
            });
            const remainingIds = ids.filter(id => !rootLevelNodes.includes(id));
            if (remainingIds.length > 0) {
                this.generateTreeMenu(remainingIds, deviceEntities, tree);
            }
        }
    }

    /**
     * @description This method will be called when areas are present in Menu
     * @param ids
     * @param deviceEntities 
     * @param tree 
     */
    generateMenuItemInNestedAreas(ids: Array<string | number>, deviceEntities: EntityState<FillingNode | FillingArea>, tree: Array<TreeNode>) {
        const idsToRemove = [];
        tree.forEach(childNode => {
            if (childNode.type === FillingLineNodeType.AREA) {
                const nodeId = childNode.key;
                ids.forEach(id => {
                    if (deviceEntities.entities[id].parent === nodeId) {
                        childNode.expanded = true;
                        const nodeSet = this.getNodeSet(deviceEntities.entities[id]) as TreeNode;
                        this.addChildren(childNode.children, nodeSet);
                        idsToRemove.push(id);
                    }
                });
                const remainingIds = ids.filter(id => !idsToRemove.includes(id));
                if (remainingIds.length > 0) {
                    this.generateTreeMenu(remainingIds, deviceEntities, childNode.children);
                }
            }
        });
    }

    /**
     * @description This method generates TreeNode Array that is required for LHS Menu.
     * @param ids
     * @param deviceEntities
     * @param tree
     */
    generateTreeMenu(ids: Array<string | number>, deviceEntities: EntityState<FillingNode | FillingArea>, tree: Array<TreeNode>) {
        if (tree.length === 0) {
            this.generateMenuItemRootLevel(ids, deviceEntities, tree);
        } else {
            this.generateMenuItemInNestedAreas(ids, deviceEntities, tree);
        }
    }

    /**
     * @description This method calls everytime when there is a change in RX Store to update menu list
     * @param deviceEntities
     * @param tree
     */
    private buildFillingLineData(deviceEntities: EntityState<FillingNode | FillingArea>, tree: TreeNode) {
        if (deviceEntities) {
            const ids = [...deviceEntities.ids];
            this.generateTreeMenu(ids, deviceEntities, this.items[0].children);
            this.areaUtitlityService.menuTreeData = tree;
            this.facadeService.editorService.menuTreeData = tree;
        }
        this.facadeService.commonService.treeMenu = this.items;
    }

    /**
     * @description This method adds nested areas and nodes inside an area
     * @param children
     * @param nodeSet
     */
    addChildren(children: Array<TreeNode>, nodeSet: TreeNode) {
        if (children && children.length === 0) {
            children.push(nodeSet);
        }
        if (children && children.length > 0 && children.findIndex(child => child.key === nodeSet.key) === -1) {
            children.push(nodeSet);
        }
    }


    private getNodeSet(fillingNode: FillingNode | FillingArea) {
        const icon = 'plcicon';
        const styleClass = '';
        const nodeSet = {
            label: fillingNode?.name,
            icon: icon,
            droppable: false,
            type: fillingNode.type,
            styleClass: '',
            key: fillingNode.id,
            data: fillingNode,
            draggable: true,
            children: []
        };
        if (nodeSet.type === FillingLineNodeType.AREA) {
            nodeSet.icon = 'areaicon';
            nodeSet.styleClass = `${styleClass} area-class`;
            nodeSet.droppable = true;
            nodeSet.draggable = true;
        }
        if (fillingNode.selected) {
            this.selectedItems = [nodeSet];
        }
        return nodeSet;
    }
    /*
    * Enables draggable action if its in offline state and disables it in online state
    */
    get isDraggable() {
      return  !this.facadeService.applicationStateService.isOnline() &&
      (this.disableIfUnauthorizedDirective && this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_REORDER_AREA_NODE));
    }
    /*
    * ungroup area
    */
    unGroupAreaData(event, node: TreeNode) {
        event.stopPropagation();
        if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_UNGROUP_AREA)) {
            return;
        }
        this.facadeService.applicationStateService.unGroupArea(node);
    }
    /*
    * create area
    */
    createNewArea(event, areaID: string) {
        if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_CREATE_AREA)) {
            return;
        }
        event.stopPropagation();
        this.facadeService.applicationStateService.createArea(areaID);
        this.facadeService.drawService.resizeCanvas();
    }
    /*
    * delete area
    */
    deleteAreaDetails(event, nodeData: TreeNode) {
        event.stopPropagation();
        if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_DELETE_AREA_NODE)) {
            return;
        }
        this.facadeService.applicationStateService.deleteArea(nodeData);
    }
    /*
    * This function prevents the default action
    */
    preventDefault(event) {
        if (event.detail === numConstants.NUM_2) {
            event.stopPropagation();
            event.target.classList.add('outline');
        }
    }
    /*
    * When we click on save project
    */
    saveProject() {
        if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
            return;
        }
        this.facadeService.applicationStateService.saveProject();
    }
    /*
    * When the area name is edited by partially selecting it
    */
    updateAreaName(target, areaId, node) {
        if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
            return;
        }
        node.partialSelected = false;
        this.renameArea.emit({ 'target': target, 'areaId': areaId });
    }
    /*
    * When we drop the node to left side panel
    */
    onDropData(event: { dragNode: TreeNode, dropNode: TreeNode, index: number, originalEvent, accept; }) {
        this.facadeService.applicationStateService.reOrderArea(event, this.selectedItems || []);
    }
    /*
    * When the node is selected
    */
    nodeSelect(event: { node: TreeNode, originalEvent; }) {
        event.originalEvent.stopImmediatePropagation();
        this.facadeService.areaUtilityService.nodeSelect(event.node);
        this.facadeService.commonService.selectedMenuTree(this.selectedItems);
        this.facadeService.drawService.resizeCanvas();
    }
    /*
    * Active class for header
    */
    private activeClassForHeader(): void {
        setTimeout(() => {
            const nodeList = this.elementRef.nativeElement.querySelectorAll(TreePanel.TREE_NODE_CONTENT_CLASS);
            nodeList.forEach(el => {
                if (el.innerText === this.facadeService.dataService.getProjectName()) {
                    if (this.defaultRootHighlight) {
                        this.defaultRootHighlight = false;
                    }
                }
                el.classList?.add(DragDropAttribute.CAN_DROP_NODES);
            });
        }, Numeric.ONEHUNDRED);
    }
    /*
    * Stop events trigger from menu view
    */
    stopEventsTriggerFromMenuView(event): void {
        if (event.target.classList.contains(TreePanel.MENU_VIEW_FULL)) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    /*
    * when the node is expanded
    */
    onNodeExpand(event) {
        event.originalEvent.stopImmediatePropagation();
        this.activeClassForHeader();
    }
    /*
    * when the node is collapsed
    */
    onNodeCollapse(event) {
        event.originalEvent.stopImmediatePropagation();
        this.activeClassForHeader();
    }
    /*
    * Track data
    */
    trackData = item => item.key;
    /*
    * Truncate the name if then length is greater than 10
    */
    truncateName(labelName: string) {
        if (labelName.length > Numeric.TEN) {
            return labelName.substring(0, Numeric.FIVE) + '...';
        }
        return labelName;
    }
    /*
    * To enable the node to edit
    */
    editableMode(node: TreeNode) {
        node.partialSelected = true;
    }

}

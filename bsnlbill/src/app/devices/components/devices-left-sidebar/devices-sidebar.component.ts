/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { FacadeService } from '../../../livelink-editor/services/facade.service';

import { accessControl, PanelMenu, Numeric } from '../../../enum/enum';
import { ProjectData } from '../../../models/models';
import { Device } from '../../../models/targetmodel.interface';
import { AppState } from '../../../store/app.reducer';
import { DeviceTreeState } from '../../../store/device-tree/device-tree.reducer';
import { isNullOrEmpty } from '../../../utility/utility';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import { EllipsisPipe } from '../../../shared/pipes/ellipsis.pipe';


@Component({
  selector: 'devices-left-sidebar',
  templateUrl: './devices-sidebar.component.html',
  styleUrls: ['./devices-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers : [EllipsisPipe]
})
export class DevicesLeftSidebarComponent implements OnInit, AfterViewInit {

  deviceTree: Observable<DeviceTreeState>;

  viewType = 'full';
  devicesItems: MenuItem[];
  initialData = [];
  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;
  @Output() removeElementWidth = new EventEmitter();

  constructor(private readonly store: Store<AppState>,
    public facadeService: FacadeService,
    public readonly elementRef: ElementRef,private readonly ellipsisPipe : EllipsisPipe) {
  }
  /**
     *
     *
     *  Called when the page is loaded
  */
  ngOnInit() {
    this.initialData.push({
      label: this.ellipsisPipe.transform(this.getProjectName(),Numeric.TWENTY),
      icon: 'fas fa-industry',
      expanded: true,
      devicesItems: []
    });
    this.devicesItems = this.initialData;
    this.deviceTree = this.store.select('deviceTreeList');
    this.subscribeToDeviceTree();

  }
  /**
     *
     *
     *  Called when component's view is loaded
  */
  ngAfterViewInit(): void {
    this.removeAllActiveClass();
  }

   /**
     *
     *
     *  Returns the project name if it exists
     */
  getProjectName(): string {
    let result = 'Filling Line';
    const projectCache: ProjectData = this.getProjectCacheData();
    if (!isNullOrEmpty(projectCache) && !isNullOrEmpty(projectCache.project)) {
      result = projectCache.project.name;
    }

    return result;
  }
  /**
     *
     *
     *  Returns the project data
  */
  private getProjectCacheData(): ProjectData {
    return this.facadeService.dataService.getProjectData();
  }

  /**
    *
    *
    *  Subscribe to device tree store
    */
  private subscribeToDeviceTree() {
    this.deviceTree.subscribe(data => {
      if (!data.loading && data.deviceGroup) {
        if (!isNullOrEmpty(data) && !isNullOrEmpty(data.deviceGroup) && data.deviceGroup.devices) {
          this.updateDevicesSideBar(data.deviceGroup.devices);
          this.facadeService.saveService.devices = data.deviceGroup.devices;
        }
      }
    });
  }

  /**
    *
    *
    *  Updates the devices side bar
    */
  updateDevicesSideBar(devices: Device[]) {

    const filling = {
      label: this.ellipsisPipe.transform(this.getProjectName(),Numeric.TWENTY),
      icon: 'fas fa-cube',
      expanded: true,
      command: event => this.clickHandlerFromDeviceTree(event, null),
      items: []
    };
    if (devices?.length) {
      devices.forEach(device => {
        filling.items.push({
          label: this.ellipsisPipe.transform(device.name,Numeric.TWENTYFIVE),
          icon: 'deviceicon',
          expanded: true,
          command: event =>
            this.clickHandlerFromDeviceTree(event, device)
        });
      });
    }
    this.devicesItems = [filling];
  }
   /**
     *
     *
     * Called when the side panel is closed
     */
  removeWidth(mode) {
    this.viewType = mode;
    const emitObj = { mode: mode, position: 'left' };
    this.removeElementWidth.emit(emitObj);
  }
   /**
     *
     *
     *  To fetch the access details for the project
     */
  public get accessControl() {
    return accessControl;
  }

   /**
     *
     *
     *  Hightlight the device when the device is selected
     */
  clickHandlerFromDeviceTree(event, device) {
    const panelElementRef = this.elementRef.nativeElement.querySelector(PanelMenu.PANEL_MENU_HEADER);
    const activeClass = this.elementRef.nativeElement.querySelector(PanelMenu.PANEL_SUB_MENU_ACTIVE_CLASS);
    const targetEvent = event.originalEvent.target;
    if (! targetEvent.classList.contains(PanelMenu.ICON_CLASS)) {
      event.item.expanded = !event.item.expanded;
      this.facadeService.commonService.setSelectedDeviceId(device);
      this.removeAllActiveClass();
      if (targetEvent.parentNode.classList.contains(PanelMenu.PANEL_HEADER_LINK_CLASS)) {
        panelElementRef.classList.add(PanelMenu.PANEL_ACTIVE_CLASS);
      }
    }

    this.updateSubmenuActiveClass(targetEvent);

    if (targetEvent.classList.contains(PanelMenu.ICON_CLASS) &&
      activeClass === null) {
      panelElementRef.classList.add(PanelMenu.PANEL_ACTIVE_CLASS);
    }
    else {
      panelElementRef.classList.remove(PanelMenu.PANEL_ACTIVE_CLASS);
    }

  }

  updateSubmenuActiveClass(targetEvent) {
    if (targetEvent.classList.contains(PanelMenu.PANEL_MENU_ITEM_LINK)) {
      targetEvent.classList.add(PanelMenu.PANEL_SUB_MENU_ACTIVE);
    }
    else if (targetEvent.parentNode.classList.contains(PanelMenu.PANEL_MENU_ITEM_LINK)) {
      targetEvent.parentNode.classList.add(PanelMenu.PANEL_SUB_MENU_ACTIVE);
    } else {
      targetEvent.classList.remove(PanelMenu.PANEL_SUB_MENU_ACTIVE);
    }
  }
  /**
     *
     *
     * Reset all the active class
  */
  removeAllActiveClass() {
    this.elementRef.nativeElement.querySelectorAll(PanelMenu.PANEL_MENU_ITEM_LINK_CLASS).forEach(field => {
      field.classList.remove(PanelMenu.PANEL_SUB_MENU_ACTIVE);
    });
  }
  /**
     *
     *
     *  Save project is enabled only if the user has the access.
  */
  public saveCurrentProject() {
    if (this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
      this.facadeService.applicationStateService.saveProject();
    }
  }
}

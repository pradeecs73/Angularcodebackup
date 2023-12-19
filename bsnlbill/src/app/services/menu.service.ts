/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { ApplicationConstant } from '../enum/enum';
import { MenuItem } from '../models/models';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { menuIcons } from '../utility/constant';
import { isNullOrEmpty } from '../utility/utility';


@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menuItemMap = new Map();

  constructor(private readonly facadeService: FacadeService) {
  }

  /**
   * Method to initialize the menu items with their methods
   */
  initializeMenuItemMap() {
    this.menuItemMap.set(menuIcons.homeIcon, 'updateStylingForHomeIcon');
    this.menuItemMap.set(menuIcons.homeIconActive, 'updateStylingForHomeIconActive');
    this.menuItemMap.set(menuIcons.deviceTreeIcon, 'updateStylingForDeviceTreeIcon');
    this.menuItemMap.set(menuIcons.plantViewIcon, 'updateStylingForPlantViewIcon');
    this.menuItemMap.set(menuIcons.plantViewIconActive, 'updateStylingForPlantViewIconActive');
    this.menuItemMap.set(menuIcons.settingsIcon, 'updateStylingForSettingsIcon');
    this.menuItemMap.set(menuIcons.settingsIconActive, 'updateStylingForSettingsIconActive');
    this.menuItemMap.set(menuIcons.configurationSettingIcon, 'updateStylingForConfigurationSettingsIcon');
    this.menuItemMap.set(menuIcons.configurationSettingIconActive, 'updateStylingForConfigurationSettingsIconActive');
    this.menuItemMap.set(menuIcons.aboutIcon, 'updateStylingForAboutIcon');
    this.menuItemMap.set(menuIcons.aboutIconActive, 'updateStylingForAboutIconActive');
    this.menuItemMap.set(menuIcons.helpIcon, 'updateStylingForHelpIcon');
  }

  /**
   *
   * @param item of type MenuItem
   * @returns call corresponding method based on selected item
   */
  selectMenu(item: MenuItem) {
    if (item && item.icon) {
      this.generateMenuItemMapIfNotInitialized();
      const getMappedMenuFunction = this.menuItemMap.get(item.icon);
      this.invokeMappedMenuFunction(getMappedMenuFunction, item);
    }
  }

  /**
   *
   * @param getMappedMenuFunction
   * @param item
   * @returns invoke if the method corresponding to item
   * selected is available
   */
  invokeMappedMenuFunction(getMappedMenuFunction: string, item: MenuItem) {
    if (getMappedMenuFunction) {
      this[getMappedMenuFunction](item);
    } else {
      return;
    }
  }

  /**
   * styling home active icon
   * @param item
   */
  updateStylingForHomeIconActive(item: MenuItem) {
    item.icon = menuIcons.helpIcon;
    if (this.facadeService.applicationStateService.isOnline()) {
      item.styleClass = ApplicationConstant.DISABLED;
    }
    else {
      item.styleClass = '';
    }
  }

  /**
   * styling home  icon
   * @param item
   */
  updateStylingForHomeIcon(item: MenuItem) {
    if (this.facadeService.applicationStateService.isOnline()) {
      item.icon = menuIcons.helpIcon;
      item.styleClass = ApplicationConstant.DISABLED;
    }
    else {
      item.icon = menuIcons.homeIconActive;
      item.styleClass = ApplicationConstant.SELECTED;
    }
  }

  /**
   * styling plant view active icon
   * @param item
   */
  updateStylingForPlantViewIconActive(item: MenuItem) {
    item.icon = menuIcons.plantViewIcon;
    if (!this.facadeService.saveService.openedProject) {
      item.styleClass = ApplicationConstant.DISABLED;
    }
    else {
      item.styleClass = '';
    }
  }

  /**
   * styling plant view icon
   * @param item
   */
  updateStylingForPlantViewIcon(item: MenuItem) {
    if (!this.facadeService.saveService.openedProject) {
      item.icon = menuIcons.plantViewIcon;
      item.styleClass = ApplicationConstant.DISABLED;
    }
    else {
      item.icon = menuIcons.plantViewIconActive;
      item.styleClass = ApplicationConstant.SELECTED;
    }
  }
  /*
* styling device tree  icon
*/
  updateStylingForDeviceTreeIcon(item: MenuItem) {
    if (!this.facadeService.saveService.openedProject) {
      item.icon = menuIcons.deviceTreeIcon;
      item.styleClass = ApplicationConstant.DISABLED;
    }
    else {
      item.icon = menuIcons.deviceTreeIconActive;
      item.styleClass = ApplicationConstant.SELECTED;
    }
  }
  /*
  * Disable the navigation menu
  */
  disableMenuItem(menu) {
    if (isNullOrEmpty(this.facadeService.saveService.openedProject)) {
      menu.icon = menu.icon.replace('-active', '');
      menu.styleClass = ApplicationConstant.DISABLED;
    }
  }
  /*
  * styling  settings icon
  */
  updateStylingForSettingsIcon(item: MenuItem) {
    if (!this.facadeService.saveService.openedProject) {
      item.icon = menuIcons.settingsIcon;
      item.styleClass = ApplicationConstant.DISABLED;
    }
    else {
      item.icon = menuIcons.settingsIconActive;
      item.styleClass = ApplicationConstant.SELECTED;
    }
  }
  /*
  * styling settings active icon
  */
  updateStylingForSettingsIconActive(item: MenuItem) {
    item.icon = menuIcons.settingsIcon;
    if (!this.facadeService.saveService.openedProject) {
      item.styleClass = ApplicationConstant.DISABLED;
    }
    else {
      item.styleClass = '';
    }
  }
  /*
  * styling configuration settings icon
  */
  updateStylingForConfigurationSettingsIcon(item: MenuItem) {
    item.icon = menuIcons.configurationSettingIconActive;
    item.styleClass = ApplicationConstant.SELECTED;

  }
  /*
  * styling configuration settings active icon
  */
  updateStylingForConfigurationSettingsIconActive(item: MenuItem) {
    item.icon = menuIcons.configurationSettingIcon;
    item.styleClass = '';
  }

  /*
  * styling about icon
  */
  updateStylingForAboutIcon(item: MenuItem) {
    item.icon = menuIcons.aboutIcon;
    item.styleClass = ApplicationConstant.SELECTED;

  }
  /*
  * styling about active icon
  */
  updateStylingForAboutIconActive(item: MenuItem) {
    item.icon = menuIcons.aboutIconActive;
    item.styleClass = '';
  }

  /*
  * styling help icon
  */
  updateStylingForHelpIcon(item: MenuItem) {
    item.icon = menuIcons.helpIcon;
    item.styleClass = ApplicationConstant.SELECTED;

  }
  generateMenuItemMapIfNotInitialized() {
    if (!this.menuItemMap.size) {
      this.initializeMenuItemMap();
    }
  }
}



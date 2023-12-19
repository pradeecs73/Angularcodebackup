/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ApplicationConstant, route } from '../../../enum/enum';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { LiveLinkEditorGuardService } from '../../../services/livelink-guard.service';
import { active, menuIcons, multiLanguage, NavigationMenus } from '../../../utility/constant';
import { isNullOrEmpty } from '../../../utility/utility';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {

  items: MenuItem[];
  test: string;
  visible = true;
  currentRoute;

  constructor(private readonly router: Router,
    private readonly facadeService: FacadeService,
    private readonly liveLinkEditorGuardService: LiveLinkEditorGuardService) {
    this.items = [];
  }
  ngOnInit() {
    /*
    * Initialize the navigation list items taking from navigation menu
    */
    for (const element of NavigationMenus) {
      this.items.push({
        icon: element.icon,
        styleClass: '',
        command: _event => {
          this.updateMenuItem();
          if (element.icon === menuIcons.helpIcon && this.facadeService.translateService.currentLang) {
            window.open(`../../assets/document/SIMATICLiveLinkDocument/${multiLanguage[this.facadeService.translateService.currentLang].key}/start.html`, '_blank');
          } else {
            this.router.navigate(['/', element.route]);
          }

        }
      });
    }

    /*
    * When the global settings page is loaded/reloaded
    */
    if (window.location.hash === route.configuration_settings_path) {
      this.currentRoute = route.configuration_settings;
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.homeIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.deviceTreeIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.plantViewIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.settingsIcon);
      this.updateIcon(ApplicationConstant.SELECTED, active, menuIcons.configurationSettingIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.aboutIcon);
    }
    else if (window.location.hash === route.home ||window.location.hash === '' ) {
      /*
      * When home  is loaded/reloaded
      */
      this.currentRoute = route.home;
      this.updateIcon(ApplicationConstant.SELECTED, active, menuIcons.homeIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.deviceTreeIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.plantViewIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.settingsIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.configurationSettingIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.aboutIcon);
    } else {
      this.currentRoute = route.about;
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.homeIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.deviceTreeIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.plantViewIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.settingsIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.configurationSettingIcon);
      this.updateIcon(ApplicationConstant.SELECTED, active, menuIcons.aboutIcon);
    }
    /*
    * Subscription to disable the menu if no project is opened or in online mode
    */
    this.disableMenuIfNoProjectOpened();
    this.disableMenusInOnlineView();
  }
  /*
  * Updates the menu icons based on the parameters
  */
  updateIcon(applicationConstant: string, isActive: string, icon: string) {
    const index = this.items.findIndex(res => res.icon.includes(icon));
    this.items[index].styleClass = applicationConstant;
    this.items[index].icon = this.items[index].icon.split('-')[0];
    this.items[index].icon = this.items[index].icon + isActive;
  }


  disableMenuIfNoProjectOpened() {
    /*
    * enables or disables Livelink icon when project is opened or closed
    */
    this.liveLinkEditorGuardService.liveLinkActivateSub.subscribe(openedProjects => {
      /*
    * check for open project and close project
    */
      this.items.forEach(obj => {
        /*
        * If no project is opened
        */
        if (isNullOrEmpty(openedProjects)) {
          if (obj.icon === menuIcons.homeIcon) {
            this.facadeService.applicationStateService.selectMenu(obj);
          }
          if (!obj.icon.includes(menuIcons.homeIcon) && !obj.icon.includes(menuIcons.configurationSettingIcon) && this.checkAboutAndHelpIcon(obj)) {
            this.facadeService.menuService.disableMenuItem(obj);
          }
          this.visible = false;
          setTimeout(() => this.visible = true, 0);
        }
        else {
          /*
          * If project is opened
          */
          if ((obj.icon === menuIcons.plantViewIcon || obj.icon === menuIcons.deviceTreeIcon || obj.icon === menuIcons.settingsIcon)) {
            obj.styleClass = '';
            /*
            * Fix for the menu update issue
            */
            this.visible = false;
            setTimeout(() => this.visible = true, 0);
          }
        }
      });
    });
  }

  /*
  *
  * Disable and enable about and help icon
  *
  */
  checkAboutAndHelpIcon(obj) {
    return !obj.icon.includes(menuIcons.aboutIcon) && !obj.icon.includes(menuIcons.helpIcon);
  }

  /*
  *
  *
  * This method is called when the page is loaded
  */
  updateMenuItem() {
    this.facadeService.commonService.updateMenuItemObs.subscribe(res => {
      const searchKey = res + 'icon';
      const event = this.items.filter(item => item.icon.includes(searchKey))[0];
      this.setItem(event);
    });
  }
  /*
  * Method to disable menu in online menu
  */
  disableMenusInOnlineView() {
    this.facadeService.commonService.disableHomeAndDeviceViewIconsSub.subscribe(result => {
      if (result) {
        this.updateHomeAndDeviceIcons(ApplicationConstant.DISABLED);
      }
      else {
        this.updateHomeAndDeviceIcons(ApplicationConstant.ENABLED);
      }
      this.visible = false;
      setTimeout(() => this.visible = true, 0);
    });
  }


  /**
   * updates/ style the home and device tree icons to enable/ disable state
   * @param result Enum to enable or disable the selected menu items
   */
  private updateHomeAndDeviceIcons(result: ApplicationConstant) {
    const icons = [menuIcons.homeIcon, menuIcons.deviceTreeIcon, menuIcons.settingsIcon, menuIcons.configurationSettingIcon, menuIcons.aboutIcon];
    this.items.forEach((menuItem: MenuItem) => {
      if (icons.includes(menuItem.icon)) {
        menuItem.styleClass = result;
      }
    });
  }
  /*
  * Used to set the style for the menu
  */
  setItem(event) {
    if (this.facadeService.saveService.openedProject) {
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.homeIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.deviceTreeIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.plantViewIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.settingsIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.configurationSettingIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.aboutIcon);
    } else {
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.homeIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.deviceTreeIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.plantViewIcon);
      this.updateIcon(ApplicationConstant.DISABLED, '', menuIcons.settingsIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.configurationSettingIcon);
      this.updateIcon(ApplicationConstant.ENABLED, '', menuIcons.aboutIcon);
    }
    if (event.icon === menuIcons.aboutIcon) {
      this.updateIcon(ApplicationConstant.SELECTED, active, menuIcons.aboutIcon);
    }
    this.facadeService.applicationStateService.selectMenu(event);
    this.facadeService.commonService.updateNavigationToAnother(true);
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }

}

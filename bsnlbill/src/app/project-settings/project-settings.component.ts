/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { ProjectData, ProjectPasswords } from '../models/models';
import { accessControl } from '../enum/enum';
import { DisableIfUnauthorizedDirective } from '../directives/access-check/access-check.directive';

@Component({
  selector: 'app-projectsettings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class ProjectSettingsComponent implements OnInit {

  public items: MenuItem[];
  writePassword = '';
  public projectData:ProjectData;

  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;

  constructor(private readonly facadeService: FacadeService) { }
  /*
  * Returns the accesscontrol read/write for the project
  */
  get accessControl(){
    return accessControl;
  }
  
  ngOnInit(): void {
    /*
    * To update the navigation menu
    */
    this.facadeService.commonService.updateMenu('settings');
    /*
    * items to be displayed in the tab
    */
    this.items = [
      { label: this.facadeService.dataService.getProjectName() },
      { label: this.facadeService.translateService.instant('setting.heading') }
    ];
    this.projectData = this.facadeService.dataService.getProjectData();
  }

  /*
  * Function to set the write password
  */
  setWritePassword(formValue: ProjectPasswords) {
    this.writePassword=formValue.password;
  }
  /*
  * Function to save the write password
  */
  saveWritePassword() {
    if (this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
      this.facadeService.applicationStateService.saveProject();
    }
  }

}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { HTTPStatus } from '../enum/enum';
import { Project, ProjectData } from '../models/models';
import { Device } from '../models/targetmodel.interface';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SaveProjectService {
  devices: Array<Device>;
  projectList: Array<Project>;
  openedProject: Project;
  projectDataWithoutNodeIdSynced: ProjectData;

  private readonly editProjectState = new Subject<Project>();
  editProjectStateChange = this.editProjectState.asObservable();

  private readonly saveasProjectState = new Subject<Project>();
  saveasProjectStateChange = this.saveasProjectState.asObservable();

  private readonly refreshProjectList = new Subject<Project>();
  $refreshProjectList = this.refreshProjectList.asObservable();

  private readonly closeLastOpenedProject = new Subject<boolean>();
  closeLastOpenedProjectValue = this.closeLastOpenedProject.asObservable();


  constructor(
    private readonly messageService: MessageService,
    private readonly facadeService: FacadeService,
    private readonly router: Router
  ) {
  }
  /*
  * Save project 
  */
  saveProject() {
    const saveData =  this.facadeService.dataService.getProjectDataAsSaveJson();
    this.facadeService.apiService.saveProject(saveData).subscribe(result => {
      this.facadeService.commonService.changeSaveStatus(result);
      this.messageService.clear('saveProject');
      this.updateProjectListInGrid();
      if (result.data.code === HTTPStatus.SUCCESS) {
        this.messageService.add({
          key: 'saveProject',
          severity: 'success',
          summary: this.facadeService.translateService.instant('home.titles.saveProject'), detail: result.status.msg });
      }
    },
      err => {
        this.facadeService.commonService.changeSaveStatus(err);
      });
  }
  /*
  *sets in cache sets in store
  */
  setProjectData(data: ProjectData) {
    if (data) {
      this.facadeService.dataService.setDefaultState(data);
      this.facadeService.dataService.setProjectData(data);
      this.facadeService.commonService.isExistingProjectLoading = true;
      this.devices = data.tree.devices;
      this.facadeService.deviceStoreService.fetchDeviceTreeNodes();
    }
  }
  /*
  * cleans the project data from data service ,device store service and filling line service
  */
  cleanProjectData() {
    this.facadeService.dataService.clearProjectData();
    this.facadeService.deviceStoreService.fetchDeviceTreeNodes();
    this.facadeService.fillingLineService.clearFillingLine();
  }
  /*
  *Changes edit state
  */
  changeEditState(state: Project) {
    this.editProjectState.next(state);
    this.openedProject = state;
  }
  /*
  * Save as
  */
  changeSaveASState(state: Project) {
    this.saveasProjectState.next(state);
  }
  /*
  *Update the project list table
  */
  updateProjectListInGrid() {
    this.refreshProjectList.next();
  }
  /*
  *Reset devices
  */
  resetSaveServiceData() {
    this.devices = [];
  }
  /*
  *clear last opened project
  */
  clearLastOpenedProject(state: boolean) {
    this.closeLastOpenedProject.next(state);
  }
  /**
   *
   * @param $event // unload event
   * @returns
   * This function will call on browser refresh
   */
  clearOnUnload($event: Event) {
    if (this.openedProject) {
      this.facadeService.apiService.closeProject(this.openedProject.id, true).subscribe(_data => {
        this.facadeService.apiService.clearSessions().subscribe(() => $event);
      });
    }
    else {
      this.facadeService.apiService.goOffLine().subscribe(() => $event);
    }
    return $event;
  }
  /*
  *  This function saves the project and clear session
  */
  saveProjectAndClearSessions() {
    const data = this.facadeService.dataService.getProjectDataAsSaveJson();
    this.facadeService.apiService.saveProject(data).subscribe(_res => {
      this.facadeService.apiService.clearSessions().subscribe();
    });
  }

  /*
  * Function is used to redirect to home page and close project
  */
  redirectHomePage() {
    this.router.navigateByUrl('/home');
    this.facadeService.commonService.closeProject();
  }


}

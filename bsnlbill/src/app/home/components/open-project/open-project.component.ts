/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import yaml from 'js-yaml';
import { MenuItem } from 'primeng/api';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import { accessControl } from '../../../enum/enum';
import { Project, ProjectData } from '../../../models/models';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { log } from '../../../utility/utility';

@Component({
  selector: 'open-project',
  templateUrl: './open-project.component.html',
  styleUrls: ['./open-project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OpenProjectComponent implements OnChanges {
  /*
  * Variables for the component is declared here
  *
  */
  @ViewChild('download') download: ElementRef
  @Output() onClosedProject = new EventEmitter();
  project;
  editprojectModalDisplay = false;
  saveasprojectModalDisplay = false;
  @Input() projectData: Project;
  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;
  setSelection;
  items: MenuItem[];
  cachedata;
  stringifiedData;
  editProjectInput={};
  saveasProjectInput={};
  showPanel = true;



  constructor(public facadeService: FacadeService) {

  }
  /*
  * Access control(read/write) for the project is returned using this getter method
  *
  */
  get accessControl() {
    return accessControl;
  }
  /*
  * A lifecycle hook that is called when any data-bound property of a directive changes
  *
  */
  ngOnChanges(): void {
    /*
    * Options to be shown when the three dots in open project card is clicked
    *
    */
    this.items = [
      {
        label: this.facadeService.translateService.instant('home.titles.exportProject'),
        icon: 'export-icon',
        command: () => { this.onExport(); }
      },
      {
        label: this.facadeService.translateService.instant('home.titles.closeProject'),
        icon: 'close-icon',
        command: () => { this.closeProject(); }
      },
      {
        label: this.facadeService.translateService.instant('home.titles.saveAs'),
        icon: 'saveas-icon',
        command: () => { this.saveProjectCopy(); }
      }
    ];
    /*
    * To update the open project card with latest data
    *
    */
    this.showPanel = false;
    setTimeout(() => this.showPanel = true, 0);
    this.project = this.projectData;
    this.subscribeToEditStateChange();
  }
  /*
  * This Function is called when save as option is clicked
  *
  */
  saveProjectCopy(){
    if(this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)){
    this.facadeService.overlayService.confirm({
      message :  { content : [this.facadeService.translateService.instant('overlay.confirm.saveChanges.saveAsProject')]},
      header : this.facadeService.translateService.instant('home.titles.saveProject'),
      successLabel : this.facadeService.translateService.instant('common.buttons.ok'),
      acceptCallBack: () => {
        this.facadeService.applicationStateService.saveProject();
        this.saveasprojectModalDisplay = true;
        this.saveasProjectInput = { mode : 'saveas'};
      }
    });
  }else{
      this.saveasprojectModalDisplay = true;
      this.saveasProjectInput = { mode : 'saveas'};
  }

  }

  saveProject(event) {
    /**
     * event.preventDefault(); has been added to prevent the alert of anchor tag
     *
     */
    event.preventDefault();
    if(!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)){
      return;
    }
    this.facadeService.applicationStateService.saveProject();
  }
  /*
  * This Function is called when edit option is clicked
  *
  */
  editProject() {
    if(!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)){
      return;
    }
    this.editprojectModalDisplay = true;
    this.editProjectInput = { mode : 'edit'};
  }
  /*
  * This Function subscribes to all the changes in edit project popup
  *
  */
  subscribeToEditStateChange() {
    this.facadeService.saveService.editProjectStateChange.subscribe((data: Project) => {
      data.isSelected=true;
      this.project = data;
    });
  }
  /*
  * This Function is called when export option is clicked
  *
  */
  onExport() {
    if(this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)){
      this.facadeService.overlayService.confirm({
        message :  { content : [this.facadeService.translateService.instant('overlay.confirm.saveChanges.export')]},
        header : this.facadeService.translateService.instant('home.titles.exportProject'),
        successLabel : this.facadeService.translateService.instant('common.buttons.yes'),
        optionalLabel: this.facadeService.translateService.instant('common.buttons.no'),
        acceptCallBack: () => {
          const data = this.facadeService.dataService.getProjectDataAsSaveJson();
          this.facadeService.apiService.saveProject(data).subscribe(_res => {
            this.loadProjectData(true);
            this.facadeService.saveService.updateProjectListInGrid();
          });
        },
        optionalCallBack: () => {
          this.loadProjectData(false);
        }
      });
    }else{
      this.loadProjectData(false);
    }
  }
  /*
  * This Function loads the project data to be exported
  *
  */
  loadProjectData(_saveChanges:boolean){
    const projectData = { ...this.facadeService.dataService.getProjectData() };
      const projectPayload = {
        projectId: projectData.project.id,
        projectName: projectData.project.name,
        isProtected: projectData.project.isProtected,
        isExport: true
      };
      this.facadeService.apiService.getProjectData(projectPayload).subscribe(res => {
        const yamlData = res['data'];
        this.downloadProject(yamlData);
      });
  }
  /*
  * This Function exports the project to local
  *
  */
  downloadProject(projectData : ProjectData) {
    log(projectData);
    const name = projectData.project.name;
    this.cachedata = JSON.stringify(projectData);
    const dataStr = 'data:text/yaml;charset=utf-8,' + encodeURIComponent(yaml.dump(JSON.parse(this.cachedata)));
    const dlAnchorElem = this.download.nativeElement;
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `${name}.yaml`) ;
    dlAnchorElem.click();
  }
  /*
  * This Function is called when close option is clicked
  *
  */
  closeProject() {
    const msg = this.facadeService.translateService.instant('overlay.confirm.saveChanges.closeProject');
    if(this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)){
      this.facadeService.overlayService.confirm({
        message :  { content : [msg]},
        header : this.facadeService.translateService.instant('home.titles.closeProject'),
        successLabel : this.facadeService.translateService.instant('common.buttons.yes'),
        optionalLabel: this.facadeService.translateService.instant('common.buttons.no'),
        acceptCallBack: () => {
          const data = this.facadeService.dataService.getProjectDataAsSaveJson();
          this.facadeService.apiService.saveProject(data).subscribe(_res => {
          this.onCloseProject();
          this.facadeService.saveService.cleanProjectData();
          });
        },
        optionalCallBack :() =>{
          this.onCloseProject();
        }
      });
    }else{
      this.onCloseProject();
    }
  }

  /*
  * On close
  *
  */
  onCloseProject() {
    /* event is called */
    this.project.isSelected = false;
    this.onClosedProject.emit();
  }
}

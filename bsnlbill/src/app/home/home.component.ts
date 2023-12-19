/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Idle } from '@ng-idle/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DisableIfUnauthorizedDirective } from '../directives/access-check/access-check.directive';
import { accessControl, AccessType, ExpireSession, HTTPStatus, IoEvents, NotificationType, Numeric, OperationMode, ResponseStatusCode, timedOutState } from '../enum/enum';
import { ApiResponse, Project, ProjectData } from '../models/models';
import { ReadProjectPayload } from '../models/payload.interface';
import { Response } from '../models/response.interface';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { LiveLinkEditorGuardService } from '../services/livelink-guard.service';
import { FormatDatePipe } from '../shared/pipes/formatDate.pipe';
import { ellipsisValue, OK_BUTTON, ProjectTableDetails } from '../utility/constant';
import { getSessionIDFromCookie, isNullOrEmpty, log } from '../utility/utility';

/* Input to projectList
  1. Create
  2. Read project list call
*/
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FormatDatePipe, DatePipe]
})
export class HomeComponent implements OnInit, OnDestroy {

  openedProject: Project;
  projectList: Array<Project>;
  importprojectModalDisplay = false;
  createprojectModalDisplay = false;
  passwordValidationModalDisplay = false;
  disabled = true;
  deleteDisabled = true;
  //openedProject: Project;
  projectToBeDeleted = '';
  projectData: ProjectData;
  createProjectInput;
  saveAsSubscription: Subscription;
  editStateChange: Subscription;
  openProtectedProjectInput;
  selectedProject: Project;
  yesButtonString = 'common.buttons.yes';
  noButtonString = 'common.buttons.no';
  ellipsisValue = {
    'projectName': Numeric.FIFTEEN,
    'author': Numeric.FIFTEEN,
    'creationTime': Numeric.TWENTY,
    'lastChanged': Numeric.TWENTY,
    'lastModifiedBy': Numeric.FIFTEEN,
    'comment': Numeric.FIFTEEN
  };
  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;
  idleState: string = timedOutState.NOT_STARTED;
  countdown?: number = null;
  lastPing?: Date = null;
  sessionPopupContent: string;
  projectAvailable = true;


  constructor(
    public facadeService: FacadeService,
    private readonly messageService: MessageService,
    private readonly liveLinkEditorGuardService: LiveLinkEditorGuardService,
    private readonly datePipe: DatePipe,
    private readonly formatDatepipe: FormatDatePipe,
    public idle: Idle,
    private readonly cd: ChangeDetectorRef) {
    this.projectList = [];
  }
  /**
      *
      * Getter method to get the access control
      */
  get accessControl() {
    return accessControl;
  }

  /**
    *
    * Life cycle method called when component loads in the UI
    */
  ngOnInit() {
    this.facadeService.commonService.updateMenu('home');
    if (this.projectAvailable) {
      this.setProjectList();
      this.openLastProject();
      this.disabled = !this.checkAnySelection();
      this.deleteDisabled = !this.checkNotOpenProject();
      this.subscribeToEditStateChange();
      this.subscribeToSaveAsStateChange();
      this.subscribeToProjectList();
      this.subscribeToProjectOpened();
      this.facadeService.saveService.closeLastOpenedProjectValue.subscribe(_data => {
        this.openedProject = null;
        this.deselectProjects();
      });
      this.subscribeToSettingsNotifications();
      this.setSelectedProject();
    }
  }

  setSelectedProject(){
    this.selectedProject = this.projectList.filter(project=>project.isSelected === true)[0];
  }


  //This method is a generic method that creates a warning popup based on the content from idle node module subscription
  openSessionTimeoutNotification = obj => {

    this.facadeService.overlayService.warning(obj);
    this.facadeService.notificationService.pushNotificationToPopup(
      { content: this.facadeService.translateService.instant('overlay.warning.sessionTimeout.message.idleTime'), params: {} },
      NotificationType.WARNING, HTTPStatus.SUCCESS);
  };

  /**
   * Method to start the timer after the idle time
   */
  startTimer() {
    this.idle.watch();
    this.idleState = timedOutState.NOT_IDLE;
    this.countdown = null;
    this.lastPing = null;
  }

  /**
   *
   * Life cycle method called when component destroyed
   */
  ngOnDestroy() {
    this.saveAsSubscription.unsubscribe();
    this.editStateChange.unsubscribe();
  }

  /**
    *
    *This  method called when language selection change in the settings page
    */
  subscribeToSettingsNotifications() {
    const io = this.facadeService.socketService.getIo();
    io.on('SETTINGS_UPDATED', _sessionId => {
      this.facadeService.notificationService.pushNotificationToPopup({ content: 'home.messages.languageSettingUpdate', params: {} }, NotificationType.INFO, HTTPStatus.SUCCESS);
    });
  }

  /**
   *
   * Method will check for any project selected and returns boolean value
   */
  checkAnySelection(): boolean {
    let result = false;
    // this.projectList.forEach(P=>P.isSelected)
    for (const element of this.projectList) {
      const project = element;
      if (project.isSelected) {
        result = true;
        break;
      }
    }
    return result;
  }
  /**
    *
    * check for open project from the project list
    */
  checkNotOpenProject(): boolean {
    let deleteButtonEnable = false;
    for (const projects of this.projectList) {
      const project = projects;
      /**
       *  here we are checking three conditions
        1. project should be selected
        2. Selected project name should be not equal to open project name
        3. since we are having open project length zero on close project so checking that
      */

      const conditionProjectSelected = project.isSelected;
      const conditionSameProjectIsNotOpened = this.openedProject && project.name !== this.openedProject.name;
      const condNoProjectIsNotOpened = isNullOrEmpty(this.facadeService.saveService.openedProject);

      if (conditionProjectSelected && conditionSameProjectIsNotOpened || condNoProjectIsNotOpened) {
        deleteButtonEnable = true;
        break;
      }
    }
    return deleteButtonEnable;
  }

  /**
    *
    * Method will set the project list from save service
  */
  setProjectList() {
    if (this.facadeService.saveService.projectList && this.facadeService.saveService.projectList.length) {
      this.projectList = this.facadeService.saveService.projectList;
    } else {
      this.fetchProjectList();
    }
  }

  /**
    *
    * This method will fetch all the recent projects from the back end
    * @param openedProject: Boolean value to check any project is opened or not
  */
  fetchProjectList(openedProject?) {
    this.facadeService.apiService.fetchRecentProjects().subscribe({
      next: (result: ApiResponse) => {
        this.facadeService.saveService.projectList = result.data;
        this.projectList = this.facadeService.saveService.projectList;
        this.deselectProjects();
        if (openedProject) {
          const index = this.projectList.findIndex(el => el.id === openedProject.id);
          const lastModifiedDate = this.projectList[index].modified;
          openedProject.modified = lastModifiedDate;
          this.openedProject = openedProject;
          this.facadeService.saveService.openedProject = this.openedProject;
          this.projectList[index] = this.openedProject;
          this.facadeService.saveService.projectList = this.projectList;
        }
      },
      error: err => {
        log(err);
      }
    });
  }
  /**
   * This method is to open the last opened project
   */
  openLastProject() {
    if (!isNullOrEmpty(this.facadeService.saveService.openedProject)) {
      this.openedProject = this.facadeService.saveService.openedProject;
    }
  }

  /**
   *- This method is a generic and called from multiple places to load the popup content
   * @param isCreate :boolean value passed to check new project is creating or not
   * @param openProject - to check for value open project
   * @returns
   */
  overlayContentForOpenOrCreateProject = (isCreate, openProject) => {
    return {
      message: { content: [this.facadeService.translateService.instant('overlay.confirm.openProject')] },
      header: this.facadeService.translateService.instant('home.titles.closeProject'),
      successLabel: this.facadeService.translateService.instant(this.yesButtonString),
      optionalLabel: this.facadeService.translateService.instant(this.noButtonString),
      acceptCallBack: () => {
        const data = this.facadeService.dataService.getProjectDataAsSaveJson();
        this.facadeService.apiService.saveProject(data).subscribe(_res => {
          const projectIndex = this.projectList.findIndex(project => project.id === this.openedProject.id);
          this.projectList[projectIndex].modified = data.project.modified;
          this.openedProject = null;
          if (openProject === 'openProject') {
            this.saveOldProject(isCreate);
          }
          else {
            this.facadeService.saveService.cleanProjectData();
          }
        });
      }
    };
  };


  /**
   * This method to open the selected project when user click on openProject
   * @param isCreate    boolean value to check new project need to create or not
   * @returns
   */
  openProject(isCreate = false) {
    if (this.disabled) {
      return;
    }
    this.disabled = true;
    /**
    *
    * check to avoid the password popup if the same project is already opened
    *
    *
  */
    if (this.openedProject === this.selectedProject) {
      return;
    }

    if (isCreate) {
      this.openedProject = null;
      this.projectOpened(isCreate);
    } else {
      if (this.openedProject && (this.selectedProject.id !== this.openedProject.id)) {
        const { message, header, successLabel, optionalLabel, acceptCallBack } = this.overlayContentForOpenOrCreateProject(isCreate, 'openProject');
        if (this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
          this.facadeService.overlayService.confirm({
            message,
            header,
            successLabel,
            optionalLabel,
            acceptCallBack,
            optionalCallBack: () => {
              this.facadeService.apiService.closeProject(this.openedProject.name).subscribe(() => {
                this.openedProject = null;
                this.facadeService.saveService.openedProject = null;
                this.liveLinkEditorGuardService.changeLiveLinkRouteActiveteState(this.openedProject);
                this.disabled = !this.checkAnySelection();
                this.facadeService.apiService.fetchRecentProjects().subscribe({
                  next: (result: ApiResponse) => {
                    this.disabled = false;
                    this.facadeService.saveService.projectList = result.data;
                    this.projectList = this.facadeService.saveService.projectList;
                    const projectIndex = this.projectList.findIndex(project => project.id === this.selectedProject.id);
                    this.projectList[projectIndex].isSelected = true;
                    this.saveOldProject(isCreate);
                  },
                  error: err => {
                    this.disabled = false;
                    log(err);
                  }
                });

              });
            }
          });
        } else {
          this.openedProject = null;
          this.saveOldProject(isCreate);
        }
      }
      else {
        this.openedProject = null;
        this.saveOldProject(isCreate);
      }

    }
  }


  /**
    *
    * This method to save the changed project details before opening the new project
    * @param isCreate: boolean value to create a new project or not
  */
  saveOldProject(isCreate: boolean) {
    const openProject = this.projectList.find(project => project.isSelected === true);
    // To check project is protected or not
    if (openProject && openProject.isProtected) {
      this.openProtectedProjectInput = { mode: OperationMode.MODE_OPEN_PROTECTED_PROJECT, projectName: openProject.name };
      this.passwordValidationModalDisplay = true;
    } else {
      this.fetchProjectDetail(openProject.id, openProject.name, isCreate, openProject.isProtected);
      this.facadeService.saveService.cleanProjectData();
    }
  }


  /**
    *
    * This method will execute from confirmation popup while deleting the project if project is protected
    * @param evt: event triggered from another component
  */
  verifyProtectedProject(evt) {
    const openProject = this.projectList.find(project => project.isSelected === true);
    // To check project in which mode it opened
    if (this.openProtectedProjectInput.mode === OperationMode.MODE_DELETE_PROTECTED_PROJECT) {
      const deleteProjectPayload = {
        projectId: openProject.id,
        projectName: this.getSelectedProjectName(),
        password: evt.value.passwordText,
        accessType: AccessType.WRITE
      };
      const projectToBeDeleted = this.getSelectedProjectName();
      this.deleteSelectedProject(projectToBeDeleted, deleteProjectPayload);
      this.passwordValidationModalDisplay = false;
    }
    else {
      this.fetchProjectDetail(openProject.id, openProject.name, false, openProject.isProtected, evt.value.passwordText);
      this.facadeService.saveService.cleanProjectData();
    }

  }


  /**
     *
     * This method will called when project is opened
     * @param isCreate:bollean value to create new project or not
   */
  projectOpened(isCreate: boolean) {
    this.openedProject = this.projectList.find(project => project.isSelected === true);
    this.facadeService.dataService.setProjectMetaData(this.openedProject);
    this.facadeService.saveService.openedProject = this.openedProject;
    this.liveLinkEditorGuardService.changeLiveLinkRouteActiveteState(this.openedProject);
    this.disabled = !this.checkNotOpenProject();
    this.deleteDisabled = !this.checkNotOpenProject();
    this.facadeService.commonService.isExistingProjectLoading = !isCreate;
    this.facadeService.drawService.cleanTheEditor();
    this.facadeService.commonService.interfacePropertyAccordion = [];
    // starts the session timer.
    this.startTimer();
  }

  /**
    *
    * This method will called when their is update in the projectlist
  */
  subscribeToProjectList() {
    this.facadeService.saveService.$refreshProjectList.subscribe(() => {
      const openedProject = { ...this.facadeService.dataService.getProjectData().project };
      this.fetchProjectList(openedProject);
    });
  }

  /**
    *
    * This method will fetch the opened project detail
    * @param projectId:project id of the project
    * @param projectName:project name of the project
    * @param isCreate:boolean value
    * @param isProtected:boolean value to check for project is protected or not
    * @param password:password of the project
  */
  fetchProjectDetail(projectId: string, projectName: string, isCreate: boolean, isProtected = false, password?: string) {
    //checking project id is their or not
    if (!projectId) {
      return;
    }
    this.openedProject = null;
    const projectPayload: ReadProjectPayload = {
      projectId: projectId,
      projectName: projectName,
      password: password,
      isProtected: isProtected
    };
    this.facadeService.apiService.getProjectData(projectPayload).subscribe({
      next: (projectData: ApiResponse) => {
        this.passwordValidationModalDisplay = false;
        this.projectData = projectData.data;
        if (this.projectData.zoomSettings) {
          this.facadeService.zoomOperationsService.selectedZoomPercent = this.projectData.zoomSettings.zoomPercent;
        }
        this.facadeService.saveService.setProjectData(projectData.data);
        const deviceList = this.projectData.tree.devices?.filter(device => device.name === '');
        /**if error display error msgs*/
        if (deviceList.length > 0) {
          this.facadeService.saveService.openedProject = null;
          this.facadeService.notificationService.pushNotificationToPopup(
            { content: 'overlay.error.openProjectFailed.message.content', params: {} },
            NotificationType.ERROR, HTTPStatus.ERROR);
          this.facadeService.overlayService.error({
            header: this.facadeService.translateService.instant('overlay.error.openProjectFailed.header'),
            message: {
              title: this.facadeService.translateService.instant('overlay.error.openProjectFailed.message.title'),
              content: [this.facadeService.translateService.instant('overlay.error.openProjectFailed.message.content')]
            },
            successLabel: this.facadeService.translateService.instant(OK_BUTTON)
          });
          this.liveLinkEditorGuardService.changeLiveLinkRouteActiveteState(null);
        } else {
          this.projectOpened(isCreate);
          if (this.openedProject.isProtected) {
            this.facadeService.dataService.setAccessType(projectData.data.userDetails?.accessType);
            this.facadeService.dataService.setHaveReadAccess(projectData.data.userDetails && projectData.data.userDetails.haveReadAccess);
          }
        }
      },
      error: err => {
        log(err);
        if (err.error.error.errorType === 'Authenticate_Project_Failure') {
          this.facadeService.overlayService.error({
            header: this.facadeService.translateService.instant('overlay.error.authenticationFailed.header'),
            message: {
              title: this.facadeService.translateService.instant('overlay.error.authenticationFailed.message.title'),
              content: [this.facadeService.translateService.instant('overlay.error.authenticationFailed.message.content')]
            },
            successLabel: this.facadeService.translateService.instant(OK_BUTTON)
          });
        }
        if (err.error.error.errorType === ResponseStatusCode.Session_Already_Opend_With_Project) {
          this.facadeService.overlayService.error({
            header: this.facadeService.translateService.instant('overlay.information.header'),
            message: {
              title: this.facadeService.translateService.instant('overlay.information.message.title'),
              content: [this.facadeService.translateService.instant('overlay.information.message.content')]
            },
            successLabel: this.facadeService.translateService.instant(OK_BUTTON)
          });
        }
        else {
          this.facadeService.notificationService.pushNotificationToPopup(
            { content: 'notification.error.projectDetailsFetchFailed', params: {} },
            NotificationType.ERROR, HTTPStatus.ERROR);
        }
      }
    });
  }

  /**
    *
    * gives a confirmation dialog and deletes the selected not opened project in the list if the user press 'Yes'
    * return when delete is disabled
    *
  */
  deleteProject() {
    if (this.deleteDisabled) {
      return;
    }
    const projectToBeDeleted = this.getSelectedProjectName();
    this.facadeService.overlayService.confirm({
      message: { content: [this.facadeService.translateService.instant('overlay.confirm.deleteProject', { projectToBeDeleted: projectToBeDeleted })] },
      header: this.facadeService.translateService.instant('home.titles.deleteProject'),
      successLabel: this.facadeService.translateService.instant(this.yesButtonString),
      optionalLabel: this.facadeService.translateService.instant(this.noButtonString),
      acceptCallBack: _arg => {
        //checking project to be deleted is null or not
        if (!isNullOrEmpty(projectToBeDeleted)) {
          const openProject = this.projectList.find(project => project.isSelected === true);
          if (openProject.isProtected) {
            this.openProtectedProjectInput = { mode: OperationMode.MODE_DELETE_PROTECTED_PROJECT, projectName: openProject.name };
            this.passwordValidationModalDisplay = true;
          }
          else {
            const deleteProjectPayload = {
              projectId: openProject.id
            };
            this.deleteSelectedProject(projectToBeDeleted, deleteProjectPayload);
          }

        }
      }
    });
  }

  /**
      *
      * This method will call the delete api and delete the selected project
      * @param projectToBeDeleted:project name of the project
      * @param deleteProjectPayload:payload for delete project api
    */
  deleteSelectedProject(projectToBeDeleted: string, deleteProjectPayload = {}) {
    this.facadeService.apiService.deleteProject(projectToBeDeleted, deleteProjectPayload).subscribe(res => {
      if ((res as Response).data.code === HTTPStatus.SUCCESS) {
        //Remove the array from project list
        const projectPosition = this.getProjectPosition();
        if (projectPosition >= 0) {
          this.projectList.splice(projectPosition, 1);
          //Disabling delete project button
          this.deleteDisabled = true;
          //Disabling open project button
          this.disabled = !this.checkAnySelection();
          this.fetchProjectList();
        }
      }
    });
  }


  /**
  * Gets the position of selected project
  * @returns project position, an integer value
  */
  getProjectPosition(): number {
    let result = -1;
    for (const [index,element] of this.projectList.entries()) {
      const project = element;
      if (project.isSelected) {
        result = index;
      }
    }
    return result;
  }

  /**
  * Gets the selected project name
  * @returns project name string value
  */
  getSelectedProjectName(): string {
    let result = '';
    for (const element of this.projectList) {
      const project = element;
      if (project.isSelected) {
        result = project.name;
      }
    }
    return result;
  }

  //Calculate the value of ellipsis
  columnsResized(event) {
    switch (event.element.innerText) {
      case ProjectTableDetails.projectName:
        this.ellipsisValue.projectName = Math.round(this.ellipsisValue.projectName + (Math.round(event.delta) / Numeric.EIGHT));
        break;
      case ProjectTableDetails.author:
        this.calculateEllipseValue(event, ellipsisValue.creationTime, ellipsisValue.author);
        break;
      case ProjectTableDetails.creationTime:
        this.calculateEllipseValue(event, ellipsisValue.lastChanged, ellipsisValue.creationTime);
        break;
      case ProjectTableDetails.lastChanged:
        this.calculateEllipseValue(event, ellipsisValue.lastModifiedBy, ellipsisValue.lastChanged);
        break;
      case ProjectTableDetails.lastModifiedBy:
        this.calculateEllipseValue(event, ellipsisValue.comment, ellipsisValue.lastModifiedBy);
        break;
      default:
        break;
    }
  }
  /**
    *
    * gives the ellipsis value
  */
  calculateEllipseValue(event, nextKey: string, key: string) {
    this.ellipsisValue[key] = Math.round(this.ellipsisValue[key] + (Math.round(event.delta) / Numeric.EIGHT));
    if (event.delta < 0) {
      this.ellipsisValue[nextKey] = Math.round(this.ellipsisValue[nextKey] + (Math.round(event.delta * Numeric.MINUSONE) / Numeric.EIGHT));
    } else {
      this.ellipsisValue[nextKey] = Math.round(this.ellipsisValue[nextKey] - (Math.round(event.delta) / Numeric.EIGHT));
    }
  }

  /**
    *
    * format the date based on the language selection
  */
  formatDate(date: string) {
    const time = this.datePipe.transform(date, 'short').split(',')[1];
    return `${this.formatDatepipe.transform(date, this.facadeService.translateService.currentLang)},${time}`;
  }


  /**
    *
    * This method will execute when project is selected
    * @param project : selected project
  */
  setSelection(project) {
    this.deselectProjects();
    this.selectedProject = project;
    project.isSelected = true;
    this.disabled = false;
    this.deleteDisabled = !this.checkNotOpenProject();
  }

  /**
    *
    * This method will loop and deselects the selected projects
  */
  deselectProjects() {
    for (const element of this.projectList) {
      element.isSelected = false;
    }
  }

  /**
   *
   * This method is used to display imprt project popup
 */
  importProject() {
    this.importprojectModalDisplay = true;
  }

  /**
    *
    * This method is called when you click close or cancel from the popup
  */
  close() {
    this.importprojectModalDisplay = false;
  }

  /**
    *
    * This is the method where execution for create project will start
  */
  createProject() {
    this.checkProjectAlreadyOpen();
    this.createprojectModalDisplay = true;
    this.createProjectInput = { mode: 'create' };
  }

  /**
    *
    * This is the method to check is any other project is already opened before opening the selected project
  */
  checkProjectAlreadyOpen() {
    //checking project is opened or not
    if (this.openedProject) {
      const { message, header, successLabel, optionalLabel, acceptCallBack } = this.overlayContentForOpenOrCreateProject(false, 'createProject');
      if (this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_PROJECT_UPDATE)) {
        this.facadeService.overlayService.confirm({
          message,
          header,
          successLabel,
          optionalLabel,
          acceptCallBack,
          optionalCallBack: () => {
            this.onProjectClosed();
          }
        });
      }
    }
  }


  /**
    * @description callback function of createProject and exportProject popup
    * @param data:  project data to be created or opened
    * @param isCreateProject :  true: intended for creating a project, false: opening a project
    */
  addtoExistingProjectList(data: Project, isCreateProject: boolean) {
    this.projectList.push(data);
    this.setSelection(data);
    this.openProject(isCreateProject);
  }

  /**
    *
    * @param data:  project data to be created or opened
    */
  edittoExistingProject(data: Project) {
    //Id is used as its a constant value
    if (!isNullOrEmpty(this.projectList) && !isNullOrEmpty(this.openedProject) && !isNullOrEmpty(this.openedProject.id)) {
      const index = this.projectList.findIndex(project => project.id === this.openedProject.id);
      if (index !== -1) {
        this.projectList[index] = data;
      }
    }
  }

  /**
    *
    * Method will execute once the project is closed
    */
  onProjectClosed() {
    /**
      To stop monitoring when project is closed
    */
    this.facadeService.apiService.closeProject(this.openedProject.name).subscribe(() => {
      this.openedProject = null;
      this.facadeService.saveService.openedProject = null;
      //disables plant editor icon when project is closed
      this.liveLinkEditorGuardService.changeLiveLinkRouteActiveteState(this.openedProject);
      this.disabled = !this.checkAnySelection();
      this.fetchProjectList();
    });

  }

  /**
   *
   * This is the method to subscribe to project change
 */
  subscribeToEditStateChange() {
    this.editStateChange = this.facadeService.saveService.editProjectStateChange.subscribe((data: Project) => {
      this.edittoExistingProject(data);
      this.openedProject = data;
    });
  }

  /**
   *
   * This is the method to push the date to the existing project list
   * @param data:data to add to existing project list
 */
  addtoExistingProjectListSaveAs(data: Project) {
    this.projectList.push(data);
    this.setSelection(data);
    if (data.isProtected) {
      this.openProtectedProjectInput = { mode: OperationMode.MODE_OPEN_PROTECTED_PROJECT, projectName: data.name };
      this.passwordValidationModalDisplay = true;
    } else {
      this.openProject(true);
    }
  }

  onCancel(){
    this.deselectProjects();
    if(this.openedProject !== null && this.openedProject !== undefined){
      const index = this.projectList.findIndex(project => project.id === this.openedProject.id);
      this.projectList[index].isSelected = true;
    }
  }

  /**
   *
   * This is the method called as a subscription when user click on saveAs
 */
  subscribeToSaveAsStateChange() {
    this.saveAsSubscription = this.facadeService.saveService.saveasProjectStateChange.subscribe((data: Project) => {
      this.addtoExistingProjectListSaveAs(data);
    });
  }

  private subscribeToProjectOpened() {
    const io = this.facadeService.socketService.getIo();
    io.on(IoEvents.TOKEN_EXPIRED_NOTIFICATION, data => {
      const sessionId = getSessionIDFromCookie();
      if (sessionId === data.sessionId) {
        let sessionExpireCountDown = this.facadeService.commonService.sessionIdleTimeout;
        const setIntervalTime = window.setInterval(() => {
          if (sessionExpireCountDown > 1) {
            const { minutes, seconds } = this.facadeService.commonService.getTimerText(sessionExpireCountDown);
            this.sessionPopupContent = this.facadeService.translateService.instant('overlay.warning.tokenExpire.message.expireContent',
              { minutes: minutes, seconds: seconds });
            if (ExpireSession.SESSION === data.type) {
              this.sessionPopupContent = this.facadeService.translateService.instant('overlay.warning.sessionExpire.message.expireContent',
                { minutes: minutes, seconds: seconds });
            }
          }
          else {
            clearInterval(setIntervalTime);
            this.facadeService.saveService.saveProjectAndClearSessions();
            let expireMsg = 'overlay.warning.tokenExpire.message.tokenExpiry';

            if (ExpireSession.SESSION === data.type) {
              expireMsg = 'overlay.warning.sessionExpire.message.sessionExpiry';
            }
            this.sessionPopupContent = this.facadeService.translateService.instant(expireMsg);
          }
          this.showSessionExpireDetails(data, setIntervalTime);
          sessionExpireCountDown--;
        }, Numeric.THOUSAND);
      }
    });
  }


  private showSessionExpireDetails(data, setIntervalTime: number) {
    if (ExpireSession.TOKEN === data.type && (this.projectData && this.projectData.project.id === data.projectId)) {
      const header = 'overlay.warning.tokenExpire.header';
      const title = 'overlay.warning.tokenExpire.message.title';
      this.showWarningPopup(setIntervalTime, header, title);
    }

    if (ExpireSession.SESSION === data.type) {
      const header = 'overlay.warning.sessionExpire.header';
      const title = 'overlay.warning.sessionExpire.message.sessionExpiry';
      this.showWarningPopup(setIntervalTime, header, title);
    }
  }

  private showWarningPopup(setIntervalTime: number, header: string, title: string) {
    this.facadeService.overlayService.warning({
      header: this.facadeService.translateService.instant(header),
      message: {
        title: this.facadeService.translateService.instant(title),
        content: [this.sessionPopupContent]
      },
      successLabel: this.facadeService.translateService.instant(OK_BUTTON),
      acceptCallBack: () => {
        clearInterval(setIntervalTime);
        this.sessionPopupContent = null;
        this.facadeService.commonService.handleTimeout();
      }
    });
  }

}


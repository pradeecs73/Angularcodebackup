/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ElementRef, Injectable, Injector } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AdapterMethods, ErrorTypeList, Numeric, PropertyPanelType } from '../enum/enum';
import { Config } from '../models/config.interface';
import { ProjectRegex } from '../models/config.interface.js';
import { FileUploadEventMessage } from '../models/connection.interface';
import { AuthenticateDevice, ErrorIconVisibility, MoveData } from '../models/models';
import { PanelDataType } from '../models/monitor.interface';
import { Notification } from '../models/notification.interface';
import { Device, DeviceConfig } from '../models/targetmodel.interface';
import { DataAdapterManagers } from '../opcua/adapter/adapter-manager';
import { MonitorAdapter } from '../opcua/adapter/base-adapter/monitor-adapter';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { PopoverComponent } from '../shared/popover/popover.component';
import { convertStringToRegex } from '../shared/services/validators.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  /*
  *
  * Variables are declared here
  */
  selectedProject: string;
  editorHasNoDevice = true;
  noOfNodesInEditor = 0;
  isOnline = false;
  screenx: number;
  screeny: number;
  pageX: number;
  pageY: number;

  scrollLeft = 0;
  scrollTop = 0;
  highlightInterface = true;
  interFaceSidePanelArea = false;
  interFaceSidePanelType = '';
  isDeviceTreePanelCollapsed = false;

  connectionPropertyState = [];
  interfacePropertyAccordion = [];
  interfacePropertyState = [];
  connectionPropertyAccordion = {
    clientIndex: [],
    serverIndex: []
  };
  // proposed and actual connection list vars
  // in actual or proposed mode
  isActualConnectionMode = true;
  // clicked on apply changes
  isAppliedChanges = false;
  globalConnectionList = [];
  // cons with isCreatedManually is true
  manualConnectionList = [];
  expandAccordion = false;
  // check if any proposed connections possible
  isProposedConnectionsPossible = true;

  // error handling and dialog data
  popoverRef: PopoverComponent;
  errorIcon: HTMLElement;
  viewErrorBtn: ElementRef;
  showErrorIcon = false;
  noOfErrorMsgs = 0;
  noOfInfoMsgs = 0;
  noOfWarningMsgs = 0;
  popoverTargetBtn: ElementRef;
  allErrorCodeList = [];
  allGenericNotificationList: Notification[] = [];
  projectRegexStore: ProjectRegex;
  sessionIdleTimeout: number;
  startIdleTimer: number;
  private _tabState = false;
  public monitor: MonitorAdapter;

  /**
   * A common error list data object which gets cleared for every call of
   * Establish Connection, Go Online and Go-Offline
   */
  //executionErrorsList: Notification[] = [];

  //delete use cases
  //onlineDeletedConnections: any = [];
  //offlineDeletedConnections: any = [];
  isUploadClicked = false;
  toBeUploadedConnections = [];

  isExistingProjectLoading = false;

  // Zooming
  isSelectedZoomArea = false;

  private readonly uploadingFilesStatusMessage = new BehaviorSubject<FileUploadEventMessage>(null);
  uploadingFilesStatusMessage$ = this.uploadingFilesStatusMessage.asObservable();

  private readonly _scannedDevicesList$ = new BehaviorSubject<unknown>(null);
  scannedDevicesList$ = this._scannedDevicesList$.asObservable();

  private devicesScanningCount = 0;
  private readonly _scanningDevicesCount$ = new BehaviorSubject<number>(0);
  scanningDevicesCount$ = this._scanningDevicesCount$.asObservable();

  // private showOverlayDialog = new Subject<boolean>()
  // overlayStateChange = this.showOverlayDialog.asObservable()

  // showDeleteIcon : boolean = false;
  private readonly panelData = new BehaviorSubject<PanelDataType>(null);
  monitorPanelData = this.panelData.asObservable();

  private readonly deviceState = new Subject<Device>();
  deviceStateData = this.deviceState.asObservable();

  private readonly showAuthenticationPopup = new Subject<AuthenticateDevice>();
  showAuthenticationPopupData = this.showAuthenticationPopup.asObservable();
  /**
   * Subject to disable home and device icon tabs
   */
  private readonly disableHomeAndDeviceViewIcons = new Subject();
  /**
   * Observable to disable home and device icon tabs
   */
  disableHomeAndDeviceViewIconsSub = this.disableHomeAndDeviceViewIcons.asObservable();

  private readonly establishConnectionObs = new Subject();
  establishConSub = this.establishConnectionObs.asObservable();

  private readonly languageChange = new Subject();
  languageChangeSub = this.languageChange.asObservable();

  private readonly zoomPercent = new Subject();
  zoomPercentObs = this.zoomPercent.asObservable();

  private readonly notificationIconVisibility = new Subject<ErrorIconVisibility | boolean>();
  notificationVisibilityChange = this.notificationIconVisibility.asObservable();

  private readonly targetBtnVisibility = new Subject();
  targetBtnVisibilityChange = this.targetBtnVisibility.asObservable();

  private readonly saveStatus = new Subject(); // for changing using method
  saveStatusObs = this.saveStatus.asObservable(); // for subs

  private readonly deviceDetails = new Subject<Device>();
  deviceDetailsObs = this.deviceDetails.asObservable();

  public updateMenuItem = new Subject<string>();
  updateMenuItemObs = this.updateMenuItem.asObservable();

  public selectedMenuTreeItem = new BehaviorSubject<TreeNode[]>([]);
  selectedMenuTreeItemObs = this.selectedMenuTreeItem.asObservable();

  private readonly devicesAddedInGrid = new BehaviorSubject<DeviceConfig[]>([]);
  devicesAddedInGrid$ = this.devicesAddedInGrid.asObservable();

  private readonly updateNavigation = new BehaviorSubject<boolean>(false);
  updateNavigation$ = this.updateNavigation.asObservable();

  private readonly exportSnapShot = new Subject();
  exportSnapShot$ = this.exportSnapShot.asObservable();

  private readonly showProjectProtectionModal = new BehaviorSubject<boolean>(false);
  showProjectProtectionModal$ = this.showProjectProtectionModal.asObservable();

  public selectedDeviceAdditionType;

  public deviceAuthenticationFailedList = [];
  /**
  * Subject for error count status
  */
  private readonly errorCountStatus = new BehaviorSubject(null);

  /**
  * Observable for error count status
  */
  errorCountStatusObs = this.errorCountStatus.asObservable();
  treeMenu: TreeNode[];
  updatedDevicesData: Device[];
  notificationType: string;
  mouseObject: MoveData = { left: 0, top: 0 };
  constructor(private readonly facadeService: FacadeService,
    private readonly messageService: MessageService, public readonly injector: Injector) {
  }
  /* Event emmiter to change panel data
  */
  changePanelData(data: PanelDataType) {
    this.panelData.next(data);
  }
  /* Event emmiter on language change
 */
  onLangChange(lang: string) {
    this.languageChange.next(lang);
  }

  /* Event emmiter to change device sate
 */
  changeDeviceState(data: Device) {
    this.deviceState.next(data);
  }
  /* Event emmiter to to collapse and expand the interface grid panel
 */
  exportSnapShots(data: string) {
    this.exportSnapShot.next(data);
  }
  /* Event emmiter to show authenticate popup
 */
  showAuthenticationPopupState(data: AuthenticateDevice) {
    this.showAuthenticationPopup.next(data);
  }
  /* Authenticate popup state
 */
  authenticationPopUpState(): Observable<AuthenticateDevice> {
    return this.showAuthenticationPopup;
  }
  /* Event emmiter for selected menu tree
 */
  selectedMenuTree(data) {
    this.selectedMenuTreeItem.next(data);
  }

  /**
   * Disable/ enable the home and device Icons based on online or offline modes
   * @param isOnline Signifies whether Go-Online is enabled or not
   */
  disableHomeAndDeviceIcons(isOnline: boolean) {
    this.disableHomeAndDeviceViewIcons.next(isOnline);
  }
  /* Event emmiter to change establush connection state
 */
  changeEstablishConnectionState(isConnect: boolean) {
    this.establishConnectionObs.next(isConnect);
  }
  /* Event emmiter to change zoom percent
 */
  changeZoomPercent(value: number) {
    this.zoomPercent.next(value);
  }

   /* Event emmiter to error icon
  */
  changeErrorIconVisibility(value: boolean | ErrorIconVisibility) {
    this.notificationIconVisibility.next(value);
  }
  /* Event emmiter to change target button
 */
  changeTargetBtn(value) {
    this.targetBtnVisibility.next(value);
  }
  /* Event emmiter to change save status
 */
  changeSaveStatus(data: { status: { code: number, msg: string; }; }) {
    this.saveStatus.next(data);
  }

  /**
  * event  emitter for error count status
  */
  changeErrorCountStatus(errorCategory: string) {
    this.errorCountStatus.next(errorCategory);
  }
  /* Function to set error icon
 */
  setErrorIcon(showErrorIcon, changeErrorIconVisibility) {
    this.changeErrorIconVisibility(changeErrorIconVisibility);
    this.showErrorIcon = showErrorIcon;
  }
  /* Function to update the exception error list
  */
  public updateExceptionDataToUI(uniqueErrorList: Notification[]): void {
    this.noOfErrorMsgs = uniqueErrorList.length;
    this.allGenericNotificationList = uniqueErrorList;
    this.facadeService.overlayService.changeOverlayState(false);
    this.setErrorIcon(true, true);
    // Updating the change method for each change in the error count status
    this.changeErrorCountStatus('EXCEPTION');
    this.displayExceptionPopup();
  }
  /* Display  server exception error
  */
  displayServerExceptionPopup(): void {
    this.messageService.clear('errNodeServer');
    this.facadeService.translateService.get('messageService.error.errNodeServer').subscribe(res => {
      this.messageService.add({
        key: 'errNodeServer',
        severity: 'error',
        summary: res.summary,
        detail: res.detail,
        life: 5000
      });
    });

  }
  /* Display exception popup
  */
  displayExceptionPopup(): void {
    this.messageService.clear('genericExceptionHandling');
    this.messageService.add({
      key: 'genericExceptionHandling',
      severity: 'error',
      summary: this.facadeService.translateService.instant('messageService.error.genericExceptionHandling.summary'),
      detail: this.facadeService.translateService.instant('messageService.error.genericExceptionHandling.detail'),
      life: 5000
    });
  }
  /* To view notifications
  */
  viewErrors(btn) {
    this.viewErrorBtn = btn;
    this.popoverRef.displayErrors();
    this.facadeService.overlayService.changeOverlayState(false);
  }
  /* Event emmiter to set selected device
  */
  setSelectedDeviceId(value) {
    this.deviceDetails.next(value);
  }
  /* to store the device add type
  */
  updateDeviceAdditionType(value) {
    this.selectedDeviceAdditionType = value;
  }
  /* Event emmiter to set upload node-set file status
  */
  setUploadNodeSetFileStatus(statusMessage: FileUploadEventMessage) {
    this.uploadingFilesStatusMessage.next(statusMessage);
  }
  /* Event emmiter to set scanned device list
  */
  setScannedDevicesList(scannedDevices) {
    this._scannedDevicesList$.next(scannedDevices);
  }
  /* Event emmiter to update menu
  */
  updateMenu(value) {
    this.updateMenuItem.next(value);
  }
  /* Event emmiter to increase scanning device count
  */
  incrementScanningDeviceCount() {
    this.devicesScanningCount = this.devicesScanningCount + 1;
    this._scanningDevicesCount$.next(this.devicesScanningCount);
  }
  /* Event emmiter to reset device scan count
  */
  resetDeviceScanningCount() {
    this.devicesScanningCount = 0;
    this._scanningDevicesCount$.next(this.devicesScanningCount);
  }
  /* Event emmiter update list in grid
  */
  updateDevicesListInGrid(devices) {
    this.devicesAddedInGrid.next(devices);
  }
  /* update the notification count
  */
  updateNotificationPanel(isError: boolean, showError: boolean) {
    if (isError === true && showError === true) {
      this.setErrorIcon(true, true);
      this.displayExceptionPopup();
      this.changeErrorCountStatus(ErrorTypeList.EXECUTION_ERROR);
    }
  }
  /* Event emmiter to navigation to another
  */
  updateNavigationToAnother(value: boolean) {
    this.updateNavigation.next(value);
  }
  /* function to update property state
  */
  updatePropertyState(treeData, panelType: string) {
    return treeData.map(item => {
      item = this.setExpandedState(item, panelType);
      if (item && item.hasOwnProperty('children')) {
        item.children = this.updatePropertyState(item['children'], panelType);
      }
      return item;
    });
  }
  /*Function to set expanded state
  */
  setExpandedState(item, panelType) {
    let state: 'interfacePropertyState' | 'connectionPropertyState';
    if (panelType === PropertyPanelType.CONNECTION) {
      state = 'connectionPropertyState';
    }
    if (panelType === PropertyPanelType.INTERFACE) {
      state = 'interfacePropertyState';
    }
    if (this[state].length > 0) {
      const index = this[state].findIndex(el => el.name === item.name
        && ((panelType === PropertyPanelType.INTERFACE && el.parent === item.rootParent) || panelType === PropertyPanelType.CONNECTION));
      if (index !== -1 && this[state][index].hasOwnProperty('isExpanded')) {
        item.expanded = this[state][index].isExpanded;
      }
    }
    return item;
  }
  /* function to set mouse position
  */
  setMousePosition(ev) {
    const mouse = { x: 0, y: 0 };
    if (ev.pageX) {
      mouse.x = (ev.pageX + window.scrollX);
      mouse.y = (ev.pageY + window.scrollY);
    }
    if (ev.clientX) {
      mouse.x = (ev.clientX +
        document.body.scrollLeft);
      mouse.y = (ev.clientY +
        document.body.scrollTop);
    }
    return mouse;
  }
  /* function for closing project
  */
  closeProject() {
    const projectId = this.facadeService.dataService.getProjectId();
    this.facadeService.apiService.closeProject(projectId).subscribe();
    this.facadeService.saveService.openedProject = null;
    this.facadeService.saveService.clearLastOpenedProject(true);
  }
  /* function to get timer text
  */
  getTimerText(sessionExpireCountDown: number) {
    const minutes = Math.floor(sessionExpireCountDown / Numeric.SIXTY);
    const seconds = sessionExpireCountDown % Numeric.SIXTY;
    return { minutes, seconds };
  }
  /* function to handle time out
  */
  handleTimeout() {
    this.handleOnlineState();
    const data = this.facadeService.dataService.getProjectDataAsSaveJson();
    this.facadeService.apiService.saveProject(data).subscribe(() => this.facadeService.saveService.redirectHomePage());
  }
  /* Function to handle online state
  */
  handleOnlineState() {
    if (this.facadeService.applicationStateService.isOnline()) {
      const device = this.facadeService.dataService.getDevices();
      if (device && device.length > 0) {
        this.monitor = this.injector.get(DataAdapterManagers.getadapter(device[0].adapterType, AdapterMethods.MONITOR));
      }
      this.monitor.goOffline();
      this.monitor.offlineState();
    }
  }
  /* project related regex
  */
  setProjectRegex(configObject: Config) {
    this.projectRegexStore = {
      projectReserveKeyWordRegex: configObject.PROJ_RSRV_REGEX.toString(),
      projectSpecialCharacterRegex: configObject.PROJ_SPECIAL_CHAR_REGEX.toString(),
      deviceUrlValidationRegex: configObject.IP_ADDRESS_REGEX_VALIDATOR.toString(),
      ipValidationRegex: configObject.IP_VALIDATE_REGEX,
      portValidationRegex: configObject.PORTVALIDATE_REGEX,
      ipAddressPortValidationRegex: configObject.PORTVALIDATE_REGEX,
      passwordPatternValidationRegex: configObject.PASSWORD_PATTERN_REGEX,
      lowercaseValidationRegex: convertStringToRegex(configObject.LOWERCASE_CHARACTER_REGEX),
      uppercaseValidationRegex: convertStringToRegex(configObject.UPPERCASE_CHARACTER_REGEX),
      specialCharacterValidationRegex: convertStringToRegex(configObject.SPECIAL_CHARACTER_REGEX),
      minimumEightCharacterValidationRegex: convertStringToRegex(configObject.MINIMUM_EIGHT_CHARACTER_REGEX)
    };
  }
  /* Event emmiter to set session and timer duration
  */
  setSessionAndStartTimerDuration(configObject: Config) {
    this.startIdleTimer = configObject.startIdleTimer;
    this.sessionIdleTimeout = configObject.sessionIdleTimeout;
  }
  /* Getter method to get all the regex
  */
  get projectRegex() {
    return this.projectRegexStore;
  }
  /* Event emmiter to show project protection modal
  */
  setShowProjectProtectionModel(value: boolean) {
    this.showProjectProtectionModal.next(value);
  }
  /* getter method to show project protection modal
  */
  get projectProtectionModal(): Observable<boolean> {
    return this.showProjectProtectionModal$;
  }

  setActiveTabState(value: boolean) {
    this._tabState = value;
  }

  get activeTabState() {
    return this._tabState;
    }

}

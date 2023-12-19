/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import {
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import uniqid from 'uniqid';
import { DisableIfUnauthorizedDirective } from '../../../directives/access-check/access-check.directive';
import {
  AccessType,
  AddDeviceType,
  DeviceAttributes,
  DeviceAuthentication,
  DeviceState,
  HTTPStatus,
  NotificationType,
  Numeric,
  ResponseStatusCode,
  accessControl
} from '../../../enum/enum';
import { FileUploadEventMessage } from '../../../models/connection.interface';
import { ProtectProject } from '../../../models/device-data.interface';
import {
  ApiResponse,
  Area,
  Node,
  ProjectData,
  ProjectProtection
} from '../../../models/models';
import {
  AutomationComponent,
  ClientInterface,
  Device,
  DeviceConfig,
  OpcInterface
} from '../../../models/targetmodel.interface';
import { Connector } from '../../../opcua/opcnodes/connector';
import { OPCNode } from '../../../opcua/opcnodes/opcnode';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { validateAddress } from '../../../shared/services/validators.service';
import { AppState } from '../../../store/app.reducer';
import { DeviceTreeState } from '../../../store/device-tree/device-tree.reducer';
import {
  IP_ADDRESS_REGEX_VALIDATOR,
  MODEL_VALUE_SUBSTRING,
  ROOT_EDITOR,
  SUCCESS_CODE,
  deviceSets
} from '../../../utility/constant';
import {
  isNullOrEmpty,
  isNullOrUnDefined,
  log
} from '../../../utility/utility';
import { DeviceDetailsViewComponent } from '../device-details-view/device-details-view.component';

@Component({
  selector: 'devices-main-view',
  templateUrl: './devices-main-view.component.html',
  styleUrls: ['./devices-main-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DevicesMainViewComponent implements OnInit, OnDestroy {
  /*
  *
  * Variables are declared here
  */
  public items: MenuItem[];
  deviceTreeStoreData: Array<Device>;
  deviceTree: Observable<DeviceTreeState>;
  addDeviceModalDisplay = false;
  devices: Array<Device>;
  deviceViewTabSelected = false;
  selectedDevice: Device;
  showDeleteDeviceIcon = false;
  deviceDetails: Device;
  showDeviceDetails = false;
  deviceList = [];
  currentDeviceAuthentication;
  showDeviceLoginModel = false;
  skippedDeviceList = [];
  modelValueSubstring: string;
  subscribedDeviceDetails: Subscription;
  noOfProtectedDevices: number;
  browseFailure = false;
  deviceBrowseFailed = [];
  okButtonString = 'common.buttons.ok';
  //private readonly subscription = new Subscription();

  @Output() onDeviceSelected = new EventEmitter();
  @ViewChild('deviceDetails') deviceDetailsComp: DeviceDetailsViewComponent;
  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;
  isSubscriptionActive: boolean;
  showProjectProtectionModel = false;
  isDeviceFailedInReBrowse = false;
  reBrowseDeviceList = [];

  constructor(private readonly store: Store<AppState>,
    private readonly facadeService: FacadeService
  ) {
    this.deviceTreeStoreData = [];
    this.devices = [];
    this.deviceViewTabSelected = true;
  }
  /*
  * This life cycle hook is called when the page initializes
  *
  */
  ngOnInit() {
    this.facadeService.commonService.updateMenu('devicetree');
    this.items = [
      { label: this.getProjectName() }
    ];
    this.deviceTree = this.store.select('deviceTreeList');
    this.subscribeToDeviceTree();
    this.subscribeToSelectedDevice();
    this.modelValueSubstring = MODEL_VALUE_SUBSTRING;
  }

  /*
  * Returns the accesscontrol for the project
  *
  */
  get accessControl() {
    return accessControl;
  }
  /*
  * Returns the device set
  *
  */
  get deviceSets() {
    return deviceSets;
  }
  /*
  * If there are any devices in device list which needs authentication but is not authenticated then popup is shown
  * Guest devices doesn't need authentication
  */
  openDeviceAuthPopup() {
    const index = this.deviceList.findIndex(el => el.isProtected && el.isDeviceAuthRequired && !el.isAuthenticated);
    const authenticated = this.deviceList.filter(el => el.isProtected && el.isDeviceAuthRequired && el.isAuthenticated).length;
    if (index !== -1) {
      const authenticatedDevices = this.deviceList.filter(el => el.isProtected && el.isDeviceAuthRequired);
      this.deviceList[index].isAuthenticated = true;
      this.showDeviceLoginModel = true;
      this.currentDeviceAuthentication = this.deviceList[index];
      this.browseFailure = false;
      /*
      * To find the index of the device which needs to be authenticated
      */
      const indexForAuthenticatedDevice = authenticatedDevices.findIndex(el => el.uid === this.deviceList[index].uid);
      const data = {
        device: this.deviceList[index],
        noOfProtectedDevices: this.noOfProtectedDevices,
        index: indexForAuthenticatedDevice + Numeric.ONE + this.skippedDeviceList.length,
        authenticatedCount: authenticated,
        multipleDevices: true,
        title: DeviceAuthentication.ADD_SELECTED_DEVICE_TO_LIST
      };
      this.setDeviceDetails(data);
    }
  }
  /*
  * To update the device details in device service
  *
  */
  setDeviceDetails(data) {
    this.facadeService.deviceService.setDeviceDetails(data);
  }
  /*
  * If protected devices are added and project is not protected show protect project popup
  *
  */
  openProjectProtectPopup = () => {
    this.showProjectProtectionModel = true;
  };
  /*
  * When device is selected show the properties in right side panel
  *
  */
  subscribeToSelectedDevice() {
    this.subscribedDeviceDetails = this.facadeService.commonService.deviceDetailsObs.subscribe(deviceId => {
      if (deviceId) {
        this.showDeviceDetails = true;
        this.deviceDetailsComp.automationComp = deviceId.automationComponents;
        this.deviceDetailsComp.drawDeviceDetails();
      } else {
        this.showDeviceDetails = false;
        this.deviceDetailsComp.automationComp = null;
        this.deviceDetailsComp.clearDeviceDetails();
      }
    });
  }
  /*
  * This life cycle hook is called when the page is destroyed
  *
  */
  ngOnDestroy(): void {
    this.subscribedDeviceDetails.unsubscribe();
  }
  /*
  * Host listener to deselect a device if selected when clicked outside
  *
  */
  @HostListener('document:click', ['$event']) clickedOutside(_event) {
    this.deHighlightSelectedDevice();
  }
  /*
  * This function is called when we select a device
  *
  */
  selectDevice(device: Device, event: Event) {
    if (device) {
      event.stopImmediatePropagation();
      this.selectedDevice = device;
      this.highlightSelectedDevice(this.selectedDevice.uid);
      this.showDeleteDeviceIcon = true;
    }
  }
  /*
  * Function highlights the selected devices to represent its selected
  *
  */
  highlightSelectedDevice(selectedDeviceId) {
    const devicesClonedData = [...this.deviceTreeStoreData];
    const devices = devicesClonedData.map(device => {
      device = { ...device };
      if (device.uid === selectedDeviceId) {
        device['isSelected'] = true;
      }
      else {
        device['isSelected'] = false;
      }
      return device;
    });

    this.deviceTreeStoreData = devices;
  }
  /*
  *  Function dehighlights the unselected devices to represent its unselected
  *
  */
  deHighlightSelectedDevice() {
    const devicesClonedData = [...this.deviceTreeStoreData];
    const devices = devicesClonedData.map(device => {
      device = { ...device };
      device['isSelected'] = false;
      return device;
    });
    this.deviceTreeStoreData = devices;
    this.showDeleteDeviceIcon = false;
    this.onDeviceSelected.emit('');
  }
  /*
  *  When we delete device from device page
  *
  */
  deleteDeviceFromView() {
    this.facadeService.overlayService.confirm({
      message: { content: [this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.message.deleteDevice', { deviceName: this.selectedDevice?.name })] },
      header: this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.header'),
      successLabel: this.facadeService.translateService.instant('common.buttons.yes'),
      optionalLabel: this.facadeService.translateService.instant('common.buttons.no'),
      acceptCallBack: () => {
        this.deleteSelectedDevice();
      }
    });
  }
  /*
  *  delete device
  *
  */
  deleteSelectedDevice() {
    const param = {
      project: this.facadeService.dataService.getProjectId(),
      uId: this.selectedDevice.uid
    };
    this.facadeService.apiService.deleteDevice(param).subscribe((data: { status: string; }) => {
      if (data.status && data.status === SUCCESS_CODE) {
        const projectDevices = this.facadeService.dataService.getDevices();
        const deviceIndex = projectDevices.findIndex((device: Device) => device.uid === this.selectedDevice.uid);
        projectDevices.splice(deviceIndex, 1);
        this.facadeService.dataService.setDevices(projectDevices);
        this.setDeviceProperties();
        this.deleteDeviceNodeList();
        this.deleteDeviceConnections(this.selectedDevice);
        this.updateDeviceListToStore();
        this.showDeleteDeviceIcon = false;
      }
    },
      error => {
        log(error);
      }
    );

  }
  /*
  *  delete the device details from data and filling line service
  *
  */
  deleteDeviceNodeList() {
    if (this.facadeService.dataService.getProjectData() && this.facadeService.dataService.getProjectData().editor && this.facadeService.dataService.getProjectData().editor.nodes) {
      const deviceNodeList = this.facadeService.dataService.getProjectData().editor.nodes.filter((node: Node) => node.deviceId === this.selectedDevice.uid);
      deviceNodeList.forEach((node: Node) => {
        this.facadeService.dataService.deleteNode(node.id, ROOT_EDITOR);
        this.facadeService.fillingLineService.deleteNode(node.id);
      });
    }
  }
  /*
  * Delete the device and related connection in editor page and area when device is deleted in device page
  *
  */
  deleteDeviceConnectionsFromEditorAndArea(device: Device) {
    device.automationComponents.forEach((autoComponent: AutomationComponent) => {
      this.facadeService.areaUtilityService.updateAreaClientAndServerInterfaces(autoComponent.id);
      this.removeNodeIdsInAreaData(autoComponent.id);
      this.facadeService.dataService.removeSubConnectorsByNodeID(autoComponent.id);
      const projectData = this.facadeService.dataService.getProjectData();
      if (projectData && projectData.editor && projectData.editor.connections) {
        const deviceConnectionList = [...projectData.editor.connections];
        const filteredDeviceConnectionList = deviceConnectionList.filter(connection => !connection.id.includes(autoComponent.id) && !connection.acIds.includes(autoComponent.id));
        projectData.editor.connections = filteredDeviceConnectionList;
        this.facadeService.dataService.setProjectData(projectData);
      }
    });
  }
  /*
  * Remove the node ids from area
  *
  */
  removeNodeIdsInAreaData(nodeId) {
    const areas = this.facadeService.dataService.getAllAreas();
    areas?.forEach((areaData: Area) => {
      areaData.nodeIds = areaData?.nodeIds?.filter(nodeIdArea => nodeIdArea !== nodeId) || [];
      this.facadeService.dataService.updateArea(areaData.id, areaData);
    });
  }
  /*
  *  Delete all the connections in editor page related to device
  *
  */
  deleteDeviceConnections(device: Device) {
    this.deleteDeviceConnectionsFromEditorAndArea(device);
    const connectors = this.facadeService.editorService.liveLinkEditor.connectorLookup;
    if (connectors) {
      for (const key in connectors) {
        if (key) {
          this.removeFromLookup(key, connectors, device);
        }
      }
    }
  }

  /**
   * @param key
   * @param connectors
   * @param device
   */
  removeFromLookup(key: string, connectors, device) {
    if (connectors.hasOwnProperty(key)) {
      const connector: Connector = connectors[key];
      if ((connector.inputAnchor.parentNode as OPCNode).deviceId === device.uid
        || (connector.outputAnchor.parentNode as OPCNode).deviceId === device.uid) {
        this.facadeService.editorService.removeFromConnectorLookup(connector.id);
      }
    }
  }
  /*
  *  Function sets the device properties
  *
  */
  setDeviceProperties() {
    this.onDeviceSelected.emit('');
  }
  /*
  *  Returns project name if exists else null
  *
  */
  getProjectName(): string {
    let result = 'Filling Line';
    const projectCache: ProjectData = this.facadeService.dataService.getProjectData();
    if (!isNullOrEmpty(projectCache) && !isNullOrEmpty(projectCache.project)) {
      result = projectCache.project.name;
    }
    return result;
  }

  /**
    * Subscribe to device tree store
    */
  private subscribeToDeviceTree() {
    this.deviceTree.subscribe(data => {
      this.updateDeviceTreeStoreData(data);
    });
  }
  /*
  *  Functions updates the latest device data to device store
  *
  */
  private updateDeviceTreeStoreData(data: DeviceTreeState) {
    if (!data.loading && !isNullOrUnDefined(data) && !isNullOrUnDefined(data.deviceGroup)
      && !isNullOrUnDefined(data.deviceGroup.devices)) {
      this.deviceTreeStoreData = this.getDevicesDataFromStore(data);
      const devicesClonedData = [...this.deviceTreeStoreData];
      const devices = devicesClonedData.map(device => {
        device = { ...device };
        device['error'] = {
          ipAddressUniqueError: false,
          deviceNameLengthError: false
        };
        return device;
      });
      this.deviceTreeStoreData = devices;
      if (!this.isAnyNewDeviceAdded(this.deviceTreeStoreData)) {
        this.removeLoader();
      }
    }
    if (!this.facadeService.commonService.isExistingProjectLoading) {
      this.deviceViewTabSelected = false;
      this.removeLoader();
    }
  }
  /*
  * Function checks if any device is already added before adding device
  *
  */
  private isAnyNewDeviceAdded(devicesList: Device[]): boolean {
    let result = false;
    if (!isNullOrUnDefined(devicesList) && devicesList.length > 0) {
      for (const device of devicesList) {
        if (device.isNew) {
          result = true;
          break;
        }
      }
    }
    return result;
  }
  /*
  *  Function is used to remove the loaded while adding device
  *
  */
  private removeLoader(): void {
    this.facadeService.overlayService.changeOverlayState(false);
  }
  /*
  *  show load while adding device
  *
  */
  private setAddDevicesLoader(): void {
    this.facadeService.overlayService.loader({
      header: this.facadeService.translateService.instant('overlay.loader.addDevices.header'),
      message: {
        title: this.facadeService.translateService.instant('overlay.loader.addDevices.header'),
        content: [this.facadeService.translateService.instant('overlay.loader.addDevices.message.content')]
      },
      enableCancelButton: true,
    });
    this.facadeService.overlayService.changeOverlayState(true);
  }
  /*
  *  show loader during device update
  *
  */
  private setUpdateDevicesLoader() {
    this.facadeService.overlayService.loader({
      header: this.facadeService.translateService.instant('overlay.loader.updateDevices.header'),
      message: {
        title: this.facadeService.translateService.instant('overlay.loader.updateDevices.header'),
        content: [this.facadeService.translateService.instant('overlay.loader.updateDevices.message.content')]
      },
      enableCancelButton: true
    });
    this.facadeService.overlayService.changeOverlayState(true);
  }
  /*
  *  Show a dialogue upon the completion of device add or success
  *
  */
  updateStatusDialogue(mode: string, deviceResponse, deviceList: DeviceConfig[]) {
    const totalCons = deviceList.length;
    const errorCons = totalCons - this.devices.length;
    if (errorCons > 0) {
      this.handleDeviceOperationFailure(mode, deviceResponse, deviceList);
    } else {
      if (mode === DeviceAttributes.ADD) {
        this.handleDevicesSuccess({ totalDevices: totalCons, noOfFailedDevices: errorCons }, 'addDeviceCompleted');
      } else {
        this.handleDevicesSuccess({ totalDevices: totalCons, noOfFailedDevices: errorCons }, 'updateDeviceCompleted');
      }
    }
    this.facadeService.overlayService.changeOverlayState(true);
  }

  /**
    * Updates the devices data from store when the device is newly added
    */
  private getDevicesDataFromStore(data: DeviceTreeState): Device[] {
    let result: Array<Device> = [];
    if (!isNullOrUnDefined(data) && !isNullOrUnDefined(data.deviceGroup) && !isNullOrUnDefined(data.deviceGroup.devices)) {
      result = data.deviceGroup.devices;
      if (this.deviceViewTabSelected) {
        result = this.updateDevicesState(data.deviceGroup.devices, false);
        this.deviceViewTabSelected = false;
      }
    }
    return result;
  }
  /*
  *  Payload for add device
  *
  */
  generateReqPayload(filesUploadPayload) {
    const { deviceList, files } = filesUploadPayload;
    const formData = new FormData();
    formData.append('projectName', this.facadeService.dataService.getProjectId());
    formData.append('deviceList', JSON.stringify(deviceList));
    for (const file of files) {
      formData.append('files', file as Blob);
    }
    return formData;
  }

  /**
    * Gets the list of newly added devices after browsing
    */
  addDevices(_deviceList) {
    if (
      this.facadeService.commonService.selectedDeviceAdditionType === AddDeviceType.IMPORT_FROM_FILE) {
      this.addDevicesFromNodeSet(_deviceList);
    } else {
      /** Filtering invalid devices */
      const deviceList = _deviceList.filter(device => !(device.isValidAddressModel === false || device.isSecurityPolicyValid === false));
      this.deviceList = deviceList;
      if (deviceList.some(el => el.isProtected && el.isDeviceAuthRequired)) {
        if (!this.facadeService.dataService.getProjectData().project.isProtected) {
          //open secure project popup
          this.openProjectProtectPopup();
        }
        // device auth
        else {
          this.loadDeviceAuth();
        }
      } else {
        this.setAddDevicesLoader();
        this.browse(deviceList, DeviceAttributes.ADD);
      }
    }
  }

  /**
   * @description Handle Device addition through node-set file upload
   * @param _deviceList
   */
  private addDevicesFromNodeSet(_deviceList) {
    if (_deviceList.deviceList.length) {
      /** Filtering invalid devices */
      const deviceList = _deviceList.deviceList.filter(device => !(device.isValidAddressModel === false || device.isSecurityPolicyValid === false));
      const reqPayload = this.generateReqPayload(_deviceList);
      this.facadeService.apiService.getUploadNodeSetFilesUpdate(deviceList.length);
      this.facadeService.commonService.setUploadNodeSetFileStatus(null);
      this.isSubscriptionActive = true;
      this.handleDevicesUploadSuccess(_deviceList.files.length);
      this.facadeService.apiService.uploadXMLfiles(reqPayload).subscribe((response: ApiResponse) => {
        this.handleSubscriptionActiveForNodeSetUpload(response, deviceList);
      });
    }
  }

  /**
   *
   * @param response - API Response for node-set fileUpload
   * @param deviceList - deviceList
   */
  private handleSubscriptionActiveForNodeSetUpload(response: ApiResponse, deviceList) {
    if (this.isSubscriptionActive) {
      this.devices = response.data.devices;
      this.devices = this.devices.filter(device => device.status === 'SUCCESS');
      this.updateDeviceList(this.devices);
      const updateModal = this.updateDeviceStatusModal(response);
      this.facadeService.commonService.setUploadNodeSetFileStatus(updateModal);
      this.isSubscriptionActive = false;
      this.deviceList = deviceList;
    }
  }

  /**
   *
   * @param response - API Response for node-set fileUpload
   * @returns  generated data for update device status based on API response
   */
  private updateDeviceStatusModal(response: ApiResponse) {
    return {
      totalNoOfDevices: response.data.devices.length,
      counter: this.devices.length,
      errorCount: response.data.devices.length - this.devices.length
    };
  }

  /*
  *  Show a notification before adding a protected device and show a authentication popup
  *
  */
  loadDeviceAuth() {
    this.facadeService.notificationService.pushNotificationToPopup({ content: 'notification.warning.protectProject', params: {} }, NotificationType.WARNING, HTTPStatus.SUCCESS);
    this.noOfProtectedDevices = this.deviceList.filter(el => el.isProtected && el.isDeviceAuthRequired).length;
    this.deviceAuthenticationPopup();
  }
  /*
  *  When skip device button is clicked in device auth popup
  *
  */
  skipDevice() {
    if (this.currentDeviceAuthentication) {
      this.skippedDeviceList = [...this.skippedDeviceList, ...this.deviceList.filter(device => device.address === this.currentDeviceAuthentication.address)];
      this.deviceList = this.deviceList.filter(device => device.address !== this.currentDeviceAuthentication.address);
      this.deviceAuthenticationPopup();
    }
  }
  /*
  *  show device authentication pop is device is protection authentication is needed but its not authenticated
  *
  */
  deviceAuthenticationPopup() {
    if (this.deviceList.some(el => el.isProtected && el.isDeviceAuthRequired && !el.isAuthenticated)) {
      this.openDeviceAuthPopup();
    } else {
      this.showDeviceLoginModel = false;
      this.deviceList = this.deviceList.map(list => {
        delete list.isAuthenticated;
        return list;
      });
      this.browse(this.deviceList, DeviceAttributes.ADD);
    }
  }
  /*
  *  Update the credentials added by the user in device list
  *
  */
  addCredentials(credentials) {
    const index = this.deviceList.findIndex(el => el.address === credentials.address);
    this.deviceList[index].credentials = {};
    this.deviceList[index].credentials.userName = credentials.userName;
    this.deviceList[index].credentials.password = credentials.password;
    this.deviceAuthenticationPopup();
  }
  /*
  *  Function is used to check if device was already added
  *
  */
  checkIfDevicesAlreadyAdded(deviceList: DeviceConfig[]): DeviceConfig[] {
    const existingDevices = this.facadeService.dataService.getDevices();
    let updatedDeviceList = [];
    if (existingDevices.length > 0) {
      deviceList.forEach(device => {
        if (!(existingDevices.some(ed => ed.address === device.address))) {
          updatedDeviceList.push(device);
        }
      });
    } else {
      updatedDeviceList = deviceList;
    }
    return updatedDeviceList;
  }

  /*
  *  browse device to add to device page
  *
  */
  public browse(deviceList: DeviceConfig[], mode: string) {
    // for scan devices validation
    if (mode === DeviceAttributes.ADD) {
      deviceList = this.checkIfDevicesAlreadyAdded(deviceList);
    }
    if (deviceList.length > 0) {
      this.addDeviceModalDisplay = false;
      const param = {
        deviceConfigList: deviceList,
        project: this.facadeService.dataService.getProjectId()
      };
      if (mode === DeviceAttributes.ADD) {
        this.setAddDevicesLoader();
      } else {
        this.setUpdateDevicesLoader();
      }
      this.facadeService.apiService.browseDevices(param).subscribe((response: ApiResponse) => {
        this.removeLoader();
        this.handleBrowseSuccess(response, mode);
        this.highlightSelectedDevice(deviceList[0].uid);
      }, err => {
        this.handleBrowseError(err, deviceList, mode);
      });
    } else {
      this.removeLoader();
    }
  }

  /*
 *  When the add or update device update is success
 *
 */

  handleBrowseSuccess(response, mode) {
    if (!isNullOrEmpty(response) && !isNullOrEmpty(response.status) && response.status === 'SUCCESS' && response.data.devices.length > 0) {
      const devices = response.data.devices.filter(eachDevice => eachDevice.state === DeviceState.AVAILABLE && eachDevice.status === SUCCESS_CODE);
      this.devices = devices;
      this.updateDeviceList(devices);
      this.updateDeviceListToStore();
      this.updateDeviceStatus(mode);
      if (mode === DeviceAttributes.ADD) {
        this.handleBrowseSuccessAdd(response, devices);
      }
      if (mode === DeviceAttributes.UPDATE) {
        this.handleBrowseSuccessUpdate(response);
      }
      if (this.facadeService.dataService.getProjectData().tree.devices.some(el => el.isProtected && el.isDeviceAuthRequired) &&
        !this.facadeService.dataService.getProjectData().project.isProtected) {
        //open secure project popup
        this.openProjectProtectPopup();
      }
    }
  }
  /*
 *  when browse for add device  successfully completes
 *
 */
  handleBrowseSuccessAdd(response, devices) {
    if (devices.length === response.data.devices.length) {
      const successMessage = { content: `notification.info.devicesSuccessfullyAdded`, params: { length: devices.length } };
      this.facadeService.notificationService.pushNotificationToPopup(successMessage, NotificationType.INFO, HTTPStatus.SUCCESS);
    }
    response.data.devices.forEach(device => {
      if (device.state === DeviceState.AVAILABLE && device.status === SUCCESS_CODE) {
        const message = { content: `notification.info.deviceAdded`, params: { name: device.name } };
        this.facadeService.notificationService.pushNotificationToPopup(message, NotificationType.INFO, HTTPStatus.SUCCESS);
      }
      else {
        this.facadeService.deviceService.handleBrowseErrorNotification(device);
      }
    });
    this.updateStatusDialogue(DeviceAttributes.ADD, response.data, response.data.devices);
  }
  /*
  *  when browse for update device  successfully completes
  *
  */
  handleBrowseSuccessUpdate(response) {
    if (this.devices.length > 0) {
      this.updateDeviceStatusInEditor(this.devices);
      this.facadeService.fillingLineService.clearFillingLine();
      this.facadeService.notificationService.pushNotificationToPopup(
        { content: 'notification.info.deviceUpdated', params: {} },
        NotificationType.INFO,
        HTTPStatus.SUCCESS);
    }
    else {
      this.facadeService.deviceService.handleBrowseErrorNotification(response.data.devices[0]);
    }
  }
  /*
  *  when browse fails
  *
  */
  handleBrowseError(err, deviceList, mode) {
    if (err.error.error.errorType === ResponseStatusCode.BROWSE_DEVICE_AUTHENTICATION_FAILURE) {
      this.isDeviceFailedInReBrowse = true;
      this.reBrowseDeviceList = deviceList;
      if (!this.facadeService.dataService.getProjectData().project.isProtected) {
        //open secure project popup
        this.openProjectProtectPopup();
      } else {
        this.openDeviceAuthManual();
      }
    } else {
      const deviceData = { status: err.error.status, devices: err.error.data.devices };
      this.handleDeviceOperationFailure(mode, deviceData, deviceList);
    }
  }
  /*
  *  To show device auth popup if project is protected and browse fails
  *
  */
  openDeviceAuthManual() {
    if (this.reBrowseDeviceList.length > 0) {
      this.facadeService.overlayService.clearOverlayData();
      this.showDeviceLoginModel = true;
      this.browseFailure = true;
      this.deviceBrowseFailed = [JSON.parse(JSON.stringify(this.reBrowseDeviceList[0]))];
      const data = {
        device: this.reBrowseDeviceList[0],
        noOfProtectedDevices: 0,
        index: 0,
        authenticatedCount: 0,
        multipleDevices: false,
        title: DeviceAuthentication.BROWSE_DEVICE
      };
      this.setDeviceDetails(data);
      this.reBrowseDeviceList = [];
      this.isDeviceFailedInReBrowse = false;
    }
  }
  /*
  *
  * When device authentication is successful
  */
  authenticationSuccessful($event) {
    if (!this.deviceBrowseFailed[0].hasOwnProperty('credentials')) {
      this.deviceBrowseFailed[0]['credentials'] = { 'userName': '', 'password': '' };
    }
    this.deviceBrowseFailed[0].credentials.userName = $event.userName;
    this.deviceBrowseFailed[0].credentials.password = $event.password;
    this.showDeviceLoginModel = false;
    const index = this.facadeService.dataService.getProjectData().tree.devices.findIndex(el => el.uid === $event.uid);
    const project = this.facadeService.dataService.getProjectData();
    project.tree.devices[index].isProtected = true;
    project.tree.devices[index].isDeviceAuthRequired = true;
    this.facadeService.dataService.setProjectData(project);
    this.facadeService.notificationService.pushNotificationToPopup(
      { content: 'notification.info.writePasswordRemovedSuccessfully', params: {} }
      , NotificationType.INFO,
      HTTPStatus.SUCCESS);
    this.facadeService.applicationStateService.saveProject();
    this.browse(this.deviceBrowseFailed, DeviceAttributes.UPDATE);
  }
  /*
  *  Updates device status in editor
  *
  */
  updateDeviceStatusInEditor(deviceList: DeviceConfig[]) {
    const device = this.facadeService.dataService.getDevice(deviceList[0].uid);
    if (this.facadeService.dataService.getProjectData() && this.facadeService.dataService.getProjectData().editor && this.facadeService.dataService.getProjectData().editor.nodes) {
      const deviceNodeList = this.facadeService.dataService.getProjectData().editor.nodes.filter((node: Node) => node.deviceId === deviceList[0].uid);
      deviceNodeList.forEach((node: Node) => {
        if (device.uid !== node.deviceId) {
          this.facadeService.dataService.deleteNode(node.id, ROOT_EDITOR);
          this.facadeService.fillingLineService.deleteNode(node.id);
          this.deleteDeviceConnections(device);
        }
      });
    }
  }

  /*
  *  updates device status
  *
  */
  private updateDeviceStatus(mode) {
    this.deviceTreeStoreData = this.deviceTreeStoreData.map(item => {
      item = { ...item };
      this.devices.forEach(device => {
        if (device.uid === item.uid) {
          if (mode === DeviceAttributes.ADD || mode === DeviceAttributes.UPLOAD) {
            item.isNew = true;
          } else {
            item.isUpdated = true;
            item.isNew = false;
          }
        }
      });
      return item;
    });
  }
  /*
  *  updates device list
  *
  */
  private updateDeviceList(devices: Array<Device>) {
    devices?.forEach(device => this.updateDevice(device));
  }
  /*
  *  update the device
  *
  */
  private updateDevice(device: Device) {
    if (device) {
      if (device.state !== DeviceState.AVAILABLE) {
        device = this.facadeService.dataService.getDevice(device.uid);
        device.state = DeviceState.UNAVAILABLE;
      }
      else {
        device.automationComponents = this.updateAutomationComponents(device);
      }
      this.facadeService.dataService.setDevice(device);
      this.facadeService.dataService.deleteConnectionIfNotMatching(device.uid);
    }
  }
  /*
  *  update the AC
  *
  */
  private updateAutomationComponents(device: Device): AutomationComponent[] {
    const result: Array<AutomationComponent> = [];
    if (!isNullOrUnDefined(device?.automationComponents)) {
      for (const automationComponent of device?.automationComponents) {
        result.push(this.updateAutomationComponent(automationComponent, device));
      }
    }
    return result;
  }

  /**
   *
   * update the automation component
   *
   * with the address ,deviceId and name
   * if id is existing with same type then use the existing Id
   * else create a unique id
   * @private
   * @param {AutomationComponent} automationComponent
   * @param {Device} device
   * @return {*}  {AutomationComponent}
   * @memberof DevicesMainViewComponent
   */
  private updateAutomationComponent(automationComponent: AutomationComponent, device: Device): AutomationComponent {
    if (
      !isNullOrEmpty(device?.address) &&
      !isNullOrUnDefined(automationComponent) &&
      !isNullOrEmpty(automationComponent.name)
    ) {
      automationComponent = JSON.parse(JSON.stringify(automationComponent));
      automationComponent.address = device?.address;
      automationComponent.deviceId = device.uid;
      automationComponent.deviceName = device?.name;
      const encodedACName = btoa(automationComponent.name);
      automationComponent.id = `${device?.uid}_${encodedACName}`;
      automationComponent.state = device.state;
    }
    const {
      existingClientInterfaces,
      existingServerInterfaces,
    } = this.facadeService.dataService.getExistingInterfaceDetailsByDeviceId(
      device.uid
    );

    automationComponent?.clientInterfaces?.forEach(clientIf =>
      this.updateInterfaceId(existingClientInterfaces, clientIf, true)
    );
    automationComponent?.serverInterfaces?.forEach(serverIf =>
      this.updateInterfaceId(existingServerInterfaces, serverIf, false)
    );
    return automationComponent;
  }

  /**
   *
   * update the interface id if it is matching with the existing type
   * else create a unique ID
   * @private
   * @param {(ClientInterface[] | OpcInterface[])} existingInterfaces
   * @param {(OpcInterface | ClientInterface)} interfaceDetails
   * @param {boolean} isClient
   * @return {*}
   * @memberof DevicesMainViewComponent
   */
  private updateInterfaceId(existingInterfaces: ClientInterface[] | OpcInterface[], interfaceDetails: OpcInterface | ClientInterface, isClient: boolean) {
    const matchingExistingInterfaces = existingInterfaces &&
      existingInterfaces.filter(
        existingServerInterface => existingServerInterface.type === interfaceDetails.type
      );
    interfaceDetails.id = uniqid('serverInf_');
    if (isClient) {
      interfaceDetails.id = uniqid('clientInf_');
    }
    interfaceDetails = this.assignExistingInterface(matchingExistingInterfaces, interfaceDetails);
    return interfaceDetails;
  }

  /**
   *
   * assign the matching existing interface id with the matching interface
   * @private
   * @param {any[]} matchingExistingInterfaces
   * @param {(ClientInterface | OpcInterface)} interfaceDetails
   * @return {*}
   * @memberof DevicesMainViewComponent
   */
  private assignExistingInterface(matchingExistingInterfaces: ClientInterface[] | OpcInterface[], interfaceDetails: ClientInterface | OpcInterface) {
    if (matchingExistingInterfaces) {
      for (const matchingExistingInterface of matchingExistingInterfaces) {
        if (matchingExistingInterface && matchingExistingInterface.id) {
          interfaceDetails.id = matchingExistingInterface.id;
        }
      }
    }
    return interfaceDetails;
  }

  /*
  * Update the device state to available
  *
  */
  private updateDevicesState(devices: Device[], _deviceState: boolean): Device[] {
    let result: Array<Device> = [];
    if (!isNullOrUnDefined(devices)) {
      result = devices.map(device => {
        return {
          ...device,
          state: DeviceState.AVAILABLE
        };
      });
    }
    return result;
  }

  /**
    * Updates the devices list to the device tree store
    */
  updateDeviceListToStore(): void {
    this.facadeService.deviceStoreService.fetchDeviceTreeNodes();
  }
  /*
  * Show device add popup only if the user has permission to add device
  *
  */
  handleAddingDevices() {
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_DEVICE_UPDATE)) {
      return;
    }
    this.addDeviceModalDisplay = true;
  }
  /*
  * When the device is selected update the device to properties panel
  *
  */
  handleDeviceSelected(event, deviceData: Device) {
    event.stopPropagation();
    this.onDeviceSelected.emit(deviceData);
  }
  /*
  *  Update the device
  *
  */
  update(device: DeviceConfig) {
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_DEVICE_UPDATE)) {
      return;
    }
    const updateDeviceReq = this.generateRequestForUpdateDevice(device);
    this.setUpdateDevicesLoader();
    this.browse([updateDeviceReq], DeviceAttributes.UPDATE);
  }

  private generateRequestForUpdateDevice(device: DeviceConfig) {
    return {
      name: device.name,
      address: device.address,
      uid: device.uid,
      credentials: device.credentials,
      isDeviceAuthRequired: device.isDeviceAuthRequired,
      isProtected: device.isProtected
    };
  }

  /*
  *  when add device fails show the count of devices failed
  *
  */
  private handleUploadError(data) {
    if (data?.totalNoOfDevices > data?.errorCount) {
      const content = this.facadeService.translateService.instant('overlay.warning.addDeviceFailed.message.content',
        { failedCount: data?.totalNoOfDevices - data?.errorCount, totalNoOfDevices: data?.totalNoOfDevices });
      this.facadeService.overlayService.warning({
        header: this.facadeService.translateService.instant('overlay.warning.addDeviceFailed.header'),
        message: {
          title: this.facadeService.translateService.instant('overlay.warning.addDeviceFailed.message.title'),
          content: [content]
        },
        successLabel: this.facadeService.translateService.instant(this.okButtonString),
        acceptCallBack: () => {
          this.hideOverlay();
        }
      });
    }
    if (data?.totalNoOfDevices === data?.errorCount) {
      const content = this.facadeService.translateService.instant('overlay.error.addDeviceFailed.message.content',
        { failedCount: data?.totalNoOfDevices - data?.errorCount, totalNoOfDevices: data?.totalNoOfDevices });
      this.facadeService.overlayService.error({
        header: this.facadeService.translateService.instant('overlay.error.addDeviceFailed.header'),
        message: {
          title: this.facadeService.translateService.instant('overlay.error.addDeviceFailed.message.title'),
          content: [content]
        },
        successLabel: this.facadeService.translateService.instant(this.okButtonString),
        acceptCallBack: () => {
          this.hideOverlay();
        }
      });
    }
  }


  /**
   *
   * Real time update of devices addition during node-set file
   * @private
   * @param {number} fileLength
   * @memberof DevicesMainViewComponent
   */
  private handleDevicesUploadSuccess(fileLength: number) {
    this.facadeService.commonService.uploadingFilesStatusMessage$
      .pipe(
        takeWhile(() => this.isSubscriptionActive))
      .subscribe(data => {
        const errorFlag = data?.totalNoOfDevices && data?.errorCount > 0;
        const showSuccessFlag =
          data?.totalNoOfDevices === data?.counter && fileLength === data?.counter;

        const messages = this.generateMessageForAddingDevice(data, fileLength);

        if (showSuccessFlag) {
          messages.title =
            this.facadeService.translateService.instant('overlay.success.addingDevice.message.title1');
          messages.buttonTxt = this.facadeService.translateService.instant(this.okButtonString);
          messages.header = this.facadeService.translateService.instant('overlay.success.addingDevice.header1');
        }
        this.facadeService.overlayService.success({
          header: messages.header,
          message: {
            title: messages.title,
            content: [messages.message]
          },
          successLabel: messages.buttonTxt,
          acceptCallBack: () => {
            this.hideOverlay();
            this.isSubscriptionActive = false;
          },
          closeCallBack: () => {
            this.facadeService.overlayService.changeOverlayState(false);
            this.isSubscriptionActive = false;
          }
        });
        this.facadeService.commonService.setErrorIcon(false, false);
        if (errorFlag) {
          this.handleUploadError(data);
        }
      }
      );
  }

  private generateMessageForAddingDevice(data: FileUploadEventMessage, fileLength: number) {
    return {
      title: this.facadeService.translateService.instant('overlay.success.addingDevice.message.title',
        { counter: data?.counter ?? 1, totalNoOfDevices: data?.totalNoOfDevices ?? fileLength }),
      message: this.facadeService.translateService.instant('overlay.success.addingDevice.message.content',
        { success: data?.counter ?? 0 }),
      buttonTxt: this.facadeService.translateService.instant('common.buttons.cancel'),
      header: this.facadeService.translateService.instant('overlay.success.addingDevice.header'),
      content: ''
    };
  }

  /*
  *  hide the overlay popup
  *
  */
  hideOverlay() {
    this.updateDeviceListToStore();
    this.updateDeviceStatus(DeviceAttributes.UPLOAD);
  }

  /*
  * when the devices are successfully added
  *
  */
  private handleDevicesSuccess(status: { totalDevices: number; noOfFailedDevices: number; }, mode: string) {
    const success = status.totalDevices - status.noOfFailedDevices;
    this.facadeService.overlayService.success({
      header: this.facadeService.translateService.instant(`overlay.success.${mode}.header`),
      message: {
        title: this.facadeService.translateService.instant(`overlay.success.${mode}.message.title`),
        content: [this.facadeService.translateService.instant(`overlay.success.${mode}.message.content`, { success: success })]
      },
      successLabel: this.facadeService.translateService.instant(this.okButtonString)
    });
    this.facadeService.commonService.setErrorIcon(false, false);
  }

  /*
  *
  *Handling error messages for device add and update operation
   */
  private handleDeviceOperationFailure(mode: string, device: { devices: Device[], status: string; }, deviceList: DeviceConfig[]): void {
    this.facadeService.overlayService.changeOverlayState(true);
    let errorMsg: { header: string, title: string, content: string; };
    const totalDevice = deviceList.length;
    let noOfFailedDevices = 0;
    if (device.status === 'ERROR') {
      noOfFailedDevices = totalDevice;
    } else {
      noOfFailedDevices = totalDevice - this.devices.length;
    }
    switch (mode) {
      /*
      * when the mode is add
      */
      case DeviceAttributes.ADD:
        errorMsg = {
          header: this.facadeService.translateService.instant('overlay.error.addDeviceCompleted.header'),
          title: this.facadeService.translateService.instant('overlay.error.addDeviceCompleted.message.title'),
          content: this.facadeService.translateService.instant('overlay.error.addDeviceCompleted.message.content',
            { noOfFailedDevices: noOfFailedDevices, totalDevice: totalDevice })
        };
        this.errorOverlay(errorMsg);
        break;
      /*
  * when the mode is update
  */
      case DeviceAttributes.UPDATE:
        errorMsg = {
          header: this.facadeService.translateService.instant('overlay.error.updateDeviceFailed.header'),
          title: this.facadeService.translateService.instant('overlay.error.updateDeviceFailed.message.title',
            { deviceName: device.devices[0].name, address: device.devices[0].address }),
          content: this.facadeService.translateService.instant('overlay.error.updateDeviceFailed.message.content')
        };
        this.errorOverlay(errorMsg);
        break;

      default:
        break;
    }
  }

  /*
  * To open the error messages in overlay
  *
  */
  private errorOverlay(errorMsg: { header: string, title: string, content: string; }): void {
    this.facadeService.overlayService.error({
      header: errorMsg.header,
      message: {
        title: errorMsg.title,
        content: [errorMsg.content]
      },
      successLabel: this.facadeService.translateService.instant(this.okButtonString),
      cancelLabel: this.facadeService.translateService.instant('common.buttons.cancel'),
      acceptCallBack: (btn => {
        this.facadeService.commonService.viewErrorBtn = btn;
      })
    });
    this.facadeService.commonService.setErrorIcon(true, true);
    this.facadeService.commonService.changeErrorCountStatus('EXECUTION_ERROR');
  }
  /*
  *  stop the default behavior of the event
  *
  */
  preventClickEvent(event) {
    event.stopPropagation();
  }
  /*
  *  Returns the node using the device id else returns null
  *
  */
  getDeviceNode(device) {
    if (this.facadeService.dataService.getProjectData().editor?.nodes) {
      return this.facadeService.dataService
        .getProjectData()?.editor?.nodes?.filter(
          (node: Node) => node.deviceId === device.uid);
    }
    return [];
  }
  /*
  *  returns the updated address
  *
  */
  getUpdatedAddress(propertyName, value, device) {
    const address = device?.address;
    if (propertyName === 'address') {
      return value;
    }
    if (propertyName === 'name') {
      return '';
    }
    return address;
  }
  /*
  *  update device name  property if the project has access and name is not empty
  *
  */
  updateDeviceProperty(value, index, propertyName, device) {
    device.partialSelected = false;
    if (!this.disableIfUnauthorizedDirective.hasPermission(accessControl.CAN_DEVICE_UPDATE)) {
      return;
    }
    if (propertyName === 'name' && value === '') {
      return;
    }
    this.updateDevicePropertyValue(value, index, propertyName, device);

  }
  /*
  * update the device property value
  *
  */
  updateDevicePropertyValue(value, index, propertyName, device) {
    value = value.trim();
    const previousValue = this.deviceTreeStoreData[index][propertyName];
    /*
    *update address only if it passes the regex validation
    */
    if (propertyName !== 'address' || (propertyName === 'address' && this.validateRegex(value, previousValue) === value)) {
      const tempDeviceTreeData = JSON.parse(JSON.stringify(this.deviceTreeStoreData));
      tempDeviceTreeData[index][propertyName] = value;
      this.deviceTreeStoreData = [...tempDeviceTreeData];
      const reqBody = this.facadeService.deviceService.generatePayloadForUpdateDevice(device, propertyName, value);
      this.facadeService.apiService.updateDeviceDetails(reqBody).subscribe((data: ApiResponse) => {
        if (data) {
          /*
          *update device badge for the UI view
          */
          this.devices = [device];
          this.updateDeviceStatus(DeviceAttributes.UPDATEDETAILS);
          const deviceNode = this.getDeviceNode(device);
          // manually update the deviceTreeStoreData by changing the reference
          this.deviceTreeStoreData = JSON.parse(
            JSON.stringify(this.deviceTreeStoreData)
          );

          this.deviceTreeStoreData[index][propertyName] = value;
          /* Refractor to a function with passing parameter */
          /* If name is updated, update the filling line reducer and related automation component */
          if (propertyName === 'name') {
            this.facadeService.fillingLineService.updateNode(deviceNode[0]?.id, {
              deviceName: value
            });
            this.deviceTreeStoreData[index].automationComponents.forEach(ac => ac.deviceName = value);


          }
          /*
          *If address is updated,update the filling line reducer and related automation component
          */
          if (propertyName === 'address') {
            this.deviceTreeStoreData[index].automationComponents.forEach(ac => ac.address = value);
            this.facadeService.fillingLineService.updateNode(deviceNode[0]?.id, {
              address: value
            });
          }
          /*
          *update device tree store data
          */
          this.facadeService.dataService.setDevice(this.deviceTreeStoreData[index]);
          this.updateDeviceListToStore();
          this.onDeviceSelected.emit(this.deviceTreeStoreData[index]);
        }
      },
        error => {
          log(error);
        }
      );
    }
  }


  /**
   * @param {string} propertyType - propertyType to be updated clicked by the user
   * @param {string} propertyTypeToBeUpdated - propertyTypeToBeUpdated to be updated
   * @param {string} currentValue - currentValue entered by the user
   * @param {boolean} isPreviousValue - is it called from the original value
   * @param {string} oldValue - previous value
   * @param {string} device - device reference
   *
   */
  updateBasedOnProperty(propertyType: string, propertyTypeToBeUpdated: string, currentValue: string, isPreviousValue: boolean, oldValue?: string, device?: Device) {
    return this.facadeService.deviceService.updateBasedOnProperty(propertyType, propertyTypeToBeUpdated, currentValue, isPreviousValue, oldValue, device);
  }
  /*
  *  Validate the address against the regex
  *
  */
  validateRegex(currentValue, oldValue) {
    if (validateAddress(IP_ADDRESS_REGEX_VALIDATOR, currentValue)) {
      return currentValue;
    }
    return oldValue;
  }
  /*
  *  check if the device exists already
  *
  */
  checkDeviceExists(event, device) {
    const deviceTreeCopy = [...this.deviceTreeStoreData];
    const indexOfObject = deviceTreeCopy.findIndex(object => object.uid === device.uid);
    deviceTreeCopy.splice(indexOfObject, 1);
    const deviceExists = deviceTreeCopy.filter(res => res.address === event);
    if (deviceExists.length > 0) {
      device.error.ipAddressUniqueError = true;
    } else {
      device.error.ipAddressUniqueError = false;
    }
  }
  /*
  *  hide the error when cross button is clicked
  *
  */
  hideError(device, key) {
    device.error[key] = false;
  }

  /*
  *  when we authenticate the project
  *
  */
  onSubmitProjectProtection(formData: Array<ProjectProtection>) {
    if (formData && formData.length > 0) {
      const validCredentials = formData.filter(el => el.credentials.password && el.credentials.confirmPassword);
      const payload = validCredentials.map(el => {
        return {
          password: el.credentials.password,
          accessType: el.mode,
          projectName: this.facadeService.dataService.getProjectName()
        };
      });
      this.registerPassword(payload);
    }
  }
  /*
  *  Register the password for read and write access
  *
  */
  registerPassword(payload: ProtectProject[]) {
    this.facadeService.apiService.registerPassword(payload).subscribe(accessDetailsArray => {
      accessDetailsArray.forEach(accessDetails => {
        if (accessDetails && accessDetails.data) {
          const haveReadAccess = payload.some(el => el.accessType === AccessType.READ);
          if (haveReadAccess) {
            this.facadeService.dataService.setHaveReadAccess(true);
          }
          this.facadeService.dataService.updateProtectionToProject(true);
        }
      });
      this.showProjectProtectionModel = false;
      this.facadeService.dataService.setAccessType(AccessType.WRITE);
      this.facadeService.notificationService.pushNotificationToPopup({ content: 'notification.info.writePasswordSetup', params: {} },
        NotificationType.INFO, HTTPStatus.SUCCESS);
      if (this.isDeviceFailedInReBrowse && this.reBrowseDeviceList.length > 0) {
        this.openDeviceAuthManual();
      } else {
        this.loadDeviceAuth();
      }
    });
  }
  /**
   * Changes the particular device name field to input field
   * @param device
   */
  editableMode(device: Device) {
    device.partialSelected = true;
  }
  /**
   * Function to trim the given the text to a specified length
   * @param labelName
   * @returns Name after truncating the string to specified length
   */
  truncateName(labelName: string) {
    if (labelName.length > Numeric.TWENTYFIVE) {
      return `${labelName.substring(0, Numeric.TWENTYFIVE)}...`;
    }
    return labelName;
  }
  /**
   * Check if the device name length is greater than 100
   * @param event
   * @param device
   */
  deviceNameLengthCheck(event, device: Device) {
    if (event.length === Numeric.ONEHUNDRED) {
      device.error.deviceNameLengthError = true;
    } else {
      device.error.deviceNameLengthError = false;
    }
  }
}


/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FacadeService } from '../../../../app/livelink-editor/services/facade.service';

import { AddDeviceType, Numeric } from '../../../enum/enum';
import { DevicesDetails, FileUploadList } from '../../../models/connection.interface';
import { DeviceConfig } from '../../../models/targetmodel.interface';
import { FormOverlay } from '../../../shared/dialog/form-dialog/form-overlay';
import { validateTextRegex } from '../../../shared/services/validators.service';
import {
    defaultTCPIPAddress as defaultTCPIpAddress,
    emptyUploadFileList,
    NO_DEVICES_SELECTED
} from '../../../utility/constant';
import { getUniqueElement } from '../../../utility/utility';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'devices-base-modal-dialog',
    templateUrl: './devices-base-modal-dialog.component.html',
    styleUrls: ['./devices-base-modal-dialog.component.scss', '../../../shared/dialog/form-dialog/form-overlay-body.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DevicesBaseModalDialogComponent extends FormOverlay {
    title = this.facadeService.translateService.instant('devices.titles.addNewDevice');
    constant = '';
    tabView= 'add';
    nextTabView:string = AddDeviceType.BROWSE_ONLINE;
    importedDeviceList: Array<DevicesDetails | null>=[];
    addedDeviceList: Array<DeviceConfig>;
    @Output() onAddingDeviceToMain = new EventEmitter();
    @Output() hide = new EventEmitter();
    maxGridLength: number = Numeric.EIGHT;
    filesToUpload: File[];
    uploadFileTableColumns: string[] = ['', 'devices.titles.deviceName', 'devices.titles.address', 'devices.titles.importFiles', ''];
    cancelButtonTxt = 'Cancel';
    previousChecked: DeviceConfig[] = [];
    nodeSetFileCounter = 0;

    constructor(
        private readonly facadeService: FacadeService
    ) {
        super();
        this.addedDeviceList = [];
        this.initializeDeviceListInGrid();
    }
/**
 *
 * 
 *  Create a fixed array of max grid length
 */
    createFixedArray() {
        return Array(this.maxGridLength).fill(null);
    }
    /**
     * Initialize the deviceList for the first time
     * 
     * if there is no devices to be added for UI purpose
     * 
     * assign No devices found in first element
     */
    initializeDeviceListInGrid() {
        this.importedDeviceList = this.createFixedArray();
        this.importedDeviceList[0] = {
            isValid: false,
            deviceName: this.generateDeviceNameIfEmpty()
        };
    }

    /**
    * load device add details when 'next' button is clicked in device add method
    * and data is emitted to device add dialog
    * 
    */
    loadOnlineBrowsePage(data: string) {
        this.facadeService.commonService.updateDeviceAdditionType(data);
        this.nextTabView = data;
    }

    /**
    * load device add method when 'back' button is clicked in device add detail
    * and data is emitted to device add dialog
    * 
    */
    loadAddSelectionPage(data: string) {
        if (data === 'back') {
            this.filesToUpload = [];
        }
        this.tabView = data;
        this.nextTabView = AddDeviceType.BROWSE_ONLINE;
    }
    
    /*
    *
    * 
    * Once the devices are added to the list update the device list in the grid
    */
    addDeviceToList(data:Array<DeviceConfig>) {
        this.addedDeviceList = data;
        this.facadeService.commonService.updateDevicesListInGrid(this.addedDeviceList);
    }

    /**
    *
    * 
    *  Close the dialog and emits hide event to device main
    */
    cancel() {
        this.hide.emit();
    }

    /**
    * 
    * 
    * Disables add button when no devices is added to grid
    */
    addButtonDisabled() {
        let disabled = false;
        if (this.tabView === AddDeviceType.BROWSE_ONLINE) {
            if (this.addedDeviceList.length === 0) {
                disabled = true;
            } else {
                const disabledDeviceCount = this.addedDeviceList.filter(device => device && (device.isValidAddressModel=== false || device.isSecurityPolicyValid === false)).length;
                if (this.addedDeviceList.length === disabledDeviceCount) {
                    disabled = true;
                }
            }
        }
        else {
            if (this.importedDeviceList[0]?.deviceName === NO_DEVICES_SELECTED || this.importedDeviceList[0]?.deviceName === emptyUploadFileList) {
                disabled = true;
            }
        }
        return disabled;
    }

    /**
    * Calls browse api from backend to get complete device information like node ID's
    * and emits the browse to device main which will used to create tiles
    * 
    * 
    */
    onFinalDeviceAdd() {
        if (this.tabView === AddDeviceType.BROWSE_ONLINE) {
            this.onAddingDeviceToMain.emit(this.addedDeviceList);
        } else {
            this.importedDeviceList = this.importedDeviceList.filter(device => device && device.isValid);
            this.importedDeviceList = this.requestMapper(this.importedDeviceList);
            const reqPayload = {
                deviceList: this.importedDeviceList,
                files: this.filesToUpload
            };
            this.onAddingDeviceToMain.emit(reqPayload);
        }
    }
    /**
     *
     * 
     *  deleteFileByDeviceName
     */
    deleteFileByDeviceName(deviceDetail) {
        const { fileName ,deviceName } = deviceDetail;
        this.filesToUpload = this.filesToUpload.filter(file => file.name !== fileName);
        const filteredFileGridList = this.importedDeviceList.filter(item => item && item?.deviceName !== deviceName);
        // Creating a fixed array of grid length and adjusting the index(deleted) to replace
        const fixedArray = this.createFixedArray();
        fixedArray.splice(0, filteredFileGridList.length, ...filteredFileGridList);

        this.importedDeviceList = fixedArray as DevicesDetails[];
        if (!this.importedDeviceList[0]) {
            this.importedDeviceList[0] = {
                deviceName: this.generateDeviceNameIfEmpty(),
                isValid: false
            };
        }
    }


    /**
    * 
    * Get the element of the array to be deleted from device grid
    */
    getDeviceElementToRemove(deviceName: string): number {
        let result = -1;
        for (let i = 0; i < this.addedDeviceList.length; i++) {
            this.importedDeviceList[i].deviceName = `${this.addedDeviceList[i].name} [${this.addedDeviceList[i].address}]`;

            if (this.importedDeviceList[i].deviceName === deviceName) {
                result = i;
                break;
            }
        }
        return result;
    }

    /*
    *
    * Function is called when the nodeset files are uploaded
    */
    addNodeSetFilesToList(_files: FileUploadList[]) {
        const files = Array.from(_files);
        _files = _files.filter(file => file.isValid);
        if (this.filesToUpload && this.filesToUpload.length>0) {
            const extractFiles = _files.map(file => file.file);
            this.filesToUpload = [...this.filesToUpload, ...extractFiles];
        } else {
            this.filesToUpload = _files.map(file => file.file);
        }
        let validFiles = this.importedDeviceList.filter(file => file && file.deviceName !== emptyUploadFileList).length;
        for (let i = 0; i < files.length; i++,validFiles++) {
            this.importedDeviceList[validFiles] = {
                deviceName: `Imported_Device_${this.nodeSetFileCounter+1}`,
                isValid: files[i].isValid,
                address: files[i].address,
                fileName: files[i].name,
                error: files[i].error,
                applicationIdentifierTypes: files[i].applicationIdentifierTypes
            };
            this.nodeSetFileCounter++;
        }
    }
    /*
    *
    * Show a message to upload nodeset file if no nodeset file is uploaded
    */
    generateDeviceNameIfEmpty() {
        return emptyUploadFileList;
    }
    /*
    * 
    * Show a message to upload nodeset file if no nodeset file is uploaded
    */
    get showNoDeviceData() {
        return this.importedDeviceList[0].deviceName === emptyUploadFileList || this.importedDeviceList[0].deviceName === NO_DEVICES_SELECTED;
    }
    /*
    *
    *  Validation for the address using validate text regex when the nodeset files are uploaded
    */
    customValidationForAddress(value) {
        const { event, i } = value;
        const regexText = this.facadeService.commonService.projectRegex.deviceUrlValidationRegex;
        const deviceAddress = event.target.value.trim();
        if (validateTextRegex(regexText, deviceAddress)) {
            this.importedDeviceList[i].address = deviceAddress;
        } else {
            this.importedDeviceList[i].address = defaultTCPIpAddress;
        }
    }

    requestMapper(deviceListInGrid) {
        return deviceListInGrid.map(({ address, applicationIdentifierTypes, deviceName, fileName }) => ({
            address,
            applicationIdentifierTypes,
            deviceName,
            fileName
        }));
    }
    /*
    * When the next button is pressed
    */
    next() {
        this.tabView = this.nextTabView;
    }
    /*
    * When the scanned devices are added
    */
    onScannedDevicesAdded(event) {
        this.addedDeviceList = this.deviceConfigMapper(event, this.addedDeviceList, this.previousChecked);
        this.previousChecked = event;
    }

    deviceConfigMapper(data, existingDevices, previousSelection): DeviceConfig[] {
        if (previousSelection.length > 0) {
            previousSelection.forEach(unSelected => {
                const indexDelete = existingDevices.findIndex(el => el.address === unSelected.address);
                if (indexDelete !== -1) {
                    existingDevices.splice(indexDelete, 1);
                }
            });
        }
        const selectedDevice = data.map(device => {
            return {
                address: device.address,
                name: device.deviceName,
                uid: uuidv4(),
                isProtected: device.isProtected,
                isDeviceAuthRequired: device.isDeviceAuthRequired,
                isSecurityPolicyValid: device.isSecurityPolicyValid,
                isValidAddressModel: device.isValidAddressModel
            };
        });
        return getUniqueElement([...existingDevices, ...selectedDevice], 'address');
    }
}


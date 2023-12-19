/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { defaultTCPIPAddress } from '../../../utility/constant';

import { FileFormat, FileUploadErrors } from '../../../enum/enum';
import { FileUploadList } from '../../../models/connection.interface';
import { FacadeService } from '../../../livelink-editor/services/facade.service';


@Component({
    selector: 'app-devices-import-from-file-modal',
    templateUrl: './devices-import-from-file-modal.component.html',
    styleUrls: ['./devices-import-from-file-modal.component.scss']
})
export class DevicesImportFromFileModalComponent implements OnInit {
    @Input()
    uploadFileTableColumns;
    @Input()
    tabView;
    @Input()
    showNoDeviceData;
    @Input()
    importedDeviceList;
    @Input()
    deviceListInGrid;
    addMethodForm: FormGroup;
    @Output() onPreviousPage = new EventEmitter();
    @Output() deleteFromGrid = new EventEmitter();
    @Output() customValidationForDeviceAddress = new EventEmitter();
    deviceName: string;
    fileFormat: FileFormat;
    @Output() onNextPage = new EventEmitter();

    filesData: FileUploadList[] = [];
    errorFiles: FileUploadList[];
    files: File[];
    showValidationError: boolean;
    nodeSetFileCounter = 0;

    constructor(private readonly facadeService: FacadeService) { }

    nextButtonDisabled: boolean;
    /**
     *
     * Called when the page is loaded
     */
    ngOnInit(): void {
        this.fileFormat = FileFormat.BLOB;
        this.addMethodForm = new FormGroup({
            sourcePath: new FormControl(
                { value: null, disabled: false },
                { validators: [Validators.required] }
            )
        });
        this.validationErrors();
    }
    /**
     *
     * Called on click of back button
     */
    onBack() {
        this.filesData = [];
        this.addMethodForm.reset();
        this.onPreviousPage.emit('back');
    }
    /**
     *
     * Called on click of add device button
     */
    addDevice() {
        this.addMethodForm.reset();
        this.onNextPage.emit(this.filesData);
        this.filesData = [];
    }

    /**
     * 
     * Call the function argument only when Enter key or NumberPad Enter key is pressed
     */
    handleKeyPressEnter(ev: KeyboardEvent, fn) {
        if (ev.key === 'Enter' || ev.key === 'NumpadEnter') {
            this[fn.name]();
        }
    }
    /**
     *
     * Called when the file is uploaded in the input field
     */
    onFileUploaded(files) {
        if (files.length > 0) {
            this.showValidationError = false;
            this.files = files;
            this.filesData = [];
            this.validateXML(files);
        }
    }
    /**
     *
     * Validates the xml
    */
    validateXML(files) {
        const fileMap = new Map();
        for (const file of files) {
            const fileReader = new FileReader();
            fileMap.set(fileReader, file);
        }
        const mapEntries = fileMap.entries();
        this.readFile(mapEntries);
    }
    /**
     *
     * Read the file data
     */
    readFile(mapEntries) {
        const nextValue = mapEntries.next();

        if (nextValue.done === true) {
            return;
        }

        const [fileReader, file] = nextValue.value;

        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            const { isValid, applicationIdentifierTypes, error } =
                this.facadeService.xmlHelperService.validateXmlService(fileReader.result.toString());
            this.mapFileData(file, isValid, applicationIdentifierTypes, error);
            this.readFile(mapEntries);
        };
    }
    /**
     *
     * Map the file data
     */
    mapFileData(
        file: File,
        isValid: boolean,
        applicationIdentifierTypes: Object,
        error: FileUploadErrors
    ) {
        const fileData: FileUploadList = {
            name: file.name,
            address: defaultTCPIPAddress,
            deviceName: `Imported_Device_${this.nodeSetFileCounter + 1}`,
            isValid,
            file,
            applicationIdentifierTypes,
            error
        };
        this.filesData.push(fileData);
        this.validationErrors();
    }
    /**
     *
     * Lists the error files 
     */
    validationErrors() {
        this.errorFiles = this.filesData.filter(file => !file.isValid);
        if (this.errorFiles.length > 0) {
            this.showValidationError = true;
        }

        return this.errorFiles;
    }
    /**
     *
     * Function used to hide the validation error
     */
    hideValidationError() {
        this.showValidationError = !this.showValidationError;
        this.addMethodForm.patchValue({
            sourcePath: this.filesData
        });
    }
    /**
     *
     * Get method to disable the next button based on no of files
     */
    get disableNextBtn() {
        return this.filesData.length === 0;
    }

    /**
     *
     * Function to delete the file by using device name
     */
    deleteFileByDeviceName(event) {
        this.deleteFromGrid.emit(event);
    }
    customValidationForAddress(event) {
        this.customValidationForDeviceAddress.emit(event);
    }
}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { load } from 'js-yaml';
import uniqid from 'uniqid';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import  Ajv from '../../../../../node_modules/ajv';
import { dateDefaultLanguage, FileFormat, HTTPStatus, NotificationType, Numeric } from '../../../enum/enum';
import { FilePayload } from '../../../models/payload.interface';
import { ProjectData, UserDetails } from '../../../models/models';
import { Response } from '../../../models/response.interface';
import { FormOverlay } from '../../../shared/dialog/form-dialog/form-overlay';
import { projectNameValidator } from '../../../shared/services/validators.service';
import { isNullOrEmpty } from '../../../utility/utility';
const PROJECT = 'project';
const USER_PASSWORD_DETAILS = 'userPasswordDetails';
const PASSWORD = 'password';
const READ = 'read';
const WRITE = 'write';
const ACCESS_TYPE = 'accessType';
@Component({
  selector: 'import-project',
  templateUrl: './import-project.component.html',
  styleUrls: ['./import-project.component.scss', './../../../shared/dialog/form-dialog/form-overlay-body.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImportProjectComponent extends FormOverlay implements OnInit {

  invalidProjectMsg = 'Project Name is Invalid';
  @Output() hide = new EventEmitter();
  @Output('onProjectImported') onProjectImported = new EventEmitter();
  error = false;
  errorMessage = '';
  errorSolution = '';

  importForm: FormGroup;
  fileFormat: FileFormat;
  ajv = new Ajv();

  constructor(private readonly facadeService: FacadeService) {
    super();
  }

  title: string;
  /*
  *
  * This life cycle hook is called when the page is initialized
  */
  ngOnInit() {
    this.title = this.facadeService.translateService.instant('home.titles.importProject');
    this.fileFormat = FileFormat.CONTENT_STRING;
    this.initializeForm();
    this.importForm.controls.sourcePath.valueChanges.subscribe(() => {
      if (!isNullOrEmpty(this.importForm.controls.sourcePath.value) && typeof (this.importForm.controls.sourcePath.value) == 'object') {
        if (!this.validateProjectData()) {
           /*
           *
           *If not valid return the error msgs
           */
          this.facadeService.overlayService.error({
            header: this.facadeService.translateService.instant('overlay.error.importProjectFailed.header'),
            message: {
              title : this.facadeService.translateService.instant('overlay.error.importProjectFailed.message.title'),
              content: [this.facadeService.translateService.instant('overlay.error.importProjectFailed.message.content')]
            },
            successLabel: this.facadeService.translateService.instant('common.buttons.ok')
          });
           this.facadeService.notificationService.pushNotificationToPopup({content : 'notification.error.wrongFileFormat',params:{}}, NotificationType.ERROR, HTTPStatus.ERROR);
        }else {
          /*
           *
           *Project is valid :  import the project to the application
           */
          this.enablecontrols();
          this.removeFormErrors();
          this.readProjectName();
        }
      }
    });
    /*
    *
    * Remove errors(if exists) related to when changes are made to name field.
    */
    this.importForm.get('name').valueChanges.subscribe(_value => {
      this.removeFormErrors();
    });
  }
  /**
   * Initialize the import project form
   */
  initializeForm() {
    this.importForm = new FormGroup({
      id: new FormControl(uniqid.time()),
      sourcePath: new FormControl({ value: null, disabled: false }, { validators: [Validators.required] }),
      name: new FormControl({ value: '', disabled: true }, {
        validators:
          [Validators.required, projectNameValidator(
            [this.facadeService.commonService.projectRegex.projectSpecialCharacterRegex,
            this.facadeService.commonService.projectRegex.projectReserveKeyWordRegex])]
      }),
      comment: new FormControl({ value: '', disabled: true }),
      author: new FormControl({ value: '', disabled: true }),
      created: new FormControl(new Date().toLocaleString(dateDefaultLanguage.UNITED_STATES)),
      modified: new FormControl(new Date().toLocaleString(dateDefaultLanguage.UNITED_STATES)),
      modifiedby: new FormControl(''),
      isProtected: new FormControl(false, [])
    });
  }
  /**
   * Reset Modal on clicking cancel and after importing the project
   */
  resetModal() {
    this.importForm.reset();
  }
  /**
   * Cancel click handler
   */
  cancel() {
    this.resetModal();
    this.hide.emit();
  }
  /**
   * import Project click handler,checks unique name
   */
  importProject() {
    if (!isNullOrEmpty(this.importForm) && !isNullOrEmpty(this.importForm.controls)) {
      const fileData = load((this.importForm.controls.sourcePath.value as FilePayload).ContentString) as ProjectData;
      const savePayload = this.getImportPayload(fileData, this.importForm.value);
      savePayload.project.created=this.importForm.value.created;
      savePayload.project.modified=this.importForm.value.modified;
      savePayload.project.modifiedby=this.importForm.value.author;
      this.facadeService.apiService.importProject(savePayload).subscribe(res => {
        if ((res as Response).data.code === HTTPStatus.SUCCESS) {
          this.onProjectImported.emit(this.importForm.value as ProjectData);
          this.resetModal();
        }
      }, () => {
        this.error = true;
        this.errorMessage = this.facadeService.translateService.instant('home.error.projectName.errorMessage');
        this.errorSolution = this.facadeService.translateService.instant('home.error.projectName.errorSolution');
        this.importForm.controls.name.setErrors({ 'duplicate': true });
      }
      );
    }
  }
  /*
  * Payload for import project api
  *
  */
  getImportPayload(projectData: ProjectData, formdata) {
    /*
    *
    *update project data name with form data name
    */
    if (formdata.name) {
      projectData.project.name = formdata.name;
    }
    if (formdata.author) {
      projectData.project.author = formdata.author;
    }
    if (formdata.comment) {
      projectData.project.comment = formdata.comment;
    }
    projectData.project.id = formdata.id;
    return { ...projectData };
  }

  /*
  *Function to enable the form controls
  */
  enablecontrols() {
    this.importForm.controls.name.enable({ onlySelf: true });
    this.importForm.controls.comment.enable({ onlySelf: true });
    this.importForm.controls.author.enable({ onlySelf: true });
  }

  /*
  *Read the project data from the file to the form
  *
  *
  */
  readProjectName() {
    let filename = '';
    let comment = '';
    let author = '';
    let isProtected = false;
    if (!isNullOrEmpty(this.importForm) && !isNullOrEmpty(this.importForm.controls)) {
      if (this.importForm.controls.sourcePath.value as FilePayload) {
        filename = (load((this.importForm.controls.sourcePath.value as FilePayload).ContentString) as ProjectData).project.name;
        author = (load((this.importForm.controls.sourcePath.value as FilePayload).ContentString) as ProjectData).project.author;
        comment = (load((this.importForm.controls.sourcePath.value as FilePayload).ContentString) as ProjectData).project.comment;
        isProtected = (load((this.importForm.controls.sourcePath.value as FilePayload).ContentString) as ProjectData).project.isProtected;
      }
      else {
        filename = (this.importForm.controls.sourcePath.value as FilePayload).FileName;
      }
      this.importForm.controls.name.setValue(this.getProjectName(filename), { emitEvent: false, onlySelf: true });
      this.importForm.controls.comment.setValue(comment, { emitEvent: false, onlySelf: true });
      this.importForm.controls.author.setValue(author, { emitEvent: false, onlySelf: true });
      this.importForm.controls.isProtected.setValue(isProtected, { emitEvent: false, onlySelf: true });
      this.importForm.updateValueAndValidity();
    }
  }

  /*
  * Validating project data with proper key and type
  */
  validateProjectData() {
    let fileData;
    try{
    fileData = load((this.importForm.controls.sourcePath.value as FilePayload).ContentString) as ProjectData;
    } catch{
      return false;
    }
    /*Project schema is defined here*/
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        id: { type: 'string' },
        date: { type: 'string' },
        created: {},
        author: { type: 'string' },
        modified: {},
        modifiedby: { type: 'string' },
        comment: { type: 'string' },
        isSelected: { type: 'boolean' }
      },
      required: ['name', 'id', 'created', 'author', 'modified', 'modifiedby', 'comment']
    };
    /*Project related */
    if (fileData.hasOwnProperty('project')) {
      const validate = this.ajv.compile(schema);
      const valid = validate(fileData.project);
      if (!valid) {
        return false;
      }
    } else {
      return false;
    }
    /*Tree strucute and scan settings related */
    if (this.checkTreeStructure(fileData) || this.checkEditorScanSettingStructure(fileData) || this.checkProjectProtection(fileData)) {
      return false;
    }
    return true;
  }
  /**
   *  Check if the uploaded file consists of password details if IsProtected key is true
   * @param fileData 
   */
  checkProjectProtection(fileData:ProjectData){
    let result = false;
    if(fileData.hasOwnProperty(PROJECT) && fileData.project.isProtected){
      if(fileData.hasOwnProperty(USER_PASSWORD_DETAILS) && Array.isArray(fileData.userPasswordDetails)){
        result =  this.validatePasswordData(fileData);
      }else{
        result =  true;
      }
    }
    return result;
  }
  /**
   * Check for the write and read access details
   * @param fileData 
   * @returns 
   */
  validatePasswordData(fileData:ProjectData){
    let result;
    if(fileData.userPasswordDetails.length === Numeric.TWO){
     result =  !(fileData.userPasswordDetails[0].hasOwnProperty(PASSWORD) 
     && fileData.userPasswordDetails[1].hasOwnProperty(PASSWORD)
     && this.checkAccessType(fileData.userPasswordDetails[0],WRITE) 
     && this.checkAccessType(fileData.userPasswordDetails[1],READ));
    }
    if(fileData.userPasswordDetails.length === Numeric.ONE){
      result =  !(fileData.userPasswordDetails[0].hasOwnProperty(PASSWORD) && this.checkAccessType(fileData.userPasswordDetails[0],WRITE));
    }
    return result;
  }
  /**
   * Check if the passwordData contains the key accesstype and checks the accessType value
   * @param passwordData 
   * @param accessType 
   * @returns 
   */
  checkAccessType(passwordData:UserDetails,accessType:string){
    return passwordData.hasOwnProperty(ACCESS_TYPE) && passwordData.accessType === accessType;
  }


  /*
  *
  *It will check tree property structure from project data
  */
  checkTreeStructure(fileData){
    return !(fileData.hasOwnProperty('tree')
    && (fileData.tree != null && fileData.tree.hasOwnProperty('devices'))
    && Array.isArray(fileData.tree.devices));
  }
 /*
  *
  *It will check scan setting related structure from project data
  */
  checkEditorScanSettingStructure(fileData){
    return !(fileData.hasOwnProperty('editor')
    && fileData.hasOwnProperty('scanSettings'));
  }
  /*
  * Function to get the project name before "." ex:abc.yaml name: abc
  */
  getProjectName(fileName: string): string {
    let name = '';
    if (fileName) {
      name = fileName.split('.')[0];
    }
    return name;
  }
  /*
  *Function to remove the form errors
  */
  removeFormErrors() {
    if (this.importForm.controls.name.hasError('duplicate')) {
      this.importForm.controls.name.setErrors({ 'duplicate': null });
    }
    this.error = false;
  }
  /*
  * Throw error if the form is invalid or project name is not correct
  */
  projectError() {
    return !this.importForm.valid && this.importForm.controls.name.hasError('projectNameError');
  }
  /*
  * Function to hide errors
  */
  hideError() {
    this.error = false;
  }
}

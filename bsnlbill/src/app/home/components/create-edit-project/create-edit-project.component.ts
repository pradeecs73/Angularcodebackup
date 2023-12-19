/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { dateDefaultLanguage } from './../../../enum/enum';
import uniqid from 'uniqid';
import { Project, ProjectData } from '../../../models/models';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { FormOverlay } from '../../../shared/dialog/form-dialog/form-overlay';
import { projectNameValidator } from '../../../shared/services/validators.service';

const MODE_CREATE='create';
const MODE_EDIT='edit';
const MODE_SAVEAS='saveas';
const CREATE_PROJECT='Create Project';
const EDIT_PROJECT='Edit Project';
const SAVEAS_PROJECT='Save Project As'
@Component({
  selector: 'create-edit-project',
  templateUrl: './create-edit-project.component.html',
  styleUrls: ['./create-edit-project.component.scss','./../../../shared/dialog/form-dialog/form-overlay-body.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateEditProjectComponent extends FormOverlay implements OnChanges, OnInit {

  invalidProjectMsg = 'Project Name is Invalid';
  @Input() projects: Project;
  @Input() mode: string = MODE_CREATE;
  @Output() hide = new EventEmitter();
  @Output() onProjectAdded = new EventEmitter();
  error = false;
  errorMessage = '';
  errorSolution = '';
  title = CREATE_PROJECT;
  //buttonCheck: boolean = true;
  buttonlabel=this.facadeService.translateService.instant('home.button.create');

  createForm: FormGroup;
  projectList: ProjectData[];
  currentProject: ProjectData;
  formEdited  = false;
  nameEdited = true;
  originalFormData : ProjectData;

  constructor(private readonly facadeService: FacadeService) {
    super();
  }
  /*
  *
  *This lifecycle hook is called when the component is initialized
  *
  */
  ngOnInit(): void {
    this.init();
  }
/*
  *
  *This lifecycle hook is called when there are changes 
  */
  ngOnChanges(): void {
    this.init();
  }
  /*
  *
  *This function is used to set the data based on mode
  */
  init() : void
  {
    this.setPageTitle(this.mode);
    if (!this.createForm) {
      this.initializeForm();
    }
    if (this.mode === MODE_EDIT && this.projects) {
      this.setEditOrSaveAsFormData();
      this.buttonlabel = this.facadeService.translateService.instant('home.button.save');
      this.originalFormData = { ...this.createForm.value};
      this.createForm.valueChanges.subscribe((res : ProjectData)=>{
        this.checkForFormValueChanges(res);
      });
    }
    if (this.mode === MODE_SAVEAS && this.projects) {
      this.setEditOrSaveAsFormData();
      this.buttonlabel = this.facadeService.translateService.instant('common.buttons.ok');
    }
    this.createForm.get('name').valueChanges.subscribe(_value => {
      this.removeFormErrors();
    });
  }
  /*
  *
  *Function is used to set the page title
  */
  setPageTitle(mode) :void
  {
    if(mode.toLocaleLowerCase() === MODE_CREATE)
    {
      this.title = this.facadeService.translateService.instant('home.titles.createNewProject');
    }
    else if(mode.toLocaleLowerCase() === MODE_SAVEAS){
      this.title = this.facadeService.translateService.instant('home.titles.saveProjectAs');
    }
    else{
      this.title = this.facadeService.translateService.instant('home.titles.editProject');
    }
  }
  /*
  *
  *This function is called to initialize the form
  */
  initializeForm() {
    this.createForm = new FormGroup({
      //Id is added as form control
      id: new FormControl(uniqid.time()),
      name: new FormControl({ value: '', disabled: false }, { validators: [Validators.required,
            projectNameValidator([this.facadeService.commonService.projectRegex.projectReserveKeyWordRegex,
                              this.facadeService.commonService.projectRegex.projectSpecialCharacterRegex])] }),
      comment: new FormControl({ value: '', disabled: false }),
      author: new FormControl({ value: '', disabled: false }),
      created: new FormControl(new Date().toLocaleString(dateDefaultLanguage.UNITED_STATES)),
      modified: new FormControl(new Date().toLocaleString(dateDefaultLanguage.UNITED_STATES)),
      modifiedby: new FormControl('')
    });
  }
   /*
  *
  *This function is called when the form value changes
  */
  checkForFormValueChanges(data : ProjectData){
    if(this.originalFormData['name'] !== data['name'] ||
    this.originalFormData['comment'] !== data['comment'] ||
    this.originalFormData['author'] !== data['author']){
      this.formEdited = true;
    }else{
      this.formEdited = false;
    }

    if(this.originalFormData['name'] !== data['name']){
      this.nameEdited = true;
    }else{
      this.nameEdited = false;
    }
  }
   /*
  *
  *This function is used to set the form data for edit or save as
  */
  setEditOrSaveAsFormData() {
    if (this.projects) {
      this.createForm.controls.name.setValue(this.projects.name);
      this.createForm.controls.author.setValue(this.projects.author);
      this.createForm.controls.comment.setValue(this.projects.comment);
      this.createForm.controls.id.setValue(this.projects.id);
    }
  }
  /*
  *
  *This function is called on cancel
  */
  cancel() {
    this.createForm.reset();
    this.hide.emit();
  }

   /*
  *
  *This function is called to remove the form errors
  */
  removeFormErrors() {
    if (this.createForm.controls.name.hasError('duplicate')) {
      this.createForm.controls.name.setErrors({ 'duplicate': null });
    }
    this.error = false;
  }
   /*
  *
  *This function is called to hide the error
  */
  hideError() {
    this.error = false;
  }
   /*
  *
  *This function is used to create a project based on saveas edit or create mode
  */
  createProject() {
   this.createForm.controls.name.value.trim();
    if(this.mode === MODE_CREATE || this.mode === MODE_SAVEAS || (this.mode === MODE_EDIT &&  this.nameEdited ) ){
      this.facadeService.apiService.validateProject(this.createForm.controls.name.value).subscribe(_res => {
          this.createForm.controls.modifiedby.setValue(this.createForm.controls.author.value);
          this.create();
          this.cancel();
      }, _error =>{
          this.error = true;
          this.errorMessage = this.facadeService.translateService.instant('home.error.projectName.errorMessage');
          this.errorSolution = this.facadeService.translateService.instant('home.error.projectName.errorSolution');
          this.createForm.controls.name.setErrors({ 'duplicate': true });
      });
    }else{
      this.createForm.controls.modifiedby.setValue(this.createForm.controls.author.value);
      this.editProject();
      this.cancel();
    }

  }
   /*
  *
  *This function is used to create a project
  */
  create(){
    if (this.mode === MODE_CREATE) {
      this.facadeService.saveService.cleanProjectData();
      this.onProjectAdded.emit(this.createForm.value as Project);
      this.facadeService.dataService.setProjectMetaData(this.createForm.value as Project);
      const data = this.facadeService.dataService.getProjectDataAsSaveJson();
      data.project.isProtected = false;
      this.facadeService.apiService.createProject(data).subscribe(_resAdd => true);
    }
    if(this.mode === MODE_SAVEAS){
      this.projectSaveAs(this.createForm.value as Project);
    }
    if(this.mode === MODE_EDIT){
      this.editProject();
    }
  }
 /*
  *
  *This function is used to create a project using save as
  */
  projectSaveAs(formValue: Project) {
    const projectData = { ...this.facadeService.dataService.getProjectData() };
    const projectPayload = {
      projectId: projectData.project.id,
      projectName: projectData.project.name,
      isProtected: projectData.project.isProtected,
      isExport: true
    };
    this.facadeService.apiService.getProjectData(projectPayload).subscribe(res => {
      const savaAsProjectData = res['data'];
      savaAsProjectData.project = formValue;
      savaAsProjectData.project['isProtected'] = this.projects.isProtected;
      savaAsProjectData.project.id = uniqid.time();
      this.facadeService.apiService.createProject(savaAsProjectData).subscribe(_resAdd => {
        this.facadeService.saveService.changeSaveASState(savaAsProjectData.project as Project);
      });
    });
  }
   /*
  *
  *This function is used show project related error
  */
  projectError() {
    return !this.createForm.valid && this.createForm.controls.name.hasError('projectNameError');
  }
   /*
  *
  *This function is called when the project is edited
  */
  editProject(){
    const payloadData = this.createForm.value;
    payloadData['isProtected'] = this.projects.isProtected;
    this.facadeService.dataService.setProjectMetaData(payloadData as Project);
    const data= this.facadeService.dataService.getProjectDataAsSaveJson();
    const payload = { updatedData: data, initialProjectName: this.projects.name };
    const formCopy = { ...this.createForm.value};
    this.facadeService.apiService.updateProject(payload).subscribe(_resEdit => {
      this.facadeService.saveService.changeEditState(formCopy as Project);
    });
  }
   /*
  *
  *This function disables or enables create button based on form validation and mode
  */
  get isCreateBtnDisabled(): boolean {
    return !this.createForm.valid || (this.mode === 'edit' && !this.formEdited);
  }

}

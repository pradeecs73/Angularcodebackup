/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { FileBrowseComponent } from './file-browse.component';
import { METHOD_NOT_IMPLEMENTED } from '../../utility/constant';
import { FileFormat } from '../../../app/enum/enum';
import { ReadVarExpr } from '@angular/compiler';
import { TranslateModule } from '@ngx-translate/core';
import { FacadeMockService } from 'src/app/livelink-editor/services/facade.mock.service';
import { FacadeService } from 'src/app/livelink-editor/services/facade.service';

fdescribe('FileBrowseComponent', () => {
  let component: FileBrowseComponent;
  let fixture: ComponentFixture<FileBrowseComponent>;
  let facadeMockService;
  let file = [{
    'lastModified': 1659354747111,
    'lastModifiedDate': 'Mon Aug 01 2022 17:22:27 GMT+0530 (India Standard Time)',
    'name': "BottleFilling.xml",
    'size': 90602,
    'type': "text/xml",
    'webkitRelativePath': ""
  }]
  const file1 = new File(["botlefilling"], "botlefilling.txt", {  type: "text/plain",});
  let evt = {
    target :{
      files : [
        file1
      ]
    }
  }


  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    TestBed.configureTestingModule({
      declarations: [ FileBrowseComponent ],
      imports : [TranslateModule.forRoot({})],
      providers: [ { provide: FacadeService, useValue: facadeMockService},]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should update true value', () => {
    component.writeValue('true');
    expect(component.value).toBe('true');
  });

  it('throw error when registeronchange is called', function() {
    expect(function() {
      component.registerOnChange();
    }).toThrowError(METHOD_NOT_IMPLEMENTED);
  });

  it('throw error when registerOnTouched is called', function() {
    expect(function() {
      component.registerOnTouched();
    }).toThrowError(METHOD_NOT_IMPLEMENTED);
  });

  it('throw error when setDisabledState is called', function() {
    expect(function() {
      component.setDisabledState();
    }).toThrowError(METHOD_NOT_IMPLEMENTED);
  });

  it('when the file is imported',() =>{
    component.ngAfterViewInit();
    component.c.patchValue(file);
    expect(component.c).toBeDefined();
    component.c.valueChanges.subscribe(res =>{
    })
  })

  it('set the file value',() =>{
    component.c.setValue(file);
    component.setFileValue();
    expect(component.fileName.nativeElement.value).toBeDefined();
  })

  it('generate filenames for multiple files',()=>{
   component.isMultiple = true;
    let value = component.generateFilesName(file);
    expect(value).toBe('BottleFilling.xml');
  })

  it('setter method for innervalue', fakeAsync( ()=>{
    component['innerValue'] = 'true';
    tick()
    expect(component['innerValue']).toBe('true');
  }))

  it('onclick',()=>{
    component.fileBrowse = { 
      nativeElement : jasmine.createSpyObj('nativeElement',['focus'])
    }
    component.onClick();
    expect(component.fileBrowse.nativeElement.focus).toHaveBeenCalled();
  })

  it('when the file is imported with fileformat blob',()=>{
    const file = {lastModified: 1678195394067,
      name: "2serverand2client.xml",
      size: 97696,
      type: "text/xml",
      webkitRelativePath: ""
    }
    component.fileFormat =FileFormat.BLOB;
    spyOn(window,'showOpenFilePicker').and.returnValue([{kind: "file" ,name: "2serverand2client.xml" ,getFile : ()=>{return file}}] as unknown as Promise<FileSystemFileHandle[]>)
    spyOn(component.onFileUploaded, 'emit').and.callThrough();
    component.onFileValueChange();
    expect(component.c).toBeDefined();
  })

  it('when the file is imported with fileformat blob',()=>{
    const file =  {name : 'test', size : '154kb'}
    component.fileFormat =FileFormat.CONTENT_STRING;
    spyOn(window,'showOpenFilePicker').and.returnValue([{getFile:()=>{return {text: ()=>{return file}}}}]  as unknown as Promise<FileSystemFileHandle[]>)
    spyOn(component.onFileUploaded, 'emit').and.callThrough();
    component.onFileValueChange();
    expect(component.c).toBeDefined();
  })

});

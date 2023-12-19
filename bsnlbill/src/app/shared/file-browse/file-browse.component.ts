/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { FileFormat } from '../../../app/enum/enum';
import { FilePayload } from '../../models/payload.interface';
import { METHOD_NOT_IMPLEMENTED } from '../../utility/constant';
import { isNullOrEmpty } from '../../utility/utility';

const YAML = "YAML File";
const XML = "XML";

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileBrowseComponent),
  multi: true
};
/**
 *  Window interface shows a file picker that allows a user to select 
 * a file or multiple files and returns a handle for the file(s). 
 */
declare global {
  interface Window {
    showOpenFilePicker(options);
  }
}

@Component({
  selector: 'file-browse',
  templateUrl: './file-browse.component.html',
  styleUrls: ['./file-browse.component.scss']
})
export class FileBrowseComponent
  implements ControlValueAccessor, AfterViewInit {
  /*
  * Variables for this component is declared here
  */
  @Input() c: FormControl = new FormControl();
  @Input() fileFilter?: string = '.yaml';
  @Input() buttonText: string;
  @Input() isMultiple?: boolean = false;
  @Input() fileFormat: FileFormat;
  @Output() onFileUploaded = new EventEmitter<File[] | FilePayload>();

  @ViewChild('fileBrowse') fileBrowse: ElementRef;
  @ViewChild('fileName') fileName: ElementRef;

  // fileInfo: RegExp = /.*,/;
  //while browsing yaml file will be visible
  accept = '.yaml';
  button = '...';
  /*
  * Register on change
  */
  registerOnChange(): void {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  /*
  * Register on touched
  */
  registerOnTouched(): void {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  /*
  * set disabled state
  */
  setDisabledState?(): void {
    throw new Error(METHOD_NOT_IMPLEMENTED);
  }
  /*
  * This lifecycle hook is called when the component's view is initialized
  */
  ngAfterViewInit() {
    this.c.valueChanges.subscribe(() => {
      if (!isNullOrEmpty(this.c.value)) {
        this.fileName.nativeElement.value = this.c.value.FileName || this.generateFilesName(this.c.value);
      } else {
        this.fileName.nativeElement.value = '';
      }
    });
    this.setFileValue();
  }

  /*
  * function to sent the file name
  */
  setFileValue() {
    if (this.c.value) {
      this.fileName.nativeElement.value = this.c.value.FileName;
    }
  }

  /*
  * function to generate file name
  */
  generateFilesName(value) {
    if (this.isMultiple) {
      return Array.from(value).map(elem => elem['name']).join(',');
    } else {
      return value.name || value.FileName;
    }
  }


  /*
  *The internal data model for form control value access
  */
  private innerValue = '';

  /*
  *get accessor
  */
  get value() {
    return this.innerValue;
  }

  /*
  *set accessor including call the onchange callback
  */
  set value(value) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }
  /*
  * Write value
  */
  writeValue(value: string) {
    this.innerValue = value;
  }

  /*
  *Set Focus to the control and open the file selection window on click in file browse control
  */
  onClick = () => {
    this.fileBrowse.nativeElement.focus();
  };

  /*
  *Reads the data from file and sets the browser control value
  */
  async onFileValueChange() {
    if (this.fileFormat === FileFormat.CONTENT_STRING) {
      const pickerOpts = {
        types: [
          {
            description: YAML,
            accept: {
              "yamlFile/*": [".yaml"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      };

      const [handle] = await window.showOpenFilePicker(pickerOpts);
      const file = await handle.getFile();
      const text = await file.text();
      const fileData: FilePayload = {
        FileName: file.name,
        ContentString: text,
        Size: file.size,
        Content: null
      } as FilePayload;
      this.c.setValue(fileData, { onlySelf: true });
      this.onFileUploaded.emit(fileData);
    }else{
      const pickerOpts = {
        types: [
          {
            description: XML,
            accept: {
              "XML/*": [".xml"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: true,
      };

      const handle = await window.showOpenFilePicker(pickerOpts);
      const fileList = [];
      await Promise.all(
        handle.map(async  handles => {
          const file = await handles.getFile();
          fileList.push(file);
        })
      );
      this.c.setValue(fileList, { onlySelf: true });
      this.onFileUploaded.emit(fileList);

    }
  }
}


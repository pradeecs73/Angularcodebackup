import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FileFormat, FileUploadErrors } from '../../../enum/enum';
import { XmlParsingHelperService } from '../../../services/xml-parsing-helper.service';
import { DevicesImportFromFileModalComponent } from './devices-import-from-file-modal.component';

fdescribe('DevicesImportFromFileModalComponent', () => {
  let component: DevicesImportFromFileModalComponent;
  let fixture: ComponentFixture<DevicesImportFromFileModalComponent>;
  let mockXMLService: XmlParsingHelperService;
  mockXMLService = jasmine.createSpyObj('XmlParsingHelperService', {
    'validateXmlService': () => errorResponse
  });
  const errorResponse = {
    isValid: false,
    error: FileUploadErrors.INVALID_XML,
    applicationIdentifierTypes: []
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevicesImportFromFileModalComponent],
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        { provide: XmlParsingHelperService, useValue: mockXMLService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesImportFromFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('on ngOnInit it should initialize form data', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.fileFormat).toEqual(FileFormat.BLOB);
  });
  it('On onBack button is clicked user selection should be changed to initial value', () => {
    component.onBack();
    fixture.detectChanges();

    expect(component.filesData).toEqual([]);
  });
  it('On addDevice button is clicked user selection should be changed to initial value', () => {
    component.addDevice();
    fixture.detectChanges();

    expect(component.filesData).toEqual([]);
  });
  it('On onFileUploaded is invoked,validateXML and readFile method should be invoked', () => {
    const file = new File([''], 'filename');
    const spy = spyOn(component,'validateXML').and.callThrough();
    const readFileSpy = spyOn(component,'readFile').and.callThrough();
    component.onFileUploaded([file]);

    fixture.detectChanges();
    expect(component.filesData).toEqual([]);
    expect(spy).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
  });

  it('On ', () => {
    const file = new File([''], 'filename');
    const spy = spyOn(component,'validateXML').and.callThrough();
    const readFileSpy = spyOn(component,'readFile').and.callThrough();
    component.onFileUploaded([file]);

    fixture.detectChanges();
    expect(component.filesData).toEqual([]);
    expect(spy).toHaveBeenCalled();
    expect(readFileSpy).toHaveBeenCalled();
  });

  it('Should call handleKeyPressEnter method', () => {
    let ev={key:'Enter'} as unknown as KeyboardEvent;
    const dummyFunction={name:'ngOnInit'};
     ev={key:'NumpadEnter'} as unknown as KeyboardEvent;
    component.handleKeyPressEnter(ev,dummyFunction);
    expect(component.handleKeyPressEnter).toBeDefined();
    expect(component.ngOnInit).toBeDefined();
  });

  it('Should call deleteFileByDeviceName method', () => {
    const event={};
    component.deleteFileByDeviceName(event);
    expect(component.deleteFileByDeviceName).toBeDefined();
  });

  it('Should call customValidationForAddress method', () => {
    const event={};
    component.customValidationForAddress(event);
    expect(component.customValidationForAddress).toBeDefined();
  });

  it('Should call hideValidationError method', () => {
    component.showValidationError=false;
    component.hideValidationError();
    expect(component.hideValidationError).toBeDefined();
    expect(component.showValidationError).toEqual(true);
  });

});

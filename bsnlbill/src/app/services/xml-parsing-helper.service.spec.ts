/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { TestBed } from '@angular/core/testing';
import { invalidHeaderXml } from '../../../mockData/XmlData/invalidHeaderXml';
import { invalidNodeXml } from '../../../mockData/XmlData/invalidNodeXml';
import { invalidXml } from '../../../mockData/XmlData/invalidXml';
import { xml } from '../../../mockData/XmlData/validXml';
import { XmlParsingHelperService } from './xml-parsing-helper.service';

fdescribe('XmlParsingHelperService', () => {
  let service: XmlParsingHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmlParsingHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('validateXmlService with valid xml',()=>{
    const res = service.validateXmlService(xml.validXml);
    expect(res).toBeDefined();

  })

  it('validateXmlService with invalid xml',()=>{
    const res = service.validateXmlService(invalidXml.invalidXml);
    expect(res).toBeDefined();
  })

  it('validateXmlService with invalid header xml',()=>{
    const res = service.validateXmlService(invalidHeaderXml.invalidXml);
    expect(res).toBeDefined();
  })

  it('validateXmlService with invalid  node xml',()=>{
    const res = service.validateXmlService(invalidNodeXml.invalidNodeXml);
    expect(res).toBeDefined();
  })
});

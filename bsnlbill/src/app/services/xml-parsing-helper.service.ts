/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';

import { FileUploadErrors } from '../enum/enum';
import { applicationIdentifierPath, headerUANodeSetPath, applicationIdentifierCount } from '../utility/constant';

@Injectable({
  providedIn: 'root'
})
export class XmlParsingHelperService {
  /*
  *
  * function to validate xml file
  *
  */
  public validateXmlService(base64XML) {
    const applicationIdentifierTypes = [];
    const base64XMLdata = base64XML.split(',')[1].trim();
    const decodedXML = atob(base64XMLdata);
    const parser = new DOMParser();
    const doc = parser.parseFromString(decodedXML, 'text/xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      return { isValid: false, error: FileUploadErrors.INVALID_XML, applicationIdentifierTypes };
    }
    return this.validateApplicationIdentifierType(doc);
  }
  /*
  *
  * Validate application identifier type in xml
  *
  */
  private validateApplicationIdentifierType(doc) {
    const isValid = false;
    const applicationIdentifierTypes = [];
    const applicationIdentifierNodes = doc.evaluate(applicationIdentifierPath, doc.documentElement, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const noOfApplicationIdentifierNodesType = doc.evaluate(applicationIdentifierCount, doc.documentElement, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const headerNode = doc.evaluate(headerUANodeSetPath, doc.documentElement, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    const headerList = headerNode.iterateNext();
    /*
    *
    * if no header is found throw error
    */
    if (!headerList) {
      return {
        isValid,
        applicationIdentifierTypes,
        error: FileUploadErrors.XML_HEADER_MISSING
      };
    }
    let nodeList = applicationIdentifierNodes.iterateNext();
    /*
    *
    *acCount - no of automation component tag present in the node-set xml with/without name
    */
    const acCount = this.getApplicationIdentifierCount(noOfApplicationIdentifierNodesType);
    /*
    *
    * if nodeList is not found throw error
    */
    if (!nodeList) {
      return {
        isValid,
        applicationIdentifierTypes,
        error: FileUploadErrors.APPLICATION_IDENTIFIER_MISSING
      };
    }
    while (nodeList) {
      applicationIdentifierTypes.push(nodeList.childNodes[0].nodeValue);
      nodeList = applicationIdentifierNodes.iterateNext();
    }
    /*
    *
    * if no applicationIdentifier  is found throw error
    */
    if (acCount.length !== applicationIdentifierTypes.length) {
      return {
        isValid,
        applicationIdentifierTypes,
        error: FileUploadErrors.APPLICATION_IDENTIFIER_MISSING
      };
    }


    const applicationIdentifierMap = this.mapInterfaceNameWithType(doc, applicationIdentifierTypes);
    return {
      isValid: true,
      applicationIdentifierTypes: applicationIdentifierMap,
      error: FileUploadErrors.NO_ERROR
    };
  }
  /*
  *
  * Map interface name with type
  *
  */
  private mapInterfaceNameWithType(xmlDoc, applicationIdentifierTypes) {
    const parentNodeIdList = [];
    const reqBody = [];
    const objectNodeMap = {};
    const uaVariable = xmlDoc.getElementsByTagName('UAVariable');
    const UAObject = xmlDoc.getElementsByTagName('UAObject');

    for (const element of uaVariable) {
      if (element.getAttribute('BrowseName').includes('ApplicationIdentifier')
        && element.getElementsByTagName('Value')[0]) {

        parentNodeIdList.push(element.getAttribute('ParentNodeId'));
        objectNodeMap[element.getAttribute('ParentNodeId')] = applicationIdentifierTypes[0];
        applicationIdentifierTypes.shift();

      }
    }

    for (const element of UAObject) {
      if (parentNodeIdList.includes(element.getAttribute('NodeId'))) {
        reqBody.push({
          interfaceName: element.getElementsByTagName('DisplayName')[0].innerHTML,
          type: objectNodeMap[element.getAttribute('NodeId')]
        });
      }
    }
    return reqBody;
  }
  /**
   * @param applicationIdentifierTags XPathResult list all the application identifier tags in XPathResult format
   * @returns extracted application identifier tags in node set xml
   */
  private getApplicationIdentifierCount(applicationIdentifierTags: XPathResult) {
    const applicationIdentifiersCount = [];
    if (applicationIdentifierTags) {
      let applicationIdentifierList = applicationIdentifierTags.iterateNext();
      while (applicationIdentifierList) {
        applicationIdentifiersCount.push(applicationIdentifierList);
        applicationIdentifierList = applicationIdentifierTags.iterateNext();
      }
      return applicationIdentifiersCount;
    }
    return applicationIdentifiersCount;
  }
}

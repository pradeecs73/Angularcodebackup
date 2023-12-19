/*
 * @license
 * Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
 * Confidential.
 */
/*
* Define all the constants here
*/
import { LiveLink, HTMLNodeConnector, LanguageList } from '../models/models';
/*
 * ERROR CODES
 */
export const SUCCESS_CODE = 'SUCCESS';
export const NODE_SERVER_NOT_FOUND = 'ERR_SERVER_CONNECTION';
export const BROWSE_DEVICES_TIMEOUT = 'ERR_TIMEOUT_DEVICES';
export const ERR_UNAVAILABLE_DEVICES = 'ERR_UNAVAILABLE_DEVICES';
export const TIMEOUT_UPDATE_ACCESSIBLE_DEVICES = 60000;
export const ESTABLISH_CONNECTION_ERROR = 'ESTABLISH_CONNECTION_ERROR';
/*
 * View port's height and width
 */
export const VIEWAREA_WIDTH = 1348;
export const VIEWAREA_HEIGHT = 680;

/*
 * Editor height
 */
export const EDITOR_HEIGHT = 1000;
/* Constant if the method is not implemented */
export const METHOD_NOT_IMPLEMENTED = 'Method not implemented.';
/*Constant for no devices in the list / if no device is selected */
export const NO_DEVICES_SELECTED = 'No devices selected';
export const START_SCAN = 'Start scan to select online device';

export const CONNECTION = 'connection';
export const CHILDREN = 'children';
export const TAG = 'tag';

/*
 * Regex for validations
 */
export const PROJ_SPECIAL_CHAR_REGEX = /^[\w\-.@}{^&!('=",);\[\]`+ ]*$/gi;
const reservedKeyWordsRegex = `(aux|con|nul|prn|com[1-9]$|lpt[1-9]$)`;
export const PROJ_RSRV_REGEX = `/^(${reservedKeyWordsRegex}[^<>:"\/\\|?*]+|(?!aux|con|nul|prn|com[1-9]$|lpt[1-9]$))/gi`;

export const DEVICE_URLVALIDATE_REGEX =
 /^(opc\.tcp:\/\/[\w\.?]{1,253}:\d{1,65535})/g;

 const TCP_IP_ADDRESS_VALIDATION = '(opc\\.tcp:\\/\\/)(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
 const IP_SUBNET_ADDRESS = `\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)`;
 const IP_PORT_VALIDATION = ':(6553[0-5]|655[0-2][0-9]\\d|65[0-4](\\d){2}|6[0-4](\\d){3}|[1-5](\\d){4}|[1-9](\\d){0,3})';
 const IP_ADDRESS_REGEX = `^${TCP_IP_ADDRESS_VALIDATION}${IP_SUBNET_ADDRESS}${IP_SUBNET_ADDRESS}${IP_SUBNET_ADDRESS}${IP_PORT_VALIDATION}$`;
/*Regex*/
export const IP_ADDRESS_REGEX_VALIDATOR = new RegExp(IP_ADDRESS_REGEX,'g');
export const PASSWORD_PATTERN_REGEX = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[#$@!%^&*?]).{8,}$';
export const LOWERCASE_CHARACTER_REGEX = /(?=.*[a-z])/;
export const UPPERCASE_CHARACTER_REGEX = /(?=.*[A-Z])/;
export const SPECIAL_CHARACTER_REGEX = /(?=.*[#$@!%^&*?])/;
export const MINIMUM_EIGHT_CHARACTER_REGEX =  /(?=.*).{8,}$/;
export const htmlStrippedRegex = /(<([^>]+)>)/gi;


export const MODEL_VALUE_SUBSTRING = 'text=';

export const OPCTCP = 'opc.tcp://';

export const DEFAULT_CONNECTION_LENGTH = 20;

/*
 * Navigation menu items
 *
 */
export const NavigationMenus = [
 { route: 'home', icon: 'homeicon' },
 { route: 'devices', icon: 'devicetreeicon' },
 { route: 'editor', icon: 'plantviewicon' },
 { route: 'settings', icon: 'settingsicon' },
 { route: 'configuration-settings', icon: 'configurationsettingsicon' },
 { route: 'about', icon: 'abouticon' },
 { route: '', icon: 'helpicon' }
];

/*
 * Node styles
 */
export const ANCHORCIRCLEID = {
 SERVER_OUTER: 'outer',
 SERVER_INNER: 'inner',
 CLIENT_OUTER: 'outer-2',
 CLIENT_INNER: 'inner-2'
};

/*
 * Project list table details
 */
export const ProjectTableDetails = {
  projectName: 'Project name',
  author : 'Author',
  creationTime : 'Creation time',
  lastChanged : 'Last changed',
  lastModifiedBy : 'Last modified by'
};

export const CONNECTIONLISTROWID = 'connection-row';

/*
 * Device adding methods
 */
export const addMethods = [{
  key : 'devices.addDeviceMethod.browseForOnlineDevice',
  value : 'Browse for Online devices'
},
{
  key : 'devices.addDeviceMethod.importDevicesFromFile',
  value : 'Import Devices from file'
}
];

/*
 * Ellipsis keys for project list table
 */
export const ellipsisValue = {
  creationTime : 'creationTime',
  author: 'author',
  lastChanged : 'lastChanged',
  lastModifiedBy :'lastModifiedBy',
  comment : 'comment'
};


/*
 * List of languages used in application
 */
export const languages: LanguageList[]= [{
  key : 'English',
  value : 'en'
},
{
  key : 'German',
  value : 'de'
}];
/* When there are no nodeset uploaded*/
export const emptyUploadFileList = `<Read import files to view devices that can be added>`;

export const applicationIdentifierPath = `//*[name()='ApplicationIdentifierType']//*[name()='Name']`;
export const applicationIdentifierCount = `//*[name()='ApplicationIdentifierType']`;

export const headerUANodeSetPath = `//*[name()='UANodeSet']//*[name()='NamespaceUris']//*[name()='Uri']`;

export const defaultTCPIPAddress = 'opc.tcp://0.0.0.0:0000';
/* Constants for connection editor and root */
export const CONNECTIONEDITOR = 'Connection editor';
export const ROOT_EDITOR = 'ROOT';
/* active class to represent the active state in navigation menu */
export const active = '-active';

/*
* Plant editor related data
*/
export const editor: LiveLink = {
 connectorElem: null,
 connectorLookup: {} as HTMLNodeConnector,
 connectorPool: [],
 editorNodes: [] /* refers to OpcNode/Plant Area */,
 entities: null,
 linkGroup: null,
 nextAnchorId: 4839,
 nextConnectorId: 0,
 nodeGroup: null,
 subConnectorLookup: {} as HTMLNodeConnector,
 svg: null,
 workspace: null,
};

/*
 * Scan device errors
 */
export const deviceIpErrorMessage = {
 ipErrorMsg: 'Device IP is invalid',
 ipErrSolution: 'Please check the Device IP',
 ipRangeErrorMsg: 'Device IP range should be same for first three subnets',
 portErrorMsg: 'Device Port is invalid',
 portErrSolution: 'Please check the Device Port',
 toAddressLessThanFromErrorMsg:
  'TO IP address should be greater than FROM address'
};
/*constants device related */
export const deviceDetails = {
  name:'Name',
  address:'Address'
};

export const deviceSets = {
  MANUFACTURER:'Manufacturer',
  MODEL:'Model'
};
/* key for label 'ok' */
export const OK_BUTTON = 'common.buttons.ok';


/*
 * Navigation menu styling
 */
export const menuIcons = {
  homeIcon: 'homeicon',
  homeIconActive: 'homeicon-active',
  plantViewIcon: 'plantviewicon',
  deviceTreeIcon: 'devicetreeicon',
  settingsIcon: 'settingsicon',
  deviceTreeIconActive: 'devicetreeicon-active',
  plantViewIconActive: 'plantviewicon-active',
  settingsIconActive: 'settingsicon-active',
  configurationSettingIcon: 'configurationsettingsicon',
  configurationSettingIconActive: 'configurationsettingsicon-active',
  aboutIcon: 'abouticon',
  aboutIconActive: 'abouticon-active ',
  helpIcon: 'helpicon'
};


/*
 * language related details
 */
export const multiLanguage = {
  'en' : {
    'lang' : 'en',
    'key' : 'en-US'
  },
  'de' : {
    'lang' : 'de',
    'key' : 'de-DE'
  }
};

/* opc node class */
export const opcNodeClasses = {
  parentRectange : '#parent-rect',
  deviceHeader : '#Device-header',
  classUnavailable : '.cls-2-unavailable',
  unavailableClass : 'cls-2-unavailable',
  classSelected : 'cls-2-selected',
  selectedClass : '.cls-2-selected',
  classOnline : 'cls-2-online',
  onlineClass : '.cls-2-online',
  headerBox : '.header-box',
  nodeHeaderOnline : 'node-header-online',
  nodeHeaderUnavailable : 'node-header-unavailable',
  nodeHeaderOffline : 'node-header-offline',
  headStateIconAvailable : '.head-state-icon-available',
  headStateIconUnavailable : '.head-state-icon-unavailable',
  headOnline : 'head-online',
  headOffline : 'head-offline'
};

export const productVersion  = {
  productVersion : '1.0.0.0',
  fullVersion : ''
}


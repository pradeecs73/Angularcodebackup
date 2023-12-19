/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
* Enum for object
*/
export const enum ObjectType {
    OBJECT = 'object',
    STRING = 'string'
}


/**
 * Enum for overlay type
 */

export const enum OverlayType {
  CONFIRM = 'confirm',
  ERROR = 'error',
  LOADER = 'loader',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFORMATION = 'information'
}
/**
* Enum for http status
*/
export const enum HTTPStatus {
    SUCCESS = 200,
    ERROR = 500
}
/*
* Enum for monitor type
*/
export const enum MONITORTYPE {
    CLIENTCONNECTIONDIAGNOSTICS = 'Client_Connection_Diagnostic',
    NONE = '',
    SERVERCONNECTIONDIAGNOSTICS = 'Server_Connection_Diagnostic',
    TAG = 'tag'
}
/*
* Enum for response status code
*/

export const enum ResponseStatusCode {
    BAD_INTERNALERROR = 'BAD_INTERNALERROR',
    BadTimeOut = 'BADTIMEOUT',
    BADTIMEOUT = 'BADTIMEOUT',
    Browse_device_failure = 'Browse_device_failure',
    Close_Connection_Device_error_Config = 'Close_Connection_Device_error_Config',
    Close_Connection_Device_Invalid_Session = 'Close_Connection_Device_Invalid_Session',
    Close_Connection_Device_Not_Running = 'Close_Connection_Device_Not_Running',
    Close_Connection_Invalid_payload = 'Close_Connection_Invalid_payload',
    Close_Project_failure = 'Close_Project_failure',
    Delete_Device_failure = 'Delete_Device_failure',
    Delete_Project_failure = 'Delete_Project_failure',
    DeviceNotRunning = 'ERROR_DEVICE_NOT_RUNNING',
    Error_Connection = 'ERROR_CONNECTION',
    ERROR_INVALID_CLIENT_DATA = 'ERROR_INVALID_CLIENT_DATA',
    Establish_Connection_Client_Device_Error_Config = 'Establish_Connection_Client_Device_Error_Config',
    Establish_Connection_Client_Device_Invalid_Session = 'Establish_Connection_Client_Device_Invalid_Session',
    Establish_Connection_Client_Device_Not_Running = 'Establish_Connection_Client_Device_Not_Running',
    Establish_Connection_Error_Invalid_Client_Data = 'Establish_Connection_Error_Invalid_Client_Data',
    Establish_Connection_Failure = 'Establish_Connection_Failure',
    Establish_Connection_Invalid_payload = 'Establish_Connection_Invalid_payload',
    Establish_Connection_Server_Device_Error_Config = 'Establish_Connection_Server_Device_Error_Config',
    Establish_Connection_Server_Device_Invalid_Session = 'Establish_Connection_Server_Device_Invalid_Session',
    Establish_Connection_Server_Device_Not_Running = 'Establish_Connection_Server_Device_Not_Running',
    Go_Online_failure = 'Go_Online_failure',
    Go_Online_Unavailable_Devices_List = 'Go_Online_Unavailable_Devices_List',
    Import_Project_failure = 'Import_Project_failure',
    InvalidSession = 'ERROR_INVALID_SESSION',
    Is_Device_conneted_failure = 'Is_Device_conneted_failure',
    NoDiagnoseValue = 'ERR_DIAGNOSE',
    NoPartnerValue = 'ERR_PARTNER',
    OnlyConFailed = 'ERR_CON_FAILED',
    Recent_Project_failure = 'Recent_Project_failure',
    Save_Project_failure = 'Save_Project_failure',
    SuccessCon = 'SUCCESS',
    UnknownError = 'UNKNOWN_ERROR',
    Update_Project_failure = 'Update_Project_failure',
    Validate_Project_failure = 'Validate_Project_failure',
    Invalid_Device_Credentials = 'Invalid_Device_Credentials',
    Establish_Connection_Server_Device_AUTHENTICATION_FAILURE = 'Establish_Connection_Server_Device_Authentication_Failure',
    Establish_Connection_Client_Device_AUTHENTICATION_FAILURE = 'Establish_Connection_Client_Device_Authentication_Failure',
    GO_ONLINE_Device_AUTHENTICATION_FAILURE = 'Go_Online_Device_Authentication_Failure',
    BROWSE_DEVICE_AUTHENTICATION_FAILURE = 'Browse_device_Device_Authentication_Failure',
    Establish_Connection_BOTH_Device_AUTHENTICATION_FAILURE = 'Establish_Connection_Both_Device_Authentication_Failure',
    Register_Password_Failure_Or_Read_Write_Same = 'Register_Password_Failure_Or_Read_Write_Same',
    Incorrect_Old_Password = 'Incorrect_Old_Password',
    Register_Password_Failure_Invalidpayload = 'Register_Password_Failure_Invalidpayload',
    Change_Password_failure_Old_New_Same = 'Change_Password_failure_Old_New_Same',
    Access_And_Refresh_Tokens_Expired = 'Access_And_Refresh_Tokens_Expired',
    Invalid_Address_Model = 'Invalid_Address_Model',
    Device_Not_Reachable = 'Device_Not_Reachable',
    Delete_Project_Failure_Inavlid_Password = 'Delete_Project_Failure_Inavlid_Password',
    Delete_Project_Failure_In_Another_Session = 'Delete_Project_Failure_In_Another_Session',
    Open_Project_Failed_Opened_In_Another_Session = 'Open_Project_Failed_Opened_In_Another_Session',
    Browse_device_Device_Authentication_Failure = 'Browse_device_Device_Authentication_Failure',
    Authorization_Failure = 'Authorization_Failure',
    Update_Device_Or_Change_Device_Address = 'Update_Device_Or_Change_Device_Address',
    Internal_Server_Error = 'Internal_Server_Error',
    Authenticate_Project_Failure = 'Authenticate_Project_Failure',
    Session_Already_Opend_With_Project='session_already_opend_with_project'

}
/*
* Enum for  application constant
*/
export const enum ApplicationConstant {
    //CACHE_KEY = 'httpCache',
    //PROJECTNAME = 'PROJECTNAME',
    SELECTED = 'selected',
    DISABLED = 'disabled',
    ENABLED = ''
}

/*
* Enum for device attributes
*/
export const enum DeviceAttributes {
    ADD = 'Add',
    CLIENTINTERFACES = 'clientInterfaces',
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    PANELDATA = 'panelData',
    SERVERINTERFACES = 'serverInterfaces',
    UPDATE = 'Update',
    UPDATEDETAILS = 'updateDetails',
    UPLOAD = 'Upload'
}
/*
* Enum for connection attributes
*/
export const enum ConnectionAttributes {
    CONNECTIONSTATUS = 'Status',
    DETAILEDSTATUS = 'detailedStatus',
    DIAGNOSE = 'diagnose',
    PARTNER = 'partner',
    RELATEDENDPOINT = 'RelatedEndpoint',
    SYSTEM = 'System'
}
/*
* Enum for editor attributes
*/
export const enum EditorAttributes {
    BACKGROUNDCOLOUR = '#fff',
    HEIGHT = '150%',
    WIDTH = '150%',
    SVG_ID = 'myCanvasSvg'
}
/*
* Enum for workspace attributes
*/
export const enum WorkspaceAttributes {
    HEIGHT = '100%',
    WIDTH = '100%',
    DEVICE_HEIGHT = '200%'
}
/*
* Enum for nodeattributes
*/
export const enum NodeAttributes {
    DEVICENODE = 'device-node',
    NODEHEADER = 'Device-header',
    PARENTRECT = '#parent-rect',
    Device_NODE_CLASS = '.device-node'
}
/*
* Enum for cursor attributes
*/
export const enum CursorAttributes {
    NOTALLOWED = 'not-allowed',
    NODROP = 'no-drop',
    Dragging = 'drag-dragging',
    Dropped = 'drag-dropped',
    MOVE = 'move',
    NORMAL = 'normal',
    DRAGMOVE = 'drag-move'
}
/*
* Enum for zoom factors
*/
export const enum ZoomFactors {
    FITTOSCREEN = 11,
    FITTOWIDTH = 2,
    FITTOHEIGHT = 3
}
/*
* Enum for interface attributes
*/
export const enum InterfaceAttributes {
    DEFAULT = 'cls-8'
}
/*
* Enum for drag drop attributes
*/
export const enum DragDropAttribute {
    TREEROOT = '.tree__root',
    DROPTARGET = 'drop-target',
    CAN_DROP_NODES = 'can-drop-nodes',
    CAN_DROP_HIGHLIGHT = 'can-drop-highlight',
    DRAGG_SELECTED = 'dragg-selected',
    TREE_NODE_CONTENT = '.p-treenode-content'
}
/*
* Enum for drag drop classes
*/
export const enum DragDropClasses {
    PTREE_NODE_CONTENT = 'p-treenode-content',
    PTREE_NODE_LABEL = 'p-treenode-label',
    NODE_LABEL = 'node-label',
    HIDE_ID = 'hide-id',
    NODE_ID = 'node-id'
}
/*
* Enum for drag type
*/
export const enum DragType {
    NODE = 'shape',
    PORT = 'port',
    ANCHOR = 'anchor',
    CONNECTOR = 'connector',
    INTERFACE = 'interface',
    CONNECTIONNODE = 'connection-node'
}
/*
* Enum for project state
*/
export const enum ProjectState {
    ONLINE = 'Online',
    OFFLINE = 'Offline'
}
/*
* Enum for device state
*/
export const enum DeviceState {
    //available always
    NEW = 'NEW',
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE',
    UNKNOWN = 'UNKNOWN'
}
/*
* Enum for connector type
*/
export const enum ConnectorType {
    CONNECTOR = 'connector',
    SUBCONNECTOR = 'subConnector'
}
/*
* Enum for connector creation mode
*/
export const enum ConnectorCreationMode {
    //Offline available
    MANUAL = 'Manual',
    //Proposed Connection Mode
    PROPOSED = 'Proposed',
    //Online available
    ONLINE = 'Online'
}
/*
* Enum for sub connector creation mode
*/
export const enum SubConnectorCreationMode {
    //Offline available
    MANUAL = 'Manual',
    //Proposed Connection Mode
    PROPOSED = 'Proposed',
    //Only Online available
    ONLINE = 'Online',
    //existing subConnectors creation mode gets changes
    //if there's a connection online but not in offline
    MANUALONLINE = 'MANUALONLINE',
    //Offline available and removed(trasparent style) in Online mode
    MANUALOFFLINE = 'MANUALOFFLINE'
}
/*
* Enum for connector state
*/
export const enum ConnectorState {
    //offline mode
    Default = 'DEFAULT',
    //online mode
    Success = 'SUCCESS',
    //online mode
    Error = 'ERROR',
    //online mode
    Online = 'ONLINE',
    //online mode
    OnlineError = 'ONLINEERROR',
    //online mode
    NonExistent = 'Non-Existent',
    //offline mode
    Proposed = 'PROPOSED'
}
/*
* Enum for connection style
*/
export const ConnectionStyle = {
    Default: {
        connectorStyle: {
            pathOutline: ConnectorArributes.CONNECTORPATHOUTLINE,
            path: ConnectorArributes.CONNECTORPATH
        },
        anchorStyle: {
            scrim: AnchorAttribute.ACTUALCONNECTSCRIM,
            outerCircle: AnchorAttribute.OUTERCIRCLE,
            innerCircle: AnchorAttribute.INNER
        }
    }
};
/*
* Enum for connector style
*/
export const enum ConnectorStyle {
    //black
    Default,
    //green
    Success,
    //red
    Error,
    //Orange Dotted
    Online,
    //Red Dotted
    //OnlineError,
    //black ? transparent ?
    NonExistant,
    //light dotted
    SingleProposed,
    //light solid
    MultiProposed,
    //blue
    Hover,
    //green-blue
    HoverSuccess,
    //Red-blue HoverOnline Success?
    HoverError,
    //light blue
    HoverSingleProposed,
    //dotted blue
    HoverMultiProposed,
    //Online conenctions Hover style?
    //black outline
    Select,
    //green outline
    SuccessSelect,
    //red outline
    ErrorSelect,
    // ??
    OnlineSelect,
    //??
    //OnlineErrorSelect,
    //dark dotted
    SelectSingleProposed,
    //dark solid
    SelectMultiProposed,

    OnRowClick,
    OnRowHoverSelected,
    OnRowSelect,
    OnRowSelectProposed,
    OnlineError
}

/*
* Enum for connector attributes
*/
export const enum ConnectorArributes {
    INNERCLS = 'inner cls-16',
    OUTERCLS = 'outer cls-16',
    CONNECTORPATH = 'connector-path',
    CONNECTORPATHOUTLINE = 'connector-path-outline',
    /**
     * This styling is basically to ensure the gaps in the connections won't exists
     */
    CONNECTORPATHOUTLINE_NO_CONNECTION = 'connector-path-outline-no-connection',
    CONNECTORPATH_NO_CONNECTION = 'connect-path-no-connection',



    CONNECTORPATHROWSELECT = 'connector-path-row-select',
    CONNECTPATHSUCCESS = 'connect-path-success',
    CONNECTORPATHFAIL = 'connector-path-fail',
    CONNECTPATHONLINE = 'connect-path-online',
    CONNECTPATHONLINEERROR = 'connect-path-online-error',

    CONNPATHSELECTED = 'con-path-selected',
    CONNECTORPATHOUTLINESELECTED = 'con-path-outline-selected',

    CONPATHOUTLINESUCCESSSELECTED = 'con-path-outline-success-selected',
    CONPATHOUTLINEFAILSELECTED = 'con-path-outline-fail-selected',
    CONPATHOUTLINEONLINESELECTED = 'con-path-outline-online-selected',
    CONPATHOUTLINEONLINEERRORSELECTED = 'con-path-outline-online-error-selected',

    CONHOVERED = 'con-hovered',

    //not used
    CONNECTORPATHONLINEFAIL = 'connector-path-online-fail',

    INPUTHANDLE = 'input-handle',
    OUTPUTHANDLE = 'output-handle',
    CONNECTORHANDLE = 'connector-handle',

    CONNECTORPATH_PROPOSED = 'connector-path-proposed',
    CONNECTORPATHOUTLINE_PROPOSED = 'connector-path-outline-proposed',
    CONNECTORPATH_SELECTPROPOSED = 'connector-path-select-proposed',
    CONNECTORPATHOUTLINE_SELECTPROPOSED = 'connection-path-outline-select-proposed',
    CONNECTORPATHSELECTPROPOSEDROWSELECT = 'connector-path-select-proposed-row-select'
}
/*
* Enum for sub connector style attributes
*/
export const enum subConnectorStyleAttributes {
    SUCCESS = '#009a49',
    ERROR = '#dc0031',
    ONLINE = '#faa50A',
    TRANSPARENT = '#fff',
    DEFAULT = '#21292c',
    ONLINEERROR = '#dc0031'
}
/*
* Enum for anchor attributes
*/
export const enum AnchorAttribute {
    ACTUALCONNECTSCRIM = 'actual-connect-scrim',
    ACTUALFAILOUTERCIRCLE = 'actual-fail-outer-circle',
    ACTUALINNERCIRCLE = 'actual-inner-circle',
    ACTUALOUTERCIRCLE = 'actual-outer-circle',
    ACTUALOUTERSCRIMSUCCESS = 'actual-success-outer-circle',
    ACTUALSCRIMSELECTED = 'actual-scrim-selected',
    FAILSCRIM = 'fail-scrim',
    HAVECONNECTION = 'haveconnection',
    HIGHLIGHTED = 'highlighted',
    HOVERINNERCIRCLE = 'hover-inner-circle',
    HOVEROUTERCIRCLE = 'hover-outer-circle',
    HOVEROUTERCIRCLEACTUALCON = 'outer-actual-con-hover',
    HOVERRECT = 'hover-rect',
    HOVERSCRIM = 'hover-scrim',
    INNER = 'inner',
    MATCHINGINTERFACE = 'matchinginterface',
    NOCONNECTION = 'no-connection',
    OUTERCIRCLE = 'outer-circle',
    OUTERCIRCLEACTUALCON = 'outer-circle-actual-con',
    OUTERNOCONNECTION = 'outer-no-connection',
    OUTERSCRIMFAILURE = 'outer-fail-circle',
    OUTERSCRIMONLINE = 'online-outer-circle',
    OUTERSCRIMONLINEFAILURE = 'outer-online-failure-scrim',
    OUTERSCRIMONLINESUCCESS = 'outer-online-success-scrim',
    OUTERSCRIMONLINEERROR = 'outer-online-error-scrim',
    OUTERSCRIMSUCCESS = 'outer-success-scrim',
    SCRIM = 'scrim',
    SUCCESSSCRIM = 'success-scrim'
}
/*
* Enum for resize
*/
export const enum ResizeModal {
    DEVICE_LEFT_FULL_WIDTH = 16,
    DEVICE_MIDDLE_LEFT_WIDTH = 98,
    DEVICE_MIDDLE_RIGHT_WIDTH = 71,
    DEVICE_MIDDLE_WIDTH = 98,
    DEVICE_RIGHT_FULL_WIDTH = 23,
    EDITOR_COLLAPSE_WIDTH = 16,
    ELEMENT_MIN_WIDTH = 2,
    MIDDLE_WIDTH_COLLAPSE = 98,
    MIDDLE_WIDTH_FULL = 98,
    MIDDLEWIDTH = 75,
    MIN_WIDTH = 5,
    MODE_COLLAPSE = 'collapse',
    MODE_FULL = 'full',
    POSITION_LEFT = 'left',
    POSITION_RIGHT = 'right'
}
/*
* Enum for  device details fill
*/
export const enum DeviceDetailFillXYValues {
    X = 10,
    Y = 0
}
/*
* Enum for elements
*/
export const enum DeviceDetailElements {
    CARD_CLASS = 'device__details__card',
    DETAILS_CLASS = '.device__details__panel',
    DIV = 'div',
    PANEL_CLASS = 'device__details__panel',
    SPAN = 'span'
}
/*
* Enum for panel menu
*/
export const enum PanelMenu {
    ICON_CLASS = 'p-panelmenu-icon',
    PANEL_ACTIVE_CLASS = 'p-active',
    PANEL_HEADER_LINK_CLASS = 'p-panelmenu-header-link',
    PANEL_HEADER_LINK_CLASS_SYNTAX = '.p-panelmenu-header-link',
    PANEL_MENU_HEADER = '.p-panelmenu-header',
    PANEL_MENU_ITEM_LINK = 'p-menuitem-link',
    PANEL_MENU_ITEM_LINK_CLASS = '.p-menuitem-link',
    PANEL_SUB_MENU_ACTIVE = 'device-active',
    PANEL_SUB_MENU_ACTIVE_CLASS = '.device-active',
    PANLE_MENU_ITEM_TEXT = 'p-menuitem-text'
}
/*
* Enum for adapter methods
*/
export const enum AdapterMethods {
    BROWSE = 'Browse',
    MONITOR = 'Monitor',
    CONNECTION = 'Connection'
}
/*
* Enum for  address model type
*/
export const enum AddressModelType {
    CLIENT_SERVER = 'Plant Object',
    FX_ADDRESSMODEL = 'FX_AddressModel'
}
/*
* Enum for angle
*/
export const enum Angle {
    STRAIGHTLINE_ANGLE = 180,
    RIGHT_ANGLE = 90
}
/*
* Enum for quadrant
*/
export const enum Quadrant {
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
    FOURTH = 4,
    FIFTH = 5,
    SIXTH = 6,
    SEVENTH = 7,
    EIGHTH = 8
}
/*
* Enum for numeric
*/
export const enum Numeric {
    MINUSONE = -1,
    ZERO = 0,
    ZEROPOINTONE = 0.1,
    POINTTWENTYFIVE = 0.25,
    POINTTHREETHREE = 0.33,
    POINTFOUR = 0.40,
    POINTFOUREIGHT = 0.48,
    POINTFIFTY = 0.5,
    POINTFIVEFIVE = 0.55,
    POINTSIX = 0.6,
    POINTSIXTHREE= 0.63,
    POINTSEVEN= 0.70,
    POINTSEVENTFIVE = 0.75,
    POINTSEVENEIGTH = 0.78,
    POINTEIGHTFIVE = 0.85,
    POINTNINETHREE=0.93,
    ONE = 1,
    ONEPOINTTWOFIVE = 1.25,
    ONEPOINTFIVE = 1.5,
    ONEPOINTSEVENFIVE = 1.75,
    TWO = 2,
    TWOPOINTTWOFIVE=2.25,
    TWOPOINTFIVE=2.5,
    TWOPOINTSEVENFIVE=2.75,
    TWOPOINTEIGHT = 2.8,
    THREE = 3,
    THREEPOINTTWOFIVE=3.25,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    TEN = 10,
    ELEVEN = 11,
    TWELVE = 12,
    THIRTEEN = 13,
    FOURTEEN = 14,
    FIFTEEN = 15,
    SIXTEEN = 16,
    SEVENTEEN = 17,
    EIGHTEEN = 18,
    NINETEEN = 19,
    TWENTYFIVE = 25,
    TWENTY = 20,
    THIRTY = 30,
    THIRTYFIVE=35,
    FOURTY=40,
    FIFTY = 50,
    FIFTYNINE = 59,
    SIXTY = 60,
    SEVENTYFIVE = 75,
    EIGHTY = 80,
    NINETY = 90,
    ONEHUNDRED = 100,
    ONETEN = 110,
    ONETWENTY = 120,
    ONETHIRTY = 130,
    ONEFIFTY = 150,
    ONESEVENTYFIVE = 175,
    TWOHUNDERD = 200,
    TWONINETY = 290,
    ONEFOURTY = 140,
    TWOTWENTY = 220,
    TWOFORTY = 240,
    TWOFIFTY = 250,
    TWOEIGHTY = 280,
    TWOEIGHTYFIVE = 285,
    THREEHUNDRED = 300,
    THREEHUNDREDEIGHT = 308,
    THREESEVENTYTHREE = 373,
    THREEEIGHTYFIVE = 385,
    FOURHUNDRED = 400,
    FIVEHUNDERD = 500,
    FIVEFIFTY = 550,
    THOUSAND = 1000,
    ONETHOUSAND_THREEFORTYFOUR = 1340,
    ONETHOUSAND_NINEFIFTYSEVEN = 1957,
    TWO_THOUSAND = 2000,
    THREETHOUSAND_FIVETHIRTYEIGHT = 3538,
    NEGATIVE_ONEFORTY = -140
}
/*
* Enum for svg values
*/
export const enum SvgValues {
    TWO = 0.2043,
    FIVE = 0.51944,
    SIXTYfOUR = 0.64298,
    TWOFIVE = 0.2509,
    TWOFOUR = 0.2428,
    THREEFIVE = 0.3580,
    TWOONE = 0.213,
    TWOSEVEN = 0.2780,
    THREENINE = 0.3939,
    FOUR = 0.4

}

/*
* Enum for error type list
*/
export const enum ErrorTypeList {
    EXECUTION_ERROR = 'EXECUTION_ERROR'
}
/*
* Enum for notification type
*/
export const enum NotificationType {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error'
}
/*
* Enum for Io events
*/
export const enum IoEvents {
    BROWSE_DEVICE_COUNT = 'Browse_Device_count',
    EMPTY_EXCEPTION_QUEUE = 'empty_exception_queue',
    ERROR_EXCEPTION_HANDLING = 'error_exception_handling',
    IS_CANCEL_EVENT = 'Is_Cancel_Event',
    SCAN_DEVICE_COUNT = 'Scan_Device_Count',
    SCAN_DEVICES_RESULT_EVENT = 'Scan_Devices_Result_Event',
    Server_Crash_Event = 'Server_Crash_Event',
    SAME_PROJECT_CONCURENT_SESSION = 'SAME_PROJECT_CONCURENT_SESSION',
    UPDATE_PASSWORD_EVENT = 'UPDATE_PASSWORD_EVENT',
    TOKEN_EXPIRED_NOTIFICATION = 'TOKEN_EXPIRED_NOTIFICATION',
    CERTIFICATE_VALIDATION_EVENT = 'CERTIFICATE_VALIDATION_EVENT',
    INVALID_SECURITY_POLICY_EVENT ='Invalid_Security_Policy_Event'
}
/*
* Enum for establish connection menus
*/
export const enum EstablishConnectionMenus {
    ESTABLISH_ALL_CONNECTIONS = 'Establish all connections',
    ESTABLISH_SELECTED_CONNECTION = 'Establish selected connections'
}
/*
* Enum for establish connection menus id
*/
export const enum EstablishConnectionMenusId {
    ESTABLISH_ALL_CONNECTIONS = 'editor.menuOptions.establishConnection.establishAllConnection',
    ESTABLISH_SELECTED_CONNECTION = 'editor.menuOptions.establishConnection.establishSelectedConnection'
}
/*
* Enum for delete context menu
*/
export const enum DeleteContextMenu {
    CANVAS_ID = '#myCanvas',
    CONTEXTMENU_ID = '#onlineDelteContextmenu',
    CONTEXTMENU_LEFT = 350,
    CONTEXTMENU_TOP = 100,
    DELETE_CONNECTION_ONLINE = 'deleteconnectiononline',
    DELETE_CONNECTION_ONLINE_AND_PROJECT = 'deleteconnectiononlineandproject'
}
/*
* Enum for file format
*/
export const enum FileFormat {
    'CONTENT_STRING' = 'content-string',
    'BLOB' = 'blob'
}
/*
* Enum for add device type
*/
export const enum AddDeviceType {
    'IMPORT_FROM_FILE' = 'importFromFile',
    'BROWSE_ONLINE' = 'browseOnline'
}
/*
* Enum for filling line node type
*/
export const enum FillingLineNodeType {
    NODE = 'node',
    AREA = 'area',
    HEADER = 'head',
    //Interface Grid
    NA = 'n/a'
}
/*
* Enum for tree panel
*/
export const enum TreePanel {
    TREE_NODE_CONTENT = 'p-treenode-content',
    TREE_NODE_CONTENT_CLASS = '.p-treenode-content',
    TREE_HIGHLIGHT = 'p-highlight',
    TREE_HIGHLIGHT_CLASS = '.p-highlight',
    MENU_VIEW_FULL = 'menu-view--full'
}
/*
* Enum for server diagnostics
*/
export const enum ServerDiagnostics {
    SESSION_DIAGNOSTIC_DATA = 'SessionDiagnostics'
}

/*
* Enum for panel properties
*/
export const enum PanelProperties {
    PANEL_INNER_HEIGHT = 0.70
}
/*
* Enum for file upload errors
*/
export const enum FileUploadErrors {
    'NO_ERROR' = 'No Errors',
    'INVALID_XML' = 'Invalid XML',
    'APPLICATION_IDENTIFIER_MISSING' = 'missing Application identifier ',
    'XML_HEADER_MISSING' = 'XML Header is missing'
}
/*
* Enum for drag properties
*/
export const enum dragProperties {
    DRAG_CLASS = '.drag-selection',
    DRAG_NODES = 'editor-nodes'
}
/*
* Enum for num constants
*/
export const enum numConstants {
    NUM_250 = 250,
    NUM_100 = 100,
    NUM_1 = 1,
    NUM_2 = 2,
    NUM_3 = 3,
    NUM_10 = 10,
    NUM_25 = 25,
    NUM_50 = 50,
    NUM_75 = 75,
    NUM_200 = 200,
    NUM_400 = 400,
    NUM_20 = 20,
    NUM_30 = 30,
    NUM_40 = 40,
    NUM_300 = 300
}
/*
* Enum for add device option
*/
export const enum addDeviceOption {
    ADDUSINGIP = 'Browse for Online devices',
    ADDUSINGUPLOAD = 'Import Devices from file'
}
/*
* Enum for interface grid view type
*/
export const enum interfaceGridViewType {
    COLLAPSED = 'collapsed',
    EXPANDED = 'full',
    NA = 'not-applicable'
}
/*
* Enum for interface style
*/
export const enum intefaceStyle {
    CONNECTED = 'connected',
    DISCONNECTED = 'disconnected'
}
/*
* Enum for device add tab view
*/
export const enum DeviceAddTabView {
    ADD = 'add',
    BACK = 'back'
}
/*
* Enum for area scenarios
*/
// AREA_TO_AREA,ROOT_TO_AREA and AREA_TO_ROOT can be clubbed together
export const enum AreaScenarios {
    AREA_TO_AREA = 'area to area',
    SAME_AREA = 'RootOrSameAreaStrategy',
    ROOT_TO_AREA = 'root to area',
    /*  AREA_TO_ROOT = 'area to root', */
    NESTED_UNDER_SAME_PARENT = 'NestedSiblingsAreaStrategy',
    NESTED_DIFFERENT_PARENT_AREA_STRATEGY = 'NestedDifferentParentAreaStrategy'
}
/*
* Enum for stratergy list
*/
export const enum StrategyList {
    NESTED_DIFFERENT_PARENT_AREA_STRATEGY = 'NestedDifferentParentAreaStrategy',
    NESTED_SIBLINGS_AREA_STRATEGY = 'NestedSiblingsAreaStrategy',
    ROOT_OR_SAME_AREA_STRATEGY = 'RootOrSameAreaStrategy'
}
/*
* Enum for stratergy option
*/
export const enum StrategyOperations {
    CONNECTION_BY_SEARCH = 'connectionBySearch',
    CREATEONLINE_AREA_CONNECTION = 'createOnlineAreaConnection',
    DELETE_AREA = 'deleteArea',
    REORDER_HTML_NODE = 'reorderHTMLNode',
    UNGROUP_AREA = 'unGroupArea',
    REORDER_WITHOUT_CONNECTION = 'reorderWithNoConnection'

}
/*
* Enum for intefacy category
*/
export const enum InterfaceCategory {
    CLIENT = 'client',
    SERVER = 'server',
    CLIENT_INTERFACE = 'Client Interface',
    SERVER_INTERFACE = 'Server Interface',
    CLIENT_INTERFACE_ID = 'clientInterfaceIds',
    SERVER_INTERFACE_ID = 'serverInterfaceIds'
}
/*
* Enum for property panel
*/
export const enum PropertyPanel {
    inputData = 'InputData',
    outputData = 'OutputData'
}
/*
* Enum for delete sub connection by type
*/
export const enum DeleteSubConnectionByType {
    NODE = 'node',
    AREA = 'area',
    SUB_CONNECTOR = 'acId',
    UNGROUP = 'unGroup'
}
/*
* Enum for property panel type
*/
export const enum PropertyPanelType {
    INTERFACE = 'interface',
    CONNECTION = 'connection'
}
/*
* Enum for access type
*/
export const  enum AccessType {
    READ = 'read',
    WRITE = 'write'
}
/*
* Enum for expire session
*/
export const enum ExpireSession {
    TOKEN = 'TOKEN',
    SESSION = 'SESSION'
}
/*
* Enum for operation mode
*/
export const enum OperationMode {
    CHANGE_WRITE_PASSWORD = 'changeWritePassword',
    CHANGE_READ_PASSWORD = 'changeReadPassword',
    MODE_OPEN_PROTECTED_PROJECT = 'openProtectedProject',
    REMOVE_PASSWORD_PROTECT = 'removePasswordProtect',
    REMOVE_READ_PASSWORD = 'removeReadPassword',
    MODE_DELETE_PROTECTED_PROJECT = 'deleteProtectedProject'
}
/*
* Enum for device authentication
*/
export const enum DeviceAuthentication {
    GO_ONLINE = 'Go Online',
    ESTABLISH_CONNECTION = 'Establish Connection',
    BROWSE_DEVICE = 'Browse Device',
    ADD_SELECTED_DEVICE_TO_LIST = 'Add selected device to project'
}
/*
* Enum for device authentication status
*/
export const enum DeviceAuthenticationStatus {
    PENDING = 'pending',
    SKIPPED = 'skipped',
    AUTHENTICATED = 'authenticated'
}
/*
* Enum for access controls for the project
*/
export enum accessControl {
    CAN_PROJECT_UPDATE = 'CAN_PROJECT_UPDATE',
    CAN_PROJECT_DELETE = 'CAN_PROJECT_DELETE',
    CAN_DEVICE_ADD = 'CAN_DEVICE_ADD',
    CAN_DEVICE_UPDATE = 'CAN_DEVICE_UPDATE',
    CAN_DEVICE_DELETE = 'CAN_DEVICE_DELETE',
    CAN_CONNECTION_OFFLINE = 'CAN_CONNECTION_OFFLINE',
    CAN_CONNECTION_DELETE_OFFLINE = 'CAN_CONNECTION_DELETE_OFFLINE',
    CAN_CONNECTION_DELETE_ONLINE = 'CAN_CONNECTION_DELETE_ONLINE',
    CAN_ADD_MOVE_AC = 'CAN_ADD_MOVE_AC',
    CAN_ESTABLISH_CONNECTION = 'CAN_ESTABLISH_CONNECTION',
    CAN_CREATE_AREA = 'CAN_CREATE_AREA',
    CAN_RENAME_AREA = 'CAN_RENAME_AREA',
    CAN_UNGROUP_AREA = 'CAN_UNGROUP_AREA',
    CAN_REORDER_AREA_NODE = 'CAN_REORDER_AREA_NODE',
    CAN_DELETE_AREA_NODE = 'CAN_DELETE_AREA_NODE'

}
/*
* Enum for password notification type
*/
export const enum PasswordNotificationType {
    password = 'password',
    protection = 'protection'
}
/*
* Enum for error response
*/
export interface ErrorResponse {
    errorCode: number,
    errorType: string
}
/*
* Enum for interface
*/
export const enum Interface {
    client = 'client',
    server = 'server'
}
/*
* Enum for content type
*/
export const enum ContentType {
    Json = 'application/json',
    Multi_Part_Form_Data = 'multipart/form-data'
}
/*
* Enum for timed out state
*/
export const enum timedOutState {
    NOT_STARTED = 'NOT_STARTED',
    IDLE = 'IDLE',
    NOT_IDLE = 'NOT_IDLE',
    TIMED_OUT = 'TIMED_OUT'
}
/*
* Enum for error
*/
export const enum error {
    ETIMEDOUT = 'ETIMEDOUT'
}
/*
* Enum for node anchor type
*/
export const enum NodeAnchorType {
    INPUT = 'inputAnchor',
    OUTPUT = 'outputAnchor'
}
/*
* Enum for error handle methods
*/
export const enum errorHandleMethods {
    handleEstablishConnectionError = 'handleEstablishConnectionError',
    handleUpdateDeviceOrChangeAddressError = 'handleUpdateDeviceOrChangeAddressError',
    updateDeviceNotRunningData = 'updateDeviceNotRunningData',
    updateInvalidSessionData = 'updateInvalidSessionData',
    updateDeviceInvalidClientData = 'updateDeviceInvalidClientData',
    updateBadTimeOutErrorData = 'updateBadTimeOutErrorData',
    updateConnectedToFaultyDevice = 'updateConnectedToFaultyDevice',
    saveOrUpdateProjectError = 'saveOrUpdateProjectError',
    handleCloseConnectionError = 'handleCloseConnectionError',
    handleRecentProjectError = 'handleRecentProjectError',
    handleValidateProjectError = 'handleValidateProjectError',
    importProjectError = 'importProjectError',
    deviceConnectedError = 'deviceConnectedError',
    handleBrowseDeviceError = 'handleBrowseDeviceError',
    handleDeleteDeviceError = 'handleDeleteDeviceError',
    handleDeleteProjectError = 'handleDeleteProjectError',
    handleGoOnlineDeviceError = 'handleGoOnlineDeviceError',
    handleGoOnlineServerError = 'handleGoOnlineServerError',
    handleDeviceInvalidCredentialsError = 'handleDeviceInvalidCredentialsError',
    handleTokenExpiry = 'handleTokenExpiry',
    handleCookieExpiry = 'handleCookieExpiry',
    handleDeleteProjectErrorBySession = 'handleDeleteProjectErrorBySession',
    handleOpenProjectErrorBySession = 'handleOpenProjectErrorBySession',
    handleBrowseDeviceAuhthenticationFailure = 'handleBrowseDeviceAuhthenticationFailure',
    handleErrorType = 'handleErrorType'
}
/*
* Enum for date default language
*/
export const enum dateDefaultLanguage {
    UNITED_STATES = 'en-US'
}
/*
* Enum for route
*/
export const enum route {
    configuration_settings = '/configuration-settings',
    configuration_settings_path = '#/configuration-settings',
    home = '#/home',
    about = '#/about'
}


export const enum LocalStorageKeys {
  windows = 'windows',
  applicationTimeStamp = 'applicationTimeStamp',
}


export const enum ResizableDirection {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

export const enum ResizerType {
  colResize = 'col-resize',
  rowResize = 'row-resize'
}

export const enum ResizeStylingProperties {
    userSelect = 'user-select',
    pointerEvents = 'pointer-events',
    cursor = 'cursor'
}

export const enum MouseMoveEvents {
    mouseMove = 'mousemove',
    mouseUp = 'mouseup',
    mouseDown = 'mousedown'
}

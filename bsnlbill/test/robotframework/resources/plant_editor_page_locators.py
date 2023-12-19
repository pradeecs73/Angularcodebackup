canvas = "css:#myCanvas"
connector_lines = "css:#myCanvas .connector:has([data-drag]) .connector-path"
green_connector_lines = "css:path.connect-path-success"
orange_connector_lines = "css:path.connect-path-online"
red_connector_lines = "xpath://*[contains(@class,'connector-path-fail')]"
red_dotted_connector_lines = "xpath://*[contains(@class,'connect-path-online-error')]"
orange_dotted_connector_lines = "xpath://*[contains(@class,'connect-path-online')]"
automation_header = "css:.header-box.node-header-online"
device_header_text = "css:.Device-header .head-text"
device_names_on_canvas = "css:#myCanvas #Node .head-text"
devices_on_canvas = "css:#myCanvas #Node"
device_header = "css:.Device-header"
delete_device_or_connection_btn = "css:.editor-main-container .action-bar button"
delete_device_editor_confirmation_btn = "css:.footer-toolbar .footer  button"
establish_connection_button = "css:#Establish_connectionButton"
establish_connection_options_button = "css:.buttonList-toolbar .p-buttonset .p-button-icon-only"
establish_connection_options_closed = "css:.buttonList-toolbar .establishConnectOption-content.close"
establish_connection_options_opened = "css:.buttonList-toolbar .establishConnectOption-content.open"
go_online_button = "css:#goOnlineButton"
drop_target = "css:body>div.tree__root"
go_offline_button = "css:#goOfflineButton"
plant_view_panel_elements = "css:app-tree-menu .p-treenode-leaf .node-label"
connector_line_delete_btn = "css:.btn"
names_of_the_devices_on_canvas = devices_on_canvas + " #Device-header text:nth-of-type(1)"
properties_panel_device_node_element = "xpath://app-device-tree-right-sidebar//div[text()=' ${device_name} ']"
connection_line = "css:.connector-path-outline"
line_hovered = connection_line + ".con-hovered"
connector = "css:.connector .connector-path-outline"
disconnect_online_connection_and_remove_from_project = "css:.contextmenu li:nth-child({})"
disconnect_online_connection_line = "css:.contextmenu li:nth-child(${index})"
selected_orange_dotted_line = "css:.con-path-selected"
server_anchor = "css:.anchor"
client_anchor = "css:.anchor-2"
interface_selection_for_search = "xpath:(//input[@id='interface-selection'])[1]"
no_interface_found = "xpath://*[contains(text(),'No compatible interface found')]"
connector = "css:.connector .connector-path"
connector_success = "css:.connector .connect-path-success"
connection_line = "css:.connector-path-outline"
line_hovered = connection_line + ".con-hovered"
monitoring_interface_table_accordian_td = "css:app-right-sidebar .p-accordion .p-accordion-tab .p-accordion-content table tr:nth-child(2) td:last-child"
connector = "css:.connector .connector-path-outline"
table_device_property = "css:.p-tabview-nav li:nth-child(2)"
properties_panel = "css:app-properties-panel"
accordion_tab = "css:p-accordiontab"
accordion_table_property = "css:app-right-sidebar .p-accordion .p-accordion-tab .p-accordion-content table  tr:nth-child(${row_position}) td:nth-child(1)"
accordion_table_value = "css:app-right-sidebar .p-accordion .p-accordion-tab .p-accordion-content table tr:nth-child(${row_position}) td:last-child"
connector_outline = "css:path.connector-path-outline"
add_connection_to_the_project = "css:.fas.fa-plus-circle"
interface_panels_expanded = "css:.interface-panel--full"
server_interface_expand = "css:.interface-panel-collapsed-icon.fas.fa-chevron-right"
server_inteface_collapse = "css:.interface-header-icon.fas.fa-chevron-left"
server_interface_panel_table = "css:.interface-label.interface-server"
client_interface_expand = "css:.interface-panel-collapsed-icon.fas.fa-chevron-left"
client_inteface_collapse = "css:.interface-header-icon.fas.fa-chevron-right"
client_interface_panel_table = "css:.interface-label.interface-client"
editor_class = "css:.bg-rect"
interface_path="xpath://*[contains(@class,'right-inf')]//*[contains(text(),${interface_name})]"
offline_status="css:span.status.offline"
exposed_panel_collapsed ="css:.interface-panel--collapsed"

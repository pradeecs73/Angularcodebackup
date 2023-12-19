*** Settings ***
Resource    ../../../../keywords/common.resource
Resource    ../../../../keywords/connection_helpers.resource
Resource    ../../../../keywords/connection_keywords.resource
Resource    ../../../../keywords/editor_page.resource
Resource    ../../../../keywords/area_operations.resource
Resource    ../../../../keywords/nested_area_to_nested_area.resource
Suite Setup   Launch Application in chrome browser with no project    ${SUITE_PROJECT_NAME}
Suite Teardown  Clear Project folder and close browser


*** Variables ***
${SUITE_PROJECT_NAME}    NestedArea
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${OFFLINE_CONNECTOR_LINES}=  css:#myCanvas .connector:has([data-drag]) .connector-path
${REMOVE_ONLINE_CONNECTION}=   "Disconnect online connection"
${ADD_ONLINE_CONNECTION}=    "add project connection"
${REMOVE_ONLINE_AND_REMOVE_FROM_PROJECT}=    "Disconnect online connection and remove from project"
${GREEN_COLOR}=   "green"
${BLACK_COLOR}=   "black" 
${ORANGE_COLOR}=  "orange"
${ORANGE_DOTTED_COLOR}=   "orangedotted" 

*** Test Cases ***
TC-01:Online - Nested Area to Nested Area: Verify green line is coming when we go online from root.
    [Tags]  tc-967351
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create nested areas with devices inside along with connection drawn
    And Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    And Click Gooffline Button

TC-02:Online - Nested Area to Nested Area: Verify green line is coming when we go online from root from area containing client device.
    [Tags]  tc-968711
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create nested areas with devices inside along with connection drawn 
    And Select Particuler Menu From Left Menu   5
    And Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    And Click Gooffline Button

TC-03:Online - Nested Area to Nested Area: Verify black line is coming when we go online from root from area containing server device.
    [Tags]  tc-968714
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create nested areas with devices inside along with connection drawn 
    And Select Particuler Menu From Left Menu   2
    And Click Goonline Button
    Then color of the element    ${OFFLINE_CONNECTOR_LINES}    ${BLACK_COLOR}
    And Click Gooffline Button

TC-04:Online - Nested area to Nested area: Verify orange dotted line is coming when we go online from root.
    [Tags]  tc-967369
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create orange line between between nested areas
    And Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
     And Click Gooffline Button

TC-05:Online - Nested Area to Nested Area: Verify orange dotted line is coming when we go online from root from area containing client device.
    [Tags]  tc-968716
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create orange line between between nested areas
    And Select Particuler Menu From Left Menu   5
    And Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    And Click Gooffline Button

TC-06:Online - Nested Area to Nested Area: Verify black line is coming when we go online from root from area containing server device.
    [Tags]  tc-968718
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create orange line between between nested areas
    And Select Particuler Menu From Left Menu   2
    And Click Goonline Button
    Then color of the element    ${OFFLINE_CONNECTOR_LINES}    ${BLACK_COLOR}
    And Click Gooffline Button



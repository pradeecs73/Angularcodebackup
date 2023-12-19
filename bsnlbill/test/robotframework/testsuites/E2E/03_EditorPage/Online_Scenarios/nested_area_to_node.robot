*** Settings ***
Resource    ../../../../keywords/common.resource
Resource    ../../../../keywords/editor_page.resource
Resource    ../../../../keywords/area_operations.resource
Resource    ../../../../keywords/node_to_nested_area.resource
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
TC-01:Online - Nested area to node: Verify green line is coming when we go online from root (client device inside nested area).
    [Tags]  tc-967241
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create Nested area to node with client device inside the nested area
    Then Check For Online Connection In The Editor
    And click connection line    ${GREEN_COLOR}
    And Right Click the connection line     ${GREEN_COLOR}
    And Click the connection option   ${REMOVE_ONLINE_CONNECTION}   1
    Then color of the element    ${OFFLINE_CONNECTOR_LINES}    ${BLACK_COLOR}
    And Click Gooffline Button

TC-02:Online - Nested area to node: Verify green line is coming when we go online from root (server device inside nested area).
    [Tags]  tc-968621
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create Nested area to node with server device inside the nested area
    Then Check For Online Connection In The Editor
    And click connection line    ${GREEN_COLOR}
    And Right Click the connection line     ${GREEN_COLOR}
    And Click the connection option   ${REMOVE_ONLINE_AND_REMOVE_FROM_PROJECT}   2
    And Click Gooffline Button
    Then Number Of Connection Lines Should Be  0

TC-03:Online - Nested area to node: Verify orange dotted line is coming when we go online from root (client device inside the nested area).
    [Tags]  tc-967248
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Orange Dotted line when client device inside the nested area
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    And Right Click the connection line     ${ORANGE_DOTTED_COLOR}
    Then Element Should Not Be Clickable   ${disconnect_online_connection_and_remove_from_project.format(3)}
    And Click the connection option    ${REMOVE_ONLINE_CONNECTION}  2
    Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}      
    And Click Gooffline Button     
    Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}

TC-04:Online - Nested area to node: Verify green line is coming when we go online from area (client device inside nested area).
    [Tags]  tc-968620
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    And Create Nested area to node with client device inside the nested area
    And Select Particuler Menu From Left Menu    3
    And Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    Then color of the element    ${automation_header}    ${ORANGE_COLOR}
    And Click Gooffline Button

TC-05:Online - Nested area to node: Verify green line is coming when we go online from area (server device inside nested area).
    [Tags]  tc-968622
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create Nested area to node with server device inside the nested area
    And Select Particuler Menu From Left Menu    3
    And Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    Then color of the element    ${automation_header}    ${ORANGE_COLOR}
    And Click Gooffline Button

TC-06:Online - Nested area to node: Verify orange dotted line is coming when we go online from area (client device inside the nested area).
    [Tags]  tc-968623
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    And Orange Dotted line when client device inside the nested area
    And Select Particuler Menu From Left Menu    3
    And Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    And Click Gooffline Button

Tc-07:Online - Nested area to node: Verify orange dotted line is coming when we go online from root (server device inside the nested area).
    [Tags]  tc-968625
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Orange Dotted line when server device inside the nested area
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    And Right Click the connection line     "orangedotted"
    Then Element Should Not Be Clickable   ${disconnect_online_connection_and_remove_from_project.format(3)}
    And Click the connection option    ${ADD_ONLINE_CONNECTION}  1
    Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}      
    And Click Gooffline Button     
    Then Number Of Connection Lines Should Be  1

Tc-08:Online - Nested area to node: Verify black line is coming when we go online from area (server device inside the nested area).
    [Tags]  tc-968626
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Orange Dotted line when server device inside the nested area
    And Select Particuler Menu From Left Menu    3
    And Click Goonline Button
    Then color of the element    ${OFFLINE_CONNECTOR_LINES}    ${BLACK_COLOR}
    And Click Gooffline Button

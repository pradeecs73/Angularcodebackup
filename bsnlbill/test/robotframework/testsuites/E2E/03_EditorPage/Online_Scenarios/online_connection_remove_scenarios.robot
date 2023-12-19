*** Settings ***
Resource          ./../../../../keywords/add_device_helpers.resource
Resource          ./../../../../Keywords/area_operations.resource
Resource          ./../../../../keywords/editor_page.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser

*** Variables ***
${SUITE_PROJECT_NAME}    Online_Connection_Remove_Scenario
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${COLOR_CONNECTION_GREEN} =   "green"
${COLOR_CONNECTION_BLACK} =   "black"
${COLOR_CONNECTION_ORANGE} =  "orange"
${COLOR_CONNECTION_ORANGE_DOTTED} =  "orangedotted"
@{IP_VALUES_MANUAL_PROTECTED}=       opc.tcp://192.168.2.109:4840   opc.tcp://192.168.2.110:4840
${WRITE_PASSWORD}       Test@123
${CONFIRM_Write_PASSWORD}       Test@123
${AUTOMATION_COMPONENT_USERNAME}       user1
${AUTOMATION_COMPONENT_PASSWORD}       siemens123
${title}    Password protection for the project is required
${OFFLINE_CONNECTOR_LINES}=  css:#myCanvas .connector:has([data-drag]) .connector-path
${DISCONNECT_ONLINE_OPTION1}    Password protection for the project is required
${DISCONNECT_ONLINE_OPTION2} =  "Disconnect online connection"
${DISCONNECT_ONLINE_OPTION3} =  "Disconnect online connection and remove from project"



*** Test Cases ***

TC1:Check whether the application allows to remove the online connection between the devices with offline connection
    [Tags]  tc-943430
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Goonline with offline connection
    And click connection line     ${COLOR_CONNECTION_GREEN}
    And Right Click the connection line     ${COLOR_CONNECTION_GREEN}
    And Click the connection option    ${DISCONNECT_ONLINE_OPTION3}  2
    Then Click Gooffline Button
    Then Number Of Connection Lines Should Be    0


TC2:Check whether the application allows to remove the online connection between the secured devices with offline connection
    [Tags]  tc-955394
    [Setup]    Given Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    AND Add Devices In Loop Through Manual Entry for protected devices   ${title}  @{IP_VALUES_MANUAL_PROTECTED}
    When Goonline with offline connection
    And click connection line     ${COLOR_CONNECTION_GREEN}
    And Right Click the connection line     ${COLOR_CONNECTION_GREEN}
    And Click the connection option    ${DISCONNECT_ONLINE_OPTION3}  2
    Then Click Gooffline Button
    Then Number Of Connection Lines Should Be    0

TC3:Check whether the application allows to remove the online connection between the devices without offline connection
    [Tags]  tc-943428
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Goonline with offline connection
    Then Create Online Connection
    And Right Click the connection line     ${COLOR_CONNECTION_ORANGE_DOTTED}
    Then Element Should Not Be Clickable   ${disconnect_online_connection_and_remove_from_project.format(3)}
    And Click the connection option    ${DISCONNECT_ONLINE_OPTION2}   2
    And Click Gooffline Button
    Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}

TC4:Check whether the application allows to remove the online connection between the secured devices without offline connection
    [Tags]  tc-979613
    [Setup]   Given Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    AND Add Devices In Loop Through Manual Entry for protected devices   ${title}  @{IP_VALUES_MANUAL_PROTECTED}
    When Goonline with offline connection
    Then Create Online Connection
    And Right Click the connection line     ${COLOR_CONNECTION_ORANGE_DOTTED}
    Then Element Should Not Be Clickable   ${disconnect_online_connection_and_remove_from_project.format(3)}
    And Click the connection option    ${DISCONNECT_ONLINE_OPTION2}  2
    And Click Gooffline Button
    Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}


*** Keywords ***

Goonline with offline connection
    [Documentation]  Going to editor page and dropping devices to editor
   ...    and then checking color of the line by going online
    Go To Plant View Page
    Drop Devices To Connection Editor
    Draw Connection With Search
    Establish All Connection In The Editor
    Click Goonline Button
    color of the element     ${green_connector_lines}    ${COLOR_CONNECTION_GREEN}

Opened Project
     [Documentation]  Creating a new project with the name passed as a argument
     ...     and opening it
     [Arguments]  ${project_name}
     Create New Project   ${project_name}

Delete offline connection
    [Documentation]  Deleting black connection line
    click connection line    ${COLOR_CONNECTION_BLACK}
    Click Delete Icon
    Confirm Popup

Create Online Connection
    [Documentation]  Creating the orange dotted line between the devices
    Click Gooffline Button
    Delete offline connection
    Click Goonline Button
    color of the element     ${orange_connector_lines}    ${COLOR_CONNECTION_ORANGE}


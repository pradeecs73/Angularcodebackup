*** Settings ***
Resource          ./../../../../keywords/add_device_helpers.resource
Resource          ./../../../../Keywords/area_operations.resource
Resource          ./../../../../keywords/editor_page.resource
Resource         ../../../../keywords/PLC_scim.resource
Suite Setup      Turn ON PLC And Launch Application    @{IP_VALUES_GUESTS_PLCS}
Suite Teardown   Switch Off Plc And Close Browser    @{IP_VALUES_GUESTS_PLCS}


*** Variables ***
${SUITE_PROJECT_NAME}    Online_Connection_Scenarios
${IP_RANGE_START_GUEST}    192.168.2.105
${IP_RANGE_END_GUEST}      192.168.2.106
${COLOR_CONNECTION_GREEN} =   "green"
${COLOR_CONNECTION_BLACK} =   "black"
${COLOR_CONNECTION_ORANGE} =  "orange"
${COLOR_CONNECTION_ORANGE_DOTTED} =  "orangedotted"
@{IP_VALUES_GUESTS_PLCS}=       BF-Guest   LM-Guest
${OFFLINE_CONNECTOR_LINES}=  css:#myCanvas .connector:has([data-drag]) .connector-path
${DISCONNECT_ONLINE_OPTION1} =  "Disconnect online connection"
${DISCONNECT_ONLINE_OPTION2} =  "Disconnect online connection and remove from project"
${BOTTLE_FILLING_SECURE}    opc.tcp://192.168.2.109:4840
${LIQUID_MIXING_GUEST}    opc.tcp://192.168.2.106:4840


*** Test Cases ***
TC1:Check whether the application allows to remove the online connection between the guest devices with offline connection
    [Tags]  tc-955395
    [Setup]  Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START_GUEST}   ${IP_RANGE_END_GUEST}
    [Teardown]   Close And Delete The Opened Project
    When Goonline with offline connection
    And click connection line     ${COLOR_CONNECTION_GREEN}
    And Right Click the connection line     ${COLOR_CONNECTION_GREEN}
    And Click the connection option    ${DISCONNECT_ONLINE_OPTION2}  2
    Then Click Gooffline Button
    Then Number Of Connection Lines Should Be    0

TC2:Check whether the application allows to remove the online connection between the guest devices without offline connection
    [Tags]  tc-979620
    [Setup]  Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START_GUEST}   ${IP_RANGE_END_GUEST}
    [Teardown]  Close And Delete The Opened Project
    When Goonline with offline connection
    Then Create Online Connection
    And Right Click the connection line     ${COLOR_CONNECTION_ORANGE_DOTTED}
    Then Element Should Not Be Clickable   ${disconnect_online_connection_and_remove_from_project.format(3)}
    And Click the connection option    ${DISCONNECT_ONLINE_OPTION1}   2
    And Click Gooffline Button
    Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}

TC3:Check whether application is allows to establish the connection and Go online between guest devices without offline connection
    [Tags]  tc-943424
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START_GUEST}   ${IP_RANGE_END_GUEST}
    [Teardown]  Close And Delete The Opened Project
    When Goonline with offline connection
    Then Create Online Connection And Check For Interface Monitoring

 TC4:Check whether application is allows to establish the connection and Go online between guest devices with offline connection
    [Tags]  tc-943423
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START_GUEST}   ${IP_RANGE_END_GUEST}
    [Teardown]   Close And Delete The Opened Project
    When Goonline with offline connection
    Then Check for interface monitoring
    Then Click Gooffline Button

TC5:Check whether application is allows to establish the connection and Go online between secured and guest device with offline connection
    [Tags]  tc-943428
    [Setup]   Given Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    AND Add Any Two Device Secured/NonSecured/Guest   ${LIQUID_MIXING_GUEST}  ${BOTTLE_FILLING_SECURE}


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

Check for interface monitoring
    [Documentation]  Checking the interface monitoring in the properties panel
    Click On The Interface To Monitor   FillingToMixing
    Select Properties Panel
    Verify Monitoring Value  2   FaultyBottles  0

Create Online Connection And Check For Interface Monitoring
    [Documentation]  Creating a orange dotted line and do monitoring
    Click Gooffline Button
    Delete offline connection
    Click Goonline Button
    color of the element     ${orange_connector_lines}    ${COLOR_CONNECTION_ORANGE}
    Check for interface monitoring
    Click Gooffline Button

Add Any Two Device Secured/NonSecured/Guest
    [Documentation]  Adding secured or unsecured devices along with protected
    [Arguments]  ${manual_entry_ip}  ${secured_ip}
    Load Add Device Popup
    Add Devices Through Manual Entry   ${manual_entry_ip}
    Load Add Device Popup
    Add Devices Through Manual Entry for protected device   ${secured_ip}
    Fill Password Values For Protected Fields Add Device  ${WRITE_PASSWORD}  ${CONFIRM_Write_PASSWORD}
    Fill The Automation Component Credentials To Authenticate  ${AUTOMATION_COMPONENT_USERNAME}  ${AUTOMATION_COMPONENT_PASSWORD}
    Confirm Adding Devices
    Goonline with offline connection
    Check for interface monitoring
    Click Gooffline Button












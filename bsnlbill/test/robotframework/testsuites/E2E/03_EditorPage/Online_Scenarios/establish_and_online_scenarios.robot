*** Settings ***
Resource          ./../../../../keywords/add_device_helpers.resource
Resource          ./../../../../Keywords/area_operations.resource
Resource          ./../../../../keywords/editor_page.resource
Resource         ../../../../keywords/PLC_scim.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser

*** Variables ***
${SUITE_PROJECT_NAME}    Online_Scenario
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${COLOR_CONNECTION_GREEN} =   "green"
${COLOR_CONNECTION_BLACK} =   "black"
${COLOR_CONNECTION_ORANGE} =   "orange"
@{IP_VALUES_MANUAL_PROTECTED}=       opc.tcp://192.168.2.109:4840   opc.tcp://192.168.2.110:4840
${SECURED_DEVICE}=    opc.tcp://192.168.2.109:4840
${NON_SECURED_DEVICE}=    opc.tcp://192.168.2.102:4840
${WRITE_PASSWORD}       Test@123
${CONFIRM_Write_PASSWORD}       Test@123
${AUTOMATION_COMPONENT_USERNAME}       user1
${AUTOMATION_COMPONENT_PASSWORD}       siemens123
${title}    Password protection for the project is required


*** Test Cases ***

TC1:Check whether application is allows to establish the connection and Go online between Non secured devices without offline connection
    [Tags]  tc-943420
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Goonline with offline connection
    Then Create Online Connection And Check For Interface Monitoring

TC2:Check whether application is allows to establish the connection and Go online between secured devices with offline connection
    [Tags]  tc-943421
    [Setup]   Given Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    AND Add Devices In Loop Through Manual Entry for protected devices   ${title}  @{IP_VALUES_MANUAL_PROTECTED}
    When Goonline with offline connection
    Then Check for interface monitoring
    Then Click Gooffline Button

TC3:Check whether application is allows to establish the connection and Go online between secured devices without offline connection
    [Tags]  tc-943422
    [Setup]   Given Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    AND Add Devices In Loop Through Manual Entry for protected devices   ${title}  @{IP_VALUES_MANUAL_PROTECTED}
    When Goonline with offline connection
    Then Create Online Connection And Check For Interface Monitoring

TC4:Check whether application is allows to establish the connection and Go online between secured and nonsecured device with offline connection
    [Tags]  tc-943428
    [Setup]   Given Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    AND Add Any Two Device Secured/NonSecured/Guest   ${NON_SECURED_DEVICE}  ${SECURED_DEVICE}


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

Delete offline connection
    [Documentation]  Deleting black connection line
    click connection line    ${COLOR_CONNECTION_BLACK}
    Click Delete Icon
    Confirm Popup

Check for interface monitoring
    [Documentation]  Checking the interface monitoring in the properties panel
    Click On The Interface To Monitor   FillingToMixing
    Select Properties Panel
    Verify Monitoring Value  2   FaultyBottles  0

Opened Project
     [Documentation]  Creating a new project with the name passed as a argument
     ...     and opening it
     [Arguments]  ${project_name}
     Create New Project   ${project_name}

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





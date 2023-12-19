*** Settings ***
Resource    ../../../keywords/common.resource
Resource    ../../../keywords/add_device_helpers.resource
Resource         ./../../../Keywords/area_operations.resource
Resource         ./../../../keywords/editor_page.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   Clear Project folder and close browser

*** Variables ***
${PROJECT_NAME}=       update device
${PROJECT_READ}=       Read Project
${PROJECT_COMMENT}=    testing the functionality of update device
${PROJECT_AUTHOR}=     SIMATICLIVELINK
${DEVICE_ADDRESS}=     opc.tcp://192.168.2.101:4840
${IP_VALUE_MANUAL_PROTECTED}       opc.tcp://192.168.2.109:4840
${AUTOMATION_COMPONENT_USERNAME}       user1
${AUTOMATION_COMPONENT_PASSWORD}       siemens123

${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${OPEN_PROJECT_LABEL}   Open protected project
${WRITE_PASSWORD}       Test@123
*** Test Cases ***
TC:1 Check whether application allows to update a device from one IP address to another IP address
    [Tags]       TC-834836
    [Setup]     Create Project with device added via manual mode   ${PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project   ${PROJECT_NAME}
                And Update a device with new IP address    opc.tcp://192.168.2.102:4840
                Then Device should be updated with new name    LiquidMixing


TC:2 Check whether application forces the user to project project while updating to secured device
    [Tags]      TC-902016
    [Setup]     Create Project with device added via manual mode   ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project  ${PROJECT_NAME}
            And Update to secured device for non-protected project    opc.tcp://192.168.2.110:4840
            Then Device should be updated with new name    LiquidMixing


TC:3 Check Whether application ask for device credentials alone for protected project while updating to secured device
    [Tags]      TC-902017
    [Setup]     Create Project with device added via manual mode    ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project  ${PROJECT_NAME}
          When Setup Write Password For Project
          And Go To Device Tree Page
          And Update to secured device for protected project    opc.tcp://192.168.2.110:4840
          Then Device should be updated with new name        LiquidMixing

TC:6 Check for connection between the areas when device got updated
    [Tags]  tc-928321
    [Setup]   Create Project and Add Devices with Scan   ${PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    And Draw Connection With Search
    Then Number Of Connection Lines Should Be  1
    Then Create New Area
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area   1   4
    And Go To Device Tree Page
    And Update a device with new IP address    opc.tcp://192.168.2.101:4840
    Then Go To Plant View Page
    Then Number Of Connection Lines Should Be  1

#TC:4 Check Whether applicaton does not allows to update device with read access mode
#    [Tags]    TC-908896
#    [Setup]    Create Project with device added via manual mode
#    [Teardown]  Close and Delete Protected Project  ${PROJECT_NAME}
#         When Setup Write Password For Project
#         Then Setup Read Password For Project
#         Then close and Open given project   ${PROJECT_NAME}
#         Then Password Verification Dialog Should Be Visible   ${OPEN_PROJECT_LABEL}
#         And Click Open Protected Project button
#         And Fill Password Field   ${READ_PASSWORD}
#         And Click Open Protected Project button
#         Then Password Verification Dialog Should Be Closed
#         And Go To Device Tree Page
#         Then Element Should Not Be Clickable   ${btn_update_device}
#         Then Go To Home Page
#         And Click close project button
#         Then Project Should Be In The Project List Without OPENED Label     ${PROJECT_NAME}

#TC:5 Check whether application should ask for device credentails while updating from one secure to another secured device with different password only
#    [Tags]    TC-908898
#    [Setup]  Create New Project
#    [Teardown]  Close and Delete Protected Project  ${PROJECT_NAME}
#            When Setup Write Password For Project
#            Then close and Open given project   ${PROJECT_NAME}
#            Then Password Verification Dialog Should Be Visible   ${OPEN_PROJECT_LABEL}
#            And Click Open Protected Project button
#            And Fill Password Field   ${WRITE_PASSWORD}
#            And Click Open Protected Project button
#            Then Password Verification Dialog Should Be Closed
#            Then Project Should Be In The Project List With OPENED Label    ${PROJECT_NAME}
#            And Go To Device Tree Page
#            AND Load Add Device Popup
#            And Add Devices Through Manual Entry for protected device  ${IP_VALUE_MANUAL_PROTECTED}
#            Then Fill The Automation Component Credentials To Authenticate  ${AUTOMATION_COMPONENT_USERNAME}  ${AUTOMATION_COMPONENT_PASSWORD}
#            Then Confirm Adding Devices
#            Then Number Of Remaining Devices In Device Page Should Be  1
#            And Update to secured device for protected project    opc.tcp://192.168.2.110:4840
#            Then Device should be updated with new name    LiquidMixing
#            And Click close project button
#            And Click with save option


#
# Tc:7 Check if application is throwing Error if PLC with AES security policy is added
#    [Tags]  tc-955049
#    [Setup]   Given Opened Project With Added Devices
#    [Teardown]  Close And Delete The Opened Project
#    And Update a device with new IP address    opc.tcp://192.168.2.135:4840
#    Then Popup Should Be Visible    Failed to update the device.
#    Close Error Popup


#Note: Updating with same IP address testcase needs to be implemented


*** Keywords ***
Create Project with device added via manual mode
    [Arguments]   ${project_name}
    Create New Project   ${project_name}
    Add Device to project

Device should be updated with new name
    [Arguments]    @{new_device_name}
    All Added Devices Should Have Updated Flag
    devices should present in devicepage      @{new_device_name}

Add Device to project
    Load Add Device Popup
    Add Devices Through Manual Entry    ${DEVICE_ADDRESS}







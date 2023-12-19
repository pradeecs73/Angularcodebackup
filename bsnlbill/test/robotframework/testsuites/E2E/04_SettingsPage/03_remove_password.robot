*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Resource          ../../../keywords/settings_page_helpers.resource
Resource          ../../../keywords/add_device_helpers.resource
Suite Setup       Launch Application in chrome browser with no project   ${SUITE_PROJECT_NAME} 
Suite Teardown    Clear Project folder and close browser


*** Variables ***
${SUITE_PROJECT_NAME}     Create project
${PROJECT_NAME}       SettingsPage
${IP_VALUE_MANUAL_PROTECTED}       opc.tcp://192.168.2.109:4840
${WRITE_PASSWORD}       Test@123
${READ_PASSWORD}      Test@1234
${CONFIRM_Write_PASSWORD}       Test@123
${AUTOMATION_COMPONENT_USERNAME}       user1
${AUTOMATION_COMPONENT_PASSWORD}       siemens123

*** Test Cases ***
TC-01: Remove The Write Password(without saving)
    [Tags]    tc-900187
    [Setup]  Given Create Project and Setup Write Password    ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project   ${PROJECT_NAME}
    And Click Setup Write Password Button
    Then Popup Should Be Visible     Password protection for the project has been disabled.
    And Click yes option
    Then Password Verification Dialog Should Be Visible   Remove access protection for the project
    And Fill Password Field   Test@123456
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
    And Click yes option
    And Fill Password Field   ${WRITE_PASSWORD}
    And Click Open Protected Project button
    Then Password Verification Dialog Should Be Closed
    Then Popup Should Be Visible    Authentication successful  success
    And Click yes option
    Then Checkbox Should Not Be Selected  ${setup_write_password}
    Then Go To Home Page
    Then Project Should Not Be Protected    ${PROJECT_NAME}    protected-key
    And Close Project 
    Then Project Should Be Protected    ${PROJECT_NAME}    protected-key

TC-02: Remove The Write Password(with saving)
    [Tags]    tc-900205
    [Setup]  Given Create Project and Setup Write Password  ${PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project    ${PROJECT_NAME}
    Then Click Setup Write Password Button
    Then Popup Should Be Visible     Password protection for the project has been disabled.
    And Click yes option
    Then Password Verification Dialog Should Be Visible   Remove access protection for the project
    And Fill Password Field   ${WRITE_PASSWORD}
    And Click Open Protected Project button
    Then Password Verification Dialog Should Be Closed
    Then Popup Should Be Visible    Authentication successful  success
    And Click yes option
    Then Checkbox Should Not Be Selected  ${setup_write_password}
    And Click Save Project button
    Then Go To Home Page
    Then Project Should Not Be Protected    ${PROJECT_NAME}    protected-key
    And Close Project 
    Then Project Should Not Be Protected    ${PROJECT_NAME}    protected-key


TC-03: Remove The Read Password with write password (without saving)
    [Tags]    tc-900187
    [Setup]  Create Project and Setup Write Password    ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project    ${PROJECT_NAME}
    Then Setup Read Password For Project
    And Click Remove Read Password
    Then Password Verification Dialog Should Be Visible   Remove password for read access
    And Fill Password Field   ${WRITE_PASSWORD}
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication successful  success
    And Click yes option
    Then Go To Home Page
    And Close Project 
    Then Project Should Be Protected   ${PROJECT_NAME}    protected-key
    And Select the project    ${PROJECT_NAME}
    And Click open project button
    And Fill Password Field   ${READ_PASSWORD}
    And Click Open Protected Project button
    Then Password Verification Dialog Should Be Closed
    Then Project Should Be In The Project List With OPENED Label   ${PROJECT_NAME}
    And Click close project button


TC-04: Remove The Read Password with write password(with saving)
    [Tags]    tc-900233
    [Setup]  Given Create Project and Setup Write Password   ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project    ${PROJECT_NAME}
    When Setup Read Password For Project
    And Click Remove Read Password
    Then Password Verification Dialog Should Be Visible   Remove password for read access
    And Fill Password Field   ${WRITE_PASSWORD}
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication successful  success
    And Click yes option
    And Click Save Project button
    Then Go To Home Page
    And Close Project 
    Then Project Should Be Protected   ${PROJECT_NAME}    protected-key
    And Select the project    ${PROJECT_NAME}
    And Click open project button
    And Fill Password Field   ${READ_PASSWORD}
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
    And Click yes option
    And Click Cancel button
    
TC-05: Remove The Write Password(without saving) And Add Protected Device
    [Tags]    tc-917442
    [Setup]  Given Create Project and Setup Write Password   ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project    ${PROJECT_NAME}
    Then Checkbox Should Be Selected  ${setup_write_password}
    And Click Setup Write Password Button
    Then Popup Should Be Visible     Password protection for the project has been disabled.
    And Click yes option
    Then Password Verification Dialog Should Be Visible   Remove access protection for the project
    And Fill Password Field   ${WRITE_PASSWORD}
    And Click Open Protected Project button
    Then Password Verification Dialog Should Be Closed
    Then Popup Should Be Visible    Authentication successful  success
    And Click yes option
    Then Checkbox Should Not Be Selected  ${setup_write_password}
    AND Load Add Device Popup
    AND Add Devices Through Manual Entry for protected device  ${IP_VALUE_MANUAL_PROTECTED}
    Then Fill Password Values For Protected Fields Add Device  ${WRITE_PASSWORD}  ${CONFIRM_Write_PASSWORD}
    Then Fill The Automation Component Credentials To Authenticate  ${AUTOMATION_COMPONENT_USERNAME}  ${AUTOMATION_COMPONENT_PASSWORD}
    Then Confirm Adding Devices
    Then Number Of Remaining Devices In Device Page Should Be  1

TC-06: Remove The Read Password dialog should close on cancel button click
    [Tags]    tc-
    [Setup]  Given Create Project and Setup Write Password   ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project    ${PROJECT_NAME}
    And Setup Read Password For Project
    And Click Remove Read Password
    Then Password Verification Dialog Should Be Visible   Remove password for read access
    And click Cancel button
    Then Password Verification Dialog Should Be Closed

TC-07: Should not allow to remove the read password with read password or wrong password
    [Tags]    tc-
    [Setup]  Given Create Project and Setup Write Password    ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project    ${PROJECT_NAME}
    And Setup Read Password For Project
    And Click Remove Read Password
    Then Password Verification Dialog Should Be Visible   Remove password for read access
    And Fill Password Field   ${READ_PASSWORD}
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
    And Click yes option
    And click Cancel button

TC-08: Remove Write password popup should close on cancel button
    [Tags]    tc-
    [Setup]  Given Create Project and Setup Write Password    ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project    ${PROJECT_NAME}
    And Click Setup Write Password Button
    Then Popup Should Be Visible     Password protection for the project has been disabled.
    And Click yes option
    Then Password Verification Dialog Should Be Visible   Remove access protection for the project
    And click Cancel button
    Then Password Verification Dialog Should Be Closed

TC-09: Remove Write password popup should close on click of no option
    [Tags]    tc-
    [Setup]  Given Create Project and Setup Write Password   ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project    ${PROJECT_NAME}
    When Click Setup Write Password Button
    Then Popup Should Be Visible     Password protection for the project has been disabled.
    And Click no option
    Then Checkbox Should Be Selected  ${setup_write_password}


*** Keywords ***
Create Project and Setup Write Password
    [Documentation]  Creates the project with the project name given in the argument and set the write access password for the project.
    [Arguments]   ${project_name}
    Create Project With Given Project Name    ${project_name}
    Project Should Be In The Project List With OPENED Label    ${project_name}
    SetUp Write Password For Project




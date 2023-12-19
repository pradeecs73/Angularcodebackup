*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Suite Setup       Launch Application in chrome browser with no project   ${SUITE_PROJECT_NAME} 
Suite Teardown    Clear Project folder and close browser

*** Variables ***
${SUITE_PROJECT_NAME}     Create project
${PROJECT_NAME}       SettingsPage
${TITLE_FOR_WRITE_ACCESS}    Set password for write access
${TITLE_FOR_READ_ACCESS}    Set password for read access
${WRITE_ACCESS_PASSWORD}    Test@123
${READ_ACCESS_PASSWORD}    Test@1234
${PROTECTED_KEY}    protected-key
${ERROR_MESSAGE_READ_WRITE_SAME}    Passwords for read and write access cannot be the same.

*** Test Cases ***
TC-01: Protect the project with write access(without saving)
    [Tags]    tc-897547
    [Setup]  Create Project and Go to Settings Page    ${PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project    ${PROJECT_NAME}
    And Click Setup Write Password Button
    Then Password Popup Should Be Visible    ${TITLE_FOR_WRITE_ACCESS}
    And Click Cancel Button
    Then Password Popup Should Not Be Visible
    And Click Setup Write Password Button
    Then Password Popup Should Be Visible    ${TITLE_FOR_WRITE_ACCESS}
    Then Password Validation
    And Fill The Confirm Password Field   ${WRITE_ACCESS_PASSWORD}
    And Fill New Password Field    ${WRITE_ACCESS_PASSWORD}
    Then Check Show Password
    And Click Setup Password button
    Then Password Popup Should Not Be Visible
    Then Checkbox Should Be Selected  ${setup_write_password}
    Then Go To Home Page
    Then Project Should Be Protected   ${PROJECT_NAME}    ${PROTECTED_KEY}

TC-02: Protect the project with write access(with saving)
    [Tags]    tc-897563
    [Setup]  Create Project and Go to Settings Page    ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project    ${PROJECT_NAME}
    And Click Setup Write Password Button
    Then Password Popup Should Be Visible    ${TITLE_FOR_WRITE_ACCESS}
    And Click Cancel Button
    Then Password Popup Should Not Be Visible
    And Click Setup Write Password Button
    Then Password Popup Should Be Visible    ${TITLE_FOR_WRITE_ACCESS}
    Then Password Validation
    And Fill New Password Field    ${WRITE_ACCESS_PASSWORD}
    And Fill The Confirm Password Field   ${WRITE_ACCESS_PASSWORD}
    Then Check Show Password
    And Click Setup Password button
    Then Password Popup Should Not Be Visible
    Then Checkbox Should Be Selected  ${setup_write_password}
    And Click Save Project button
    Then Go To Home Page
    Then Project Should Be Protected   ${PROJECT_NAME}    ${PROTECTED_KEY}

TC-03: Protect the project with read access(with saving)
    [Tags]    tc-898245
    [Setup]  Create Project and Setup Write Password For Project    ${PROJECT_NAME}
    [Teardown]  Close and Delete Protected Project In Read Access
    And Click Setup Read Password
    Then Password Popup Should Be Visible    ${TITLE_FOR_READ_ACCESS}
    And Click Cancel Button
    Then Password Popup Should Not Be Visible
    And Click Setup Read Password
    Then Password Popup Should Be Visible    ${TITLE_FOR_READ_ACCESS}
    Then Password Validation
    And Fill New Password Field    ${WRITE_ACCESS_PASSWORD}
    And Fill The Confirm Password Field   ${WRITE_ACCESS_PASSWORD}
    And Click Setup Password button
    Then Should throw an error message    ${ERROR_MESSAGE_READ_WRITE_SAME}
    And Fill New Password Field    ${READ_ACCESS_PASSWORD}
    And Fill The Confirm Password Field   ${READ_ACCESS_PASSWORD}
    Then Check Show Password
    And Click Setup Password button
    Then Password Popup Should Not Be Visible
    Then Remove Read Password Should Be Enabled
    Then Go To Home Page
    Then Project Should Be Protected   ${PROJECT_NAME}    ${PROTECTED_KEY}
    And Close Project  True
    And Select the project    ${PROJECT_NAME}
    And Click open project button
    And Fill Password Field   ${READ_ACCESS_PASSWORD}
    And Click Open Protected Project button
    Then Password Verification Dialog Should Be Closed
    Then Project Should Be In The Project List With OPENED Label   ${PROJECT_NAME}
    
TC-04: Protect the project with read access(without saving)
    [Tags]    tc-898396
    [Setup]  Create Project and Setup Write Password For Project    ${PROJECT_NAME}
    [Teardown]  Delete Protected Project  ${PROJECT_NAME}   ${WRITE_ACCESS_PASSWORD}
    And Click Setup Read Password
    Then Password Popup Should Be Visible    ${TITLE_FOR_READ_ACCESS}
    And Click Cancel Button
    Then Password Popup Should Not Be Visible
    And Click Setup Read Password
    Then Password Popup Should Be Visible    ${TITLE_FOR_READ_ACCESS}
    Then Password Validation
    And Fill New Password Field    ${READ_ACCESS_PASSWORD}
    And Fill The Confirm Password Field   ${READ_ACCESS_PASSWORD}
    Then Check Show Password
    And Click Setup Password button
    Then Password Popup Should Not Be Visible
    Then Remove Read Password Should Be Enabled
    Then Go To Home Page
    Then Project Should Be Protected   ${PROJECT_NAME}    ${PROTECTED_KEY} 
    And Close Project
    And Select the project    ${PROJECT_NAME}
    And Click open project button
    And Fill Password Field   ${READ_ACCESS_PASSWORD}
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials. 
    And Click yes option
    And click Cancel button
    Then Project Should Be In The Project List Without OPENED Label   ${PROJECT_NAME}



*** Keywords ***
Close and Delete Protected Project In Read Access
    Click close project button
    Project Should Be In The Project List Without OPENED Label   ${PROJECT_NAME}
    Delete Protected Project  ${PROJECT_NAME}   ${WRITE_ACCESS_PASSWORD}
    Project Should Not Be In the Project List    ${PROJECT_NAME}


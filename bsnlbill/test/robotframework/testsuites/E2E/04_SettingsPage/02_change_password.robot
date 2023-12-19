*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Suite Setup       Launch Application in chrome browser with no project
Suite Teardown    close browser

*** Variables ***
${PROJECT_NAME}       SettingsPage
${WRITE_PASSWORD}     Test@123
${CHANGE_WRITE_PASSWORD}     Test@12345


*** Test Cases ***
TC-01: Change the write access password(without saving)
    [Tags]    tc-899699
    [Setup]  Given Create Project and Setup Write Password   ${PROJECT_NAME}
    [Teardown]    Close and Delete Protected Project    ${PROJECT_NAME}
    And Setup Read Password For Project
    And Click Change Write Password
    Then Password Popup Should Be Visible    Change write password
    And Click Cancel Button
    Then Password Popup Should Not Be Visible
    And Click Change Write Password
    Then Password Popup Should Be Visible    Change write password
    Then Password Validation
    And Change Password Validations  Test@1234  Test@12345   Test@12345   The old password is incorrect.
    And Change Password Validations  Test@123  Test@123   Test@123   Old and new passwords cannot be the same.
    And Change Password Validations  Test@123  Test@1234   Test@1234   Passwords for read and write access cannot be the same.
    And Fill the Old Password Field  Test@123
    And Fill New Password Field    Test@12345
    And Fill The Confirm Password Field   Test@12345
    And Check Show Password
    And Click Setup Password button
    Then Password Popup Should Not Be Visible
    Then Go To Home Page
    Then Project Should Be Protected   ${PROJECT_NAME}    protected-key
    And Close Project
    And Select the project    ${PROJECT_NAME}
    And Click open project button
    And Fill Password Field   Test@12345
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
    And Click yes option
    And Fill Password Field   ${WRITE_PASSWORD}
    And Click Open Protected Project button
    Then Password Verification Dialog Should Be Closed
    Then Project Should Be In The Project List With OPENED Label   ${PROJECT_NAME}
    And Click close project button
    And Click No option
    Then Project Should Be In The Project List Without OPENED Label   ${PROJECT_NAME}
    And Delete Project     ${project_name}
    And Fill Password Field    ${CHANGE_WRITE_PASSWORD}
    And Click Delete Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
    And Click yes option

TC-02: Change the write access password(with saving)
    [Tags]    tc-900099
    [Setup]  Given Create Project and Setup Write Password   ${PROJECT_NAME}
    And Setup Read Password For Project
    And Click Change Write Password
    Then Password Popup Should Be Visible    Change write password
    # Then Password Validation
    # And Change Password Validations  Test@1234  Test@12345   Test@12345   The old password is incorrect.
    # And Change Password Validations  Test@123  Test@123   Test@123   Old and new passwords cannot be the same.
    # And Change Password Validations  Test@123  Test@1234   Test@1234   Passwords for read and write access cannot be the same.
    And Fill the Old Password Field  Test@123
    And Fill New Password Field    Test@12345
    And Fill The Confirm Password Field   Test@12345
    And Click Setup Password button
    Then Password Popup Should Not Be Visible
    And Click Save Project button
    Then Password Popup Should Not Be Visible
    Then Go To Home Page
    Then Project Should Be Protected   ${PROJECT_NAME}    protected-key
    And Close Project
    And Select the project    ${PROJECT_NAME}
    And Click open project button
    And Fill Password Field   ${WRITE_PASSWORD}
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
    And Click yes option
    And Fill Password Field   ${CHANGE_WRITE_PASSWORD}
    And Click Open Protected Project button
    Then Password Verification Dialog Should Be Closed
    Then Project Should Be In The Project List With OPENED Label   ${PROJECT_NAME}
    And Click close project button
    And Click yes option
    Then Project Should Be In The Project List Without OPENED Label   ${PROJECT_NAME}
    And Delete Project     ${project_name}
    And Fill Password Field   ${WRITE_PASSWORD}
    And Click Delete Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
    And Click yes option
    And Delete Protected Project  ${PROJECT_NAME}   ${CHANGE_WRITE_PASSWORD}
    Then Project Should Not Be In the Project List    ${PROJECT_NAME}

TC-03: Change the read access password(without saving)
    [Tags]    tc-900109
    [Setup]  Given Create Project and Setup Write Password   ${PROJECT_NAME}
    [Teardown]   Close and Delete Protected Project    ${PROJECT_NAME}
    And Setup Read Password For Project
    And Click Change Read Password
    Then Password Popup Should Be Visible    Change read password
    And Click Cancel Button
    Then Password Popup Should Not Be Visible
    And Click Change Read Password
    Then Password Popup Should Be Visible    Change read password
    Then Password Validation
    And Change Password Validations  Test@123  Test@12345   Test@12345   The old password is incorrect.
    And Change Password Validations  Test@1234  Test@1234   Test@1234   Old and new passwords cannot be the same.
    And Change Password Validations  Test@1234  Test@123   Test@123   Passwords for read and write access cannot be the same.
    And Fill the Old Password Field  Test@1234
    And Fill New Password Field    Test@12345
    And Fill The Confirm Password Field   Test@12345
    And Click Setup Password button
    Then Password Popup Should Not Be Visible
    Then Go To Home Page
    Then Project Should Be Protected   ${PROJECT_NAME}    protected-key
    And Close Project
    And Select the project    ${PROJECT_NAME}
    And Click open project button
    And Fill Password Field   Test@12345
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
    And Click yes option
    And Fill Password Field   Test@1234
    And Click Open Protected Project button
    Then Password Verification Dialog Should Be Closed
    Then Project Should Be In The Project List With OPENED Label   ${PROJECT_NAME}
    And Click close project button
    Then Project Should Be In The Project List Without OPENED Label   ${PROJECT_NAME}

TC-04: Change the read access password(with saving)
    [Tags]    tc-900152
    [Setup]  Given Create Project and Setup Write Password   ${PROJECT_NAME}
    [Teardown]   Close and Delete Protected Project    ${PROJECT_NAME}
    And Setup Read Password For Project
    And Click Change Read Password
    Then Password Popup Should Be Visible    Change read password
    And Fill the Old Password Field  Test@1234
    And Fill New Password Field    Test@12345
    And Fill The Confirm Password Field   Test@12345
    And Click Setup Password button
    Then Password Popup Should Not Be Visible
    And Click Save Project button
    Then Go To Home Page
    Then Project Should Be Protected   ${PROJECT_NAME}    protected-key
    And Close Project
    And Select the project    ${PROJECT_NAME}
    And Click open project button
    And Fill Password Field   Test@1234
    And Click Open Protected Project button
    Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
    And Click yes option
    And Fill Password Field   Test@12345
    And Click Open Protected Project button
    Then Password Verification Dialog Should Be Closed
    Then Project Should Be In The Project List With OPENED Label   ${PROJECT_NAME}
    And Click close project button
    Then Project Should Be In The Project List Without OPENED Label   ${PROJECT_NAME}


*** Keywords ***

Create Project and Setup Write Password
    [Documentation]  Creates the project with the project name given in the argument and set the write access password for the project.
    [Arguments]   ${project_name}
    Create Project With Given Project Name    ${project_name}
    Project Should Be In The Project List With OPENED Label    ${project_name}
    SetUp Write Password For Project


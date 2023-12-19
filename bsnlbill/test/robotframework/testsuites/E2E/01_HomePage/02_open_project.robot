*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Suite Setup       Launch Application in chrome browser with no project   ${SUITE_PROJECT_NAME} 
Suite Teardown    Clear Project folder and close browser

*** Variables ***
${SUITE_PROJECT_NAME}     Open project
${SUITE_PROJECT_COMMENT}  Project for testing Open functionality
${SUITE_PROJECT_AUTHOR}   robot
${OPEN_PROJECT_LABEL}   Open protected project
${WRITE_PASSWORD}       Test@123
${READ_PASSWORD}       Test@1234


*** Test Cases ***
TC-01: Check whether Application allows to open the protected project with write access password
            [Tags]    tc-597117
            [Setup]  Given Delete Project from folder if present and open home page  ${SUITE_PROJECT_NAME}
            [Teardown]  Delete Protected Project  ${SUITE_PROJECT_NAME}  ${WRITE_PASSWORD}
            When Create Project and Setup Write Password For Project    ${SUITE_PROJECT_NAME}
            Then close and Open given project   ${SUITE_PROJECT_NAME}
            Then Password Verification Dialog Should Be Visible   ${OPEN_PROJECT_LABEL}
            And Fill Password Field   test
            And Click Open Protected Project button
            Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials. 
            And Click yes option
            And Fill Password Field   ${WRITE_PASSWORD}
            And Click Open Protected Project button
            Then Password Verification Dialog Should Be Closed
            Then Project Should Be In The Project List With OPENED Label   ${SUITE_PROJECT_NAME}
            And Click close project button
            #Without save not working
            And Click with save option
            Then Project Should Be In The Project List Without OPENED Label   ${SUITE_PROJECT_NAME}
         

TC-02: Check whether Application allows to open the protected project with read access password 
            [Tags]    tc-597119
            [Setup]  Given Open Home Page
            [Teardown]  Delete Protected Project  ${SUITE_PROJECT_NAME}  ${WRITE_PASSWORD}
            When Create Project and Setup Write Password For Project    ${SUITE_PROJECT_NAME}
            Then Setup Read Password For Project
            Then close and Open given project   ${SUITE_PROJECT_NAME}
            Then Password Verification Dialog Should Be Visible   ${OPEN_PROJECT_LABEL}
            And Click Open Protected Project button
            And Fill Password Field   ${READ_PASSWORD}
            And Click Open Protected Project button
            Then Password Verification Dialog Should Be Closed
            Then Project Should Be In The Project List With OPENED Label    ${SUITE_PROJECT_NAME}
            And Click close project button
            Then Project Should Be In The Project List Without OPENED Label    ${SUITE_PROJECT_NAME}

*** Keywords ***
Delete Project from folder if present and open home page
    [Arguments]    ${project_name}
        Delete Project from Project root folder  ${project_name}
        Open Home Page

#Separate test case should be for invalid password with open
#separate test case should be written for invalid password with delete
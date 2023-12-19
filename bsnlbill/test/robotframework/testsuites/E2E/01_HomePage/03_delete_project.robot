*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Suite Setup       Launch Application in chrome browser with no project   ${SUITE_PROJECT_NAME}
Suite Teardown    Clear Project folder and close browser

*** Variables ***
${SUITE_PROJECT_NAME}     Delete Project
${SUITE_PROJECT_COMMENT}  Project for testing project deletion
${SUITE_PROJECT_AUTHOR}   robot
${OPEN_PROJECT_LABEL}   Open protected project
${WRITE_PASSWORD}       Test@123
${READ_PASSWORD}       Test@1234


*** Test Cases ***
TC-01: Check whether Application allows to delete the project when not opened
          [Tags]    tc-597104
          [Setup]   Open Home Page
          When Create Project   ${SUITE_PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
          And Click close project button
          And Click yes option
          And Select the project    ${SUITE_PROJECT_NAME}
          And Click Delete project button
          And Click without save option
          Then Project Should Be In The Project List Without OPENED Label   ${SUITE_PROJECT_NAME}
          And Select the project    ${SUITE_PROJECT_NAME}
          And Click Delete project button
          And Click yes option
          Then Project Should Not Be In the Project List    ${SUITE_PROJECT_NAME}

TC-02: Check whether Application allows to delete protected project only with valid write access password 
...         [Tags]    tc-711468
            [Setup]   Delete Project from folder if present and open home page  ${SUITE_PROJECT_NAME}
            When Create Project and Setup Write Password For Project    ${SUITE_PROJECT_NAME}
            Then Setup Read Password For Project
            And Close Project
            Then Project Should Be In The Project List Without OPENED Label    ${SUITE_PROJECT_NAME}
            And Select the project    ${SUITE_PROJECT_NAME}
            And Delete the project
            And Fill Password Field   ${READ_PASSWORD}
            And Click Delete Protected Project button
            Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
            And Click yes option
            And Delete the project
            And Fill Password Field  ${WRITE_PASSWORD}
            And Click Delete Protected Project button
            Then Project Should Not Be In the Project List   ${SUITE_PROJECT_NAME}


*** Keywords ***
Delete Project from folder if present and open home page
    [Arguments]    ${project_name}
        Delete Project from Project root folder  ${project_name}
        Open Home Page


#Test case for should not delete project with readpassword
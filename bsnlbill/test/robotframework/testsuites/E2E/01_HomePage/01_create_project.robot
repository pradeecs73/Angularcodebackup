*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Suite Setup       Launch Application in chrome browser with no project   ${SUITE_PROJECT_NAME} 
Suite Teardown    Clear Project folder and close browser

*** Variables ***
${SUITE_PROJECT_NAME}     Create project
${SUITE_PROJECT_COMMENT}  Project for testing project creation
${SUITE_PROJECT_AUTHOR}   robot
${PROJECT_NAME}     Create 2
${NEW_PROJECT_NAME}    Create 3
${OPEN_PROJECT_LABEL}   Open protected project
${PROJECT_WITH_WRITE_ACCESS}=      ${EXECDIR}${/}test\\robotframework\\resources\\testData\\writeAccessProject.yaml
${PROJECT_WITH_READ_ACCESS}=      ${EXECDIR}${/}test\\robotframework\\resources\\testData\\readAccessProject.yaml
${INVALID_PROTECTED_YAML}=       ${EXECDIR}${/}test\\robotframework\\resources\\testData\\invalidYamlProtected.yaml
${INVALID_UNPROTECTED_YAML}=       ${EXECDIR}${/}test\\robotframework\\resources\\testData\\invalidYamlUnprotected.yaml

*** Test Cases ***
TC-01: Check whether User can create a project when no project opened
        [Tags]  tc-596487
        [Setup]  Given Open Home Page
        [Teardown]  Close And Delete The Opened Project
        When Create New Project  ${SUITE_PROJECT_NAME}
        Then Create New Project Dialog Should Be Closed
        Then Project Should Be In The Project List With OPENED Label  ${SUITE_PROJECT_NAME}

TC-02: Check whether Application allows to create new project with unique name only
        [Tags]    tc-597098
        [Setup]  Given Open Home Page
        [Teardown]  Close And Delete The Opened Project  ${SUITE_PROJECT_NAME}
        When Create New Project  ${SUITE_PROJECT_NAME}
        Then Project Should Be In The Project List With OPENED Label    ${SUITE_PROJECT_NAME}
        And Click close project button
        And Click yes option
        Then Click Create New Project
        Then Create New Project Dialog Should Be Visible
        And Comment Field Should Be Visible
        And Author Field Should Be Visible
        And Project Name Field Should Be Visible
        And Fill Project Values  ${SUITE_PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
        And Click Create Button
        Then Should throw an error like "project name is not unique please rename the project"
        And Click Element       ${close_dialog}


TC-03: Check whether Application allows to create new project when any projects opened
        [Tags]    tc-596987
        [Setup]  Given Open Home Page
        [Teardown]  Close And Delete The Opened Project  ${SUITE_PROJECT_NAME}
        When Create New Project  ${SUITE_PROJECT_NAME}
        Then Project Should Be In The Project List With OPENED Label    ${SUITE_PROJECT_NAME}
        And Click Create New project button
        And Click no option
        # Opened project should close successfully with out saving the changes
        Then Create new project dialogue box should POP-UP
        And Fill Project Values   ${PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
        And Click create button from Create Project Popup
        And Create New Project Dialog Should Be Closed
        Then Project Should Be In The Project List With OPENED Label    ${PROJECT_NAME}
        And Click Create New project button
        And Click yes option
        Then Create new project dialogue box should POP-UP
        And Fill Project Values   ${NEW_PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
        And Click create button from Create Project Popup
        And Create New Project Dialog Should Be Closed
        Then Project Should Be In The Project List With OPENED Label    ${NEW_PROJECT_NAME}
        And Close And Delete The Opened Project  ${NEW_PROJECT_NAME}
        And Close And Delete The Opened Project  ${PROJECT_NAME}

TC-04: Check whether Application allows to change the project name
        [Tags]    tc-597099
        [Setup]  Given Open Home Page
        [Teardown]  Close And Delete The Opened Project
        When Create New Project  ${SUITE_PROJECT_NAME}
        Then Project Should Be In The Project List With OPENED Label    ${SUITE_PROJECT_NAME}
        And Click edit project button
        And Fill Project Values   ${SUITE_PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
        Then Save button should be disabled
        and Delete Project from Project root folder   ${PROJECT_NAME}
        And Fill Project Values   ${PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
        And Click Cancel button
        And Click edit project button
        # verify the edited values
        And Fill Project Values   ${PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
        And Click create button from Create Project Popup

TC-05: Check whether Application allows to close the project (unprotected)
          [Tags]    tc-597101
          [Setup]  Given Open Home Page
          When Create New Project  ${SUITE_PROJECT_NAME}
          Then Project Should Be In The Project List With OPENED Label    ${SUITE_PROJECT_NAME}
          And Click close project button
          And Click no option
          Then Project Should Be In The Project List Without OPENED Label    ${SUITE_PROJECT_NAME}
          And Select the project    ${SUITE_PROJECT_NAME}
          And Click open project button
          And Click close project button
          And Click yes option
          Then Project Should Be In The Project List Without OPENED Label    ${SUITE_PROJECT_NAME}
          And Close And Delete The Opened Project  ${SUITE_PROJECT_NAME}        
         #ToDo : Project was saved successfully

TC-06: Password Verification Popup should be closed when the 'X' or 'Cancel' is clicked
            [Tags]    tc-10
            [Setup]  Given Open Home Page
            [Teardown]  Delete Protected Project  ${SUITE_PROJECT_NAME}  Test@123
            When Create Project and Setup Write Password For Project   ${SUITE_PROJECT_NAME}
            And Setup Read Password For Project
            And close and Open given project   ${SUITE_PROJECT_NAME}
            Then Password Verification Dialog Should Be Visible   ${OPEN_PROJECT_LABEL}
            And click Cancel button
            Then Password Verification Dialog Should Be Closed


TC-07: Check whether application is allowing not to create project with keywords (aux,con,nul,prn)
            [Tags]    tc-832464
            [Setup]  Given Open Home Page
            When Click Create New Project
            Then Create New Project Dialog Should Be Visible
            Then Project Name Field Should Be Visible
            Then Comment Field Should Be Visible
            Then Author Field Should Be Visible
            When Fill Project Values  aux
            Then Create button should be disabled
            When Fill Project Values  con
            Then Create button should be disabled
            When Fill Project Values  nul
            Then Create button should be disabled
            When Fill Project Values  prn
            Then Create button should be disabled

*** Keywords ***
Create New Project
    [Arguments]   ${project_name}
            Delete Project from Project root folder  ${project_name}
            Click Create New Project
            Create New Project Dialog Should Be Visible
            Comment Field Should Be Visible
            Author Field Should Be Visible
            Project Name Field Should Be Visible
            Fill Project Values  ${project_name}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
            Click Create Button
*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Suite Setup       Launch Application in chrome browser with no project   ${SUITE_PROJECT_NAME} 
Suite Teardown    Clear Project folder and close browser

*** Variables ***
${SUITE_PROJECT_NAME}     Save As project
${SUITE_PROJECT_COMMENT}  Project for testing Save as functionality
${SUITE_PROJECT_AUTHOR}   robot
${PROJECT_NAME}     Test Project
${NEW_PROJECT_NAME}    Save As 2
${WRITE_PASSWORD}       Test@123
${READ_PASSWORD}       Test@1234
${OPEN_PROJECT_LABEL}   Open protected project
${PROJECT_WITH_WRITE_ACCESS}=      ${EXECDIR}${/}test\\robotframework\\resources\\testData\\writeAccessProject.yaml
${PROJECT_WITH_READ_ACCESS}=      ${EXECDIR}${/}test\\robotframework\\resources\\testData\\readAccessProject.yaml
${INVALID_PROTECTED_YAML}=       ${EXECDIR}${/}test\\robotframework\\resources\\testData\\invalidYamlProtected.yaml
${INVALID_UNPROTECTED_YAML}=       ${EXECDIR}${/}test\\robotframework\\resources\\testData\\invalidYamlUnprotected.yaml

*** Test Cases ***
TC-01: Check whether Application allows to create copy of a project         
            [Tags]    tc-597102
            [Setup]  Given Open Home Page
            [Teardown]  Close And Delete The Opened Project   ${SUITE_PROJECT_NAME}
            When Click Create New project button
            Then Create New Project Dialog Should Be Visible
            And Fill Project Values    ${SUITE_PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
            And Click create button from Create Project Popup
            Then Project Should Be In The Project List With OPENED Label    ${SUITE_PROJECT_NAME}
            And Click Save As Project Button 
            And Click yes option 
            And Fill Project Values    ${PROJECT_NAME}
            And click Cancel button
            And Click Save As Project Button 
            And Click yes option     
            And Fill Project Values    ${PROJECT_NAME}
            And Click create button from Create Project Popup
            And Select the project    ${SUITE_PROJECT_NAME}
            And Delete the project

TC-02: Check whether Application allows to create copy for write access Protected project    
            [Tags]    tc-711469
            [Setup]  Given Delete Project from folder if present and open home page   ${SUITE_PROJECT_NAME}
            [Teardown]  Delete Protected Project  ${SUITE_PROJECT_NAME}  ${WRITE_PASSWORD}
            When Create Project and Setup Write Password For Project    ${SUITE_PROJECT_NAME}
            Then Go To Home Page
            Then Project Should Be In The Project List With OPENED Label   ${SUITE_PROJECT_NAME}
            And Click Save As Project Button 
            And Click yes option     
            And Fill Project Values     ${PROJECT_NAME}
            And click Cancel button
            And Wait Until Element Is Not Visible    ${save_as_popup}
            And Click Save As Project Button
            And Click yes option
            And Fill Project Values    ${PROJECT_NAME}
            And click Save from SaveAs Popup for protected device

            Then Password Verification Dialog Should Be Visible   ${OPEN_PROJECT_LABEL}
            And Fill Password Field   ${WRITE_PASSWORD}
            And Click Open Protected Project button
            Then Password Verification Dialog Should Be Closed
            Then Project Should Be In The Project List With OPENED Label   ${PROJECT_NAME}

            And Click close project button
            And click with save option
            And Delete Protected Project  ${PROJECT_NAME}  ${WRITE_PASSWORD}

TC-03: Check whether Application allows to create copy for read access Protected project    
            [Tags]    tc-711470
            [Setup]  Given Delete Project from folder if present and open home page   ${SUITE_PROJECT_NAME}
            [Teardown]  Delete Protected Project  ${SUITE_PROJECT_NAME}  ${WRITE_PASSWORD}
            When Create Project and Setup Write Password For Project    ${SUITE_PROJECT_NAME}
            Then Setup Read Password For Project
            Then close and Open given project   ${SUITE_PROJECT_NAME}
            Then Password Verification Dialog Should Be Visible   ${OPEN_PROJECT_LABEL}
            And Click Open Protected Project button
            And Fill Password Field   ${READ_PASSWORD}
            And Click Open Protected Project button
            Then Password Verification Dialog Should Be Closed
            Then Project Should Be In The Project List With OPENED Label   ${SUITE_PROJECT_NAME}
            And Click Save As Project Button
            And Fill Project Values     ${PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
            And click Cancel button
            And Click Save As Project Button
            And Fill Project Values    ${PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
            And click Save from SaveAs Popup for protected device
            And Fill Password Field   ${READ_PASSWORD}
            And Click Open Protected Project button
            Then Password Verification Dialog Should Be Closed
            Then Project Should Be In The Project List With OPENED Label   ${PROJECT_NAME}
            And Click close project button
            And Delete Protected Project  ${PROJECT_NAME}  ${WRITE_PASSWORD}

*** Keywords ***
Delete Project from folder if present and open home page
         [Arguments]    ${project_name}
        Delete Project from Project root folder  ${project_name}
        Open Home Page

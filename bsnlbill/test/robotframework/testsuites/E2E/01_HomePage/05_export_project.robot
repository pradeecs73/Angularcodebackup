*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Suite Setup       Launch Application in chrome browser with no project   ${SUITE_PROJECT_NAME} 
Suite Teardown    Clear Project folder and close browser

*** Variables ***
${SUITE_PROJECT_NAME}   export project
${SUITE_PROJECT_COMMENT}  Project for testing export functionality
${SUITE_PROJECT_AUTHOR}   robot

*** Test Cases ***
TC-01: Check whether Application allows to Export the current project(unprotected)
            [Tags]    tc-597121
            [Setup]  Given Open Home Page
            [Teardown]  Close And Delete The Opened Project  ${SUITE_PROJECT_NAME}
            When Click Create New project button
            Then Create New Project Dialog Should Be Visible
            And Fill Project Values   ${SUITE_PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}  ${SUITE_PROJECT_AUTHOR}
            And Click create button from Create Project Popup
            Then Project Should Be In The Project List With OPENED Label    ${SUITE_PROJECT_NAME}
            And Click Export Project
            And Click without save option
            Sleep    3s
            And Click Export Project
            And Click yes option
            Then Exported file should be present in download folder   ${SUITE_PROJECT_NAME}
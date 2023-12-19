*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Suite Setup       Launch Application in chrome browser with no project  last_modified  chrome
Suite Teardown    Clear Project folder and close browser

*** Variables ***

${PROJECT_WITH_WRITE_ACCESS}=      ${EXECDIR}${/}test\\robotframework\\resources\\testData\\writeAccessProject.yaml
${PROJECT_WITH_READ_ACCESS}=      ${EXECDIR}${/}test\\robotframework\\resources\\testData\\readAccessProject.yaml
${INVALID_PROTECTED_YAML}=       ${EXECDIR}${/}test\\robotframework\\resources\\testData\\invalidYamlProtected.yaml
${INVALID_UNPROTECTED_YAML}=       ${EXECDIR}${/}test\\robotframework\\resources\\testData\\invalidYamlUnprotected.yaml
${LAST_MODIFIED_IMPORTFILE}=       ${EXECDIR}${/}test\\robotframework\\resources\\testData\\Last_Modified_During_Import.yaml

*** Test Cases ***
TC-01: Check whether Application allows to Import only valid project (Protected)
            [Tags]    tc-711471  import
            [Setup]  Given Open Home Page
            When Click Import Button
            And Import a File   ${INVALID_PROTECTED_YAML}
            Then Popup Should Be Visible    Project import failed  error   Please upload the file in a valid format.
            And Close Error Popup
            And click Cancel button

TC-02: Check whether Application allows to Import only valid project (Unprotected)
            [Tags]    tc-711472  import
            [Setup]  Given Open Home Page
            When Click Import Button
            And Import a File     ${INVALID_UNPROTECTED_YAML}
            Then Popup Should Be Visible    Project import failed  error   Please upload the file in a valid format.
            And Close Error Popup
            And click Cancel button

TC-03: Imported project last modified field should get updated with imported date and time
            [Tags]    tc-914929  import
            [Setup]  Given Open Home Page
            [Teardown]  Delete Project    last_modified
            When Click Import Button
            And Import a File     ${LAST_MODIFIED_IMPORTFILE}
            And Click yes option
            Then Click Close Project Button
            AND Click no option
            AND Check Project Last Modification Time   last_modified

TC-04: Check whether Application allows to open the protected project with write access password
            [Tags]    tc-597117  import
            [Setup]  Given Delete Project from folder if present and open home page  writeAccess
            [Teardown]  Delete Protected Project  writeAccess  Test@123
            When Click Import Button
            And Delete Project from Project root folder  writeAccess
            And Import a File     ${PROJECT_WITH_WRITE_ACCESS}
            And Click yes option
            And Fill Password Field   test
            And Click Open Protected Project button
            Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
            And Click yes option
            And Fill Password Field   Test@123
            And Click Open Protected Project button
            Then Password Verification Dialog Should Be Closed
            Then Project Should Be In The Project List With OPENED Label   writeAccess
            And Click close project button
            And Click No option
            Then Project Should Be In The Project List Without OPENED Label   writeAccess


TC-05: Check whether Application allows to open the protected project with read access password
            [Tags]    tc-597119  import
            [Setup]  Given Open Home Page
            [Teardown]  Close and Delete Protected Project    readAccess
            When Click Import Button
            And Delete Project from Project root folder  readAccess
            And Import a File     ${PROJECT_WITH_READ_ACCESS}
            And Click yes option
            And Fill Password Field   test
            And Click Open Protected Project button
            Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
            And Click yes option
            And Fill Password Field   Test@1234
            And Click Open Protected Project button
            Then Password Verification Dialog Should Be Closed
            Then Project Should Be In The Project List With OPENED Label   readAccess
            And Click close project button
            Then Project Should Be In The Project List Without OPENED Label   readAccess
            And Select the project    readAccess
            And Delete the project
            And Fill Password Field   Test@1234
            And Click Delete Protected Project button
            Then Popup Should Be Visible    Authentication failed  error   Please enter the correct credentials.
            And Click yes option



*** Keywords ***
Delete Project from folder if present and open home page
    [Arguments]    ${project_name}
        Delete Project from Project root folder  ${project_name}
        Open Home Page
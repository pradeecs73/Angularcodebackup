*** Settings ***
Resource          ./../../../../keywords/add_device_helpers.resource
Resource          ./../../../../keywords/editor_page.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   Close Browser

*** Variables ***
${SUITE_PROJECT_NAME}    monitoring
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${PROJECT_COMMENT}=     checking the functionality of the close connection
${PROJECT_AUTHOR}=    SIMATICLiveLink

*** Test Cases ***
TC1 :Check whether interface monitoring happening in the online mode
    [Tags]  tc-832608
    [Setup]   Create Project    ${SUITE_PROJECT_NAME}    ${PROJECT_COMMENT}    ${PROJECT_AUTHOR}
    [Teardown]  Close And Delete The Opened Project
    When Load Add Device Popup
    Then Add Devices Through Scan   ${IP_RANGE_START}   ${IP_RANGE_END}
    Then All Added Devices Should Have New Flag
    And Go To Plant View Page
    Then Device Should Be Visible In Devices And Properties Panel  BottleFilling    LiquidMixing
    Then Drop Devices To Connection Editor
    When Draw Connection With Search
    Then Number Of Connection Lines Should Be  1
    Then Establish All Connection In The Editor
    Then Check For Online Connection In The Editor
    Then Click On The Interface To Monitor   FillingToMixing
    Then Select Properties Panel
    Then Verify Monitoring Value  2   FaultyBottles  0

TC2 :Check whether connection monitoring happening in the online mode
    [Tags]  tc-832609
    [Setup]  Create Project    ${SUITE_PROJECT_NAME}    ${PROJECT_COMMENT}    ${PROJECT_AUTHOR}
    [Teardown]  Close And Delete The Opened Project
    When Load Add Device Popup
    Then Add Devices Through Scan   ${IP_RANGE_START}   ${IP_RANGE_END}
    And Go To Plant View Page
    Then Device Should Be Visible In Devices And Properties Panel  BottleFilling    LiquidMixing
    Then Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Number Of Connection Lines Should Be  1
    Then Establish All Connection In The Editor
    And Check For Online Connection In The Editor
    Then Click Connection Line   "green"
    And Click Element     ${editor_class}
    Then Click Connection Line   "green"
    And Select Properties Panel
    Then Verify Monitoring Value  9    clientLastContactTime  1


*** Keywords ***
Opened Project
    Select the project  ${SUITE_PROJECT_NAME}
    Click open project button


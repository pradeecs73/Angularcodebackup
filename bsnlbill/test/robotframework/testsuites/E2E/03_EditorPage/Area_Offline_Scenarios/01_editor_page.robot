*** Settings ***
Resource    ../../../../keywords/common.resource
Resource    ../../../../keywords/connection_helpers.resource
Resource    ../../../../keywords/connection_keywords.resource
Resource    ../../../../keywords/editor_page.resource
Suite Setup   Launch Application in chrome browser with no project    ${SUITE_PROJECT_NAME}
Suite Teardown  Clear Project folder and close browser


*** Variables ***
${SUITE_PROJECT_NAME}    Connection test
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${OFFLINE_CONNECTOR_LINES}=  css:#myCanvas .connector:has([data-drag]) .connector-path

*** Test Cases ***
TC01: Search Connection Testing when matching interface is found
    [Tags]  tc-894494
    [Setup]  Given Opened Project With Added Devices   ${SUITE_PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    And Draw Connection With Search
    Then color of the element  ${OFFLINE_CONNECTOR_LINES}    "black"

TC02: Search Connection Testing when matching interface is not found
    [Tags]  tc-894505
    [Setup]  Given Opened Project With Added Devices   ${SUITE_PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    When Drop Device To Connection Editor  LiquidMixing  100  50
    Then Number Of Devices On The Connection Editor Should Be  1
    And Draw Connection With Search
    Then Number Of Connection Lines Should Be    0

TC03: Delete connection line
    [Tags]  tc-894511
    [Setup]  Given Opened Project With Added Devices   ${SUITE_PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    And Draw Connection With Search
    And click connection line    "black"
    And Delete Automation Component Or Device in editor page
    Then Number Of Connection Lines Should Be    0

TC04: Delete Device
    [Tags]  tc-894513
    [Setup]  Given Opened Project With Added Devices   ${SUITE_PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then click select device in editor
    Then Delete Automation Component Or Device in editor page
    Then Number Of Devices On The Connection Editor Should Be  1

TC05 Check whether Establish selected connection btn should only enable when one or more connection is selected
    [Tags]  tc-923866
    [Setup]  Given Opened Project With Added Devices     ${SUITE_PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    And Draw Connection With Search
    Then click select device in editor
    Then Number Of Connection Lines Should Be  1
    Then Select Establish Connection Option  Establish selected connections
    Then Establish Connection Button Should Be Disabled
    And click connection line    "black"
    Then Establish Connection Button Should Be Enabled
    And Click Element     ${editor_class}
    Then Establish Connection Button Should Be Disabled



*** Keywords ***
Opened Project With Added Devices
    [Arguments]  ${project_name}
    Create Project  ${project_name}
    Go To Device Tree Page
    Add Devices To The Opened Project  ${IP_RANGE_START}  ${IP_RANGE_END}

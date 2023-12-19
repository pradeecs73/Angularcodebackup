*** Settings ***
Resource          ./../../../../keywords/add_device_helpers.resource
Resource          ./../../../../Keywords/area_operations.resource
Resource          ./../../../../keywords/editor_page.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser

*** Variables ***
${SUITE_PROJECT_NAME}    Area_Online_Scenario_test
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${COLOR_CONNECTION_GREEN}=   "green"
${COLOR_CONNECTION_ORANGE}=   "orange"
${COLOR_CONNECTION_BLACK}=    "black"
${OFFLINE_CONNECTOR_LINES}=  css:#myCanvas .connector:has([data-drag]) .connector-path



*** Test Cases ***

TC1:Area to Area: Verify green line is coming when we go online
    [Tags]  tc-957454
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Goonline with offline connection
    Then Click Gooffline Button
    Then Create Connection Between The Areas
    Then Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${COLOR_CONNECTION_GREEN}
    Then Click Gooffline Button

TC2: Area to Area: Verify orange dotted line is coming when we go online
    [Tags]  tc-957460
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Goonline with offline connection
    Then Click Gooffline Button
    Then Create Connection Between The Areas
    Then Click Goonline Button
    Then Click Gooffline Button
    Then Move Area Or Automation Component To Particular Position  0  100  50
    Then Move Area Or Automation Component To Particular Position  1  590  55
    Then Delete offline connection
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${COLOR_CONNECTION_ORANGE}
    Then Click Gooffline Button

TC3:Area to nested Area: Verify green line is coming when we go online
    [Tags]  tc-966855
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Goonline with offline connection
    Then Click Gooffline Button
    Then Create Connection Between The Areas With Nested
    Then Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${COLOR_CONNECTION_GREEN}
    Then Click Gooffline Button

TC4: Area to nested area: Verify orange dotted line is coming when we go online from root
    [Tags]  tc-966870
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Goonline with offline connection
    Then Click Gooffline Button
    Then Create Connection Between The Areas With Nested
    Then Click Goonline Button
    Then Click Gooffline Button
    Then Move Area Or Automation Component To Particular Position  0  100  50
    Then Move Area Or Automation Component To Particular Position  1  590  55
    Then Delete offline connection
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${COLOR_CONNECTION_ORANGE}
    Then Click Gooffline Button

*** Keywords ***

Goonline with offline connection
    [Documentation]  Going to editor page and dropping devices to editor
    ...    and then checking color of the line by going online
    Go To Plant View Page
    Drop Devices To Connection Editor
    Draw Connection With Search
    Establish All Connection In The Editor
    Click Goonline Button
    color of the element     ${green_connector_lines}    ${COLOR_CONNECTION_GREEN}

 Create Connection Between The Areas
    [Documentation]  Creating a connection between two area in root editor without nested
    Create New Area
    Create New Area
    Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Reorder AutomationComponent Or Area From One Area To Another Area  1   4

Delete offline connection
    [Documentation]  Deleting black connection line
    click connection line    ${COLOR_CONNECTION_BLACK}
    Click Delete Icon
    Confirm Popup

Create Connection Between The Areas With Nested
    [Documentation]  Creating a connection between two area in root editor with nested areas
    Create New Area
    Create A New Area Inside Another Area   3  0
    Create A New Area Inside Another Area   4  1
    Create New Area
    Create A New Area Inside Another Area   6  3
    Create A New Area Inside Another Area   7  4
    Reorder AutomationComponent Or Area From One Area To Another Area  1   5
    Reorder AutomationComponent Or Area From One Area To Another Area  1   8
    Select Particuler Menu From Left Menu   0
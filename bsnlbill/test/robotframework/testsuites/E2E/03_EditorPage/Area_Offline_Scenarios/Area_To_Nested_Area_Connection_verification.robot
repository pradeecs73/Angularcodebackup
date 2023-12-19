*** Settings ***
Resource          ./../../../../keywords/add_device_helpers.resource
Resource          ./../../../../Keywords/area_operations.resource
Resource          ./../../../../keywords/editor_page.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser

*** Variables ***
${SUITE_PROJECT_NAME}    Connection_test
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102

*** Test Cases ***
TC1: Area Scenarios - Area to one level nested area: Verify if the connection line is drawn in between 2 areas using search.
    [Tags]  tc-955255
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Create Areas And Reorder Areas
    Then Select Particuler Menu From Left Menu   2
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1
    Then Select Particuler Menu From Left Menu   2
    Then Wait Until Element Is Visible  ${connector_lines}  5s
    Then Number Of Connection Lines Should Be    1
    Then Select Particuler Menu From Left Menu   4
    Then Wait Until Element Is Visible  ${connector_lines}  5s
    Then Number Of Connection Lines Should Be    1

TC2: Area Scenarios - Area to one level nested area: Verify connection line is not removed on ungroup.
    [Tags]  tc-955338
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Create Areas And Reorder Areas
    Then Select Particuler Menu From Left Menu   2
    Then Draw Connection With Search With Single Area
    Then Ungroup A Nested Area   4     2
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1
    Then Ungroup A Nested Area   2     0
    Then Number Of Connection Lines Should Be    1
    Then Ungroup A Nested Area   2     0
    Then Number Of Connection Lines Should Be    1

TC3: Area Scenarios - Area to one level nested area: Verify connection line is removed on area delete.
    [Tags]  tc-955348
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    Then Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Create A New Area Inside Another Area   3   0
    Then Select Particuler Menu From Left Menu   0
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   5
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Delete A Nested Area    1    0
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    0

 TC4: Area Scenarios - Area to one level nested area: Verify connection line should not be removed on reorder
    [Tags]  tc-955392
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Create Areas And Reorder Areas
    Then Select Particuler Menu From Left Menu   2
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1
    Then Select Particuler Menu From Left Menu   2
    Then Wait Until Element Is Visible  ${connector_lines}  5s
    Then Number Of Connection Lines Should Be    1
    Then Select Particuler Menu From Left Menu   4
    Then Wait Until Element Is Visible  ${connector_lines}  5s
    Then Number Of Connection Lines Should Be    1
    Then Reorder AutomationComponent Or Area From One Area To Another Area  4   1
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    0
    Then Select Particuler Menu From Left Menu   1
    Then Number Of Connection Lines Should Be    1

*** Keywords ***
 Create Areas And Reorder Areas
    Create New Area
    Create New Area
    Reorder AutomationComponent Or Area From One Area To Another Area  3   4
    Reorder AutomationComponent Or Area From One Area To Another Area  1   4
    Create New Area
    Reorder AutomationComponent Or Area From One Area To Another Area  1   5



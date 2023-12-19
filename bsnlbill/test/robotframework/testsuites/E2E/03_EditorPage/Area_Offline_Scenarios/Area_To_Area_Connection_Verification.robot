*** Settings ***
Resource          ./../../../../keywords/add_device_helpers.resource
Resource          ./../../../../Keywords/area_operations.resource
Resource          ./../../../../keywords/editor_page.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser

*** Variables ***
${SUITE_PROJECT_NAME}    Area_To_AREA_Connection_test
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${COLOR_CONNECTION_GREEN}=   "green"
${COLOR_CONNECTION_ORANGE}=   "orange"
${COLOR_CONNECTION_BLACK}=    "black"
${OFFLINE_CONNECTOR_LINES}=  css:#myCanvas .connector:has([data-drag]) .connector-path


*** Test Cases ***
TC1:Area to Area: Verify if the connection line is drawn in between 2 areas using search
    [Tags]  tc-955173
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Drop Devices To Two Areas
    Then Select Particuler Menu From Left Menu   1
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1

TC2: Area to area : Verify connection line is not removed when the area containing server devices in ungrouped
    [Tags]  tc-955221
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Drop Devices To Two Areas
    Then Select Particuler Menu From Left Menu   1
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   1
    Then Ungroup A Nested Area   1     0
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1

TC3: Area to area : Verify connection line is not removed when the area containing client devices in ungrouped
    [Tags]  tc-955223
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Drop Devices To Two Areas
    Then Select Particuler Menu From Left Menu   1
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   3
    Then Ungroup A Nested Area   3   1
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1

 TC4: Area to area : Verify connection line is not removed when area is moved inside another area
    [Tags]  tc-955227
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Drop Devices To Two Areas
    Then Select Particuler Menu From Left Menu   1
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Select Particuler Menu From Left Menu   1
    Then Number Of Connection Lines Should Be    1

TC5: Area to area : Verify connection line is not removed when client device is moved inside the area consisting of server device
    [Tags]  tc-955229
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Drop Devices To Two Areas
    Then Select Particuler Menu From Left Menu   1
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area  4  1
    Then Select Particuler Menu From Left Menu   1
    Then Number Of Connection Lines Should Be    1


TC6: Verify connection line is not removed when server device is moved inside the area consisting of client device
    [Tags]  tc-955231
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Drop Devices To Two Areas
    Then Select Particuler Menu From Left Menu   1
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   1
    Then Reorder AutomationComponent Or Area From One Area To Another Area  2  3
    Then Select Particuler Menu From Left Menu   2
    Then Number Of Connection Lines Should Be    1

TC7: Area to area : Verify connection line is not removed when both client and server devices are moved out of the area to root level
    [Tags]  tc-955233
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Drop Devices To Two Areas
    Then Select Particuler Menu From Left Menu   1
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   1
    Then Reorder AutomationComponent Or Area From One Area To Another Area  2  0
    Then Select Particuler Menu From Left Menu   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area  4  0
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1

TC8: Area to area : one level nested area to one level nested area: Verify the connection line is present when its drawn using search
    [Tags]  tc-956261
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Create New Area
    Then Create New Area
    Then Create A New Area Inside Another Area   3  0
    Then Create A New Area Inside Another Area   5  2
    Then Select Particuler Menu From Left Menu   4
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1  4
    Then Select Particuler Menu From Left Menu   6
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1  6
    Then Select Particuler Menu From Left Menu   2
    Then Draw Connection With Search With Single Area
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1


TC9: Area to area : one level nested area to one level nested area: Verify the connection line is not removed on ungroup
    [Tags]  tc-956338
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Create New Area
    Then Create New Area
    Then Create A New Area Inside Another Area   3  0
    Then Create A New Area Inside Another Area   5  2
    Then Select Particuler Menu From Left Menu   4
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1  4
    Then Select Particuler Menu From Left Menu   6
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1  6
    Then Select Particuler Menu From Left Menu   2
    Then Draw Connection With Search With Single Area
    Then Ungroup A Nested Area   2    1
    Then Ungroup A Nested Area   1    0
    Then Ungroup A Nested Area   3    1
    Then Ungroup A Nested Area   2    0
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1


TC10: Area to area :one level nested area to one level nested area: Verify the connection line is removed on area delete
    [Tags]  tc-956394
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Create New Area
    Then Create New Area
    Then Create A New Area Inside Another Area   3  0
    Then Create A New Area Inside Another Area   5  2
    Then Select Particuler Menu From Left Menu   4
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1  4
    Then Select Particuler Menu From Left Menu   6
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1  6
    Then Select Particuler Menu From Left Menu   2
    Then Draw Connection With Search With Single Area
    Then Delete A Nested Area    1   0
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    0



*** Keywords ***
 Drop Devices To Two Areas
    [Documentation]  Creating a connection between two area in root editor without nested
    Create New Area
    Create New Area
    Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Reorder AutomationComponent Or Area From One Area To Another Area  1   4


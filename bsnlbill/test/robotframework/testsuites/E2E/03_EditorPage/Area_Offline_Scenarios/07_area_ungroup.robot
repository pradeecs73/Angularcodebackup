*** Settings ***
Resource          ../../../../keywords/add_device_helpers.resource
Resource          ../../../../Keywords/area_operations.resource
Resource          ../../../../keywords/editor_page.resource
Suite Setup       Launch Application in chrome browser with no project
Suite Teardown    close browser


*** Variables ***
${SUITE_PROJECT_NAME}    Area_Ungroup
${AREA_NAME}    Area 1
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102

*** Test Cases ***
TC1 :Check wheather able to ungroup a area in connection editor
    [Tags]  tc-900617
    [Setup]  Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]    Close And Delete The Opened Project
    Go To Plant View Page
    Create New Area
    Then Ungroup A Nested Area   1   0
    Then Ungrouped Area Should Not Be Visible In Connection Editor   ${AREA_NAME}
    Then Ungrouped Area Should Not Be Present In left Menu   ${AREA_NAME}

TC2 :Check wheather able to ungroup a nested area in connection editor
    [Tags]  tc-900626
    [Setup]  Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    Go To Plant View Page
    Create New Area
    Then Create A New Area Inside Another Area   1  0
    Then Ungroup A Nested Area   1    0
    Then Ungrouped Area Should Not Be Present In left Menu   ${AREA_NAME}
    Then First Child Area Should Be Visible In Connection Editor   Area 2
    Then First Child Area Should Be Present In left Menu   Area 2

TC3 :Check wheather nested area and releated devices and connections moved to parent area after ungroup
    [Tags]  tc-900645
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]    Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    When Draw Connection With Search
    Then Create New Area
    Then Create A New Area Inside Another Area   3   0
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   2
    Then Select Particuler Menu From Left Menu   1
    Then Number Of Connection Lines Should Be  1
    Then Ungroup A Nested Area   1    0
    Then First Child Area Should Be Visible In Connection Editor   Area 2
    Then First Child Area Should Be Present In left Menu   Area 2
    Then Number Of Connection Lines Should Be  1
    Then Number Of Devices On The Connection Editor Should Be  3

 TC4 :Check ungroup of automation component from two areas to root folder
    [Tags]  tc-900650
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]    Close And Delete The Opened Project
    When Go To Plant View Page
    Then Create New Area
    Then Create New Area
    Then Select Area And Drop Device To Area   1  BottleFilling  50  100
    Then Select Area And Drop Device To Area    3  LiquidMixing  300  100
    Then Ungroup A Nested Area   1    0
    Then Ungroup A Nested Area   1    0
    Then Device Should Be Visible In Connection Editor  BottleFilling
    Then Device Should Be Visible In Connection Editor  LiquidMixing
    Then Number Of Devices On The Connection Editor Should Be  2

TC-5:Area Scenarios - Area to node: Verify the connection lines are not removed on ungroup.
    [Tags]  tc-954537
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  2  3
    Then Ungroup A Nested Area   2   0
    Then Number Of Devices On The Connection Editor Should Be  2
    Then Number Of Connection Lines Should Be  1
    Then Ungrouped Area Should Not Be Visible In Connection Editor    ${AREA_NAME}
    Then Ungrouped Area Should Not Be Present In left Menu    ${AREA_NAME}


*** Keywords ***
Opened Project
     [Arguments]  ${project_name}
     Create New Project   ${project_name}






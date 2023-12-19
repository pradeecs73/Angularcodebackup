*** Settings ***
Resource          ../../../../keywords/add_device_helpers.resource
Resource          ../../../../keywords/area_operations.resource
Resource          ../../../../keywords/editor_page.resource
Resource          ../../../../keywords/node_to_nested_area.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser


*** Variables ***
${SUITE_PROJECT_NAME}    Area_Delete
${AREA_NAME}    Area 1
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102

*** Test Cases ***

TC1 :Check wheather able to delete a area inside the editor
    [Tags]  tc-900605
    [Setup]  Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Create New Area
    Then click select device in editor
    Then Delete Automation Component Or Device in editor page
    Then Deleted Area Should Not Be Visible In Connection Editor   ${AREA_NAME}
    Then Deleted Area Should Not Be Present In left Menu   ${AREA_NAME}

TC2 :Check wheather able to delete a area inside another area
    [Tags]  tc-900608
    [Setup]  Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Create New Area
    Then Create A New Area Inside Another Area   1   0
    Then Delete A Nested Area   1   0
    Then Deleted Area Should Not Be Visible In Connection Editor   ${AREA_NAME}
    Then Deleted Area Should Not Be Present In left Menu   ${AREA_NAME}
    Then Deleted Area Should Not Be Visible In Connection Editor   Area 2
    Then Deleted Area Should Not Be Present In left Menu   Area 2

TC3 :Device should be removed from the editor once coresponding area get delete
    [Tags]  tc-900611
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   2
    Then Select Particuler Menu From Left Menu   1
    Then Number Of Connection Lines Should Be  1
    Then Create A New Area Inside Another Area   1  0
    Then Delete A Nested Area    1   0
    Then Deleted Area Should Not Be Visible In Connection Editor   ${AREA_NAME}
    Then Deleted Area Should Not Be Present In left Menu   ${AREA_NAME}
    Then Number Of Connection Lines Should Be  0
    Then Number Of Devices On The Connection Editor Should Be  0

TC4 :Area Scenarios - Device to one level nested area: Verify the connection line is not present when the area is deleted.
    [Tags]  tc-956140
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    Then Create Nested area to node with client device inside the nested area
    Then Delete A Nested Area    2   0
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be  0

TC5 :Area Scenarios - Device to one level nested area: Verify the connection line is not present when the area is deleted.
    [Tags]  tc-956140-a
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    Then Create Nested area to node with client device inside the nested area
    Then Delete A Nested Area    3   1
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be  0
*** Keywords ***
Opened Project
     [Arguments]  ${project_name}
     Create New Project   ${project_name}


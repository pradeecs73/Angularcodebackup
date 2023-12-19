*** Settings ***
Resource    ../../../../keywords/common.resource
Resource    ../../../../keywords/editor_page.resource
Resource    ../../../../keywords/area_operations.resource
Suite Setup   Launch Application in chrome browser with no project    ${SUITE_PROJECT_NAME}
Suite Teardown  Clear Project folder and close browser


*** Variables ***
${SUITE_PROJECT_NAME}    Device_to_One_level_nested
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${AREA_NAME}             Area1
${NESTED_AREA_NAME}      Area2


*** Test Cases ***
TC-01:Area Scenarios - Device to one level nested area: Verify connection line is present when its drawn through search.
    [Tags]  tc-956062
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Create New Area
    Then Create A New Area Inside Another Area   3   0
    And Select Particuler Menu From Left Menu    4
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   4
    And Draw Connection With Search
    Then SubConnection line should be present
    Then Select Particuler Menu From Left Menu    4
    Then Number Of Connection Lines Should Be  1

TC-02:Area Scenarios - Device to one level nested area: Verify the connection line is not removed when the area is ungrouped.
    [Tags]  tc-956083
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Create New Area
    Then Create A New Area Inside Another Area   3   0
    And Select Particuler Menu From Left Menu    4
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   4
    And Draw Connection With Search
    Then SubConnection line should be present
    Then Select Particuler Menu From Left Menu    4
    Then Number Of Connection Lines Should Be  1
    Then Ungroup A Nested Area   2    0
    Then Number Of Connection Lines Should Be  1
    Then Ungrouped Area Should Not Be Visible In Connection Editor   ${AREA_NAME}
    Then Ungrouped Area Should Not Be Present In left Menu   ${AREA_NAME}


TC-03:Area Scenarios - Device to one level nested area: Verify the connection line is not removed when the nested area is ungrouped.
    [Tags]  tc-956083-a
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Go To Plant View Page
    Then Drop Devices To Connection Editor
    Then Create New Area
    Then Create A New Area Inside Another Area   3   0
    And Select Particuler Menu From Left Menu    4
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   4
    And Draw Connection With Search
    Then SubConnection line should be present
    Then Select Particuler Menu From Left Menu    4
    Then Number Of Connection Lines Should Be  1
    Then Ungroup A Nested Area  3   1
    Then Interface exposed panel is collapsed
    sleep   1s
    Then Number Of Connection Lines Should Be  1
    Then Ungrouped Area Should Not Be Visible In Connection Editor   ${NESTED_AREA_NAME}
    Then Ungrouped Area Should Not Be Present In left Menu   ${NESTED_AREA_NAME}

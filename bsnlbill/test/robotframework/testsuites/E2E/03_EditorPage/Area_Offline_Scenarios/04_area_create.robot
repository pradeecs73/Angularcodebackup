*** Settings ***
Resource          ../../../../keywords/add_device_helpers.resource
Resource          ../../../../Keywords/area_operations.resource
Resource          ../../../../keywords/editor_page.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser


*** Variables ***
${SUITE_PROJECT_NAME}    Area_Create
${AREA_NAME}    Area 1
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102

*** Test Cases ***
TC1 :Check wheather able to create a area in connection editor
    [Tags]  tc-900593
    [Setup]  Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    Then Go To Plant View Page
    Then Create New Area
    Then Created Area Should Be Visible In Connection Editor   ${AREA_NAME}
    Then Created Area Should Be Present In left Menu   ${AREA_NAME}

TC2 :Check wheather able to create a area inside another area
    [Tags]  tc-900600
    [Setup]  Opened Project   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    Then Go To Plant View Page
    Then Create New Area
    Then Create A New Area Inside Another Area   1  0
    Then Created Area Should Be Visible In Connection Editor   Area 2
    Then Created Area Should Be Present In left Menu   Area 2

TC3:Area Scenarios - Area to node: Check if connection can be drawn using search.
    [Tags]  tc-954525
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1  3
    Then Select Particuler Menu From Left Menu   2
    Then Draw Connection With Search With Single Area
    Then SubConnection line should be present
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be    1
    
*** Keywords ***
Opened Project
     [Arguments]  ${project_name}
     Create New Project   ${project_name}




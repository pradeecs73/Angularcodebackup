*** Settings ***
Resource          ../../../../keywords/add_device_helpers.resource
Resource          ../../../../Keywords/area_operations.resource
Resource          ../../../../keywords/editor_page.resource
Resource          ../../../../keywords/node_to_nested_area.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser


*** Variables ***
${SUITE_PROJECT_NAME}    Area_Reorder
${AREA_NAME}    Area 1
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102

*** Test Cases ***

TC1 :Check reorder of automation component between two areas
    [Tags]  tc-943483
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    Then Create New Area
    Then Create New Area
    Then Select Area And Drop Device To Area   1  BottleFilling  50  100
    Then Select Area And Drop Device To Area    3  LiquidMixing  300  100
    Then Reorder AutomationComponent Or Area From One Area To Another Area  2  3
    Then Device Should Be Visible In Connection Editor  BottleFilling
    Then Device Should Be Visible In Connection Editor  LiquidMixing
    Then Number Of Devices On The Connection Editor Should Be  2

TC2 :Check reorder of automation component between two areas with connection
    [Tags]  tc-943485
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area   1   4
    Then Device Or Area Should Not Be Visible In Connection Editor  BottleFilling
    Then Device Or Area Should Not Be Visible In Connection Editor  LiquidMixing
    Then Number Of Connection Lines Should Be  1

TC3 :Check reorder of automation component from left menu to connection editor
    [Tags]  tc-943484
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area   1   4
    Then Device Or Area Should Not Be Visible In Connection Editor  BottleFilling
    Then Device Or Area Should Not Be Visible In Connection Editor  LiquidMixing
    Then Number Of Connection Lines Should Be  1
    Then Reorder AutomationComponent Or Area From Area To Connection Editor   2
    Then Reorder AutomationComponent Or Area From Area To Connection Editor   4
    Then Device Should Be Visible In Connection Editor  BottleFilling
    Then Device Should Be Visible In Connection Editor  LiquidMixing
    Then Number Of Connection Lines Should Be  1
    Then Number Of Devices On The Connection Editor Should Be  4

TC4 :Check reorder of nested area from left menu to another nested area
    [Tags]  tc-943486
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Create A New Area Inside Another Area   3  0
    Then Create A New Area Inside Another Area   4  1
    Then Select Particuler Menu From Left Menu   0
    Then Create New Area
    Then Create A New Area Inside Another Area   6  3
    Then Create A New Area Inside Another Area   7  4
    Then Reorder AutomationComponent Or Area From One Area To Another Area   2   8
    Then Reorder AutomationComponent Or Area From One Area To Another Area   1   4
    Then Reorder AutomationComponent Or Area From One Area To Another Area   1   7
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Devices On The Connection Editor Should Be  1
    Then Select Particuler Menu From Left Menu   3
    Then Number Of Connection Lines Should Be  1

TC5 :Check reorer of area should not enable go-online option unless a device is added.
    [Tags]  tc-932137
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    When Go To Plant View Page
    Then Create New Area
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  2    1
    Then Select Particuler Menu From Left Menu    1
    Then Device Should Be Visible In Connection Editor  Area 2
    Then Go online Button Should Be Disabled
    Then Drop Device To Connection Editor    BottleFilling  520  350
    Then Device Should Be Visible In Connection Editor  BottleFilling
    Then Go online Button Should Be Enabled


TC6 :Connection lines are getting removed on area reorder
    [Tags]  tc-950305
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Device Or Area Should Not Be Visible In Connection Editor  LiquidMixing
    Then Number Of Connection Lines Should Be  1
    Then Create A New Area Inside Another Area   2  0
    Then Reorder AutomationComponent Or Area From One Area To Another Area  3   4
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be  1

TC7 :Reorder- Exposed interface should remove from area if connection not avialable
    [Tags]  tc-950306
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Device Or Area Should Not Be Visible In Connection Editor  LiquidMixing
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be  1
    Then Move Area Or Automation Component To Particular Position   1  100  55
    And click connection line    "black"
    And Delete Automation Component Or Device in editor page
    Then Number Of Connection Lines Should Be    0
    Then Create A New Area Inside Another Area   2  0
    Then Reorder AutomationComponent Or Area From One Area To Another Area  3   4
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be  0

TC-8 :Reorder- Verify the subconnections are properly getting removed
    [Tags]  tc-955210
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   4
    Then Reorder AutomationComponent Or Area From One Area To Another Area  3   1
    Then Select Particuler Menu From Left Menu   0
    Then Validate Exposed Server Interface

TC-9:Area Scenarios - Area to node: Reorder scenario 1
    [Tags]  tc-954552
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  2  3
    Then Number Of Connection Lines Should Be  1
    Then Select Particuler Menu From Left Menu   2
    Then Interface exposed panel is collapsed
    sleep  1s
    Then Number Of Connection Lines Should Be  1


TC-10:Area Scenarios - Area to node: Reorder scenario 2
    [Tags]  tc-954555
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  2  3
    Then Reorder AutomationComponent Or Area From One Area To Another Area  3  0
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be  1

TC-11:Area Scenarios - Area to node: Reorder scenario 2
    [Tags]  tc-954558
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  2  3
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1  2
    Then Select Particuler Menu From Left Menu   1
    Then Number Of Connection Lines Should Be  1

TC-12:Area Scenarios - Device to one level nested area: Verify the connection line is not deleted on reorder.
    [Tags]  tc-956116
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    Then Create Nested area to node with client device inside the nested area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  4  0
    Then Select Particuler Menu From Left Menu   0
    Then Number Of Connection Lines Should Be  1
*** Keywords ***

Validate Exposed Server Interface
    ${exposed_interfaces}=  Get WebElements  ${exposed_server_inf}
    ${text}=     Get Text    ${exposed_interfaces[0]}
    Log   ${text}
    Should Be Equal as Strings   ${text}    ${EMPTY}



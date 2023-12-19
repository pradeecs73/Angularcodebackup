*** Settings ***
Resource          ../../../../keywords/add_device_helpers.resource
Resource          ../../../../keywords/connection_helpers.resource
Resource          ../../../../keywords/connection_keywords.resource
Resource          ../../../../keywords/area_operations.resource
Resource          ../../../../keywords/editor_page.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser


*** Variables ***
${SUITE_PROJECT_NAME}    InterfaceExp
${AREA_NAME}    Area 1
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102

*** Test Cases ***
TC1:Interface Exposed panel : Server Interface
    [Tags]  tc-904513
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    And Go To Plant View Page
    Then Device Should Be Visible In Devices And Properties Panel    LiquidMixing
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    And Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1  3
    And Select Particuler Menu From Left Menu    2
    And Expand Server Interface Panel
    Then Interface Table Should Be Visible    1
    Then Verify The Interface Text    ${server_interface_panel_table}   FillingToMixing [LiquidMixing]
    Then click select device in editor
    Then Delete Automation Component Or Device in editor page
    Then Number Of Devices On The Connection Editor Should Be  0
    Then Verify The Interface Text    ${server_interface_panel_table}   Add the interface here
    And Collapse Server Interface Panel
    Then Interface Table Should Not Be Visible    1

TC2:Interface Exposed panel : Client Interface
    [Tags]  tc-904513(a)
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    When Drop Devices To Connection Editor
    Then Draw Connection With Search
    And Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  2  3
    And Select Particuler Menu From Left Menu    2
    And Expand Client Interface Panel
    Then Interface Table Should Be Visible    0
    Then Verify The Interface Text    ${client_interface_panel_table}  FillingToMixing [BottleFilling]
    Then click select device in editor
    Then Delete Automation Component Or Device in editor page
    Then Number Of Devices On The Connection Editor Should Be  0
    Then Verify The Interface Text    ${client_interface_panel_table}   Add the interface here
    And Collapse Client Interface Panel
    Then Interface Table Should Not Be Visible    0

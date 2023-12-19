*** Settings ***
Resource          ./../../../../keywords/add_device_helpers.resource
Resource          ./../../../../keywords/connection_helpers.resource
Resource          ./../../../../keywords/connection_keywords.resource
Resource          ./../../../../Keywords/area_operations.resource
Resource          ./../../../../keywords/editor_page.resource
Resource    ../../../../keywords/PLC_scim.resource
Suite Setup      Launch Application in chrome browser with no project
Suite Teardown   close browser

*** Variables ***
${SUITE_PROJECT_NAME}    Unavailable dev
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${NON_SECURED_PLC1}    BF-nonSecurity 
${NON_SECURED_PLC2}    LM-nonSecurity

*** Test Cases ***

TC1:Area to Area: Verify red line is coming when we go online from root
    [Tags]  tc-966738
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Create Connection and Go Online
    Then Click Gooffline Button
    Then Create Connection Between The Areas
    Then Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Click Gooffline Button

TC2:Area to Area: Verify red line is coming when we go online from Area (server device)
    [Tags]  tc-966738
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Create Connection and Go Online
    Then Click Gooffline Button
    Then Create Connection Between The Areas
    Then Select Particuler Menu From Left Menu    1
    Then Click Goonline Button
    Then color of the element     ${connector_lines}    ${BLACK_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element     ${connector_lines}    ${BLACK_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element     ${connector_lines}    ${BLACK_COLOR}
    And Click Gooffline Button     

TC3: Area to Area: Verify red dotted line is coming when we go online from Area
    [Tags]  tc-966755
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Create Connection and Go Online
    Then Click Gooffline Button
    Then Create Connection Between The Areas
    Then Move Area Or Automation Component To Particular Position  0  100  50
    Then Move Area Or Automation Component To Particular Position  1  590  55
    Then Delete offline connection
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    Then Click Gooffline Button

TC4: Area to Area: Verify black line is coming when we go online from Area (server Device)
    [Tags]  tc-966755
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Create Connection and Go Online
    Then Click Gooffline Button
    Then Create Connection Between The Areas
    Then Move Area Or Automation Component To Particular Position  0  100  50
    Then Move Area Or Automation Component To Particular Position  1  590  55
    Then Delete offline connection
    Then Select Particuler Menu From Left Menu    1
    Then Click Goonline Button
    Then color of the element     ${connector_lines}    ${BLACK_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${connector_lines}    ${BLACK_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element     ${connector_lines}    ${BLACK_COLOR}
    And Click Gooffline Button    

TC5:Area to nested Area: Verify red line is coming when we go online
    [Tags]  tc-966881
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Create Connection and Go Online
    Then Click Gooffline Button
    Then Create Connection Between The Areas With Nested
    Then Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${green_connector_lines}   ${GREEN_COLOR}
    Then Click Gooffline Button

TC6: Area to nested area: Verify red dotted line is coming when we go online from root
    [Tags]  tc-966870
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project
    When Create Connection and Go Online
    Then Click Gooffline Button
    Then Create Connection Between The Areas With Nested
    Then Click Goonline Button
    Then Click Gooffline Button
    Then Move Area Or Automation Component To Particular Position  0  100  50
    Then Move Area Or Automation Component To Particular Position  1  590  55
    Then Delete offline connection
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${orange_connector_lines}    ${ORANGE_COLOR}
    Then Click Gooffline Button


TC7: Area to Area: Verify red dotted line is coming when we go online from Area (client Device)
    [Tags]  tc-966755-1
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project And Start PLCs On Teardown    ${NON_SECURED_PLC1}    ${NON_SECURED_PLC2} 
    When Create Connection and Go Online
    Then Click Gooffline Button
    Then Create Connection Between The Areas
    Then Move Area Or Automation Component To Particular Position  0  100  50
    Then Move Area Or Automation Component To Particular Position  1  590  55
    Then Delete offline connection
    Then Select Particuler Menu From Left Menu    3
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}    60
    Then Power off Device    ${NON_SECURED_PLC1} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}    60
    Then Power On Device    ${NON_SECURED_PLC1} 
    Then color of the element    ${orange_dotted_connector_lines}    ${ORANGE_DOTTED_LINE}    60
    Then color of the element    ${automation_header}    ${ORANGE_COLOR}    60
    And Click Gooffline Button 


TC8:Area to Area: Verify red line is coming when we go online from Area (client device) 
    [Tags]  tc-966738-1
    [Setup]   Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project And Start PLCs On Teardown    ${NON_SECURED_PLC1}    ${NON_SECURED_PLC2} 
    When Create Connection and Go Online
    Then Click Gooffline Button
    Then Create Connection Between The Areas
    Then Select Particuler Menu From Left Menu    3
    Then Check For Online Connection In The Editor
    Then Power off Device    ${NON_SECURED_PLC1} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}    60
    Then Power On Device    ${NON_SECURED_PLC1} 
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}    60
    Then color of the element    ${automation_header}    ${ORANGE_COLOR}    60
    And Click Gooffline Button

*** Keywords ***

Create Connection and Go Online
    Go To Plant View Page
    Drop Devices To Connection Editor
    Draw Connection With Search
    Establish All Connection In The Editor
    Click Goonline Button
    color of the element     ${green_connector_lines}    ${GREEN_COLOR}

 Create Connection Between The Areas
    Create New Area
    Create New Area
    Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Reorder AutomationComponent Or Area From One Area To Another Area  1   4

Delete offline connection
    click connection line    ${BLACK_COLOR}
    Click Delete Icon
    Confirm Popup

Create Connection Between The Areas With Nested
    Create New Area
    Create A New Area Inside Another Area   3  0
    Create A New Area Inside Another Area   4  1
    Create New Area
    Create A New Area Inside Another Area   6  3
    Create A New Area Inside Another Area   7  4
    Reorder AutomationComponent Or Area From One Area To Another Area  1   5
    Reorder AutomationComponent Or Area From One Area To Another Area  1   8
    Select Particuler Menu From Left Menu   0
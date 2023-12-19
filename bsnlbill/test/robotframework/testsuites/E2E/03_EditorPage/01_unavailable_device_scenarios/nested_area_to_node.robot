*** Settings ***
Resource    ../../../../keywords/common.resource
Resource    ../../../../keywords/connection_helpers.resource
Resource    ../../../../keywords/connection_keywords.resource
Resource    ../../../../keywords/editor_page.resource
Resource    ../../../../keywords/area_operations.resource
Resource    ../../../../keywords/node_to_nested_area.resource
Suite Setup   Launch Application in chrome browser with no project    ${SUITE_PROJECT_NAME}
Suite Teardown  Clear Project folder and close browser


*** Variables ***
${SUITE_PROJECT_NAME}    Unavailable Dev
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${NON_SECURED_PLC1}    BF-nonSecurity 
${NON_SECURED_PLC2}    LM-nonSecurity

*** Test Cases ***
TC-01: Online - Nested area to node: Verify red line is coming when we go online from root (client device inside the area).
    [Tags]  tc-967252
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create Nested area to node with client device inside the nested area
    Then Check For Online Connection In The Editor
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is Unavailable
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Project
    And Click Gooffline Button

TC-02:Online - Nested area to node: Verify red line is coming when we go online from root (server device inside the area).
    [Tags]  tc-968676
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create Nested area to node with server device inside the nested area
    Then Check For Online Connection In The Editor
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Project
    And Click Gooffline Button

TC-03: Online - Nested area to node: Verify red dotted line is coming when we go online from root (client device inside the area).
    [Tags]  tc-967263
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Orange Dotted line when client device inside the nested area
    Then Click Goonline Button
    Then Check If The Device Is available In Online And Not In Project
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is unavailable In Online And Not In Project
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Online And Not In Project
    And Click Gooffline Button

Tc-04: Online - Nested area to node: Verify red dotted line is coming when we go online from root (server device inside the area).
    [Tags]  tc-968698
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create Nested area to node with server device inside the nested area
    Then Check For Online Connection In The Editor
    Then Click Gooffline Button
    Then click connection line    ${BLACK_COLOR}
    Then Delete Automation Component Or Device in editor page
    Then Number Of Connection Lines Should Be    0
    Then Click Goonline Button
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE} 
    Then Power On Device    ${NON_SECURED_PLC2}   
    Then color of the element    ${orange_dotted_connector_lines}    ${ORANGE_DOTTED_LINE}
    Then Click Gooffline Button

TC-05:Online - Nested area to node: Verify red line is coming when we go online from area (client device inside the area).
    [Tags]  tc-968685
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    And Create Nested area to node with client device inside the nested area
    And Select Particuler Menu From Left Menu    3
    And Click Goonline Button
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    And Click Gooffline Button

TC-06: Online - Nested area to node: Verify red dotted line is coming when we go online from area (client device inside the area).
    [Tags]  tc-968700
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    And Orange Dotted line when client device inside the nested area
    And Select Particuler Menu From Left Menu    3
    And Click Goonline Button
    Then color of the element    ${orange_dotted_connector_lines}    ${ORANGE_DOTTED_LINE}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}
    Then Power On Device    ${NON_SECURED_PLC2}   
    Then color of the element    ${orange_dotted_connector_lines}    ${ORANGE_DOTTED_LINE}
    And Click Gooffline Button

TC-07: Online - Nested area to node: Verify black line is coming when we go online from area(server device inside the area).
    [Tags]  tc-968703
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create Nested area to node with server device inside the nested area
    Then Check For Online Connection In The Editor
    Then Click Gooffline Button
    Then click connection line    ${BLACK_COLOR}
    Then Delete Automation Component Or Device in editor page
    Then Number Of Connection Lines Should Be    0
    Then Select Particuler Menu From Left Menu    3
    Then Click Goonline Button
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${connector_lines}    ${BLACK_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2}   
    Then color of the element    ${connector_lines}    ${BLACK_COLOR}
    And Click Gooffline Button

#  issue at line 100 green line coming insted of black
TC-08:Online - Nested area to node: Verify black line is coming when we go online from area (server device inside the area).
    [Tags]  tc-968687
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project And Start PLCs On Teardown    ${NON_SECURED_PLC1}    ${NON_SECURED_PLC2} 
    Then Create Nested area to node with server device inside the nested area
    Then Select Particuler Menu From Left Menu    3
    Then Click Goonline Button
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${connector_lines}    ${BLACK_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2}   
    Then color of the element    ${connector_lines}    ${BLACK_COLOR}
    And Click Gooffline Button

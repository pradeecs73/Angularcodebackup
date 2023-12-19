*** Settings ***
Resource    ../../../../keywords/common.resource
Resource    ../../../../keywords/connection_helpers.resource
Resource    ../../../../keywords/connection_keywords.resource
Resource    ../../../../keywords/editor_page.resource
Resource    ../../../../keywords/area_operations.resource
Resource    ../../../../keywords/nested_area_to_nested_area.resource
Suite Setup   Launch Application in chrome browser with no project    ${SUITE_PROJECT_NAME}
Suite Teardown  Clear Project folder and close browser


*** Variables ***
${SUITE_PROJECT_NAME}    Unavailable Dev
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${NON_SECURED_PLC1}    BF-nonSecurity 
${NON_SECURED_PLC2}    LM-nonSecurity

*** Test Cases ***
TC-01:Online - Nested Area to Nested Area: Verify red line is coming when we go online from root.
    [Tags]  tc-968735
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create nested areas with devices inside along with connection drawn
    And Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    And Click Gooffline Button

TC-02:Online - Nested Area to Nested Area: Verify red line is coming when we go online from root from area containing client device.
    [Tags]  tc-968737
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create nested areas with devices inside along with connection drawn 
    And Select Particuler Menu From Left Menu   5
    And Click Goonline Button
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    And Click Gooffline Button

TC-03:Online - Nested area to Nested area: Verify red dotted line is coming when we go online from root.
    [Tags]  tc-967376
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create orange line between between nested areas
    And Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${orange_connector_lines}    ${ORANGE_COLOR}
    And Click Gooffline Button

TC-04:Online - Nested Area to Nested Area: Verify red dotted line is coming when we go online from root from area containing client device.
    [Tags]  tc-968730
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create orange line between between nested areas
    And Select Particuler Menu From Left Menu   5
    And Click Goonline Button
    Then color of the element    ${orange_connector_lines}    ${ORANGE_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${orange_connector_lines}    ${ORANGE_COLOR}
    And Click Gooffline Button

TC-05:Online - Nested Area to Nested Area: Verify black line is coming when we go online from area containing server device.
    [Tags]  tc-968739
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create orange line between between nested areas
    And Select Particuler Menu From Left Menu   2
    And Click Goonline Button
    Then color of the element    ${connector_lines}    ${BLACK_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element   ${connector_lines}    ${BLACK_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${connector_lines}    ${BLACK_COLOR}
    And Click Gooffline Button

# issue at line 61, green line coming instead of black
TC-06:Online - Nested Area to Nested Area: Verify red line is coming when we go online from root from area containing server device.
    [Tags]  tc-968731
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project And Start PLCs On Teardown    ${NON_SECURED_PLC1}    ${NON_SECURED_PLC2} 
    Then Create nested areas with devices inside along with connection drawn 
    And Select Particuler Menu From Left Menu   2
    And Click Goonline Button
    Then color of the element    ${connector_lines}    ${BLACK_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element   ${connector_lines}    ${BLACK_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${connector_lines}    ${BLACK_COLOR}
    And Click Gooffline Button

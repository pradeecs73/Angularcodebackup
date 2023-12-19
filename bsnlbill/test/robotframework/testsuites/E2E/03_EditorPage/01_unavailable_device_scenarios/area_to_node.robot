*** Settings ***
Resource    ../../../../keywords/common.resource
Resource    ../../../../keywords/connection_helpers.resource
Resource    ../../../../keywords/connection_keywords.resource
Resource    ../../../../keywords/editor_page.resource
Resource    ../../../../keywords/area_operations.resource
Resource    ../../../../keywords/area_to_node.resource

Suite Setup   Launch Application in chrome browser with no project    ${SUITE_PROJECT_NAME}
Suite Teardown  Clear Project folder and close browser


*** Variables ***
${SUITE_PROJECT_NAME}    Unavailable dev
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${NON_SECURED_PLC1}    BF-nonSecurity 
${NON_SECURED_PLC2}    LM-nonSecurity

*** Test Cases ***

TC-01: Online - Area to node: Verify red line is coming when we go online from root (server device inside the area).
    [Tags]  tc-968006
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create area to node with server device inside the area
    Then Check For Online Connection In The Editor
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Project
    And Click Gooffline Button

TC-02: Online - Area to node: Verify red line is coming when we go online from root (client device inside the area).
    [Tags]  tc-957432
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create area to node with client device inside the area
     Then Check For Online Connection In The Editor
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    And Click Gooffline Button

TC-03: Online - Area to node: Verify Red line is coming when we go online from area (client device inside area).
    [Tags]  tc-967997
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Create area to node with client device inside the area
    Then Select Particuler Menu From Left Menu    2
    Then Check For Online Connection In The Editor
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_connector_lines}    ${RED_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Project
    And Click Gooffline Button

TC-04: Online - Area to node: Verify Red dotted line is coming when we go online from root (client device inside the area).
    [Tags]  tc-983994
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Orange Dotted line when client device inside the area
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Online And Not In Project
    And Click Gooffline Button

TC-05: Online - Area to node: Verify Red dotted line is coming when we go online from root (server device inside the area).
    [Tags]  tc-983999
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Orange Dotted line when server device inside the nested area
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Online And Not In Project
    And Click Gooffline Button    

TC-06: Online - Nested area to node: Verify red dotted line is coming when we go online from area (client device inside the area).
    [Tags]  tc-984001
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Orange Dotted line when client device inside the area
    Then Select Particuler Menu From Left Menu    2
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    ${ORANGE_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Online And Not In Project
    And Click Gooffline Button

TC-07: Online - Area to node: Verify Red dotted line is coming when we go online from area (server device inside the area).
    [Tags]  tc-984004
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]  Close And Delete The Opened Project
    Then Orange Dotted line when server device inside the nested area
    Then Select Particuler Menu From Left Menu    2
    Then Click Goonline Button
    Then color of the element      ${connector_lines}    ${BLACK_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element      ${connector_lines}    ${BLACK_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element      ${connector_lines}    ${BLACK_COLOR}
    And Click Gooffline Button

# error at 72 green color is coming instead of black
TC-08: Online - Area to node: Verify Red line is coming when we go online from area (server device inside area).
    [Tags]  tc-968008
    [Setup]   Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START}   ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project And Start PLCs On Teardown    ${NON_SECURED_PLC1}    ${NON_SECURED_PLC2} 
    Then Create area to node with server device inside the area
    Then Select Particuler Menu From Left Menu    2
    Then Click Goonline Button
    Then color of the element      ${connector_lines}    ${BLACK_COLOR}
    Then Power off Device    ${NON_SECURED_PLC2} 
    Then color of the element      ${connector_lines}    ${BLACK_COLOR}
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then color of the element      ${connector_lines}    ${BLACK_COLOR}
    And Click Gooffline Button    

        
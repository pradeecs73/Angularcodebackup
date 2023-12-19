*** Settings ***
Resource    ../../../../keywords/common.resource
Resource    ../../../../keywords/connection_helpers.resource
Resource    ../../../../keywords/connection_keywords.resource
Resource    ../../../../keywords/editor_page.resource
Suite Setup   Launch Application in chrome browser with no project    ${SUITE_PROJECT_NAME}
Suite Teardown  Clear Project folder and close browser


*** Variables ***
${SUITE_PROJECT_NAME}    unavailable dev
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${SECURED_IP_RANGE_START}        192.168.2.109
${SECURED_IP_RANGE_END}          192.168.2.110
${WRITE_PASSWORD}       Test@123
${CONFIRM_Write_PASSWORD}       Test@123
${AUTOMATION_COMPONENT_USERNAME}       user1
${AUTOMATION_COMPONENT_PASSWORD}       siemens123
${SECURED_PLC1}    BF-UserSecurity
${SECURED_PLC2}    LM-UserSecurity
${NON_SECURED_PLC1}    BF-nonSecurity 
${NON_SECURED_PLC2}    LM-nonSecurity

*** Test Cases ***
TC01: Check whether application is allows to establish the connection and Go online between Non secured devices with offline connection
    [Tags]  tc-943419
    [Setup]  Given Opened Project With Added Non Secured Devices   ${SUITE_PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    And Draw Connection With Search
    Then color of the element  ${connector_lines}    ${BLACK_COLOR}
    Then Establish Connection Button Should Be Enabled
    Then Establish All Connection In The Editor
    Then Check For Online Connection In The Editor
    Then Check If The Device Is available In Project
    Then Click Gooffline Button

TC02: Check whether application throwing error when the non secured devices with offline connection are unavailable
    [Tags]  tc-943433
    [Setup]  Given Opened Project With Added Non Secured Devices   ${SUITE_PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    And Draw Connection With Search
    Then color of the element  ${connector_lines}    ${BLACK_COLOR}
    Then Establish Connection Button Should Be Enabled
    Then Establish All Connection In The Editor
    Then Check For Online Connection In The Editor
    Then Power Off Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is Unavailable
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Project
    Then Click Gooffline Button

TC03: Check whether application throwing error when the devices without offline connection are unavailable(non secured devices)
    [Tags]  tc-943434
    [Setup]  Given Opened Project With Added Non Secured Devices   ${SUITE_PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    And Draw Connection With Search
    Then color of the element  ${connector_lines}    ${BLACK_COLOR}
    Then Establish Connection Button Should Be Enabled
    Then Establish All Connection In The Editor
    And click connection line    ${BLACK_COLOR}
    And Click Delete Icon
    And Confirm Popup
    Then Click Goonline Button
    Then Check If The Device Is available In Online And Not In Project
    Then Power Off Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is unavailable In Online And Not In Project
    Then Power On Device    ${NON_SECURED_PLC2} 
    Then Check If The Device Is available In Online And Not In Project
    Then Click Gooffline Button

TC04: Check whether application throwing error when the devices without offline connection are unavailable (secured devices)
    [Tags]  tc-968150
    [Setup]  Given Opened Project With Added Protected Devices   ${SUITE_PROJECT_NAME}
    [Teardown]   Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    And Draw Connection With Search
    Then color of the element  ${connector_lines}    ${BLACK_COLOR}
    Then Establish Connection Button Should Be Enabled
    Then Establish All Connection In The Editor
    And click connection line    ${BLACK_COLOR}
    And Click Delete Icon
    And Confirm Popup
    Then Click Goonline Button
    Then Check If The Device Is available In Online And Not In Project
    Then Power Off Device    ${SECURED_PLC2}
    Then Check If The Device Is unavailable In Online And Not In Project
    Then Power On Device    ${SECURED_PLC2}
    Then Check If The Device Is available In Online And Not In Project
    Then Click Gooffline Button


TC05: Check whether application throwing error when the secured devices with offline connection are unavailable
    [Tags]  tc-979629
    [Setup]  Given Opened Project With Added Protected Devices   ${SUITE_PROJECT_NAME}
    [Teardown]  Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    And Draw Connection With Search
    Then color of the element  ${connector_lines}    ${BLACK_COLOR}
    Then Establish Connection Button Should Be Enabled
    Then Establish All Connection In The Editor
    Then Check For Online Connection In The Editor
    Then Power Off Device    ${SECURED_PLC2} 
    Then Check If The Device Is Unavailable
    Then Power On Device    ${SECURED_PLC2} 
    Then Check If The Device Is available In Project
    Then Click Gooffline Button


   

*** Keywords ***

Opened Project With Added Non Secured Devices
    [Arguments]  ${project_name}
    Create Project  ${project_name}
    Go To Device Tree Page
    Add Devices To The Opened Project  ${IP_RANGE_START}  ${IP_RANGE_END}   

Opened Project With Added Protected Devices
    [Arguments]  ${project_name}
    Create Project  ${project_name}
    Go To Device Tree Page
    Add Protected Devices To The Opened Project  ${SECURED_IP_RANGE_START}  ${SECURED_IP_RANGE_END}    
    Fill Password Values For Protected Fields Add Device  ${WRITE_PASSWORD}  ${CONFIRM_Write_PASSWORD}
    Fill The Automation Component Credentials To Authenticate  ${AUTOMATION_COMPONENT_USERNAME}  ${AUTOMATION_COMPONENT_PASSWORD}
    Fill The Automation Component Credentials To Authenticate  ${AUTOMATION_COMPONENT_USERNAME}  ${AUTOMATION_COMPONENT_PASSWORD}
    Confirm Adding Devices   
     
*** Settings ***
Resource          ./../../../../keywords/add_device_helpers.resource
Resource          ./../../../../keywords/common.resource
Resource          ./../../../../Keywords/area_operations.resource
Resource          ./../../../../keywords/editor_page.resource
Suite Setup      Turn ON PLC And Launch Application    @{IP_VALUES_GUESTS_PLCS}
Suite Teardown   Switch Off Plc And Close Browser    @{IP_VALUES_GUESTS_PLCS}


*** Variables ***
${SUITE_PROJECT_NAME}    Unavailable dev
${IP_RANGE_START_GUEST}    192.168.2.105
${IP_RANGE_END_GUEST}      192.168.2.106
@{IP_VALUES_GUESTS_PLCS}=       BF-Guest   LM-Guest
${GUEST_PLC2}    LM-GUEST

*** Test Cases ***
TC01: Check whether application throwing error when the devices without offline connection are unavailable (Guest devices)
    [Tags]  tc-968152
    [Setup]  Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START_GUEST}   ${IP_RANGE_END_GUEST}
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
    Then Power Off Device    ${GUEST_PLC2}
    Then Check If The Device Is unavailable In Online And Not In Project
    Then Power On Device    ${GUEST_PLC2}
    Then Check If The Device Is available In Online And Not In Project
    Then Click Gooffline Button

TC02: Check whether application throwing error when the Guest devices with offline connection are unavailable
    [Tags]  tc-979630 
    [Setup]  Given Create Project and Add Devices with Scan   ${SUITE_PROJECT_NAME}   ${IP_RANGE_START_GUEST}   ${IP_RANGE_END_GUEST}
    [Teardown]   Close And Delete The Opened Project
    And Go To Plant View Page
    Then Drop Devices To Connection Editor
    And Draw Connection With Search
    Then color of the element  ${connector_lines}    ${BLACK_COLOR}
    Then Establish Connection Button Should Be Enabled
    Then Establish All Connection In The Editor
    Then Check For Online Connection In The Editor
    Then Power Off Device    ${GUEST_PLC2} 
    Then Check If The Device Is Unavailable
    Then Power On Device    ${GUEST_PLC2} 
    Then Check If The Device Is available In Project
    Then Click Gooffline Button












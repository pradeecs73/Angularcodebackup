*** Settings ***
Resource          ../../../keywords/add_device_helpers.resource
Resource        ../../../keywords/generic_keywords.resource

Suite Setup      Launch application and create a Project  ${SUITE_PROJECT_NAME}
Suite Teardown   Delete project and close browser  ${SUITE_PROJECT_NAME}


*** Variables ***
${SUITE_PROJECT_NAME}    Add device test
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${IP_VALUE_MANUAL}       opc.tcp://192.168.2.101:4840
${IP_VALUE_MANUAL_PROTECTED}       opc.tcp://192.168.2.109:4840
${WRITE_PASSWORD}       Test@123
${CONFIRM_Write_PASSWORD}       Test@123
${AUTOMATION_COMPONENT_USERNAME}       user1
${AUTOMATION_COMPONENT_PASSWORD}       siemens123
${IP_RANGE_END_For_Cancel_Scan}      192.168.2.110


*** Test Cases ***
TC1 :Check whether user can add the device in project via online device scanning
    [Tags]  tc-832609
    [Setup]  Given Open Existing Project
    [Teardown]  Close Project
    AND Load Add Device Popup
    AND Add Devices Through Scan   ${IP_RANGE_START}   ${IP_RANGE_END}
    Then All Added Devices Should Have New Flag

TC2 :Check whether user can add the device in project via manual entry of ip address
     [Tags]  tc-832940
     [Setup]  Given Open Existing Project
     [Teardown]  Close Project
     AND Load Add Device Popup
     AND Add Devices Through Manual Entry  ${IP_VALUE_MANUAL}

TC3 :Check whether user can able to add the protected device in project
     [Tags]  tc-814599
     [Setup]  Given Open Existing Project
     [Teardown]  Close Project
     AND Load Add Device Popup
     AND Add Devices Through Manual Entry for protected device  ${IP_VALUE_MANUAL_PROTECTED}
     Then Fill Password Values For Protected Fields Add Device  ${WRITE_PASSWORD}  ${CONFIRM_Write_PASSWORD}
     Then Fill The Automation Component Credentials To Authenticate  ${AUTOMATION_COMPONENT_USERNAME}  ${AUTOMATION_COMPONENT_PASSWORD}
     Then Confirm Adding Devices
     Then Number Of Remaining Devices In Device Page Should Be  1


TC4 :Check whether user can able to delete the device in project
     [Tags]  tc-886877
     [Setup]  Given Open Existing Project
     [Teardown]  Close Project
     AND Load Add Device Popup
     AND Add Devices Through Manual Entry  ${IP_VALUE_MANUAL}
     AND Select a device to delete  ${delete_device_header}
     Then click the delete icon
     Then click ok in the delete device popup
     Then Number Of Remaining Devices In Device Page Should Be  0

TC5 :Device list should get cleared onclick of cancel scan
    [Tags]  tc-912826
    [Setup]  Given Open Existing Project
    [Teardown]  Close Project
    AND Load Add Device Popup
    AND Add Devices Through Scan And Check For Cancel Scan  ${IP_RANGE_START}   ${IP_RANGE_END}  ${IP_RANGE_END_For_Cancel_Scan}
    Then Device Grid Text Should Be    Start scan to select online devices

*** Keywords ***
Open Existing Project
    Opened Project    ${SUITE_PROJECT_NAME}
    Then Project Should Be In The Project List With OPENED Label   ${SUITE_PROJECT_NAME}


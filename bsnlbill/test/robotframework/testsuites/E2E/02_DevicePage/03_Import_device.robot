*** Settings ***
Resource          ../../../keywords/add_device_helpers.resource
Resource          ../../../keywords/connection_keywords.resource
Resource          ../../../keywords/generic_keywords.resource
Suite Setup      Launch Application in chrome browser with no project   ${SUITE_PROJECT_NAME}  chrome
Suite Teardown   Clear Project folder and close browser

*** Variables ***
${SUITE_PROJECT_NAME}    Import device
${SUITE_PROJECT_COMMENT}  testing the functionality of import device
${SUITE_PROJECT_AUTHOR}   robot
${WRITE_PASSWORD}       Test@123
${READ_PASSWORD}       Test@1234
${CONFIRM_Write_PASSWORD}       Test@123
${AUTOMATION_COMPONENT_USERNAME}       user1
${AUTOMATION_COMPONENT_PASSWORD}       siemens123
${READ_ACCESS_PROJECT}     readAccess
${BOTTLE_FILLING}=        ${EXECDIR}${/}test\\robotframework\\resources\\testData\\BottleFilling.xml
${INVALID_NODESETFILE}=    ${EXECDIR}${/}test\\robotframework\\resources\\testData\\Invalidnodeset.xml
${PROJECT_WITH_READ_ACCESS}=      ${EXECDIR}${/}test\\robotframework\\resources\\testData\\readAccessProject.yaml
${LIQUID_MIXING}=            ${EXECDIR}${/}test\\robotframework\\resources\\testData\\LiquidMixing.xml
${WASHING_STEP_1}=           ${EXECDIR}${/}test\\robotframework\\resources\\testData\\WashingStep1.xml
${WASHING_STEP_2}=           ${EXECDIR}${/}test\\robotframework\\resources\\testData\\WashingStep2.xml
${PROJECT_WITH_WRITE_ACCESS}=   ${EXECDIR}${/}test\\robotframework\\resources\\testData\\writeAccessProject.yaml
${SECURED_PROJECT}=   ${EXECDIR}${/}test\\robotframework\\resources\\testData\\Secured_Device.yaml
${PROJECT_READ_UPDATE_DEVICE}=   ${EXECDIR}${/}test\\robotframework\\resources\\testData\\ReadUpdateDevice.yaml

*** Test Cases ***
TC:1 Check whether application allows to import device in device page
        [Tags]      TC-901505  import
        [Setup]       Create Project and navigate to device page
        [teardown]    close and delete the opened project
                When Import a device nodeset file   ${BOTTLE_FILLING}    ${None}    ${None}
                And Confirm Import Device Popup
                Then devices should present in devicepage   Imported_Device_1


TC:2 Check whether application allows to Edit the device name and address while importing in device page
        [Tags]        TC-901509  import
        [Setup]        Create Project and navigate to device page
        [teardown]    Close And Delete The Opened Project
                When Import a device nodeset file   ${BOTTLE_FILLING}    ${None}    opc.tcp://192.168.2.101:4840
                And Confirm Import Device Popup
                Then devices should present in devicepage    Imported_Device_1
                Then deviceIP should present in devicepage   opc.tcp://192.168.2.101:4840
                And Delete the device
                When Import a device nodeset file   ${BOTTLE_FILLING}    BottleFilling    ${None}
                And Confirm Import Device Popup
                Then devices should present in devicepage    BottleFilling
                Then deviceIP should present in devicepage   opc.tcp://0.0.0.0:0000
                And Delete the device
                When Import a device nodeset file   ${BOTTLE_FILLING}    BottleFilling    opc.tcp://192.168.2.101:4840
                And Confirm Import Device Popup
                Then devices should present in devicepage    BottleFilling
                Then deviceIP should present in devicepage   opc.tcp://192.168.2.101:4840


TC:3 Check Whether application throwing error while importing nodeset file without application identifier
    [Tags]     TC-901513  import
    [Setup]       Create Project and navigate to device page
    [Teardown]    Close And Delete The Opened Project
         And Click Add New Device Button
         And Add New Device Dialog Should Be Visible
         And Select Import Devices Radio Option
         And Click Next Button
         And Wait Until Element Contains    ${DialogueBoxHeader}     Add new device
         And Import a file   ${INVALID_NODESETFILE}
         Then Should throw an error like "Application Identifier is missing"

TC:4 Check Whether application doesnt allow to import device in read access mode
    [Tags]    TC-901515  import
    [Teardown]   Close And Delete Protected Project    ${READ_ACCESS_PROJECT}
            When Click Import Button
            And Import a File     ${PROJECT_WITH_READ_ACCESS}
            And Click yes option
            And Wait Until Element Is Visible  ${password_verification_popup}
            And Fill Password Field   ${READ_PASSWORD}
            And Click Open Protected Project button
            Then Project Should Be In The Project List With OPENED Label    ${READ_ACCESS_PROJECT}
            And Go To Device Tree Page
            Then Element Should Not Be Clickable    ${add_new_device_button}


TC:5 Check Whether application allows to cancel the import device by clicking Cancel button
     [Tags]    TC-915016  import
     [Setup]     Create Project and navigate to device page
     [Teardown]    Close And Delete The Opened Project
            When Import a device nodeset file   ${BOTTLE_FILLING}    ${None}    ${None}
            And Cancel Import Device Popup
            Then device popup and device should not be present in the devicepage

TC:6 Check Whether application ask for device credentials alone for protected project while updating to secured device
    [Tags]      TC-902017  import
    [Setup]    Import Protected project    ${PROJECT_READ_UPDATE_DEVICE}     ${WRITE_PASSWORD}
    [Teardown]    Close and Delete Protected Project   ReadUpdateDevice
          And Go To Device Tree Page
          And Update to secured device for protected project    opc.tcp://192.168.2.110:4840
          Then Device should be updated with new name        LiquidMixing

TC:7 Check Whether applicaton does not allows to update device with read access mode
    [Tags]    TC-908896  import
    [Setup]    Import Protected project     ${PROJECT_READ_UPDATE_DEVICE}    ${READ_PASSWORD}
    [Teardown]    Close and Delete Protected Project     ReadUpdateDevice
         And Go To Device Tree Page
         Then Element Should Not Be Clickable   ${btn_update_device}

TC:8 Check whether application should ask for device credentails while updating from one secure to another secured device with different password only

    [Tags]    TC-908898  import
    [Setup]    Import Protected project    ${SECURED_PROJECT}     Test@123
    [Teardown]  Close and Delete Protected Project  Secured_device
            And Go To Device Tree Page
            And Update to secured device for protected project    opc.tcp://192.168.2.110:4840
            Then Device should be updated with new name    LiquidMixing


*** Keywords ***


Create Project and navigate to device page
    Create Project    ${SUITE_PROJECT_NAME}  ${SUITE_PROJECT_COMMENT}   ${SUITE_PROJECT_AUTHOR}
    Go To Device Tree Page

Device should be updated with new name
    [Arguments]    @{new_device_name}
    All Added Devices Should Have Updated Flag
    devices should present in devicepage      @{new_device_name}



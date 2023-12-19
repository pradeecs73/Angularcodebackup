*** Settings ***
Resource    ../../keywords/common.resource
Resource    ../../keywords/connection_helpers.resource
Resource    ../../keywords/connection_keywords.resource
Resource     ../../keywords/PLC_scim.resource
# Library    Remote  http://132.186.123.23:8270/NRobot/DeployLibrary  100 seconds  WITH NAME  DeployLib
#Smoke Test Machine IP
Library    Remote  http://132.186.123.23:8270/NRobot/PLCSimAutomation   100 seconds  WITH NAME  PLCSim
Suite Setup     Open browser without project   ${Project_name}
Suite Teardown    Close Browser

*** Variables ***
${Project_name}         Smoketest
${Project_comment}      Performing smoke test for SIMATICLiveLink application
${Project_Author}       SIMATICLiveLink
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102
${automation_header}=  css:.header-box.node-header-online
${offline_connector_lines}=  css:#myCanvas .connector:has([data-drag]) .connector-path
${green_connector_lines}=     css:.connect-path-success
@{PLC_INSTANCE_LIST}=  BF-NonSecurity    LM-NonSecurity

*** Test Cases ***
Smoke test for non secured devices
    [Tags]    smoke
    [Teardown]  Close And Delete The Opened Project  ${Project_name}
        when Create Project  ${projectname}  ${projectcomment}    ${projectauthor}
        Then Project Should Be In The Project List With OPENED Label    ${projectname}
        And Go To Device Tree Page
        When Add Devices To The Opened Project     ${IP_RANGE_START}  ${IP_RANGE_END}
        Then devices should present in devicepage   BottleFilling    LiquidMixing
        Then All Added Devices Should Have New Flag
        And Go To Plant View Page
        Then Device Should Be Visible In Devices And Properties Panel         BottleFilling    LiquidMixing   
        When Drop Device To Connection Editor  BottleFilling  500  50
        Then Device Should Be Visible In Connection Editor     BottleFilling
        Then Device Should Be Visible In Plant View Panel      BottleFilling
        Then Number Of Devices On The Connection Editor Should Be  1
        When Drop Device To Connection Editor  LiquidMixing  30  50
        Then Device Should Be Visible In Connection Editor  LiquidMixing
        Then Device Should Be Visible In Plant View Panel  LiquidMixing
        Then Number Of Devices On The Connection Editor Should Be  2
        # When Drop Device To Connection Editor  WashingStep1  550  50
        # Then Device Should Be Visible In Connection Editor  WashingStep1
        # Then Device Should Be Visible In Plant View Panel  WashingStep1
        # Then Number Of Devices On The Connection Editor Should Be  3
        #When Drop Device To Connection Editor    WashingStep2  30  350
        #Then Device Should Be Visible In Connection Editor  WashingStep2
        #Then Device Should Be Visible In Plant View Panel  WashingStep2
        #Then Number Of Devices On The Connection Editor Should Be  3
        When Draw Connection Line Between Devices  LiquidMixing:s:1  BottleFilling:c:1
        Then Number Of Connection Lines Should Be  1
        # When Draw Connection Line Between Devices  WashingStep1:c:1  LiquidMixing:s:2
        # Then Number Of Connection Lines Should Be  2
        #When Draw Connection Line Between Devices  WashingStep1:s:1    WashingStep2:c:1
        #Then Number Of Connection Lines Should Be  2
       # When Draw Connection Line Between Devices  WashingStep2:s:1    BottleFilling:c:2
        #Then Number Of Connection Lines Should Be  4
        Then color of the element  ${offline_connector_lines}    "black"
        When Select Establish Connection Option  Establish selected connections
        Then Establish Connection Button Should Be Disabled
        When Select Establish Connection Option  Establish all connections
        Then Establish Connection Button Should Be Enabled
        When Click Establish Connection Button
        Then Wait Until Loading Is Finished
        Then Popup Should Be Visible  Connection status  success  1 connections have been established.
        When Confirm Establish Connection Popup
        When Click Goonline Button
        Then color of the element    ${green_connector_lines}    "green"
        Then color of the element    ${automation_header}    "orange"
        Then Click Gooffline Button

*** Keywords ***

Open browser without project
    [Arguments]  ${name}
        Stop and Start all PLCs    @{PLC_INSTANCE_LIST}   
        Launch Application in chrome browser with no project    ${name}









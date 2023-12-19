*** Settings ***
Resource           ../../../keywords/project_helpers.resource
Resource          ./../../../keywords/editor_page.resource
Resource          ../../../Keywords/area_operations.resource
Suite Setup       Launch Application in chrome browser with no project
Suite Teardown    Close Browser

*** Variables ***


${PROJECT_WITH_CONNECTION_FILE}=      ${CURDIR}${/}..\\..\\..\\resources\\testData\\ProjectWithConnection.yaml
${PROJECT_WITH_OUT_CONNECTION_FILE}=     ${CURDIR}${/}..\\..\\..\\resources\\testData\\ProjectWithoutConnection.yaml
${PROJECT_NAME_FOR_CONNECTION} =  multisession
${PROJECT_NAME_FOR_WITHOUT_CONNECTION} =   multisession1
${COLOR_CONNECTION_GREEN} =   "green"
${COLOR_CONNECTION_ORANGE_DOTTED}=    "orangedotted"
${COLOR_CONNECTION_BLACK}=     "black"
${COLOR_CONNECTION_ORANGE}=     "orange"
${DISCONNECT_ONLINE_CONNECTION}=  Disconnect online connection
${IP_RANGE_START}        192.168.2.101
${IP_RANGE_END}          192.168.2.102



*** Test Cases ***
TC-01: Orange Dotted lines are not coming when establishing connection from another browser
        [Tags]    tc-925717    multisession
        [Setup]     Create Project With Scan And Drop Devices  ${PROJECT_NAME_FOR_CONNECTION}
        [Teardown]  Close And Delete The Opened Project   ${PROJECT_NAME_FOR_CONNECTION}
            Then Draw Connection With Search
            Given Establish All Connection In The Editor
            Then Click Goonline Button
            Then color of the element     ${green_connector_lines}    ${COLOR_CONNECTION_GREEN}

            Then Open Chrome browser in Incognito mode
            And Create Project With Scan And Drop Devices  ${PROJECT_NAME_FOR_WITHOUT_CONNECTION}
            And Click Goonline Button
            Then color of the element     ${orange_connector_lines}   ${COLOR_CONNECTION_ORANGE}

            Then Right Click the connection line     ${COLOR_CONNECTION_ORANGE_DOTTED}
            And Click the connection option   ${REMOVE_ONLINE_CONNECTION}  2

            When Switch Browser  1
            Then color of the element     ${connector_lines}   ${COLOR_CONNECTION_BLACK}
            Then Click Gooffline Button
            Then Establish All Connection In The Editor

            When Switch Browser  second
            Then color of the element     ${orange_connector_lines}   ${COLOR_CONNECTION_ORANGE}
            Then Click Gooffline Button
            Then Close And Delete The Opened Project   ${PROJECT_NAME_FOR_WITHOUT_CONNECTION}
            Then Close Browser

            When Switch Browser  1
            Then Click Gooffline Button

TC-02: Closing connection for orange dotted lines are coming red color(multisession)
        [Tags]    tc-925720    multisession
        [Setup]      Create Project With Scan And Drop Devices  ${PROJECT_NAME_FOR_CONNECTION}
        [Teardown]  Close And Delete The Opened Project    ${PROJECT_NAME_FOR_CONNECTION}
            Then Draw Connection With Search
            Given Establish All Connection In The Editor
            Then Click Goonline Button
            Then color of the element     ${green_connector_lines}    ${COLOR_CONNECTION_GREEN}

            Then Open Chrome browser in Incognito mode

            And Create Project With Scan And Drop Devices  ${PROJECT_NAME_FOR_WITHOUT_CONNECTION}
            And Click Goonline Button
            Then color of the element     ${orange_connector_lines}    ${COLOR_CONNECTION_ORANGE}


            When Switch Browser  1
            And click connection line     ${COLOR_CONNECTION_GREEN}
            And Right Click the connection line     ${COLOR_CONNECTION_GREEN}
            And Click the connection option   ${REMOVE_ONLINE_CONNECTION}  2

            When Switch Browser  second
            Then Connection Line should not be present     ${orange_connector_lines}
            Then Click Gooffline Button
            Then Close And Delete The Opened Project     ${PROJECT_NAME_FOR_WITHOUT_CONNECTION}
            Then Close Browser

            Switch Browser  1
            Then Click Gooffline Button


TC-03: Closing connection for orange dotted lines are coming red color(multisession) - area scenarios

        [Tags]    tc-711471    multisession
        [Setup]     Create Project With Scan And Drop Devices  ${PROJECT_NAME_FOR_CONNECTION}
        [Teardown]  Close And Delete The Opened Project  ${PROJECT_NAME_FOR_CONNECTION}
        Then Draw Connection With Search
        Given Establish All Connection In The Editor
        Then Click Goonline Button
        Then color of the element     ${green_connector_lines}    ${COLOR_CONNECTION_GREEN}

        Then Open Chrome browser in Incognito mode

        And Create Project With Scan And Drop Devices  ${PROJECT_NAME_FOR_WITHOUT_CONNECTION}
        Then Create New Area
        Then Create New Area
        Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
        Then Reorder AutomationComponent Or Area From One Area To Another Area  1   4
        Then Select Particuler Menu From Left Menu   3
        Then Click Goonline Button
        Then color of the element     ${orange_connector_lines}     ${COLOR_CONNECTION_ORANGE}

        When Switch Browser  1
        And click connection line     ${COLOR_CONNECTION_GREEN}
        And Right Click the connection line    ${COLOR_CONNECTION_GREEN}
        And Click the connection option   ${REMOVE_ONLINE_CONNECTION}  2

        When Switch Browser  second
        Then Connection Line should not be present     ${orange_connector_lines}
        Then Click Gooffline Button
        Then Close And Delete The Opened Project    ${PROJECT_NAME_FOR_WITHOUT_CONNECTION}
        Then Close Browser


        Then Switch Browser  1
        Then Click Gooffline Button




*** Keywords ***
Open project with existing connections
    [Arguments]    ${file_name}   ${project_name}
            Delete Project from Project root folder  ${project_name}
            Open Home Page
            Click Import Button
            Import a File     ${file_name}
            Click yes option
            Project Should Be In the Project List  ${project_name}
            Go To Plant View Page

Create Project With Scan And Drop Devices
     [Arguments]    ${project_name}
            Create Project and Add Devices with Scan   ${project_name}   ${IP_RANGE_START}   ${IP_RANGE_END}
            Go To Plant View Page
            Drop Devices To Connection Editor

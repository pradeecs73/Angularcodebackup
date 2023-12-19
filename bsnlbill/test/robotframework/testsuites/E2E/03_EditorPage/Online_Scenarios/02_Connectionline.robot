*** Settings ***
Resource    ../../../../keywords/common.resource
Resource    ../../../../keywords/connection_keywords.resource
Resource    ../../../../Keywords/area_operations.resource
Resource    ../../../../keywords/editor_page.resource

Suite Setup        Launch Application in chrome browser with no project    ${PROJECT_NAME}
Suite Teardown     Clear Project folder and close browser

*** Variables ***
${PROJECT_NAME}=    CloseConnection
${PROJECT_COMMENT}=     checking the functionality of the close connection 
${PROJECT_AUTHOR}=    SIMATICLiveLink
${OFFLINE_CONNECTOR_LINES}=  css:#myCanvas .connector:has([data-drag]) .connector-path
${CONNECTOR}=     css:.connector .connector-path-outline
${IP_RANGE_START}=     192.168.2.101
${IP_RANGE_END}=      192.168.2.102
${PROJECT_DEMO}=   ${EXECDIR}${/}test\\robotframework\\resources\\testData\\ProejectWithArea.yaml
${AREA_NAME}=     Area 1

*** Test Cases ***
TC:1 Check whether the application allows to remove the online connection between the non secured devices with offline connection
      [Tags]   TC-943429
      [setup]       Open project with existing connections
      [Teardown]    Close And Delete The Opened Project
      And Click Goonline Button
      And click connection line    "green"
      And Right Click the connection line     "green"
      And Click the connection option   "Disconnect online connection"   1
      Then color of the element    ${OFFLINE_CONNECTOR_LINES}    "black"
      And Click Gooffline Button

TC:2 Check whether the application allows to remove the online connection and the project connection between the devices with offline connection
      [Tags]         TC-943431
      [setup]      Open project with existing connections
      [Teardown]    Close And Delete The Opened Project
      And Click Goonline Button
      And click connection line     "green"
      And Right Click the connection line     "green"
      And Click the connection option    "Disconnect online connection and remove from project"  2
      Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES} 
      And Click Gooffline Button     
      Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}

TC:3 Check whether application allows to perform only remove online connection from online without offline connection
   [Tags]       TC-844820
   [Setup]        Open project with existing connections
   [Teardown]     Close And Delete The Opened Project
     And click connection line    "black"
     And Click Delete Icon
     And Confirm Popup
     When Click Goonline Button
     And Right Click the connection line     "orangedotted"
     Then Element Should Not Be Clickable   ${disconnect_online_connection_and_remove_from_project.format(3)}
     And Click the connection option    "Disconnect online connection"  2
     Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}      
     And Click Gooffline Button     
     Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}   

TC:4 Check whether application allows to add connectionline to the project and online without offline connection
    [Tags]      TC-943454
    [Setup]      Open project with existing connections
    [Teardown]   Close And Delete The Opened Project   
     And click connection line    "black"
     And Click Delete Icon
     And Confirm Popup
     When Click Goonline Button
     And Right Click the connection line     "orangedotted"
     Then Element Should Not Be Clickable   ${disconnect_online_connection_and_remove_from_project.format(3)}
     And Click the connection option    "add project connection"
     Then color of the element     ${green_connector_lines}    "green"
     And Click Gooffline Button 
     Then color of the element  ${OFFLINE_CONNECTOR_LINES}    "black"

TC:5 Check whether Orange dotted lines are coming when Client interface alone exposed manually inside the Area
    [Tags]      TC-806080
    [Setup]     Given Create Project and Add Devices with Scan   ${PROJECT_NAME}   ${IP_RANGE_START}    ${IP_RANGE_END}
    [Teardown]   Close And Delete The Opened Project  
    When Go To Plant View Page
    When Drop Devices To Connection Editor
    When Draw Connection With Search
    Then Create New Area
    Then Create New Area
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   3
    Then Reorder AutomationComponent Or Area From One Area To Another Area  1   4
    Then Move Area Or Automation Component To Particular Position  0  100  50
    Then Move Area Or Automation Component To Particular Position  1  590  53
    And click connection line    "black"
    And Delete Automation Component Or Device in editor page
    Then Number Of Connection Lines Should Be    0
    Then Select Particuler Menu From Left Menu   3
    Then Click Goonline Button
    Then color of the element     ${orange_connector_lines}    "orange"
    Then Select Particuler Menu From Left Menu   0
    Then color of the element     ${orange_connector_lines}    "orange"
    And Click Gooffline Button

TC:6 Check whether application not reloads orange dotted line after deleting a connection online
    [Tags]    TC-923825
    [Setup]    Open project with existing connections
    [Teardown]    Close And Delete The Opened Project 
    Then Create New Area
    Then Created Area Should Be Visible In Connection Editor   ${AREA_NAME}
    Then Created Area Should Be Present In left Menu   ${AREA_NAME}
    And click connection line    "black"
    And Click Delete Icon
    And Confirm Popup
    When Click Goonline Button
    And Right Click the connection line     "orangedotted"
    Then Element Should Not Be Clickable   ${disconnect_online_connection_and_remove_from_project}
    And Click the connection option    "Disconnect online connection"   2
    Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}
    Then Select Particuler Menu From Left Menu    3
    Then Select Particuler Menu From Left Menu    0
    Then Element Should Not Be Visible    ${orange_connector_lines}
    And Click Gooffline Button
    Then Element Should Not Be Visible    ${OFFLINE_CONNECTOR_LINES}

*** Keywords ***
Open project with existing connections
    Create Project    ${PROJECT_NAME}    ${PROJECT_COMMENT}    ${PROJECT_AUTHOR}
    Go To Device Tree Page
    Add Devices To The Opened Project  ${IP_RANGE_START}  ${IP_RANGE_END}
    Go To Plant View Page
    Drop Devices To Connection Editor
    Draw Connection With Search
    Establish All Connection In The Editor

Open project with device added
    Create Project    ${PROJECT_NAME}    ${PROJECT_COMMENT}    ${PROJECT_AUTHOR}
    Go To Device Tree Page
    Add Devices To The Opened Project  ${IP_RANGE_START}  ${IP_RANGE_END}
    Go To Plant View Page

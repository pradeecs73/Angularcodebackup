*** Settings ***
Resource    ../keywords/common.resource
Resource    ../keywords/connection_helpers.resource
Resource    ../keywords/connection_keywords.resource
Resource    ../keywords/editor_page.resource
Resource    ../keywords/area_operations.resource

*** Variables ***
${BLACK_COLOR}=   "black" 

*** Keywords ***
Create area to node with client device inside the area
    Create area to node with given device inside the area  2  0  1

Create area to node with server device inside the area
    Create area to node with given device inside the area  1  1  0

Orange Dotted line when client device inside the area
    Create area to node with client device inside the area
    click connection line    ${BLACK_COLOR}
    Delete Automation Component Or Device in editor page
    Number Of Connection Lines Should Be    0

Orange Dotted line when server device inside the nested area
    Create area to node with server device inside the area
    click connection line    ${BLACK_COLOR}
    Delete Automation Component Or Device in editor page
    Number Of Connection Lines Should Be    0

Create area to node with given device inside the area
    [Arguments]  ${reorder_source}  ${index_1}  ${index_2}
    Go To Plant View Page
    Drop Devices To Connection Editor
    Draw Connection With Search
    Number Of Connection Lines Should Be  1
    Create New Area
    Reorder AutomationComponent Or Area From One Area To Another Area  ${reorder_source}   3
    Select Particuler Menu From Left Menu    0
    Move Area Or Automation Component To Particular Position  ${index_1}  100  50
    Move Area Or Automation Component To Particular Position  ${index_2}  590  50
    Establish All Connection In The Editor
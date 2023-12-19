*** Settings ***
Resource    ../keywords/common.resource
Resource    ../keywords/connection_helpers.resource
Resource    ../keywords/connection_keywords.resource
Resource    ../keywords/editor_page.resource
Resource    ../keywords/area_operations.resource

*** Variables ***
${BLACK_COLOR}=   "black" 

*** Keywords ***

Create nested areas with devices inside along with connection drawn
    [Documentation]    Create nested areas with devices added to both the areas and connection
    ...    drawn inbetween them
    Go To Plant View Page
    Drop Devices To Connection Editor
    Draw Connection With Search
    Number Of Connection Lines Should Be  1
    Create New Area
    Create A New Area Inside Another Area   3   0
    Select Particuler Menu From Left Menu   0
    Create New Area
    Create A New Area Inside Another Area   5   2
    Reorder AutomationComponent Or Area From One Area To Another Area  1   4
    Reorder AutomationComponent Or Area From One Area To Another Area  1   6
    Select Particuler Menu From Left Menu   0
    Move Area Or Automation Component To Particular Position  0  100  50
    Move Area Or Automation Component To Particular Position  1  590  53
    Establish All Connection In The Editor

Create orange line between between nested areas
    Create nested areas with devices inside along with connection drawn
    click connection line    ${BLACK_COLOR}
    Delete Automation Component Or Device in editor page
    Number Of Connection Lines Should Be    0
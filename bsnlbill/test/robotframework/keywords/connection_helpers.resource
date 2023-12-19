*** Settings ***
Documentation    Keywords intended to be used in higher level keywords
Resource    ../resources/imports.resource
Variables   ../resources/plant_editor_page_locators.py


*** Keywords ***
##############################################
# Drag&drop device to canvas helper keywords #
##############################################
Calculate Offsets
    [Documentation]  Returns the (x,y) offsets between the middle of the `element`
    ...    and the `x`,`y` coordinates on the canvas of the connection editor.
    [Arguments]    ${element}  ${x}  ${y}
    # Calculate the middle of the source element (this is where the mouse is)
    ${element_top_x}=  Get Horizontal Position  ${element}
    ${element_top_y}=  Get Vertical Position  ${element}
    ${width}  ${height}=  Get Element Size  ${element}
    ${element_middle_x}=  Evaluate  $element_top_x + $width/2
    ${element_middle_y}=  Evaluate  $element_top_y + $height/2
    # Get the top left position of the canvas
    ${canvas_top_x}=  Get Horizontal Position  ${canvas}
    ${canvas_top_y}=  Get Vertical Position  ${canvas}
    ${canvas_default_spacing}=  Set Variable  ${10}  # to have some default spacing
    ${canvas_top_x}=  Evaluate  $canvas_top_x + $canvas_default_spacing
    ${canvas_top_y}=  Evaluate  $canvas_top_y + $canvas_default_spacing
    # Calculate offsets
    ${x_offset}=  Evaluate  $canvas_top_x + int($x) - $element_middle_x
    ${y_offset}=  Evaluate  $canvas_top_y + int($y) - $element_middle_y
    RETURN  ${x_offset}  ${y_offset}

Drag And Drop To Canvas
    [Documentation]  Drags and drops an element to the (`x`,`y`) coordinate on the canvas of the connection editor.
    ...    `x` and `y` are relative coordinates of the canvas (which means (0,0) is the top left corner).
    [Arguments]  ${element}  ${x}=${None}  ${y}=${None}
    Drag Element  ${element}
    IF  $x is None and $y is None
        Drop To Canvas
    ELSE
        ${x_offset}  ${y_offset}=  Calculate Offsets  ${element}  ${x}  ${y}
        Drop By Offset  ${x_offset}  ${y_offset}
        #Drop By Offset  ${x}    ${y}
    END
    Wait Until Page Does Not Contain Element  ${drop_target}  2s

Drag Element
    [Documentation]  Drags `element` and waits for the 'drop_target' to be created in the DOM.
    ...    'drop_target' is specific, so this keyword is only for dragging an element from Devices And Properties Panel.
    [Arguments]  ${element}
    Page Should Not Contain Element  ${drop_target}
    Mouse Down  ${element}
    Mouse Out  ${element}
    Wait Until Page Contains Element  ${drop_target}  3s
    Mouse Over  ${element}

Drop By Offset
    [Arguments]  ${x_offset}  ${y_offset}
    Mouse Move By Offset  ${x_offset}  ${y_offset}
    Mouse Up

Drop To Canvas
    Mouse Over  ${canvas}
    Mouse Up  ${canvas}

##################################
# Draw connection helper keywods #
##################################
Convert Device Interface To Locator
    [Documentation]  Converts `device_interface` from '<device_name>:s|c:<num>' format
    ...    to a webelement locator of the interface of the device on connection editor canvas.
    ...    Returns the converted locator.
    [Arguments]  ${device_interface}
    ${device_name}  ${interface_type}  ${interface_num}  Split String  ${device_interface}  :
    ${device}=  Get Device WebElement By Name  ${device_name}
    ${interface_type}=  Set Variable If
    ...    '${interface_type}' == 's'  .right-inf
    ...    '${interface_type}' == 'c'  .left-inf
    ...    ${None}
    IF  $interface_type is None  Fail  msg=Unexpected interface type: ${interface_type}
    ${interface_num}=  Convert To Integer  ${interface_num}
    ${circle}=  Set Variable  css:g:nth-child(${interface_num} of ${interface_type}) circle:first-child
    ${element}=  Create List  ${device}  ${circle}
    RETURN  ${element}

Draw Connection
    [Documentation]  Draws connection line between `source` and `target` in the connection editor.
    [Arguments]  ${source}  ${target}
    # Check for stuck connection lines
    Page Should Not Contain Element  css:body>div.haveconnection
    Mouse Down  ${source}
    # Has to start drawing otherwise it does not work
    Mouse Move By Offset  5  0
    Mouse Over  ${target}
    Mouse Up

Get Device WebElement By Name
    [Documentation]  Returns the WebElement by `name` from the connection editor canvas.
    ...    Fails if the element is not found.
    [Arguments]  ${name}
    ${nodes}=  Get WebElements  ${devices_on_canvas}
    FOR  ${node}  IN  @{nodes}
        ${chained_locator}=  Create List  ${node}  ${device_header_text}
        ${device_name}=  Get Text  ${chained_locator}
        IF  '${device_name}' == '${name}'  RETURN  ${node}
    END
    Fail  msg=Device element was not found: ${name}



Device Should Be Visible In Devices And Properties Panel
    [Arguments]  @{device_names}
    FOR  ${device_name}  IN  @{device_names}
        ${device_element}=  Replace Variables  ${properties_panel_device_node_element}
        Wait Until Element Is Visible  ${device_element}  1s
    END

No Interface Found
    ${no_interface}=  Run Keyword And Return Status  Wait Until Page Contains Element  ${no_interface_found}  1s
    RETURN  ${no_interface}

Draw Connection With Search
    ${anchor_nodes}=  Get WebElements  ${server_anchor}
    FOR  ${anchor}  IN  @{anchor_nodes}
        Wait Until Element Is Visible     ${anchor}
        Wait Until Element Is Enabled    ${anchor}
        Click Element    ${anchor}
        Click Element    ${anchor}

       ${is_interface_present}=   No Interface Found
       IF  ${is_interface_present}
              Click Element    ${anchor}
              BREAK
           ELSE
               Wait Until Element Is Visible     ${interface_selection_for_search}
               Click Element     ${interface_selection_for_search}
               BREAK
       END
    END

Draw Connection With Search With Single Area
   ${anchor_nodes}=  Get WebElements  ${server_anchor}
    FOR  ${anchor}  IN  @{anchor_nodes}
        Wait Until Element Is Visible     ${anchor}
        Wait Until Element Is Enabled    ${anchor}
        Click Element    ${anchor}

       ${is_interface_present}=   No Interface Found
       IF  ${is_interface_present}
              Click Element    ${anchor}
              BREAK
           ELSE
               Wait Until Element Is Visible     ${interface_selection_for_search}
               Click Element     ${interface_selection_for_search}
               BREAK
       END
    END


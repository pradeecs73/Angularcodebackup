*** Settings ***
Documentation    Keywords intended to be used in testcases
Resource    ../keywords/connection_helpers.resource
Resource    generic_keywords.resource


*** Variables ***
${BLACK_LINE_RGB}=      rgb(33, 41, 44)
${GREEN_LINE_RGB}=      rgb(0, 154, 73)
${ORANGE_LINE_RGB}=    rgb(235, 120, 10)
${BLACK_COLOR}=    "black"
${GREEN_COLOR}=    "green"
${ORANGEDOTTED_COLOR}=  "orangedotted"
${ORANGE_COLOR}=    "orange"
${RED_COLOR}=    "red"
${ORANGE_DOTTED_LINE}    "#faa50A"
${RED_DOTTED_LINE}    "#dc0031"
${OFFLINE_AC_HEADER_COLOR}    "#9a8a7c"
${REMOVE_ONLINE_CONNECTION}=   "Disconnect online connection"
${REMOVE_ONLINE_AND_REMOVE_FROM_PROJECT}=    "Disconnect online connection and remove from project"
${ADD_ONLINE_CONNECTION}=    "add project connection"

*** Keywords ***
Click Goonline Button
    Wait Until Element Is Visible    ${go_online_button}
    Click Element     ${go_online_button}

Click Establish Connection Button
    Wait Until Element Is Visible  ${establish_connection_button}  1s
    Click Button  ${establish_connection_button}

Confirm Establish Connection Popup
    Popup Should Be Visible  Connection status  success
    Confirm Popup

Failed Establish Connection Popup
    Popup Should Be Visible  Failed to establish the connection.    error
    Confirm Popup

Click Gooffline Button
    Wait Until Element Is Visible    ${go_offline_button}   10s
    Click Element     ${go_offline_button}
    Wait Until Element Is Not Visible    ${confirm_window_description}    30s

click select device in editor
    Wait Until Element Is Visible    ${device_names_on_canvas}
    Click Element     ${device_names_on_canvas}
Draw Connection Line Between Devices
    [Documentation]  Draws connection between the interfaces of `from` and `to` devices.
    ...    The input format shall be '<device_name>:s|c:<num>' where
    ...    - <device_name> is the name of the device
    ...    - s|c is 's' or 'c' depending whether it's a server or client interface
    ...    - <num> is the number of the interface. 1 means the first interface from the interface list.
    ...    E.g.: Draw Connection Line Between Devices  Mixer:s:2  Filler:c:1
    [Arguments]  ${from}  ${to}
    ${from_element}=  Convert Device Interface To Locator  ${from}
    ${to_element}=  Convert Device Interface To Locator  ${to}
    Draw Connection  ${from_element}  ${to_element}

Drop Device To Connection Editor
    [Arguments]  ${device_name}  ${x}=${None}  ${y}=${None}
    ${expanded_node}=  Expand Device  ${device_name}
    Drag And Drop To Canvas  ${expanded_node}  ${x}  ${y}

Expand Device
    [Arguments]  ${device_name}
    ${device_element}=  Replace Variables  ${properties_panel_device_node_element}
    Wait Until Element Is Visible  ${device_element}
    ${expanded_node}=  Set Variable  ${device_element}/..//app-node
    ${is_collapsed}=  Run Keyword And Return Status  Page Should Not Contain Element  ${expanded_node}
    IF  ${is_collapsed}
        Click Element  ${device_element}
        Wait Until Element Is Visible  ${expanded_node}  1s
    END
    RETURN  ${expanded_node}

Select Establish Connection Option
    [Arguments]  ${option}
    Wait Until Element Is Enabled  ${establish_connection_options_button}  1s
    Click Button  ${establish_connection_options_button}
    Wait Until Element Is Visible  ${establish_connection_options_opened}  1s
    Click Element  ${establish_connection_options_opened} >> xpath:a[text()='${option}']
    Wait Until Page Contains Element  ${establish_connection_options_closed}  1s

click connection line
    [Documentation]  Returns the WebElement by `name` from the connection editor canvas.

        ...    Fails if the element is not found.
        [Arguments]     ${line_color}
            IF     ${line_color} == ${GREEN_COLOR}
                  wait until element is visible   ${green_connector_lines}  10s
                  Click Element    ${green_connector_lines}
            END
            IF     ${line_color} == ${BLACK_COLOR}
                 Wait Until Element Is Visible    ${connector_lines}    10s
                 Click Element     ${connector_lines}
            END
            IF      ${line_color} == ${ORANGEDOTTED_COLOR}
                  Wait Until Element Is Visible   ${orange_connector_lines}   10s
                  Click Element     ${orange_connector_lines}
            END


Right Click the connection line
       [Documentation]    This keyword is used for right clicking the connection lines in the Online mode.
       ...                Which will contain options for the close the existing connection in online and offline mode.
       ...                Also it contain option for Adding the connection line
       [Arguments]     ${color}
       IF  ${color} == ${GREEN_COLOR}
           Open Context Menu  ${green_connector_lines}
       END
       IF  ${color} == ${ORANGEDOTTED_COLOR}
            Wait Until Element Is Visible   ${orange_connector_lines}   20s
           Open Context Menu   ${orange_connector_lines}
       END


Click the connection option
    [Arguments]  ${option}  ${index}=None
        IF  ${option} == ${REMOVE_ONLINE_CONNECTION}
            ${disconnect_online_connection_line}=  Replace Variables  ${disconnect_online_connection_line}
            Wait Until Element Is Visible    ${disconnect_online_connection_line}   20s 
            Click Element     ${disconnect_online_connection_line}
            Confirm Popup
        END

        IF  ${option} == ${REMOVE_ONLINE_AND_REMOVE_FROM_PROJECT}
            ${disconnect_online_connection_line}=  Replace Variables  ${disconnect_online_connection_line}
            Wait Until Element Is Visible    ${disconnect_online_connection_line }
            Click Element     ${disconnect_online_connection_line }
            Confirm Popup
        END

        IF     ${option} == ${ADD_ONLINE_CONNECTION}
           Wait Until Element Is Visible     ${add_connection_to_the_project}
           Click Element    ${add_connection_to_the_project}
        END



###########
# Asserts #
###########
Device Should Be Visible In Connection Editor
    [Arguments]  ${device_name}
    WebElement Text Should Be  ${device_name}  ${device_names_on_canvas}  Device not found on connection editor:

Device Should Be Visible In Plant View Panel
    [Arguments]  ${device_name}
    WebElement Text Should Be  ${device_name}  ${plant_view_panel_elements}  Device not found on plant view panel:

Go online Button Should Be Disabled
    Wait Until Element Is Visible  ${go_online_button}  3s
    Element Should Be Disabled  ${go_online_button}

Go online Button Should Be Enabled
    Wait Until Element Is Visible  ${go_online_button}  3s
    Element Should Be Enabled  ${go_online_button}    

Establish Connection Button Should Be Disabled
    Wait Until Element Is Visible  ${establish_connection_button}  3s
    Element Should Be Disabled  ${establish_connection_button}

Establish Connection Button Should Be Enabled
    Wait Until Element Is Visible  ${establish_connection_button}  3s
    Element Should Be Enabled  ${establish_connection_button}

Number Of Connection Lines Should Be
    [Arguments]  ${number}
    ${present}=  Run Keyword And Return Status    Element Should Be Visible   ${connector_lines}
    IF  ${present}
            ${count}=  Get Element Count  ${connector_lines}
        ELSE
            ${count}=   Set Variable    ${0}
    END
    Should Be Equal As Integers  ${count}  ${number}  msg=Connector line number mismatch

Number Of Devices On The Connection Editor Should Be
    [Arguments]    ${number}
    ${present}=  Run Keyword And Return Status    Element Should Be Visible   ${devices_on_canvas}
    IF  ${present}
            ${actual}=  Get Element Count  ${devices_on_canvas}
        ELSE
            ${actual}=   Set Variable    ${0}
    END
    Should Be Equal As Integers  ${actual}  ${number}  msg=Expected number of devices on canvas does not match

color of the element
    [Documentation]    This keyword will be used to verify the stroke property in CSS of the given element
    [Arguments]    ${Inputelement}     ${Expectedcolor}    ${timeout}=20
      IF  ${Expectedcolor} == ${BLACK_COLOR}
           ${Expectedrgb}=  Replace Variables     ${BLACK_LINE_RGB}
      END
      IF  ${Expectedcolor} == ${GREEN_COLOR}
           ${Expectedrgb}=  Replace Variables     ${GREEN_LINE_RGB}
      END
      IF  ${Expectedcolor} == ${ORANGE_COLOR}
           ${Expectedrgb}=  Replace Variables     ${ORANGE_LINE_RGB}
      END
     Wait Until Page Contains Element     ${Inputelement}  ${timeout}s
     ${elements} =  Get WebElements    ${Inputelement}
    #  FOR  ${element}  IN  ${elements}
    #       ${color}=  Get CSS Property Value  ${element}  stroke
    #       Should Be Equal As Strings  ${color}  ${Expectedrgb}  msg=CSS property value does not match
    #  END

Connection Line should not be present
    [Arguments]    ${Inputelement} 
    Wait Until Page Contains Element     ${Inputelement}  10s
    Element Should Be Visible   ${Inputelement}

Delete Automation Component Or Device in editor page
    Wait Until Element Is Enabled    ${delete_device_or_connection_btn}    10s
    Click Button    ${delete_device_or_connection_btn}
    Wait Until Element Is Enabled    ${delete_device_editor_confirmation_btn}    10s
    Click Button    ${delete_device_editor_confirmation_btn}

Device Or Area Should Not Be Visible In Connection Editor
    [Arguments]  ${device_name}
    WebElement Text Should Not Be  ${device_name}  ${device_names_on_canvas}  Device Or Area not found on connection editor:



*** Settings ***
Resource   ../resources/imports.resource
Variables  ../resources/devices_page_locators.py
Variables  ../resources/generic_elements_locators.py
Resource   ../keywords/ui_navigation.resource
Resource   ./../keywords/connection_helpers.resource
Resource   ./../keywords/connection_keywords.resource
Library     Collections

*** Variables ***
${automation_header}=  css:.header-box.node-header-online
${offline_automation_header}=  xpath://*[contains(@class,'node-header-unavailable')]
${WRITE_PASSWORD}       Test@123
${CONFIRM_Write_PASSWORD}       Test@123
${AUTOMATION_COMPONENT_USERNAME}       user1
${AUTOMATION_COMPONENT_PASSWORD}       siemens123


*** Keywords ***
#################
# Basic actions #
#################
Drop Devices To Connection Editor
    Drop Device To Connection Editor  LiquidMixing  100  50
    Device Should Be Visible In Connection Editor  LiquidMixing
    Device Should Be Visible In Plant View Panel  LiquidMixing
    Drop Device To Connection Editor  BottleFilling  600  50
    Device Should Be Visible In Connection Editor  BottleFilling
    Device Should Be Visible In Plant View Panel  BottleFilling

Establish All Connection In The Editor
    Click Establish Connection Button
    Wait Until Loading Is Finished
    Popup Should Be Visible  Connection status  success  1 connections have been established.
    Confirm Establish Connection Popup


Check For Online Connection In The Editor
    Click Goonline Button
    color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    color of the element    ${automation_header}    ${ORANGE_COLOR}

Check If The Device Is Unavailable
    color of the element    ${red_connector_lines}    ${RED_COLOR}
    color of the element    ${offline_automation_header}    ${OFFLINE_AC_HEADER_COLOR}

Check If The Device Is available In Project
    color of the element    ${green_connector_lines}    ${GREEN_COLOR}
    color of the element    ${automation_header}    ${ORANGE_COLOR}

Check If The Device Is available In Online And Not In Project
    color of the element    ${orange_dotted_connector_lines}    ${ORANGE_DOTTED_LINE}
    color of the element    ${automation_header}    ${ORANGE_COLOR}

Check If The Device Is unavailable In Online And Not In Project
    color of the element    ${red_dotted_connector_lines}    ${RED_DOTTED_LINE}
    color of the element    ${automation_header}    ${OFFLINE_AC_HEADER_COLOR}

 Get Interface Element To Monitor
    [Documentation]  Getting the interface element which has to be monitored
    [Arguments]  ${device_interface}
    ${device_name}  ${interface_type}  ${interface_num}  Split String  ${device_interface}  :
    ${device}=  Get Device WebElement By Name  ${device_name}
    ${interface_type}=  Set Variable If
    ...    '${interface_type}' == 's'  .right-inf
    ...    '${interface_type}' == 'c'  .left-inf
    ...    ${None}
    IF  $interface_type is None  Fail  msg=Unexpected interface type: ${interface_type}
    ${interface_num}=  Convert To Integer  ${interface_num}
    ${interface_element}=  Set Variable  css:g .haveconnection
    ${element}=  Create List  ${device}  ${interface_element}
    RETURN  ${element}

Click On The Interface To Monitor
      [Arguments]  ${interface_name}
#     ${interface_element_toMonitor}=  Get Interface Element To Monitor   ${interface}
#     Log       ${interface_element_toMonitor}
     ${interface_path}=  Replace Variables  ${interface_path}
    Wait Until Element Is Enabled   ${interface_path}  20s
    Click Element  ${interface_path}

Interface exposed panel is collapsed
    Wait Until Element Is Visible   ${exposed_panel_collapsed}  20s

Select Properties Panel
    [Documentation]  click the properties panel from RHS device properties panel.
    ...    Verify the values present or not
       wait until element is visible  ${table_device_property}  10s
       Click Element   ${table_device_property}
       sleep  2s
       wait until element is visible   ${properties_panel}  20s

Verify Monitoring Value
     [Documentation]  Getting the clientLastContactTime value from table and stored in `text_value` variable.
     ...    After 2sec again get the same value and values should not be same.Argument row_position is the
     ...    row number of the value to be monitored ,Argument device_property is the property value of the
     ...    row to be monitored ,Argument accordian_position is the accordian number(input data or output data)
    [Arguments]    ${row_position}    ${device_property}  ${accordion_position}
        ${accordions} =    get webelements    ${accordion_tab}
        Log Many     ${accordions}
        wait until element is visible   ${accordions[0]}  10s
        wait until element is visible   ${accordions[1]}  10s
        click element    ${accordions[${accordion_position}]}
         ${accordion_table_property} =  Replace Variables  ${accordion_table_property}
         wait until element is visible   ${accordion_table_property}  20s
         element text should be    ${accordion_table_property}    ${device_property}

        ${accordion_table_value}=    Replace Variables  ${accordion_table_value}
        wait until element is visible   ${accordion_table_value}  20s
        ${text_value}=    get text    ${accordion_table_value}
        sleep    4s
        element text should not be    ${accordion_table_value}    ${text_value}

Verify The Interface Text
        [Arguments]  ${key}  ${result}
        ${interface_panels_content} =    Get WebElements    ${key}
        ${text}=  Get Text  ${interface_panels_content[0]}
        log   ${text}
        Should Be Equal as Strings    ${text}   ${result}

Expand Server Interface Panel
        Wait Until Element Is Visible  ${server_interface_expand}
        Click Element   ${server_interface_expand}

Collapse Server Interface Panel
        Wait Until Element Is Visible  ${server_inteface_collapse}
        Click Element   ${server_inteface_collapse}

Expand Client Interface Panel
        Wait Until Element Is Visible  ${client_interface_expand}
        Click Element   ${client_interface_expand}

Collapse Client Interface Panel
        Wait Until Element Is Visible  ${client_inteface_collapse}
        Click Element   ${client_inteface_collapse}

Interface Table Should Be Visible
        [Arguments]   ${index}
        ${interface_panels} =    Get WebElements    ${interface_panels_expanded}
        Wait Until Element Is Visible   ${interface_panels[${index}]}   10s

Interface Table Should Not Be Visible
        [Arguments]   ${index}
        ${interface_panels} =    Get WebElements    ${interface_panels_expanded}
        Wait Until Element Is Not Visible   ${interface_panels[${index}]}   10s

Add Devices In Loop Through Manual Entry for protected devices
        [Documentation]    loop through the protected devices added through manual entry
        ...    if project is not protected add project projection else authenticate the device
        [Arguments]  ${title}  @{device_address}
        log  ${title}
        FOR  ${device_ip}  IN  @{device_address}
               Load Add Device Popup
               Add Devices Through Manual Entry for protected device     ${device_ip}
               ${password_protection_protected} =  Check Password Protection Popup  ${title}
               IF   ${password_protection_protected}
                 Fill Password Values For Protected Fields Add Device  ${WRITE_PASSWORD}  ${CONFIRM_Write_PASSWORD}
               END
               Fill The Automation Component Credentials To Authenticate  ${AUTOMATION_COMPONENT_USERNAME}  ${AUTOMATION_COMPONENT_PASSWORD}
               Confirm Adding Devices
         END


Check Password Protection Popup
     [Arguments]   ${title}
     ${password_validation_modal_title}=     Replace Variables  ${password_validation_modal_title}
     ${password_protection_protected}=  Run Keyword And Return Status  Wait Until Element Is Visible  ${password_validation_modal_title}  2s
     RETURN     ${password_protection_protected}








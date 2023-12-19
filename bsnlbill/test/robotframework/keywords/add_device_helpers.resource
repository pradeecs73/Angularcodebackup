*** Settings ***
Resource   ../resources/imports.resource
Variables  ../resources/devices_page_locators.py
Variables  ../resources/generic_elements_locators.py
Resource   ../keywords/ui_navigation.resource
Resource   ../keywords/generic_keywords.resource

Library                     Collections

*** Variables ***
${ONLINE_RADIO_OPTION}=    Browse for online devices
${IMPORT_RADIO_OPTION}=    Import devices from a file
*** Keywords ***
#################
# Basic actions #
#################
Click Add Devices Button
    Wait Until Element Is Enabled  ${add_new_device_dialog_add_devices_button}   10s
    Click Button  ${add_new_device_dialog_add_devices_button}

Click Add New Device Button
    Wait Until Element Is Visible   ${add_new_device_button}
    Wait Until Element Is Enabled  ${add_new_device_button}
    Click Element  ${add_new_device_button}

Click Scan Settings
    Wait Until Element Is Visible  ${add_new_device_dialog_scan_settings}
    Click Element  ${add_new_device_dialog_scan_settings}

Click Next Button
    Wait Until Element Is Visible  ${add_new_device_dialog_next_button}
    Click Button  ${add_new_device_dialog_next_button}

Click Select All Devices
    Wait Until Element Is Visible  ${add_new_device_dialog_select_all_devices}
    Click Element  ${add_new_device_dialog_select_all_devices}

Click Start Scan
    Wait Until Element Is Visible  ${add_new_device_dialog_start_scan}
    Click Element  ${add_new_device_dialog_start_scan}

Set IP Range In Scan Settings
    [Arguments]  ${from_ip}  ${to_ip}
    Click Scan Settings
    Set IP Range  ${from_ip}  ${to_ip}

Set IP Range
    [Documentation]    setting the ip address for from and to field
    [Arguments]  ${from_ip}  ${to_ip}
    Wait Until Element Is Visible  ${add_new_device_dialog_scan_settings_ip_from_input}
    Input Text  ${add_new_device_dialog_scan_settings_ip_from_input}  ${from_ip}
    # The extra click is needed, because the field is autofilled with the first click
    Click Element  ${add_new_device_dialog_scan_settings_ip_to_input}
    Input Text  ${add_new_device_dialog_scan_settings_ip_to_input}  ${to_ip}

Load Add Device Popup
    [Documentation]    It will go to device tree page and it will opens add device popup
    Go To Device Tree Page
    Click Add New Device Button
    Add New Device Dialog Should Be Visible
    Select Online Devices Radio Option
    Click Next Button
    Select Online Devices Panel Should Be Visible

Add Devices Through Scan
    [Documentation]  Scan for the devices for the given ip range and it will add the devices to project
    [Arguments]  ${IP_RANGE_START}  ${IP_RANGE_END}
    Set IP Range In Scan Settings  ${IP_RANGE_START}  ${IP_RANGE_END}
    Click Start Scan
    Wait Until Loading Is Finished
    Number Of Found Devices Should Be  2
    Add All Found Devices

Add Protected Device To The Project
    Click Login To Authenticate Automation Component
    Wait Until Loading Is Finished


Click Login To Authenticate Automation Component
    Wait Until Element Is Enabled  ${loginBtn}   10s
    Click Button  ${loginBtn}

 Click Cancel Scan
    [Documentation]  This Part will handle the cancel scan event it will
    ...    wait for spinner and cancel scan button to get populate in dom
    ...    and clicks on cancel scan button .
    Wait Until Page Contains Element  ${spinner}  20s
    Wait Until Element Is Enabled  ${spinner}   20s
    Wait Until Page Contains Element  ${cancel_scan_button}  10s
    Wait Until Element Is Enabled  ${cancel_scan_button}      10s
    Click Button  ${cancel_scan_button}

Add Devices Through Scan And Check For Cancel Scan
    [Documentation]  This Part will scan for the provided Ip range once devises
    ...    list is created it will set the ip end range to different value
    ...    through `IP_RANGE_END_For_Cancel_Scan` before the sacan complets
    ...    cancel button is clicked.
    [Arguments]  ${IP_RANGE_START}  ${IP_RANGE_END}  ${IP_RANGE_END_For_Cancel_Scan}
    Set IP Range In Scan Settings  ${IP_RANGE_START}  ${IP_RANGE_END}
    Click Start Scan
    Wait Until Loading Is Finished
    Set IP Range In Scan Settings  ${IP_RANGE_START}  ${IP_RANGE_END_For_Cancel_Scan}
    Click Start Scan
    Click Cancel Scan
Wait Until Cancel Button Disappear
    Wait Until Page Does Not Contain    ${btn_import_cancel}

Click Read Button
    Wait Until Element Is Enabled    ${btn_read_file}     30s   
    Click Element      ${btn_read_file}

################################
# Actions that cover workflows #
################################
Add Devices To The Opened Project
    [Documentation]  Searches for devices within the given range and adds all found ones to the opened project
    [Arguments]  ${start_range}  ${end_range}
    Click Add New Device Button
    Click Next Button
    Click Scan Settings
    Set IP Range  ${start_range}  ${end_range}
    Click Start Scan
    Wait Until Loading Is Finished
    Add All Found Devices

Add Protected Devices To The Opened Project
    [Documentation]  Searches for devices within the given range and adds all found ones to the opened project
    [Arguments]  ${start_range}  ${end_range}
    Click Add New Device Button
    Click Next Button
    Click Scan Settings
    Set IP Range  ${start_range}  ${end_range}
    Click Start Scan
    Wait Until Loading Is Finished
    Click Select All Devices
    Click Add Devices Button
    Wait Until Loading Is Finished

Click Enter Device Ip Address Manually
    Wait Until Element Is Visible  ${add_new_device_Manual_Entry_Tab_id}
    Click Element  ${add_new_device_Manual_Entry_Tab_id}

Add All Found Devices
    [Documentation]  Adds all found devices to the opened project
    Click Select All Devices
    Click Add Devices Button
    Wait Until Loading Is Finished
    Confirm Adding Devices Popup

Add All Found Devices for manual entry
    Click Add Devices Button
    Wait Until Loading Is Finished
    Confirm Adding Devices

Confirm Adding Devices
    Wait Until Element Is Visible  ${confirm_window_header}  error=Adding devices completed window is not visible
    Run Keyword And Ignore Error  Element Text Should Be  ${confirm_window_header}  Adding devices completed
    Confirm Popup

Confirm Adding Devices Popup
    Popup Should Be Visible  Adding devices completed  success
    Confirm Popup

Set IP Range Manual Entry
   [Arguments]  ${device_ip}
   Click Enter Device Ip Address Manually
   Set IP Value For Manual Entry Text Field  ${device_ip}

Set IP Value For Manual Entry Text Field
    [Arguments]  ${device_ip}
    Wait Until Element Is Visible  ${add_new_device_Manual_Entry_Text_Field_id}
    Click Element  ${add_new_device_Manual_Entry_Text_Field_id}
    Input Text  ${add_new_device_Manual_Entry_Text_Field_id}  ${device_ip}

Click Connect Button Manual Entry
    Wait Until Element Is Enabled  ${btn_addNewDeviceManualConnect}    10s
    Click Element  ${btn_addNewDeviceManualConnect}


Add Devices Through Manual Entry
    [Arguments]  ${IP_Value_Manual}
    Set IP Range Manual Entry  ${IP_Value_Manual}
    Click Connect Button Manual Entry
    Add All Found Devices for manual entry

Select a device to delete
    [Arguments]  ${header}
    Wait Until Element Is Visible  ${header}
    Click Element  ${header}

click the delete icon
    Wait Until Element Is Enabled  ${delete_device_Ok_btn}   10s
    Click Button  ${delete_device_Ok_btn}

click ok in the delete device popup
    Wait Until Element Is Enabled  ${ok_button_delete_device_popup}   10s
    Click Button  ${ok_button_delete_device_popup}

Add Devices Through Manual Entry for protected device
    [Documentation]    It will add the protected device to the project of the ip provided
    [Arguments]  ${IP_Value_Manual_Protected}
    Set IP Range Manual Entry  ${IP_Value_Manual_Protected}
    Click Connect Button Manual Entry
    Click Add Devices Button

Delete the device
    Select a device to delete    ${delete_device_header}
    click the delete icon
    click ok in the delete device popup

Fill Password Values For Protected Fields Add Device
    [Documentation]    It will fill the passowrd and confirm password to make the project protected
    [Arguments]  ${Write_Password}  ${Confirm_Write_Password}=${None}

    Wait Until Element Is Visible  ${add_new_device_password_field}   5s
    Input Text  ${add_new_device_password_field}  ${Write_Password}
     IF  $Confirm_Write_Password is not $None
        Input Text  ${add_new_device_confirm_password_field}  ${Confirm_Write_Password}
    END
    Wait Until Element Is Enabled  ${btn_protect_project_setuppassword}   5s
    Click Button  ${btn_protect_project_setuppassword}


Fill The Automation Component Credentials To Authenticate
    [Documentation]    It will authenticate the automation component based on device username ans password
    [Arguments]  ${Ac_username}  ${Ac_password}=${None}
    Wait Until Element Is Visible  ${deviceUserName}
    Clear Text Field    ${deviceUserName}
    Input Text  ${deviceUserName}  ${Ac_username}
     IF  $Ac_password is not $None
        Clear Text Field    ${devicePassword}
        Input Text  ${devicePassword}  ${Ac_password}
    END
    Add Protected Device To The Project

Import a device nodeset file
    [Documentation]    It will add device in import mode
    [Arguments]    ${devicefilename}       ${deviceName}= ${None}        ${deviceAddress}= ${None}
      Click Add New Device Button
      Add New Device Dialog Should Be Visible
      Select Import Devices Radio Option
      Click Next Button
      Wait Until Element Contains    ${DialogueBoxHeader}     Add new device
      Import a file      ${devicefilename}
      Click Read Button
      IF   $deviceName is not $None
          Import device details fillup    ${deviceName}
      END
      IF    $deviceAddress is not $None
          Import device details fillup     ${None}       ${deviceAddress}
      END
      Click Add Devices Button
      

Import device details fillup
    [documentation]    This keyword will be used to Fill up the devices details in the import table

    [Arguments]        ${NAME}=${None}    ${IP}=${None}
    ${Check_box} =    Get Element Count  ${green_check}
     FOR   ${i}   IN RANGE      ${Check_box}
          ${Row_no}=    Evaluate  int(${i} + 1)
          IF  $NAME is not $None
               ${device_name_column} =        Replace Variables    ${device_name_column}
               Input Text   ${device_name_column}       ${NAME}
          END
          IF  $IP is not $None
              ${device_address_column} =     Replace Variables    ${device_address_column}
               Input Text   ${device_address_column}    ${IP}
          END
     END

 Update a device with new IP address
     [Arguments]    ${new_IP_address}= ${None}
          IF  $new_IP_address is not $None
              Input Text    ${all_devices_IP}    ${new_IP_address}
              Click Element    ${device_card_body}
          END
          Click Update device button
          Wait Until Loading Is Finished


Fill The devices Credentials To Authenticate
    [Documentation]    It will authenticate the automation component based on device username ans password
    [Arguments]  ${Ac_username}  ${Ac_password}=${None}
    Wait Until Element Is Visible  ${deviceUserName}
    Input Text  ${deviceUserName}  ${Ac_username}
     IF  $Ac_password is not $None
        Input Text  ${devicePassword}  ${Ac_password}
    END
    Click Login To Authenticate Automation Component

    

Click Update device button
    Wait Until Element Is Visible     ${btn_update_device}
    Click Element    ${btn_update_device}


Update to secured device for protected project
    [Arguments]    ${New_IP_Address}= ${None}
          IF  $New_IP_Address is not $None
              Input Text    ${all_devices_IP}    ${New_IP_Address}
              Click Element    ${device_card_body}
          END
          Click Update device button
          Wait Until Page Contains Element  ${Device_credentail_POPUP}    
          Fill The devices Credentials To Authenticate    user1    siemens123
          Wait Until Loading Is Finished

Update to secured device for non-protected project
     [Arguments]    ${New_IP_Address}= ${None}
          IF  $New_IP_Address is not $None
              Input Text    ${all_devices_IP}    ${New_IP_Address}
              Click Element    ${device_card_body}
          END
          Click Update device button
          Wait Until Page Contains Element  ${project_protection_POPUP}
          Confirm Popup
          Fill Password Values For Protected Fields Add Device    Test@123    Test@123
          Fill The devices Credentials To Authenticate   user1    siemens123 
          Wait Until Loading Is Finished
         
          









###########
# Asserts #
###########
All Added Devices Should Have New Flag
    @{device_statuses}=  Get WebElements  ${all_devices_device_status}
    FOR  ${device_status}  IN  @{device_statuses}
        Element Text Should Be  ${device_status}  New
    END

Add New Device Dialog Should Be Visible
    Wait Until Element Is Visible  ${add_new_device_dialog_header}  error=Add new device dialog is not visible
    Element Text Should Be  ${add_new_device_dialog_header}  Add new device

Number Of Found Devices Should Be
    [Arguments]  ${number}
    # If there are no hits, then the checkbox in the top left of the table is not available
    Wait Until Element Is Visible  ${add_new_device_dialog_select_all_devices}
    ${number_of_found_devices}=  Get Element Count  ${add_new_device_dialog_found_devices}
    Should Be Equal As Integers  ${number_of_found_devices}  ${number}

Select Online Devices Panel Should Be Visible
    Wait Until Element Is Visible  ${add_new_device_dialog_device_selector}

Select Online Devices Radio Option
    Wait Until Element Is Visible  ${add_new_device_dialog_header}
    Element Text Should Be  ${add_new_device_dialog_selected_device_mechanism}  ${ONLINE_RADIO_OPTION}

Select Import Devices Radio Option
    Wait Until Element Is Visible  ${add_new_device_dialog_header}
    click Element     ${import_device_radio_btn}
    Element Text Should Be  ${add_new_device_dialog_selected_device_mechanism}  ${IMPORT_RADIO_OPTION}

Number Of Remaining Devices In Device Page Should Be
     [Arguments]  ${number}
    ${number_of_found_devices}=  Get Element Count  ${delete_device_header}
    Should Be Equal As Integers  ${number_of_found_devices}  ${number}


deviceIP should present in devicepage
    [documentation]    This keyword will be used to verify the list of IP address added in the device page
    [Arguments]    @{IP_address}
    ${expected_IP_address}=    Create List     @{IP_address}
    ${actual_IP_address}=     Create List
    @{device_IP} =  Get WebElements     ${all_devices_IP}
    FOR  ${device_IP}  IN   @{device_IP}
         ${txt}=  Get Value    ${device_IP}
        Append To List     ${actual_IP_address}    ${txt}
    END
    Log Many    ${actual_IP_address}
    Log Many    ${expected_IP_address}
    Lists Should Be Equal    ${expected_IP_address}  ${actual_IP_address}   msg = Expected device IP list ${expected_IP_address} is not matching with Actual device IP list ${actual_IP_address}

Should throw an error like "Application Identifier is missing"
   Wait Until Element Is Visible   ${errorpop}  10s
   Page Should Contain Element     ${errorpop}

All Added Devices Should Have Updated Flag
    @{device_statuses}=  Get WebElements  ${all_devices_device_status}
    FOR  ${device_status}  IN  @{device_statuses}
        Wait Until Element Contains    ${device_status}    Updated
        Element Text Should Be  ${device_status}  Updated
    END


devices should present in devicepage
    [Arguments]    @{expected_name}
    ${expected_device_name}=    Create List     @{expected_name}
    ${i}=    Set Variable    0
        FOR    ${EXPECTED_NAME}    IN    @{expected_device_name}
               wait until page contains    ${EXPECTED_NAME}
               ${element_no}=    Evaluate    int(${i} + 1)
               ${devices_titles} =        Replace Variables    ${all_devices_titles}
               ${actual_name} =  Get Text  ${devices_titles}
               Should Be Equal As Strings  ${actual_name}    ${EXPECTED_NAME}
               ${i}=    Evaluate    int(${i} + 1)
        END

device popup and device should not be present in the devicepage
    Popup Should Not Be Visible     Add selected devices to the project    success
    Popup Should Not Be Visible     Adding devices completed     success
    Device Container should not be visible


        




 Device Grid Text Should Be
     [Arguments]  ${gridText}
     ${gridTextValue}=    get text    ${cancel_scan_grid_text}
     Should Be Equal as Strings    ${gridTextValue}   ${gridText}



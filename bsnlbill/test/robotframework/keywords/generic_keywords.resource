*** Settings ***
Resource   ../resources/imports.resource
Variables  ../resources/generic_elements_locators.py
Resource    ../keywords/project_helpers.resource
Resource    ../keywords/settings_page_helpers.resource
Resource    ../keywords/generic_keywords.resource

*** Keywords ***
Confirm Import Device Popup
    [Documentation]  Closes the open popup window with 'ok|yes' button.
    Wait Until Element Is Not Visible  ${confirm_add_device_Cancel_button}  20s
    Wait Until Element Is Visible  ${confirm_add_device_button}  30s
    Click Button  ${confirm_add_device_button}

Cancel Import Device Popup
     [Documentation]    Closes the open popup with 'cancel' button
     Wait Until Element Is Visible    ${confirm_add_device_Cancel_button}    20s
     Click Button    ${confirm_add_device_Cancel_button}

Confirm Popup
    [Documentation]  Closes the open popup window with 'ok|yes' button.
    Wait Until Element Is Visible  ${confirm_window_ok_button}
    ClickButton  ${confirm_window_ok_button}

Discard Popup
    [Documentation]  Closes the open popup window with 'no' button.
    Wait Until Element Is Visible  ${confirm_window_no_button}  5s
    Click Button  ${confirm_window_no_button}

Popup Should Be Visible
    [Documentation]  Waits for popup with `header_text` to appear.
    ...
    ...    If `icon` is given, then checks the icon on the popup. Values can be: 'success', 'confirm'.
    ...    On any other value the keywords fails.
    ...
    ...    If `description` is given, then checks the text of the description on the popup.
    [Arguments]  ${header_text}  ${icon}=${None}  ${description}=${None}
    &{icons_mapping}=  Create Dictionary
    ...    success=${confirm_window_success_icon}
    ...    confirm=${confirm_window_confirm_icon}
    ...    error=${confirm_window_error_icon}
    Wait Until Element Is Visible  ${confirm_window_header}  error=${header_text} popup is not visible 10s
    Element Text Should Be  ${confirm_window_header}  ${header_text}
    Wait Until Element Is Visible  ${confirm_window_ok_button}  2s
    IF  $icon is not None
        ${icon}=  Set Variable  ${icons_mapping}[${icon}]
        Wait Until Element Is Visible  ${icon}
    END
    IF  $description is not None
        Element Text Should Be  ${confirm_window_description}  ${description}
    END

Wait Until Loading Is Finished
    [Documentation]  Waits for spinner to appear and after that to disappear within `timeout` time.
    [Arguments]  ${timeout}=30s
    #Wait Until Element Is Visible  ${spinner} 1s
    Wait Until Element Is Not Visible  ${spinner}  ${timeout}

WebElement Text Should Be
    [Documentation]  Iterates through WebElements and fails if none has the desired text
    [Arguments]  ${text}  ${elements_locator}  ${msg}=None of the webelements has text:
    Wait Until Element Is Visible  ${elements_locator}
    @{elements}=  Get WebElements  ${elements_locator}
    FOR  ${element}  IN  @{elements}
        ${element_text}=  Get Text  ${element}
        IF  "${element_text}" == "${text}"  RETURN
    END
    Fail  msg=${msg} ${text}

WebElement Text Should Not Be
    [Documentation]  Iterates through WebElements and fails if  it found the the desired text
    [Arguments]  ${text}  ${elements_locator}  ${msg}=None of the webelements has text:
   # Wait Until Element Is Visible  ${elements_locator}
    ${present}=  Run Keyword And Return Status    Element Should Be Visible   ${elements_locator}
    IF  ${present}
            @{elements}=  Get WebElements  ${elements_locator}
            FOR  ${element}  IN  @{elements}
                ${element_text}=  Get Text  ${element}
                IF  "${element_text}" == "${text}"  Fail  msg=${msg} ${text}
            END
      ELSE
        RETURN
     END

Click Delete Icon
    [Documentation]    Delete the AC's, Connection lines in Editor page and delete the devices in the device page
    Click Element  ${delete_icon}


Element Should Not Be Clickable
   [Documentation]    To check whether the element is clickable or not
    [Arguments]   ${element}
     ${status}=    Run Keyword And Return Status    Click Element    ${element}
    Run Keyword If    'True'=='${status}'    Fail    "Element should not be clickable"


Close Error Popup
    Wait Until Element Is Visible  ${close_error_popup}
    Click Button  ${close_error_popup}


WebElement should contain Text
    [Documentation]  Iterates through WebElements and fails if none contains the text 
    [Arguments]  ${elements_locator}    ${text}  ${msg}=None of the webelements has text:
    Wait Until Element Is Visible  ${elements_locator}
    @{elements}=  Get WebElements  ${elements_locator}
    FOR  ${element}  IN  @{elements}
        ${element_text}=  Get Value  ${element}
        IF  "${element_text}" == "${text}"  RETURN
    END
    Fail  msg=${msg} ${text}

Popup Should Not Be Visible
    [Documentation]  Waits for popup to disappear.
    ...
    ...    If `icon` is given, then checks the icon on the popup. Values can be: 'success', 'confirm'.
    ...    On any other value the keywords fails.
    ...
    ...    If `description` is given, then checks the text of the description on the popup.
    [Arguments]  ${header_text}  ${icon}=${None}  
    &{icons_mapping}=  Create Dictionary
    ...    success=${confirm_window_success_icon}
    ...    confirm=${confirm_window_confirm_icon}
    ...    error=${confirm_window_error_icon}
    Wait Until Element Is Not Visible  ${confirm_window_header}     2s      error=${header_text} popup is visible 

    Wait Until Element Is Not Visible  ${confirm_window_ok_button}
    IF  $icon is not None
        ${icon}=  Set Variable  ${icons_mapping}[${icon}]
        Wait Until Element Is Not Visible  ${icon}  10s
    END


Device Container should not be visible
       Element Should Not Be Visible    ${device_card_container}    20s

######## Action Flow #######

Close and Delete Protected Project
       [Arguments]    ${name}
            Close project
            Delete Protected Project     ${name}    Test@123

close and Open given project
     [Arguments]    ${name}
     Close project
     Opened Project   ${name}

Opened Project
  [Arguments]    ${name}
        Select the project  ${name}
        Click open project button

Create Project and Setup Write Password For Project
    [Documentation]  Creates the project with the project name given in the argument and set the write access password for the project.
    [Arguments]   ${project_name}
    Create Project With Given Project Name    ${project_name}
    Project Should Be In The Project List With OPENED Label    ${project_name}
    SetUp Write Password For Project
    
SetUp Write Password For Project
    Go To Settings Page
    Click Setup Write Password Button
    Password Popup Should Be Visible    Set password for write access
    Fill New Password Field    Test@123
    Fill The Confirm Password Field   Test@123
    Click Setup Password button
    Checkbox Should Be Selected  ${setup_write_password}
    Click Save Project button

Setup Read Password For Project
    [Documentation]  Set the read access password for the project
    Click Setup Read Password
    Password Popup Should Be Visible    Set password for read access
    Fill New Password Field    Test@1234
    Fill The Confirm Password Field   Test@1234
    Click Setup Password button
    Click Save Project button


Import Protected project
     [Arguments]    ${Project_file}    ${Password}
         Click Import Button
         Import a file   ${Project_file}
         Click yes option
         Fill Password Field   ${password}
         Click Open Protected Project button
         Wait Until Element Is Not Visible  ${password_for_open_project}   10s

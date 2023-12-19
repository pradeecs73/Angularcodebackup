*** Settings ***
Documentation    Keywords intended to be used in testcases
Variables    ../resources/settings_page_locators.py
Variables    ../resources/generic_elements_locators.py
Resource    ../keywords/project_helpers.resource

*** Keywords ***

Click Setup Write Password Button
    Wait Until Element Is Visible    ${setup_write_password}
    Click Element     ${setup_write_password}

Password Popup Should Be Visible
    [Arguments]    ${title}
    Wait Until Element Is Visible  ${popup_header}  error=New Project dialog is not visible
    Element Text Should Be  ${popup_header}   ${title}

Fill the Old Password Field
    [Arguments]   ${value}
    Wait Until Element Is Visible  ${old_password}
    Input Text  ${old_password}  ${value}

Fill New Password Field
    [Arguments]   ${value}
    Wait Until Element Is Visible  ${setup_password}
    Input Text  ${setup_password}  ${value}

Fill The Confirm Password Field
    [Arguments]   ${value}
    Wait Until Element Is Visible  ${confirm_password}
    Input Text  ${confirm_password}  ${value}

Project Should Be Protected
    [Arguments]   ${project_name}   ${class_name}
    ${protected_project}=  Replace Variables  ${protected_project}
    Wait Until Element Is Visible  ${protected_project}
    Wait until page contains element  ${protected_project} .${class_name}

Project Should Not Be Protected
    [Arguments]   ${project_name}   ${class_name}
    ${protected_project}=  Replace Variables  ${protected_project}
    Wait Until Element Is Visible  ${protected_project}
    Wait Until Page Does Not Contain Element  ${protected_project} .${class_name}

Click Setup Password button
    Wait Until Element Is Visible  ${btn_setupPassword}  10s
    Click Button    ${btn_setupPassword}

Click Save Project button
    Wait Until Element Is Visible  ${save_project}   10s
    Click Element    ${save_project}

Click Change Write Password
    Wait Until Element Is Visible  ${btn_change_write_password}
    Click Button    ${btn_change_write_password}

Click Setup Read Password
    Wait Until Element Is Visible  ${btn_setup_read_password}
    Click Button    ${btn_setup_read_password}

Click Change Read Password
    ${buttons}=  Get WebElements  ${btn_setup_read_password}
    Wait Until Element Is Visible  ${buttons[1]}
    Click Button    ${buttons[1]}

Remove Read Password Should Be Enabled
    ${buttons}=  Get WebElements  ${btn_setup_read_password}
    Wait Until Element Is Visible  ${buttons[1]}   10s
    Element Should Be Enabled  ${buttons[1]}

Click Remove Read Password
    ${buttons}=  Get WebElements  ${btn_setup_read_password}
    Wait Until Element Is Visible  ${buttons[0]}   10s
    Click Button    ${buttons[0]}

Password Validation Should Match
    [Documentation]  Checks if the class 'tick-size' contains the 'tick-success' class
    ...    index value  1 : 8 characters minimum
    ...    index value 2 : Upper case character
    ...    index value 3 : Lower case character
    ...    index value 4 : Special character
    ...    index value 5 : Password must check
    [Arguments]   ${index}
    ${password_validations_success}=  Replace Variables  ${password_validations_success}
    Wait Until Element Is Visible  ${password_validations_success}
    Wait until page contains element  ${password_validations_success}

Password Validation Should Not Match
    [Documentation]  Checks if the class 'tick-size' contains the 'tick-default' class
    ...    index value  1 : 8 characters minimum
    ...    index value 2 : Upper case character
    ...    index value 3 : Lower case character
    ...    index value 4 : Special character
    ...    index value 5 : Password must check
    [Arguments]   ${index}
    ${password_validations_error}=  Replace Variables  ${password_validations_error}
    Wait Until Element Is Visible  ${password_validations_error}
    Wait until page contains element  ${password_validations_error}

Set Password Button Should Be Disabled
    Wait Until Element Is Visible  ${btn_setup_disabled}
    Wait until page contains element  ${btn_setup_disabled}

Password Popup Should Not Be Visible
    Wait Until Element Is Not Visible  ${popup_header}

Password For Write Access Should Be Disabled
    Wait Until Element Is Visible  ${input_field_write_password}  3s
    Element Should Be Disabled  ${input_field_write_password}

Password For Read Access Should Be Disabled
    Wait Until Element Is Visible  ${input_field_read_password}  3s
    Element Should Be Disabled  ${input_field_read_password}

Check Show Password
    ${password_txt_type_password}   get element attribute   ${setup_password}   type
    ${confirm_password_txt_type_password}   get element attribute   ${confirm_password}    type
    Log   ${password_txt_type_password}
    Should Be Equal as Strings    ${password_txt_type_password}    password
    Should Be Equal as Strings    ${confirm_password_txt_type_password}    password
    Wait Until Element Is Visible    ${checkbox_show_password}
    Click Element     ${checkbox_show_password}
    ${password_txt_type_text}   get element attribute   ${setup_password}    type
    ${confirm_password_txt_type_text}   get element attribute   ${confirm_password}    type
    Should Be Equal as Strings    ${password_txt_type_text}    text
    Should Be Equal as Strings    ${confirm_password_txt_type_text}    text

Should throw an error message
    [Arguments]   ${errorMsg}
    Wait Until Element Is Visible  ${errorSpan}  10s
    ${error_message}=  Get Text  ${errorSpan}
    Should Be Equal As Strings  ${errorMsg}  ${error_message}

Password Validation
    Fill New Password Field    Test
    Password Validation Should Match   2
    Password Validation Should Match   3
    Password Validation Should Not Match  1
    Password Validation Should Not Match  4
    Set Password Button Should Be Disabled
    Fill New Password Field    TEST@123
    Password Validation Should Match   1
    Password Validation Should Match   2
    Password Validation Should Match   4
    Password Validation Should Not Match  3
    Set Password Button Should Be Disabled
    Fill New Password Field    test@123
    Password Validation Should Match   1
    Password Validation Should Match   3
    Password Validation Should Match   4
    Password Validation Should Not Match  2
    Set Password Button Should Be Disabled
    Fill New Password Field    Test@123
    Fill The Confirm Password Field   Test@12
    Password Validation Should Not Match  5
    Set Password Button Should Be Disabled
Change Password Validations
    [Documentation]  Checks for the error message by entering the old password,new password,confirm password
    [Arguments]   ${old_password}  ${new_password}   ${confirm_password}   ${error_message}
    Fill the Old Password Field  ${old_password}
    Fill New Password Field    ${new_password}
    Fill The Confirm Password Field   ${confirm_password}
    Click Setup Password button
    Should throw an error message    ${error_message}

Create project and go to settings page
    [Arguments]   ${project_name}
    Create Project With Given Project Name    ${project_name}
    Project Should Be In The Project List With OPENED Label    ${project_name}
    Go To Settings Page
    Password For Write Access Should Be Disabled
    Password For Read Access Should Be Disabled
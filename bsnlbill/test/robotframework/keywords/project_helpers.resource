*** Settings ***
Resource   ../resources/imports.resource
Resource   ../keywords/generic_keywords.resource
Resource   ../keywords/ui_navigation.resource
Variables  ../resources/plant_editor_page_locators.py
Resource    ../keywords/connection_keywords.resource
Library      file.py
Library      general.py


*** Variables ***
${uploadfile}=    src\\SimaticLiveLink\\frontend\\Robotframework\\Resources\\TestData\\Importtest.yaml
${before_save}=    null
${editorPageUrl}=   https://localhost/#/editor

*** Keywords ***
#################
# Basic actions #
#################
Click Close Project Button
    Wait Until Element Is Visible  ${button_opened_project_3dot}
    Click Element  ${button_opened_project_3dot}
    Wait Until Element Is Visible  ${button_opened_project_3dot} >> ${opened_project_close_project_menuitem}
    Click Element  ${button_opened_project_3dot} >> ${opened_project_close_project_menuitem}

Click Save As Project Button
    Wait Until Element Is Visible  ${button_opened_project_3dot}  10s
    Wait Until Element Is Enabled  ${button_opened_project_3dot}
    Click Element  ${button_opened_project_3dot}
    Wait Until Element Is Visible  ${button_opened_project_3dot} >> ${opened_project_save_as_project_menuitem}   10s
    Click Element  ${button_opened_project_3dot} >> ${opened_project_save_as_project_menuitem}

Click Export Project
    Wait Until Element Is Visible  ${button_opened_project_3dot}
    Click Element  ${button_opened_project_3dot}
    Wait Until Element Is Visible  ${button_opened_project_3dot} >> ${opened_project_export_project_menuitem}
    Wait Until Element Is Enabled  ${button_opened_project_3dot} >> ${opened_project_export_project_menuitem}
    Click Element  ${button_opened_project_3dot} >> ${opened_project_export_project_menuitem}

Click Create Button
     [Documentation]  Clicks the 'Create' button on the 'Create new project' dialog
     Wait Until Element Is Visible  ${create_project_dialog_create_button}  10s
     Click Button  ${create_project_dialog_create_button}

Click Create New Project
    [Documentation]  Clicks the 'Create new project' button on LiveLink home page
    Wait Until Element Is Visible  ${button_create_project}    10s
    Click Element    ${button_create_project}

Click Delete Project Button
    Wait Until Element Is Visible  ${button_delete_project}
    Wait Until Element Is Enabled  ${button_delete_project}
    Click Element  ${button_delete_project}


Wait Until Project Is Closed
    Wait Until Page Contains Element  ${no_opened_project_panel}

################################
# Actions that cover workflows #
################################
Close And Delete The Opened Project
    [Documentation]  Closes the actually opened project and deletes it.
    [Arguments]  ${project_name}=${None}
    ${result}=  Run Keyword And Return Status    Element Should Be Visible   ${offline_status}
    log    ${result}
    ${url}=   Get Location
    log    ${url}
    ${url_status}=   Run Keyword And Return Status    Should Contain    ${url}   editor
    log  ${url_status}
    IF  not ${result} and ${url_status}
        Click Gooffline Button
    END
    
    ${closed_project_name}=  Close Project
    IF  '${closed_project_name}' != 'null'
        ${project_name}=   Set Variable  ${closed_project_name}
    END
    Delete Project  ${project_name}
    Project Should Not Be In the Project List  ${project_name}

Close Project
    [Documentation]  Closes the actually opened project and returns its name.
    ...    If no project was opened, then returns 'None'.
    [Arguments]  ${save_changes}=${False}
    ${is_dialogue_opened} =   Is Dialogue opened
    IF  ${is_dialogue_opened}
        Click Element     ${close_dialog}
    END
    Go To Home Page
    ${is_project_opened}=  Is Project Opened
    IF  not ${is_project_opened}  RETURN  null
    ${project_name}=  Get Project Name
    Click Close Project Button
    ${popup}=    Run Keyword And Return Status  Element Should Be Visible   ${confirm_window_header}

    IF  ${popup}  
        Popup Should Be Visible  Close project  confirm
        IF  ${save_changes}
            Confirm Popup
        ELSE
            Discard Popup
        END
    END
    Wait Until Project Is Closed
    RETURN  ${project_name}

click Import button
    Wait Until Element Is Visible  ${btn_import}
     Click Element    ${btn_import}

Import a file
     [Arguments]    ${filename}
     ${full_path}=    file.abs_path    ${filename}
     Click Element   ${uploadBtn}
     general.Open_file    ${full_path}


Create Project
    [Documentation]  Creates LiveLink project with the given parameters
    [Arguments]  ${name}  ${comment}=${None}  ${author}=${None}
    Open Home Page
    Click Create New Project
    Fill Project Values  ${name}  ${comment}  ${author}
    Click Create Button
    Wait Until Element Is Not Visible  ${create_project_dialog_header}
    Project Should Be In The Project List With OPENED Label    ${name}

Delete Project
    [Documentation]  Deletes `project_name` project on home page.
    ...    If `project_name` is 'None', then does nothing.
    [Arguments]  ${project_name}
    IF  $project_name is None  RETURN
    Select the project  ${project_name}
    Log    ${project_name}
    Click Delete Project Button
    Popup Should Be Visible  Delete project  confirm
    Confirm Popup
    Wait Until Element Is Not Visible   ${confirm_window_description}  3s

Fill Project Values
    [Arguments]  ${name}  ${comment}=${None}  ${author}=${None}
    Wait Until Element Is Visible  ${create_project_dialog_name_field}
    IF  $name is not $None
        Clear Text Field  ${create_project_dialog_name_field}
        Wait Until Element Is Enabled    ${create_project_dialog_name_field}
        Input Text  ${create_project_dialog_name_field}  ${name}
    END
    IF  $comment is not $None
        Clear Text Field  ${create_project_dialog_comment_field}
        Input Text  ${create_project_dialog_comment_field}  ${comment}
    END
    IF  $author is not $None
        Clear Text Field  ${create_project_dialog_author_field}
        Input Text  ${create_project_dialog_author_field}  ${author}
    END


Clear Text Field
    [Arguments]  ${inputField}
    press keys  ${inputField}  CTRL+a+BACKSPACE
    Wait Until Element Contains    ${inputField}   ${EMPTY}

Fill Password Field
    [Arguments]  ${password}
    Wait Until Element Is Visible  ${password_for_open_project}
    Clear Text Field  ${password_for_open_project}
    Input Text  ${password_for_open_project}  ${password}

click Cancel button
    Click Button    ${btn_cancel}

Click Open Protected Project button
    Wait Until Element Is Visible     ${btn_open_or_delete_ProtectedProject}
    Click Button    ${btn_open_or_delete_ProtectedProject}

Click Delete Protected Project button
    Click Button    ${btn_open_or_delete_ProtectedProject}


Import project                                       #Need to fix the issue
    Click Element    ${btn_import}
    Wait Until Element Contains    ${DialogueBoxHeader}     Import project
    Choose File     ${fileSelect}    ${uploadfile}
    Sleep    5s

Get the Last Changed Date
    [Arguments]    ${name}
    ${project_last_changed_date}=  Replace Variables  ${project_last_changed_date}
    ${before_save}=  Get Text  ${project_last_changed_date}

Click Export project button
    Click Element     ${moreOption}
    Click Element     ${btn_exportProject}
    Wait Until Element Contains    ${DialogueBoxHeader}     Export project
    Click Button    ${btn_yes}

Click create button from Create Project Popup
    Click Create Button
    Wait Until Element Is Not Visible  ${create_project_dialog_header}


Click edit project button
    Click Element    ${btn_edit}

Click open project button
    Click Element   ${btn_openProject}

Click no option
    Wait Until Element Is Visible     ${btn_no}  3s
    Click Button   ${btn_no}

Click yes option
    Wait Until Element Is Visible     ${btn_ok}
    Click Button   ${btn_ok}
    Wait Until Element Is Not Visible  ${btn_ok}  3s

click Save from SaveAs Popup for protected device
    Click create button

click without save option
    Click no option

click with save option
    Click yes option


Click Save Option
    Wait Until Element Is Visible     ${button_opened_project_save_project}
    Click Button   ${button_opened_project_save_project}

###Asserts##
Project was saved successfully
    [Arguments]    ${name}
    ${project_last_changed_date}=  Replace Variables  ${project_last_changed_date}
    ${after_save}=  Get Text  ${project_last_changed_date}
    Should Not Be Equal   ${after_save}   ${before_save}

Project Should Be In The Project List With OPENED Label
    [Arguments]    ${name}
    ${projectSelect}=  Replace Variables  ${projectSelect}
    Element Should be visible    ${projectSelect}
    # Element Should Contain   ${projectList}     OPENED
    Wait Until Page Contains Element  ${opened_project_container}

Project Should Be In The Project List Without OPENED Label
    [Arguments]    ${Name}
    Element Should Contain    ${projectList}    ${Name}
    Wait Until Page Does Not Contain Element   ${opened_project_container}
    Element Should Not Contain   ${projectList}     OPENED

Project Should Not Be In the Project List
    [Documentation]  Checks if the project is present in the project list or not.
    [Arguments]    ${name}
    ${projectSelect}=  Replace Variables  ${projectSelect}
    Wait Until Element Is Not Visible   ${projectSelect}  3s
    Element Should Not Contain    ${projectList}    ${name}

Create new project dialogue box should POP-UP
    Wait Until Element Is Visible     ${DialogueBoxHeader}
    Element Text Should Be          ${DialogueBoxHeader}     Create new project

Project Should Be In the Project List
    [Documentation]  Checks if the project is present in the project list or not.
    [Arguments]    ${name}
    ${projectSelect}=  Replace Variables  ${projectSelect}
    Wait Until Element Is Visible   ${projectSelect}
    Wait Until Page Contains Element  ${opened_project_container}
Create button should be disabled
    Element Should Be Disabled      ${btn_create}

Import project dialogue box should POP-UP
    Wait Until Element Is Visible    ${DialogueBoxHeader}
    Element Text Should Be          ${DialogueBoxHeader}     Import project

Exported file should be present in download folder
    [Arguments]    ${filename}
    Sleep    5s
    ${user_home}=    Get Environment Variable    UserProfile
    File Should Exist    ${user_home}\\downloads\\${filename}.yaml

Save as dialogue box should POP-UP
    Wait Until Element Is Visible    ${DialogueBoxHeader}
    Element Text Should Be    ${DialogueBoxHeader}    Save project as

Should throw an error like "project name is not unique please rename the project"
   Wait Until Element Is Visible    ${errorpop}   10s
   Page Should Contain Element     ${errorpop}

Save button should be disabled
    Element Should Be Disabled      ${create_project_dialog_create_button }


###########
# Helpers #
###########
Get Project Name
    ${project_name}=  Get Text  ${opened_project_container} >> ${opened_project_header}
    RETURN  ${project_name}

Is Project Opened
    ${is_project_opened}=  Run Keyword And Return Status  Wait Until Page Contains Element  ${opened_project_container}  5s
    RETURN  ${is_project_opened}

Is Dialogue opened
     ${is_dialogue_opened}=  Run Keyword And Return Status  Wait Until Page Contains Element     ${DialogueBoxHeader}     1s
     RETURN     ${is_dialogue_opened}

###########
# Asserts #
###########
Author Field Should Be Visible
    Wait Until Element Is Visible  ${create_project_dialog_author_field}

Comment Field Should Be Visible
    Wait Until Element Is Visible  ${create_project_dialog_comment_field}

Create New Project Dialog Should Be Closed
    Wait Until Element Is Not Visible  ${create_project_dialog_header}

Create New Project Dialog Should Be Visible
    Wait Until Element Is Visible  ${create_project_dialog_header}  error=New Project dialog is not visible
    Element Text Should Be  ${create_project_dialog_header}  Create new project

Password Verification Dialog Should Be Closed
    Wait Until Element Is Not Visible  ${password_verification_popup}

Password Verification Dialog Should Be Visible
    [Arguments]    ${title}
    ${password_validation_modal_title}=     Replace Variables  ${password_validation_modal_title}
    Wait Until Element Is Visible  ${password_validation_modal_title}  error=New Project dialog is not visible
    Element Text Should Be  ${password_validation_modal_title}  ${title}

Project Name Field Should Be Visible
    Wait Until Element Is Visible  ${create_project_dialog_name_field}

# Project Should Be In The Project List With OPENED Label
#     [Arguments]  ${project_name}
#     Wait Until Element Is Visible  ${project_list_table}
#     ${project_in_project_list}=  Replace Variables  ${project_in_project_list}
#     Wait Until Element Is Visible  ${project_in_project_list}
#     ${opened_project_in_project_list}=  Replace Variables  ${opened_project_in_project_list}
#     Element Text Should Be  ${opened_project_in_project_list}  OPENED

Save Project Button Should Be Disabled
    Wait Until Element Is Visible  ${button_opened_project_save_project}
    Element Should Be Disabled  ${button_opened_project_save_project}

Delete Protected Project
    [Arguments]    ${project_name}  ${password}
    Delete Project     ${project_name}
    Password Verification Dialog Should Be Visible   Delete protected project
    Fill Password Field   ${password}
    Click Delete Protected Project button
    Project Should Not Be In the Project List  ${project_name}

Check Project Last Modification Time
      [Arguments]    ${project_name}
     ${project_lastmodified_date_time}=  Replace Variables  ${project_lastmodified_date_time}
     ${table_value}=  Get Text  ${project_lastmodified_date_time}
     ${CurrentDate}=  Get Current Date   result_format=/%Y
     Should Contain    ${table_value}   ${CurrentDate}

*** Settings ***
Resource   ../resources/imports.resource
Variables  ../resources/generic_elements_locators.py
Resource   ../keywords/common.resource
*** Variables ***

${BASEURL}=                  https://localhost/
${DEVICE_PLANT_VIEW_PAGE}=  ${BASEURL}#/editor
${DEVICE_TREE_PAGE}=        ${BASEURL}#/devices
${HOME_PAGE}=               ${BASEURL}#/home
${SETTINGS_PAGE}=               ${BASEURL}#/settings

&{SELENIUM SERVER LIST}=    localhost=${BASEURL}    gitlab=%{SELENIUM_SERVER_PATH=<setme>}


*** Keywords ***
Open Browser For Test
    ${variables}=  Get variables
    IF  "\${SELENIUM SERVER}" in $variables
        &{browser_exec_mode}=  Create Dictionary  remote_url=${SELENIUM SERVER LIST}[${ENV}]
    ELSE
        &{browser_exec_mode}=  Create Dictionary  executable_path=${DRIVER PATH}
    END
    Open Browser  ${HOME_PAGE}  ${BROWSER}  &{browser_exec_mode}
    Maximize Browser Window

Go To Device Tree Page
    Wait Until Element Is Visible   ${menu}   10s
    Navigate To LiveLink Page  ${side_menu_device_tree_icon}  ${DEVICE_TREE_PAGE}

Go To Home Page
    ${url}=  Get Location
    IF  '${url} !== ${HOME_PAGE}'
         Navigate To LiveLink Page  ${side_menu_home_icon}  ${HOME_PAGE}
         Wait Until Location Is  ${HOME_PAGE}
    END

Go To Plant View Page
    Navigate To LiveLink Page  ${side_menu_plant_view_icon}  ${DEVICE_PLANT_VIEW_PAGE}

Go To Settings Page
    Navigate To LiveLink Page  ${side_menu_settings_icon}  ${SETTINGS_PAGE}

Navigate To LiveLink Page
    [Arguments]  ${side_menu_locator}  ${expected_url}
    Wait Until Element Is Visible   ${side_menu_locator}  10s
    ${do_click}=  Run Keyword And Return Status  Page Should Contain Element  ${side_menu_locator}
    IF  ${do_click}
        Wait Until Element Is Enabled   ${side_menu_locator}
        Click Element  ${side_menu_locator}
    END
    Wait Until Location Is  ${expected_url}  10s

Open Home Page
    Go To  ${HOME_PAGE}
    # Page reload gives an alert window
    Run Keyword And Ignore Error  Handle Alert  timeout=1s
    Wait Until Location Is  ${HOME_PAGE}

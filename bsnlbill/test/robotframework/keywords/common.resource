*** Settings ***
Resource     ../resources/imports.resource
Resource     ../keywords/add_device_helpers.resource
Resource     ../keywords/PLC_scim.resource
Variables    ../resources/home_page_locators.py
Library    OperatingSystem
Library    DateTime

*** Variables ***
${baseUrl}=         https://localhost/
${homePageUrl}=     ${baseUrl}#/home
${devicePageUrl}=   ${baseUrl}#/devices
${editorPageUrl}=   ${baseUrl}#/editor
${dir}=             src\\SimaticLiveLink\\frontend\\Robotframework\\Resources\\download



*** Keywords ***
Launch Application in chrome browser with no project
    [documentation]    This keyword will launch the SIMATICLiveLink application in the chrome browser in headless mode with fixed windows size
    [Arguments]    ${name}=${None}   ${browserMode}=headlesschrome
    Delete Project from Project root folder     ${name}
    OPEN BROWSER        ${homePageUrl}      ${browserMode}
    Set Window Size    1800    1600
    Wait Until Element Is Enabled   ${btn_createNewProject}   10s

Click Create New project button
    Wait Until Element Is Visible    ${btn_createNewProject}
    Click Element   ${btn_createNewProject}

Delete Project from Project root folder
    [Arguments]    ${name}=${None}
    Delete the projectfile    C:/ProgramData/Siemens/Automation/SIMATICLiveLink/Projects/${name}/${name}.yaml

Open Chrome browser in Incognito mode
    ${options}=    Evaluate  sys.modules['selenium.webdriver'].ChromeOptions()  sys, selenium.webdriver
    Call Method    ${options}    add_argument    incognito

    Create WebDriver    headlesschrome   alias=second   chrome_options=${options}
    Go To        ${homePageUrl}

    Set Window Size    1800    1600
    Wait Until Element Is Enabled   ${btn_createNewProject}   10s

Delete the projectfile
     [arguments]        ${filename}
     Log       ${filename}
     ${fileexist}=  file.File Exists    ${filename}
     run keyword if    ${fileexist}     Remove File     ${filename}


Select the project
    [Arguments]    ${name}
    ${projectSelect}=  Replace Variables  ${projectSelect}
    Wait Until Element Is Visible    ${projectSelect}
    Set Focus To Element    ${projectSelect}
    sleep  1s
    Click Element   ${projectSelect}
    ${projectSelected}=  Replace Variables  ${projectSelected}
    Wait Until Element Is Visible    ${projectSelected}

Delete the project
    Click Element    ${btn_deleteProject}
    Wait Until Element Contains    ${DialogueBoxHeader}    Delete project
    Click Button    ${btn_yes}

Create Project With Given Project Name
     [Arguments]    ${projectName}
     Create Project  ${projectName}


Launch application and create a Project
     [Arguments]    ${projectName}
     Launch Application in chrome browser with no project   ${projectName}
     Create Project With Given Project Name   ${projectName}


 Delete project and close browser
     [Arguments]    ${projectName}
     Delete Project  ${project_name}
     Remove Directory    C:/ProgramData/Siemens/Automation/SIMATICLiveLink/Projects    ${True}
     Close Browser

Clear Project folder and close browser
     Remove Directory    C:/ProgramData/Siemens/Automation/SIMATICLiveLink/Projects    ${True}
     close Browser

###Asserts####
Project should not contain OPEN label
    [Arguments]    ${name}
    ${projectSelect}=  Replace Variables  ${projectSelect}
    Element Should Not Contain   ${projectSelect}     OPENED

project should not be in projectlist
    [Arguments]    ${Name}
    Element Should Not Contain   ${projectList}    ${Name}


Create Project and Add Devices with Scan
    [Arguments]  ${project_name}  ${ip_range_start}   ${ip_range_end}
    Create New Project   ${project_name}
    Go To Device Tree Page
    Add Devices To The Opened Project  ${ip_range_start}  ${ip_range_end}

Create New Project
    [Arguments]  ${project_name}
    Delete Project from Project root folder     ${project_name}
    Create Project With Given Project Name    ${project_name}
    Project Should Be In The Project List With OPENED Label   ${project_name}

Turn ON PLC And Launch Application
  [Documentation]  Launching the project in the chrome and adding guest plc's to plcsim through keyword
  [Arguments]  @{ip_values_guest_plcs}
  Register and Start PLC Instance  @{ip_values_guest_plcs}
  sleep  20s
  Launch Application in chrome browser with no project

Switch off plc from PLCSim
   [Arguments]  @{ip_values_guests}
   Remove device from PLCSCIM   @{ip_values_guests}

Switch Off Plc And Close Browser
   [Documentation]  Switching off the guest plc's and and closing the browser
   [Arguments]  @{ip_values_guest_plcs}
   Switch off plc from PLCSim  @{ip_values_guest_plcs}
   close browser

Close And Delete The Opened Project And Start PLCs On Teardown
    [Arguments]    ${non_secured_plc1}    ${non_secured_plc2}
    ${result}=  Run Keyword And Return Status    Element Should Be Visible   ${offline_status}
    log    ${result}
    Close And Delete The Opened Project
    IF  not ${result}
        Power On Device    ${non_secured_plc1} 
        Power On Device    ${non_secured_plc2}  
        Sleep    10s
    END




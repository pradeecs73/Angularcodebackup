*** Settings ***
Resource   ../resources/imports.resource
Variables  ../resources/devices_page_locators.py
Variables  ../resources/generic_elements_locators.py
Variables  ../resources/area_operations_locators.py
Resource   ../keywords/ui_navigation.resource
Resource   ./../keywords/connection_helpers.resource
Resource   ./../keywords/connection_keywords.resource
Library     Collections

*** Variables ***
${automation_header}=  css:.header-box.node-header-online


*** Keywords ***
#################
# Basic actions #
#################

Click New Area Icon
   wait until element is visible   ${newarea_create_icon}
   Click Element    ${newarea_create_icon}

Create New Area
  Click New Area Icon

Created Area Should Be Visible In Connection Editor
      [Arguments]  ${area_name}
   WebElement Text Should Be  ${area_name}  ${area_names_on_canvas}  Area did not found on connection editor:


Created Area Should Be Present In left Menu
     [Arguments]  ${area_name}
   WebElement Text Should Be  ${area_name}  ${leftmenu_nodelabel}  Area did not found on left menu:

Create A New Area Inside Another Area
    [Documentation]  Creates a new area inside another area ,menu number is passes to
    ...    Select Particuler Menu From Left Menu to select particuler menu in left
    ...    menu and coresponding new area icon is clicked.
    [Arguments]  ${menu_number}  ${newareaicon_number}
    Select Particuler Menu From Left Menu    ${menu_number}
    ${nested_newareaicons} =    get webelements    ${newarea_create_icon_nested}
     wait until element is visible   ${nested_newareaicons[${newareaicon_number}]}  10s
     Click Element  ${nested_newareaicons[${newareaicon_number}]}


Deleted Area Should Not Be Visible In Connection Editor
      [Arguments]  ${area_name}
     WebElement Text Should Not Be  ${area_name}  ${area_names_on_canvas}  Area found on connection editor:

Deleted Area Should Not Be Present In left Menu
      [Arguments]  ${area_name}
     WebElement Text Should Not Be  ${area_name}  ${leftmenu_nodelabel}  Area found on left menu:

Delete A Nested Area
     [Documentation]  Deletes a parent area and its child areas,menu number is passes to
     ...    Select Particuler Menu From Left Menu to select particuler menu in left
     ...    menu and coresponding delete area icon is clicked.
      [Arguments]  ${menu_number}  ${deleteicon_number}
      Select Particuler Menu From Left Menu    ${menu_number}
      ${deletearea_icons} =    get webelements    ${deletearea_icon_nested}
        wait until element is visible   ${deletearea_icons[${deleteicon_number}]}    20s
        Click Element  ${deletearea_icons[${deleteicon_number}]}

        Wait Until Element Is Enabled    ${delete_device_editor_confirmation_btn}
        Click Button    ${delete_device_editor_confirmation_btn}

Ungroup A Nested Area
      [Documentation]  Ungroup a parent area ,menu number is passes to
      ...    Select Particuler Menu From Left Menu to select particuler menu in left
      ...    menu and coresponding ungroup area icon is clicked.
      [Arguments]  ${menu_number}   ${ungroup_icon_number}
      Select Particuler Menu From Left Menu    ${menu_number}

      ${ungroup_icons} =    get webelements    ${ungroup_icon_nested}
        wait until element is visible   ${ungroup_icons[${ungroup_icon_number}]}
        Click Element  ${ungroup_icons[${ungroup_icon_number}]}

        Wait Until Element Is Enabled    ${delete_device_editor_confirmation_btn}
        Click Button    ${delete_device_editor_confirmation_btn}

Ungrouped Area Should Not Be Visible In Connection Editor
     [Arguments]  ${area_name}
     WebElement Text Should Not Be  ${area_name}  ${area_names_on_canvas}  Area found on connection editor:

Ungrouped Area Should Not Be Present In left Menu
     [Arguments]  ${area_name}
     WebElement Text Should Not Be  ${area_name}  ${leftmenu_nodelabel}  Area found on left menu:

First Child Area Should Be Visible In Connection Editor
     [Arguments]  ${area_name}
     WebElement Text Should Be  ${area_name}  ${area_names_on_canvas}  Area did not found on connection editor:

First Child Area Should Be Present In left Menu
     [Arguments]  ${area_name}
   WebElement Text Should Be  ${area_name}  ${leftmenu_nodelabel}  Area did not found on left menu:

Select Particuler Menu From Left Menu
     [Documentation]  Selecting Particuler menu in left meny `menu_number` is the
     ...   the nember in the left menu which as to be selected
     [Arguments]  ${menu_number}
     ${menu_childrens} =    get webelements    ${leftmenu_children}
     wait until element is visible   ${menu_childrens[${menu_number}]}
     Click Element  ${menu_childrens[${menu_number}]}


Select Area And Drop Device To Area
      [Arguments]  ${menu_number}  ${automation_component}  ${x}  ${y}
      Select Particuler Menu From Left Menu    ${menu_number}
      Drop Device To Connection Editor  ${automation_component}  ${x}  ${y}

Drag Source Area Or Automation Component
      [Documentation]  Dragging area or automation component from source menu
      [Arguments]  ${element}
      Mouse Down  ${element}
      Mouse Out  ${element}
      Mouse Over  ${element}

Drop Draged Source Area Or Automation Component To Target Area
      [Documentation]  Dropping area or automation component to target menu
      [Arguments]  ${element}
      Mouse Over  ${element}
      Mouse Up  ${element}

Reorder AutomationComponent Or Area From One Area To Another Area
      [Documentation]  Reordering the automation component or area ,`source_menu_number` is
      ...    the menu from where we are dragging the area or automation component. `target_menu_number`
      ...    is the menu where we are dropping the area or automation component.
       [Arguments]  ${source_menu_number}  ${target_menu_number}
       ${menu_childrens} =    get webelements    ${leftmenu_children}
       Drag Source Area Or Automation Component   ${menu_childrens[${source_menu_number}]}
       Drop Draged Source Area Or Automation Component To Target Area   ${menu_childrens[${target_menu_number}]}

Drop Draged Source Area Or Automation Component To Connection Editor
       Mouse Over  ${canvas}
       Mouse Up  ${canvas}
       Wait Until Page Does Not Contain Element  ${drop_target}  2s


Reorder AutomationComponent Or Area From Area To Connection Editor
   [Documentation]  Reordering the automation component or area ,`source_menu_number` is
      ...    the menu from where we are dragging the area or automation component. `target_menu_number`
      ...    is the menu where we are dropping the area or automation component.
       [Arguments]  ${source_menu_number}
       ${menu_childrens} =    get webelements    ${leftmenu_children}
       Drag Source Area Or Automation Component   ${menu_childrens[${source_menu_number}]}
       Drop Draged Source Area Or Automation Component To Connection Editor

Move Area Or Automation Component To Particular Position
     [Arguments]  ${device_or_areanumber}   ${x}  ${y}
     ${area_or_deviceheader} =    get webelements    ${device_names_on_canvas}
      Mouse Down   ${area_or_deviceheader[${device_or_areanumber}]}
      Mouse Out    ${area_or_deviceheader[${device_or_areanumber}]}
      ${x_offset}  ${y_offset}=  Calculate Offsets  ${area_or_deviceheader[${device_or_areanumber}]}   ${x}  ${y}
      Drop By Offset  ${x_offset}  ${y_offset}

SubConnection line should be present
     Wait Until Element Is Visible   ${connector_lines}  2s
     Element Should Be Visible  ${connector_lines}











*** Settings ***
Resource   ../../keywords/PLC_scim.resource

*** Variables ***
@{PLC_INSTANCE_LIST}=  BF-NonSecurity    LM-NonSecurity  BF-UserSecurity    LM-UserSecurity

*** Test Cases ***
Checking PLC SCIM
    Stop and Start all PLCs    @{PLC_INSTANCE_LIST} 



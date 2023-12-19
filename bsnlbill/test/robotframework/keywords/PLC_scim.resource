*** Settings ***
#Local Mechine IP
# Library    Remote  http://127.0.0.1:8270/NRobot/PLCSimAutomation   100 seconds  WITH NAME  PLCSim
#Smoke Test Machine IP
# Library    Remote  http://132.186.123.23:8270/NRobot/PLCSimAutomation   100 seconds  WITH NAME  PLCSim
#E2E Test Machine IP
Library    Remote  http://172.21.101.10:8270/NRobot/PLCSimAutomation   100 seconds  WITH NAME  PLCSim


*** Variables ***
${PLSCIM_PATH}=  C:\\Program Files (x86)\\Siemens\\Automation\\PLCSIMADV\\bin\\Siemens.Simatic.PlcSim.Advanced.UserInterface.exe
${TIME_OUT}=  100


*** Keywords ***
Start PLC SCIM
        [Documentation] 	Start PLC Sim Advanced by path.
        ...     Parameters: PlcSimPath: Path and name of the PLC Sim executable or shortcut
        START PLCSIM   ${PLSCIM_PATH}

Register and Start PLC Instance
        [Documentation]  Register new device and power on the device.
        ...  Register a PLC instance with the given name.
        ...  set the given PLC instance to power on state.
        [Arguments]  @{Plc_name_list}
        FOR  ${Plc_name}  IN  @{Plc_name_list}
                REGISTER INSTANCE   ${Plc_name}
                SET NETWORK ADAPTER  ${Plc_name}  online
                POWER ON PLC    ${Plc_name}   ${TIME_OUT}
        END



Add Device to PLC SCIM
        [Documentation]  start PLCSIM and change to PLCSIM Virtual Eth.Adatpter with setting 'online' and
        ...  power on plc instance
        [Arguments]  ${Plc_name}
        START PLCSIM   ${PLSCIM_PATH}
        Register and Start PLC Instance  ${Plc_name}

Run Device
        [Documentation]  Set the given PLC instance to run mode
        [Arguments]  @{Plc_name_list}
        FOR  ${Plc_name}  IN  @{Plc_name_list}
           RUN PLC    ${Plc_name}
        END

Stop Device
        [Documentation]  Set the given PLC instance to stop mode. Timeout: Timeout in seconds.
        [Arguments]  @{Plc_name_list}
        FOR  ${Plc_name}  IN  @{Plc_name_list}
            STOP PLC    ${Plc_name}  ${TIME_OUT}
        END

Power On Device
        [Documentation]  	Set the given PLC instance to power on state.
        ...      Parameters: InstanceName: Name of the PLC instance to be switched on.
        ...    Timeout: Timeout in seconds.
        [Arguments]  ${Plc_name}
        POWER ON PLC    ${Plc_name}   ${TIME_OUT}

Power Off Device
        [Documentation]    Set the given PLC instance to power off state.
        ...    Parameters: InstanceName: Name of the PLC instance to be switched off.
        [Arguments]  ${Plc_name}
        POWER OFF PLC   ${Plc_name}  ${TIME_OUT}

Remove device from PLCSCIM
        [Documentation]  	Unregister the given PLC instance
        [Arguments]  @{Plc_names}
        FOR  ${plc}  IN  @{Plc_names}
           UNREGISTER INSTANCE  ${plc}
        END

Stop All PLCs
        [Documentation]  Stops all PLC Sim Instance.
        STOP ALL INSTANCE

Start All PLCs
        [Documentation]   Starts all registered PLC Sim Instance.
        START ALL INSTANCE


Stop and Start all PLCs
      [Arguments]  @{PLC_names}
       FOR  ${PLC}  IN  @{PLC_names}
                Power Off Device    ${PLC}
                Power On Device    ${PLC}
       END

Power Off all PLCs
        [Arguments]  @{PLC_names}
        FOR  ${PLC}  IN  @{PLC_names}
                Power Off Device    ${PLC}
        END    






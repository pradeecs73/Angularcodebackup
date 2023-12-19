/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
*
*Interfaces for config and adapter and regex
*/ 
/*
*Interface for configuration api
*/
export interface Config {
  adapter: Adapter,
  devices: [],
  IP_ADDRESS_REGEX_VALIDATOR: string,
  IP_VALIDATE_REGEX: string,
  LOWERCASE_CHARACTER_REGEX: string,
  MINIMUM_EIGHT_CHARACTER_REGEX: string,
  PASSWORD_PATTERN_REGEX: string,
  PORTVALIDATE_REGEX: string,
  PROJ_RSRV_REGEX: string,
  PROJ_SPECIAL_CHAR_REGEX: string,
  PROJ_URLVALIDATE_REGEX: string,
  SPECIAL_CHARACTER_REGEX: string,
  UPPERCASE_CHARACTER_REGEX: string,
  sessionIdleTimeout:number,
  startIdleTimer:number
}

/*
*
*
*Interface for Adapter
*
*/
/* Adapter consists of type,clientInterfaceName.serverInterfaceName */
export interface Adapter {
  type: string,
  clientInterfaceName: string,
  serverInterfaceName: string
}
/*
*
*Interface for Regular expressions in project
*
*/
export interface ProjectRegex {
  deviceUrlValidationRegex: string,
  ipAddressPortValidationRegex: string,
  ipValidationRegex: string,
  lowercaseValidationRegex: RegExp,
  minimumEightCharacterValidationRegex: RegExp,
  passwordPatternValidationRegex: string,
  portValidationRegex: string,
  projectReserveKeyWordRegex: string,
  projectSpecialCharacterRegex: string,
  specialCharacterValidationRegex: RegExp,
  uppercaseValidationRegex: RegExp,
}


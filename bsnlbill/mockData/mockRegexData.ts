/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { convertStringToRegex } from "../src/app/shared/services/validators.service";
import { PROJ_RSRV_REGEX, PROJ_SPECIAL_CHAR_REGEX, IP_ADDRESS_REGEX_VALIDATOR, PASSWORD_PATTERN_REGEX, LOWERCASE_CHARACTER_REGEX, UPPERCASE_CHARACTER_REGEX, SPECIAL_CHARACTER_REGEX, MINIMUM_EIGHT_CHARACTER_REGEX } from "src/app/utility/constant";

const PORTVALIDATE_REGEX =
  /^((6553[0-5])|(655[0-2]\d)|(65[0-4]\d{2})|(6[0-4]\d{3})|([1-5]\d{4})|([0-5]{0,5})|([0]\d{1,4})|(\d{1,4}))$/g;
const IPVALIDATE_REGEX =
  /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/g;

export const projectRegexStore = {
  projectReserveKeyWordRegex: PROJ_RSRV_REGEX.toString(),
  projectSpecialCharacterRegex: PROJ_SPECIAL_CHAR_REGEX.toString(),
  deviceUrlValidationRegex: IP_ADDRESS_REGEX_VALIDATOR.toString(),
  passwordPatternValidationRegex: PASSWORD_PATTERN_REGEX,
  lowercaseValidationRegex: convertStringToRegex(
    LOWERCASE_CHARACTER_REGEX.toString()
  ),
  uppercaseValidationRegex: convertStringToRegex(
    UPPERCASE_CHARACTER_REGEX.toString()
  ),
  specialCharacterValidationRegex: convertStringToRegex(
    SPECIAL_CHARACTER_REGEX.toString()
  ),
  minimumEightCharacterValidationRegex: convertStringToRegex(
    MINIMUM_EIGHT_CHARACTER_REGEX.toString()
  ),
  portValidationRegex: PORTVALIDATE_REGEX.toString(),
  ipAddressPortValidationRegex: PORTVALIDATE_REGEX,
  ipValidationRegex: IPVALIDATE_REGEX.toString(),
};

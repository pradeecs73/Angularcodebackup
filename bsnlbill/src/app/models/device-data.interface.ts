/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
* Interface for device scan settings
*/
export interface DeviceScanSettings {
    port: number;
    fromIPAddress: string;
    toIPAddress: string
}
/*
* Interface for Device ip range
*/
export interface DeviceIpRange {
    start: string;
    end: string
}

/*
* Interface for device scan request payload
*/
export interface DeviceScanRequestPayload {
    port: number,
    deviceIpRange: DeviceIpRange
}

/*
* Interface for validation errors
*/
export interface IValidationErrors {
    showValidationError: boolean,
    validationMessage: string;
}

/*
* Interface for device scan success response
*/
export interface DeviceScanSuccessResponse {
    message: string
}

/*
* Interface for Protect project payload
*/
export interface ProtectProject{
    accessType: string,
    password: string,
    projectName: string
}


/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

/*
* Interface for the api response
*/
export interface Response
{
    data?:ResponseStatus
}
/*
* Interface for the api response status
*/
export interface ResponseStatus
{
    code: number,
    msg: string
}

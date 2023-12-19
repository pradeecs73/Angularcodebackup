/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

/*
*
* This interface is used in the form dialog component
*
*/
/*
* Interface for form dialog component to load the components dynamically
*
*/
export interface DynamicComponentManifest {
    component: never;
    closeEvent: string;
    saveEvent: string;
    customActionEvent?: string
    data?:string
}

/*
* End
*/

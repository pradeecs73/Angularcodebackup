/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
*
*
*
*Model for area hierarchy
*
*/
export interface AreaHierarchy{
    /*
    * Interface parameters are common parent,sourceHierarchy and targetHierachy
    *
    */
    commonParent: string,
    sourceAreaHierarchy :string[],
    targetAreaHierarchy :string[]
}

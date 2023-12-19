/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Project } from './models';
/*
*
* Model for recent used project
*
*/
export interface RecentUsedProject extends Project {
    isSelected: boolean;
    name: string;
    author: string;
    createdTime: Date;
    modified: Date;
    modifiedby: string;
    comment: string;
    persisted:boolean;
    id: string;
}

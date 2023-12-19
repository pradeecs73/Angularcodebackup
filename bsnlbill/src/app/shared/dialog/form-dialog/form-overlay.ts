/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

export abstract class FormOverlay{
    /*
    * Returns the tite for the form overlay dialogue
    */
    abstract title:string;
    getTitle() {
        return this.title;
    }
}

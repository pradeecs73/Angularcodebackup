/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Injectable } from '@angular/core';
import { Numeric, ResizeModal } from '../enum/enum';


@Injectable({
    providedIn: 'root'
})
export class ResizeService {
    /*
    * Resize left and right side panel of device page
    *
    */
    public resizeDeviceWidth(elementPosition, elementRef, from?): void {
        const { mode } = elementPosition;
        const { position } = elementPosition;

        const elementLeft = elementRef.nativeElement.querySelector('#device__left__side');
        const elementMiddle = elementRef.nativeElement.querySelector('#device__middle__side');
        const resizeRight = elementRef.nativeElement.querySelector('#device__resize__right');
        const resizeLeft = elementRef.nativeElement.querySelector('#device__resize__left');
        const elementRight = elementRef.nativeElement.querySelector('#device__right__side');
        const rectLeft = elementLeft.clientWidth;
        const rectRight = elementRight.clientWidth;
        const windowWidth = document.documentElement.clientWidth;
        const elementLeftWidth = (Numeric.ONEHUNDRED * rectLeft / windowWidth);
        const elementRightWidth = (Numeric.ONEHUNDRED * rectRight / windowWidth);

        let middleWidth = (ResizeModal.DEVICE_MIDDLE_WIDTH + (Numeric.ONEHUNDRED * rectRight / windowWidth));
        if (middleWidth > ResizeModal.DEVICE_MIDDLE_LEFT_WIDTH) {
            middleWidth = ResizeModal.DEVICE_MIDDLE_LEFT_WIDTH;
        }
        if (position === ResizeModal.POSITION_RIGHT) {
            middleWidth = (ResizeModal.DEVICE_MIDDLE_WIDTH + (Numeric.ONEHUNDRED * rectRight / windowWidth) );
            this.resizeDeviceWidthPositionRight(mode,elementLeftWidth,middleWidth,elementRight,from,elementMiddle,resizeRight);
        } else {
             middleWidth = (ResizeModal.DEVICE_MIDDLE_WIDTH + (Numeric.ONEHUNDRED * rectLeft / windowWidth) - Numeric.TWO);
            this.resizeDeviceWidthPositionLeft(mode,elementRightWidth,middleWidth,elementLeft,elementMiddle,resizeLeft);
        }
        if(from){
            elementMiddle.style.width  =`${ResizeModal.ELEMENT_MIN_WIDTH /Numeric.THREE }vw`;
        }
    }
    /*
    * Resize right side panel of device page
    *
    */
    resizeDeviceWidthPositionRight(mode,elementLeftWidth,middleWidth,elementRight,from,elementMiddle,resizeRight){
        if (mode === ResizeModal.MODE_FULL) {
            this.resizeDeviceWidthPositionRightFullMode(elementLeftWidth,middleWidth,elementRight,from,elementMiddle,resizeRight);
        } else {
            this.resizeDeviceWidthPositionRightCollapseMode(elementLeftWidth,middleWidth,elementRight,elementMiddle,resizeRight);
        }
    }
    /*
    * Resize left side panel of device page
    *
    */
    resizeDeviceWidthPositionLeft(mode,elementRightWidth,middleWidth,elementLeft,elementMiddle,resizeLeft){
        if (mode === ResizeModal.MODE_FULL) {
            this.resizeDeviceWidthPositionLeftFullMode(elementRightWidth,middleWidth,elementLeft,elementMiddle,resizeLeft);
        } else {
            this.resizeDeviceWidthPositionLeftCollapseMode(elementRightWidth,middleWidth,elementLeft,elementMiddle,resizeLeft);
        }
    }
    /*
    * Resize right side panel (expanded) of device page
    *
    */
    resizeDeviceWidthPositionRightFullMode(elementLeftWidth,middleWidth,elementRight,from,elementMiddle,resizeRight){
        if (elementLeftWidth <= ResizeModal.MIN_WIDTH) {
            middleWidth = ResizeModal.DEVICE_MIDDLE_RIGHT_WIDTH;
        }
        elementRight.style.width = `${ResizeModal.DEVICE_RIGHT_FULL_WIDTH}%`;
        elementRight.style.minWidth = `${ResizeModal.DEVICE_RIGHT_FULL_WIDTH}vw`;
        if (from === 'sidePanel') {
            elementRight.style.width = `16%`;
            elementRight.style.minWidth = `16vw`;
        }
        elementMiddle.style.width = `${middleWidth}%`;
        resizeRight.style.display = `revert`;
    }
    /*
    * Resize right side panel(collapsed) of device page
    *
    */
    resizeDeviceWidthPositionRightCollapseMode(elementLeftWidth,middleWidth,elementRight,elementMiddle,resizeRight){
        if (elementLeftWidth <= ResizeModal.MIN_WIDTH) {
            middleWidth = ResizeModal.MIDDLE_WIDTH_COLLAPSE;
        }
        elementRight.style.width = `${ResizeModal.ELEMENT_MIN_WIDTH}vw`;
        elementRight.style.minWidth = `${ResizeModal.ELEMENT_MIN_WIDTH}vw`;
        elementMiddle.style.width = `${middleWidth}%`;
        resizeRight.style.display = `none`;
    }
    /*
    * Resize left side panel(expaded) of device page
    *
    */
    resizeDeviceWidthPositionLeftFullMode(elementRightWidth,middleWidth,elementLeft,elementMiddle,resizeLeft){
        if (elementRightWidth <= ResizeModal.MIN_WIDTH) {
            middleWidth = ResizeModal.DEVICE_MIDDLE_LEFT_WIDTH;
        }
        elementLeft.style.width = `${ResizeModal.DEVICE_LEFT_FULL_WIDTH}vw`;
        elementLeft.style.minWidth = `${ResizeModal.DEVICE_LEFT_FULL_WIDTH}vw`;
        elementMiddle.style.width = `${middleWidth}%`;
        resizeLeft.style.display = `revert`;
    }
    /*
    * Resize left  side panel(collapsed) of device page
    *
    */
    resizeDeviceWidthPositionLeftCollapseMode(elementRightWidth,middleWidth,elementLeft,elementMiddle,resizeLeft){
        if (elementRightWidth <= ResizeModal.MIN_WIDTH) {
            middleWidth = ResizeModal.MIDDLE_WIDTH_COLLAPSE;
        }
        elementLeft.style.width = `${ResizeModal.ELEMENT_MIN_WIDTH}vw`;
        elementLeft.style.minWidth = `${ResizeModal.ELEMENT_MIN_WIDTH}vw`;
        elementMiddle.style.width = `${middleWidth}%`;
        resizeLeft.style.display = `none`;
    }
    /*
    * Resize left and right side panel of editor page
    *
    */
    public resizeEditorWidth(elementPosition, elementRef): void {
        const { mode, position} = elementPosition;
        const elemntMiddle = elementRef.nativeElement.querySelector('#plant__editor__middle');
        const elemLeft = elementRef.nativeElement.querySelector('#plant__editor__side');
        const elemntRight = elementRef.nativeElement.querySelector('#plant__editor__right__side');
        const resizeRight = elementRef.nativeElement.querySelector('#resize__right');
        const resizeLeft = elementRef.nativeElement.querySelector('#resize__left');

        const rectLeft = elemLeft.clientWidth;
        const rectRight = elemntRight.clientWidth;
        const windowWidth = document.documentElement.clientWidth;

        const elemntLeftWidth = (Numeric.ONEHUNDRED * rectLeft / windowWidth);
        const elemntRightWidth = (Numeric.ONEHUNDRED * rectRight / windowWidth);

        if (position === ResizeModal.POSITION_RIGHT) {
            const middleWidth = (ResizeModal.MIDDLEWIDTH + (Numeric.ONEHUNDRED * rectRight / windowWidth)+Numeric.SIX);
            this.resizeEditorWidthPositionRight(mode,elemntLeftWidth,middleWidth,elemntRight,elemntMiddle,resizeRight);
        }
        else {
            const middleWidth = (ResizeModal.MIDDLEWIDTH + (Numeric.ONEHUNDRED * rectLeft / windowWidth)+Numeric.SIX);
            this.resizeEditorWidthPositionLeft(mode,elemntRightWidth,middleWidth,elemLeft,elemntMiddle,resizeLeft);
        }

    }
    /*
    * Resize right side panel of editor page
    *
    */
    resizeEditorWidthPositionRight(mode,elemntLeftWidth,middleWidth,elemntRight,elemntMiddle,resizeRight){
        if (mode === ResizeModal.MODE_FULL) {
            this.resizeEditorWidthPositionRightModeFull(elemntLeftWidth,middleWidth,elemntRight,elemntMiddle,resizeRight);
        } else {
            this.resizeEditorWidthPositionRightModeCollapsed(elemntLeftWidth,middleWidth,elemntRight,elemntMiddle,resizeRight);
        }
    }
    /*
    * Resize left side panel of editor page
    *
    */
    resizeEditorWidthPositionLeft(mode,elemntRightWidth,middleWidth,elemLeft,elemntMiddle,resizeLeft){
        if (mode === ResizeModal.MODE_FULL) {
            this.resizeEditorWidthPositionLeftModeFull(elemntRightWidth,middleWidth,elemLeft,elemntMiddle,resizeLeft);
        } else {
            this.resizeEditorWidthPositionLeftModeCollapsed(elemntRightWidth,middleWidth,elemLeft,elemntMiddle,resizeLeft);
        }
    }
    /*
    * Resize right side panel(expanded) of editor page
    *
    */
    resizeEditorWidthPositionRightModeFull(elemntLeftWidth,middleWidth,elemntRight,elemntMiddle,resizeRight){
        if (elemntLeftWidth <= ResizeModal.MIN_WIDTH) {
            middleWidth = ResizeModal.MIDDLE_WIDTH_FULL;
        }
        elemntRight.style.width = `${ResizeModal.EDITOR_COLLAPSE_WIDTH}%`;
        elemntRight.style.minWidth = `${ResizeModal.EDITOR_COLLAPSE_WIDTH}vw`;
        elemntMiddle.style.width = `${middleWidth}%`;
        resizeRight.style.display = `revert`;
    }
    /*
    * Resize right side panel(collapsed) of editor page
    *
    */
    resizeEditorWidthPositionRightModeCollapsed(elemntLeftWidth,middleWidth,elemntRight,elemntMiddle,resizeRight){
        if (elemntLeftWidth <= ResizeModal.MIN_WIDTH) {
            middleWidth = ResizeModal.MIDDLE_WIDTH_COLLAPSE;
        }
        elemntRight.style.width = `${ResizeModal.ELEMENT_MIN_WIDTH}vw`;
        elemntRight.style.minWidth = `${ResizeModal.ELEMENT_MIN_WIDTH}vw`;
        elemntMiddle.style.width = `${middleWidth}%`;
        resizeRight.style.display = `none`;
    }
    /*
    * Resize left side panel(expanded) of editor page
    *
    */
    resizeEditorWidthPositionLeftModeFull(elemntRightWidth,middleWidth,elemLeft,elemntMiddle,resizeLeft){
        if (elemntRightWidth <= ResizeModal.MIN_WIDTH) {
            middleWidth = ResizeModal.MIDDLE_WIDTH_FULL;
        }
        elemLeft.style.width = `${ResizeModal.EDITOR_COLLAPSE_WIDTH}%`;
        elemLeft.style.minWidth = `${ResizeModal.EDITOR_COLLAPSE_WIDTH}vw`;
        elemntMiddle.style.width = `${middleWidth}%`;
        resizeLeft.style.display = `revert`;
    }
    /*
    * Resize left side panel(collapsed) of editor page
    *
    */
    resizeEditorWidthPositionLeftModeCollapsed(elemntRightWidth,middleWidth,elemLeft,elemntMiddle,resizeLeft){
        if (elemntRightWidth <= ResizeModal.MIN_WIDTH) {
            middleWidth = ResizeModal.MIDDLE_WIDTH_COLLAPSE;
        }
        elemLeft.style.width = `${ResizeModal.ELEMENT_MIN_WIDTH}vw`;
        elemLeft.style.minWidth = `${ResizeModal.ELEMENT_MIN_WIDTH}vw`;
        elemntMiddle.style.width = `${middleWidth}%`;
        resizeLeft.style.display = `none`;
    }

}

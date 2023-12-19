/*
* @license
* Copyright (C) Siemens AG 2021-2022 ALL RIGHTS RESERVED.
* Confidential.
*/


import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, Inject } from '@angular/core';
import {
  FillingLineNodeType,
  Numeric,
  ResizableDirection,
  MouseMoveEvents,
  ResizeStylingProperties,
  ResizerType,
} from '../../enum/enum';
import { ROOT_EDITOR } from '../../utility/constant';




@Directive({
  /*
  *
  *
  *  Directive Name
  */
  selector: '[appResizable]'
})
export class ResizableDirective implements AfterViewInit {
  constructor(
    @Inject(DOCUMENT) private readonly documentRef: Document,
  ) {

  }


  ngAfterViewInit() {


    /*
    *
    * Get all resizer elements
    *
    *
    */
    this.documentRef.querySelectorAll('.resizer').forEach(ele => {
      this.invokeResizable(ele);
    });
  }

  /**
   *
   * @param prevSiblingElement
   * @param nextSiblingElement
   * @returns clears the styling property for sibling elements of Resizer
   */
  clearStylePropertiesToNone(prevSiblingElement: HTMLElement, nextSiblingElement: HTMLElement) {
    prevSiblingElement.style.userSelect = 'none';
    prevSiblingElement.style.pointerEvents = 'none';

    nextSiblingElement.style.userSelect = 'none';
    nextSiblingElement.style.pointerEvents = 'none';
    return { prevSiblingElement, nextSiblingElement };
  }

  /**
   * Invoke Resizable method and append mouse events to the element with Resizer class
   * @param {HTMLElement} resizer
   */
  invokeResizable(resizer) {
    const direction = resizer.getAttribute('data-direction') || ResizableDirection.horizontal;
    const resizerId = resizer.getAttribute('data-id') || ROOT_EDITOR;
    let prevSiblingElement = resizer.previousElementSibling as HTMLElement;
    let nextSiblingElement = resizer.nextElementSibling;

    /*
    *
    *
    * The current position of mouse
    */
    let x = 0;
    let y = 0;
    let prevSiblingHeight = 0;
    let prevSiblingWidth = 0;
    let nextSiblingWidth = 0;

    /*
    *
    *
    * Handle the mousedown event
    * that's triggered when user drags the resizer
    */

    const mouseDownHandler = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const rect = prevSiblingElement.getBoundingClientRect();
      const rectNextSibling = nextSiblingElement.getBoundingClientRect();
      prevSiblingHeight = rect.height;
      prevSiblingWidth = rect.width;
      nextSiblingWidth = rectNextSibling.width;

      this.documentRef.addEventListener(MouseMoveEvents.mouseMove, mouseMoveHandler);
      this.documentRef.addEventListener(MouseMoveEvents.mouseUp, mouseUpHandler);

    };


    const mouseMoveHandler = (e: MouseEvent) => {
      /**
       *
       * How far the mouse has been moved
       */

      let dx = e.clientX - x;
      if (resizerId === FillingLineNodeType.AREA) {
        dx = dx / Numeric.THREE;
      }
      const dy = e.clientY - y;
      switch (direction) {
        case ResizableDirection.vertical:
          const height =
            ((prevSiblingHeight + dy) * Numeric.ONEHUNDRED) /
            resizer.parentNode.getBoundingClientRect().height;
          prevSiblingElement.style.height = `${height}%`;
          break;
        case ResizableDirection.horizontal:
        default:
          const previousElementWidth =
            ((prevSiblingWidth + dx) * Numeric.ONEHUNDRED) / resizer.parentNode.getBoundingClientRect().width;
          prevSiblingElement.style.width = `${previousElementWidth}%`;
          const nextElementWidth =
            ((nextSiblingWidth + dx) * Numeric.ONEHUNDRED) / resizer.parentNode.getBoundingClientRect().width;
          nextSiblingElement.style.width = `${Numeric.ONEHUNDRED - nextElementWidth * Numeric.TWOPOINTEIGHT}%`;
          break;
      }

      let cursor;
      if (direction === ResizableDirection.horizontal) {
        cursor = ResizerType.colResize;
      } else {
        cursor = ResizerType.rowResize;
      }
      resizer.style.cursor = cursor;
      this.documentRef.body.style.cursor = cursor;

      ({ prevSiblingElement, nextSiblingElement } = this.clearStylePropertiesToNone(prevSiblingElement, nextSiblingElement));
    };

    const mouseUpHandler = () => {
      resizer.style.removeProperty(ResizeStylingProperties.cursor);
      this.documentRef.body.style.removeProperty(ResizeStylingProperties.cursor);

      prevSiblingElement.style.removeProperty(ResizeStylingProperties.userSelect);
      prevSiblingElement.style.removeProperty(ResizeStylingProperties.pointerEvents);

      nextSiblingElement.style.removeProperty(ResizeStylingProperties.userSelect);
      nextSiblingElement.style.removeProperty(ResizeStylingProperties.pointerEvents);

      this.documentRef.removeEventListener(MouseMoveEvents.mouseMove, mouseMoveHandler);
      this.documentRef.removeEventListener(MouseMoveEvents.mouseUp, mouseUpHandler);
    };

    resizer.addEventListener(MouseMoveEvents.mouseDown, mouseDownHandler);
  }

}


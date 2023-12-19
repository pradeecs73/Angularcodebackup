/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ResizableDirective } from './resizableDirective.directive';


fdescribe('ClickOutsideDirective', () => {
  const directive = new ResizableDirective(document);
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('ngAfterViewInit', () => {
    const element = {
      getAttribute: () => { return 10; },
      addEventListener: () => { return document.createElement('div'); }
    };
    spyOn(document, 'querySelectorAll').and.returnValue([element] as unknown as NodeListOf<Element>);
    directive.ngAfterViewInit();
    console.log("document.body.style.cursor: ", document.body.style.cursor);
    expect(document.body.style.cursor).toBe("");
  });

  it('Mouse move Handler should change style cursor to col-resize if the direction is horizontal', () => {
    const { resizableElement } = createNewElement('horizontal');
    const mouseMoveEvent = new Event("mousemove");

    document.dispatchEvent(mouseMoveEvent);
    expect(document.body.style.cursor).toBe('col-resize');
    expect(resizableElement.style.cursor).toBe('col-resize');
  });


  it('Mouse move Handler should change style cursor to col-resize if the direction is not mentioned', () => {
    const { resizableElement } = createNewElement('vertical');
    const mouseMoveEvent = new Event("mousemove");

    document.dispatchEvent(mouseMoveEvent);
    expect(document.body.style.cursor).toBe('row-resize');
    expect(resizableElement.style.cursor).toBe('row-resize');


  });


  it('Mouse up Handler should remove cursor style from document and resizable element', () => {
    const { resizableElement } = createNewElement('horizontal');
    const mouseUpEvent = new Event("mouseup");
    document.dispatchEvent(mouseUpEvent);
    expect(document.body.style.cursor).toEqual('');
    expect(resizableElement.style.cursor).toEqual('');

  });
});


function createNewElement(direction) {
  const text = document.createTextNode('');
  const resizableElement = document.createElement('div');
  resizableElement.setAttribute('data-direction', direction);
  const mockedNextSiblingElement = document.createElement('div');
  resizableElement.appendChild(text);
  document.body.appendChild(resizableElement);
  document.body.appendChild(mockedNextSiblingElement);
  const directive = new ResizableDirective(document);
  directive.invokeResizable(resizableElement);
  const mouseDownEvent = new Event("mousedown");
  resizableElement.dispatchEvent(mouseDownEvent);
  return { resizableElement };
}

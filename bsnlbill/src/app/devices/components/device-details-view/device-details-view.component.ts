/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
/*
*
*
*Import statement
*/
import { Component, ElementRef, Inject, Renderer2, ViewEncapsulation } from '@angular/core';
import { AutomationComponent } from '../../../models/targetmodel.interface';
import { DOCUMENT } from '@angular/common';
import { DeviceDetailElements } from '../../../enum/enum';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { select } from 'd3';

@Component({
  selector: 'device-details-view',
  templateUrl: './device-details-view.component.html',
  styleUrls: ['./device-details-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeviceDetailsViewComponent {
  private automationComponents: AutomationComponent[];

  constructor(
    public readonly elementRef: ElementRef,
    private readonly facadeService: FacadeService,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document) { }
  /*
    *
    * Function to draw the device detail
    *
  */
  drawDeviceDetails() {
    this.clearDeviceDetails();
    const detailsDiv = this.createNewElements(
      DeviceDetailElements.DIV, DeviceDetailElements.PANEL_CLASS, this.elementRef.nativeElement);
    this.automationComponents.forEach(ac => {
      const detailsChildDiv = this.createNewElements(
        DeviceDetailElements.SPAN, DeviceDetailElements.CARD_CLASS, detailsDiv);
      this.facadeService.drawService.drawDeviceNode(detailsChildDiv, ac);
      const svgEl = detailsChildDiv.querySelector('svg');
      const element = select(svgEl).select('#parent-rect').select('rect.cls-2').node() as HTMLElement;
      detailsChildDiv.style.height = `${element?.getAttribute('height')}px`;
    });
  }
  /*
    *
    *  Function to get the device details
    *
    */
  clearDeviceDetails() {
    const elements = this.elementRef.nativeElement.querySelector(DeviceDetailElements.DETAILS_CLASS);
    if (elements) {
      elements.remove();
    }
  }

  private createNewElements(element, className, parentElement) {
    const childElement = this.document.createElement(element);
    childElement.classList.add(className);
    this.renderer.appendChild(parentElement, childElement);
    return childElement;
  }
  /*
    *
    *  To set the ac value
    *
  */
  set automationComp(value) {
    this.automationComponents = value;
  }
  /*
    *
    *  To get the ac value
    *
  */
  get automationComp() {
    return this.automationComponents;
  }
}

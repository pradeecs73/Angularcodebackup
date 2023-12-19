/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, Input } from '@angular/core';
import { FacadeService } from '../../services/facade.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent  {
  constructor(private readonly facadeService: FacadeService){
  }
   /*
  * Editor page right side panel : When the device is expanded AC shown are using this component
  */
  @Input() isShow: boolean;
  @Input() text: string;

  /*
  *find the location of cursor in the node: right side panel
  *
  */
  mousedown(event){
    const rect = event.target.getBoundingClientRect();
    this.facadeService.commonService.mouseObject.left = event.clientX - rect.left;
    this.facadeService.commonService.mouseObject.top = event.clientY - rect.top;
  }

}

/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ConfiguredConnectionObj, ProposeConnectionObj } from '../../../models/models';
import { CONNECTIONLISTROWID } from '../../../utility/constant';
import { FacadeService } from '../../services/facade.service';

@Component({
  selector: 'app-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConnectionListComponent {
  /*
  *
  * Variables are declared here
  */
  @Input() connectionList: Array<ConfiguredConnectionObj> | Array<ProposeConnectionObj>;
  @Input() expandAccordionTab: boolean;
  @Output('applyConChanges') applyConChanges: EventEmitter<unknown> = new EventEmitter();
  /*
  *used to enable Apply button
  */
  isValidSelection = true;
  isManualConnectionsExists = false;
  codes = [{ name: 'Proposed', class: 'proposed' },
  { name: 'Proposed selection', class: 'proposed-selection' },
  { name: 'Hovered', class: 'hovered' },
  { name: 'Row selection', class: 'row-selected' },
  { name: 'Configured', class: 'configured' }
  ];
  /*
  *used in HTML
  */
  readonly CONNECTIONLISTROWID = CONNECTIONLISTROWID;
  constructor(
    public facadeService: FacadeService
  ) {
  }

  /*
  *
  * On apply
  *
  */
  onApply(ev) {
    this.applyConChanges.emit(ev);
  }

/*
  *
  * showlist
  *
  */
  showList(): string {
    let temp = ``;
    temp += ` <ul class='legend' >
    <li><div class='connection proposed'></div> Proposed </li>
    <li><div class='connection proposed-selection'></div> Proposed Selection / Default</li>
    <li><div class=' connection proposed-hovered'></div> Proposed on hover</li>
    <li><div class='connection proposed-hovered-selected'></div> Proposed Selection on hover</li>
    <li><div class='connection proposed-row-selected'></div> Proposed on Row Selection</li>
    <li><div class='connection proposed-row-selected-2'></div> Proposed & Row Selection</li>
    <li><div class='connection configured'></div> Configured</li>
    <li><div class='connection configured hovered' ></div> Configured on hover</li>
    <li><div class='connection configured-selected'></div> Configured on row select</li>
    <li><div class='connection configured success' ></div> Configured success </li>
    <li><div class='connection configured success hovered' ></div> Configured success on hover </li>
    <li><div class='connection configured success-selected' ></div> Configured success on row select </li>
    <li><div class='connection configured fault' ></div> Configured Fail </li>
    <li><div class='connection configured fault hovered' ></div> Configured fail on hover </li>
    <li><div class='connection configured fault-selected' ></div> Configured fail on row select </li>
  </ul>`;
    return temp;
  }
  /*
  *
  * confirm
  *
  */
  confirm(obj) {
    let deleteConfirmation:string;
    if (this.facadeService.applicationStateService.isOnline() && obj.connector.diagnose && obj.connector.partner !== '') {
      deleteConfirmation=this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.message.deleteOnlineConnection1');
    } else {
      deleteConfirmation=this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.message.deleteOnlineConnection2');
    }
    this.facadeService.overlayService.confirm({
      message : {content:[deleteConfirmation]},
      header : this.facadeService.translateService.instant('overlay.confirm.deleteConfirmation.header'),
      successLabel : this.facadeService.translateService.instant('common.buttons.yes'),
      optionalLabel: this.facadeService.translateService.instant('common.buttons.no'),
      acceptCallBack: () => {
        this.facadeService.applicationStateService.deleteConnection(obj);
        this.facadeService.editorService.selectedConnection = null;
        this.facadeService.editorService.setSelectedConnection(null);
      }
    });
  }

}

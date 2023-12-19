/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DisableIfUnauthorizedDirective } from '../directives/access-check/access-check.directive';
import { ProjectData } from '../models/models';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { LiveLinkEditorGuardService } from '../services/livelink-guard.service';

@Component({
  selector: 'app-configuration-settings',
  templateUrl: './configuration-settings.component.html',
  styleUrls: ['./configuration-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationSettingsComponent implements OnInit {
  writePassword = '';
  public projectData: ProjectData;

  @ViewChild(DisableIfUnauthorizedDirective) disableIfUnauthorizedDirective;

  constructor(
    private readonly facadeService: FacadeService,
    private readonly messageService: MessageService,
    private readonly liveLinkEditorGuardService: LiveLinkEditorGuardService
  ) { }

  ngOnInit(): void {
    /*
     *
     *  highlight the icon when page is active
     *
     */
    this.facadeService.commonService.updateMenu('configurationsettings');
    this.projectData = this.facadeService.dataService.getProjectData();
  }

  saveSettings() {
    /*
     *
     *  save the settings.
     *
     */
    this.facadeService.apiService
      .setLanguage({ language: this.facadeService.translateService.currentLang })
      .subscribe(() => {
        this.messageService.add({
          key: 'saveSettings',
          severity: 'success',
          summary: this.facadeService.translateService.instant(
            'messageService.success.globalSettingsSuccess.summary'
          )
        });
      });
  }
}

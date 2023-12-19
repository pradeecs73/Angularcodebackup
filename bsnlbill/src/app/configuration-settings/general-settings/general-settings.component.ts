/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Component, OnInit } from '@angular/core';
import { LanguageList } from '../../../app/models/models';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { languages } from '../../../app/utility/constant';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {
  languages = [];
  selectedLanguage :LanguageList;
  constructor(public facadeService: FacadeService) { }

  ngOnInit(): void {
    /*
    *
    *  Language list is fetched from constants file and set based on current language
    *
    */
    this.languages = languages;
    this.selectedLanguage = languages.filter(lang => lang.value === this.facadeService.translateService.currentLang)[0];
  }

  /*
    *
    *  Called when the language is changed in the dropdown
    *
    */
  languageChanged(lang:LanguageList){
      this.facadeService.commonService.onLangChange(lang.value);
  }

}

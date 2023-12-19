/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { NODE_SERVER_NOT_FOUND } from '../utility/constant';
import { Config } from '../models/config.interface';

@Injectable({
  providedIn: 'root'
})
/*
* Fetches the configuration from the api and stores it in local storage
*
*/
export class ConfigService {
  url: string;
  constructor(private readonly http: HttpClient,
    private readonly facadeService: FacadeService) {
    const currentOrigin = `${window.location.origin}`;
    this.url = `${currentOrigin}/apis`;
  }

  /**
   * Function to get the configuration form api
   *
   */
  getConfig() {
    const endpoint = `${this.url}/config`;
    return new Promise((resolve, reject) => {
      this.http.get(endpoint).toPromise()
        .then((data: Config) => {
          localStorage.setItem('config', JSON.stringify(data));
          this.facadeService.commonService.setProjectRegex(data);
          this.facadeService.commonService.setSessionAndStartTimerDuration(data);
          return resolve(data);
        })
        .catch(error => {
          /*
          * If the api returns an error display an error notification
          *
          */
          this.facadeService.commonService.changeErrorIconVisibility(true);
          this.facadeService.commonService.showErrorIcon = true;
          this.facadeService.commonService.noOfErrorMsgs += 1;
          const nodeServerError = NODE_SERVER_NOT_FOUND;
          this.facadeService.commonService.allErrorCodeList.push(nodeServerError);
          /*
          *Updating the change method for each change in the error count status
          */
          this.facadeService.commonService.changeErrorCountStatus('ERROR');
          this.facadeService.commonService.displayServerExceptionPopup();
          return reject(error);
        });
    });
  }
}

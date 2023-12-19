/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Router } from '@angular/router';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { AbstractState } from './../state';
import { ApplicationState } from './application.state';
import { Offline } from './offline.app.state';

export class Application extends AbstractState {

  _state: ApplicationState;
  constructor(
    protected facadeService: FacadeService,
    protected router: Router
  ) {
    super();
    this.state = new Offline(this.facadeService, this.router);
  }
  /*
  * Getter and setter method to return the application state
  */
  get state(): ApplicationState {
    return this._state;
  }

  set state(state: ApplicationState) {
    this._state = state;
  }
  /*
  * Returns state offline/online
  */
  public getStatus() {
    return this.state.status();
  }
  /*
  * Function to change the status from online-> offline and offline->online
  */
  public changeStatus(): void {
    return this.state.changeStatus(this);
  }
}

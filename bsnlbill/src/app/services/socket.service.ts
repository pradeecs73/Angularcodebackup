/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { log } from '../utility/utility';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private io;

  constructor(private readonly facadeService: FacadeService) { }
  /*
  * Initializes the socket
  *
  */
  public initSocket(): void {
    this.io = io(
      `${window.location.hostname}:${environment.backendURLPort}`,
      {
        transports: ['websocket'],
        upgrade: false,
        withCredentials: true
      }
    );
    log(`${window.location.hostname}:${environment.backendURLPort} : , ${window.location.hostname} : ${environment.backendURLPort}`);
  }
  /*
  *
  * Get the socket
  *
  */
  public getIo() {
    return this.io;
  }
}

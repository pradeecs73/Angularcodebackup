/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { log } from '../utility/utility';


@Injectable()


export class InterceptService implements HttpInterceptor {


   constructor(
      private readonly facadeService: FacadeService) {
   }
   /*
  *
  *
  * Interceptor
  *
   */

   intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

      const cloned = req.clone({
         withCredentials: true
      });
      /*
      * when the api gives a success response
      */

      return next.handle(cloned).pipe(
         map(event => {
            let evt;
            if (event instanceof HttpResponse) {
               evt =  event;
            }
            return evt;
         }),
         /*
         *
         *
         * When the api's throw an error its handled by errorhandle service based on error type
         *
         */
         catchError((error: HttpErrorResponse) => {
            log('error in interseptor', error);
            if (error.status === 0) {
               this.facadeService.errorHandleService.handleServerCrashError();
            }
            else {
               this.facadeService.errorHandleService.handleError(error);
            }
            return throwError(error);
         }),
         finalize(() => {

         })
      );

   }
}

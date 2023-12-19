/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { HTTPStatus, LocalStorageKeys, NotificationType, Numeric, timedOutState } from './enum/enum';
import { FacadeService } from './livelink-editor/services/facade.service';
import { log } from './utility/utility';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'PlantViewUi';
  showOverlayDialog: boolean;
  languageChangeSubscription: Subscription;
  idleState: string = timedOutState.NOT_STARTED;
  countdown: number = null;

  constructor(private readonly cd: ChangeDetectorRef,
    public facadeService: FacadeService, private readonly idle: Idle) {
    this.showOverlayDialog = false;
    facadeService.translateService.addLangs(['en', 'de']);
    this.setLanguage(this.getLanguage());
    this.facadeService.dataService.clearProjectData();
    this.langChange();
    this.configureIdleTimer();
  }
  /*
  *
  * this method is called whenever the language is changed in general settings
  *
  */
  langChange() {
    this.languageChangeSubscription = this.facadeService.commonService.languageChangeSub.subscribe((res: string) => {
      this.setLanguage(res);
    });
  }


  /*
  *
  * To set the language based on language change.
  *
  */
  setLanguage(language: string) {
    if (language !== undefined && language !== 'undefined') {
      this.facadeService.translateService.use(language);
      if (localStorage) {
        localStorage.language = language;
      }
    }
  }

  /*
  *
  * Used to get language from local storage or from default language set in app module ts
  *
  */

  getLanguage() {
    let language = this.facadeService.translateService.defaultLang;
    if (localStorage) {
      language = localStorage.language;
    }
    return language;
  }



  private items: MenuItem[];
  ngOnInit() {
    /**
     * Initializing event on ngOninit
     * from HostListener some time methods are not calling
     */
    window.addEventListener('unload', this.onUnload, false);
    this.items = [
      { label: 'Filling line' },
      { label: 'Connection editor' }
    ];
    this.detectBrowserCrash();
  }


  /**
   * This method check if applicationTimeStamp value is present in the
   * local-storage,if present time difference is checked ,if it is more than 10 secs,
   * (in case of browser crash/kill) and windows value is 1 then it is made to 0
   * else Interval method is called which write timestamp to local-storage every 2 sec
   */
  detectBrowserCrash() {
    const differenceInTimeInSecs = this.getDifferenceInTime();
    const windowsValue = localStorage.getItem(LocalStorageKeys.windows);

    if (differenceInTimeInSecs > Numeric.FIVE && windowsValue) {
      this.handleBrowserCrash();
    }
    setInterval(this.writeApplicationTimeStamp.bind(this), Numeric.TWO_THOUSAND);
  }

  /**
   *Get the difference in time between application timestamp
   * and current timestamp in seconds
   *
   * @private
   * @return {*}
   * @memberof AppComponent
   */
  private getDifferenceInTime() {
    const timeStampFromLocalStorage = localStorage.getItem(LocalStorageKeys.applicationTimeStamp);
    const currentTimeStamp = new Date().valueOf();
    const existingApplicationTimeStamp = new Date(timeStampFromLocalStorage).valueOf();
    return Number((currentTimeStamp - existingApplicationTimeStamp) / Numeric.THOUSAND);
  }

  /**
   *
   *If browser crash is detected then
   * 1.Clear the session.
   * 2.Reset 'windows' local storage value to 0.
   * @private
   * @memberof AppComponent
   */
  private handleBrowserCrash() {
    localStorage.setItem(LocalStorageKeys.windows, '0');
    this.facadeService.apiService.clearSessions();
    log('Application crash detected');
    this.writeApplicationTimeStamp();
  }

  writeApplicationTimeStamp() {
    localStorage.setItem(LocalStorageKeys.applicationTimeStamp, `${new Date()}`);
  }


  /**
   * restrict tab if already application opened
   */
  restrictMultiTab() {
    const noOfTabs = localStorage.getItem(LocalStorageKeys.windows);
    if (noOfTabs === '0' || noOfTabs === null) {
      localStorage.setItem(LocalStorageKeys.windows, `1`);
      this.facadeService.commonService.setActiveTabState(true);
      log('Active Tab');
    }
    else {
      log('application is active in another state');
      this.facadeService.commonService.setActiveTabState(false);
      this.facadeService.overlayService.changeOverlayState(false);
      /* Settimeout is used because this function is called before overlay service  */
      setTimeout(() => {
        this.facadeService.overlayService.information({
          header: this.facadeService.translateService.instant('overlay.information.header'),
          message: {
            title: this.facadeService.translateService.instant('overlay.information.message.title'),
            content: [this.facadeService.translateService.instant('overlay.information.message.content')]
          }
        });
      }, Numeric.THREEHUNDRED);

    }
  }

  /*
 *
 * To display and hide the overlay messages
 *
 */
  ngAfterViewInit() {
    this.facadeService.overlayService.overlayStateChange.subscribe((state: boolean) => {
      setTimeout(() => {
        this.showOverlayDialog = state || false;
      });
    });
    this.restrictMultiTab();
  }
  /**
   *
   * Method will call on before browser refresh
   * @returns
   */
  @HostListener('window:unload', ['$event'])
  onUnload($event: Event) {
    return this.facadeService.saveService.clearOnUnload($event);
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeunload($event: Event) {
    $event.preventDefault();
    const noOfTabs = localStorage.getItem(LocalStorageKeys.windows);
    const state = this.facadeService.commonService.activeTabState;
    if (state && Number(noOfTabs) === 1) {
      localStorage.setItem(LocalStorageKeys.windows, `0`);
    }
    this.startSocket();
    return $event;
  }


  /*
 *
 * Method to restart socket on browser reload
 *
 */
  startSocket() {
    const socket = this.facadeService.socketService.getIo();
    socket.disconnect().connect();
  }



  /*
 *
 * Destroy subscriptions
 *
 */
  ngOnDestroy() {
    this.languageChangeSubscription.unsubscribe();
    this.facadeService.apiService.clearSessions();
  }

  /*
  *
  * Configure idle timer for the application
  *
  */

  configureIdleTimer() {
    let object;
    this.idle.setIdle(this.facadeService.commonService.startIdleTimer);
    this.idle.setTimeout(this.facadeService.commonService.sessionIdleTimeout || false);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    /*
   *
   * This will be called when application go idle
   *
   */
    this.idle.onIdleStart.subscribe(() => {
      this.idleState = timedOutState.IDLE;
    });
    /*
    *
    * This will be called when apllication idle will get end
    *
    */
    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = timedOutState.NOT_IDLE;
      this.countdown = null;
      this.cd.detectChanges();
    });
    /*
    *
    * This will be called when  idle time out is over
    *
    */
    this.idle.onTimeout.subscribe(() => {
      this.idleState = timedOutState.TIMED_OUT;
      this.facadeService.commonService.handleTimeout();
      object = {
        header: this.facadeService.translateService.instant('overlay.warning.sessionTimeout.idleContentheader'),
        message: {
          title: this.facadeService.translateService.instant('overlay.warning.sessionTimeout.message.idleTimerTitle'),
          content: [this.facadeService.translateService.instant('overlay.warning.sessionTimeout.message.idleTime')]
        },
        successLabel: this.facadeService.translateService.instant('common.buttons.ok')
      };
      this.openSessionTimeoutNotification(object);
    });
    /*
    *
    * This method is used to generate a warning popup content
    *
    */
    this.idle.onTimeoutWarning.subscribe(time => {
      this.countdown = time;
      const { minutes, seconds } = this.facadeService.commonService.getTimerText(this.countdown);
      object = {
        header: this.facadeService.translateService.instant('overlay.warning.sessionTimeout.idleContentheader'),
        message: {
          title: this.facadeService.translateService.instant('overlay.warning.sessionTimeout.message.idleContenttitle', { minutes: minutes, seconds: seconds }),
          content: [this.facadeService.translateService.instant('overlay.warning.sessionTimeout.message.idleContent')]
        },
        prolongedText: true,
        successLabel: this.facadeService.translateService.instant('common.buttons.iAmStillHere'),
        optionalLabel: this.facadeService.translateService.instant('home.titles.closeProject'),
        successCallBack: (() => {
          this.reset();
        }),
        optionalCallBack: (() => {
          this.facadeService.commonService.handleTimeout();
          this.reset();
        })
      };
      this.facadeService.overlayService.warning(object);
    });
  }

  /*
    *
    * To show a notification when the timer times out
    *
    */
  openSessionTimeoutNotification = obj => {
    this.facadeService.overlayService.warning(obj);
    this.facadeService.notificationService.pushNotificationToPopup(
      { content: this.facadeService.translateService.instant('overlay.warning.sessionTimeout.message.idleTime'), params: {} },
      NotificationType.WARNING, HTTPStatus.SUCCESS);
  };

  /*
    *
    * To reset a timer
    *
    */
  reset() {
    this.idle.watch();
    this.idleState = timedOutState.NOT_IDLE;
    this.countdown = null;
    this.idle.stop();
  }

}

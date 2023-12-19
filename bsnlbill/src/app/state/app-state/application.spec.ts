/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { HomeComponent } from '../../home/home.component';
import { FacadeMockService } from '../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../livelink-editor/services/facade.service';
import { Application } from './application';

fdescribe('Application service', () => {
  let router: Router;
  let applicationService;
  const defaultFillingNodes = {
    ids: [],
    entities: {}
  };

  let facadeMockService;

  const initialState = { deviceTreeList: of(null), fillingLine: defaultFillingNodes };

  beforeEach(waitForAsync(() => {

    facadeMockService = new FacadeMockService();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(
        [{ path: 'home', component: HomeComponent }]
      )],
      providers: [
        { provide: FacadeService, useClass: facadeMockService },
        provideMockStore({ initialState })
      ]
    });

    applicationService = new Application(facadeMockService, router);

  }));

  it('application service should be created', () => {
    expect(applicationService).toBeTruthy();
  });

  it('should call getStatus method', () => {
    const getStatusReturn = applicationService.getStatus();
    expect(applicationService.getStatus).toBeDefined();
    expect(getStatusReturn).toEqual('Offline');
  });

  it('should call changeStatus method', () => {
    spyOn(applicationService, 'changeStatus').and.callThrough();
    const changeStatusReturn = applicationService.changeStatus();
    expect(applicationService.changeStatus).toBeDefined();
    expect(changeStatusReturn).toEqual(undefined);
    expect(applicationService.changeStatus).toHaveBeenCalled();
  });

  it('should call changeStatus method', fakeAsync(() => {
    applicationService.State = 'online';
    expect(applicationService.State).toBeDefined();
    expect(applicationService.State).toEqual('online');
  }));

});

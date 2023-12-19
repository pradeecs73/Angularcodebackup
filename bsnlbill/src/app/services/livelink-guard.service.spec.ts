/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { HomeComponent } from '../home/home.component';
import { Project } from '../models/models';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { LiveLinkEditorGuardService } from './livelink-guard.service';


fdescribe('LiveLinkEditorGuardService', () => {
  let service: LiveLinkEditorGuardService;
  let mockHttpClientService: HttpClient;
  let mockMessageService: MessageService;

  const defaultFillingNodes = {
    ids: [],
    entities: {}
  };
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let facadeMockService;

  const initialState = { deviceTreeList: of(null), fillingLine: defaultFillingNodes };

  beforeEach(() => {
    facadeMockService = new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(
        [{ path: 'home', component: HomeComponent }]
      )],
      providers: [{ provide: HttpClient, useValue: mockHttpClientService },
      { provide: MessageService, useValue: mockMessageService },
      { provide: FacadeService, useValue: facadeMockService },
      provideMockStore({ initialState })
      ]
    });

    service = TestBed.inject(LiveLinkEditorGuardService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call changeLiveLinkRouteActiveteState method', () => {
    service.changeLiveLinkRouteActiveteState(null);
    expect(service.changeLiveLinkRouteActiveteState).toBeDefined();
  });

  it('should call canActivate method', () => {
    const projectData = {
      date: '4',
      name: 'firstProj',
      id: 'project12345',
    } as Project;
    facadeMockService.saveService.openedProject = projectData;
    service.canActivate(route, state);
    expect(service.canActivate).toBeDefined();
    facadeMockService.openedProject = null;
    service.canActivate(route, state);
  });

});

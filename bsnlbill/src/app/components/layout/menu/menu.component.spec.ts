/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MenuItem, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { LiveLinkEditorGuardService } from 'src/app/services/livelink-guard.service';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';
import { MenuComponent } from './menu.component';


fdescribe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mockHttpClientService: HttpClient;
  let messageService: MessageService;
  let mockStore:Store;
  let liveLinkEditorGuardService : LiveLinkEditorGuardService;
  let facadeMockService;
  let openedProject = {
    'id': 'lere79f4',
    'name': 'test',
    'comment': '',
    'author': '',
    'created': '3/2/2023, 11:10:38 PM',
    'modified': '3/7/2023, 1:26:36 PM',
    'modifiedby': '',
    'isProtected': false,
    'AppVersion': '1.0',
    'isSelected': true
};

  beforeEach(waitForAsync(() => {
    facadeMockService=new FacadeMockService();
    liveLinkEditorGuardService = jasmine.createSpyObj(['liveLinkActivateSub']);
    facadeMockService.commonService.updateMenuItemObs = of('home');
    facadeMockService.commonService.disableHomeAndDeviceViewIconsSub = of(true);
    liveLinkEditorGuardService.liveLinkActivateSub = of(undefined);
    TestBed.configureTestingModule({
      declarations: [ MenuComponent ],
      imports : [ RouterTestingModule],
      providers : [{ provide: HttpClient, useValue: mockHttpClientService },
        { provide: MessageService, useValue: messageService },
        { provide: Store, useValue: mockStore },
        { provide: FacadeService, useValue: facadeMockService},
        { provide: LiveLinkEditorGuardService, useValue: liveLinkEditorGuardService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when configuration settings is reloaded', () => {
    spyOn(component,'updateIcon');
    window.location.hash = '#/configuration-settings';
    component.ngOnInit();
    expect(component.updateIcon).toHaveBeenCalled();
  });

  it('when configuration settings is reloaded', () => {
    spyOn(component,'updateIcon');
    window.location.hash = '#/home';
    component.ngOnInit();
    expect(component.updateIcon).toHaveBeenCalled();
  });

  it('setItem',()=>{
    spyOn(component,'updateIcon');
    const event = {
      item : {
        icon :'',
        styleClass : '',
        command: ''
      }
    } as unknown as MenuItem;
    component.setItem(event);
    expect(component.updateIcon).toHaveBeenCalled();
  });

  it('setItem when project is opened',()=>{
    facadeMockService.saveService.openedProject = openedProject;
    spyOn(component,'updateIcon');
    const event = {
      item : {
        icon :'',
        styleClass : '',
        command: ''
      }
    }
    component.setItem(event);
    expect(component.updateIcon).toHaveBeenCalled();
  });

  it('setItem for about page',()=>{
    spyOn(component,'updateIcon');
    const event = {
      item : {
        icon :'abouticon',
        styleClass : '',
        command: ''
      }
    }
    component.setItem(event.item);
    expect(component.updateIcon).toHaveBeenCalled();
  });

  it('disableIfnoProjectOpened',()=>{
    liveLinkEditorGuardService.liveLinkActivateSub = of(openedProject);
    component.disableMenuIfNoProjectOpened();
    expect(component.items).toBeDefined();
  })

  it('updateMenuItemObs',()=>{
    spyOn(component,'setItem');
    component.updateMenuItem();
    expect(component.setItem).toHaveBeenCalled();
  });

  it('disableMenusInOnlineView',()=>{
    spyOn(component,'setItem');
    facadeMockService.commonService.disableHomeAndDeviceViewIconsSub = of(false);
    component.disableMenusInOnlineView();
    expect(component.visible).toBeDefined();
  });


});

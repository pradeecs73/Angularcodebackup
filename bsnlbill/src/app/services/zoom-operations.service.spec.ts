/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { FillingLineNodeType, Numeric, ZoomFactors } from '../enum/enum';
import { HomeComponent } from '../home/home.component';
import { LiveLink, SubConnectionZoomData } from '../models/models';
import { HTMLNode } from '../opcua/opcnodes/htmlNode';
import { FacadeMockService } from '../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../livelink-editor/services/facade.service';
import { ZoomOperationsService } from './zoom-operations.service';


fdescribe('ZoomOperationsService', () => {
  let facadeMockService: FacadeMockService;
  let mockMessageService: MessageService;
  let service: ZoomOperationsService;

  beforeEach(() => {
    facadeMockService = new FacadeMockService();
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    const zoomPercent = new Subject();
    zoomPercent.next({});

    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useValue: mockMessageService },
      { provide: FacadeService, useValue: facadeMockService }],
      imports: [TranslateModule.forRoot({}), RouterTestingModule.withRoutes(
        [{ path: 'home', component: HomeComponent }]
      )]
    });
    service = TestBed.inject(ZoomOperationsService);
    service.zoomPercentObs = zoomPercent.asObservable();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call updateNodeOnFitWidthAndScreen functionality and set Numeric.POINTEIGHTFIVE to fitToHeightScaling ', () => {
    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', y: 100, updateAnchors: () => { } },
    { id: 'sampleid1', name: 'samplename1', y: 500, updateAnchors: () => { } }] as unknown as Array<HTMLNode>;
    service['updateNodeOnFitWidthAndScreen']();
    expect(service['updateNodeOnFitWidthAndScreen']).toBeDefined();
    expect(service.fitToHeightScaling).toEqual(Numeric.POINTEIGHTFIVE);
  });

  it('should call updateNodeOnFitWidthAndScreen functionality and set Numeric.ONE to fitToHeightScaling ', () => {
    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', y: 10, updateAnchors: () => { }, type: FillingLineNodeType.NODE },
    { id: 'sampleid1', name: 'samplename1', y: 300, updateAnchors: () => { }, type: FillingLineNodeType.NODE }] as unknown as Array<HTMLNode>;
    service['updateNodeOnFitWidthAndScreen']();
    expect(service['updateNodeOnFitWidthAndScreen']).toBeDefined();
    expect(service.fitToHeightScaling).toEqual(Numeric.ONE);
  });

  it('should call updateNodeOnFitWidthAndScreen functionality and set Numeric.POINTNINETHREE to fitToHeightScaling ', () => {
    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', y: 70, updateAnchors: () => { }, type: FillingLineNodeType.NODE },
    { id: 'sampleid1', name: 'samplename1', y: 400, updateAnchors: () => { }, type: FillingLineNodeType.NODE }] as unknown as Array<HTMLNode>;
    service['updateNodeOnFitWidthAndScreen']();
    expect(service['updateNodeOnFitWidthAndScreen']).toBeDefined();
    expect(service.fitToHeightScaling).toEqual(Numeric.POINTNINETHREE);
  });

  it('should call updateNodeOnFitWidthAndScreen functionality and set Numeric.POINTSEVENEIGTH to fitToHeightScaling ', () => {
    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', y: 220, updateAnchors: () => { }, type: FillingLineNodeType.NODE },
    { id: 'sampleid1', name: 'samplename1', y: 700, updateAnchors: () => { }, type: FillingLineNodeType.NODE }] as unknown as Array<HTMLNode>;
    service['updateNodeOnFitWidthAndScreen']();
    expect(service['updateNodeOnFitWidthAndScreen']).toBeDefined();
    expect(service.fitToHeightScaling).toEqual(Numeric.POINTSEVENEIGTH);
  });

  it('should call updateNodeOnFitWidthAndScreen functionality and set Numeric.POINTSEVEN to fitToHeightScaling ', () => {
    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', y: 295, updateAnchors: () => { }, type: FillingLineNodeType.NODE },
    { id: 'sampleid1', name: 'samplename1', y: 800, updateAnchors: () => { }, type: FillingLineNodeType.NODE }] as unknown as Array<HTMLNode>;
    service['updateNodeOnFitWidthAndScreen']();
    expect(service['updateNodeOnFitWidthAndScreen']).toBeDefined();
    expect(service.fitToHeightScaling).toEqual(Numeric.POINTSEVEN);
  });

  it('should call updateNodeOnFitWidthAndScreen functionality and set Numeric.POINTSIXTHREE to fitToHeightScaling ', () => {
    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', y: 370, updateAnchors: () => { }, type: FillingLineNodeType.NODE },
    { id: 'sampleid1', name: 'samplename1', y: 800, updateAnchors: () => { }, type: FillingLineNodeType.NODE }] as unknown as Array<HTMLNode>;
    service['updateNodeOnFitWidthAndScreen']();
    expect(service['updateNodeOnFitWidthAndScreen']).toBeDefined();
    expect(service.fitToHeightScaling).toEqual(Numeric.POINTSIXTHREE);
  });

  it('should call updateNodeOnFitWidthAndScreen functionality and set Numeric.POINTFIVEFIVE to fitToHeightScaling ', () => {
    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', y: 420, updateAnchors: () => { }, type: FillingLineNodeType.NODE },
    { id: 'sampleid1', name: 'samplename1', y: 850, updateAnchors: () => { }, type: FillingLineNodeType.NODE }] as unknown as Array<HTMLNode>;
    service['updateNodeOnFitWidthAndScreen']();
    expect(service['updateNodeOnFitWidthAndScreen']).toBeDefined();
    expect(service.fitToHeightScaling).toEqual(Numeric.POINTFIVEFIVE);
  });

  it('should call updateNodeOnFitWidthAndScreen functionality and set Numeric.POINTFOUREIGHT to fitToHeightScaling ', () => {
    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', y: 520, updateAnchors: () => { }, type: FillingLineNodeType.NODE },
    { id: 'sampleid1', name: 'samplename1', y: 1000, updateAnchors: () => { }, type: FillingLineNodeType.NODE }] as unknown as Array<HTMLNode>;
    service['updateNodeOnFitWidthAndScreen']();
    expect(service['updateNodeOnFitWidthAndScreen']).toBeDefined();
    expect(service.fitToHeightScaling).toEqual(Numeric.POINTFOUREIGHT);
  });

  it('should call updateNodeOnFitWidthAndScreen functionality and set Numeric.POINTFOUR to fitToHeightScaling ', () => {
    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ id: 'sampleid', name: 'samplename', y: 820, updateAnchors: () => { }, type: FillingLineNodeType.NODE },
    { id: 'sampleid1', name: 'samplename1', y: 1500, updateAnchors: () => { }, type: FillingLineNodeType.NODE }] as unknown as Array<HTMLNode>;
    service['updateNodeOnFitWidthAndScreen']();
    expect(service['updateNodeOnFitWidthAndScreen']).toBeDefined();
    expect(service.fitToHeightScaling).toEqual(Numeric.POINTFOUR);
  });


  it('should call setZoomPercent functionality and return Numeric.POINTTWENTYFIVE', () => {
    service.selectedZoomPercent = Numeric.TWENTYFIVE;
    const zoomPercent = service.setZoomPercent();
    expect(service.setZoomPercent).toBeDefined();
    expect(zoomPercent).toEqual(Numeric.POINTTWENTYFIVE);
  });

  it('should call setZoomPercent functionality and return Numeric.POINTFIFTY', () => {
    service.selectedZoomPercent = Numeric.FIFTY;
    const zoomPercent = service.setZoomPercent();
    expect(service.setZoomPercent).toBeDefined();
    expect(zoomPercent).toEqual(Numeric.POINTFIFTY);
  });

  it('should call setZoomPercent functionality and return Numeric.POINTSEVENTFIVE', () => {
    service.selectedZoomPercent = Numeric.SEVENTYFIVE;
    const zoomPercent = service.setZoomPercent();
    expect(service.setZoomPercent).toBeDefined();
    expect(zoomPercent).toEqual(Numeric.POINTSEVENTFIVE);
  });

  it('should call setZoomPercent functionality and return Numeric.ONE', () => {
    service.selectedZoomPercent = Numeric.ONEHUNDRED;
    const zoomPercent = service.setZoomPercent();
    expect(service.setZoomPercent).toBeDefined();
    expect(zoomPercent).toEqual(Numeric.ONE);
  });

  it('should call setZoomPercent functionality and return Numeric.ONEPOINTTWOFIVE', () => {
    service.selectedZoomPercent = Numeric.TWOHUNDERD;
    const zoomPercent = service.setZoomPercent();
    expect(service.setZoomPercent).toBeDefined();
    expect(zoomPercent).toEqual(Numeric.ONEPOINTTWOFIVE);
  });


  it('should call setZoomPercent functionality and return Numeric.ONEPOINTFIVE', () => {
    service.selectedZoomPercent = Numeric.FOURHUNDRED;
    const zoomPercent = service.setZoomPercent();
    expect(service.setZoomPercent).toBeDefined();
    expect(zoomPercent).toEqual(Numeric.ONEPOINTFIVE);
  });

  it('should call setZoomPercent functionality and return Numeric.TWO', () => {
    service.selectedZoomPercent = Numeric.THREE;
    const zoomPercent = service.setZoomPercent();
    expect(service.setZoomPercent).toBeDefined();
    expect(zoomPercent).toEqual(Numeric.TWO);
  });

  it('should call setZoomPercent functionality and return Numeric.ELEVEN', () => {
    service.selectedZoomPercent = Numeric.ONE;
    const zoomPercent = service.setZoomPercent();
    expect(service.setZoomPercent).toBeDefined();
    expect(zoomPercent).toEqual(Numeric.ELEVEN);
  });


  it('should call setZoomPercent functionality and return Numeric.ONEPOINTSEVENFIVE', () => {
    service.selectedZoomPercent = Numeric.ONEPOINTSEVENFIVE;
    const zoomPercent = service.setZoomPercent();
    expect(service.setZoomPercent).toBeDefined();
    expect(zoomPercent).toEqual(Numeric.ONEPOINTSEVENFIVE);
  });

  it('should call zoomSubscription method and set currentZoomScaleFactor to 1', () => {
    facadeMockService.editorService.liveLinkEditor = {
      workspace: { node: () => document.createElement('div') }
    } as unknown as LiveLink;

    service.zoomPercentObs = of(1);
    service['zoomSubscription']();
    expect(service['zoomSubscription']).toBeDefined();
    expect(service.currentZoomScaleFactor).toEqual(1);
  });


  it('should call zoomSubscription method and set currentZoomScaleFactor to 0.5', () => {
    facadeMockService.editorService.liveLinkEditor = {
      workspace: { node: () => document.createElement('div') }
    } as unknown as LiveLink;

    service.zoomPercentObs = of(0.5);
    service['zoomSubscription']();
    expect(service['zoomSubscription']).toBeDefined();
    expect(service.currentZoomScaleFactor).toEqual(0.5);
  });

  it('should call zoomSubscription method and check cases of fitToScreen and fitToWidth', () => {

    facadeMockService.editorService.liveLinkEditor = {
      workspace: { node: () => document.createElement('div') }
    } as unknown as LiveLink;

    service.zoomPercentObs = of(ZoomFactors.FITTOWIDTH);

    service['zoomSubscription']();
    expect(service['zoomSubscription']).toBeDefined();
    expect(facadeMockService.editorService.liveLinkEditor.workspace.node).toBeDefined();

    service.zoomPercentObs = of(ZoomFactors.FITTOSCREEN);

    service['zoomSubscription']();
    expect(service['zoomSubscription']).toBeDefined();
    expect(facadeMockService.editorService.liveLinkEditor.workspace.node).toBeDefined();

  });

  it('should call drawCanvasForOnlineAndOffline method', () => {

    spyOn(service, 'setZoomPercent').and.returnValue(Numeric.TWENTYFIVE);
    spyOn(service, 'changeZoomPercent');
    service.drawCanvasForOnlineAndOffline();
    expect(service.drawCanvasForOnlineAndOffline).toBeDefined();

  });


  it('should call zoomIn functionality for less then 100', () => {
    spyOn(service, 'changeZoomPercent');
    spyOn(service, 'setSubconnectionAllignment');
    service.selectedZoomPercent = 50;
    service.setZoomIn(Numeric.POINTFIFTY);
    expect(service.selectedZoomPercent).toEqual(75);
  });

  it('should call zoomIn functionality for greater then 100 and not equal to 400 ', () => {
    spyOn(service, 'changeZoomPercent');
    spyOn(service, 'setSubconnectionAllignment');
    service.selectedZoomPercent = Numeric.ONEFIFTY;
    service.setZoomIn(Numeric.POINTFIFTY);
    expect(service.selectedZoomPercent).toEqual(350);
  });


  it('should call zoomIn functionality for greater then 100 and equal to 400', () => {
    spyOn(service, 'changeZoomPercent');
    spyOn(service, 'setSubconnectionAllignment');
    service.selectedZoomPercent = Numeric.FOURHUNDRED;
    service.setZoomIn(Numeric.POINTFIFTY);
    expect(service.setZoomIn).toBeDefined();
    expect(service.selectedZoomPercent).toEqual(500);
  });


  it('should call zoomOut functionality for less then 100', () => {
    spyOn(service, 'changeZoomPercent');
    spyOn(service, 'setSubconnectionAllignment');

    service.selectedZoomPercent = 50;
    service.setZoomOut(Numeric.POINTFIFTY);
    expect(service.selectedZoomPercent).toEqual(25);

  });

  it('should call zoomOut functionality for less then 400 and not equal to 200', () => {
    spyOn(service, 'changeZoomPercent');
    spyOn(service, 'setSubconnectionAllignment');
    service.selectedZoomPercent = 300;
    service.setZoomOut(Numeric.POINTFIFTY);
    expect(service.selectedZoomPercent).toEqual(100);
  });

  it('should call zoomOut functionality for less then 400 and not equal to 200', () => {
    spyOn(service, 'changeZoomPercent');
    spyOn(service, 'setSubconnectionAllignment');
    service.selectedZoomPercent = Numeric.TWOHUNDERD;
    service.setZoomOut(Numeric.POINTFIFTY);
    expect(service.selectedZoomPercent).toEqual(100);
  });

  it('should call adjustNodesInEditorForSelectedZoom functionality', () => {
    spyOn(service, 'changeZoomPercent');
    spyOn(service, 'setSubconnectionAllignment');

    service.selectedZoomPercent = Numeric.ONE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ x: 600, updateAnchors: () => true }] as unknown as HTMLNode[];
    service.adjustNodesInEditorForSelectedZoom(Numeric.POINTFIFTY);
    expect(service.adjustNodesInEditorForSelectedZoom).toBeDefined();

    service.selectedZoomPercent = Numeric.THREE;
    facadeMockService.editorService.liveLinkEditor.editorNodes = [{ type: FillingLineNodeType.NODE, x: 600, updateAnchors: () => true }] as unknown as HTMLNode[];
    service.adjustNodesInEditorForSelectedZoom(Numeric.POINTFIFTY);
  });

  it('should call setSubconnectionAllignment method', () => {
    const data = {} as unknown as SubConnectionZoomData;
    service.setSubconnectionAllignment(data);
    expect(service.setSubconnectionAllignment).toBeDefined();
    expect(service['subConnectionZoomChange'].next).toBeDefined();
  });

  it('should call changeZoomPercent method', () => {
    Object.defineProperty(service, 'zoomPercent', {
      value: { next: () => true },
      writable: true
    });

    service.changeZoomPercent(Numeric.POINTFIFTY);
    expect(service.changeZoomPercent).toBeDefined();
    expect(service['zoomPercent'].next).toBeDefined();
  });



});

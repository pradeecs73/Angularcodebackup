/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { TestBed } from '@angular/core/testing';
import { OverlayType } from '../../enum/enum';
import { Overlay, OverlayService } from './overlay.service';


fdescribe('OverlayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverlayService = TestBed.inject(OverlayService);
    expect(service).toBeTruthy();
  });

  it('should be buildOverlayObject', () => {
    const overlayService: OverlayService = TestBed.inject(OverlayService);
    const overlay: Overlay = new OverlayService();

    overlay.type = 'test';
    overlay.header = 'testHeader';
    overlay.cancelLabel = 'testCancelLable';
    overlay.successLabel = 'testSucessLable';
    overlayService.buildOverlayObject(overlay);
    expect(overlayService.header).toEqual('testHeader');

  });

  it('should be confirm', () => {
    const overlayService: OverlayService = TestBed.inject(OverlayService);
    const overlay: Overlay = new OverlayService();
    overlayService.confirm(overlay);
    expect(overlayService.type).toEqual(OverlayType.CONFIRM);

  });

  it('should be loaded', () => {
    const overlayService: OverlayService = TestBed.inject(OverlayService);
    const overlay: Overlay = new OverlayService();
    overlayService.loader(overlay);
    expect(overlayService.type).toEqual(OverlayType.LOADER);

  });

  it('should get warning', () => {
    const overlayService: OverlayService = TestBed.inject(OverlayService);
    const overlay: Overlay = new OverlayService();
    overlayService.warning(overlay);
    expect(overlayService.type).toEqual(OverlayType.WARNING);
  });

  it('should get error', () => {
    const overlayService: OverlayService = TestBed.inject(OverlayService);
    const overlay: Overlay = new OverlayService();
    overlayService.error(overlay);
    expect(overlayService.type).toEqual(OverlayType.ERROR);

  });

  it('should get sucess', () => {
    const overlayService: OverlayService = TestBed.inject(OverlayService);
    const overlay: Overlay = new OverlayService();
    overlayService.success(overlay);
    expect(overlayService.type).toEqual(OverlayType.SUCCESS);

  });

  it('should call clearOverlayData method', () => {
    const overlayService: OverlayService = TestBed.inject(OverlayService);
    overlayService.message = { title: 'sampletitle', content: ['samplecontent'] };
    overlayService.clearOverlayData();
    expect(overlayService.clearOverlayData).toBeDefined();

  });

});

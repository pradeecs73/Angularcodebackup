/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { fillingAreaMockData, FillingNodeMockData, interfaceMockData } from 'mockData/mockFillingLineData';
import * as SvgUtil from './svgutil';

fdescribe('svgUtil test suite', () => {

    it('should return nodeStyles & connectorStyles as string', () => {
        const nodeStyles = SvgUtil.nodeStyles();
        expect(nodeStyles).toBeDefined();
        expect(nodeStyles.trim().length).toBeGreaterThan(0);
        const connectorStyles = SvgUtil.connectorStyles();
        expect(connectorStyles).toBeDefined();
        expect(connectorStyles.trim().length).toBeGreaterThan(0);
    });

    it('should return Area SVG Element as string', () => {
        const result = SvgUtil.buildArea(fillingAreaMockData);
        expect(result).toBeDefined();
        expect(result.trim().length).toBeGreaterThan(0);
    });

    it('should return Node SVG Element as string', () => {
        const result = SvgUtil.buildNode(FillingNodeMockData);
        expect(result).toBeDefined();
        expect(result.trim().length).toBeGreaterThan(0);
    });

    it('should return clientInterface/serverInterface Element', () => {
        const result = SvgUtil.buildClientInterfacePanel(interfaceMockData, 'test');
        expect(result).toBeDefined();
        expect(result.trim().length).toBeGreaterThan(0);

        const result1 = SvgUtil.buildServerInterfacePanel(interfaceMockData, 'test');
        expect(result1).toBeDefined();
        expect(result1.trim().length).toBeGreaterThan(0);
    });

});
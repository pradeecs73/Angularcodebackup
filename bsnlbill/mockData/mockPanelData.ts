/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { AddressModelType, FillingLineNodeType, InterfaceCategory } from '../src/app/enum/enum';
import { PanelDataType, PropertiesType } from '../src/app/models/monitor.interface';

export const mockPanelData: PanelDataType = {
    adapterType: AddressModelType.CLIENT_SERVER,
    automationComponent: 'BottleFilling',
    deviceId: 'b3BjLnRjcDovLzE5Mi4xNjguMi4xMDE6NDg0MA==',
    deviceName: 'BottleFilling',
    deviceState: 'UNKNOWN',
    id: 'clientInf_l1uku9bo',
    interfaceType: InterfaceCategory.CLIENT_INTERFACE,
    name: 'FillingToMixing',
    properties: [{
        name: 'InputData', type: '', children: [{ name: 'Running', type: 'Boolean' },
        { name: 'Stopped', type: 'Boolean' },
        { name: 'Held', type: 'Boolean' },
        { name: 'Error', type: 'Boolean' },
        { name: 'Status', type: 'UInt16' },
        { name: 'FaultyBottles', type: 'UInt32' }]
    },
    {
        name: 'OutputData', type: '', children: []
    }
    ] as Array<PropertiesType>,
    type:FillingLineNodeType.NODE
};

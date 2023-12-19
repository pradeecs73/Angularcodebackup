/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MODEL_VALUE_SUBSTRING, deviceDetails } from '../../../utility/constant';
import { Device, DeviceSet } from '../../../models/targetmodel.interface';
import { Numeric } from '../../../enum/enum';



@Component({
  selector: 'device-properties-panel',
  templateUrl: './device-properties-panel.component.html',
  styleUrls: ['./device-properties-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DevicePropertiesPanelComponent implements OnChanges {
  @Input() selectedDeviceData: Device;
  deviceData: Array<DeviceSet> = [];
  
  get twenty() {
    return Numeric.TWENTY;
  }

  ngOnChanges(changes: SimpleChanges) {
    /*
    * 
    *If input variable changes 
    *
    * 
    */
    if (changes.selectedDeviceData.currentValue) {
      /*
      *
      *Loop all deviceset and filter out only name and value 
      *
      */
      const selectedDeviceData = changes.selectedDeviceData.currentValue;
      this.deviceData = selectedDeviceData.deviceSet.map(deviceset => {
        let value = deviceset.value;
        if (value && typeof value === 'string' && value.includes(MODEL_VALUE_SUBSTRING)) {
          value = value.split('=')[Numeric.TWO];
        }
        return { property: deviceset.name, value: value };
      });
      /*
      *
      *Address and name of device adding from device object
      *
      */
      this.deviceData = [...this.deviceData, { property: deviceDetails.address, value: selectedDeviceData.address },
      { property: deviceDetails.name, value: selectedDeviceData.name }];
      /*
      *
      *Sorting after adding name and address
      *
      */
      this.deviceData.sort((a, b) => {
        const propertyA = a.property.toUpperCase();
        const propertyB = b.property.toUpperCase();
        if (propertyA < propertyB) {
          return -1;
        }
        if (propertyA > propertyB) {
          return 1;
        }
        return 0;
      });
    }
  }

}




import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceConfig } from 'src/app/models/targetmodel.interface';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceBrowseSelectorComponent } from './device-browse-selector.component';
import { FacadeMockService } from '../../../livelink-editor/services/facade.mock.service';
import { FacadeService } from '../../../livelink-editor/services/facade.service';

fdescribe('DeviceBrowseSelectorComponent', () => {
  let component: DeviceBrowseSelectorComponent;
  let fixture: ComponentFixture<DeviceBrowseSelectorComponent>;
  let facadeMockService;
  beforeEach(async () => {
    facadeMockService=new FacadeMockService();
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        { provide: FacadeService, useValue: facadeMockService},
      ],
      declarations: [ DeviceBrowseSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceBrowseSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('addDeviceToList',()=>{
    const data :Array<DeviceConfig> = [
      {
        name: 'Device1',
        uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi43NTo0ODQw',
        address: 'opc.tcp://192.168.2.75:4840',
      }
    ]
    spyOn(component.onDeviceAltered, 'emit');
    component.addDeviceToList(data);
    expect(component.onDeviceAltered.emit).toHaveBeenCalled();
  })

  it('onDevicesAdded',()=>{
    const data :Array<DeviceConfig> = [
      {
        name: 'Device1',
        uid: 'b3BjLnRjcDovLzE5Mi4xNjguMi43NTo0ODQw',
        address: 'opc.tcp://192.168.2.75:4840',
      }
    ]
    spyOn(component.onScannedDeviceAdded, 'emit');
    component.onDevicesAdded(data);
    expect(component.onScannedDeviceAdded.emit).toHaveBeenCalled();
  })
});

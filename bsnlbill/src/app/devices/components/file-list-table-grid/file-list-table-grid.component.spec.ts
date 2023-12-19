import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileListTableGridComponent } from './file-list-table-grid.component';

fdescribe('FileListTableGridComponent', () => {
  let component: FileListTableGridComponent;
  let fixture: ComponentFixture<FileListTableGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileListTableGridComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListTableGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit deleteFromGrid when deleteFromGrid event handler is clicked', () => {
    spyOn(component.deleteFromGrid, 'emit');
    const device = {};
    component.deleteDeviceFromGrid(device);
    expect(component.deleteFromGrid.emit).toHaveBeenCalled();
  });
});

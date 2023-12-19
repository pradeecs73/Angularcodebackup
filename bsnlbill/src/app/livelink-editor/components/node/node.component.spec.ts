/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NodeComponent } from './node.component';
import { TranslateModule} from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

let mockMessageService: MessageService;
fdescribe('NodeComponent', () => {
  let component: NodeComponent;
  let fixture: ComponentFixture<NodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({})],
      declarations: [ NodeComponent ],
      providers:[{ provide: MessageService, useValue: mockMessageService },]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call mousedown method ', () => {
    const event={
      clientX:20,
      clientY:20,
      target:{getBoundingClientRect:()=>{return {left:10,top:10}}}
    };
    component.mousedown(event);
    expect(component.mousedown).toBeDefined();
  });

});

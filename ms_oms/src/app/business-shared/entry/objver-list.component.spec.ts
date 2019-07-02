import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjverListComponent } from './objver-list.component';

describe('ObjverListComponent', () => {
  let component: ObjverListComponent;
  let fixture: ComponentFixture<ObjverListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjverListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

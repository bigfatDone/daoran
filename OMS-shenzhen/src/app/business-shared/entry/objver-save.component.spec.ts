import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjverSaveComponent } from './objver-save.component';

describe('ObjverSaveComponent', () => {
  let component: ObjverSaveComponent;
  let fixture: ComponentFixture<ObjverSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjverSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjverSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

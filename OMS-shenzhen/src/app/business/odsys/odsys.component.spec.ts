import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdsysComponent } from './odsys.component';

describe('OdsysComponent', () => {
  let component: OdsysComponent;
  let fixture: ComponentFixture<OdsysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdsysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdsysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

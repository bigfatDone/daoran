import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierPipe } from './carrier.pipe';

describe('CarrierPipe', () => {
  let component: CarrierPipe;
  let fixture: ComponentFixture<CarrierPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

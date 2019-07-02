import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSaveComponent } from './power-save.component';

describe('PowerSaveComponent', () => {
  let component: PowerSaveComponent;
  let fixture: ComponentFixture<PowerSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

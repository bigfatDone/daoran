import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaySaveComponent } from './gateway-save.component';

describe('GatewaySaveComponent', () => {
  let component: GatewaySaveComponent;
  let fixture: ComponentFixture<GatewaySaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewaySaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewaySaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OttoperateComponent } from './ottoperate.component';

describe('GatewayComponent', () => {
  let component: OttoperateComponent;
  let fixture: ComponentFixture<OttoperateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OttoperateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OttoperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPowerPageComponent } from './noPower-page.component';

describe('NoPowerPageComponent', () => {
  let component: NoPowerPageComponent;
  let fixture: ComponentFixture<NoPowerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoPowerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPowerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

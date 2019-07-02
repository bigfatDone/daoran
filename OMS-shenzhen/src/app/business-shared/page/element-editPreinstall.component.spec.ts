import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementEditPreinstall } from './element-editPreinstall.component';

describe('elementEditPreinstall', () => {
  let component: ElementEditPreinstall;
  let fixture: ComponentFixture<ElementEditPreinstall>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementEditPreinstall ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementEditPreinstall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

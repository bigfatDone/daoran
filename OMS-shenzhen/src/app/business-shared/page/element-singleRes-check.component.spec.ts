import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSingleResCheckComponent } from './element-singleRes-check.component';

describe('ElementSingleResCheckComponent', () => {
  let component: ElementSingleResCheckComponent;
  let fixture: ComponentFixture<ElementSingleResCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementSingleResCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementSingleResCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

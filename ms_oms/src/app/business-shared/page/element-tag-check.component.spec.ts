import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementPageCheckComponent } from './element-page-check.component';

describe('ElementPageCheckComponent', () => {
  let component: ElementPageCheckComponent;
  let fixture: ComponentFixture<ElementPageCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementPageCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementPageCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

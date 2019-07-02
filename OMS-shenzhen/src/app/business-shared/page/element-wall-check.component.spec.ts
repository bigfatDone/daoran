import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementVlistCheckComponent } from './element-vlist-check.component';

describe('ElementVlistCheckComponent', () => {
  let component: ElementVlistCheckComponent;
  let fixture: ComponentFixture<ElementVlistCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementVlistCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementVlistCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

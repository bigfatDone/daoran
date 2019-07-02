import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementArtlistCheckComponent } from './element-artlist-check.component';

describe('ElementArtlistCheckComponent', () => {
  let component: ElementArtlistCheckComponent;
  let fixture: ComponentFixture<ElementArtlistCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementArtlistCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementArtlistCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

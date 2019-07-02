import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSaveComponent } from './element-save.component';

describe('ElementSaveComponent', () => {
  let component: ElementSaveComponent;
  let fixture: ComponentFixture<ElementSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

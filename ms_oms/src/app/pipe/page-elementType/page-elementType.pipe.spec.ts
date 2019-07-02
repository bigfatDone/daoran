import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageElementTypePipe } from './page-elementType.pipe';

describe('PageElementTypePipe', () => {
  let component: PageElementTypePipe;
  let fixture: ComponentFixture<PageElementTypePipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageElementTypePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageElementTypePipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

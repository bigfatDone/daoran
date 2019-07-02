import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageElementPipe } from './page-element.pipe';

describe('PageElementPipe', () => {
  let component: PageElementPipe;
  let fixture: ComponentFixture<PageElementPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageElementPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageElementPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

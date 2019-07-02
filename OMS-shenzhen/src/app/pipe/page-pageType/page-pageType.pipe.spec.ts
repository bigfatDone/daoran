import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEleAttrPipe } from './page-eleAttr.pipe';

describe('PageEleAttrPipe', () => {
  let component: PageEleAttrPipe;
  let fixture: ComponentFixture<PageEleAttrPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageEleAttrPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEleAttrPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

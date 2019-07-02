import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageResourcesPipe } from './page-resources.pipe';

describe('PageResourcesPipe', () => {
  let component: PageResourcesPipe;
  let fixture: ComponentFixture<PageResourcesPipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageResourcesPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageResourcesPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageImgshowComponent } from './page-imgshow.component';

describe('PageImgshowComponent', () => {
  let component: PageImgshowComponent;
  let fixture: ComponentFixture<PageImgshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageImgshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageImgshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

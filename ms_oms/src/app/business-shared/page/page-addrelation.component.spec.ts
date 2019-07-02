import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAddrelationComponent } from './page-addrelation.component';

describe('PageAddrelationComponent', () => {
  let component: PageAddrelationComponent;
  let fixture: ComponentFixture<PageAddrelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAddrelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageAddrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

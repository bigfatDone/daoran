import { async, ComponentFixture, TestBed } from '@angular/core/testing';

  import { pageResSelectComponent } from './page-res-select.component';

describe('pageResSelectComponent', () => {
  let component: pageResSelectComponent;
  let fixture: ComponentFixture<pageResSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ pageResSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(pageResSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

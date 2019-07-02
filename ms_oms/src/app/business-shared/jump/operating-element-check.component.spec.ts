import { async, ComponentFixture, TestBed } from '@angular/core/testing';

  import { operatingElementCheckComponent } from './operating-element-check.component';

describe('operatingElementCheckComponent', () => {
  let component: operatingElementCheckComponent;
  let fixture: ComponentFixture<operatingElementCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ operatingElementCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(operatingElementCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

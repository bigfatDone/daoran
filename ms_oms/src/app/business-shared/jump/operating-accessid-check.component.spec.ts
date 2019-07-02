import { async, ComponentFixture, TestBed } from '@angular/core/testing';

  import { operatingAccessidCheckComponent } from './operating-accessid-check.component';

describe('operatingAccessidCheckComponent', () => {
  let component: operatingAccessidCheckComponent;
  let fixture: ComponentFixture<operatingAccessidCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ operatingAccessidCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(operatingAccessidCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

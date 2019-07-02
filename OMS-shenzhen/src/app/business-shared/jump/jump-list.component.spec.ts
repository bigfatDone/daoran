import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpListComponent } from './jump-list.component';

describe('JumpListComponent', () => {
  let component: JumpListComponent;
  let fixture: ComponentFixture<JumpListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumpListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

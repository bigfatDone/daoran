import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpSaveComponent } from './jump-save.component';

describe('JumpSaveComponent', () => {
  let component: JumpSaveComponent;
  let fixture: ComponentFixture<JumpSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumpSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumpSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

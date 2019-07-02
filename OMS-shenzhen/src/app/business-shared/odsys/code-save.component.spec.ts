import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSaveComponent } from './code-save.component';

describe('CodeSaveComponent', () => {
  let component: CodeSaveComponent;
  let fixture: ComponentFixture<CodeSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

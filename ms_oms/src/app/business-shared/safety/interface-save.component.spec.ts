import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceSaveComponent } from './interface-save.component';

describe('CodeSaveComponent', () => {
  let component: InterfaceSaveComponent;
  let fixture: ComponentFixture<InterfaceSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfaceSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

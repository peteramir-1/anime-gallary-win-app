import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderpathInputComponent } from './folderpath-input.component';

describe('FolderpathInputComponent', () => {
  let component: FolderpathInputComponent;
  let fixture: ComponentFixture<FolderpathInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderpathInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderpathInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

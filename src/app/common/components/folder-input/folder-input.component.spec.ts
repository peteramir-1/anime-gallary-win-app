import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderInputComponent } from './folder-input.component';

describe('FolderInputComponent', () => {
  let component: FolderInputComponent;
  let fixture: ComponentFixture<FolderInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

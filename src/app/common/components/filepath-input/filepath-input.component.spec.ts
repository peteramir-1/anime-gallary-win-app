import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilepathInputComponent } from './filepath-input.component';

describe('FilepathInputComponent', () => {
  let component: FilepathInputComponent;
  let fixture: ComponentFixture<FilepathInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilepathInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilepathInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

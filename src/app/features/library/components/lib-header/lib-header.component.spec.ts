import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibHeaderComponent } from './lib-header.component';

describe('LibHeaderComponent', () => {
  let component: LibHeaderComponent;
  let fixture: ComponentFixture<LibHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

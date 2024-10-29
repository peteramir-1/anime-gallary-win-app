import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeDetailsHeaderComponent } from './anime-details-header.component';

describe('AnimeDetailsHeaderComponent', () => {
  let component: AnimeDetailsHeaderComponent;
  let fixture: ComponentFixture<AnimeDetailsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeDetailsHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimeDetailsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

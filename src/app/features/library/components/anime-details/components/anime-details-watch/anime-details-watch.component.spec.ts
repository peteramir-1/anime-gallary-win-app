import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeDetailsWatchComponent } from './anime-details-watch.component';

describe('AnimeDetailsWatchComponent', () => {
  let component: AnimeDetailsWatchComponent;
  let fixture: ComponentFixture<AnimeDetailsWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeDetailsWatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimeDetailsWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

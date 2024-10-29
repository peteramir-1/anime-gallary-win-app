import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeViewerComponent } from './anime-viewer.component';

describe('AnimeViewerComponent', () => {
  let component: AnimeViewerComponent;
  let fixture: ComponentFixture<AnimeViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

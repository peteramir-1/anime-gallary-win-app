import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeCardGridComponent } from './anime-card-grid.component';

describe('AnimeCardGridComponent', () => {
  let component: AnimeCardGridComponent;
  let fixture: ComponentFixture<AnimeCardGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeCardGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimeCardGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

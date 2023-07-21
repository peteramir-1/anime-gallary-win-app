import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeCardComponent } from './anime-card.component';

describe('AnimeCardComponent', () => {
  let component: AnimeCardComponent;
  let fixture: ComponentFixture<AnimeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

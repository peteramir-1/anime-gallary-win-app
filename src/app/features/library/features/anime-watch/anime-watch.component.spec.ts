import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeWatchComponent } from './anime-watch.component';

describe('AnimeWatchComponent', () => {
  let component: AnimeWatchComponent;
  let fixture: ComponentFixture<AnimeWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeWatchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimeWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

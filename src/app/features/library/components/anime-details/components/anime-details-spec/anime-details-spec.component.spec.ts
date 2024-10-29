import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeDetailsSpecComponent } from './anime-details-spec.component';

describe('AnimeDetailsSpecComponent', () => {
  let component: AnimeDetailsSpecComponent;
  let fixture: ComponentFixture<AnimeDetailsSpecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimeDetailsSpecComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimeDetailsSpecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

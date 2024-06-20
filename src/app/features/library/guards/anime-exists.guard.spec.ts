import { TestBed } from '@angular/core/testing';

import { AnimeExistsGuard } from './anime-exists.guard';

describe('AnimeExistsGuard', () => {
  let guard: AnimeExistsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AnimeExistsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

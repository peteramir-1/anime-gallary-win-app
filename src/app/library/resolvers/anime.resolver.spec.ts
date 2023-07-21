import { TestBed } from '@angular/core/testing';

import { AnimeResolver } from './anime.resolver';

describe('AnimeResolver', () => {
  let resolver: AnimeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AnimeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

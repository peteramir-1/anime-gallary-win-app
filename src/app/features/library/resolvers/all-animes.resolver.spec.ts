import { TestBed } from '@angular/core/testing';

import { AllAnimesResolver } from './all-animes.resolver';

describe('AllAnimesResolver', () => {
  let resolver: AllAnimesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AllAnimesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

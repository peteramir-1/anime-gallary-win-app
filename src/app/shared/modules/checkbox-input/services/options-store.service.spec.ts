import { TestBed } from '@angular/core/testing';

import { OptionsStoreService } from './options-store.service';

describe('OptionsStoreService', () => {
  let service: OptionsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

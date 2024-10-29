import { TestBed } from '@angular/core/testing';

import { FileServingService } from './file-serving.service';

describe('FileServingService', () => {
  let service: FileServingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileServingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

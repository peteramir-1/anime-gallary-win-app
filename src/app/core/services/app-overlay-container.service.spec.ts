import { TestBed } from '@angular/core/testing';

import { AppSnackbarOverlayContainer } from './app-overlay-container.service';

describe('AppSnackbarOverlayContainer', () => {
  let service: AppSnackbarOverlayContainer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppSnackbarOverlayContainer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

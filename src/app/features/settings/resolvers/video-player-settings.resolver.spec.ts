import { TestBed } from '@angular/core/testing';

import { VideoPlayerSettingsResolver } from './video-player-settings.resolver';

describe('VideoPlayerSettingsResolver', () => {
  let resolver: VideoPlayerSettingsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(VideoPlayerSettingsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

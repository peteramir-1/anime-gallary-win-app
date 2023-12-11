import { TestBed } from '@angular/core/testing';

import { VideoPlayerService } from './video-player.service';

describe('VideoPlayerService', () => {
  let service: VideoPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get fluid player configurations', () => {
    expect(service.getVideoPlayerConfigs()).toBeTruthy();
  });

  it('should change fluid player main color', () => {
    const newColor = '#fff';

    service.changeVideoPlayerColor(newColor);

    expect(service.getVideoPlayerConfigs().layoutControls.primaryColor).toBe(newColor);
  });
  
  it('shouldnt change fluid player main color if color syntax is wrong', () => {
    const newColor = '#fffmn';

    service.changeVideoPlayerColor(newColor);

    expect(service.getVideoPlayerConfigs().layoutControls.primaryColor).not.toBe(newColor);
  });
});

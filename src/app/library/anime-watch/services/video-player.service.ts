import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoPlayerService {
  videoPlayerConfigs: FluidPlayerOptions = {
    layoutControls: {
      primaryColor: '#0d9488',
      playButtonShowing: true,
      playPauseAnimation: true,
      fillToContainer: false,
      autoPlay: true,
      preload: 'auto',
      mute: true,
      doubleclickFullscreen: true,
      subtitlesEnabled: false,
      keyboardControl: true,
      layout: 'default',
      allowDownload: false,
      playbackRateEnabled: true,
      allowTheatre: false,
      loop: false,
      logo: {
        imageUrl: null,
        position: 'top left',
        clickUrl: null,
        opacity: 1,
      },
      controlBar: {
        autoHide: true,
        autoHideTimeout: 3,
        animated: true,
      },
      htmlOnPauseBlock: {
        html: null,
        height: null,
        width: null,
      },
      // playerInitCallback: function () {},
      miniPlayer: {
        enabled: false,
      },
    },
    vastOptions: undefined,
    modules: undefined,
    captions: undefined,
  };

  constructor() {}

  getVideoPlayerConfigs() {
    return this.videoPlayerConfigs;
  }

  changeVideoPlayerColor(color: string) {
    if (/^#(([A-F]|[a-f]|[0-9]){3}|([A-F]|[a-f]|[0-9]){6})$/gi.test(color)) {
      this.videoPlayerConfigs.layoutControls.primaryColor = color;
    }
  }
}

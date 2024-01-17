import { Injectable } from '@angular/core';
import 'videojs-playlist/dist/videojs-playlist.min.js';
import 'videojs-playlist-ui/dist/videojs-playlist-ui.min.js';
import 'videojs-hotkeys/videojs.hotkeys.min.js';
import videojs from 'video.js';
import {
  Playlist,
  StaticConfigurations,
  VideoPlayerConfigurations,
} from 'src/app/shared/interfaces/video-player.interface';
import { VideoPlayerSettings } from 'src/app/shared/interfaces/video-player.interface';

@Injectable({
  providedIn: 'root',
})
export class VideoPlayerService {
  player: any;
  readonly configurations: StaticConfigurations = {
    controlBar: {
      remainingTimeDisplay: { displayNegative: false },
    },
    preload: 'auto',
  };
  constructor() {}

  videoJsInit(
    element: string | HTMLVideoElement,
    poster: string,
    configs: VideoPlayerSettings
  ) {
    this.removeDynamicVjsStyles();
    // Initiate Video Player Instance
    this.player = videojs(element, this.getConfigurations(configs, poster));
  }

  private removeDynamicVjsStyles() {
    (window as any).VIDEOJS_NO_DYNAMIC_STYLE = true;
  }

  /**
   *
   * @param configs Video Player settings Saved in the Database
   * @param poster A URL to an image that displays before the video begins playing
   * @returns VideoJS Configurations and its plugins as an object
   */
  private getConfigurations(
    configs: VideoPlayerSettings,
    poster: string
  ): VideoPlayerConfigurations {
    return {
      ...this.configurations,
      poster,
      controlBar: {
        ...this.configurations.controlBar,
        pictureInPictureToggle: configs.pip,
      },
      controls: configs.controls,
      autoplay: configs.autoplay,
      loop: configs.loop,
      muted: configs.muted,
      plugins: configs.hotkeys
        ? {
          hotkeys: {
              volumeStep: configs.volumeStep,
              seekStep: configs.seekStep,
              enableMute: configs.enableMute,
              enableNumbers: configs.enableNumbers,
              enableModifiersForNumbers: configs.enableModifiersForNumbers,
              enableVolumeScroll: configs.enableVolumeScroll,
              enableFullscreen: configs.enableFullscreen,
            },
          }
        : undefined,
    };
  }

  videoJsPlaylistInit(playlist: Playlist, episodeIndex: number) {
    // Setup playlist
    this.player.playlist(playlist, episodeIndex);
    this.player.playlist.autoadvance(0);
  }

  videoJsPlaylistUiInit(playlistUiId: string) {
    this.player.playlistUi({
      el: document.getElementById(playlistUiId),
    });
  }

  on(event: string, callback: () => void) {
    this.player.on(event, callback);
  }

  next() {
    this.player.playlist.next();
  }

  previous() {
    this.player.playlist.previous();
  }

  dispose() {
    this.player.dispose();
  }
}

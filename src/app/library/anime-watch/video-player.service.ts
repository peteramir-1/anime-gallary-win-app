import { Injectable } from '@angular/core';
import 'videojs-playlist/dist/videojs-playlist.min.js';
import 'videojs-playlist-ui/dist/videojs-playlist-ui.min.js';
import 'videojs-hotkeys/videojs.hotkeys.min.js';
import videojs from 'video.js';
import { DynamicConfigurations, Playlist } from './video-player.interface';

@Injectable({
  providedIn: 'root',
})
export class VideoPlayerService {
  player: any;
  configurations: DynamicConfigurations = {
    controls: true,
    autoplay: false,
    controlBar: {
      remainingTimeDisplay: { displayNegative: false },
      pictureInPictureToggle: false,
    },
    preload: 'auto',
    plugins: {
      hotkeys: {
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
        enableVolumeScroll: false
      },
    },
  };
  constructor() {}

  videoJsInit(element: string | HTMLVideoElement, configs: { poster: string }) {
    this.removeSynamicVjsStyles();
    this.setupVjsPlayer(element, this.getConfigurations(configs.poster));
  }
  private removeSynamicVjsStyles() {
    (window as any).VIDEOJS_NO_DYNAMIC_STYLE = true;
  }
  private setupVjsPlayer(element: string | HTMLVideoElement, configs: any) {
    this.player = videojs(element, configs);
  }
  private getConfigurations(poster: string) {
    return { ...this.configurations, poster };
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

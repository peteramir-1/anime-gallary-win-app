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
import Player from 'video.js/dist/types/player';

interface playlist extends Function {
  (playlist: Playlist, episodeIndex: number): void;
  autoadvance: (_: number) => void;
  next: () => void;
  previous: () => void;
  currentIndex: () => number;
}

@Injectable()
export class VideoPlayerService {
  private player!: Player & {
    playlistUi?: (_: { el: Element | null }) => void;
  } & {
    playlist?: playlist;
  };
  private readonly configurations: StaticConfigurations = {
    controlBar: {
      remainingTimeDisplay: { displayNegative: false },
    },
    preload: 'auto',
  };

  /**
   * Returns the index of the currently playing episode in the playlist.
   * @returns The index of the currently playing episode.
   */
  get currentIndex() {
    return this.player.playlist.currentIndex();
  }

  /**
   * Initializes a video player instance with the given element,
   * poster, and configurations.
   *
   * @param element A string representing the id of the HTML element
   *                or an HTMLVideoElement to be used as the container
   *                for the video player.
   * @param poster  A URL of an image to display before the video begins
   *                playing.
   * @param configs Video player settings as a VideoPlayerSettings object.
   */
  videoJsInit(
    element: string | HTMLVideoElement,
    poster: string,
    configs: VideoPlayerSettings
  ): void {
    this.removeDynamicVjsStyles();
    // Initiate Video Player Instance
    this.player = videojs(element, this.getConfigurations(configs, poster));
  }

  /**
   * Sets a flag to disable dynamic CSS style generation by VideoJS.
   *
   * When VideoJS is initialized, it will generate dynamic CSS styles based on the
   * player's configuration. This can be annoying when we want to customize the
   * player's appearance through CSS. By setting this flag to true, we can prevent
   * VideoJS from generating these styles, allowing us to customize the player's
   * appearance as we see fit.
   */
  private removeDynamicVjsStyles(): void {
    (window as any).VIDEOJS_NO_DYNAMIC_STYLE = true;
  }

  /**
   * Combines the static player configurations with the dynamic player settings and poster.
   *
   * This method takes a VideoPlayerSettings object and a poster URL as input, and returns
   * a VideoPlayerConfigurations object that combines the static player configurations with
   * the dynamic player settings and poster.
   *
   * @param configs The VideoPlayerSettings object containing the dynamic player settings.
   * @param poster  The URL of the poster image to display before the video begins playing.
   * @returns A VideoPlayerConfigurations object containing the combined static and dynamic
   *          player configurations and the poster URL.
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

  /**
   * Initializes the video player's playlist with the provided playlist and sets the starting episode index.
   *
   * This method sets up the video player with a playlist and specifies which episode to start with.
   * It also enables auto-advancing to the next episode once the current episode finishes playing.
   *
   * @param playlist The Playlist object containing the episodes to be played.
   * @param episodeIndex The index of the episode to start playing from.
   */
  videoJsPlaylistInit(playlist: Playlist, episodeIndex: number): void {
    this.player.playlist(playlist, episodeIndex);
    this.player.playlist.autoadvance(0);
  }

  /**
   * Initializes the video player's playlist UI with the provided HTML element id.
   *
   * This method sets up the playlist UI with the given HTML element id.
   * The playlist UI is the visual component that displays the list of episodes,
   * allows the user to select an episode, and indicates which episode is currently playing.
   *
   * @param playlistUiId The id of the HTML element to be used as the playlist UI container.
   */
  videoJsPlaylistUiInit(playlistUiId: string): void {
    this.player.playlistUi({
      el: document.getElementById(playlistUiId),
    });
  }

  /**
   * Sets up an event listener on the video player.
   *
   * This method sets up an event listener on the video player and calls the provided callback function
   * when the specified event is triggered.
   *
   * @param event The event to listen to. Please refer to the Video.js documentation for a list of events.
   * @param callback The callback function to be called when the event is triggered.
   */
  on(event: string, callback: () => void): void {
    this.player.on(event, callback);
  }

  /**
   * Play the next episode in the playlist.
   *
   * This method calls the {@link VideoPlaylist#next} method on the video player.
   * If the current episode is the last episode in the playlist, this method does nothing.
   */
  next(): void {
    this.player.playlist.next();
  }

  /**
   * Play the previous episode in the playlist.
   *
   * This method calls the {@link VideoPlaylist#previous} method on the video player.
   * If the current episode is the first episode in the playlist, this method does nothing.
   */
  previous(): void {
    this.player.playlist.previous();
  }

  /**
   * Disposes of the video player instance.
   *
   * This method releases all resources held by the player, including event listeners
   * and any associated DOM elements. It should be called when the video player is
   * no longer needed to free up resources and avoid memory leaks.
   */
  dispose(): void {
    this.player.dispose();
  }
}

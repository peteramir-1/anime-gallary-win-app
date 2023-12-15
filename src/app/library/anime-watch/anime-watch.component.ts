import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import 'videojs-playlist/dist/videojs-playlist.min.js';
import 'videojs-playlist-ui/dist/videojs-playlist-ui.min.js';
import 'videojs-hotkeys/videojs.hotkeys.min.js';
import videojs from 'video.js';

@Component({
  selector: 'app-anime-watch',
  templateUrl: './anime-watch.component.html',
  styleUrls: ['./anime-watch.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AnimeWatchComponent implements AfterViewInit, OnDestroy {
  private episodeIndex: number =
    +this.activeRoute.snapshot.queryParams.episodeIndex;
  get currentEpisode() {
    return this.episodeIndex + 1;
  }
  anime = this.activeRoute.snapshot.data.anime;
  player: any;

  constructor(private router: Router, private activeRoute: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.videoJsInit();
    this.setVideoJsEvents();
    this.videoJsPlaylistInit();
    this.videoJsPlaylistUiInit();
  }

  private videoJsInit() {
    const vjsConfigurations = {
      controls: true,
      autoplay: false,
      controlBar: { remainingTimeDisplay: { displayNegative: false } },
      preload: 'auto',
      poster: this.anime.thumbnail,
      controllBar: { pictureInPictureToggle: false },
      plugins: {
        hotkeys: {
          volumeStep: 0.1,
          seekStep: 5,
          enableModifiersForNumbers: false,
        },
      },
    };
    this.removeSynamicVjsStyles();
    this.setupVjsPlayer(vjsConfigurations);
  }
  private removeSynamicVjsStyles() {
    (window as any).VIDEOJS_NO_DYNAMIC_STYLE = true;
  }
  private setupVjsPlayer(configs: any) {
    this.player = videojs('main-video-js', configs);
  }

  private setVideoJsEvents() {
    // Add playlist menu ui events
    this.player.on('playlistitem', () => {
      this.episodeIndex = this.player.playlist.currentIndex();
      this.scrollPlaylistMenuToCurrentEpisode();
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { episodeIndex: this.player.playlist.currentIndex() },
      });
    });
  }
  private scrollPlaylistMenuToCurrentEpisode() {
    document
      .querySelector('#vjs-playlist-ui-container')
      .scrollTo(0, 117 * this.episodeIndex);
  }

  private videoJsPlaylistInit() {
    // Setup playlist
    this.player.playlist(this.getAnimePlaylist(), this.episodeIndex);
    this.player.playlist.autoadvance(0);
  }
  private getAnimePlaylist() {
    return this.anime.episodes.map((episode, i) => ({
      sources: [
        {
          src:
            'http://localhost:8020/' + episode.split('\\').slice(1).join('/'),
          type: this.getEpisodesMimeType(episode),
        },
      ],
      thumbnail: this.anime.thumbnail,
      name: `Episode ${i + 1}`,
    }));
  }
  private getEpisodesMimeType(currentEpisode: string): string | undefined {
    const episodeExtension = currentEpisode.toLowerCase().split('.')[
      currentEpisode.split('.').length - 1
    ];
    if (episodeExtension === 'flv') return 'video/x-flv';
    else if (episodeExtension === 'mkv') return 'video/x-matroska';
    else if (episodeExtension === 'mwv') return 'video/x-matroska';
    else if (episodeExtension === 'mp4') return 'video/mp4';
    else return undefined;
  }

  private videoJsPlaylistUiInit() {
    this.player.playlistUi({
      el: document.getElementById('vjs-playlist'),
    });
  }

  ngOnDestroy(): void {
    this.player.dispose();
  }
}

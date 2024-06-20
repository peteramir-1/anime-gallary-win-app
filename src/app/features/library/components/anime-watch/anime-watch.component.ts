import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoPlayerService } from 'src/app/features/library/services/video-player.service';
import { GetVideoPlayerSettingsGQL } from 'src/app/core/services/graphql.service';
import { map, tap } from 'rxjs/operators';
import {
  Playlist,
  VideoPlayerSettings,
} from 'src/app/shared/interfaces/video-player.interface';

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

  constructor(
    private getVideoPlayerSettingsGQL: GetVideoPlayerSettingsGQL,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private videoPlayerService: VideoPlayerService
  ) {}

  ngAfterViewInit(): void {
    this.getVideoPlayerSettingsGQL
      .fetch()
      .pipe(
        map(res => res.data.settings),
        tap(settings => {
          this.videoPlayerService.videoJsInit(
            'main-video-js',
            this.anime.thumbnail,
            settings as VideoPlayerSettings
          );
          this.videoPlayerService.videoJsPlaylistInit(
            this.getPlaylist(),
            this.episodeIndex
          );
          this.videoPlayerService.videoJsPlaylistUiInit('vjs-playlist');
        })
      )
      .subscribe(settings => {
        this.applyVideoPlayerTheme(settings.theme);
        this.listenToPlaylistMenuUiEpisodeChange();
      });
  }

  /**
   * Apply Video Player theme
   * @returns void
   */
  private applyVideoPlayerTheme(theme: string): void {
    document.getElementById('main-video-js').classList.add(theme);
  }

  /**
   * Listen to playlist UI selected video changes and make changes to the UI accordingly
   * @returns void
   */
  private listenToPlaylistMenuUiEpisodeChange(): void {
    this.videoPlayerService.on('playlistitem', () => {
      this.episodeIndex =
        this.videoPlayerService.player.playlist.currentIndex();
      this.scrollPlaylistMenuToCurrentEpisode();
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { episodeIndex: this.episodeIndex },
      });
    });
  }

  /**
   * Scroll to the current episode position in playlist menu
   */
  private scrollPlaylistMenuToCurrentEpisode() {
    document
      .querySelector('#vjs-playlist-ui-container')
      .scrollTo(0, 117 * this.episodeIndex);
  }

  /**
   * Get video player Playlist
   * @returns Video-js playlist
   */
  private getPlaylist(): Playlist {
    return this.anime.episodes.map((episode, i) => ({
      sources: [
        {
          src:
            'http://localhost:8020/' + episode.split('\\').slice(1).join('/'),
          type: this.getVideoMimeType(episode),
        },
      ],
      thumbnail: this.anime.thumbnail,
      name: `Episode ${i + 1}`,
    }));
  }

  /**
   * Get the Mime type from a video url
   * @param videoUrl String represents the url of a video
   * @returns mime type of a video
   */
  private getVideoMimeType(videoUrl: string): string | undefined {
    const episodeExtension = videoUrl.toLowerCase().split('.')[
      videoUrl.split('.').length - 1
    ];
    switch (episodeExtension) {
      case 'flv':
        return 'video/x-flv';
      case 'mkv':
        return 'video/x-matroska';
      case 'mwv':
        return 'video/x-matroska';
      case 'mp4':
        return 'video/mp4';
      case 'avi':
        return 'video/x-msvideo';
      case 'mpeg':
        return 'video/mpeg';
      case 'webm':
        return 'video/webm';
      case '3gp':
        return ' video/3gpp';
      case 'ogv':
        return ' video/ogg';
      case 'm3u8':
        return 'application/x-mpegURL';
      case 'ts':
        return ' video/MP2T';
      case 'mov':
        return ' video/quicktime';
      default:
        return undefined;
    }
  }

  ngOnDestroy(): void {
    this.videoPlayerService.dispose();
  }

  /**
   * Play next video in the playlist
   * @returns void
   */
  next(): void {
    this.videoPlayerService.next();
  }

  /**
   * Play previous video in the playlist
   * @returns void
   */
  previous(): void {
    this.videoPlayerService.previous();
  }
}

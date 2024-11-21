import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, tap } from 'rxjs/operators';
import { FileServingService } from 'src/app/core/services/file-serving.service';
import { GetVideoPlayerSettingsGQL } from 'src/app/core/services/graphql.service';
import { VideoPlayerService } from 'src/app/features/library/features/anime-watch/services/video-player.service';
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
export class AnimeWatchComponent implements AfterViewInit {  
  @ViewChild('playlistUI') playlistUI!: ElementRef;
  @ViewChild('videoJSContainer') videoJSContainer!: ElementRef;

  private readonly activeRoute = inject(ActivatedRoute);
  private readonly fileServingService = inject(FileServingService);
  private readonly getVideoPlayerSettingsGQL = inject(
    GetVideoPlayerSettingsGQL
  );
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);
  private readonly videoPlayerService = inject(VideoPlayerService);

  private readonly onDestroy = inject(DestroyRef).onDestroy(() => {
    this.videoPlayerService.dispose();
  });

  private episodeIndex: number =
    +this.activeRoute.snapshot.queryParams.episodeIndex;
  get currentEpisode() {
    return this.episodeIndex + 1;
  }
  anime = this.activeRoute.snapshot.data.anime;

  constructor() {}

  ngAfterViewInit(): void {
    this.setupVideoJS();
  }

  /**
   * Initializes the VideoJS player with the provided settings and playlist.
   *
   * This method fetches video player settings from a GraphQL query and applies them
   * to initialize the VideoJS player. It converts the anime thumbnail path to an image
   * URL and uses it as the poster for the video player. The method sets up the playlist
   * and its UI, applies the video player theme, and listens for changes in the playlist
   * menu UI.
   *
   * @returns void
   */
  private setupVideoJS(): void {
    this.getVideoPlayerSettingsGQL
      .fetch()
      .pipe(
        map(({ data: { settings } }) => settings as VideoPlayerSettings),
        tap(settings => {
          const thumbnail = this.fileServingService.convertPathToImage(
            this.anime.thumbnail
          );

          this.videoPlayerService.videoJsInit(
            'main-video-js',
            thumbnail.exists ? thumbnail.url : thumbnail.default,
            settings
          );
        }),
        tap(() => {
          this.videoPlayerService.videoJsPlaylistInit(
            this.getPlaylist(),
            this.episodeIndex
          );
          this.videoPlayerService.videoJsPlaylistUiInit('vjs-playlist');
        }),
        tap(settings => {
          this.applyVideoPlayerTheme(settings.theme);
        }),
        finalize(() => this.listenToPlaylistMenuUiEpisodeChange())
      )
      .subscribe();
  }

  /**
   * Apply Video Player theme
   * @returns void
   */
  private applyVideoPlayerTheme(theme: string): void {
    const videoJSElement = this.videoJSContainer.nativeElement.firstElementChild;
    this.renderer.addClass(videoJSElement, theme);
  }

  /**
   * Listen to playlist UI selected video changes and make changes to the UI accordingly
   * @returns void
   */
  private listenToPlaylistMenuUiEpisodeChange(): void {
    this.videoPlayerService.on('playlistitem', () => {
      const episodeIndex =
        this.videoPlayerService.currentIndex;
      
      this.scrollPlaylistMenuTo(episodeIndex);
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { episodeIndex },
      });
    });
  }

  /**
   * Scroll to the current episode position in playlist menu
   */
  private scrollPlaylistMenuTo(episodeIndex: number) {
    this.playlistUI.nativeElement.scrollTo({
      top: 117 * episodeIndex,
    });
  }

  /**
   * Get video player Playlist
   * @returns Video-js playlist
   */
  private getPlaylist(): Playlist {
    const animeImage = this.fileServingService.convertPathToImage(
      this.anime.thumbnail
    );
    return this.anime.episodes.map((episode: string, i: number) => {
      const video = this.fileServingService.convertPathToVideo(
        episode,
        animeImage.exists ? animeImage.url : animeImage.default
      );

      return {
        sources: [
          {
            src: video.url,
            type: video.exists ? video.mimeType : 'video/mp4',
          },
        ],
        thumbnail: video.thumbnail,
        name: `Episode ${i + 1}`,
      };
    });
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

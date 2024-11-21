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

  /**
   * Gets the current episode number based on the episode index.
   *
   * @returns {number} The current episode number, which is the episode index plus one.
   */
  get currentEpisode() {
    return this.episodeIndex + 1;
  }

  anime = this.activeRoute.snapshot.data.anime;

  constructor() {}

  /**
   * Initializes the VideoJS player after the component's view has been initialized.
   *
   * It sets up the VideoJS player with the anime's thumbnail as the poster and
   * the anime episodes as the playlist.
   */
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
   * Applies a CSS theme class to the VideoJS player element.
   *
   * This method adds the specified CSS class to the VideoJS player element,
   * allowing the player's appearance to be customized according to the theme.
   *
   * @param themeClass The CSS class to apply to the VideoJS player element.
   * @returns void
   */
  private applyVideoPlayerTheme(themeClass: string): void {
    const videoJSElement =
      this.videoJSContainer.nativeElement.firstElementChild;
    this.renderer.addClass(videoJSElement, themeClass);
  }

  /**
   * Listens to the VideoJS player's 'playlistitem' event and
   * updates the URL's query parameter to the newly selected episode index.
   *
   * This method is used to update the URL when the user selects a new episode
   * from the playlist menu. This allows the user to bookmark a specific episode
   * of an anime and navigate to it later.
   *
   * @private
   * @returns {void}
   */
  private listenToPlaylistMenuUiEpisodeChange(): void {
    this.videoPlayerService.on('playlistitem', () => {
      const episodeIndex = this.videoPlayerService.currentIndex;

      this.scrollPlaylistMenuTo(episodeIndex);
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { episodeIndex },
      });
    });
  }

  /**
   * Scrolls the playlist menu to the specified episode index.
   *
   * @param episodeIndex The index of the episode to scroll to.
   * @returns void
   */
  private scrollPlaylistMenuTo(episodeIndex: number) {
    this.playlistUI.nativeElement.scrollTo({
      top: 117 * episodeIndex,
    });
  }

  /**
   * Creates a VideoJS Playlist object from the anime episodes.
   *
   * This method takes the anime episodes and creates a VideoJS Playlist object
   * out of them. The Playlist object is an array of objects where each object
   * represents an episode of the anime. Each episode object contains the URL of
   * the episode video, the thumbnail URL of the anime, and the name of the episode.
   *
   * @returns {Playlist} A VideoJS Playlist object.
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
            type: video.mimeType,
          },
        ],
        thumbnail: video.thumbnail,
        name: `Episode ${i + 1}`,
      };
    });
  }

  /**
   * Plays the next episode in the playlist.
   *
   * This method calls the next() method on the video player service.
   */
  next(): void {
    this.videoPlayerService.next();
  }

  /**
   * Plays the previous episode in the playlist.
   *
   * This method calls the previous() method on the video player service.
   */
  previous(): void {
    this.videoPlayerService.previous();
  }
}

import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoPlayerService } from './video-player.service';

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
    private router: Router,
    private activeRoute: ActivatedRoute,
    private videoPlayerService: VideoPlayerService
  ) {}

  ngAfterViewInit(): void {
    this.videoPlayerService.videoJsInit('main-video-js', { poster: this.anime.thumbnail });
    this.videoPlayerService.on('playlistitem', () => {
      // Add playlist menu ui events
      this.episodeIndex =
        this.videoPlayerService.player.playlist.currentIndex();
      this.scrollPlaylistMenuToCurrentEpisode();
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams: { episodeIndex: this.episodeIndex },
      });
    });
    this.videoPlayerService.videoJsPlaylistInit(
      this.getAnimePlaylist(),
      this.episodeIndex
    );
    this.videoPlayerService.videoJsPlaylistUiInit();
  }
  private scrollPlaylistMenuToCurrentEpisode() {
    document
      .querySelector('#vjs-playlist-ui-container')
      .scrollTo(0, 117 * this.episodeIndex);
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

  ngOnDestroy(): void {
    this.videoPlayerService.dispose();
  }

  playNext() {
    this.videoPlayerService.next();
  }
  
  playPrevious() {
    this.videoPlayerService.previous();

  }
}

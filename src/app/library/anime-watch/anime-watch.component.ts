import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import fluidPlayer from 'fluid-player';
import { VideoPlayerService } from './services/video-player.service';

@Component({
  selector: 'app-anime-watch',
  templateUrl: './anime-watch.component.html',
  styleUrls: ['./anime-watch.component.scss'],
})
export class AnimeWatchComponent implements AfterViewInit, OnDestroy {
  @ViewChild('animeTitle') animeTitle: ElementRef;
  @ViewChild('videoContainer') videoContainer: ElementRef;
  fluidPlayer: any;
  video: HTMLVideoElement;
  activeIndex = +this.activeRoute.snapshot.queryParams.episodeIndex;
  anime = this.activeRoute.snapshot.data.anime;
  episodes: string[] = [...this.anime.episodes];

  constructor(
    private videoPlayerService: VideoPlayerService,
    private renderer: Renderer2,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.videoComponentInit(+this.activeIndex);
      this.playlistAutoplay();
      this.fluidPlayerInit({
        ...this.videoPlayerService.getVideoPlayerConfigs(),
        title: `${this.anime.name} Ep ${+this.activeIndex + 1}`,
      });
    }, 50);
  }

  private videoComponentInit(activeIndex: number): void {
    const videoEl = document.createElement('video');
    videoEl.classList.add('overflow-hidden', 'rounded-lg', 'w-full');
    videoEl.src =
      'http://localhost:8020/' +
      this.episodes[+activeIndex].split('\\').slice(1).join('/');
    videoEl.id = 'video_element_instance_' + this.activeIndex;
    videoEl.tabIndex = -1;
    const sourceEl = document.createElement('source');
    sourceEl.src =
      'http://localhost:8020/' +
      this.episodes[activeIndex].split('\\').slice(1).join('/');
    sourceEl.attributes.getNamedItem('data-fluid-hd');
    sourceEl.type = this.getEpisodesMimeType(this.episodes[+activeIndex]);

    videoEl.append(sourceEl);
    this.video = videoEl;

    this.videoContainer.nativeElement.insertBefore(
      videoEl,
      this.videoContainer.nativeElement.firstChild
    );
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

  private playlistAutoplay(): void {
    this.renderer.listen(this.video, 'ended', () => {
      this.router.navigate(['/library', 'watch', this.anime.id], {
        queryParams: {
          episodeIndex: +this.activeIndex + 1,
        },
      });
    });
  }

  private fluidPlayerInit(configs: any): void {
    if (this.video) {
      this.fluidPlayer?.destroy(); // Destory Previous Fluid Player Instance
      this.fluidPlayer = fluidPlayer(this.video, configs);
      this.addFluidPlayerCustomStyles();
    }
  }

  private addFluidPlayerCustomStyles(): void {
    (document.querySelector('.fluid_video_wrapper') as any).style.width =
      '100%';
    (document.querySelector('.fluid_video_wrapper') as any).style.height =
      '100%';
    (document.querySelector('.fluid_video_wrapper') as any).style.overflow =
      'hidden';
    (document.querySelector('.fluid_video_wrapper') as any).style.borderRadius =
      '.5rem';
  }
  
  ngOnDestroy(): void {
    // unfocus from Fluid Player element
    this.animeTitle.nativeElement.click(); 
    // then Destroy Fluid Player Instance in the DOM
    this.fluidPlayer.destroy();
  }
}

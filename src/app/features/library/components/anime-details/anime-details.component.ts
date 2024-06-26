import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  DeleteAnimeGQL,
  GetAllAnimesDocument,
  LikeAnimeGQL,
  UnlikeAnimeGQL,
} from 'src/app/core/services/graphql.service';

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.component.html',
  styleUrls: ['./anime-details.component.scss'],
})
export class AnimeDetailsComponent implements OnInit, OnDestroy {
  anime: any;
  private destroy$ = new Subject();
  private readonly snackbar = inject(MatSnackBar);

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private deleteAnimeGQL: DeleteAnimeGQL,
    private likeAnimeGQL: LikeAnimeGQL,
    private unlikeAnimeGQL: UnlikeAnimeGQL,
    private clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.activeRoute.data
      .pipe(
        takeUntil(this.destroy$),
        map(data => data.anime)
      )
      .subscribe(anime => {
        this.anime = {
          ...anime,
          status: anime.status.replace('_', ''),
          description:
            anime.description?.length === 0
              ? 'No Story Added.'
              : anime.description,
        };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.next();
  }

  copyAnimeName() {
    const operationSuccessfull = this.clipboard.copy(this.anime.name);
    if (operationSuccessfull) {
      this.snackbar.open('Copied To Clipboard!');
    } else {
      this.snackbar.open('Error Occured please try again');
    }
  }

  remove() {
    this.deleteAnimeGQL
      .mutate(
        { id: this.anime?.id },
        { refetchQueries: [{ query: GetAllAnimesDocument }] }
      )
      .subscribe(() => {
        setTimeout(() => {
          this.router.navigate(['/library']).then(() => {
            this.snackbar.open('Deleted Successfully');
          });
        }, 200);
      });
  }

  likeAnime(): void {
    this.likeAnimeGQL
      .mutate(
        { id: this.anime.id },
        { refetchQueries: [{ query: GetAllAnimesDocument }] }
      )
      .subscribe(updatedAt => {
        this.anime = { ...this.anime, liked: true };
      });
  }

  unlikeAnime(): void {
    this.unlikeAnimeGQL
      .mutate(
        { id: this.anime.id },
        { refetchQueries: [{ query: GetAllAnimesDocument }] }
      )
      .subscribe(updatedAt => {
        this.anime = { ...this.anime, liked: false };
      });
  }
}

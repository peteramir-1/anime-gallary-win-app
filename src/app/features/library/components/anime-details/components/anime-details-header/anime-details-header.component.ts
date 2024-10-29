import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  DeleteAnimeGQL,
  GetAllAnimesDocument,
  LikeAnimeGQL,
  UnlikeAnimeGQL,
} from 'src/app/core/services/graphql.service';

@Component({
  selector: 'app-anime-details-header',
  templateUrl: './anime-details-header.component.html',
  styleUrl: './anime-details-header.component.scss',
  host: {
    class: 'flex flex-initial flex-row gap-5',
  },
})
export class AnimeDetailsHeaderComponent {
  @Input({required: true}) anime: any;
  private readonly router = inject(Router);

  private readonly clipboard = inject(Clipboard);
  private readonly snackbar = inject(MatSnackBar);

  private readonly likeAnimeGQL = inject(LikeAnimeGQL);
  private readonly unlikeAnimeGQL = inject(UnlikeAnimeGQL);
  private readonly deleteAnimeGQL = inject(DeleteAnimeGQL);

  copyAnimeName() {
    const operationSuccessfull = this.clipboard.copy(this.anime.name);
    if (operationSuccessfull) {
      this.snackbar.open('Copied To Clipboard!');
    } else {
      this.snackbar.open('Error Occured please try again');
    }
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
}

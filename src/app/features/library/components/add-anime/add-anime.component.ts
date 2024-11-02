import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Status, Type } from 'src/app/core/services/graphql.service';
import { AddAnimeService } from '../../services/add-anime.service';

import { AnimeForm } from './add-anime.interface';
import { firstAnimeYear, thumbnailDefault } from './add-anime.model';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-anime',
  templateUrl: './add-anime.component.html',
  styleUrls: ['./add-anime.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAnimeComponent implements OnInit {
  private readonly snackbar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly destroyed = inject(DestroyRef);
  private readonly addAnimeService = inject(AddAnimeService);
  private readonly cd = inject(ChangeDetectorRef);

  /**
   * Anime Form Group
   *
   * @public
   * @readonly
   * @type {AnimeForm}
   */
  public readonly _animeForm = this.fb.group<AnimeForm>({
    name: this.fb.control('', Validators.required),
    story: this.fb.control(null),
    thumbnail: this.fb.control(undefined),
    numOfEpisodes: this.fb.control(1, [Validators.required, Validators.min(1)]),
    released: this.fb.control(null),
    season: this.fb.control(null),
    episodes: this.fb.array([this.fb.control('')]),
    status: this.fb.control(Status.Complete, Validators.required),
    type: this.fb.control(Type.Serie, Validators.required),
  });

  public get releasedOptions() {
    return Array.from(
      { length: new Date().getFullYear() - firstAnimeYear },
      (_, index) => new Date().getFullYear() - (index + 1)
    ).map(val => val.toString());
  }
  public readonly isEditMode =
    this.activeRoute.snapshot.params.id !== undefined;
  public readonly isMovie$ = this._animeForm.controls.type.valueChanges.pipe(
    map(type => type === 'movie')
  );

  private readonly id: string = this.activeRoute.snapshot.params.id;

  ngOnInit(): void {
    this.handleAnimeFormSideEffects();

    if (this.isEditMode) {
      this.updateAnimeForm();
    }

    this._animeForm.controls.episodes.valueChanges
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe(() => {
        this.cd.markForCheck();
      });
  }

  /**
   * handles every anime form value changes subscriptions
   *
   * @private
   * @returns {void}
   */
  private handleAnimeFormSideEffects(): void {
    this._animeForm.controls.numOfEpisodes.valueChanges
      .pipe(
        filter(
          numOfEpisodes =>
            numOfEpisodes !== undefined &&
            numOfEpisodes >= 1 &&
            this._animeForm.controls.numOfEpisodes.status === 'VALID' &&
            numOfEpisodes !== this._animeForm.controls.episodes.value.length
        ),
        takeUntilDestroyed(this.destroyed)
      )
      .subscribe(numOfEpisodes => {
        this.changeEpisodesArrayToMatch(numOfEpisodes);
      });

    this.isMovie$
      .pipe(takeUntilDestroyed(this.destroyed))
      .subscribe(isMovie => {
        if (isMovie) {
          this.disableStatusControl();
          this.disableNumOfEpisodesControl();
        } else {
          this.enableStatusControl();
          this.enableNumOfEpisodesControl();
        }
      });
  }

  /**
   * change episodes as form array value to match the current
   * number of episodes.
   *
   * @private
   * @param {number} numOfEpisode
   * @returns {void}
   */
  private changeEpisodesArrayToMatch(numOfEpisodes: number): void {
    const episodes = this._animeForm.controls.episodes.value;

    if (episodes.length > numOfEpisodes) {
      const remainingEpisodes = episodes.slice(0, numOfEpisodes);

      this.updateEpisodes(remainingEpisodes);
    }

    if (episodes.length < numOfEpisodes) {
      const addedEpisodes: string[] = Array(
        numOfEpisodes - episodes.length
      ).fill('');

      this.updateEpisodes(episodes.concat(addedEpisodes));
    }
  }

  private disableStatusControl(): void {
    this._animeForm.controls.status.setValue(Status.Complete);
    this._animeForm.controls.status.disable();
  }

  private disableNumOfEpisodesControl(): void {
    this._animeForm.controls.numOfEpisodes.setValue(1);
    this._animeForm.controls.numOfEpisodes.disable();
    this._animeForm.controls.numOfEpisodes.updateValueAndValidity();
  }

  private enableStatusControl(): void {
    this._animeForm.controls.status.enable();
    this._animeForm.controls.status.updateValueAndValidity();
  }

  private enableNumOfEpisodesControl(): void {
    this._animeForm.controls.numOfEpisodes.enable();
    this._animeForm.controls.numOfEpisodes.updateValueAndValidity();
  }

  /**
   * update anime form the recieved values of the router
   *
   * @private
   * @returns {void}
   */
  private updateAnimeForm(): void {
    const anime = this.activeRoute.snapshot.data.anime;

    this.updateEpisodes(anime.episodes);
    this._animeForm.patchValue({ ...anime });
  }

  /**
   * get Episodes from a folder to update anime episode from the files
   * in that folder automatically
   *
   * @public
   * @returns {void}
   */
  public selectEpisodesFromFolder(): void {
    this.addAnimeService
      .selectEpisodesFromFolder()
      .pipe(
        take(1),
        tap(episodes => {
          if (episodes.length === 0) {
            this.snackbar.open('No valid videos found!', 'dismiss');
          }
        }),
        filter(episodes => episodes?.length !== 0 && episodes !== undefined)
      )
      .subscribe(episodes => {
        this.updateEpisodes(episodes);
        this._animeForm.controls.numOfEpisodes.setValue(episodes.length);
        this._animeForm.markAsDirty();
      });
  }

  /**
   * update episodes inside anime form
   *
   * @param episodes {string[]}
   * @returns {void}
   */
  private updateEpisodes(episodes: string[]): void {
    this._animeForm.controls.episodes.clear();

    episodes.forEach(episode => {
      this._animeForm.controls.episodes.push(this.fb.control(episode));
    });
  }

  /**
   * set all values of episodes to an empty string
   *
   * @public
   * @returns {void}
   */
  public clearEpisodes(): void {
    this._animeForm.controls.episodes.controls.forEach(control => {
      control.setValue('');
    });
    this._animeForm.controls.episodes.markAsDirty();
  }

  /**
   * submit the anime form and send request accprdong to page type,
   * which is either update or add anime page
   *
   * @public
   * @returns {void}
   */
  public onSave(): void {
    const isAnimeFormChanged = this._animeForm.dirty;

    if (!this._animeForm.valid || !isAnimeFormChanged) return;

    if (this.isEditMode) {
      this.addAnimeService
        .editAnime({
          id: this.id,
          name: this._animeForm.controls.name.value,
          type: this._animeForm.controls.type.value,
          status: this._animeForm.controls.status.value,
          numOfEpisodes: this._animeForm.controls.numOfEpisodes.value,
          thumbnail:
            this._animeForm.controls.thumbnail.value ?? thumbnailDefault,
          description: this._animeForm.controls.story.value,
          season: this._animeForm.controls.season.value,
          released: this._animeForm.controls.released.value,
          episodes: this._animeForm.controls.episodes.value,
        })
        .subscribe(res => {
          const animeId = res.data.updateAnime.id;

          this.navigateToAnimePage(animeId).then(() => {
            this.snackbar.open('Updated Successfully');
          });
        });
    } else {
      this.addAnimeService
        .createAnime({
          name: this._animeForm.controls.name.value,
          type: this._animeForm.controls.type.value,
          status: this._animeForm.controls.status.value,
          numOfEpisodes: this._animeForm.controls.numOfEpisodes.value,
          thumbnail:
            this._animeForm.controls.thumbnail.value ?? thumbnailDefault,
          description: this._animeForm.controls.story.value,
          season: this._animeForm.controls.season.value,
          released: this._animeForm.controls.released.value,
          episodes: this._animeForm.controls.episodes.value,
        })
        .subscribe(res => {
          const animeId = res.data.createAnime.id;

          this.navigateToAnimePage(animeId).then(() => {
            this.snackbar.open('Created Successfully');
          });
        });
    }
  }

  /**
   * back to the previous page
   *
   * @public
   */
  public back(): void {
    if (this.isEditMode) {
      this.navigateToAnimePage(this.id);
    } else {
      this.navigateToLibrary();
    }
  }

  private navigateToAnimePage(id?: string): Promise<Boolean> {
    return this.router.navigate(['/library', 'details', id]);
  }

  private navigateToLibrary(): Promise<Boolean> {
    return this.router.navigate(['/library']);
  }
}

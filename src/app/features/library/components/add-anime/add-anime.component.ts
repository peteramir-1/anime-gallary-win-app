import { Component, OnInit, Renderer2, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetAllAnimesDocument,
  GetAnimeByIdDocument,
  Season,
  Status,
  Type,
  UpdateAnimeGQL,
  CreateAnimeGQL,
} from 'src/app/core/services/graphql.service';
import { ElectronService } from 'src/app/core/services/electron.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-anime',
  templateUrl: './add-anime.component.html',
  styleUrls: ['./add-anime.component.scss'],
})
export class AddAnimeComponent implements OnInit {
  private readonly thumbnailDefault = 'assets/pictures/no-image.webp';
  private readonly allowedVideoTypes = [
    'mp4',
    'flv',
    'mwv',
    'avi',
    'mpeg',
    'webm',
    '3gp',
    'ogv',
    'm3u8',
    'ts',
    'mov',
  ];

  private readonly snackbar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly electronService = inject(ElectronService);
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly createAnimeGql = inject(CreateAnimeGQL);
  private readonly updateAnimeGql = inject(UpdateAnimeGQL);
  private readonly renderer = inject(Renderer2);
  public readonly utilService = inject(UtilsService);

  anime = this.activeRoute.snapshot.data.anime;
  _animeForm = this.fb.group({
    uuid: this.fb.control<string | null>(null),
    name: this.fb.control<string>('', Validators.required),
    story: this.fb.control<string | null>(null),
    thumbnail: this.fb.control<string | undefined>(undefined),
    numOfEpisodes: this.fb.control<number>(1, [
      Validators.required,
      Validators.min(1),
    ]),
    released: this.fb.control<string>(null),
    season: this.fb.control<Season>(null),
    episodes: this.fb.array<FormControl<string>>([this.fb.control<string>('')]),
    status: this.fb.control<Status>(Status.Complete, Validators.required),
    type: this.fb.control<Type>(Type.Serie, Validators.required),
  });
  years = Array.from(
    { length: new Date().getFullYear() - 1917 },
    (_, index) => new Date().getFullYear() - (index + 1)
  ).map(val => val.toString());
  private _episodes = this._animeForm.get('episodes') as FormArray;
  enableScroll: () => void;

  constructor() {}

  ngOnInit(): void {
    this._animeForm.controls.numOfEpisodes.valueChanges.subscribe(
      numOfEpisodes => this.updateEpisodesArray(numOfEpisodes)
    );
    this._animeForm.controls.type.valueChanges.subscribe(type => {
      if (type === 'movie') {
        this._animeForm.controls.status.setValue(Status.Complete);
        this._animeForm.controls.status.disable();
        this._animeForm.controls.numOfEpisodes.setValue(1);
        this._animeForm.controls.numOfEpisodes.disable();
        this._animeForm.controls.numOfEpisodes.updateValueAndValidity();
      } else {
        this._animeForm.controls.status.enable();
        this._animeForm.controls.status.updateValueAndValidity();
        this._animeForm.controls.numOfEpisodes.enable();
        this._animeForm.controls.numOfEpisodes.updateValueAndValidity();
      }
    });
    if (!!this.anime) {
      this.updateAnimeFormValue(this.anime);
    }
  }
  private updateAnimeFormValue(anime: any) {
    this._animeForm.controls.uuid.setValue(anime.id);
    this._animeForm.controls.name.setValue(anime.name);
    this._animeForm.controls.story.setValue(anime.description);
    this._animeForm.controls.thumbnail.setValue(anime.thumbnail);
    this._animeForm.controls.numOfEpisodes.setValue(anime.numOfEpisodes);
    this._animeForm.controls.type.setValue(anime.type);
    this._animeForm.controls.status.setValue(anime.status);
    this._animeForm.controls.released.setValue(anime.released);
    this._animeForm.controls.season.setValue(anime.season);
    for (const [index, control] of this._episodes.controls.entries()) {
      control.setValue(anime.episodes[index]);
    }
  }

  updateEpisodesArray(currentNum: number) {
    const currentNumOfEpisodes = this._animeForm.controls.numOfEpisodes.value;
    if (currentNum < 1) {
      this._animeForm.controls.numOfEpisodes.setValue(1);
    }
    this.changeEpisodesArrayToMatch(currentNumOfEpisodes);
  }
  private changeEpisodesArrayToMatch(numOfEpisode: number) {
    if (numOfEpisode < this._episodes.length) {
      const length = this._episodes.length;
      for (let i = 0; i < length - numOfEpisode; i++) {
        this._episodes.removeAt(this._episodes.length - 1);
      }
    } else {
      const length = this._episodes.length;
      for (let i = 0; i < numOfEpisode - length; i++) {
        this._episodes.push(this.fb.control(''));
      }
    }
  }

  disableScroll() {
    this.enableScroll = this.renderer.listen(
      window,
      'keydown',
      this.preventDefaultForScrollKeys
    );
  }
  private preventDefaultForScrollKeys(e: any) {
    const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    if (keys[e.keyCode]) {
      e.preventDefault();
      return false;
    }
  }

  getEpisodesLength() {
    return Array(this._episodes.length);
  }

  selectEpisodesFromFolder() {
    if (this._animeForm.get('type').value === 'movie') return;
    this.electronService.selectFilesFromFolder().then(res => {
      if (!!res?.data) {
        if (res.data.length === 0) {
          this.resetEpisodes();
        } else {
          const files = this.sortEpisodesByNumber(
            this.filterEpisodesByExtensions(res.data, this.allowedVideoTypes)
          );
          this._animeForm.controls.numOfEpisodes.setValue(files.length);
          this.saveEpisodesToAnimeForm(files);
        }
      }
    });
  }
  private resetEpisodes() {
    this._animeForm.get('');
    this._episodes.clear();
    this._episodes.push(this.fb.control(''));
  }
  private filterEpisodesByExtensions(
    episodes: string[],
    extensions: string[]
  ): string[] {
    return episodes.filter(file =>
      extensions.some(extension => file.endsWith(extension))
    );
  }
  private sortEpisodesByNumber(files: string[]): string[] {
    return files.sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
  }
  private saveEpisodesToAnimeForm(files: string[]) {
    for (const [index, control] of this._episodes.controls.entries()) {
      control.setValue(files[index]);
    }
  }

  submit() {
    if (this._animeForm.valid) {
      if (this._animeForm.dirty) {
        if (!!this.anime) {
          this.editAnime(this.anime.id);
        } else {
          this.createAnime();
        }
      } else {
        if (!!this.anime) {
          this.router.navigate(['/library', 'details', this.anime.id]);
        }
      }
    }
  }

  private createAnime() {
    this.createAnimeGql
      .mutate(
        {
          createAnimeInput: {
            name: this._animeForm.controls.name.value,
            type: this._animeForm.controls.type.value,
            status: this._animeForm.controls.status.value,
            numOfEpisodes: this._animeForm.controls.numOfEpisodes.value,
            thumbnail:
              this._animeForm.controls.thumbnail.value ?? this.thumbnailDefault,
            description: this._animeForm.controls.story.value,
            season: this._animeForm.controls.season.value,
            released: this._animeForm.controls.released.value,
            episodes: this._animeForm.controls.episodes.value,
          },
        },
        {
          refetchQueries: [{ query: GetAllAnimesDocument }],
        }
      )
      .subscribe(res => {
        this.router
          .navigate(['/library', 'details', res.data.createAnime.id])
          .then(() => {
            this.snackbar.open('Created Successfully');
          });
      });
  }

  private editAnime(id: string) {
    this.updateAnimeGql
      .mutate(
        {
          updateAnimeInput: {
            id,
            name: this._animeForm.controls.name.value,
            type: this._animeForm.controls.type.value,
            status: this._animeForm.controls.status.value,
            numOfEpisodes: this._animeForm.controls.numOfEpisodes.value,
            thumbnail:
              this._animeForm.controls.thumbnail.value ?? this.thumbnailDefault,
            released: this._animeForm.controls.released.value,
            season: this._animeForm.controls.season.value,
            description: this._animeForm.controls.story.value,
            episodes: this._animeForm.controls.episodes.value,
          },
        },
        {
          refetchQueries: [
            { query: GetAnimeByIdDocument, variables: { animeId: id } },
          ],
        }
      )
      .subscribe(() => {
        this.router.navigate(['/library', 'details', id]).then(() => {
          this.snackbar.open('Updated Successfully');
        });
      });
  }

  back() {
    if (!!this.anime?.id) {
      this.router.navigate(['/library', 'details', this.anime?.id]);
    } else {
      this.router.navigate(['/library']);
    }
  }
}

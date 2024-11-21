import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { map, tap } from 'rxjs/operators';

import { ElectronService } from 'src/app/core/services/electron.service';
import { GetAnimesFromFolderGQL } from 'src/app/core/services/graphql.service';
import { AnimeFf } from 'src/app/core/services/graphql.service';

@Component({
  selector: 'app-anime-viewer',
  templateUrl: './anime-viewer.component.html',
  styleUrl: './anime-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeViewerComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  readonly animesFolder = this.formBuilder.control<string | undefined>(
    undefined
  );

  readonly animes = signal<AnimeFf[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | undefined>(undefined);

  private readonly prevAnimeFolder = signal(undefined);
  private readonly electronService = inject(ElectronService);
  private readonly getAnimesFromFolderGQL = inject(GetAnimesFromFolderGQL);

  private readonly destroyed = inject(DestroyRef).onDestroy(() => {
    this.animesFolderSubscribtion.unsubscribe();
  });
  animesFolderSubscribtion: Subscription;

  name = '';

  ngOnInit(): void {
    this.animesFolderSubscribtion = this.animesFolder.valueChanges.subscribe(
      () => this.updateAnimesList()
    );
  }

  selectAnimeFolder(): void {
    this.electronService.selectFolder().subscribe((path: string | false) => {
      if (!path || path === '') return;
      this.animesFolder.setValue(path);
    });
  }

  private updateAnimesList(): void {
    if (this.animesFolder.value !== this.prevAnimeFolder()) {
      this.fetchAnimes()
        .pipe(tap(() => this.loading.set(true)))
        .subscribe(
          (animes: AnimeFf[]) => {
            this.error.set(undefined);
            this.animes.set(animes);
          },
          err => {
            this.error.set(err.message);
            this.animes.set([]);
          },
          () => {
            this.loading.set(false);
          }
        );
    }
    this.prevAnimeFolder.set(this.animesFolder.value);
  }

  fetchAnimes(): any {
    return this.getAnimesFromFolderGQL
      .fetch({ folderPath: this.animesFolder.value })
      .pipe(map(res => res?.data?.animesFromFolder || []));
  }

  orderAnimes<T>(animes: T[]): T[][] {
    const animesList = [];
    let row = [];
    animes.forEach((anime, index) => {
      row.push(anime);

      if (row.length === 4 || animes.length - 1 === index) {
        animesList.push(row);
        row = [];
      }
    });
    return animesList;
  }
}

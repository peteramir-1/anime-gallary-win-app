import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';

import { map } from 'rxjs/operators';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  readonly animesFolder = this.formBuilder.control<string | undefined>(
    undefined
  );

  readonly animes = signal<AnimeFf[]>([]);
  readonly error = signal<string | undefined>(undefined);

  private readonly prevAnimeFolder = signal(undefined);
  private readonly electronService = inject(ElectronService);
  private readonly getAnimesFromFolderGQL = inject(GetAnimesFromFolderGQL);

  searchText = '';

  ngOnInit(): void {
    this.animesFolder.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateAnimesList());
  }

  selectAnimeFolder(): void {
    this.electronService.selectFolder().subscribe((path: string | false) => {
      if (!path || path === '') return;
      this.animesFolder.setValue(path);
    });
  }

  private updateAnimesList(): void {
    if (this.animesFolder.value !== this.prevAnimeFolder()) {
      this.fetchAnimes().subscribe(
        (animes: AnimeFf[]) => {
          this.error.set(undefined);
          this.animes.set(animes);
        },
        err => {
          this.error.set(err.message);
          this.animes.set([]);
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

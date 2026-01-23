import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { of } from 'rxjs';

import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { ElectronService } from 'src/app/core/services/electron.service';
import { GetAnimesFromFolderGQL } from 'src/app/core/services/graphql.service';
import { AnimeFf } from 'src/app/core/services/graphql.service';

@Component({
  selector: 'app-anime-viewer',
  templateUrl: './anime-viewer.component.html',
  styleUrl: './anime-viewer.component.scss',
  host: {
    class: 'h-full grid grid-rows-[auto_1fr] gap-5',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AnimeViewerComponent {
  private readonly electronService = inject(ElectronService);
  private readonly getAnimesFromFolderGQL = inject(GetAnimesFromFolderGQL);

  readonly placeholderClasses =
    'placeholder w-full font-semibold text-neutral-950 dark:text-white';

  readonly animesFolderPath = signal<string>('');
  readonly displayedAnimes = signal<AnimeFf[]>([]);
  readonly animes = signal<AnimeFf[]>([]);
  readonly error = signal<string | undefined>(undefined);

  searchText = '';

  /**
   * Fetches anime data from the selected folder path.
   *
   * This method uses the ElectronService to prompt the user to select a folder.
   * If a valid folder path is selected, it fetches the animes from the folder
   * using the GraphQL query GetAnimesFromFolderGQL.
   *
   * Updates the component state with the fetched anime data and folder path.
   * In case of an error, it sets the error message and clears the anime list.
   */
  getAnimeData(): void {
    this.electronService
      .selectFolder()
      .pipe(
        filter(folderPath => !!folderPath && folderPath !== ''),
        switchMap(folderPath =>
          this.getAnimesFromFolderGQL.fetch({ variables: { folderPath } }).pipe(
            map(res => ({
              folderPath,
              animes: res?.data?.animesFromFolder || [],
            })),
            tap(({ folderPath, animes }) => {
              this.error.set(undefined);
              this.animes.set(animes);
              this.displayedAnimes.set(animes.slice(0, 15));
              this.animesFolderPath.set(folderPath);
            })
          )
        ),
        catchError(err => {
          this.error.set(err.message);
          return of([]);
        })
      )
      .subscribe();
  }

  updateDisplayedAnimes() {
    const currentDisplayedAnimesLength = this.displayedAnimes().length;

    if (currentDisplayedAnimesLength === this.animes().length) return;

    const addedAnimes = this.animes().slice(
      currentDisplayedAnimesLength,
      currentDisplayedAnimesLength + 10
    );

    this.displayedAnimes.update(displayedAnimes =>
      displayedAnimes.concat(addedAnimes)
    );
  }
}

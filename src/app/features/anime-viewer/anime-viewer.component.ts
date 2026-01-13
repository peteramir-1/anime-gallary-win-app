import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { filter, map, switchMap } from 'rxjs/operators';

import { ElectronService } from 'src/app/core/services/electron.service';
import { GetAnimesFromFolderGQL } from 'src/app/core/services/graphql.service';
import { AnimeFf } from 'src/app/core/services/graphql.service';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
    selector: 'app-anime-viewer',
    templateUrl: './anime-viewer.component.html',
    styleUrl: './anime-viewer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AnimeViewerComponent {
  private readonly electronService = inject(ElectronService);
  private readonly getAnimesFromFolderGQL = inject(GetAnimesFromFolderGQL);

  readonly animesFolderPath = signal<string>('');
  readonly animes = signal<AnimeFf[]>([]);
  readonly error = signal<string | undefined>(undefined);

  searchText = '';

  readonly divideArrayIntoSubarrays =
    inject(HelperService).divideArrayIntoSubarrays;

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
          this.getAnimesFromFolderGQL.fetch({ folderPath }).pipe(
            map(res => ({
              folderPath,
              animes: res?.data?.animesFromFolder || [],
            }))
          )
        )
      )
      .subscribe(
        ({ folderPath, animes }) => {
          this.error.set(undefined);
          this.animes.set(animes);
          this.animesFolderPath.set(folderPath);
        },
        err => {
          this.error.set(err.message);
          this.animes.set([]);
        }
      );
  }
}

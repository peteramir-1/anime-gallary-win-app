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
})
export class AnimeViewerComponent {
  private readonly electronService = inject(ElectronService);
  private readonly getAnimesFromFolderGQL = inject(GetAnimesFromFolderGQL);

  readonly animesFolderPath = signal<string>('');
  readonly animes = signal<AnimeFf[]>([]);
  readonly error = signal<string | undefined>(undefined);

  searchText = '';

  getAnimeData(): void {
    this.electronService
      .selectFolder()
      .pipe(
        filter(folderPath => !!folderPath && folderPath !== ''),
        switchMap(folderPath =>
          this.getAnimesFromFolderGQL
            .fetch({ folderPath })
            .pipe(
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

  readonly divideArrayIntoSubarrays =
    inject(HelperService).divideArrayIntoSubarrays;
}

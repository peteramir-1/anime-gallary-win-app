import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';

import { map } from 'rxjs/operators';

import { ElectronService } from 'src/app/core/services/electron.service';
import { FileServingService } from 'src/app/core/services/file-serving.service';
import { GetAnimesFromFolderGQL } from 'src/app/core/services/graphql.service';

@Component({
  selector: 'app-anime-viewer',
  templateUrl: './anime-viewer.component.html',
  styleUrl: './anime-viewer.component.scss',
})
export class AnimeViewerComponent {
  animesFolder = new FormControl<string | undefined>(undefined);
  animes = [];
  loading = signal(false);

  private prevAnimeFolder = undefined;

  private readonly electronService = inject(ElectronService);
  private readonly getAnimesFromFolderGQL = inject(GetAnimesFromFolderGQL);
  private readonly fileServingService = inject(FileServingService);
  private readonly defaultThumbnail = '../../../assets/pictures/no-image.webp';

  selectAnimeFolder(): void {
    this.electronService.selectFolder().then((path: string | false) => {
      if (!path || path === '') return;
      this.animesFolder.setValue(path);
    });
  }

  updateAnimesList(): void {
    if (this.animesFolder.value !== this.prevAnimeFolder) {
      this.fetchAnimes()
        .pipe(tap(() => this.loading.set(true)))
        .subscribe(
          animes => {
            this.animes = animes;
          },
          err => {},
          () => this.loading.set(false)
        );
    }
    this.prevAnimeFolder = this.animesFolder.value;
  }

  private fetchAnimes() {
    return this.getAnimesFromFolderGQL
      .fetch({ folderPath: this.animesFolder.value })
      .pipe(
        map(res => res?.data?.animesFromFolder || []),
        map(animes => {
          return animes.map(anime => ({
            ...anime,
            thumbnail:
              this.fileServingService.convertPictureToFileServingPath(
                anime.thumbnail
              ) || this.defaultThumbnail,
          }));
        })
        )
        .subscribe(animes => {
          this.animes = animes;
        });
    }
    console.log("there's duplicate inputs");
    this.prevAnimeFolder = this.animesFolder.value;
  }
}

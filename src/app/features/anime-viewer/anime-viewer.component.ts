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

  private prevAnimeFolder = undefined;
  private electronService = inject(ElectronService);
  private getAnimesFromFolderGQL = inject(GetAnimesFromFolderGQL);
  private fileServingService = inject(FileServingService);

  selectAnimeFolder(): void {
    this.electronService.selectFolder().then((path: string | false) => {
      if (!path || path === '') return;
      this.animesFolder.setValue(path);
    });
  }

  updateAnimesList(): void {
    const defaultThumbnail = '../../../assets/pictures/no-image.webp';

    if (this.animesFolder.value !== this.prevAnimeFolder) {
      this.getAnimesFromFolderGQL
        .fetch({ folderPath: this.animesFolder.value })
        .pipe(
          map(res => res?.data?.animesFromFolder || []),
          map(animes => {
            return animes.map(anime => ({
              ...anime,
              thumbnail:
                this.fileServingService.convertPictureToFileServingPath(
                  anime.thumbnail
                ) || defaultThumbnail,
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

import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ElectronService } from 'src/app/core/services/electron.service';
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

  selectAnimeFolder(): void {
    this.electronService.selectFolder().then((path: string | false) => {
      if (!path || path === '') return;
      this.animesFolder.setValue(path);
    });
  }

  updateAnimesList(): void {
    if (this.animesFolder.value !== this.prevAnimeFolder) {
      this.getAnimesFromFolderGQL
        .fetch({ folderPath: this.animesFolder.value })
        .subscribe(animes => {
          if (animes.error) return;
          this.animes = animes.data.animesFromFolder;
        });
    }
    console.log("there's duplicate inputs");
    this.prevAnimeFolder = this.animesFolder.value;
  }
}

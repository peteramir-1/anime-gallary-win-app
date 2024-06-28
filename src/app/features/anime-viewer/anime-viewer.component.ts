import { Component, inject } from '@angular/core';
import { ElectronService } from 'src/app/core/services/electron.service';

@Component({
  selector: 'app-anime-viewer',
  templateUrl: './anime-viewer.component.html',
  styleUrl: './anime-viewer.component.scss',
})
export class AnimeViewerComponent {
  animesFolder = '';
  filteredAnimes = [];
  
  private prevAnimeFolder = ''
  private electronService = inject(ElectronService);

  selectAnimeFolder(): void {
    this.electronService.selectFolder().then((path: string | false) => {
      if (!path || path === '') return;
      this.animesFolder = path;
    });
  }

  updateAnimesList(): void {
    if(this.animesFolder !== this.prevAnimeFolder) {
      // Update animes list 
    }
    this.prevAnimeFolder = this.animesFolder;
  } 
}

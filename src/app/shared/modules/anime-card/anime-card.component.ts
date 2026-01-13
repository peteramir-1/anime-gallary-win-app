import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FileServingService,
  IMAGE,
  NO_IMAGE,
} from 'src/app/core/services/file-serving.service';
import { Anime, AnimeFf } from 'src/app/core/services/graphql.service';

@Component({
    selector: 'app-anime-card',
    templateUrl: './anime-card.component.html',
    styleUrls: ['./anime-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AnimeCardComponent implements OnInit {
  @Input() anime: Omit<Anime, 'createdAt' | 'updatedAt'> | AnimeFf;
  @Input({ required: true }) navigatable: boolean;

  private readonly router: Router = inject(Router);
  private readonly fileServingService = inject(FileServingService);

  animeThumbnail!: IMAGE | NO_IMAGE;

  ngOnInit(): void {
    this.animeThumbnail = this.fileServingService.convertPathToImage(
      this.anime.thumbnail
    );
  }

  navigateToAnimePage(id: string): void {
    if (this.navigatable === true) {
      this.router.navigate(['/library', 'details', id]);
    }
  }
}

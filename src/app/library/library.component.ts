import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent {
  searchResult = '';
  animes = this.activeRoute.data.pipe(map(data => data.animes));

  constructor(private activeRoute: ActivatedRoute) {}
}

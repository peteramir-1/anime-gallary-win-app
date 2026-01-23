import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  host: {
    class: 'h-full grid grid-rows-[auto_1fr] gap-5',
  },
  standalone: false,
})
export class LibraryComponent implements OnInit {
  animeNameSearch = '';
  animes: Observable<any[]> = inject(ActivatedRoute).data.pipe(
    map(data => data.animes),
    filter(animes => (!!animes ? animes : []))
  );
  filteredAnimes = new BehaviorSubject<any[]>([]);

  ngOnInit(): void {
    this.animes.toPromise().then(animes => {
      this.filteredAnimes.next(animes);
    });
  }

  /**
   * push the new value of the anime list after filtering by library header component to filtered anime property
   * @param animes new anime list after filtering by the header component
   */
  setNewAnimeList(animes: any[]) {
    this.filteredAnimes.next(animes);
  }

  /**
   * This function reassign animeNameSearch to apply the filter by name to anime list in the template using pipe
   * @param name name of the anime that we want search for
   */
  searchByName(name: string) {
    this.animeNameSearch = name;
  }
}

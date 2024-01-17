import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  GetAllAnimesGQL,
  GetAnimeByIdGQL,
} from 'src/app/core/services/graphql.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  constructor(
    private getAllAnimesGql: GetAllAnimesGQL,
    private getAnimbeByIdGql: GetAnimeByIdGQL,
    private router: Router
  ) {}

  getAllAnimes() {
    return this.getAllAnimesGql.fetch().pipe(
      // TODO: Handle Errors in an interceptor.
      catchError(err => {
        console.log('Unknown Error occured and it was handled', err);
        return of({ data: { animes: [] } });
      })
    );
  }

  getAnimeById(id: string) {
    return this.getAnimbeByIdGql.fetch({ animeId: id }).pipe(
      // TODO: Handle Errors in an interceptor.
      catchError(err => {
        console.log(err);
        this.router.navigate(['error']);
        return of({ data: { anime: undefined } });
      })
    );
  }
}

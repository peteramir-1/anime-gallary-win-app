import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnimeService } from 'src/app/core/services/anime.service';

@Injectable({
  providedIn: 'root',
})
export class AnimeResolver implements Resolve<any> {
  constructor(private animeService: AnimeService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.animeService
      .getAnimeById(route.params.id)
      .pipe(map(res => res.data.anime));
  }
}

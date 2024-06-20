import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAnimeByIdGQL } from 'src/app/core/services/graphql.service';

@Injectable({
  providedIn: 'root',
})
export class AnimeExistsGuard  {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.getAnimeByIdGQL
      .fetch({ animeId: route.params.id })
      .pipe(
        map(res => !!res.data.anime || this.router.createUrlTree(['error']))
      );
  }

  constructor(
    private getAnimeByIdGQL: GetAnimeByIdGQL,
    private router: Router
  ) {}
}

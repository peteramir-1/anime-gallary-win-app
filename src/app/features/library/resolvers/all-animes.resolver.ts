import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllAnimesGQL } from 'src/app/core/services/graphql.service';

@Injectable({
  providedIn: 'root',
})
export class AllAnimesResolver  {
  constructor(private getAllAnimesGql: GetAllAnimesGQL) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any[]> {
    return this.getAllAnimesGql.fetch().pipe(map(res => res.data.animes));
  }
}

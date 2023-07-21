import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllAnimesGQL } from 'src/app/graphql/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class AllAnimesResolver implements Resolve<any> {
  constructor(private getAllAnimesGql: GetAllAnimesGQL) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any[]> {
    return this.getAllAnimesGql.fetch().pipe(map(res => res.data.animes));
  }
}

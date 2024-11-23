import { inject, Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GetVideoPlayerSettingsGQL, GetVideoPlayerSettingsQuery } from 'src/app/core/services/graphql.service';

@Injectable({
  providedIn: 'root',
})
export class VideoPlayerSettingsResolver  {
  private getVideoPlayerSettingGQL = inject(GetVideoPlayerSettingsGQL);
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<GetVideoPlayerSettingsQuery['settings']> {
    return this.getVideoPlayerSettingGQL
      .fetch()
      .pipe(map(res => (res.data.settings)));
  }
}

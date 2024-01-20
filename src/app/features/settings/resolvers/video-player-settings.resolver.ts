import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GetVideoPlayerSettingsGQL } from 'src/app/core/services/graphql.service';

import { VideoPlayerSettings } from 'src/app/shared/interfaces/video-player.interface';

@Injectable({
  providedIn: 'root',
})
export class VideoPlayerSettingsResolver  {
  constructor(private getVideoPlayerSettingGQL: GetVideoPlayerSettingsGQL) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<VideoPlayerSettings> {
    return this.getVideoPlayerSettingGQL
      .fetch()
      .pipe(map(res => (res.data.settings as VideoPlayerSettings)));
  }
}

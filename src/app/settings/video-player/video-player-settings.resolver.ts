import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GetVideoPlayerSettingsGQL } from 'src/app/graphql/generated/graphql';

import { VideoPlayerSettings } from 'src/app/common/interfaces/video-player.interface';

@Injectable({
  providedIn: 'root',
})
export class VideoPlayerSettingsResolver implements Resolve<VideoPlayerSettings> {
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

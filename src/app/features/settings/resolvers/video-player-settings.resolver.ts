import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  GetVideoPlayerSettingsGQL,
  GetVideoPlayerSettingsQuery,
} from 'src/app/core/services/graphql.service';

@Injectable()
export class VideoPlayerSettingsResolver {
  private getVideoPlayerSettingGQL = inject(GetVideoPlayerSettingsGQL);

  resolve(): Observable<GetVideoPlayerSettingsQuery['settings']> {
    return this.getVideoPlayerSettingGQL
      .fetch()
      .pipe(map(res => res.data.settings));
  }
}

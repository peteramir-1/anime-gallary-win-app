import { Injectable } from '@angular/core';

import { environment as env } from 'src/environments/environment';

export interface IMAGE {
  exists: true;
  style: string;
  url: string;
  path: string;
  default: string;
}

export interface NO_IMAGE {
  exists: false;
  style: string;
  default: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileServingService {
  private readonly defaultThumbnail = '../../../assets/pictures/no-image.webp';

  convertPathToImage(path?: string | null): IMAGE | NO_IMAGE {
    if (path === undefined || path === null) {
      return {
        exists: false,
        style: `background-image: url("${this.defaultThumbnail}")`,
        default: this.defaultThumbnail
      };
    } else {
      const correctedPath = path?.replace(/\\/g, '\\\\');

      return {
        exists: true,
        style: `background-image: url("http://localhost:${env.port}/serve/picture?path=${correctedPath}")`,
        url: `http://localhost:${env.port}/serve/picture?path=${correctedPath}`,
        path: correctedPath,
        default: this.defaultThumbnail
      };
    }
  }
}

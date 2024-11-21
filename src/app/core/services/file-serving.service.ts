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

export interface VIDEO {
  exists: true;
  url: string;
  extension: string;
  mimeType: string;
  thumbnail: string | undefined;
}

export interface NO_VIDEO {
  exists: false;
  url: undefined;
  mimeType: 'video/mp4';
  thumbnail: string | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class FileServingService {
  private readonly defaultThumbnail = '../../../assets/pictures/no-image.webp';

  // Supported file types
  videosMimeTypes: { [string: string]: string } = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.flv': 'video/x-flv',
    '.mov': 'video/quicktime',
    '.ogv': 'video/ogg',
    '.ts': 'video/MP2T',
    '.m3u8': 'application/x-mpegURL',
  };

  convertPathToImage(path?: string | null): IMAGE | NO_IMAGE {
    if (path === undefined || path === null) {
      return {
        exists: false,
        style: `background-image: url("${this.defaultThumbnail}")`,
        default: this.defaultThumbnail,
      };
    } else {
      const correctedPath = path?.replace(/\\/g, '\\\\');

      return {
        exists: true,
        style: `background-image: url("http://localhost:${env.port}/serve/picture?path=${correctedPath}")`,
        url: `http://localhost:${env.port}/serve/picture?path=${correctedPath}`,
        path: correctedPath,
        default: this.defaultThumbnail,
      };
    }
  }

  /**
   * Convert a path to a video to a VIDEO or NO_VIDEO object. This function
   * returns a VIDEO object if the video path is defined, and a NO_VIDEO object
   * if the video path is undefined or null.
   *
   * If the video path is defined, the VIDEO object will contain the URL of the
   * video file, which is `http://localhost:${env.port}/serve/video?path=<videoPath>`.
   * This URL is used by the video player to play the video.
   *
   * If the video path is undefined or null, the NO_VIDEO object will contain
   * undefined as the URL of the video file. This is used by the video player to
   * show that the video is not available.
   *
   * Both the VIDEO and NO_VIDEO objects contain the thumbnail URL of the video.
   * If the thumbnail URL is undefined or null, the thumbnail URL will be
   * undefined in the returned object.
   *
   * @param videoPath The path to the video file.
   * @param thumbnail The thumbnail URL for the video.
   * @returns A VIDEO or NO_VIDEO object.
   */
  convertPathToVideo(
    videoPath: string | null | undefined,
    thumbnail?: string | null
  ): VIDEO | NO_VIDEO {
    // If the video path is undefined or null, return a NO_VIDEO object with
    // the given thumbnail.
    if (videoPath === undefined || videoPath === null) {
      return {
        exists: false,
        url: undefined,
        mimeType: 'video/mp4',
        thumbnail,
      };
    }

    // If the video path is defined, return a VIDEO object with the video URL and
    // the given thumbnail.
    const url = `http://localhost:${env.port}/serve/video?path=${videoPath}`;
    const parts = url.split('.');
    const extension = parts.length > 1 ? `.${parts.pop()}`.toLowerCase() : '';
    const mimeType = this.videosMimeTypes[extension];
    return {
      exists: true,
      url,
      extension,
      thumbnail,
      mimeType,
    };
  }
}

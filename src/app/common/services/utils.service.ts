import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  convertPathToBackgroundStyle(
    path?: string,
    defaultImage?: string
  ): string | undefined {
    if (!path || path === '') return defaultImage;
    return `background-image: url("${path}")`;
  }

  convertPathToValidPath(path: string | undefined): string {
    if (!path) return null;
    return `http://localhost:8020/${new String(path)
      .split('\\')
      .slice(1)
      .join('/')}`;
  }
}

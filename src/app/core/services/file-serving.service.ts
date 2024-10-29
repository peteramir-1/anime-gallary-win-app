import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileServingService {
  
  convertPictureToFileServingPath(path: string | null): string {
    if (path === null) return undefined;
    return `http://localhost:8020/serve/picture?path=${path}`
  }
}

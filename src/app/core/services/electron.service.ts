import { inject, Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { from, Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

interface SELECT_FILE_FROM_FOLDER {
  folderPath: string;
  data: string[];
}

type DialogResponse = string | null;

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private readonly ngxService = inject(NgxUiLoaderService);
  private windowAPI = (window as any)?.api || undefined;

  selectFolder(): Observable<DialogResponse> {
    this.ngxService.start();

    return from<Promise<DialogResponse>>(
      this.windowAPI?.selectFolder() as Promise<DialogResponse>
    ).pipe(
      take(1),
      finalize(() => {
        this.ngxService.stop();
      })
    );
  }

  selectFile(extensions: string[]): Observable<DialogResponse> {
    this.ngxService.start();

    return from(
      this.windowAPI?.selectFile(extensions) as Promise<DialogResponse>
    ).pipe(
      take(1),
      finalize(() => {
        this.ngxService.stop();
      })
    );
  }

  selectFilesFromFolder(): Observable<SELECT_FILE_FROM_FOLDER | null> {
    this.ngxService.start();

    return from(
      this.windowAPI?.selectFilesFromFolder() as Promise<SELECT_FILE_FROM_FOLDER | null>
    ).pipe(
      take(1),
      finalize(() => {
        this.ngxService.stop();
      })
    );
  }
}

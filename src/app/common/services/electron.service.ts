import { Injectable } from '@angular/core';

interface SELECT_FILE_FROM_FOLDER {
  folderPath: string;
  data: string[];
}

type DialogResponse = string | null;

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private windowAPI = (window as any)?.api || undefined;

  constructor() {}

  selectFolder(): Promise<DialogResponse> {
    return (this.windowAPI?.selectFolder() as Promise<DialogResponse>)?.catch(
      () => null
    );
  }

  selectFile(extensions: string[]): Promise<DialogResponse> {
    return (
      this.windowAPI?.selectFile(extensions) as Promise<DialogResponse>
    )?.catch(() => null);
  }

  selectFilesFromFolder(): Promise<SELECT_FILE_FROM_FOLDER | null> {
    return (
      this.windowAPI.selectFilesFromFolder() as Promise<SELECT_FILE_FROM_FOLDER | null>
    ).catch(() => null);
  }
}

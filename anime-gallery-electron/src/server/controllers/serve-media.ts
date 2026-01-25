import { RequestHandler } from 'express';
import { PathValidation } from '../helpers/path-vallidation';
import path from 'path';

export type mediaMimeTypes = { [ext: string]: string };

export abstract class ServeMediaExpressController extends PathValidation {
  protected abstract mediaMimeTypes: mediaMimeTypes;

  protected fileMime(filePath: string): string {
    return this.mediaMimeTypes[this.fileExtname(filePath)] || '';
  }

  protected isFileSupported(filePath: string): boolean {
    return typeof this.fileExtname(filePath) === 'string';
  }

  private fileExtname(filePath: string): string {
    return path.extname(filePath).toLowerCase();
  }

  abstract serve: RequestHandler;
}

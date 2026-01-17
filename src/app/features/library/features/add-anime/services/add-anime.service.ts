import { inject, Injectable } from '@angular/core';
import {
  CreateAnimeGQL,
  UpdateAnimeGQL,
  GetAllAnimesDocument,
  GetAnimeByIdDocument,
} from 'src/app/core/services/graphql.service';
import { CreatedAnime, UpdatedAnime } from '../interfaces/add-anime.interface';
import { ElectronService } from 'src/app/core/services/electron.service';
import { episodesExtensions } from '../models/add-anime.model';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AddAnimeService {
  private readonly createAnimeGql = inject(CreateAnimeGQL);
  private readonly updateAnimeGql = inject(UpdateAnimeGQL);
  private readonly electronService = inject(ElectronService);

  /**
   * Create Anime by graphql
   *
   * @public
   * @param {CreatedAnime} createdAnime
   * @returns {*}
   */
  public createAnime(createdAnime: CreatedAnime) {
    return this.createAnimeGql.mutate({
      variables: {
        createAnimeInput: {
          ...createdAnime,
        },
      },
      refetchQueries: [{ query: GetAllAnimesDocument }],
    });
  }

  /**
   * Update Anime by graphql
   *
   * @public
   * @param {UpdatedAnime} updatedAnime
   * @returns {*}
   */
  public editAnime(updatedAnime: UpdatedAnime) {
    return this.updateAnimeGql.mutate({
      variables: {
        updateAnimeInput: {
          ...updatedAnime,
        },
      },
      refetchQueries: [
        {
          query: GetAnimeByIdDocument,
          variables: { animeId: updatedAnime.id },
        },
      ],
    });
  }

  /**
   * use backend to fetch files urls from the hard drive
   * convert and sort them to a form that match "string[]" type
   *
   * note: it also handles any invalid data that is comming from
   * backend
   *
   * @public
   * @returns {Promise<string[] | undefined>}
   */
  public selectEpisodesFromFolder(): Observable<string[] | undefined> {
    return from(this.electronService.selectFilesFromFolder()).pipe(
      map(res => {
        const isDataInvalid = !res?.data;
        const isNoDataRecieved = res?.data?.length === 0;

        if (isDataInvalid) return undefined;

        if (isNoDataRecieved) {
          return undefined;
        } else {
          const recievedData = res.data;
          const episodes = this.extractEpisodes(recievedData);
          return this.sortEpisodes(episodes);
        }
      })
    );
  }

  /**
   * Extract episodes videos from files of a folder by using file extensions
   *
   * @public
   * @param {string[]} files
   * @returns {string[]}
   */
  public extractEpisodes(files: string[]): string[] {
    return files.filter(file =>
      episodesExtensions.some(extension => file.endsWith(extension))
    );
  }

  /**
   * sort links using numbers in video name
   *
   * @public
   * @param {string[]} files
   * @returns {string[]}
   */
  public sortEpisodes(files: string[]): string[] {
    return files.sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
  }
}

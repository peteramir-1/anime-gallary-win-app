import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { GraphQLError } from 'graphql';
import _ from 'lodash';
import { DirectoryDataHandler } from '../../helpers/models';

/**
 * Interface representing an Anime file/folder.
 */
export interface AnimeFF {
  id: string;
  directoryPath: string;
  type: 'serie' | 'movie';
  name: string;
  thumbnail?: string;
  episodes: string[];
}

/**
 * Class representing the Anime Viewer Model.
 */
export class AnimeViewerModel {
  private readonly pictureExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.tiff',
    '.psd',
    '.pdf',
    '.eps',
    '.ai',
    '.indd',
    '.raw',
  ];
  private readonly videoExtensions = [
    '.flv',
    '.mwv',
    '.mp4',
    '.avi',
    '.mpeg',
    '.webm',
    '.3gp',
    '.ogv',
    '.m3u8',
    '.ts',
    '.mov',
  ];

  private episodePromises: Promise<fs.Dirent[]>[] = [];
  private animesFiles: string[][] = [];
  private _animes: AnimeFF[] = [];

  /**
   * Gets the list of animes with their episodes and thumbnails.
   * @returns {AnimeFF[]} The list of animes.
   */
  get animes(): AnimeFF[] {
    return _.orderBy(this._animes, ['name'], ['asc']).map((anime, index) => {
      const files = this.animesFiles[index];
      const episodes = files.filter(file =>
        this.videoExtensions.includes(path.extname(file))
      );
      const thumbnail = files.find(file =>
        this.pictureExtensions.includes(path.extname(file))
      );

      return {
        id: anime.id,
        name: anime.name,
        directoryPath: anime.directoryPath,
        thumbnail: thumbnail
          ? path.join(anime.directoryPath, thumbnail)
          : undefined,
        type: episodes.length > 1 ? 'serie' : 'movie',
        episodes,
      };
    });
  }

  /**
   * Creates an instance of AnimeViewrModel.
   * @param {string} mainFolderPath - The main folder path where animes are stored.
   */
  constructor(private mainFolderPath: string) {}

  /**
   * Reads the main folder and initializes the animes and their episodes.
   * @returns {Promise<void>}
   */
  async readMainFolder(): Promise<void> {
    const directoryDataHandler = new DirectoryDataHandler();
    const mainFolderDirectories =
      await directoryDataHandler.readDirectoriesRecursively(
        this.mainFolderPath
      );
    const animes = this.removeDuplicateAnimes(
      this.convertDirectoriesToAnimes(mainFolderDirectories)
    );
    this._animes = animes;
    this.saveAllEpisodesPromises();
    this.animesFiles = await this.readAnimesDirectoryFiles();
  }

  /**
   * Converts directories to AnimeFF objects.
   * @param {fs.Dirent[]} dirents - The directory entries.
   * @returns {AnimeFF[]} The list of AnimeFF objects.
   */
  private convertDirectoriesToAnimes(dirents: fs.Dirent[]): AnimeFF[] {
    return _.orderBy(
      dirents
        .filter(dirent => dirent.isDirectory())
        .map<AnimeFF>(directory => ({
          id: v4(),
          name: directory.name,
          directoryPath: path.join(directory.parentPath, directory.name),
          thumbnail: undefined,
          episodes: [],
          type: 'movie',
        })),
      ['name'],
      ['asc']
    );
  }

  /**
   * Removes duplicated animes from the list.
   * @param {AnimeFF[]} animeList - The list of animes.
   * @returns {AnimeFF[]} The filtered list of unique animes.
   */
  private removeDuplicateAnimes(animeList: AnimeFF[]): AnimeFF[] {
    return animeList.filter(
      ({ name }) => !this.isDuplicatedAnime(animeList, name)
    );
  }

  /**
   * Checks if an anime is duplicated.
   * @param {AnimeFF[]} animes - The list of animes.
   * @param {string} name - The name of the anime.
   * @returns {boolean} True if the anime is duplicated, false otherwise.
   */
  private isDuplicatedAnime(animes: AnimeFF[], name: string): boolean {
    return animes.some(({ directoryPath }) => {
      const parentDirPath = path.resolve(directoryPath, '..');
      const parentDirName = path.basename(parentDirPath);
      return name === parentDirName;
    });
  }

  /**
   * Saves all episode promises for reading anime directories.
   */
  private saveAllEpisodesPromises(): void {
    const sortedAnimes = _.orderBy(this._animes, ['name'], ['asc']);

    sortedAnimes.forEach(({ directoryPath }) => {
      const readDirectoryPromise =
        this.createReadDirectoryPromise(directoryPath);

      this.episodePromises.push(readDirectoryPromise);
    });
  }

  /**
   * Creates a promise to read an anime directory.
   * @param {string} dirPath - The path of the directory.
   * @returns {Promise<fs.Dirent[]>} The promise to read the directory.
   */
  private async createReadDirectoryPromise(
    dirPath: string
  ): Promise<fs.Dirent[]> {
    try {
      const directoryEntries = await fs.promises.readdir(path.join(dirPath), {
        encoding: 'utf-8',
        withFileTypes: true,
      });
      return directoryEntries.filter(entry => entry.isFile());
    } catch (error) {
      throw new GraphQLError('Error reading directory in anime directories', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          origin: error,
        },
      });
    }
  }

  /**
   * Reads the files in the anime directories.
   * @returns {Promise<string[][]>} The list of files in each anime directory.
   */
  private async readAnimesDirectoryFiles(): Promise<string[][]> {
    const animeDirectoryFiles = await Promise.all(this.episodePromises);
    return animeDirectoryFiles.map(episodes =>
      episodes.map(episode => episode.name)
    );
  }
}

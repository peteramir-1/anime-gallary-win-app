import * as fs from 'fs';
import * as path from 'path';
import { v4 } from 'uuid';

export interface AnimeFF {
  id: string;
  type: 'serie' | 'movie';
  name: string;
  thumbnail?: string;
  episodes: string[];
}

const pictureExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'tiff',
  'psd',
  'pdf',
  'eps',
  'ai',
  'indd',
  'raw',
];
const videoExtensions = [
  'flv',
  'mwv',
  'mp4',
  'avi',
  'mpeg',
  'webm',
  '3gp',
  'ogv',
  'm3u8',
  'ts',
  'mov',
];

export const readFolders = (pathUrl: string) => {
  const dirents = fs.readdirSync(pathUrl, {
    withFileTypes: true,
  });
  return dirents.filter(dirent => dirent.isDirectory());
};

export const getAnimes = (foldersList: fs.Dirent[]) => {
  const animes: AnimeFF[] = [];

  foldersList.forEach(folder => {
    const deepDirent = fs.readdirSync(path.join(folder.path, folder.name), {
      withFileTypes: true,
    });

    const id = v4();
    let anime: AnimeFF = {
      id,
      name: folder.name,
      type: 'movie',
      thumbnail: undefined,
      episodes: [],
    };

    deepDirent.forEach(dirent => {
      const isDirectory = dirent.isDirectory();
      const isVideo = videoExtensions.includes(getExtension(dirent.name));
      const isPicture = pictureExtensions.includes(getExtension(dirent.name));
      if (!isDirectory && isPicture) {
        anime.thumbnail = path.join(dirent.path, dirent.name);
      } else if (!isDirectory && isVideo) {
        anime.episodes.push(path.join(dirent.path, dirent.name));
      } else if (isDirectory) {
        const folders = readFolders(dirent.path);
        const deepAnimes = getAnimes(folders);
        deepAnimes.forEach(deepAnime => {
          const isDuplicate = animes.some(
            anime => anime.name === deepAnime.name
          );
          if (!isDuplicate) animes.push(deepAnime);
        });
      }
    });

    if (anime.episodes.length === 1) anime.type = 'movie';
    if (anime.episodes.length > 1) anime.type = 'serie';
    if (anime.episodes.length !== 0) animes.push(anime);
  });
  return animes.map(anime => anime);
};

const getExtension = (filename: string) => {
  const namePieces = filename.split('.');
  return namePieces[namePieces.length - 1].toLowerCase().trim();
};

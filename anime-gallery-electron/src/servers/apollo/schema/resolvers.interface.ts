export type STATUS = 'complete' | 'incomplete';
export type TYPE = 'movie' | 'serie' | 'ova';

export interface CreateAnimeInput {
  name: string;
  status: STATUS;
  type: TYPE;
  numOfEpisodes?: number;
  description?: string;
  thumbnail?: string;
  episodes?: string[];
}

export interface UpdateAnimeInput {
  id: string;
  name?: string;
  description?: string;
  thumbnail?: string;
  numOfEpisodes?: number;
  status?: STATUS;
  type?: TYPE;
  episodes?: string[];
}

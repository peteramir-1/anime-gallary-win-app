// Helper type
type NumberFields<T> = {
  [P in keyof T]: number;
};
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
type RequiredField<T, K extends keyof T, Y extends keyof T> = Omit<
  Omit<Nullable<Omit<T, K>> & Required<Pick<T, K>>, BooleanBDAnimeFields>,
  'createdAt' | 'updatedAt'
> &
  Required<NumberFields<Pick<T, Y>>> & {
    createdAt?: string | null;
    updatedAt?: string | null;
  };

export type STATUS = 'complete' | 'incomplete';
export type TYPE = 'movie' | 'serie' | 'ova';

export type Episode = string;

export interface Anime {
  id: string;
  name: string;
  description?: string | null;
  numOfEpisodes?: number | null;
  thumbnail?: string | null;
  status?: STATUS | null;
  type?: TYPE | null;
  released?: string | null;
  season?: string | null;
  liked?: boolean | null;
  episodes?: Episode[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

type RequiredDBAnimeFields = 'id' | 'name';
type BooleanBDAnimeFields = 'liked';

export type DBAnime = RequiredField<
  Anime,
  RequiredDBAnimeFields,
  BooleanBDAnimeFields
>;

export interface DBEpisode {
  anime_id: string;
  link: string;
}

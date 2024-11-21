import { FormArray, FormControl } from '@angular/forms';
import { Season, Status, Type } from 'src/app/core/services/graphql.service';

export interface AnimeForm {
  name: FormControl<string>;
  story: FormControl<string | null>;
  thumbnail?: FormControl<string>;
  numOfEpisodes: FormControl<number>;
  released: FormControl<string | null>;
  season: FormControl<Season>;
  episodes: FormArray<FormControl<string>>;
  status: FormControl<Status>;
  type: FormControl<Type>;
}

export interface CreatedAnime {
  name: string;
  description: string | null;
  thumbnail: string;
  numOfEpisodes: number;
  released: string | null;
  season: Season;
  episodes: string[];
  status: Status;
  type: Type;
}

export interface UpdatedAnime {
  id: string,
  name: string;
  description: string | null;
  thumbnail: string;
  numOfEpisodes: number;
  released: string | null;
  season: Season;
  episodes: string[];
  status: Status;
  type: Type;
}

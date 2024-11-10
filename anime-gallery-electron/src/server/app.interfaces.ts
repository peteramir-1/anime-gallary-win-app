import * as http from 'http';
import { AnimesDbModel } from './graphql/models/animes/animesModel';
import { SettingsDbModel } from './graphql/models/settings/settingsModel';

export interface TContext {
  animesDbModel: AnimesDbModel;
  settingsDbModel: SettingsDbModel;
}

export interface APPLICATION_SERVER {
  start(): Promise<http.Server>;
  close(): Promise<void>;
}

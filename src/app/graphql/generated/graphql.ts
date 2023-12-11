import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
}

export interface Anime {
  __typename?: 'Anime';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  episodes: Array<Maybe<Scalars['String']['output']>>;
  id: Scalars['ID']['output'];
  liked?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  numOfEpisodes?: Maybe<Scalars['Int']['output']>;
  released?: Maybe<Scalars['String']['output']>;
  season?: Maybe<Season>;
  status: Status;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: Type;
  updatedAt?: Maybe<Scalars['String']['output']>;
}

export interface CreateAnimeInput {
  description?: InputMaybe<Scalars['String']['input']>;
  episodes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  liked?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  numOfEpisodes?: InputMaybe<Scalars['Int']['input']>;
  released?: InputMaybe<Scalars['String']['input']>;
  season?: InputMaybe<Season>;
  status: Status;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  type: Type;
}

export interface DeleteReturn {
  __typename?: 'DeleteReturn';
  affectedRows?: Maybe<Scalars['Int']['output']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  createAnime?: Maybe<Anime>;
  deleteAnime?: Maybe<DeleteReturn>;
  updateAnime?: Maybe<Anime>;
}


export interface MutationCreateAnimeArgs {
  animeInput?: InputMaybe<CreateAnimeInput>;
}


export interface MutationDeleteAnimeArgs {
  id: Scalars['ID']['input'];
}


export interface MutationUpdateAnimeArgs {
  animeInput?: InputMaybe<UpdateAnimeInput>;
}

export interface Query {
  __typename?: 'Query';
  anime?: Maybe<Anime>;
  animes?: Maybe<Array<Maybe<Anime>>>;
}


export interface QueryAnimeArgs {
  id: Scalars['String']['input'];
}

export enum Season {
  Autumn = 'autumn',
  Spring = 'spring',
  Summer = 'summer',
  Winter = 'winter'
}

export enum Status {
  Complete = 'complete',
  Incomplete = 'incomplete'
}

export enum Type {
  Movie = 'movie',
  Ova = 'ova',
  Serie = 'serie'
}

export interface UpdateAnimeInput {
  description?: InputMaybe<Scalars['String']['input']>;
  episodes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id: Scalars['ID']['input'];
  liked?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  numOfEpisodes?: InputMaybe<Scalars['Int']['input']>;
  released?: InputMaybe<Scalars['String']['input']>;
  season?: InputMaybe<Season>;
  status?: InputMaybe<Status>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Type>;
}

export type CreateAnimeMutationVariables = Exact<{
  createAnimeInput?: InputMaybe<CreateAnimeInput>;
}>;


export type CreateAnimeMutation = { __typename?: 'Mutation', createAnime?: { __typename?: 'Anime', id: string, name: string, description?: string | null, numOfEpisodes?: number | null, status: Status, thumbnail?: string | null, type: Type, released?: string | null, season?: Season | null, episodes: Array<string | null>, createdAt: string, updatedAt?: string | null } | null };

export type UpdateAnimeMutationVariables = Exact<{
  updateAnimeInput?: InputMaybe<UpdateAnimeInput>;
}>;


export type UpdateAnimeMutation = { __typename?: 'Mutation', updateAnime?: { __typename?: 'Anime', id: string, name: string, description?: string | null, numOfEpisodes?: number | null, status: Status, thumbnail?: string | null, type: Type, released?: string | null, season?: Season | null, episodes: Array<string | null>, createdAt: string, updatedAt?: string | null } | null };

export type DeleteAnimeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAnimeMutation = { __typename?: 'Mutation', deleteAnime?: { __typename?: 'DeleteReturn', affectedRows?: number | null } | null };

export type LikeAnimeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LikeAnimeMutation = { __typename?: 'Mutation', updateAnime?: { __typename?: 'Anime', updatedAt?: string | null } | null };

export type UnlikeAnimeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnlikeAnimeMutation = { __typename?: 'Mutation', updateAnime?: { __typename?: 'Anime', updatedAt?: string | null } | null };

export type GetAllAnimesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnimesQuery = { __typename?: 'Query', animes?: Array<{ __typename?: 'Anime', description?: string | null, episodes: Array<string | null>, id: string, thumbnail?: string | null, name: string, numOfEpisodes?: number | null, liked?: boolean | null, released?: string | null, season?: Season | null, type: Type, status: Status } | null> | null };

export type GetAnimeByIdQueryVariables = Exact<{
  animeId: Scalars['String']['input'];
}>;


export type GetAnimeByIdQuery = { __typename?: 'Query', anime?: { __typename?: 'Anime', description?: string | null, episodes: Array<string | null>, id: string, thumbnail?: string | null, name: string, numOfEpisodes?: number | null, type: Type, liked?: boolean | null, status: Status, released?: string | null, season?: Season | null } | null };

export type GetAnimeEpisdoesByIdQueryVariables = Exact<{
  animeId: Scalars['String']['input'];
}>;


export type GetAnimeEpisdoesByIdQuery = { __typename?: 'Query', anime?: { __typename?: 'Anime', episodes: Array<string | null> } | null };

export const CreateAnimeDocument = gql`
    mutation CreateAnime($createAnimeInput: CreateAnimeInput) {
  createAnime(animeInput: $createAnimeInput) {
    id
    name
    description
    numOfEpisodes
    status
    thumbnail
    type
    released
    season
    episodes
    createdAt
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateAnimeGQL extends Apollo.Mutation<CreateAnimeMutation, CreateAnimeMutationVariables> {
    document = CreateAnimeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateAnimeDocument = gql`
    mutation UpdateAnime($updateAnimeInput: UpdateAnimeInput) {
  updateAnime(animeInput: $updateAnimeInput) {
    id
    name
    description
    numOfEpisodes
    status
    thumbnail
    type
    released
    season
    episodes
    createdAt
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateAnimeGQL extends Apollo.Mutation<UpdateAnimeMutation, UpdateAnimeMutationVariables> {
    document = UpdateAnimeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteAnimeDocument = gql`
    mutation DeleteAnime($id: ID!) {
  deleteAnime(id: $id) {
    affectedRows
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteAnimeGQL extends Apollo.Mutation<DeleteAnimeMutation, DeleteAnimeMutationVariables> {
    document = DeleteAnimeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LikeAnimeDocument = gql`
    mutation likeAnime($id: ID!) {
  updateAnime(animeInput: {id: $id, liked: true}) {
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LikeAnimeGQL extends Apollo.Mutation<LikeAnimeMutation, LikeAnimeMutationVariables> {
    document = LikeAnimeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UnlikeAnimeDocument = gql`
    mutation unlikeAnime($id: ID!) {
  updateAnime(animeInput: {id: $id, liked: false}) {
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UnlikeAnimeGQL extends Apollo.Mutation<UnlikeAnimeMutation, UnlikeAnimeMutationVariables> {
    document = UnlikeAnimeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAllAnimesDocument = gql`
    query GetAllAnimes {
  animes {
    description
    episodes
    id
    thumbnail
    name
    numOfEpisodes
    liked
    released
    season
    type
    status
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllAnimesGQL extends Apollo.Query<GetAllAnimesQuery, GetAllAnimesQueryVariables> {
    document = GetAllAnimesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAnimeByIdDocument = gql`
    query GetAnimeById($animeId: String!) {
  anime(id: $animeId) {
    description
    episodes
    id
    thumbnail
    name
    numOfEpisodes
    type
    liked
    status
    released
    season
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAnimeByIdGQL extends Apollo.Query<GetAnimeByIdQuery, GetAnimeByIdQueryVariables> {
    document = GetAnimeByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetAnimeEpisdoesByIdDocument = gql`
    query GetAnimeEpisdoesById($animeId: String!) {
  anime(id: $animeId) {
    episodes
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAnimeEpisdoesByIdGQL extends Apollo.Query<GetAnimeEpisdoesByIdQuery, GetAnimeEpisdoesByIdQueryVariables> {
    document = GetAnimeEpisdoesByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
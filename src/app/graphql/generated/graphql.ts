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
  name: Scalars['String']['output'];
  numOfEpisodes?: Maybe<Scalars['Int']['output']>;
  status: Status;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: Type;
  updatedAt?: Maybe<Scalars['String']['output']>;
}

export interface CreateAnimeInput {
  description?: InputMaybe<Scalars['String']['input']>;
  episodes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name: Scalars['String']['input'];
  numOfEpisodes?: InputMaybe<Scalars['Int']['input']>;
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

export enum Status {
  Complete = 'complete',
  InComplete = 'in_complete'
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
  name?: InputMaybe<Scalars['String']['input']>;
  numOfEpisodes?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Status>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Type>;
}

export type CreateAnimeMutationVariables = Exact<{
  createAnimeInput?: InputMaybe<CreateAnimeInput>;
}>;


export type CreateAnimeMutation = { __typename?: 'Mutation', createAnime?: { __typename?: 'Anime', id: string, name: string, description?: string | null, numOfEpisodes?: number | null, status: Status, thumbnail?: string | null, type: Type, episodes: Array<string | null>, createdAt: string, updatedAt?: string | null } | null };

export type UpdateAnimeMutationVariables = Exact<{
  updateAnimeInput?: InputMaybe<UpdateAnimeInput>;
}>;


export type UpdateAnimeMutation = { __typename?: 'Mutation', updateAnime?: { __typename?: 'Anime', id: string, name: string, description?: string | null, numOfEpisodes?: number | null, status: Status, thumbnail?: string | null, type: Type, episodes: Array<string | null>, createdAt: string, updatedAt?: string | null } | null };

export type DeleteAnimeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAnimeMutation = { __typename?: 'Mutation', deleteAnime?: { __typename?: 'DeleteReturn', affectedRows?: number | null } | null };

export type GetAllAnimesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAnimesQuery = { __typename?: 'Query', animes?: Array<{ __typename?: 'Anime', description?: string | null, episodes: Array<string | null>, id: string, thumbnail?: string | null, name: string, numOfEpisodes?: number | null, type: Type, status: Status } | null> | null };

export type GetAnimeByIdQueryVariables = Exact<{
  animeId: Scalars['String']['input'];
}>;


export type GetAnimeByIdQuery = { __typename?: 'Query', anime?: { __typename?: 'Anime', description?: string | null, episodes: Array<string | null>, id: string, thumbnail?: string | null, name: string, numOfEpisodes?: number | null, type: Type, status: Status } | null };

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
export const GetAllAnimesDocument = gql`
    query GetAllAnimes {
  animes {
    description
    episodes
    id
    thumbnail
    name
    numOfEpisodes
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
    status
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `
  enum STATUS {
    complete
    incomplete
  }

  enum TYPE {
    movie
    serie
    ova
  }

  enum SEASON {
    summer
    winter
    spring
    autumn
  }

  type DeleteReturn {
    affectedRows: Int
  }

  type Anime {
    id: ID!
    name: String!
    description: String
    numOfEpisodes: Int
    status: STATUS!
    thumbnail: String
    type: TYPE!
    released: String
    season: SEASON
    liked: Boolean
    episodes: [String]!
    createdAt: String!
    updatedAt: String
  }

  type Query {
    animes: [Anime]
    anime(id: String!): Anime
  }

  input CreateAnimeInput {
    name: String!
    description: String
    thumbnail: String
    numOfEpisodes: Int
    status: STATUS!
    type: TYPE!
    released: String
    liked: Boolean
    season: SEASON
    episodes: [String]
  }

  input UpdateAnimeInput {
    id: ID!
    name: String
    description: String
    numOfEpisodes: Int
    thumbnail: String
    status: STATUS
    type: TYPE
    released: String
    liked: Boolean
    season: SEASON
    episodes: [String]
  }

  type Mutation {
    createAnime(animeInput: CreateAnimeInput): Anime
    updateAnime(animeInput: UpdateAnimeInput): Anime
    deleteAnime(id: ID!): DeleteReturn
  }
`;
//# sourceMappingURL=types.js.map
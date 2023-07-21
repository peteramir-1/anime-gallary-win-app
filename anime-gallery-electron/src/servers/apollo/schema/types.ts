export const typeDefs = `
  enum STATUS {
    complete
    in_complete
  }

  enum TYPE {
    movie
    serie
    ova
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
    episodes: [String]
  }

  type Mutation {
    createAnime(animeInput: CreateAnimeInput): Anime
    updateAnime(animeInput: UpdateAnimeInput): Anime
    deleteAnime(id: ID!): DeleteReturn
  }
`;

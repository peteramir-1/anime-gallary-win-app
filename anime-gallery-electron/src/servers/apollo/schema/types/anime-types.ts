export const animeTypeDefs = `
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

  type AnimeFF {
    id: ID!
    name: String!
    type: String!
    thumbnail: String
    episodes: [String]!
  }

  type Query {
    animes: [Anime]
    anime(id: String!): Anime
    animesFromFolder(mainFolderPath: String!): [AnimeFF]
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

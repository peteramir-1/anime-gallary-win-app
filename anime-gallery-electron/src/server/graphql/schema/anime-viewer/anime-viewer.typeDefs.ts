export const animeViewerTypeDefs = `
  type AnimeFF {
    id: ID!
    name: String!
    type: String!
    thumbnail: String
    episodes: [String]!
  }

  type Query {
    animesFromFolder(mainFolderPath: String!): [AnimeFF]
  }
`;

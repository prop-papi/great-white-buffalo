import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  user(username: String): User
  allUsers: [User]
}

type User {
  id: Int
  username: String
  aboutMe: String
  bets: [Bet]
}

type Bet {
  id: Int
  description: String
  wager: Int
  creator: User
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;

import { makeExecutableSchema, addResolveFunctionsToSchema } from 'graphql-tools';
import resolvers from './resolvers';
import testResolvers from './testResolvers'
const typeDefs = `
type Query {
  user(username: String): User
  allBets: [Bet]
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
  creator: Int
  club: Int
  user: User
}

type Mutation {
  addBet(description: String, wager: Int, creator: Int, club: Int): Bet
}
`;

let schema = makeExecutableSchema({ typeDefs, resolvers });
//addResolveFunctionsToSchema(schema, testResolvers);
export default schema;

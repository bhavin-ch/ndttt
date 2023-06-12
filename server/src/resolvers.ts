import { GraphQLScalarType, Kind } from 'graphql';
import {
  createGame,
  login,
  createUser,
  getAllUsers,
  getUserById,
  getAllGames,
} from './services';

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      if (value instanceof Date) {
        return value.getTime();
      }
      throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
      if (typeof value === 'number') {
        return new Date(value);
      }
      throw new Error('GraphQL Date Scalar parser expected a `number`');
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10));
      }
      return null;
    },
  }),
  Query: {
    users: async () => getAllUsers(),
    user: async (_, { id }) => getUserById(id),
    games: async () => getAllGames(),
  },
  Mutation: {
    createUser: (_parent, { input }) => {
      return createUser(input);
    },
    createGame: (_parent, { input }) => {
      return createGame(input);
    },
    login: (_parent, { input }) => {
      const { username, password } = input;
      return login(username, password);
    }
  },
};
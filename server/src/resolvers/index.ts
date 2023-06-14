import { GraphQLResolveInfo } from 'graphql';
import {
  createGame,
  createUser,
  getAllGames,
  getAllUsers,
  getUserById,
  login,
} from '../services';
import { buildQuery } from '../utils/resolver.util';
import { DateScalar } from './date.resolver';

export const resolvers = {
  Date: DateScalar,
  Query: {
    users: async (_parent: any, _args: unknown, _context: unknown, info: GraphQLResolveInfo) => 
      getAllUsers(buildQuery(info)),
    user: async (_parent: unknown, { id }: any, _context: unknown, info: GraphQLResolveInfo) => 
      getUserById(id, buildQuery(info)),
    games: async (_parent: unknown, _args: unknown, _context: unknown, info: GraphQLResolveInfo) => 
      getAllGames(buildQuery(info)),
  },
  Mutation: {
    createUser: (_parent: unknown, { input }: any, _context: unknown, info: GraphQLResolveInfo) => 
      createUser(input, buildQuery(info)),
    createGame: (_parent: unknown, { input }: any, _context: unknown, info: GraphQLResolveInfo) => 
      createGame(input, buildQuery(info)),
    login: (_parent: unknown, { input }: any, _context: unknown) => {
      const { username, password } = input;
      return login(username, password);
    }
  },
};
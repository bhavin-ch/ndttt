import { ResolveTree, parseResolveInfo, simplifyParsedResolveInfoFragmentWithType } from 'graphql-parse-resolve-info';
import {
  createGame,
  createUser,
  getAllGames,
  getAllUsers,
  getUserById,
  login,
} from '../services';
import { DateScalar } from './date.resolver';
import { GraphQLResolveInfo } from 'graphql';
import { buildQuery } from '../utils/resolver.util';

export const resolvers = {
  Date: DateScalar,
  Query: {
    users: async (_parent: any, _args: any, _context: any, info: GraphQLResolveInfo) => {
      const select = buildQuery(info);
      return getAllUsers(select)
    },
    user: async (_: any, { id }: any, _context: any, info: GraphQLResolveInfo) => {
      const select = buildQuery(info);
      getUserById(id, select);
    },
    games: async (_parent: any, _args: any, _context: any, info: GraphQLResolveInfo) => {      
      const select = buildQuery(info);
      return getAllGames(select);
    },
  },
  Mutation: {
    createUser: (_parent: any, { input }: any, _context: any, info: GraphQLResolveInfo) => {
      const select = buildQuery(info);
      return createUser(input, select);
    },
    createGame: (_parent: any, { input }: any, _context: any, info: GraphQLResolveInfo) => {
      const select = buildQuery(info);
      return createGame(input, select);
    },
    login: (_parent: any, { input }: any, _context: any) => {
      const { username, password } = input;
      return login(username, password);
    }
  },
};
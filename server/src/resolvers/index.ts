import { GraphQLResolveInfo } from 'graphql';
import {
  archiveGame,
  createGame,
  createUser,
  getAllGames,
  getAllUsers,
  getUserById,
  joinGame,
  login,
} from '../services';
import { buildQuery } from '../utils/resolver.util';
import { DateScalar } from './date.resolver';
import { CreateGameInput, CreateUserInput, IdInput, JoinGameInput, LoginInput } from '../types';

interface InputArgs<T> {
  input: T
}

export const resolvers = {
  Date: DateScalar,
  Query: {
    users: async (_parent: unknown, _args: unknown, _context: unknown, info: GraphQLResolveInfo) => 
      getAllUsers(buildQuery(info)),
    user: async (_parent: unknown, { id }: IdInput, _context: unknown, info: GraphQLResolveInfo) => 
      getUserById(id, buildQuery(info)),
    games: async (_parent: unknown, _args: unknown, _context: unknown, info: GraphQLResolveInfo) => 
      getAllGames(buildQuery(info)),
  },
  Mutation: {
    createUser: (_parent: unknown, { input }: InputArgs<CreateUserInput>, _context: unknown, info: GraphQLResolveInfo) => 
      createUser(input, buildQuery(info)),
    login: (_parent: unknown, { input }: InputArgs<LoginInput>, _context: unknown) => {
      const { username, password } = input;
      return login(username, password);
    },
    createGame: (_parent: unknown, { input }: InputArgs<CreateGameInput>, _context: unknown, info: GraphQLResolveInfo) => 
      createGame(input, buildQuery(info)),
    archiveGame: (_parent: unknown, { id }: IdInput, _context: unknown, info: GraphQLResolveInfo) => 
      archiveGame(id, buildQuery(info)),
    joinGame: (_parent: unknown, { gameId, joinerId }: JoinGameInput, _context: unknown, info: GraphQLResolveInfo) => 
      joinGame({ gameId, joinerId }, buildQuery(info)),
  },
};
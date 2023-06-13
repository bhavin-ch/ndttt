import {
  createGame,
  createUser,
  getAllGames,
  getAllUsers,
  getUserById,
  login,
} from '../services';
import { DateScalar } from './date.resolver';

export const resolvers = {
  Date: DateScalar,
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
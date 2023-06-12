import { login } from './services';
import { createUser, getAllUsers, getUserById } from './services/user';

export const resolvers = {
  Query: {
    users: async () => getAllUsers(),
    user: async (_, { id }) => getUserById(id),
  },
  Mutation: {
    createUser: (_parent, { input }) => {
      return createUser(input);
    },
    login: (_parent, { input }) => {
      const { username, password } = input;
      return login(username, password);
    }
  },
};
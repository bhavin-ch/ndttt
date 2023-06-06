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
  },
};
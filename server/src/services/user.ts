import { Prisma, PrismaClient } from '@prisma/client';
import { createUserInput } from '../types';
import { generateHash } from '../utils/auth';

let User :Prisma.UserDelegate<unknown>;

const convertIdToNumber = (id: string | number): number => {
  if (typeof id === 'number') return id;
  else return parseInt(id);
};

export const initUsersService = (client: PrismaClient) => User = client.user;

export const createUser = async (input: createUserInput) => {
  const { password, email, username, name } = input;
  const passwordHash = await generateHash(password);
  const user = await User.create({
    data: {
      email,
      username,
      name,
      password: passwordHash
    }
  });
  return user;
};

export const getAllUsers = async () => {
  return await User.findMany();
};

export const getUserById = async (id: string | number) => {
  return await User.findUnique({
    where: {
      id: convertIdToNumber(id),
    }
  });
};

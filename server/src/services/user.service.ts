import { Prisma, PrismaClient, User } from '@prisma/client';
import { CreateUserInput } from '../types';
import { generateHash } from '../utils/auth.util';

let UserModel: Prisma.UserDelegate<unknown>;

export const initUsersService = (client: PrismaClient) => UserModel = client.user;

export const createUser = async (input: CreateUserInput, select: Prisma.UserSelect): Promise<Partial<User>> => {
  const { password, email, username, name } = input;
  const passwordHash = await generateHash(password);
  const user = await UserModel.create({
    data: {
      email,
      username,
      name,
      password: passwordHash
    },
    select,
  });
  return user;
};

export const getAllUsers = async (select: Prisma.UserSelect): Promise<Partial<User>[]> => {
  return await UserModel.findMany({ select });
};

export const getUserById = async (id: string, select: Prisma.UserSelect): Promise<Partial<User>> => {
  return await UserModel.findUnique({
    where: {
      id,
    },
    select,
  });
};

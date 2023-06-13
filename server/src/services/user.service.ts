import { Prisma, PrismaClient } from '@prisma/client';
import { CreateUserInput } from '../types';
import { generateHash } from '../utils/auth.util';
import { User } from '@prisma/client';

let UserModel: Prisma.UserDelegate<unknown>;

export const initUsersService = (client: PrismaClient) => UserModel = client.user;

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const { password, email, username, name } = input;
  const passwordHash = await generateHash(password);
  const user = await UserModel.create({
    data: {
      email,
      username,
      name,
      password: passwordHash
    }
  });
  return user;
};

export const getAllUsers = async (): Promise<User[]> => {
  return await UserModel.findMany();
};

export const getUserById = async (id: string): Promise<User> => {
  return await UserModel.findUnique({
    where: {
      id,
    }
  });
};

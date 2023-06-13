import { Prisma, PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { compareHash } from "../utils/auth.util";
import { AuthenticationError } from "../utils/error.util";

interface JwtPayload {
  userid: string;
};

const JwtSecret = process.env.JWT_SECRET;

let UserModel: Prisma.UserDelegate<unknown>;

export const initAuthService = (client: PrismaClient) => UserModel = client.user;

export const findUserFromToken = async (token: string) => {
  return token ? await UserModel.findFirst() : null;
};

export const login = async (username: string, password: string): Promise<string> => {
  const { id, password: hash } = await UserModel.findUnique({
    where: {
      username,
    }
  });
  const match = compareHash({
    hash,
    plaintext: password,
  });
  if (!match) {
    throw new AuthenticationError('Password doesn\'t match');
  };
  try {
    const token = jwt.sign({ userid: id }, JwtSecret);
    return token;
  } catch (_) {
    throw new AuthenticationError('There was an error in generating the token');
  }
}

export const authenticate = async (token: string) => {
  let userid: string;
  try {
    ({ userid } = jwt.verify(token, JwtSecret) as JwtPayload);
  } catch (error) {
    const { name, ...details } = error;
    throw new AuthenticationError('There was an error in validating the token', {
      code: name,
      details,
    });
  }
  try {
    return await UserModel.findUnique({
      where: {
        id: userid,
      }
    });
  } catch (_) {
    throw new AuthenticationError('User not found');
  }
}
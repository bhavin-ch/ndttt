import { Game, Prisma, PrismaClient } from "@prisma/client";
import { CreateGameInput } from "../types";

let GameModel: Prisma.GameDelegate<unknown>;
let UserModel: Prisma.UserDelegate<unknown>;

export const initGamesService = (client: PrismaClient) => {
  GameModel = client.game;
  UserModel = client.user;
}

export const createGame = async (input: CreateGameInput, select: Prisma.GameSelect): Promise<Partial<Game>> => {
  const { creatorId, dimensions, gridSize } = input;
  const game = await GameModel.create({
    data: {
      creatorId,
      dimensions,
      gridSize
    },
    select,
  });
  return game;
};

export const getAllGames = async (select: Prisma.GameSelect): Promise<Partial<Game>[]> => {
  return await GameModel.findMany({ select });
};
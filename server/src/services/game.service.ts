import { Game, Prisma, PrismaClient } from "@prisma/client";
import { CreateGameInput } from "../types";

let GameModel: Prisma.GameDelegate<unknown>;
let UserModel: Prisma.UserDelegate<unknown>;

export const initGamesService = (client: PrismaClient) => {
  GameModel = client.game;
  UserModel = client.user;
}

export const createGame = async (input: CreateGameInput): Promise<Game> => {
  const { creatorId, dimensions, gridSize } = input;
  const game = await GameModel.create({
    data: {
      creatorId,
      dimensions,
      gridSize
    },
    include: {
      creator: true
    }
  });
  return game;
};

export const getAllGames = async (): Promise<Game[]> => {
  return await GameModel.findMany();
};
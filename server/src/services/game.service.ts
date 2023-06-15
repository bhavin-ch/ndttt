import { Game, Status, Prisma, PrismaClient } from "@prisma/client";
import { CreateGameInput, JoinGameInput } from "../types";
import { BadRequestError, NotFoundError } from "../utils/error.util";

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

export const archiveGame = async (id: string, select: Prisma.GameSelect): Promise<Partial<Game>> => {
  return await GameModel.update({
    where: {
      id
    },
    data: {
      status: Status.ARCHIVED
    },
    select
  });
};

export const joinGame = async ({ gameId, joinerId }: JoinGameInput, select: Prisma.GameSelect): Promise<Partial<Game>> => {
  const game = await GameModel.findUnique({
    where: {
      id: gameId
    },
    select: {
      id: true,
      joinerId: true,
    }
  });
  if (!game) {
    throw new NotFoundError(`Game with ID ${gameId} not found`);
  }
  if (game.joinerId) {
    const error = new BadRequestError('No vacant slots on this game');
    console.log(JSON.stringify(error.extensions));
    throw error;
  }
  return await GameModel.update({
    where: {
      id: gameId
    },
    data: {
      joinerId,
      status: Status.READY
    },
    select
  });
};
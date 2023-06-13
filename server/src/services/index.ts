import { PrismaClient } from '@prisma/client';
import { initAuthService } from './auth.service';
import { initGamesService } from './game.service';
import { initUsersService } from './user.service';

export const init = (): PrismaClient => {
  try {
    const client = new PrismaClient();
    initUsersService(client);
    initAuthService(client);
    initGamesService(client);
    return client;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export * from './user.service';
export * from './game.service';
export * from './auth.service';

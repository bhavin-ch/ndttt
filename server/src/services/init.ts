import { PrismaClient } from "@prisma/client"
import { initUsersService } from "./user";
import { initAuthService } from "./auth";
import { initGamesService } from "./game";

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
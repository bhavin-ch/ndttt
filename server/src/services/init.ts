import { PrismaClient } from "@prisma/client"
import { initUsersService } from "./user";

export const init = (): PrismaClient => {
  try {
    const client = new PrismaClient();
    initUsersService(client);
    return client;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
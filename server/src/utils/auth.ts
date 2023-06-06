import { hash } from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../constants";

export const generateHash = async (input: string): Promise<string> => {
  return await hash(input, BCRYPT_SALT_ROUNDS);
};

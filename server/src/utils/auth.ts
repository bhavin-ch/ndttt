import { compare, hash } from "bcrypt";
import { BCRYPT_SALT_ROUNDS } from "../constants";

interface CompareHashInput {
  plaintext: string;
  hash: string
}
export const generateHash = async (input: string): Promise<string> => {
  return await hash(input, BCRYPT_SALT_ROUNDS);
};

export const compareHash = async ({ plaintext, hash }: CompareHashInput): Promise<boolean> => {
  return await compare(plaintext, hash);
};

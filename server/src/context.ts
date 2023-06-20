import { authenticate } from "./services";

export const context = async ({ req, res }) => {
  const match = req.headers.authorization?.match(/Bearer (.*)/) ?? null;
  if (!match) {
    return { auth: false };
  }
  const [_, token] = match;
  const user = await authenticate(token);
  return { auth: true, user };
};

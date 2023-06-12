export interface CreateUserInput {
  email: string;
  username: string;
  name: string;
  password: string;
}
export interface CreateGameInput {
  creatorId: string;
  dimensions: number;
  gridSize: number;
}

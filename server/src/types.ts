export interface CreateUserInput {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface CreateGameInput {
  creatorId: string;
  dimensions: number;
  gridSize: number;
}

export interface IdInput {
  id: string;
}

export interface JoinGameInput {
  gameId: string;
  joinerId: string;
}

export enum ErrorCodes {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
}

export type ServerType = 'express' | 'apollo';

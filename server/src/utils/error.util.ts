import { GraphQLError } from "graphql";
import { ErrorCodes } from "../types";

export interface SetExtensionsParams {
  code: ErrorCodes;
  status: number;
  extensions: Record<string, unknown>;
}

const setExtensions = ({code, status, extensions}: SetExtensionsParams) => {
  const defaultExtensions = {
    code,
    http: { status },
  };
  let finalExtensions: Record<string, unknown> = { ...extensions, ...defaultExtensions };
  if (extensions?.http) {
    finalExtensions.http = { ...(extensions.http as any), ...defaultExtensions.http };
  }
  return finalExtensions
}

export class AuthenticationError extends GraphQLError {
  public constructor(message: string, extensions: Record<string, unknown> = {}) {
    super(message, {
      extensions: setExtensions({ code: ErrorCodes.UNAUTHENTICATED, status: 401, extensions })
    });
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends GraphQLError {
  public constructor(message: string, extensions: Record<string, unknown> = {}) {
    super(message, {
      extensions: setExtensions({ code: ErrorCodes.FORBIDDEN, status: 403, extensions })
    });
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends GraphQLError {
  public constructor(message: string, extensions: Record<string, unknown> = {}) {
    super(message, {
      extensions: setExtensions({ code: ErrorCodes.NOT_FOUND, status: 404, extensions })
    });
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends GraphQLError {
  public constructor(message: string, extensions: Record<string, unknown> = {}) {
    super(message, {
      extensions: setExtensions({ code: ErrorCodes.BAD_REQUEST, status: 400, extensions }),
    });
    this.name = 'BadRequestError';
  }
}
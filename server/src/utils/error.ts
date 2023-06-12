import { GraphQLError } from "graphql";

export class AuthenticationError extends GraphQLError {
  public constructor(message: string, extensions: Record<string, unknown> = {}) {
    const defaultExtensions = {
      code: 'UNAUTHENTICATED',
      http: { status: 401 },
    };
    let finalExtensions: Record<string, unknown> = { ...extensions, ...defaultExtensions };
    if (extensions?.http) {
      finalExtensions.http = { ...(extensions.http as any), ...defaultExtensions.http };
    }
    super(message, extensions);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends GraphQLError {
  public constructor(message: string, extensions: Record<string, unknown> = {}) {
    const defaultExtensions = {
      code: 'FORBIDDEN',
      http: { status: 403 },
    };
    let finalExtensions: Record<string, unknown> = { ...extensions, ...defaultExtensions };
    if (extensions?.http) {
      finalExtensions.http = { ...(extensions.http as any), ...defaultExtensions.http };
    }
    super(message, extensions);
    this.name = 'AuthorizationError';
  }
}
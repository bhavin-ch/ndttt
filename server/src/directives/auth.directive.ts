import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { Role, User } from '@prisma/client';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { AuthenticationError, AuthorizationError } from '../utils/error.util';

export const invoke = (schema: GraphQLSchema) => {
  const authorizedSchema = mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const fieldAuthDirective = getDirective(schema, fieldConfig, 'auth')?.[0];
      if (fieldAuthDirective) {
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver;
        fieldConfig.resolve = (source, args, context, info) => {
          const { user, auth } = context;
          const fieldRoles: Role[] = fieldAuthDirective.roles;
          if (!auth) {
            throw new AuthenticationError('Authenticated missing');
          }
          if (!isAuthorized(fieldRoles, user)) {
            throw new AuthorizationError('You are not authorized to perform this action');
          }
          return originalResolver(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
  return authorizedSchema;
}

const isAuthorized = (fieldRoles: Role[], user: User) => {
  const userRoles = user?.roles ?? [];

  for (const role of fieldRoles) {
    if (userRoles.includes(role)) {
      return true;
    }
  }
  return false;
}
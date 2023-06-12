import { MapperKind, getDirective, mapSchema } from '@graphql-tools/utils';
import { Role, User } from '@prisma/client';
import { GraphQLError, defaultFieldResolver } from 'graphql';
import { AuthenticationError, AuthorizationError } from '../utils/error';

export const invoke = (schema) => {
  const authorizedSchema = mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const fieldAuthDirective = getDirective(schema, fieldConfig, 'auth')?.[0];
      if (fieldAuthDirective) {
        // 2.1. Get the original resolver on the field
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver;
        // 2.2. Replace the field's resolver with a custom resolver
        fieldConfig.resolve = (source, args, context, info) => {
          const { user, auth } = context;
          const fieldRoles: Role[] = fieldAuthDirective.roles;
          if (!auth) {
            throw new AuthenticationError('Authenticated missing');
          }
          if (!isAuthorized(fieldRoles, user)) {
            // 2.3 If the user doesn't have the required permissions, throw an error
            throw new AuthorizationError('You are not authorized to perform this action');
          }
          // 2.4 Otherwise call the original resolver and return the result
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
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { constraintDirectiveTypeDefs, createApollo4QueryValidationPlugin } from 'graphql-constraint-directive/apollo4';
import { invoke } from './directives/auth.directive';
import { resolvers } from './resolvers';
import { authenticate, init } from './services';

(async () => {
  // init prisma
  init();

  // set-up constraint directives
  const typeDefs = `${readFileSync(`${process.cwd()}/graphql/schema.graphql`, 'utf-8')}`;
  let schema = makeExecutableSchema({
    typeDefs: [constraintDirectiveTypeDefs, typeDefs],
    resolvers,
  });
  schema = invoke(schema);

  // set-up apollo server
  const server = new ApolloServer({
    schema,
    plugins: [
      createApollo4QueryValidationPlugin({ schema })
    ],
  });
  
  // init apollo server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
      const match = req.headers.authorization?.match(/Bearer (.*)/) ?? null;
      if (!match) {
        return { auth: false};
      }
      const [_, token] = match;
      const user = await authenticate(token);
      return { auth: true, user };
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
})()
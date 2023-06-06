import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createApollo4QueryValidationPlugin, constraintDirectiveTypeDefs } from 'graphql-constraint-directive/apollo4';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers';
import { init } from './services';

(async () => {
  // init prisma
  init();

  // set-up constraint directives
  const typeDefs = `${readFileSync(`${process.cwd()}/graphql/schema.graphql`, 'utf-8')}`;
  const schema = makeExecutableSchema({
    typeDefs: [constraintDirectiveTypeDefs, typeDefs],
    resolvers,
  })

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
  });
  console.log(`🚀  Server ready at: ${url}`);
})()
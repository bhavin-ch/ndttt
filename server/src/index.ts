import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import express from 'express';
import { readFileSync } from 'fs';
import { constraintDirectiveTypeDefs, createApollo4QueryValidationPlugin } from 'graphql-constraint-directive/apollo4';
import http from 'http';
import { context } from './context';
import { invoke } from './directives/auth.directive';
import { resolvers } from './resolvers';
import { init } from './services';
import { ServerType } from './types';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

const serverType = process.env.SERVER_TYPE as ServerType;
const enableWs = process.env.ENABLE_WS === 'true';

(async (type: ServerType) => {
  // init prisma
  init();

  // set-up constraint directives
  const typeDefs = `${readFileSync(`${process.cwd()}/graphql/schema.graphql`, 'utf-8')}`;
  let schema = makeExecutableSchema({
    typeDefs: [constraintDirectiveTypeDefs, typeDefs],
    resolvers,
  });
  schema = invoke(schema);
  
  switch(type) {
    case 'apollo': {
      // init apollo server
      const server = new ApolloServer({
        schema,
        plugins: [
          createApollo4QueryValidationPlugin({ schema })
        ],
      });
      const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        context,
      });
      console.log(`🚀  Server ready at: ${url}`);
      break;
    } case 'express': {
      // init express server
      const app = express();
      // init http server
      const httpServer = http.createServer(app);
      // Creating the WebSocket server
      const wsServer = enableWs ? new WebSocketServer({
        server: httpServer,
        path: '/graphql',
      }) : null;
      // Hand in the schema we just created and have the WebSocketServer start listening.
      const serverCleanup = enableWs ? useServer({ schema }, wsServer) : null;
      // init apollo server
      const server = new ApolloServer({
        schema,
        plugins: [
          createApollo4QueryValidationPlugin({ schema }),
          // Proper shutdown for the HTTP server.
          ApolloServerPluginDrainHttpServer({ httpServer }),
          // Proper shutdown for the WebSocket server.
          enableWs ? {
            async serverWillStart() {
              return {
                async drainServer() {
                  await serverCleanup.dispose();
              },
            };
          },
        } : undefined,
        ],
      });
      await server.start();
      app.use(
        '/',
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({ token: req.headers.token }),
        }),
      );
      
      httpServer.listen({ port: 4000 }, () => {
        console.log(`🚀🚀 Server ready at http://localhost:4000/`);
      })
      break;
    } default: {
      console.error(`invalid value for server type: ${serverType}`);
      process.exit(1);
    }
  }
})(serverType);

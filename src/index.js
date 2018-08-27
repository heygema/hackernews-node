// @flow

import {GraphQLServer} from 'graphql-yoga';
// import schema from './schema.graphql';
import {Prisma} from 'prisma-binding';

import * as Query from './resolvers/Query';

import * as Mutation from './resolvers/Mutation';

import * as AuthPayload from './resolvers/AuthPayload';

const resolvers = {
  Query,
  Mutation,
  AuthPayload,
};

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: (req) => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/gema-anggada-c8a576/database/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
});

server.start(() => console.log('server is running on http://localhost:4000'));

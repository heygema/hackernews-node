// @flow

import {GraphQLServer} from 'graphql-yoga';
// import schema from './schema.graphql';
import {Prisma} from 'prisma-binding';

const resolvers = {
  Query: {
    info: () => 'Basic graphql server',
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info);
    },
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink(
        {
          data: {
            url: args.url,
            description: args.description,
          },
        },
        info
      );
    },
    updateLink: (root, args, context, info) => {
      return context.db.mutation.updateLink(
        {
          data: {
            url: args.url || root.url,
            description: args.description || root.description,
          },
          where: {
            id: args.id,
          },
        },
        info
      );
    },
    deleteLink: (root, args, context, info) => {
      return context.db.mutation.deleteLink(
        {
          where: {
            id: args.id,
          },
        },
        info
      );
    },
  },
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

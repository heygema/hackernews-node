// @flow

import {GraphQLServer} from 'graphql-yoga';
import schema from './schema.graphql';

type Link = {
  id: string;
  url: string;
  description: string;
};

type Links = Array<Link>;

let links: Links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
  {
    id: 'link-1',
    url: 'www.facebook.com',
    description: 'Facebook, a website for procrastinator',
  },
  {
    id: 'link-2',
    url: 'www.twitter.com',
    description: 'site for gossip',
  },
];

let idCount: () => number = () => links.length;

const resolvers = {
  Query: {
    info: () => 'hackernews clone server',
    feed: () => links,
    link: (root, args) => links.find((link) => link.id === args.id),
  },

  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${idCount()}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (root, args) => {
      let {id, url, description} = args;
      let newLink = {
        id,
        url,
        description,
      };
      links = links.map((link) => {
        if (link.id === id) {
          return newLink;
        }
        return link;
      });
      return newLink;
    },
    deleteLink: (root, args) => {
      let deletedLink = links.find((link) => link.id === args.id);
      links = links.filter((link) => link.id !== args.id);
      return deletedLink;
    },
  },

  Link: {
    id: (root) => root.id,
    description: (root) => root.description,
    url: (root) => root.url,
  },
};

const server = new GraphQLServer({
  typeDefs: schema,
  resolvers,
});

server.start(() => console.log('server is running on http://localhost:4000'));

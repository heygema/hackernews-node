import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');
import {APP_SECRET, getUserId} from '../utils';

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.db.mutation.createUser(
    {
      data: {...args, password},
    },
    `{ id }`
  );

  const token = jwt.sign({userId: user.id}, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context) {
  const user = await context.db.query.user(
    {
      where: {email: args.email},
    },
    `{ id password }`
  );

  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error("Password doesn't match");
  }

  const token = jwt.sign({userId: user.id}, APP_SECRET);

  return {
    user,
    token,
  };
}

function post(parent, args, context, info) {
  const userId = getUserId(context);
  return context.db.mutation.createLink(
    {
      data: {
        url: args.url,
        description: args.description,
        postedBy: {connect: {id: userId}},
      },
    },
    info
  );
}

let updateLink = (root, args, context, info) => {
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
};

let deleteLink = (root, args, context, info) => {
  return context.db.mutation.deleteLink(
    {
      where: {
        id: args.id,
      },
    },
    info
  );
};

export {signup, login, post, updateLink, deleteLink};

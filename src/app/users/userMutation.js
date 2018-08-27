import bcrypt from 'bcryptjs';
import {APP_SECRET} from '../../utils';
import jwt from 'jsonwebtoken';

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

export default {
  signup,
  login,
};

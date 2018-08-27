import {getUserId} from '../../utils';

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

export default {
  post,
  updateLink,
  deleteLink,
};

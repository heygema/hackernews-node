const jwt = require('jsonwebtoken');
const APP_SECRET = 'BATMAN-is-Bruce-Wayne';

function getUserId(context) {
  const Authorization = context.request.get('Authorization');

  if (Authorization) {
    let token = Authorization.replace('Bearer ', '');
    let {userId} = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error('Not authenticated');
}

export {getUserId, APP_SECRET};

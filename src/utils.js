const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const APP_SECRET = 'my-app-secr';

const getUserId = context => {
  const Authorization = context.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const {userId} = jwt.verify(token, APP_SECRET);
    return userId;
  }
  throw new Error('Not authenticated')
};

module.exports = {
  APP_SECRET,
  getUserId,
};
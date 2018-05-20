const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {APP_SECRET, getUserId} = require('../utils');

const post = (root, {url, description}, context, info) => (
  context
    .db
    .mutation
    .createLink({
        data: {
          url,
          description,
          postedBy: { connect: { id: getUserId(context) } },
        },
      }, info)
);

const deleteLnk = (_, {id}, context, info) => (
  context
    .db
    .mutation
    .deleteLink({where: {id}}, info)
);

const updateLnk = (_, {id, url, description}, context, info) => (
  context
    .db
    .mutation
    .updateLink({where: {id}, data: {url, description}}, info)
);

async function vote(parent, args, context, info) {

  const userId = getUserId(context);

  const linkExists = await context.db.exists.Vote({
    user: { id: userId },
    link: { id: args.linkId },
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  // 3
  return context.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        link: { connect: { id: args.linkId } },
      },
    },
    info,
  );
}

async function signup(parent, {password: psw, ...args}, context, info) {
  const password = await bcrypt.hash(psw, 10);
  const user = await context.db.mutation.createUser({data: { ...args, password }}, `{ id }`);
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  }
}

async function login(parent, {email, password}, context, info) {
  const user = await context.db.query.user({where: {email}}, ` { id password } `);
  if (!user) {
    throw new Error('No such user found')
  }

  // 2
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user,
  }
}

module.exports = {
  post, deleteLnk, updateLnk, signup, login, vote
};
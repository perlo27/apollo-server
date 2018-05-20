const newLinkSubscribe = (parent, args, context, info) => context.db.subscription.link(
  { where: { mutation_in: ['CREATED'] } },
  info,
);

const newVoteSubscribe = (parent, args, context, info) => context.db.subscription.vote(
  { where: { mutation_in: ['CREATED'] } },
  info,
);

module.exports = {
  newLink: {subscribe: newLinkSubscribe},
  newVote: {subscribe: newVoteSubscribe},
};
const user = (root, args, context, info) => context.db.query.user({ where: { id: root.user.id } }, info);
const links = (root, args, context, info) => context.db.query.links({ where: { id_in: root.linkIds } }, info);
const votesCount = async (root, args, context, info) => {
  const voteConnection = await context.db.query.votesConnection({where: {link: {id: root.id}}}, `
      {
        aggregate {
          count
        }
      }
    `);
  return voteConnection.aggregate.count
};

module.exports = { user, links, votesCount };
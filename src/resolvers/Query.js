const {getUserId} = require('../utils');

module.exports = {
  feed: async (root, {filter, skip, first, orderBy}, context, info) => {
    const where = filter
      ? {
        OR: [
          { url_contains: filter },
          { description_contains: filter },
        ],
      }
      : {};
    const p = {};
    if (skip) {
      p.skip = skip;
    }
    if (first) {
      p.first = first;
    }
    if(orderBy) {
      p.orderBy = orderBy;
    }
    const queriedLinks = await context.db.query.links({where, ...p}, '{ id }');
    const linksConnection = await context.db.query.linksConnection({}, `
      {
        aggregate {
          count
        }
      }
    `);
    return {
      count: linksConnection.aggregate.count,
      linkIds: queriedLinks.map(link => link.id),
    }
  },
  getUser: async (root, _, context, info) => {
    const userId = getUserId(context);
    const user = await context.db.query.user({ where: { id: userId } }, info);
    if (user) {
      return user;
    }
    throw new Error('No user foutnd');
  }
};
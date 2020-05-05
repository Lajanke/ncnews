const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData);
      const usersInsertions = knex('users').insert(userData);
      console.log('running seed');
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const articlesData = formatDates(articleData);
      return knex('articles').insert(articlesData).returning('*');
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows, 'title', 'article_id');
      const formattedComments = formatComments(commentData, articleRef);
      return knex('comments').insert(formattedComments);
    });
};

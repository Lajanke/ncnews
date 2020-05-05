const connection = require('../../connection.js');

const fetchArticle = (id) => {
    return connection('articles')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .select('articles.*')
    .count('comments.article_id as comment_count')
    .groupBy('articles.article_id')
    .where('articles.article_id', '=', id)
    .then((result) => {
        console.log(result)
        return result
    });
   
};

module.exports = { fetchArticle }

/*
an article object, which should have the following properties:

author which is the username from the users table
title
article_id
body
topic
created_at
votes
-----comment_count which is the total count of all the comments with this article_id - you should make use of knex queries in order to achieve this
*/
const connection = require('../../connection.js');

const fetchArticle = (id) => {
    return connection('articles')
        .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
        .select('articles.*')
        .count('comments.article_id as comment_count')
        .groupBy('articles.article_id')
        .where('articles.article_id', '=', id)
        .then((res) => {
            return res;
        });
};

const alterVotes = (id, newVotes) => {
    return connection('articles')
        .where('article_id', '=', id)
        .increment('votes', newVotes)
        .then(() => {
            const res = fetchArticle(id);
            return res;
        })
}

const postNewComment = (id, username, body) => {
    const newComment = { article_id: id, author: username, body: body };
    return connection('comments')
        .insert(newComment)
        .returning('*')
        .then((res) => {
            return [res[0].body];
        });
}

const fetchArticleComments = (id, sort_by = 'created_at', order = 'desc') => {
    return connection('comments')
        .where('article_id', '=', id)
        .select('comment_id', 'author', 'votes', 'created_at', 'body')
        .orderBy(sort_by, order)
        .then((res) => {
            return res;
        });
};

const fetchAllArticles = ( sort_by = 'created_at', order = 'desc', author, topic ) => {
    return connection('articles')
        .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
        .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
        .count('comments.article_id as comment_count')
        .groupBy('articles.article_id')
        .orderBy(sort_by, order)
        .modify( query => {
            if(author) query.where('articles.author', '=', author);
            if(topic) query.where('articles.topic', '=', topic);
        })
        .then((res) => {
            return res;
        });
}


/*
sort_by, which sorts the articles by any valid column (defaults to date)
order, which can be set to asc or desc for ascending or descending (defaults to descending)
author, which filters the articles by the username value specified in the query
topic, which filters the articles by the topic value specified in the query
*/

module.exports = { fetchArticle, alterVotes, postNewComment, fetchArticleComments, fetchAllArticles }
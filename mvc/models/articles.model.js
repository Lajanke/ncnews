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

const fetchArticleComments = (id) => {
    return connection('comments')
        .where('article_id', '=', id)
        .select('comment_id', 'author', 'votes', 'created_at', 'body',)
        .then((res) => {
            return res;
        });
};

//need to add sortby and order queries.

module.exports = { fetchArticle, alterVotes, postNewComment, fetchArticleComments }
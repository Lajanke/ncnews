const connection = require('../../connection.js');

const fetchArticle = (id) => {
    return connection('articles')
    .leftJoin('comments', 'comments.article_id', '=', 'articles.article_id')
    .select('articles.*')
    .count('comments.article_id as comment_count')
    .groupBy('articles.article_id')
    .where('articles.article_id', '=', id)
    .then((result) => {
        return result
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

module.exports = { fetchArticle, alterVotes }
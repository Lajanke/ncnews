const connection = require('../../connection.js');

const fetchArticle = (id) => {
    return connection('articles')
    .select('*')
    .where('articles.article_id', '=', id)
    .then((result) => {
        return result
    });
};

module.exports = { fetchArticle }
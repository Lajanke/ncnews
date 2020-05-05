const { fetchArticle } = require('../models/articles.model');

const getArticle = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send({ article });
    }) 
}

module.exports = { getArticle };
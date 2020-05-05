const { fetchArticle, alterVotes } = require('../models/articles.model');

const getArticle = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send({ article });
    }) 
}

const patchVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    alterVotes(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article });
    }) 
}

module.exports = { getArticle, patchVotes };
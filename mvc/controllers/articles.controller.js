const { fetchArticle, alterVotes, postNewComment } = require('../models/articles.model');

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

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    postNewComment(article_id, username, body)
    .then((comment) => {
        res.status(201).send({ comment })
    })
}

module.exports = { getArticle, patchVotes, postComment };
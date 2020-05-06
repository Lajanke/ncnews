const { fetchArticle, alterVotes, postNewComment, fetchArticleComments, fetchAllArticles } = require('../models/articles.model');

const getArticle = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticle(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        })
};

const patchVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const num = Object.keys(req.body).length;
    alterVotes(article_id, inc_votes, num)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    postNewComment(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        })
};

const getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by, order } = req.query;
    fetchArticleComments(article_id, sort_by, order)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err)
        });
};

const getAllArticles = (req, res, next) => {
    const { sort_by, order, author, topic } = req.query;
    fetchAllArticles(sort_by, order, author, topic)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = { getArticle, patchVotes, postComment, getArticleComments, getAllArticles };
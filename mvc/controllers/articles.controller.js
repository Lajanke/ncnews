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
    const num = Object.keys(req.body).length;
    postNewComment(article_id, username, body, num)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        })
};

const getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by, order, page, limit } = req.query;
    fetchArticleComments(article_id, sort_by, order, page, limit)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err)
        });
};

const getAllArticles = (req, res, next) => {
    const { sort_by, order, author, topic, page, limit } = req.query;
    fetchAllArticles(sort_by, order, author, topic, page, limit)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = { getArticle, patchVotes, postComment, getArticleComments, getAllArticles };
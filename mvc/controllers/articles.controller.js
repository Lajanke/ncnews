const { fetchArticle, alterVotes, postNewComment, fetchArticleComments, fetchAllArticles } = require('../models/articles.model');

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
        });
};

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    postNewComment(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment });
        });
};

const getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by, order } = req.query;
    fetchArticleComments(article_id, sort_by, order)
        .then((comments) => {
            console.log(comments)
            res.status(200).send({ comments });
        });
};

const getAllArticles = (req, res, next) => {
    fetchAllArticles()
    .then((articles) => {
        console.log(articles)
        res.status(200).send({ articles })
    })
}

module.exports = { getArticle, patchVotes, postComment, getArticleComments, getAllArticles };
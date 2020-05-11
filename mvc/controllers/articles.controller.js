const { fetchArticle, 
        alterVotes, 
        postNewComment, 
        fetchArticleComments, 
        fetchAllArticles, 
        postNewArticle,
        deleteArticleById } = require('../models/articles.model');

const getArticle = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticle(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
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
    const { sort_by, order, p, limit } = req.query;
    fetchArticleComments(article_id, sort_by, order, p, limit)
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err)
        });
};

const getAllArticles = (req, res, next) => {
    const { sort_by, order, author, topic, p, limit } = req.query;
    fetchAllArticles(sort_by, order, author, topic, p, limit)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

const postArticle = (req, res, next) => {
    postNewArticle(req.body)
        .then((article) => {
            res.status(201).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};

const deleteArticle = (req, res, next) => {
    const { article_id } = req.params;
    deleteArticleById(article_id)
    .then(() => {
        res.sendStatus(204);
    })
    .catch((err) => {
        next(err);
    });
}

module.exports = {  getArticle, 
                    patchVotes, 
                    postComment, 
                    getArticleComments, 
                    getAllArticles, 
                    postArticle,
                    deleteArticle };
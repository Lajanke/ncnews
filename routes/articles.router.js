const express = require('express');
const articlesRouter = express.Router();
const { getArticle, patchVotes, getArticleComments, postComment, getAllArticles } = require('../mvc/controllers/articles.controller.js')

articlesRouter.route('/').get(getAllArticles);
articlesRouter.route('/:article_id').get(getArticle).patch(patchVotes);
articlesRouter.route('/:article_id/comments').get(getArticleComments).post(postComment);

module.exports = articlesRouter;
const express = require('express');
const articlesRouter = express.Router();
const { getArticle, patchVotes, getArticleComments, postComment, getAllArticles, postArticle } = require('../mvc/controllers/articles.controller.js')
const { handle405s } = require('../mvc/controllers/errors.controller.js')

articlesRouter.route('/').get(getAllArticles).post(postArticle).all(handle405s);
articlesRouter.route('/:article_id').get(getArticle).patch(patchVotes).all(handle405s);
articlesRouter.route('/:article_id/comments').get(getArticleComments).post(postComment).all(handle405s);

module.exports = articlesRouter;
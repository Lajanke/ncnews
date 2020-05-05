const express = require('express');
const articlesRouter = express.Router();
const { getArticle, patchVotes, postComment } = require('../mvc/controllers/articles.controller.js')

articlesRouter.route('/:article_id').get(getArticle).patch(patchVotes);
articlesRouter.route('/:article_id/comments').post(postComment);

module.exports = articlesRouter;
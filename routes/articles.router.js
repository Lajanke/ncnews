const express = require('express');
const articlesRouter = express.Router();
const { getArticle, patchVotes } = require('../mvc/controllers/articles.controller.js')

articlesRouter.route('/:article_id').get(getArticle).patch(patchVotes);

module.exports = articlesRouter;
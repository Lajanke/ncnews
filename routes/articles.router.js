const express = require('express');
const articlesRouter = express.Router();
const { getArticle } = require('../mvc/controllers/articles.controller.js')

articlesRouter.route('/:article_id').get(getArticle);

module.exports = articlesRouter;
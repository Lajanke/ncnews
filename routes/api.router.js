const express = require('express');
const apiRouter = express.Router();
const topicsRouter = require('./topics.router.js');
const usersRouter = require('./users.router.js');
const articlesRouter = require('./articles.router.js');
const commentsRouter = require('./comments.router.js');
const { handle405s } = require('../mvc/controllers/errors.controller.js');
const { getEndpoints } = require('../mvc/controllers/api.controller.js');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter.route('/').get(getEndpoints).all(handle405s);

module.exports = apiRouter;
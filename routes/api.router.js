const express = require('express');
const apiRouter = express.Router();
const topicsRouter = require('./topics.router.js');
const usersRouter = require('./users.router.js');
const articlesRouter = require('./articles.router.js');
const commentsRouter = require('./comments.router.js');
const { handle404s, handle405s } = require('../mvc/controllers/errors.controller.js')

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter.route('/').patch(handle405s).post(handle405s).delete(handle405s);

module.exports = apiRouter;
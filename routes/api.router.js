const express = require('express');
const apiRouter = express.Router();
const topicsRouter = require('./topics.router.js')
const usersRouter = require('./users.router.js')

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
const express = require('express');
const topicsRouter = express.Router();
const { getTopics } = require('../mvc/controllers/topics.controller.js')
const { handle405s } = require('../mvc/controllers/errors.controller.js')

topicsRouter.route('/').get(getTopics).all(handle405s);

module.exports = topicsRouter;
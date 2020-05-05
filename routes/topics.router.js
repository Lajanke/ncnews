const express = require('express');
const topicsRouter = express.Router();
const { getTopics } = require('../mvc/controllers/topics.controller.js')

topicsRouter.route('/').get(getTopics);

module.exports = topicsRouter;
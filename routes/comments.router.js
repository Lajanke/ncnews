const express = require('express');
const commentsRouter = express.Router();
const { patchComment } = require('../mvc/controllers/comments.controller.js')

commentsRouter.route('/:comment_id').patch(patchComment);

module.exports = commentsRouter;
const express = require('express');
const commentsRouter = express.Router();
const { patchComment, deleteComment } = require('../mvc/controllers/comments.controller.js');

commentsRouter.route('/:comment_id').patch(patchComment).delete(deleteComment);

module.exports = commentsRouter;
const express = require('express');
const commentsRouter = express.Router();
const { patchComment, deleteComment } = require('../mvc/controllers/comments.controller.js');
const { handle405s } = require('../mvc/controllers/errors.controller.js')


commentsRouter.route('/:comment_id').patch(patchComment).delete(deleteComment).all(handle405s);

module.exports = commentsRouter;
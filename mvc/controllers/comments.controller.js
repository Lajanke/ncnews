const { patchVotesById, deleteCommentById } = require('../models/comments.model.js');

const patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    patchVotesById(comment_id, inc_votes)
    .then((comment) => {
        res.status(200).send({ comment });
    });
};

const deleteComment = (req, res, next) => {
    const { comment_id } = req. params;
    deleteCommentById(comment_id)
    .then((delCount) => { // use for error handling
        res.sendStatus(204);
    });
};

module.exports = { patchComment, deleteComment };
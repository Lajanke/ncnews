const { patchVotesById, deleteCommentById } = require('../models/comments.model.js');

const patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const num = Object.keys(req.body).length;
    patchVotesById(comment_id, inc_votes, num)
    .then((comment) => {
        res.status(200).send({ comment });
    })
    .catch((err) => {
        next(err);
    })
};

const deleteComment = (req, res, next) => {
    const { comment_id } = req. params;
    deleteCommentById(comment_id)
    .then(() => { 
        res.sendStatus(204);
    })
    .catch((err) => {
        next(err);
    })
};

module.exports = { patchComment, deleteComment };
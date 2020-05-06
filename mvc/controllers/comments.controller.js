const { patchVotesById } = require('../models/comments.model.js');

const patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    patchVotesById(comment_id, inc_votes)
    .then((comment) => {
        console.log(comment)
        res.status(200).send({ comment });
    });
};

module.exports = { patchComment };
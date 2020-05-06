const connection = require('../../connection.js');

const patchVotesById = (id, newVotes) => {
    return connection('comments')
        .where('comment_id', '=', id)
        .increment('votes', newVotes)
        .returning('*')
        .then((res) => {
            return res;
        });
};

const deleteCommentById = (id) => {
    return connection('comments')
        .where('comment_id', '=', id)
        .del()
        .then((delCount) => {
            return delCount;
        });
};

module.exports = { patchVotesById, deleteCommentById }
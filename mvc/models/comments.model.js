const connection = require('../../connection.js');

const patchVotesById = (id, newVotes = 0, num) => {
    if (num > 1) {
        return Promise.reject({ status: 400, msg: 'Bad request, cannot update extra fields' });
    };
    return connection('comments')
        .where('comment_id', '=', id)
        .increment('votes', newVotes)
        .returning('*')
        .then((res) => {
            if (res.length === 0) {
                return Promise.reject({ status: 404, msg: 'No comment with this ID found' });
            } else {
                return res[0];
            };
        });
};

const deleteCommentById = (id) => {
    return connection('comments')
        .where('comment_id', '=', id)
        .del()
        .then((res) => {
            if (res === 0) {
                return Promise.reject({ status: 404, msg: 'No comment with this ID found' });
            }
            return res;
        });
};

module.exports = { patchVotesById, deleteCommentById }
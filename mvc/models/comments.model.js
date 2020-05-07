const connection = require('../../connection.js');

const patchVotesById = (id, newVotes = 0, num) => {
    if (num > 1) {
        throw { code: 'TOO MANY PROPERTIES'};
    };
    return connection('comments')
        .where('comment_id', '=', id)
        .increment('votes', newVotes)
        .returning('*')
        .then((res) => {
            if (res.length === 0) {
                throw { code: 'COMMENT NOT FOUND'}
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
                throw { code: 'COMMENT NOT FOUND'};
            }
            return res;
        });
};

module.exports = { patchVotesById, deleteCommentById }
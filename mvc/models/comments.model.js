const connection = require('../../connection.js');

const patchVotesById = (id, newVotes, num) => {
    if (newVotes === undefined) {
        throw { code: 'BAD REQUEST'};
    };
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
            return res;
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
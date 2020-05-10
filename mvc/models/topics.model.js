const connection = require('../../connection.js');

const fetchAllTopics = (page = 1, limit = 5) => {
    return connection('topics')
    .select('*')
    .limit(limit)
    .offset((page - 1) * limit)
    .then((res) => {
        if (res.length === 0) {
            throw { code: 'NOT FOUND' };
        };
        return res;
    });
};

module.exports = { fetchAllTopics }
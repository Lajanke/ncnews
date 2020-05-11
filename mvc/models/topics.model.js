const connection = require('../../connection.js');

const fetchAllTopics = (p = 1, limit = 10) => {
    return connection('topics')
        .select('*')
        .limit(limit)
        .offset((p - 1) * limit)
        .then((res) => {
            if (res.length === 0) {
                return Promise.reject({ status: 404, msg: 'Not found' });
            };
            return res;
        });
};

const fetchTopicByName = (topic) => {
    return connection('topics')
        .select('*')
        .where('slug', '=', topic)
        .then((res) => {
            if (res.length === 0) {
                return Promise.reject({ status: 404, msg: 'Not found' });
            } else {
                return res;
            };
        });
};

module.exports = { fetchAllTopics, fetchTopicByName }
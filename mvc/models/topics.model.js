const connection = require('../../connection.js');

const fetchAllTopics = (p = 1, limit = 10) => {
    return connection('topics')
    .select('*')
    .limit(limit)
    .offset((p - 1) * limit)
    .then((res) => {
        if (res.length === 0) {
            throw { code: 'NOT FOUND' };
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
            throw { code: 'NO TOPIC'};  
        } else {
            return res;
        };
    });
};

module.exports = { fetchAllTopics, fetchTopicByName }
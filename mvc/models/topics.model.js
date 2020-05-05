const connection = require('../../connection.js');

const fetchAllTopics = () => {
    return connection('topics')
    .select('*')
    .orderBy('slug')
    .then((result) => {
        return result
    });
};

module.exports = { fetchAllTopics }
const connection = require('../../connection.js');

const fetchAllTopics = () => {
    return connection('topics')
    .select('*')
    .then((result) => {
        return result
    });
};

module.exports = { fetchAllTopics }
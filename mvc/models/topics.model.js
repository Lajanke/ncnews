const connection = require('../../connection.js');

const fetchAllTopics = () => {
    console.log('inside topics model')
    return connection('topics')
    .select('*')
    .then((result) => {
        return result
    });
};

module.exports = { fetchAllTopics }
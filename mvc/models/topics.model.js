const connection = require('../../connection.js');

const fetchAllTopics = () => {
    console.log('inside topics model')
    return connection('topics')
    .select('*')
    .orderBy('slug')
    .then((result) => {
        return result
    });
};

module.exports = { fetchAllTopics }
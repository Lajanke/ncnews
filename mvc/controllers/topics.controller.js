const { fetchAllTopics } = require('../models/topics.model');

const getTopics = (req, res, next) => {
    fetchAllTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    }) 
}

module.exports = { getTopics };
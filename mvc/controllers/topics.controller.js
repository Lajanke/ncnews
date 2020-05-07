const { fetchAllTopics } = require('../models/topics.model');

const getTopics = (req, res, next) => {
    fetchAllTopics()
    .then((topics) => {
        console.log({ topics })
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getTopics };
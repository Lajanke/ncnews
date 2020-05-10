const { fetchAllTopics } = require('../models/topics.model');

const getTopics = (req, res, next) => {
    const { page, limit } = req.query;
    fetchAllTopics(page, limit)
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getTopics };
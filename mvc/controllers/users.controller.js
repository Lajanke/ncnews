const { fetchUser } = require('../models/users.model');

const getUsers = (req, res, next) => {
    const { username } = req.params;
    console.log(username)
    fetchUser(username)
    .then((user) => {
        res.status(200).send({ user });
    }) 
}

module.exports = { getUsers };
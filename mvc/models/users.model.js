const connection = require('../../connection.js');

const fetchUser = (username) => {
    return connection('users')
    .select('*')
    .where('users.username', '=', username)
    .then((result) => {
        return result
    });
};

module.exports = { fetchUser }
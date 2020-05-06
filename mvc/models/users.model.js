const connection = require('../../connection.js');

const fetchUser = (username) => {
    return connection('users')
    .select('*')
    .where('users.username', '=', username)
    .then((result) => {
        if (result.length === 0) {
            throw {code: 'USER NOT FOUND'};
        } else {
            return result;
        }
    });
};

module.exports = { fetchUser }
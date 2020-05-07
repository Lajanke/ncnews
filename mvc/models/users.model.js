const connection = require('../../connection.js');

const fetchUser = (username) => {
    return connection('users')
    .select('*')
    .where('users.username', '=', username)
    .then((res) => {
        if (res.length === 0) {
            throw {code: 'USER NOT FOUND'};
        } else {
            return res[0];
        }
    });
};

module.exports = { fetchUser }
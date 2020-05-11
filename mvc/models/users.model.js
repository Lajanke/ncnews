const connection = require('../../connection.js');

const fetchUser = (username) => {
    return connection('users')
        .select('*')
        .where('users.username', '=', username)
        .then((res) => {
            if (res.length === 0) {
                return Promise.reject({ status: 404, msg: 'User does not exist' });
            } else {
                return res[0];
            };
        });
};

module.exports = { fetchUser }
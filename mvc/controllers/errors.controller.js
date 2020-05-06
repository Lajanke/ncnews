const handle404s = (req, res, ) => {
    res.status(404).send({ msg: 'Path not found' })
}

const handle405s = (req, res) => {
    res.status(405).send({ msg: 'Method not allowed' })
}

const handleErrors = (err, req, res, next) => {
    const codes = {
        'USER NOT FOUND': { status: 404, msg: 'User does not exist' },
        'ARTICLE NOT FOUND': { status: 404, msg: 'No article with this ID found' },
        'BAD REQUEST': { status: 400, msg: 'Bad request', },
        'TOO MANY PROPERTIES': { status: 400, msg: 'Bad request, cannot update multiple fields.'},
        'NO BODY': { status: 400, msg: 'Comment cannot be empty'},
    }
    if ((Object.keys(codes)).includes(err.code)) {
        const { status, msg } = codes[err.code];
        res.status(status).send({ msg });
    } else (next(err))
};

const handlePSQLErrors = (err, req, res, next) => {
    const codes = {
        '22P02': { status: 400, msg: 'Bad request' },
        '23502': { status: 400, msg: 'Bad request' },
        '23503': { status: 404, msg: 'Not found' }, 
    }
    if ((Object.keys(codes)).includes(err.code)) {
        const { status, msg } = codes[err.code];
        res.status(status).send({ msg });
    } else (next(err))
}

const handleUnknownErrors = (err, req, res, next) => {
    console.log(err)
}

module.exports = { handle404s, handle405s, handleErrors, handlePSQLErrors, handleUnknownErrors }
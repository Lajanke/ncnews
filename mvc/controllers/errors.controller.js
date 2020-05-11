const handle404s = (req, res, ) => {
    res.status(404).send({ msg: 'Path not found' });
}

const handle405s = (req, res) => {
    res.status(405).send({ msg: 'Method not allowed' });
}

const handleErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
      } else {
        next(err);
      };
};

const handlePSQLErrors = (err, req, res, next) => {
    const codes = {
        '22P02': { status: 400, msg: 'Bad request' },
        '23502': { status: 400, msg: 'Bad request' },
        '42703': { status: 400, msg: 'Bad request' },
        '23503': { status: 404, msg: 'Not found' }, 
    }
    if ((Object.keys(codes)).includes(err.code)) {
        const { status, msg } = codes[err.code];
        res.status(status).send({ msg });
    } else (next(err))
}

const handleUnknownErrors = (err, req, res, next) => {
    res.status(500).seng({ msg: 'Internal server error'});
}

module.exports = { handle404s, handle405s, handleErrors, handlePSQLErrors, handleUnknownErrors }
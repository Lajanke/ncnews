const handle404s = (req, res,) => {
    res.status(404).send({ msg: 'Path not found'})
}

const handle405s = (req, res) => {
    res.status(405).send({msg: 'Method not allowed'})
}

const handleErrors = (err, req, res, next) => {
    const codes =   { 'USER NOT FOUND': {status: 404, msg: 'User does not exist' }, }
    if ((Object.keys(codes)).includes(err.code)) {
        const { status, msg } = codes[err.code];
        res.status(status).send({msg});
    }; 
};

module.exports =  { handle404s, handle405s, handleErrors }
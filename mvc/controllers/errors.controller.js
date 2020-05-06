const handle404s = (req, res,) => {
    res.status(404).send({ msg: 'Path not found'})
}

const handle405s = (req, res) => {
    res.status(405).send({msg: 'Method not allowed'})
}

module.exports =  { handle404s, handle405s, }